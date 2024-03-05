<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Wolfram v. Hülsen
 * @copyright   2024
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @hide		weather_postal
 */


require_once '../../../lib/includes.php';
require_once const_path_system.'weather/weather.php';
require_once const_path_system.'weather/classWMOWeatherCodes.php';
require_once const_path_system.'class_cache.php';
require_once const_path_system.'getLocation.php';


/**
 * This class generates a weather
 */
class weather_openmeteo extends weather
{

	/*
	 * unit handling similar to pirateweather.net:
	 *
	 * 	  	temp | precip | dist | speed | pressure
	 *  si	 °C  |   mm   |  km  |  m/s  | millibar / hPa
	 *  ca	 °C  |   mm   |  km  | km/h  | millibar / hPa
	 *  us	 °F  |  inch  |  mi  |  mph  | millibar / hPa 
	 * uk2	 °C  |   mm   |  mi  |  mph  | millibar / hPa
	 */

	const unitString = array(
		"si"  => "&wind_speed_unit=ms",	// other units are default from open-meteo.com
		"ca"  => "",
		"us"  => "&temperature_unit=fahrenheit&precipitation_unit=inch&wind_speed_unit=mph",
		"uk2" => "&wind_speed_unit=mph" 
	);
	
	/**
	 * retrieve the content
	 */
	public function run()
	{
		$units = self::unitString[trans('weather', 'units')];				
														
														
		// api call
		$cache = new class_cache('openmeteo_' . $this->location . '.json');

		if ($cache->hit($this->cache_duration_minutes)) {
			$content = $cache->read();
		} else {
			$loadError = '';
			$url = 'https://api.open-meteo.com/v1/forecast?'. $this->location. '&current=weather_code,surface_pressure,temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max'.$units;

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
			$this->data['current']['temp'] = transunit('temp', (float)$parsed_json->{'current'}->{'temperature_2m'});

			$this->data['current']['conditions'] = translate(WMO::weatherCode[$parsed_json->{'current'}->{'weather_code'}]['condition'], 'met.no');
			$this->data['current']['icon'] = WMO::weatherCode[$parsed_json->{'current'}->{'weather_code'}]['icon'];

			$wind_speed = transunit('speed', (float)$parsed_json->{'current'}->{'wind_speed_10m'});
			$wind_gust = transunit('speed', (float)$parsed_json->{'current'}->{'wind_gusts_10m'});
			$wind_dir = weather::getDirection((int)$parsed_json->{'current'}->{'wind_direction_10m'});

			$this->data['current']['wind'] = translate('wind', 'weather') . " " . $wind_speed;
			// when there is no wind, direction is blank
			if ($parsed_json->{'current'}->{'wind_speed_10m'} != 0)
				$this->data['current']['wind'] .= " " . translate('from', 'weather') . " " . $wind_dir;
			if ($wind_gust > 0)
				$this->data['current']['wind'] .= ", " . translate('wind_gust', 'weather') . " " . $wind_gust;

			$this->data['current']['more'] = translate('humidity', 'weather') . " " . transunit('%', (float)$parsed_json->{'current'}->{'relative_humidity_2m'});
			$this->data['current']['misc'] = translate('air pressure', 'weather') . " " . $parsed_json->{'current'}->{'surface_pressure'}.' hPa';

			// forecast
			$i = 0;
			foreach ($parsed_json->{'daily'}->{'time'} as $index=>$day) {

				if ($index == 0 || $index > 4 ) // next 4 days only todo: get same day befor noon inro forecast
					continue;

				$this->data['forecast'][$i]['date'] = $day;
				$this->data['forecast'][$i]['conditions'] = translate(WMO::weatherCode[$parsed_json->{'daily'}->{'weather_code'}[$index]]['condition'], 'met.no');
				$this->data['forecast'][$i]['icon'] = WMO::weatherCode[$parsed_json->{'daily'}->{'weather_code'}[$index]]['icon'];;

				$this->data['forecast'][$i]['temp'] = round((float)$parsed_json->{'daily'}->{'temperature_2m_min'}[$index], 0) . '&deg;/' . round((float)$parsed_json->{'daily'}->{'temperature_2m_max'}[$index], 0) . '&deg;';

				$i++;
			}
			$location = explode('&',$this->location);
			$this->data['city'] = getLocation(str_replace('latitude=','',$location[0],),str_replace('longitude=','',$location[1]));

		} else {
			if ($loadError != '')
				$add = $loadError;
			else
				$add = $parsed_json->{'reason'};
			$this->error('Weather: open-meteo.com', 'Read request failed'.($add ? ' with message: <br>'.$add : '!'));
		}
	}
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new weather_openmeteo(array_merge($_GET, $_POST));
echo $service->json();

?>
