<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Stefan Widmer
 * @copyright   2016
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


require_once '../../../lib/includes.php';
require_once const_path_system.'calendar/calendar.php';
require_once const_path_system.'calendar/ICal/ICal.php';
require_once const_path_system.'calendar/ICal/EventObject.php';

use ICal\ICal;

/**
 * This class reads a google calendar
 */
class calendar_ical extends calendar
{

	public function run()
	{
		$i = 0;
		$config_calendar_names = preg_split('/[\s,]+/m', strtolower(config_calendar_name));
		foreach(preg_split('/[\s,]+/m', $this->url) as $url) {
			if(count($this->calendar_names) == 1 && $this->calendar_names[0] == '' || in_array($config_calendar_names[$i], $this->calendar_names)) {
				$ical = new ICal($url);
				$this->addFromIcs($ical, $config_calendar_names[$i]);
			}
			$i++;
		}
	}

	protected function addFromIcs($ical, $calname = '')
	{
		$events = $ical->eventsFromRange("today",false);
		// output events as list
		foreach ($events as $event) {
			$this->addData(array(
				'start' => $ical->iCalDateToUnixTimestamp($event->dtstart),
				'end' => $ical->iCalDateToUnixTimestamp($event->dtend),
				'title' => $event->summary,
				'content' => str_replace("\\n", "\n", $event->description),
				'where' => $event->location,
				'calendarname' => $calname != '' ? $calname : $ical->calendarName(),
				'calendardesc' => $ical->calendarDescription()
				//,'link' => ''
			));
		}
  }
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

if (realpath(__FILE__) == realpath($_SERVER['DOCUMENT_ROOT'].$_SERVER['SCRIPT_NAME'])) {
	header('Content-Type: application/json');
	$service = new calendar_ical(array_merge($_GET, $_POST));
	echo $service->json();
}
?>