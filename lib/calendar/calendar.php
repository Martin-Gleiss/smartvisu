<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


require_once const_path_system.'service.php';
require_once const_path_system.'calendar/ICal/EventObject.php';
require_once const_path_system.'calendar/ICal/ICal.php';

/**
 * This class is the base class of all services
 */
class calendar extends service
{
	var $count = 1;
	var $calendar_names = array('');

	/**
	 * initialization of some parameters
	 */
	public function init($request)
	{
		parent::init($request);

		$this->count = $request['count'];
		$this->calendar_names = preg_split('/[\s,]+/m', strtolower($request['calendar']));
//		$this->calendar_names = trim($request['calendar']) != '' ? preg_split('/[\s,]+/m', strtolower($request['calendar'])) : preg_split('/[\s,]+/m', strtolower(config_calendar_name));
		$this->url = config_calendar_url;
	}

	protected function addData($line)
	{
		// find greatest index which has a lower date
		// (beginning on highest index because of greater chance of having a later date)
		for($i = count($this->data)-1; $i >= 0; $i--) {
			if($this->data[$i]['start'] < $line['start'] || $this->data[$i]['start'] == $line['start'] && $this->data[$i]['end'] < $line['end'])
				break;
		}

		if($this->count > $i+1) {
			// insert new line after found index
			array_splice($this->data, $i+1, 0, array($line));
			// reduce size to max result size
			if(count($this->data) > $this->count)
				array_pop($this->data);
		}
	}

	protected function addFromIcs($ical, $calmetadata = array())
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
				'calendarname' => $calmetadata['calendarname'] != '' ? $calmetadata['calendarname'] : $ical->calendarName(),
				'calendardesc' => $calmetadata['calendardesc'] != '' ? $calmetadata['calendardesc'] : $ical->calendarDescription(),
				'calendarcolor' => $calmetadata['calendarcolor'] != '' ? $calmetadata['calendarcolor'] : ""
				//,'link' => ''
			));
		}
  }

}

?>