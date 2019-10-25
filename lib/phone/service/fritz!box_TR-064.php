<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Stefan Vonbrunn
 * @copyright   2014 - 2018
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


require_once '../../../lib/includes.php';
require_once const_path_system . 'phone/phone.php';
/**
 * This class reads the phonelist of an fritz!box phonesystem via TR-064 protocol
 * This can only work if you enable "Zugriff für Anwendungen zulassen".
 * you can found this config switch inside the web console -> Home network -> Network -> Network Settings
 * It is required that "Extented View" of the web console is enabled - that this checkbox is shown.
 * 
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
        if (strlen($this->user) == 0 && strlen($this->pass) > 0)
            $this->user = 'admin';
        if (strlen($this->port) == 0)
            $this->port = '49000';
    }
    /**
     * DoSOAPCall: issues a http post to the phone system on port 49000
     */
    private function DoSOAPCall($content)
    {
        $header[] = 'Content-type: text/xml;charset="utf-8"\r\n';
        $header[] = 'SOAPAction: urn:dslforum-org:service:X_AVM-DE_OnTel:1#GetCallList';
        $header[] = sprintf('Content-Length: %d', strlen($content));
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
        if (($response = $this->DoSOAPCall($soap_msg_InitChallenge)) === FALSE)
            return FALSE;
        $this->debug($response, "Fritz RAW response InitChallenge (Unauthenticated is OK at this point!)");
        if (preg_match_all("(\<.+\>(.+)\<\/.+\>)U", $response, $this->challenge) === FALSE) {
            $this->error('Phone: fritz!box', 'SOAP Challenge parsing error!');
        }
        $this->debug($this->challenge, "preg_matched InitChallenge (Unauthenticated is OK at this point!)");
    }
    /**
     * GetCallListURL: Create a authentication hash and use that with the real request to get the callList URL  
     */
    private function GetCallListURL()
    {
        //create authentication sting 
        $Auth  = MD5(MD5($this->user . ':' . $this->challenge['1']['2'] . ':' . $this->pass) . ':' . $this->challenge['1']['1']);
        // define soap message
        $soap_msg_GetCallList = '
        <?xml version="1.0" encoding="utf-8"?>
        <s:Envelope s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" 
        xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" >
        <s:Header><h:ClientAuth xmlns:h="http://soap-authentication.org/digest/2001/10/" s:mustUnderstand="1">
        <Nonce>' . $this->challenge['1']['1'] . '</Nonce>
        <Auth>' . $Auth . '</Auth>
        <UserID>' . $this->user . '</UserID>
        <Realm>' . $this->challenge['1']['2'] . '</Realm>
        </h:ClientAuth></s:Header>
        <s:Body><u:GetCallList xmlns:u="urn:dslforum-org:service:X_AVM-DE_OnTel:1"></u:GetCallList></s:Body>
        </s:Envelope>';
        $this->debug($soap_msg_GetCallList, "send GetCallList");
        $response = $this->DoSOAPCall($soap_msg_GetCallList);
        if (($response = $this->DoSOAPCall($soap_msg_GetCallList)) === FALSE)
            return FALSE;
        $this->debug($response, "Fritz RAW response GetCallListURL");
        if (preg_match_all("(\<.+\>(.+)\<\/.+\>)U", $response, $response_parts) === FALSE) {
            $this->error('Phone: fritz!box', 'SOAP parsing error!');
        }
        $this->debug($response_parts, "preg_matched GetCallListURL");
        if (substr($response_parts['1']['3'], 0, 4) === 'http') {
            $this->call_list_url = $response_parts['1']['3'];
        } else {
            $this->error('Phone: fritz!box', 'GetCallList / Login failed!');
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
        $this->debug($url, "URL for call_list");
        // download xml file and put it to xml parser
        $GetCallListXml = file_get_contents($url, false, stream_context_create(array('ssl' => $self->context_ssl)));
        $simplexml      = simplexml_load_string($GetCallListXml);
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
        // map fritz box xml values to the smartvisu standart        
        foreach ($simplexml->xpath('//Call') as $call) {
            // check if we got german date format and translate to ISO date 
            //(smartvisu is using strtotime later on)
            if (preg_match("/[0-3]\d\.[0-1]\d\.\d{2}\s([0-1][0-9]|[2][0-3]):([0-5][0-9])/", $call->Date)) {
                $date       = DateTime::createFromFormat('d.m.y H:i', $call->Date);
                $call->Date = $date->format('Y-m-d H:i');
            }
            // bulid data array for smartvisu
            $this->data[] = array(
                'pos' =>      (string) $call->Id,
                'dir' =>      (string) ($call->Type == 1 ? 1 : ($call->Type == 2 ? 0 : -1)),
                'date' =>     (string) $call->Date,
                'number' =>   (string) $call->Caller,
                'name' =>     (string) $call->Name,
                'called' =>   (string) $call->Called,
                'duration' => (string) $call->Duration
            );
            $call = '';
        }
    }
    public function run()
    {
        //$this->debug( 'smartvisu settings Server:"'.$this->server.'" User:"'.$this->user.'" Password:"'.$this->pass.'"' );
        // try to get Realm and Nonce from Box - this is required for login
        if ($this->InitChallenge() === FALSE) {
            $this->error('Phone: fritz!box', 'Error Connecting - check IP Address and TR-064 setting');
            return FALSE;
            // when no password is set - InitChallenge returns CallList URL    directly    
        } elseif (substr($this->challenge['1']['0'], 0, 4) == 'http') {
            $this->call_list_url = $this->challenge['1']['0'];
            $this->TransformCallList();
            // login and gather login url
        } else {
            if ($this->GetCallListURL() !== FALSE) {
                // get xml call data and transform to smartvisu format
                $this->TransformCallList();
            }
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