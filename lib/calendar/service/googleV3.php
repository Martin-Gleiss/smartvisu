<?php
/**
 * -----------------------------------------------------------------------------
 * @package	 smartVISU
 * @author	  Martin Gleiß (basic version), Carsten Gotschlich (google API V3), Thorsten Moll (cache, multiple calendars), Stefan Widmer (refactoring, made configurable)
 * @copyright   2012 - 2017
 * @license	 GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @label       Google API
 * @hide        calendar_username
 * @hide        calendar_password
 * @hide        calendar_url
 */

require_once '../../../lib/includes.php';
require_once const_path_system.'calendar/calendar.php';
require_once const_path_system.'class_cache.php';

/**
 * This class reads a google calendar
 */
class calendar_google extends calendar
{
	var $cachename;

var $time;

	/**
	 * initialization of some parameters
	 */
	public function init($request)
	{
		parent::init($request);
    $this->cachename = 'gcache-'.hash('sha256', config_calendar_google_refresh_token);
	}

	public function run()
	{
		$cache = new class_cache($this->cachename.'.json');
		// check for cached data
		if ($cache->hit(60))
			$cache_content = json_decode($cache->read(), true);

$this->time = microtime(true);

		//---------------------------------------------------------------------
		// get the access-token
		// try to read from cookie
		$token = json_decode($_COOKIE[$this->cachename]);
		if (!isset($token) || $token->expires < time()) {
			$resturl = 'https://accounts.google.com/o/oauth2/token';
			$token_context = stream_context_create(array(
				'http' => array(
					'method' => 'POST',
					'content' => http_build_query(array(
						'grant_type' => 'refresh_token',
						'client_id' => config_calendar_google_client_id,
						'client_secret' => config_calendar_google_client_secret,
						'refresh_token' => config_calendar_google_refresh_token
					))
				)
			));

			$content = file_get_contents($resturl, false, $token_context);
$this->debug($content, 'accessToken');
			$token = json_decode($content);

			// cache in cookie
			$token->expires = time() + $token->{'expires_in'} - 10;
      setcookie($this->cachename, json_encode($token), 0, null, null, false, true);

$this->debug('accessToken: '.number_format(microtime(true) - $this->time, 3));
$this->time = microtime(true);

		}

		//---------------------------------------------------------------------
		// so now we have an access-token, let's use it to access the calendar
		$context = stream_context_create(array(
			'http' => array(
				'method' => "GET",
				'header' => "Authorization: " . $token->{'token_type'} . " " . $token->{'access_token'}
			)
		));
				// . "\r\nAccept-Encoding: gzip,deflate\r\nUser-Agent: smartVISU (gzip)"

		// first let's retrieve the colors and cache them
		if (!isset($cache_content['calendarColors'])) {
			$resturl = 'https://www.googleapis.com/calendar/v3/colors?fields=event';
			$content = @file_get_contents($resturl, false, $context);
			if ($content !== false)
			{
//$this->debug($http_response_header, '$http_response_header');
/*
	foreach($http_response_header as $c => $h)
	{
		if(stristr($h, 'content-encoding') and stristr($h, 'gzip'))
		{
			//Now lets uncompress the compressed data
			$content = gzinflate( substr($content,10,-8) );
		}
	}
*/
$this->debug($content, 'calendarColors');
				$result = json_decode($content,true);
				$cache_content['calendarColors'] = $result["event"];
				//var_dump($cache_content['calendarColors']);
			}

$this->debug('calendarColors: '.number_format(microtime(true) - $this->time, 3));
$this->time = microtime(true);
		}

		// then retrieve the users calendars available and cache them, too
		if(!isset($cache_content['calendarList']) || count(array_diff($this->calendar_names, array_keys($cache_content['calendarList']))) > 0) {
			$resturl = 'https://www.googleapis.com/calendar/v3/users/me/calendarList?fields=items(id,summary,colorId,backgroundColor)';
			$content = @file_get_contents($resturl, false, $context);
			if ($content !== false) {
				$result = json_decode($content);
				$calendarList = array();

				foreach ($result->items as $entry) {
					$color = '';
					if(isset($entry->backgroundColor) && $entry->backgroundColor != '')
						$color = $entry->backgroundColor;
					else if(isset($entry->colorId) && $entry->colorId != '') {
						$color = $cache_content['calendarColors'][$entry->colorId]['background'];
					}

					$calendarList[strtolower($entry->summary)] = array(
						'id' => $entry->id,
						'description' => $entry->summary,
						'backgroundColor' => $color
					);
				}

$this->debug($calendarList, 'calendarList');
				$cache_content['calendarList'] = $calendarList;
				//var_dump($cache_content['calendarList']);
			}
$this->debug('calendarList: '.number_format(microtime(true) - $this->time, 3));
$this->time = microtime(true);
		}


		// retrieve the calendar entries from each calendar
		$events = array();

		foreach ($cache_content['calendarList'] as $calkey => $calmetadata) {
			// check if calendar is in selected list
			if(!in_array($calkey, $this->calendar_names) && $this->calendar_names !== array(''))
				continue;

			// if max event count is reached, just query events which end before last one
			$last = count($this->data) == $this->count ? end($this->data) : null;

			$resturl = 'https://www.googleapis.com/calendar/v3/calendars/'. urlencode($calmetadata['id']) . '/events?fields=items(start,end,colorId,summary,description,location,htmlLink)&singleEvents=true&q=-%22%40visu+no%22&orderBy=startTime&timeMin='.urlencode(date('c')) . ($last != null ? '&timeMax='.urlencode(date('c', $last['end'])) : '') . '&maxResults='. $this->count;
			$content = @file_get_contents($resturl, false, $context);
$this->debug($content, 'events '.$calmetadata['description']);

			if ($content !== false)
			{
				$result = json_decode($content,true);

				foreach ($result["items"] as $entry)
				{
					$startstamp = (string)($entry["start"]["dateTime"]);
					$endstamp = (string)($entry["end"]["dateTime"]);
					if ($startstamp == '')
						$startstamp = (string)($entry["start"]["date"]);
					if ($endstamp == '')
						$endstamp = (string)($entry["end"]["date"]);
					$start = strtotime($startstamp);
					$end   = strtotime($endstamp);

					$color = '';
					if(isset($entry["backgroundColor"]) && (string)($entry["backgroundColor"]) != '')
						$color = (string)($entry["backgroundColor"]);
					else if(isset($entry["colorId"]) && ((string)($entry["colorId"])) != '') {
						$color = $cache_content['calendarColors'][(string)($entry["colorId"])]['background'];
					}

					$this->addData(array(
						'start' => $start,
						'end' => $end,
						'title' => (string)($entry["summary"]),
						'content' => (string)($entry["description"]),
						'where' => (string)($entry["location"]),
						'color' => $color,
						'link' => (string)($entry["htmlLink"]),
						'calendarname' => $calmetadata['description'],
						'calendarcolor' => $calmetadata['backgroundColor'],
					));

				}
			}
			else
			{
				$this->error('Calendar: Google', 'Calendar '. $calmetadata['id'] .' read request failed!');
			}
		}
$this->debug('events: '.number_format(microtime(true) - $this->time, 3));
$this->time = microtime(true);
/*
		// finally re-order the events comming potentially from different calendars
		$i = 1;
		ksort($events);
		foreach($events as $event) {
			$event['pos'] = $i++;
			$this->data[] = $event;
			if ($i > $this->count) break;
		}
$this->debug('re-order: '.number_format(microtime(true) - $this->time, 3));
$this->time = microtime(true);
*/
		// at the end write back cache
		$cache->write( json_encode($cache_content) );
	}
}


// -----------------------------------------------------------------------------
// call the service
// ----------------------------------------------------------------------------

if (realpath(__FILE__) == realpath($_SERVER['DOCUMENT_ROOT'].$_SERVER['SCRIPT_NAME'])) {
	header('Content-Type: application/json');
	$service = new calendar_google(array_merge($_GET, $_POST));
	echo $service->json();
}
?> 