<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Johannes Willnecker, Sebastian Helms, Serge Wagener, Stefan Widmer, Wolfram v. Hülsen
 * @copyright   2015-2024
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @label       CalDav (e.g. ownCloud, Nextcloud, ...)
 * @hide        calendar_google_refresh_token
 */


require_once '../../../lib/includes.php';
require_once const_path_system.'calendar/calendar.php';

use ICal\ICal;

/**
 * This class reads a CalDav calendar
 */
class calendar_caldav extends calendar
{

	/**
	 * Helper function to query CalDav
	 */
	private function get_caldav_data($url, $method, $xmlquery, $depth = 0, $digest = 0)
	{
		$loadError = '';

		if ($digest == 1) {
			$ch = curl_init();
			
			// if calendar is in debug mode write cURL messages to a logfile
			if ($this->debug) {
				$fp = fopen(const_path.'/temp/curllog.txt', 'w');
				curl_Setopt($ch, CURLOPT_STDERR, $fp);
			}
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_Setopt($ch, CURLOPT_VERBOSE, 1);
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
			curl_setopt($ch, CURLOPT_HTTPHEADER, array(
				"Depth: ".$depth,
				"Content-Type: text/xml; charset='UTF-8'",
				"User-Agent: DAVKit/4.0.1 (730); CalendarStore/4.0.1 (973); iCal/4.0.1 (1374)"
			));
			curl_setopt($ch, CURLOPT_POSTFIELDS, $xmlquery);

			// Setting for Digest Authentication (CURLAUTH_DIGEST) does not work with Baikal / Sabre Dav -> use CURLAUTH_ANY
			curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
			curl_setopt($ch, CURLOPT_USERPWD, config_calendar_username . ":" . config_calendar_password);

			$caldavresponse = curl_exec($ch);

			if ($caldavresponse === false) {
				$loadError = curl_error($ch);
				$this->error('Calendar: CalDav', 'Read request to "'.$url.'" failed with message: "'.$loadError.'"');
				echo $this->json();
				curl_close($ch);
				exit;
			}
			curl_close($ch);
			if ($this->debug)
				fclose($fp);
		
		} else {
			$ctxopts = array('http' =>
				array(
					'method' => $method,
					'header' => "Depth: ".$depth.
						"\r\nContent-Type: text/xml; charset='UTF-8'".
						"\r\nUser-Agent: DAVKit/4.0.1 (730); CalendarStore/4.0.1 (973); iCal/4.0.1 (1374)",
					'content' => $xmlquery
				)
			);
			if(config_calendar_username != '' && config_calendar_password != '')
				$ctxopts['http']['header'] .= "\r\nAuthorization: Basic " . base64_encode(config_calendar_username.':'.config_calendar_password);

			$context = stream_context_create($ctxopts);
			$caldavresponse = file_get_contents($url, false, $context);

			if ($caldavresponse === false) {
				if (substr($this->errorMessage, 0, 17) == 'file_get_contents')
					$loadError = substr(strrchr($this->errorMessage, ':'), 2);
				elseif (!empty($http_response_header)) 
					$loadError = $http_response_header[0];
				$this->error('Calendar: CalDav', 'Read request to "'.$url.'" failed with message: "'.$loadError.'"');
				if (!empty($http_response_header))
					$this->debug(implode("\n", $http_response_header));
				echo $this->json();
				exit;
			}
		}

		$xml = simplexml_load_string($caldavresponse, null, LIBXML_NOCDATA, 'DAV:');
		return $xml;
	}

	/**
	 * Get URLs of calendars
	 *
	 * @param $davbaseurl may be the url of WebDav root (e.g. https://server/dav/), of a principal (e.g. https://server/dav/principals/users/USER/) or of user's calendar home (e.g. https://server/caldav/USER/calendars/)
	 * @param $calnames array of calendar display names to load. if null or an array containing one empty string is passed, all calendars will be loaded
	 */
	private function get_calendar_urls($davbaseurl, $calnames = array(''), $digest = 0) {
		// extract server root url
		$urlparsed = parse_url($davbaseurl);
		$calserver = (isset($urlparsed['scheme']) ? $urlparsed['scheme'] : 'https') . '://' . (isset($urlparsed['host']) ? $urlparsed['host'] : '') . (isset($urlparsed['port']) ? ':'.$urlparsed['port'] : '');

		// Get user principal
		$xmlquery = '<D:propfind xmlns:D="DAV:"><D:prop><D:current-user-principal/></D:prop></D:propfind>';
		$xml = $this->get_caldav_data($davbaseurl, "PROPFIND", $xmlquery, 0, $digest);
		$principal_url = (!$xml ? "" : $xml->response->propstat->prop->{'current-user-principal'}->href);
		$this->debug((string)$principal_url, 'principal_url');
		// use configured url if no current-user-principal returned
		if($principal_url == "")
			$principal_url = $davbaseurl;
		else if(strpos($principal_url, '://') === false)
			$principal_url = $calserver . $principal_url;

		$urlparsed = parse_url($principal_url);
		$calserver = (isset($urlparsed['scheme']) ? $urlparsed['scheme'] : 'https') . '://' . (isset($urlparsed['host']) ? $urlparsed['host'] : '') . (isset($urlparsed['port']) ? ':'.$urlparsed['port'] : '');

		// Get home url of user's calendars
		$xmlquery = '<D:propfind xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav"><D:prop><C:calendar-home-set/></D:prop></D:propfind>';
		$xml = $this->get_caldav_data($principal_url, "PROPFIND", $xmlquery, 0, $digest);
		$calendar_home_url = (!$xml ? "" : $xml->response->propstat->prop->children('urn:ietf:params:xml:ns:caldav')->{'calendar-home-set'}->children('DAV:')->href);
		$this->debug((string)$calendar_home_url, 'calendar_home_url');
		// use configured url if no calendar-home-set returned
		if($calendar_home_url == "")
			$calendar_home_url = $davbaseurl;
		else if(strpos($calendar_home_url, '://') === false)
			$calendar_home_url = $calserver . $calendar_home_url;

		$urlparsed = parse_url($calendar_home_url);
		$calserver = (isset($urlparsed['scheme']) ? $urlparsed['scheme'] : 'https') . '://' . (isset($urlparsed['host']) ? $urlparsed['host'] : '') . (isset($urlparsed['port']) ? ':'.$urlparsed['port'] : '');
		// Get calendars
		// '?' masked by '\x3f' in first line to prevent confusing of syntax highlighters
		$xmlquery = <<<XMLQUERY
<?xml version="1.0" encoding="utf-8" \x3f>
<D:propfind xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav" xmlns:I="http://apple.com/ns/ical/" >
	<D:prop>
	<D:resourcetype/>
		<D:displayname/>
	<C:calendar-timezone/>
	<C:supported-calendar-component-set />
	<C:calendar-description/>
		<I:calendar-color/>
	</D:prop>
</D:propfind>
XMLQUERY;
		$xml = $this->get_caldav_data($calendar_home_url, 'PROPFIND', $xmlquery, 1, $digest);

		$calurls = array();
		if ($xml != false){ 
			foreach($xml->response as $response) {
				// check if response is a calendar
				if(!isset($response->propstat->prop->resourcetype->children('urn:ietf:params:xml:ns:caldav')->calendar))
					continue;

				/*
				// check if response may have VEVENT components
				//response sample: c:supported-calendar-component-set><c:comp name="VEVENT" /><c:comp name="VTODO" /></c:supported-calendar-component-set>
				if(!isset($response->propstat[0]->prop[0]->children('urn:ietf:params:xml:ns:caldav')->{'supported-calendar-component-set'})
					continue;
				*/
				$displayname = strtolower($response->propstat->prop->displayname);
				$this->debug((string)$response->href, 'calendar_url of \''.$displayname.'\'');
				// add only requested (by URL parameter or configuration) calendars or all, if none requested
				if(\in_array($displayname, $calnames) || $calnames === array('')) {
					$description = $response->propstat->prop->children('urn:ietf:params:xml:ns:caldav')->{'calendar-description'};
					$color = $response->propstat->prop->children('http://apple.com/ns/ical/')->{'calendar-color'};
					$calendar_url = $response->href;
					if(strpos($calendar_url, '://') === false)
						$calendar_url = $calserver . $calendar_url;
					$calurls[$calendar_url] = array(
						'calendarname' => $displayname,
						'calendarcolor' => $color != false ? (string)$color : null,
						'calendardesc' => $description != false ? (string)$description : null
					);
				}
			}
		}
		if (!$xml || empty($calurls)) {
			$calError = $this->errorMessage.'".<br><br>Calendar URLs could not be identified in remote answer.<br><br>Try using ICS calendar service';
			$this->error('Calendar: CalDav', 'Read request failed with message: "'.$calError );
		}
		return $calurls;
	}

	/**
	 * Get data of a calendar
	 */
	private function get_calendar_data($calurl, $digest = 0)
	{
		$calStart = gmdate("Ymd\THis\Z");
		$calEnd = gmdate("Ymd\THis\Z", strtotime("+4 weeks"));

		// '?' masked by '\x3f' in first line to prevent confusing of syntax highlighters
		$xmlquery = <<<XMLQUERY
<?xml version="1.0" encoding="utf-8" \x3f>
<C:calendar-query xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
	<D:prop>
		<C:calendar-data>
			<C:expand start="$calStart" end="$calEnd"/>
		</C:calendar-data>
	</D:prop>
	<C:filter>
		<C:comp-filter name="VCALENDAR">
			<C:comp-filter name="VEVENT">
				<C:time-range start="$calStart" end="$calEnd"/>
			</C:comp-filter>
		</C:comp-filter>
	</C:filter>
</C:calendar-query>
XMLQUERY;

		return $this->get_caldav_data($calurl, 'REPORT', $xmlquery, 1, $digest);
	}

	/**
	 * Run service, return events
	 */
	public function run()
	{
		/* Example URLs:
		for nextcloud one of these:
		- https://server.org/owncloud/remote.php/dav/ (DAV base URL)
		- https://server.org//owncloud/remote.php/dav/principals/users/{user}/ (prinicipal URL)
		- https://server.org/owncloud/remote.php/caldav/calendars/{user}/ (calendar home URL)
		for iCloud one of these:
		- https://p01-caldav.icloud.com/
		- https://p01-caldav.icloud.com/{user}/calendars/
		*/
		$calbaseurl = str_replace('{user}', config_calendar_username, $this->url);

		// Check required authentification method
		$digest = 0;
		$wwwAuthHeader = get_headers($calbaseurl, true);
		if (isset($wwwAuthHeader['WWW-Authenticate']) && substr($wwwAuthHeader['WWW-Authenticate'], 0, 6 ) == "Digest" )
			$digest = 1;

		$this->debug( $digest == 1 ? 'Digest Auth' : 'Basic Auth', 'Authentication Method of Base URL');
		// var_dump(get_headers($calbaseurl, true));

		$calurls = $this->get_calendar_urls($calbaseurl, $this->calendar_names, $digest);

		// get plain ics
		foreach ($calurls as $calurl => $calmetadata)
		{
			$xml = $this->get_calendar_data($calurl, $digest);
			// extract and parse ics data from CalDav response (= merged content of each <cal:calendar-data> node)
			$ical = new ICal();
			$xml->registerXPathNamespace('C', 'urn:ietf:params:xml:ns:caldav');
			$caldata = $xml->xpath('//C:calendar-data');
			$this->debug(implode("\n", $caldata), "ICS Data of '".$calurl."'");
			$ical->initString(implode("\n",$caldata));
			$this->addFromIcs($ical, $calmetadata);
		}
	}

}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------
if (realpath(__FILE__) == realpath($_SERVER['DOCUMENT_ROOT'].$_SERVER['SCRIPT_NAME'])) {
	header('Content-Type: application/json');
	$service = new calendar_caldav(array_merge($_GET, $_POST));
	echo $service->json();
}
?>
