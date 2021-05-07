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
		
		// enable debug display of weather data
		if ($this->debug == "1" && !isset($request->location))
			$this->location = config_weather_location;
		else
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
	
	/**
	* Translate wind directions
	*/
	public function getDirection($angle)
	{
		$dirs = array('n', 'nne', 'ne', 'ene', 'e', 'ese', 'se', 'sse', 's', 'ssw', 'sw', 'wsw', 'w', 'wnw', 'nw', 'nnw', 'n'); 
		return translate($dirs[round(($angle % 360)/ 22.5, 0)], 'weather');
	}
	
	/**
	* Translate wind speed with unit (string). Unit must be km/h or mph !
	* Source: https://www.windfinder.com/wind/windspeed.htm
	*/
	public function getWindDescription($wind_speed)
	{
		$windspeed = (float)(substr($wind_speed, 0, strpos($wind_speed, ' ')));
		if (substr($wind_speed,-3) =='mph')
			$windspeed = $windspeed * 0.62;
		
		$description = '';
		if ($windspeed >= 0 and $windspeed < 1) {
			$description = translate('calm', 'weather');
		} elseif ($windspeed >= 1 and $windspeed < 6) {
			$description = translate('light air', 'weather');
		} elseif ($windspeed >= 6 and $windspeed < 12) {
			$description = translate('light breeze', 'weather');
		} elseif ($windspeed >= 12 and $windspeed < 20) {
			$description = translate('gentle breeze', 'weather');
		} elseif ($windspeed >= 20 and $windspeed < 29) {
			$description = translate('moderate breeze', 'weather');
		} elseif ($windspeed >= 29 and $windspeed < 39) {
			$description = translate('fresh breeze', 'weather');
		} elseif ($windspeed >= 39 and $windspeed < 50) {
			$description = translate('strong breeze', 'weather');
		} elseif ($windspeed >= 50 and $windspeed <62) {
			$description = translate('near gale', 'weather');
		} elseif ($windspeed >= 62 and $windspeed < 75) {
			$description = translate('gale', 'weather');
		} elseif ($windspeed >= 75 and $windspeed < 89) {
			$description = translate('strong gale', 'weather');
		} elseif ($windspeed >= 89 and $windspeed < 103) {
			$description = translate('storm', 'weather');
		} elseif ($windspeed >= 103 and $windspeed < 118) {
			$description = translate('violent storm', 'weather');
		} elseif ($windspeed >= 118) {
			$description = translate('hurricane', 'weather');
		}
		return $description;
	}

}
