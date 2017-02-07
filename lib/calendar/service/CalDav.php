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
require_once const_path_system.'calendar/service/iCal_(e.g._Google).php';
require_once const_path_system.'calendar/ICal/EventObject.php';

use ICal\ICal;

/**
 * This class reads a CalDav calendar
 */
class calendar_caldav extends calendar_ical
{

	var $events = array();

	/**
	 * Query CalDav
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
	 */
	private function get_calendar_urls($calbaseurl, $calnames) {
		// extract server root url
	  $calserver = parse_url($calbaseurl);
	  $calserver = $calserver['scheme']."://".$calserver['host'];

		// Get urls of my calendars
		// '?' masked by '\x3f' in first line to prevent confusing of syntax highlighters
		$xmlquery = <<<XML
<?xml version="1.0" encoding="utf-8" \x3f>
<A:propfind xmlns:A="DAV:">
	<A:prop>
		<A:displayname/>
	</A:prop>
</A:propfind>
XML;
		$caldavresponse = $this->get_caldav_data($calbaseurl, 'PROPFIND', $xmlquery);
		$xmlresponse = simplexml_load_string($caldavresponse, 'SimpleXMLElement', LIBXML_NOCDATA, 'd', true);

		$calurls = array();
		foreach($xmlresponse->response as $resp) {
			$displayname = strtolower($resp->propstat[0]->prop[0]->displayname);
			if($displayname == '')
				continue;
			// no calendar name passed in config nor in request, list all calendars
			if(count($calnames) == 1 && $calnames[0] == '') {
				$calurls[$displayname] = $calserver . $resp->href;
			}
			// calendar name(s) passed in config or request, filter by calendar(s)
			else {
				foreach($calnames as $calname) {
					$calname = strtolower(trim($calname));
					if($displayname == $calname) {
						$calurls[$displayname] = $calserver . $resp->href;
						continue 2;
					}
				}
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
		$xmlquery = <<<XML
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
XML;

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
		foreach ($calurls as $calname => $calurl)
		{
			$content = $this->get_calendar_data($calurl);
			
			if ($content === false) {
				$this->error('Calendar: CalDav', $calname.': Calendar read request failed!');
				continue;
			}
			
			// extract and parse ics data from CalDav response (= merged content of each <cal:calendar-data> node)
			$xml = simplexml_load_string($content, 'SimpleXMLElement', LIBXML_NOCDATA);
			$ical = new ICal();
			$caldata = $xml->xpath('//cal:calendar-data');
			foreach($caldata as $icscontent) {
				$ical->initString($icscontent);
			}
			$this->addFromIcs($ical, $calname);
/*
			// add events to output list
			foreach ($ical->events() as $event) {
				$this->addData(array(
					'start' => $ical->iCalDateToUnixTimestamp($event->dtstart),
					'end' => $ical->iCalDateToUnixTimestamp($event->dtend),
					'title' => $event->summary,
					'content' => str_replace("\\n", "\n", $event->description),
					'where' => $event->location,
					'calname' => $calname != '' ? $calname : $ical->calendarName(),
					'caldesc' => $ical->calendarDescription()
					//,'link' => ''
				));
			}
*/
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