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
require_once const_path_system.'weather/weather.php';
require_once const_path_system.'class_cache.php';


/**
 * This class generates a weather
 */
class weather_yr extends weather
{

	/**
	 * retrieve the content
	 */
	public function run()
	{
		// api call 
		$cache = new class_cache('yr.no_'.substr(strrchr($this->location, '/'), 1).'.xml');

		if ($cache->hit($this->cache_duration_minutes))
			$content = $cache->read();
		else
		{
			$url = 'http://www.yr.no/place/'.rawurlencode($this->location).'/forecast.xml';
			$content = file_get_contents($url);
			if (substr($content, 0, 5) == '<?xml')
				$cache->write($content);
			else {
				$this->error('Weather: yr.no', 'Read request failed!');
				return;
			}
		}
		
		$xml = simplexml_load_string($content);
		$this->debug($xml);

		// today 
		$this->data['city'] = (string)$xml->location->name;

		// forecast
		$i = 0;
		foreach ($xml->forecast->tabular->time as $day)
		{
			if (config_lang == 'de')
				$windspeed = ' mit '.round(((string)$day->windSpeed->attributes()->mps * 3.6), 1).' km/h';
			elseif (config_lang == 'nl')
				$windspeed = ' met '.round(((string)$day->windSpeed->attributes()->mps * 3.6), 1).' km/u';
			else
				$windspeed = ' at '.round(((string)$day->windSpeed->attributes()->mps * 2.24), 1).' MPH';

			if ($i == 0)
			{
				$this->data['current']['date'] = (string)$day->attributes()->from;
				$this->data['current']['conditions'] = translate((string)$day->symbol->attributes()->name, 'yr.no');
				$this->data['current']['wind'] = translate((string)$day->windSpeed->attributes()->name.' from '.(string)$day->windDirection->attributes()->code, 'yr.no').$windspeed;
				$this->data['current']['icon'] = $this->icon((string)$day->symbol->attributes()->number, $this->icon_sm);
				$this->data['current']['temp'] = (float)$day->temperature->attributes()->value.'&deg;C';
				$this->data['current']['more'] = (int)$day->pressure->attributes()->value.' hPa';
			}
			
			if ($i < 4 and $day->attributes()->period == 2)
			{
				$this->data['forecast'][$i]['date'] = (string)$day->attributes()->from;
				$this->data['forecast'][$i]['conditions'] = translate((string)$day->symbol->attributes()->name, 'yr.no');
				$this->data['forecast'][$i]['wind'] = translate((string)$day->windSpeed->attributes()->name.' from '.(string)$day->windDirection->attributes()->code, 'yr.no').$windspeed;
				$this->data['forecast'][$i]['icon'] = $this->icon((string)$day->symbol->attributes()->number);
				$this->data['forecast'][$i]['temp'] = (float)$day->temperature->attributes()->value.'&deg;C';
				$this->data['forecast'][$i]['more'] = (int)$day->pressure->attributes()->value.' hPa';
				$i++;
			}

		}

	}

	/*
		* Icon-Mapper
		*/
	function icon($name, $sm = 'sun_')
	{
		$ret = '';

		$icon[1] = $sm.'1';
		$icon[2] = $sm.'2';
		$icon[3] = $sm.'3';
		$icon[4] = $sm.'5';
		$icon[5] = $sm.'7';
		$icon[6] = $sm.'9';
		$icon[7] = $sm.'11';
		$icon[8] = $sm.'13';

		$icon[9] = 'cloud_7';
		$icon[10] = 'cloud_8';
		$icon[11] = 'cloud_10';
		$icon[12] = 'cloud_11';
		$icon[13] = 'cloud_13';
		$icon[14] = 'cloud_15';
		$icon[15] = 'cloud_6';

		$icon[20] = $sm.'10';
		$icon[21] = $sm.'10';
		$icon[22] = 'cloud_10';
		$icon[23] = 'cloud_17';

		$ret = $icon[$name];

		return $ret;
	}

}


// -----------------------------------------------------------------------------
// i c o n - f o r m a t
// -----------------------------------------------------------------------------

/*
    1 sun
    2 lightcloud
    3 partlycloud
    4 cloud
    5 lightrainsun
    6 lightrainthundersun
    7 sleetsun
    8 snowsun
    9 lightrain
    10 rain
    11 rainthunder
    12 sleet
    13 snow
    14 snowthunder
    15 fog
    16 sun ( used for winter darkness )
    17 lightcloud ( winter darkness )
    18 lightrainsun ( used for winter darkness )
    19 snowsun ( used for winter darkness )
    20 sleetsunthunder
    21 snowsunthunder
    22 lightrainthunder
    23 sleetthunder
*/


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new weather_yr(array_merge($_GET, $_POST));
echo $service->json();

?>
