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

	/**
	 * initialization of some parameters
	 */
	public function init($request)
	{
		parent::init($request);

		$this->count = $request['count'];
	}

	/**
	 * prepare the data
	 */
	public function prepare()
	{
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
	}

}

?>
