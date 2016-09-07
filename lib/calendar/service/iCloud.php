<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Serge Wagener (Foxi352)
 * @copyright   2014
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


// needs: php5-curl
require_once '../../../lib/includes.php';
require_once const_path_system.'class_cache.php';
require_once const_path_system.'calendar/calendar.php';
require_once const_path_system.'calendar/iCalReader.php';


/**
 * This class reads an iCloud calendar
 */
class calendar_icloud extends calendar
{
    
    var $username;
    var $password;
    var $calendar;
    var $server;
    var $url;

	/**
	 * initialization of some parameters
	 */
	public function init($request)
	{
		parent::init($request);
		$this->username = config_calendar_username;
		$this->password = config_calendar_password;
		$this->calendar = config_calendar_name;
		$this->server = 'https://p01-caldav.icloud.com';
	}

	/**
	 * Main query function
	 */
	public function run() {  	
        $cache = new class_cache('calendar_'.$this->username.'_'.$this->calendar);	
		if ($cache->hit())
			$this->url = $cache->read();
		else
			$this->url = $this->_getCalendarPath();

		$cache->write($this->url);
        
        $start = date('Ymd\THis\Z');
		$end = date('Ymd\T235959\Z', strtotime("+13 days"));
		
		$xml = $this->_getEvents($path, $start, $end);
		$events_object = simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA);
		$events = @json_decode(@json_encode($events_object),1);

        // get first x events if exist, else return empty array
		if (is_array($events) && count($events) > 0) {
		    if (is_array($events['response']) && count($events['response']) > 0) {
			    $events = $events['response'];
			} else {
			    $events = [];
			}
		} else {
		    $events = [];
		}

		// convert to ICS
		$ics_content = '';
		foreach($events as $event) {
			if (isset($event['propstat']['prop']['calendar-data'])) {
				$ics_content .= $event['propstat']['prop']['calendar-data'];
			}
		}
	
	    $events = [];
	    // process ICS
		if (!empty($ics_content)) {
			$ics_content = explode("\n", $ics_content);
			$ics = new ICal($ics_content);
			$ics->process_recurrences();
			$events = $ics->sortEventsWithOrder($ics->events(), SORT_ASC);
			$events = array_slice($events, 0, $this->count);
    		// output events as list
    		$i = 1;
    		foreach ($events as $event) {
    			$this->data[] = array('pos' => $i++,
    				'start' => date('y-m-d', $ics->iCalDateToUnixTimestamp($event['DTSTART'])).' '.gmdate('H:i:s', $ics->iCalDateToUnixTimestamp($event['DTSTART'])),
    				'end' => date('y-m-d', $ics->iCalDateToUnixTimestamp($event['DTEND'])).' '.gmdate('H:i:s', $ics->iCalDateToUnixTimestamp($event['DTEND'])),
    				'title' => $event['SUMMARY'],
    				'content' => '',
    				'where' => str_replace(array("\n\r", "\n", "\r", "\\"), "<br />", $event['LOCATION']),
    				'link' => 'https://www.icloud.com/#calendar'
    			);
    			
    		}
		}
	}
	
	/**
	 * Execute iCloud request
	 */
	private function _do_iCloud_Request($type, $xml) {
		// prepare request
		$request=curl_init($this->url);
		curl_setopt($request, CURLOPT_HTTPHEADER, array("Depth: 1", "Content-Type: text/xml; charset='UTF-8'", "User-Agent: DAVKit/4.0.1 (730); CalendarStore/4.0.1 (973); iCal/4.0.1 (1374); Mac OS X/10.6.2 (10C540)"));
		curl_setopt($request, CURLOPT_HEADER, 0);
		curl_setopt($request, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
		curl_setopt($request, CURLOPT_USERPWD, $this->username.":".$this->password);
		curl_setopt($request, CURLOPT_CUSTOMREQUEST, $type);
		curl_setopt($request, CURLOPT_POSTFIELDS, $xml);
		curl_setopt($request, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($request, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($request, CURLOPT_SSL_VERIFYPEER, 0);
		
		// execute request and return answer
		$response = curl_exec($request);
		curl_close($request);
		return $response;
	}


	/**
	 * Get UserID and path to calendar from iCloud
	 */
	private function _getCalendarPath() {
	    print("user: ".$this->username." pw: ".$this->password." server: ".$this->server."\n");
		// Get my iCloud userID
		$this->url = $this->server;
		$request = "<A:propfind xmlns:A='DAV:'><A:prop><A:current-user-principal/></A:prop></A:propfind>";
		$response = simplexml_load_string($this->_do_iCloud_Request("PROPFIND", $request));
		$principal_url = $response->response[0]->propstat[0]->prop[0]->{'current-user-principal'}->href;
		$userID = explode("/", $principal_url);
		$userID = $userID[1];

		// Get list of calendars
		$this->url = $this->server."/".$userID."/calendars/";
		$request="<A:propfind xmlns:A='DAV:'><A:prop><A:displayname/></A:prop></A:propfind>";
		$response = simplexml_load_string($this->_do_iCloud_Request("PROPFIND", $request));
		
		$path = '';

		// Search wanted calendar
		foreach($response->response as $resp)
		{
			if($resp->propstat[0]->prop[0]->displayname == $this->calendar) 
			{
				$path = $resp->href;
				break;
			}
		}
		
		if(empty($path)) 
			$this->error('Calendar: iCloud', 'Calendar '.$requestalendar.' not found!');
		return $this->server.$path;
	}
	
	private function _getEvents($url, $startdate, $enddate) {
		$xml_request  = '<?xml version="1.0" encoding="utf-8" ?>';
		$xml_request .= '<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">';
		$xml_request .= '<d:prop><c:calendar-data /></d:prop>';
		$xml_request .= '<c:filter><c:comp-filter name="VCALENDAR"><c:comp-filter name="VEVENT"><c:time-range start="'.$startdate.'" end="'.$enddate.'"/></c:comp-filter></c:comp-filter></c:filter>';
		$xml_request .= '</c:calendar-query>';

		$events = $this->_do_iCloud_Request("REPORT", $xml_request);
		return $events;
	}

}

// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new calendar_icloud(array_merge($_GET, $_POST));
echo $service->json();

?>

