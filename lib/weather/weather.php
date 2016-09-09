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
 * This class is the base of all weather services
 */
class weather extends service
{
	var $location = '';
	var $icon_sm = 'sun_';
	var $cache_duration_minutes = 0;

	/**
	 * initialization of some parameters
	 */
	public function init($request)
	{
		parent::init($request);

		$this->location = $request['location'];

		// reduce real cache duration by 2 seconds to avoid getting old weather on calling repeat on widget
		if (isset($request['cache_duration_minutes']))
			$this->cache_duration_minutes = $request['cache_duration_minutes'] - (2/60); 

		if (!isset($request['sunrise']))
			$request['sunrise'] = 6;

		if (!isset($request['sunset']))
			$request['sunset'] = 20;

		if ((date('H') <= $request['sunrise'] || date('H') >= $request['sunset']))
			$this->icon_sm = 'moon_';
	}

	/**
	 * prepare the data
	 */
	public function prepare()
	{
		foreach ($this->data['forecast'] as $id => $ds)
		{
			$this->data['forecast'][$id]['date'] = transdate('D', strtotime($ds['date']));
		}
	}

}

?>
