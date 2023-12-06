<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      aschwith
 * @copyright   2023
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @hide		weather_postal
 */


require_once '../../../lib/includes.php';
require_once const_path_system.'weather/weather.php';
require_once const_path_system.'class_cache.php';
require_once const_path_system.'getLocation.php';


/**
 * This class generates a weather
 */
class weather_pirateweather extends weather
{

	/**
	 * retrieve the content
	 */
	public function run()
	{
		$units = trans('pirateweather', 'units');		// 		temp | precip | dist | speed | pressure
														// si	 °C  |   mm   |  km  |  m/s  | millibar / hPa
														// ca    °C  |   mm   |  km  | km/h  | millibar / hPa
														// us    °F  |  inch  |  mi  |  mph  | millibar / hPa 
														// uk2   °C  |   mm   |  mi  |  mph  | millibar / hPa
														
		// api call
		$cache = new class_cache('pirateweather_' . $this->location . '.json');

		if ($cache->hit($this->cache_duration_minutes)) {
			$content = $cache->read();
		} else {
			$loadError = '';
			$url = 'https://api.pirateweather.net/forecast/' . config_weather_key . '/' . $this->location . '?exclude=minutely,hourly,alerts&lang='.translate('lang', 'pirateweather').'&units='.$units;
			$content = file_get_contents($url);

			if (substr($this->errorMessage, 0, 17) != 'file_get_contents')
				$cache->write($content);
			else {
				$loadError = substr(strrchr($this->errorMessage, ':'), 2);
				$this->debug('loadError:' . $loadError );
			}

		}

		$parsed_json = json_decode($content);
		if ($parsed_json != null && $parsed_json->{'daily'}) {
			$this->debug($parsed_json);

			// today
			$this->data['current']['temp'] = transunit('temp', (float)$parsed_json->{'currently'}->{'temperature'});

			$this->data['current']['conditions'] = translate((string)$parsed_json->{'currently'}->{'summary'}, 'pirateweather');
			$this->data['current']['icon'] = $this->icon((string)$parsed_json->{'currently'}->{'icon'}, $this->icon_sm);

			$wind_speed = transunit('speed', (float)$parsed_json->{'currently'}->{'windSpeed'});
			$wind_gust = transunit('speed', (float)$parsed_json->{'currently'}->{'windGust'});
			$wind_dir = weather::getDirection((int)$parsed_json->{'currently'}->{'windBearing'});

			$this->data['current']['wind'] = translate('wind', 'weather') . " " . $wind_speed;
			// when there is no wind, direction is blank
			if ($parsed_json->{'currently'}->{'windSpeed'} != 0)
				$this->data['current']['wind'] .= " " . translate('from', 'weather') . " " . $wind_dir;
			if ($wind_gust > 0)
				$this->data['current']['wind'] .= ", " . translate('wind_gust', 'weather') . " " . $wind_gust;

			$this->data['current']['more'] = translate('humidity', 'weather') . " " . transunit('%', 100 * (float)$parsed_json->{'currently'}->{'humidity'});
			$this->data['current']['misc'] = translate('air pressure', 'weather') . " " . $parsed_json->{'currently'}->{'pressure'}.' hPa';

			// forecast
			$i = 0;
			foreach ($parsed_json->{'daily'}->{'data'} as $day) {
				if ((int)$day->{'time'} < mktime(0, 0, 0) || (int)$day->{'time'} > time() + 3 * 24 * 60 * 60) // next 4 days only
					continue;

				$this->data['forecast'][$i]['date'] = date('Y-m-d', (int)$day->{'time'});
				$this->data['forecast'][$i]['conditions'] = (string)$day->{'summary'};
				$this->data['forecast'][$i]['icon'] = $this->icon((string)$day->{'icon'});

				$this->data['forecast'][$i]['temp'] = round((float)$day->{'temperatureHigh'}, 0) . '&deg;/' . round((float)$day->{'temperatureLow'}, 0) . '&deg;';

				$i++;
			}
			$location = explode(',',$this->location);
			$this->data['city'] = getLocation($location[0],$location[1]);

		} else {
			if ($loadError != '')
				$add = $loadError;
			else
				$add = $parsed_json->{'flags'}->{'pirateweather-unavailable'};
			$this->error('Weather: pirateweather.net', 'Read request failed'.($add ? ' with message: <br>'.$add : '!'));
		}
	}

	/*
	* Icon-Mapper
	*/
	function icon($name, $sm = 'sun_')
	{
		$ret = '';

		$icon['clear-day'] = $sm . '1';
		$icon['clear-night'] = $sm . '1';
		$icon['partly-cloudy-day'] = $sm . '4';
		$icon['partly-cloudy-night'] = $sm . '4';
		$icon['fog'] = $sm . '6';
		$icon['rain'] = 'cloud_8';
		$icon['wind'] = $sm . '10';
		$icon['snow'] = $sm . '12';

		$icon['cloudy'] = 'cloud_4';
		$icon['sleet'] = 'cloud_11';

		$ret = $icon[$name];

		return $ret;
	}

}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new weather_pirateweather(array_merge($_GET, $_POST));
echo $service->json();

?>
