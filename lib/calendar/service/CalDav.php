<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Johannes Willnecker, Sebastian Helms, Serge Wagener, Stefan Widmer
 * @copyright   2015-2017
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
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
	private function get_caldav_data($url, $method, $xmlquery)
	{
/*
		$ctxopts = array('http' =>
			array(
				'method' => $method,
				'header' => "Depth: 1\r\n",
										"Content-Type: application/xml\r\n",
				'content' => $xmlquery
			)
		);
		if(config_calendar_username != '' && config_calendar_password != '') {
	    $ctxopts['header'][] = "Authorization: Basic " . base64_encode(config_calendar_username.':'.config_calendar_password) . "\r\n";
		$context = stream_context_create($ctxopts);

		$content = file_get_contents($url, false, $context);
/**/
/**/
		$request=curl_init($url);
		curl_setopt($request, CURLOPT_HTTPHEADER, array("Depth: 1", "Content-Type: text/xml; charset='UTF-8'"));
		curl_setopt($request, CURLOPT_HEADER, 0);
		if(config_calendar_username != '' && config_calendar_password != '') {
			curl_setopt($request, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
			curl_setopt($request, CURLOPT_USERPWD, config_calendar_username.":".config_calendar_password);
		}
		curl_setopt($request, CURLOPT_CUSTOMREQUEST, $method);
		curl_setopt($request, CURLOPT_POSTFIELDS, $xmlquery);
		curl_setopt($request, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($request, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($request, CURLOPT_SSL_VERIFYPEER, 0);

		// execute request and return answer
		$content = curl_exec($request);
		curl_close($request);
/**/
		return $content;
	}

	/**
	 * Get URLs of calendars
	 *
	 * @param $davbaseurl may be the url of WebDav root (e.g. https://server/dav/), of a principal (e.g. https://server/dav/principals/users/USER/) or of user's calendar home (e.g. https://server/caldav/USER/calendars/)
	 * @param $calnames array of calendar display names to load. if null or an array containing one empty string is passed, all calendars will be loaded
	 */
	private function get_calendar_urls($davbaseurl, $calnames = array('')) {
		// extract server root url
	  $calserver = parse_url($davbaseurl);
	  $calserver = $calserver['scheme']."://".$calserver['host'];

		// Get user pricipal
		$xmlquery = '<D:propfind xmlns:D="DAV:"><D:prop><D:current-user-principal/></D:prop></D:propfind>';
		$caldavresponse = $this->get_caldav_data($davbaseurl, "PROPFIND", $xmlquery);
		//echo($caldavresponse);
		$xml = simplexml_load_string($caldavresponse, null, null, 'DAV:');
		$principle_url = $xml->response->propstat->prop->{'current-user-principal'}->href;
//echo($principle_url);
		// use configured url if no current-user-principal returned
		if($principle_url == "")
      $principle_url = $davbaseurl;

		/// Get home url of user's calendars
		$xmlquery = '<D:propfind xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav"><D:prop><C:calendar-home-set/></D:prop></D:propfind>';
		$caldavresponse = $this->get_caldav_data($calserver . $principle_url, "PROPFIND", $xmlquery);
//echo($caldavresponse);
		$xml = simplexml_load_string($caldavresponse, null, null, 'DAV:');
		$calendar_home_url = $xml->response->propstat->prop->children('urn:ietf:params:xml:ns:caldav')->{'calendar-home-set'}->children('DAV:')->href;
//echo($calendar_home_url);
		// use configured url if no calendar-home-set returned
		if($calendar_home_url == "")
      $calendar_home_url = $davbaseurl;

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
		$caldavresponse = $this->get_caldav_data($calserver . $calendar_home_url, 'PROPFIND', $xmlquery);
//echo $caldavresponse;
		$xml = simplexml_load_string($caldavresponse, null, null, 'DAV:');

		$calurls = array();
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
			// add only requested (by URL parameter or configuration) calendars or all, if none requested
			if(in_array($displayname, $calnames) || $calnames === array('')) {
				$description = $response->propstat->prop->children('urn:ietf:params:xml:ns:caldav')->calendar-description;
				$color = $response->propstat->prop->children('http://apple.com/ns/ical/')->{'calendar-color'};
				$calurls[$calserver . $response->href] = array(
					'calendarname' => $displayname,
					'calendarcolor' => $color != false ? (string)$color : null,
					'calendardesc' => $description != false ? (string)$description : null
				);
			}
		}

		return $calurls;
	}

	/**
	 * Get data of a calendar
	 */
	private function get_calendar_data($calurl)
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

		return $this->get_caldav_data($calurl, 'REPORT', $xmlquery);
	}

	/**
	 * Run service, return events
	 */
	public function run()
	{
		/* Example URLs:
		nextcloud: http://server.org/owncloud/remote.php/caldav/calendars/{user}/
		iCloud: 'https://p01-caldav.icloud.com/{user}/calendars/
		*/
		$calbaseurl = str_replace('{user}', config_calendar_username, config_calendar_url);
		$calnames = $this->calendar_names;
		$calurls = $this->get_calendar_urls($calbaseurl, $calnames);
		
		// get plain ics
		foreach ($calurls as $calurl => $calmetadata)
		{
			$caldata = $this->get_calendar_data($calurl);
//echo $caldata, "\n\n";

			if ($caldata === false) {
				$this->error('Calendar: CalDav', $calmetadata['calendarname'].': Calendar read request failed!');
				continue;
			}
			// extract and parse ics data from CalDav response (= merged content of each <cal:calendar-data> node)
			$ical = new ICal();
			$xml = simplexml_load_string($caldata, null, LIBXML_NOCDATA);
      $xml->registerXPathNamespace('C', 'urn:ietf:params:xml:ns:caldav');
			$caldata = $xml->xpath('//C:calendar-data');
			foreach($caldata as $icscontent) {
				$ical->initString($icscontent);
			}
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