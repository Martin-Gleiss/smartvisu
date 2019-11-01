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
require_once const_path_system.'calendar/ICal/ICal.php';
require_once const_path_system.'calendar/ICal/Event.php';

/**
 * This class is the base class of all services
 */
class calendar extends service
{
	var $count = 1;
	var $calendar_names = array('');

	var $url;
	
	public function __construct($request)
	{
		if(!function_exists('mb_get_info') && !($this instanceof calendar_offline))
			$this->error('Calendar service', 'Calendar services require PHP mbstring extension.');

		parent::__construct($request);
	}

	/**
	 * initialization of some parameters
	 */
	public function init($request)
	{
		parent::init($request);

		$this->count = $request['count'];
		$this->calendar_names = preg_split('/[\s,]+/m', strtolower($request['calendar']));
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
		$events = $ical->eventsFromRange(false, '+1 year');
		// output events as listj
		foreach ($events as $event) {
			$this->addData(array(
				'start' => $ical->iCalDateToUnixTimestamp($event->dtstart, true),
				'end' => $event->dtend != null ? $ical->iCalDateToUnixTimestamp($event->dtend, true) : $ical->iCalDateToUnixTimestamp($event->dtstart, true),
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
