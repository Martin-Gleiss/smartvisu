<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Wolfram v. Hülsen based on a service from aschwith
 * @copyright   2024 - 2025
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
class weather_visualcrossing extends weather
{

	/**
	 * retrieve the content
	 */
	public function run()
	{
		$units = trans('visualcrossing', 'units');		// 	       temp | precip | dist | speed | pressure
														// metric   °C  |   mm   |  km  |  m/s  | millibar / hPa
														// us       °F  |  inch  |  mi  |  mph  | millibar / hPa 
														// uk       °C  |   mm   |  mi  |  mph  | millibar / hPa
														
		// if the user has taken geo coordinates from a different weather service we translate it for him - also good for the docu page
		$location = (substr($this->location, 0, 3) == 'lat') ? preg_replace('/lat\D*=(\d*\.?\d*)&lon\D*=(\d*\.?\d*)(&.*)?/', '$1,$2', $this->location) : $this->location;

		// api call
		$cache = new class_cache('visualcrossing_' . $location . '.json');

		if ($cache->hit($this->cache_duration_minutes)) {
			$content = $cache->read();
		} else {
			$loadError = '';
			$url ='https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'.$location.'?lang='.trans('visualcrossing', 'lang').'&unitGroup='.$units.'&include=days,current&key='.config_weather_key.'&contentType=json';
			$content = file_get_contents($url);

			if (substr($this->errorMessage, 0, 17) != 'file_get_contents')
				$cache->write($content);
			else {
				$loadError = substr(strrchr($this->errorMessage, ':'), 2);
				$this->debug('loadError:' . $loadError );
			}

		}

		$parsed_json = json_decode($content);
		if ($parsed_json != null && $parsed_json->{'days'}) {
			$this->debug($parsed_json);

			// today
			$this->data['current']['temp'] = transunit('temp', (float)$parsed_json->{'currentConditions'}->{'temp'});

			$this->data['current']['conditions'] = translate((string)$parsed_json->{'currentConditions'}->{'conditions'}, 'visualcrossing');
			$this->data['current']['icon'] = $this->icon((string)$parsed_json->{'currentConditions'}->{'icon'}, $this->icon_sm);

			$wind_speed = transunit('speed', (float)$parsed_json->{'currentConditions'}->{'windspeed'});
			$wind_gust = transunit('speed', (float)$parsed_json->{'currentConditions'}->{'windgust'});
			$wind_dir = weather::getDirection((int)$parsed_json->{'currentConditions'}->{'winddir'});

			$this->data['current']['wind'] = translate('wind', 'weather') . " " . $wind_speed;
			// when there is no wind, direction is blank
			if ($parsed_json->{'currentConditions'}->{'windspeed'} != 0)
				$this->data['current']['wind'] .= " " . translate('from', 'weather') . " " . $wind_dir;
			if ($wind_gust > 0)
				$this->data['current']['wind'] .= ", " . translate('wind_gust', 'weather') . " " . $wind_gust;

			$this->data['current']['more'] = translate('humidity', 'weather') . " " . transunit('%', (float)$parsed_json->{'currentConditions'}->{'humidity'});
			$this->data['current']['misc'] = translate('air pressure', 'weather') . " " . $parsed_json->{'currentConditions'}->{'pressure'}.' hPa';

			// forecast
			$i = 0;
			foreach ($parsed_json->{'days'} as $day) {
				if ((int)$day->{'datetimeEpoch'} < mktime(0, 0, 0) || (int)$day->{'datetimeEpoch'} > time() + 3 * 24 * 60 * 60) // next 4 days only
					continue;

				$this->data['forecast'][$i]['date'] = date('Y-m-d', (int)$day->{'datetimeEpoch'});
				$this->data['forecast'][$i]['conditions'] = (string)$day->{'conditions'};
				$this->data['forecast'][$i]['icon'] = $this->icon((string)$day->{'icon'});

				$this->data['forecast'][$i]['temp'] = round((float)$day->{'tempmax'}, 0) . '&deg;/' . round((float)$day->{'tempmin'}, 0) . '&deg;';

				$i++;
			}
			if( preg_match('/[A-Za-z]/', $location))
				$this->data['city'] = $location;
			else {
				$coordinates = explode(',', $location);
				$this->data['city'] = getLocation($coordinates[0],$coordinates[1]);
			}

		} else {
			$add= '';
			if ($loadError != '')
				$add = $loadError;
			$this->error('Weather: visualcCrossing.com', 'Read request failed'.($add ? ' with message: <br>'.$add : '!'));
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

$service = new weather_visualcrossing(array_merge($_GET, $_POST));
echo $service->json();

?>
