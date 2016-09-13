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
require_once const_path_system.'calendar/ICal/ICal.php';
require_once const_path_system.'calendar/ICal/EventObject.php';

use ICal\ICal;

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

		//$this->url = preg_replace('#/basic(\.ics)?$#', "/full.ics?maxResults=".(int)$request['count']."&timeMin=2016-07-03T00:00:00Z&singleEvents=true&orderBy=startTime&sortOrder=a", $this->url);
	}

	public function run()
	{
				$ics = new ICal($this->url);
				$events = $ics->eventsFromRange("today",false);
				$events = array_slice($events, 0, $this->count);
    		// output events as list
    		$i = 1;
        foreach ($events as $event) {
          $this->data[] = array('pos' => $i++,
            'start' => date('y-m-d H:i:s', $ics->iCalDateToUnixTimestamp($event->dtstart)),
            'end' => date('y-m-d H:i:s', $ics->iCalDateToUnixTimestamp($event->dtend)),
            'title' => $event->summary,
            'content' => str_replace("\\n", "\n", $event->description),
            'where' => $event->location
            //,'link' => ''
          );
        }
  }
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new calendar_google(array_merge($_GET, $_POST));
echo $service->json();

?>