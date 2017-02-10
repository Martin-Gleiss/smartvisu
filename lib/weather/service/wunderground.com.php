<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß & Pierre-Yves
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
class weather_wunderground extends weather
{

	/**
	 * retrieve the content
	 */
	public function run()
	{
		// api call 
		$cache = new class_cache('wunderground_'.$this->location.'.json');

		if ($cache->hit($this->cache_duration_minutes))
		{
			$content = $cache->read();
		}
		else
		{
			$url = 'http://api.wunderground.com/api/'.config_weather_key.'/conditions/forecast/lang:'.trans('wunderground', 'lang').'/q/'.$this->location.'.json';
			$content = file_get_contents($url);
			$cache->write($content);
		}

		$parsed_json = json_decode($content);
		if ($parsed_json->{'forecast'})
		{
			$this->debug($parsed_json);

			// today
			$this->data['city'] = (string)$parsed_json->{'current_observation'}->{'display_location'}->{'city'};

			if (substr(trans('format', 'temp'), -1, 1) != "F")
				$this->data['current']['temp'] = transunit('temp', (float)$parsed_json->{'current_observation'}->{'temp_c'});
			else
				$this->data['current']['temp'] = transunit('temp', (float)$parsed_json->{'current_observation'}->{'temp_f'});

			$this->data['current']['conditions'] = (string)$parsed_json->{'current_observation'}->{'weather'};
			$this->data['current']['icon'] = $this->icon((string)$parsed_json->{'current_observation'}->{'icon'}, $this->icon_sm);

			// get the good values by countries in km/h or mph for the wind and gusts
			if (trim(strrchr(trans('format', 'speed'), ' ')) != 'mph')
			{
				$wind_speed = transunit('speed', (float)$parsed_json->{'current_observation'}->{'wind_kph'});
				$wind_gust = transunit('speed', (float)$parsed_json->{'current_observation'}->{'wind_gust_kph'});
			}
			else
			{
				$wind_speed = transunit('speed', (float)$parsed_json->{'current_observation'}->{'wind_mph'});
				$wind_gust = transunit('speed', (float)$parsed_json->{'current_observation'}->{'wind_gust_mph'});
			}

			$wind_direction = translate((string)$parsed_json->{'current_observation'}->{'wind_dir'}, 'wunderground');

			// in french, there is a difference when the word stars with a vowel
			// de (from) becomes d' can be use if a language has the same exception
			if (config_lang == 'fr')
			{
				if ((substr($wind_direction, 0, 1) == 'O') || (substr($wind_direction, 0, 1) == 'E'))
					$from = translate('from_ew', 'wunderground');
				else
					$from = translate('from_ns', 'wunderground');
			}
			else
				$from = translate('from', 'wunderground');

			// when the wind has no fix direction from is blank
			if ((string)$parsed_json->{'current_observation'}->{'wind_dir'} == 'Variable')
				$from = '';

			$this->data['current']['wind'] = translate('wind', 'wunderground')." ".$from." ".$wind_direction.", ".translate('wind_speed', 'wunderground')." ".$wind_speed;
			if ($wind_gust > 0)
				$this->data['current']['wind'] .= ", ".translate('wind_gust', 'wunderground')." ".$wind_gust;

			$this->data['current']['more'] = translate('humidity', 'wunderground')." ".(string)$parsed_json->{'current_observation'}->{'relative_humidity'};

			// forecast
			$i = 0;
			foreach ($parsed_json->{'forecast'}->{'simpleforecast'}->{'forecastday'} as $day)
			{
				$this->data['forecast'][$i]['date'] = (string)$day->{'date'}->{'year'}.'-'.(string)$day->{'date'}->{'month'}.'-'.(string)$day->{'date'}->{'day'};
				$this->data['forecast'][$i]['conditions'] = (string)$day->{'conditions'};
				$this->data['forecast'][$i]['icon'] = $this->icon((string)$day->{'icon'});

				if (substr(trans('format', 'temp'), -1, 1) != "F")
					$this->data['forecast'][$i]['temp'] = (float)$day->{'low'}->{'celsius'}.'&deg;/'.(float)$day->{'high'}->{'celsius'}.'&deg;';
				else
					$this->data['forecast'][$i]['temp'] = (float)$day->{'low'}->{'fahrenheit'}.'&deg;/'.(float)$day->{'high'}->{'fahrenheit'}.'&deg;';

				$i++;
			}
		}
		else
		{
			$add = $parsed_json->{'response'}->{'error'}->{'description'};
			$this->error('Weather: wounderground.com', 'Read request failed'.($add ? ': '.$add : '').'!');
		}	
	}

	/*
	* Icon-Mapper
	*/
	function icon($name, $sm = 'sun_')
	{
		$ret = '';

		$icon['sunny'] = $sm.'1';
		$icon['mostlysunny'] = $sm.'2';
		$icon['clear'] = $sm.'2';
		$icon['partlycloudy'] = $sm.'3';
		$icon['mostlycloudy'] = $sm.'5';
		$icon['mist'] = $sm.'6';
		$icon['chancerain'] = $sm.'7';
		$icon['rain'] = 'cloud_8';
		$icon['chancestorm'] = $sm.'9';
		$icon['storm'] = $sm.'10';
		$icon['chancesnow'] = $sm.'11';
		$icon['snow'] = $sm.'12';

		$icon['cloudy'] = 'cloud_4';
		$icon['showers'] = 'cloud_8';
		$icon['chancetstorms'] = 'cloud_10';
		$icon['thunderstorm'] = 'cloud_10';
		$icon['tstorms'] = 'cloud_10';
		$icon['rain_snow'] = 'cloud_15';
		$icon['foggy'] = 'cloud_6';
		$icon['fog'] = 'cloud_6';
		$icon['icy'] = 'cloud_16';
		$icon['smoke'] = 'cloud_6';
		$icon['dusty'] = 'cloud_6';
		$icon['haze'] = 'cloud_6';
		$icon['sleet'] = 'cloud_11';
		$icon['chancesleet'] = 'cloud_11';

		$ret = $icon[$name];

		return $ret;
	}
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new weather_wunderground(array_merge($_GET, $_POST));
echo $service->json();

?>
