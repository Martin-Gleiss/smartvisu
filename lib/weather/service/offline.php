<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @hide        weather_key
 */


require_once '../../../lib/includes.php';
require_once const_path_system.'weather/weather.php';


/**
 * This class generates a weather
 */
class weather_offline extends weather
{

	/**
	 * retrieve the content
	 */
	public function run()
	{
		// today
		$this->data['city'] = ucfirst($this->location);

		if (config_lang == 'de')
			$windspeed = ' mit '.round(1 * 3.6, 1).' km/h';
		elseif (config_lang == 'nl')
			$windspeed = ' met '.round(1 * 3.6, 1).' km/u';
		else
			$windspeed = ' at '.round(1 * 2.24, 1).' MPH';

		$this->data['current']['temp'] = '25&deg;C';
		$this->data['current']['conditions'] = translate('clear sky', 'yr.no');
		$this->data['current']['icon'] = $this->icon_sm.'1';
		$this->data['current']['wind'] = translate('light breeze from N', 'yr.no').$windspeed;
		$this->data['current']['more'] = '45%, 1050 hPa';

		// forecast
		$days = 4;
		for ($i = 0; $i < $days; $i++)
		{
			$this->data['forecast'][$i]['date'] = date('Y-m-d', time() + 24 * 60 * 60 * ($i + 1));
			$this->data['forecast'][$i]['conditions'] = translate('clear sky', 'yr.no');
			$this->data['forecast'][$i]['icon'] = 'sun_'.rand(1, 5);
			$this->data['forecast'][$i]['temp'] = rand(22, 25).'&deg;/'.rand(18, 20).'&deg;';
		}
	}
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new weather_offline(array_merge($_GET, $_POST));
echo $service->json();

?>
