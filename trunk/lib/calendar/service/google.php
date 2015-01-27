<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


require_once '../../../lib/includes.php';
require_once const_path_system.'calendar/calendar.php';


/**
 * This class reads a google calendar
 */
class calendar_google extends calendar
{

	/**
	 * initialization of some parameters
	 */
	public function init($request)
	{
		parent::init($request);

		$this->url = str_replace("/basic", "/full?max-results=".(int)$request['count']."&singleevents=true&futureevents=true&orderby=starttime&sortorder=a", $this->url);
	}

	/**
	 * Check if the cache-file exists
	 */
	public function run()
	{
		$context = stream_context_create(array('http' => array('method' => "GET")));
		$content = @file_get_contents($this->url, false, $context);
		$this->debug($content);

		if ($content !== false)
		{
			$xml = simplexml_load_string($content);

			$i = 1;

			foreach ($xml->entry as $entry)
			{
				$meta = $entry->children('http://schemas.google.com/g/2005');
				$startstamp = strtotime($meta->when->attributes()->startTime) + date("Z", strtotime($meta->when->attributes()->startTime));
				$endstamp = strtotime($meta->when->attributes()->endTime) + date("Z", strtotime($meta->when->attributes()->endTime));

				$this->data[] = array('pos' => $i++,
					'start' => date('y-m-d', $startstamp).' '.gmdate('H:i:s', $startstamp),
					'end' => date('y-m-d', $endstamp).' '.gmdate('H:i:s', $endstamp),
					'title' => (string)($entry->title),
					'content' => (string)($entry->content),
					'where' => (string)$meta->where->attributes()->valueString,
					'link' => (string)($entry->link->attributes()->href)
				);
			}
		}
		else
			$this->error('Calendar: Google', 'Calendar read request failed!');
	}
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new calendar_google(array_merge($_GET, $_POST));
echo $service->json();

?>
