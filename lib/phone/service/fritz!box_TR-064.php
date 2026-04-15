<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Stefan Vonbrunn, Wolfram v. Hülsen
 * @copyright   2014 - 2026
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


require_once '../../../lib/includes.php';
require_once const_path_system . 'phone/phone.php';
/**
 * This class reads the phonelist of a fritz!box phonesystem via TR-064 protocol
 * This can only work if you enable access for applications ("Zugriff für Anwendungen zulassen").
 * You can find the option inside the web console -> Home network -> Network -> Network Settings -> Extended Settings
 * Some services like "deviceinfo" require configuration rights for the user!
 *
 * A list of available services with SOAP and upnp details can be retrieved by calling http://<Fritz!Box IP>:49000/tr64desc.xml
 */
class phone_fritzbox_TR064 extends phone
{
    private $max_calls_to_fetch;
    private $challenge;
    private $call_list_url;
    private $context_ssl = array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    );

    public function __construct($http_vals)
    {
        parent::init($http_vals);
        // maximum number of records fetched from phonesystem.
        $this->max_calls_to_fetch = 20;
        // use some default user if only password is set on smartvisu
        if (\strlen($this->user) == 0 && strlen($this->pass) > 0)
            $this->user = 'admin';
        if (\strlen($this->port) == 0)
            $this->port = '49000';
    }
    /**
     * DoSOAPCall: issues a http post to the phone system on port 49000
     */
    private function DoSOAPCall($content, $control)
    {
        $header[] = 'Content-type: text/xml;charset="utf-8"\r\n';
        $header[] = 'SOAPAction: urn:dslforum-org:service:X_AVM-DE_OnTel:1#GetCallList';
        $header[] = \sprintf('Content-Length: %d', \strlen($content));
        $context  = array(
            'http' => array(
                'method' => 'POST',
                'header' => implode("\r\n", $header),
                'content' => $content
            ),
            'ssl' => $this->context_ssl
        );
        $protocol = ($this->port == '49443') ? 'https' : 'http';
        $baseurl = strpos($this->server, '://') === FALSE ? $protocol."://".$this->server : $this->server;
        $url      = $baseurl.":".$this->port."/upnp/control/x_contact";

        return (file_get_contents($url, false, stream_context_create($context)));
    }
    /**
     * InitChallenge: the phone systems responds to this SOAP message
     * always with "Unauthenticated" if a password is set
     * This is only used for getting the Nonce and Realm like :
     * <Nonce>A025059762AFE268</Nonce>  <Realm>F!Box SOAP-Auth</Realm>
     */
    private function InitChallenge()
    {
        // define soap message
        $soap_msg_InitChallenge = '
        <?xml version="1.0" encoding="utf-8"?>
        <s:Envelope s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"
        xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" >
        <s:Header><h:InitChallenge xmlns:h="http://soap-authentication.org/digest/2001/10/" s:mustUnderstand="1">
        <UserID>' . $this->user . '</UserID>
        </h:InitChallenge ></s:Header><s:Body><u:GetCallList xmlns:u="urn:dslforum-org:service:X_AVM-DE_OnTel:1">
        </u:GetCallList></s:Body></s:Envelope>';
        if (($response = $this->DoSOAPCall($soap_msg_InitChallenge, 'x_contact')) === FALSE)
            return FALSE;
        $this->debug($response, trans('phone_error_message', 'fritz_raw_challenge'));
        if (preg_match_all("(\<.+\>(.+)\<\/.+\>)U", $response, $this->challenge) === FALSE) {
            $this->error('Phone: fritz!box', trans('phone_error_message', 'fritz_soap_parse_error'));
        }
        $this->debug($this->challenge,trans('phone_error_message', 'fritz_parsed_challenge'));
    }
    /**
     * DoAuthSoapCall: executes a SOAP call for a specific service with actual credentials and delivers the result
     */
    private function DoAuthSoapCall($service, $action, $control)
    {
        //create authentication sting
        $Auth  = MD5(MD5($this->user . ':' . $this->challenge['1']['2'] . ':' . $this->pass) . ':' . $this->challenge['1']['1']);
        //create authenticated SOAP message
        $soap = '
            <?xml version="1.0" encoding="utf-8"?>
            <s:Envelope s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"
            xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" >
                <s:Header>
                    <h:ClientAuth xmlns:h="http://soap-authentication.org/digest/2001/10/" s:mustUnderstand="1">
                        <Nonce>' . $this->challenge['1']['1'] . '</Nonce>
                        <Auth>' . $Auth . '</Auth>
                        <UserID>' . $this->user . '</UserID>
                        <Realm>' . $this->challenge['1']['2'] . '</Realm>
                    </h:ClientAuth>
                </s:Header>
                <s:Body>
                    <u:' . $action . ' xmlns:u="' . $service . '" />
                </s:Body>
            </s:Envelope>';
        $this->debug($soap . '| Service: ' . $action . ' xmlns:u="' . $service, trans('phone_error_message', 'fritz_soap_exec') . '"');
            
        $protocol = ($this->port == '49443') ? 'https' : 'http';
        $baseurl = strpos($this->server, '://') === FALSE ? $protocol . "://" . $this->server : $this->server;
        $url = $baseurl . ":" . $this->port . "/upnp/control/".$control;

        $header = [
            'Content-type: text/xml; charset="utf-8"',
            'SOAPAction: '.$service.'#'.$action
        ];

        $context = [
            'http' => [
                'method' => 'POST',
                'header' => implode("\r\n", $header),
                'content' => $soap
            ],
            'ssl' => $this->context_ssl
        ];
        return (file_get_contents($url, false, stream_context_create($context)));
    }
    /**
     * GetCallListURL: Create a authentication hash and use that with the real request to get the callList URL
     */
    private function GetCallListURL()
    {
        $response = $this->DoAuthSOAPCall('urn:dslforum-org:service:X_AVM-DE_OnTel:1', 'GetCallList', 'x_contact');
        if ($response === FALSE)
            return FALSE;
        $this->debug($response, trans('phone_error_message', 'fritz_raw_calllist'));
        if (preg_match_all("(\<.+\>(.+)\<\/.+\>)U", $response, $response_parts) === FALSE) {
            $this->error('Phone: fritz!box', trans('phone_error_message', 'fritz_soap_parse_error'));
        }
        $this->debug($response_parts, trans('phone_error_message', 'fritz_match_calllist'));
        if (substr($response_parts['1']['3'], 0, 4) === 'http') {
            $this->call_list_url = $response_parts['1']['3'];
        } else {
            $this->error('Phone: fritz!box', trans('phone_error_message', 'fritz_calllist_error'));
            return FALSE;
        }
    }
    /**
     * TransformCallList: Download the callList limited by "calls_to_fetch" variable
     * and align the xml data to the standard format of smartvisu
     */
    private function TransformCallList()
    {
        // build download url
        $url = $this->call_list_url . '&max=' . $this->max_calls_to_fetch;
        $this->debug($url,trans('phone_error_message', 'fritz_calllist_url') );
        // download xml file and put it to xml parser
        $loadError = '';
        $GetCallListXml = file_get_contents($url, false, stream_context_create(array('ssl' => $this->context_ssl)));
        if (substr($this->errorMessage, 0, 17) == 'file_get_contents') {
            $loadError = substr(strrchr($this->errorMessage, ':'), 2);
            $this->error('Phone: fritz!box_TR-064', trans('phone_error_message', 'fritz_read_error').$loadError);
        }
        else {
            $simplexml = simplexml_load_string($GetCallListXml);
            $this->debug($GetCallListXml, "GetCallListXml");
            /*
            [Id] => 1767
            [Type] => 1
            [Caller] => 0175000000
            [Called] => Amt ISDN 123456789
            [Name] => Mustermann, Max
            [Numbertype] => isdn
            [Device] => Wohnzimmer
            [Port] => 10
            [Date] => 08.02.14 12:43
            [Duration] => 0:32
            */
            // map fritz box xml values to the smartvisu standard
            foreach ($simplexml->xpath('//Call') as $call) {
                // check if we got german date format and trans to ISO date
                //(smartvisu is using strtotime later on)
                if (preg_match("/[0-3]\d\.[0-1]\d\.\d{2}\s([0-1][0-9]|[2][0-3]):([0-5][0-9])/", $call->Date)) {
                    $date       = DateTime::createFromFormat('d.m.y H:i', $call->Date);
                    $call->Date = $date->format('Y-m-d H:i');
                }
                // bulid data array for smartvisu
                $this->data[] = array(
                    'pos' =>      (string) $call->Id,
                    'dir' =>      (string) ($call->Type == 10 ? 10 : 2 - $call->Type),
                    'date' =>     (string) $call->Date,
                    'number' =>   (string) $call->Caller,
                    'name' =>     (string) $call->Name,
                    'called' =>   (string) $call->Called,
                    'duration' => (string) $call->Duration
                );
                $call = '';
            }
        }
    }
    
    /**
     * GetUserInterfaceInfo: get some information on firmware status
     */
    private function GetUserInterfaceInfo()
    {
        $response = $this->DoAuthSoapCall('urn:dslforum-org:service:UserInterface:1', 'GetInfo', 'userif');
        $this->debug($response, trans('phone_error_message', 'fritz_raw_ui_info'));
        if ($response === FALSE) {
            return false;
        }

        $xml = simplexml_load_string(trim($response));

        // $xml is not an object but more like a search path we need to follow by crawling through the namespaces.
        // Otherwise the info will not be visible in the simplexml element.
        // As soon as we have reached GetInfoResponse, there is no namespace anymore. So we need to reset namespace to null.
        $ns = $xml->getNamespaces(true);
        $info = $xml->children($ns['s'])->Body -> children($ns['u'])->GetInfoResponse->children(null);

        $ret = [
            'updateAvailable'  => (int)$info->NewUpgradeAvailable,
            'passwordRequired' => (int)$info->NewPasswordRequired,
            'pwUserSelectable' => (int)$info->NewPasswordUserSelectable,
            'version'          => (string)$info->{'NewX_AVM-DE_Version'},
            'downloadURL'      => (string)$info->{'NewX_AVM-DE_DownloadURL'},
            'infoURL'          => (string)$info->{'NewX_AVM-DE_InfoURL'},
            'updateState'      => (string)$info->{'NewX_AVM-DE_UpdateState'},
            'buildType'        => (string)$info->{'NewX_AVM-DE_BuildType'},
            'setupAssiStatus'  => (int)$info->{'NewX_AVM-DE_SetupAssistantStatus'}
            ];

        $this->debug($ret, trans('phone_error_message', 'fritz_parsed_ui_info')); 
        return $ret;
    }

   /**
     * GetDeviceInfo: get some device information (reqires configuration rights for the user)
     */
    private function GetDeviceInfo()
    {
        $response = $this->DoAuthSoapCall('urn:dslforum-org:service:DeviceInfo:1', 'GetInfo', 'deviceinfo');
        $this->debug($response, trans('phone_error_message', 'fritz_raw_device_info'));

        if ($response === FALSE) {
            $this -> error('Phone: fritz!box', trans('phone_error_message', 'fritz_deviceinfo_error'));
            return false;
        }
        $xml = simplexml_load_string(trim($response));

        // $xml is not an object but more like a search path we need to follow by crawling through the namespaces.
        // Otherwise the info will not be visible in the simplexml element.
        // As soon as we have reached GetInfoResponse, there is no namespace anymore. So we need to reset namespace to null.
        $ns = $xml->getNamespaces(true);
        $info = $xml->children($ns['s'])->Body -> children($ns['u'])->GetInfoResponse->children(null);
 
        $ret = [
            'manufacturerName' => (string)$info->NewManufacturerName,
            'manufacturerOUI'  => (string)$info->NewManufacturerOUI,
            'modelName'        => (string)$info->NewModelName,
            'description'      => (string)$info->NewDescription,
            'productClass'     => (string)$info->NewProductClass,
            'serialNumber'     => (string)$info->NewSerialNumber,
            'softwareVersion'  => (string)$info->NewSoftwareVersion,
            'hardwareVersion'  => (string)$info->NewHardwareVersion,
            'specVersion'      => (string)$info->NewSpecVersion,
            'provisioningCode' => (string)$info->NewProvisioningCode,
            'upTime'           => (int)$info->NewUpTime,
            // convert time format in log entries
            'deviceLog'        => preg_replace('/(\d{2}).(\d{2}).(\d{2})\s(\d{2}:\d{2}:\d{2})/', '20$3-$2-$1 $4', (string)$info->NewDeviceLog)
            ];
            $this->debug($ret, trans('phone_error_message', 'fritz_parsed_device_info'));
        return $ret;
    }


    public function run()
    {
        //$this->debug( 'smartvisu settings Server:"'.$this->server.'" User:"'.$this->user.'" Password:"'.$this->pass.'"' );
        // try to get Realm and Nonce from Box - this is required for login
        if ($this->InitChallenge() === FALSE) {
            $this->error('Phone: fritz!box', trans('phone_error_message', 'fritz_connect_error'));
            return FALSE;
        } 
        
        switch ($this->action) {
            case 'calllist': 
                // if no password is set - InitChallenge returns CallList URL directly
                if (substr($this->challenge['1']['0'], 0, 4) == 'http') {
                    $this->call_list_url = $this->challenge['1']['0'];
                    // get xml call data and transform to smartvisu format
                    $this->TransformCallList();
                } else {
                    // login and gather login url
                    if ($this->GetCallListURL() !== FALSE) {
                        // get xml call data and transform to smartvisu format
                        $this->TransformCallList();
                    }
                }
                break;
            case 'update':
                // check firmware 
                $info = $this->GetUserInterfaceInfo();
                if ($info !== false) {
                    $this->data['update'] = $info;
                }
                break;
            case 'deviceinfo':
                $info = $this->GetDeviceInfo();
                if ($info !== false) {
                    $this->data['deviceinfo'] = $info;
                }
                break;
            default: 
                $this->error('Phone: fritz!box', trans('phone_error_message', 'fritz_invalid_action') . $this->action);
                break;
        }
        // cleanup
        $this->challenge     = '';
        $this->call_list_url = '';
    }
} // class end

// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------
$service = new phone_fritzbox_TR064(array_merge($_GET, $_POST));
echo $service->json();
?>
