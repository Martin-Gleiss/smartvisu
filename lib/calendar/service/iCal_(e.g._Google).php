<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Stefan Widmer
 * @copyright   2016 - 2025
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
		$config_calendar_names = preg_split('/,\s*/m', strtolower(config_calendar_name));
		try {
			foreach(preg_split('/[\s,]+/m', $this->url) as $url) {
				if(\count($this->calendar_names) == 1 && $this->calendar_names[0] == '' || \in_array($config_calendar_names[$i], $this->calendar_names)) {
					//hand calendar URL over to iCal for parsing 
					$ical = new ICal($url, array('defaultSpan' => 1));
					// evaluate parsed calendar into our own array of events
					$this->addFromIcs($ical, array('calendarname' => $config_calendar_names[$i]));
				}
				$i++;
			}
		}
		// catch the uncaught exceptions from iCal ("URL not existing" or "Invalid iCal date format")
		catch(\Exception $e) {
			$this->error('iCal (e.g.Google) Calendar', translate($e->getMessage(), 'calendar_error_message'));
		}
	}
}


// -------------------------------------------------------------------------------------------
// call the service only if script has been called directly - not as a child of other scripts
// -------------------------------------------------------------------------------------------
if (realpath(__FILE__) == realpath($_SERVER['DOCUMENT_ROOT'].$_SERVER['SCRIPT_NAME'])) {
	header('Content-Type: application/json');
	$service = new calendar_ical(array_merge($_GET, $_POST));
	echo $service->json();
}
?>