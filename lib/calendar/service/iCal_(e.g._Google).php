<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Stefan Widmer
 * @copyright   2016
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @label       ICS/iCal (e.g. Google)
 * @hide        calendar_username
 * @hide        calendar_password
 * @hide        calendar_google_refresh_token
 */


require_once '../../../lib/includes.php';
require_once const_path_system.'calendar/calendar.php';

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
				$ical = new ICal($url, array('defaultSpan' => 1));
				$this->addFromIcs($ical, array('calendarname' => $config_calendar_names[$i]));
			}
			$i++;
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