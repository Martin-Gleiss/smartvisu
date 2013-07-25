<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
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

			if (date('Y-m-d', $start) == date('Y-m-d', $end))
				$this->data[$id]['period'] = transdate('short', $start).' - '.date('H:i', $end);
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
