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


/**
 * This class is the base class of all services
 */
class calendar extends service
{
	var $count = 1;
	var $calendar_names = array('');
  var $colormapping = array();

	/**
	 * initialization of some parameters
	 */
	public function init($request)
	{
		parent::init($request);

		$config_calendar_names = preg_split('/[\s,]+/m', strtolower(config_calendar_name));

		$this->count = $request['count'];
		$this->calendar_names = preg_split('/[\s,]+/m', strtolower($request['calendar']));
//		$this->calendar_names = trim($request['calendar']) != '' ? preg_split('/[\s,]+/m', strtolower($request['calendar'])) : $config_calendar_names;
		$this->url = config_calendar_url;

		// read colors, reduce array size of names and colors to the smaller of them
		$config_calendar_colors = preg_split('/[\s,]+/m', config_calendar_color);
    $config_calendar_colors = array_slice($config_calendar_colors, 0, count($config_calendar_names));
    $config_calendar_names = array_slice($config_calendar_names, 0, count($config_calendar_colors));
		$this->colormapping = array_combine($config_calendar_names, $config_calendar_colors);
	}

	protected function addData($line)
	{
		// set default color, if one exists and no calendarcolor is set before
		if(empty($line['calendarcolor']) && $this->colormapping[$line['calendarname']])
			$line['calendarcolor'] = $this->colormapping[$line['calendarname']];

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

	/**
	 * prepare the data
	 */
	public function prepare()
	{
		/*
		usort($this->data, array('calendar','compare_data'));
		$this->data = array_slice($this->data, 0, $this->count);
		foreach ($this->data as $id => $ds)
		{
			$start = strtotime($ds['start']);
			$end = strtotime($ds['end']);

			$this->data[$id]['starttime'] = transdate('time', $start);
			$this->data[$id]['endtime'] = transdate('time', $end);

			if (date('Y-m-d', $start) == date('Y-m-d', $end)) // Start and end on same day: show day only once
				$this->data[$id]['period'] = transdate('short', $start).' - '.transdate('time', $end);
			else if (date('H:i', $start) == '00:00' && date('H:i', $end) == '00:00') // Full day events: don't show time
			{
				if($start == $end-86400) // One day only: Show just start date
					$this->data[$id]['period'] = transdate('date', $start);
				else // Multiple days: Show start and end date
					$this->data[$id]['period'] = transdate('date', $start).' - '.transdate('date', $end-86400);
			}
			else
				$this->data[$id]['period'] = transdate('short', $start).' - '.transdate('short', $end);

			$this->data[$id]['weekday'] = transdate('l', $start);

			// content
			$tags = null;

			if ($this->data[$id]['icon'] == '')
				$this->data[$id]['icon'] = 'pages/base/pics/trans.png';

			preg_match_all('#@(.+?)\W+(.*)#i', $this->data[$id]['content'], $tags);
			foreach ($tags[0] as $nr => $hit)
			{
				$tag = trim($tags[1][$nr]);
				if ($tag == 'icon')
				{
					if (is_file(const_path.$tags[2][$nr]))
						$this->data[$id][$tag] = $tags[2][$nr];
				}
				elseif ($tag == 'color')
					$this->data[$id][$tag] = '#'.trim($tags[2][$nr]);
			}
		}
		*/
	}

	static function compare_data($a, $b)
	{
		$res = strtotime($a['start']) - strtotime($b['start']);
		if($res != 0)
			return $res > 0 ? 1 : -1;
		$res = strtotime($a['end']) - strtotime($b['end']);
		if($res != 0)
			return $res > 0 ? 1 : -1;
		return 0;
	}

}

?>