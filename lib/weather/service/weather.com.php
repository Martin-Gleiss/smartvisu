<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Alexander Zeh
 * @copyright   2019
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


require_once '../../../lib/includes.php';
require_once const_path_system.'weather/weather.php';
require_once const_path_system.'class_cache.php';


/**
 * This class generates a weather
 */
class weather_weather extends weather
{
	/**
	 * retrieve the content
	 */
	public function run()
	{
		$units = trans('weather.com', 'units');				// temp | precip | dist | speed | pressure  
		$data_node = 'metric';								//	°C  |   mm   |  km  |  km/h | millibar / hPa
		if ($units == "e") 	$data_node = 'imperial';		//  °F  |  inch  |  mi  |  mph  | inHg 
		if ($units == "h") 	$data_node = 'uk_hybrid';		//  °C  |   mm   |  mi  |  mph  | millibar / hPa
		// s = "metric SI" not used yet							°C  |   mm   |  m   |  m/s  | millibar / hPa

		// api call 
		$cache = new class_cache('weather_'.$this->location.'_current.json');
		if ($cache->hit($this->cache_duration_minutes))
		{
			$content = $cache->read();
		}
		else
		{
			$loadError_current = '';
			// API Doc: https://developer.ibm.com/apis/catalog/weather--current-condition-apis/api/API--weather--personal-weather-station-pws-observations-_-current-conditions
			$url = 'https://api.weather.com/v2/pws/observations/current?stationId='.$this->location.'&format=json&units='.$units.'&apiKey='.config_weather_key;
			$content = file_get_contents($url);
			if (substr($this->errorMessage, 0, 17) != 'file_get_contents')
				$cache->write($content);
			else
				$loadError_current = substr(strrchr($this->errorMessage, ':'), 2);
		}

		$cache_forecast = new class_cache('weather_'.$this->location.'_forecast.json');
		if ($cache_forecast->hit($this->cache_duration_minutes))
		{
			$content_forecast = $cache_forecast->read();
		}
		else
		{
			$loadError_forecast = '';
			// API Doc: https://developer.ibm.com/apis/catalog/weather--weather-forecast-apis/api/API--weather--daily-forecast-api-3_0#SUNv3DailyForecast
			$url_forecast = 'https://api.weather.com/v3/wx/forecast/daily/5day?postalKey='.config_weather_postal.'&units='.$units.'&language='.trans('weather', 'lang').'&format=json&apiKey='.config_weather_key;
			$content_forecast = file_get_contents($url_forecast);
			if (substr($this->errorMessage, 0, 17) != 'file_get_contents')
				$cache_forecast->write($content_forecast);
			else
				$loadError_forecast = substr(strrchr($this->errorMessage, ':'), 2);
		}

		// parse current
		$parsed_json = json_decode($content);
		if ($parsed_json->{'observations'})
		{
			$this->debug($parsed_json);

			// today
			$this->data['city'] = trim((string)$parsed_json->{'observations'}[0]->{'neighborhood'});
			$this->data['current']['temp'] = transunit('temp', (float)$parsed_json->{'observations'}[0]->{$data_node}->{'temp'});
			$this->data['current']['conditions'] = '';
			$this->data['current']['icon'] = $this->icon(100);

			$wind_speed = transunit('speed', (float)$parsed_json->{'observations'}[0]->{$data_node}->{'windSpeed'});
			$wind_gust = transunit('speed', (float)$parsed_json->{'observations'}[0]->{$data_node}->{'windGust'});
			$wind_dir = weather::getDirection((float)$parsed_json->{'observations'}[0]->{'winddir'});
			$wind_desc = weather::getWindDescription($wind_speed);
			$this->data['current']['wind'] = $wind_desc." ".translate('from', 'weather'). ' '. $wind_dir." ".translate('at', 'weather')." ".$wind_speed;
			if ($wind_gust > 0)
				$this->data['current']['wind'] .= ", ".translate('wind_gust', 'wunderground')." ".$wind_gust;

			$this->data['current']['more'] = translate('humidity', 'weather')." ".(string)$parsed_json->{'observations'}[0]->{'humidity'}." %";
			$this->data['current']['misc'] = translate('air pressure', 'weather')." ".(string)$parsed_json->{'observations'}[0]->{$data_node}->{'pressure'}.($units == "e" ? " inHg" : " hPa");
		}
		else
		{
			if ($loadError_current != '')
				$add = $loadError_current;
			else
				$add = $parsed_json->{'response'}->{'error'}->{'description'};
			$this->error('Weather: weather.com', 'Current read request failed'.($add ? ' with message: <br>'.$add : '!'));
		}
		
		// parse forecast
		$parsed_json_forecast = json_decode($content_forecast);
		if ($parsed_json_forecast->{'narrative'})
		{
			$this->data['current']['conditions'] = (string)$parsed_json_forecast->{'narrative'}[0];
			
			if($parsed_json_forecast->{'daypart'}[0]->{'iconCode'}[0] != NULL)
			{
				$this->data['current']['icon'] = $this->icon((int)$parsed_json_forecast->{'daypart'}[0]->{'iconCode'}[0]);
			}
			elseif($parsed_json_forecast->{'daypart'}[0]->{'iconCode'}[1] != NULL)
			{
				$this->data['current']['icon'] = $this->icon((int)$parsed_json_forecast->{'daypart'}[0]->{'iconCode'}[1]);
			}
			
			for ($i = 1; $i <= 4; $i++)
			{
				$this->data['forecast'][$i]['date'] = (string)$parsed_json_forecast->{'daypart'}[0]->{'daypartName'}[$i];
				$this->data['forecast'][$i]['conditions'] = (string)$parsed_json_forecast->{'daypart'}[0]->{'wxPhraseLong'}[$i];
				$this->data['forecast'][$i]['icon'] = $this->icon((int)$parsed_json_forecast->{'daypart'}[0]->{'iconCode'}[$i]);
				$this->data['forecast'][$i]['temp'] = transunit('weathertemp',(float)$parsed_json_forecast->{'daypart'}[0]->{'temperature'}[$i]);
			}
		}
		else
		{
			if ($loadError_forecast != '')
				$add = $loadError_forecast;
			else
				$add = $parsed_json->{'response'}->{'error'}->{'description'};
			$this->error('Weather: weather.com', 'Forecast read request failed'.($add ? ' with message: <br>'.$add : '!'));
		}
	}

	/*
	* Icon-Mapper
	*/
	function icon($iconIndex)
	{
		$ret = '';

		$icon[100] = 'na';
		$icon[0] = 'tornado_1';
		$icon[1] = 'na';
		$icon[2] = 'na';
		$icon[3] = 'cloud_10';
		$icon[4] = 'cloud_10';
		$icon[5] = 'cloud_15';
		$icon[6] = 'cloud_14';
		$icon[7] = 'cloud_14';
		$icon[8] = 'cloud_17';
		$icon[9] = 'cloud_7';
		$icon[10] = 'cloud_17';
		$icon[11] = 'cloud_7';
		$icon[12] = 'cloud_8';
		$icon[13] = 'cloud_10';
		$icon[14] = 'cloud_12';
		$icon[15] = 'cloud_12';
		$icon[16] = 'cloud_13';
		$icon[17] = 'cloud_11';
		$icon[18] = 'cloud_15';
		$icon[19] = 'wind';
		$icon[20] = 'fog';
		$icon[21] = 'fog';
		$icon[22] = 'fog';
		$icon[23] = 'wind';
		$icon[24] = 'wind';
		$icon[25] = 'cloud_16';
		$icon[26] = 'cloud_4';
		$icon[27] = 'moon_5';
		$icon[28] = 'sun_5';
		$icon[29] = 'moon_4';
		$icon[30] = 'sun_4';
		$icon[31] = 'moon_1';
		$icon[32] = 'sun_1';
		$icon[33] = 'moon_2';
		$icon[34] = 'sun_2';
		$icon[35] = 'cloud_11';
		$icon[36] = 'high';
		$icon[37] = 'sun_9';
		$icon[38] = 'sun_10';
		$icon[39] = 'sun_8';
		$icon[40] = 'cloud_8';
		$icon[41] = 'sun_13';
		$icon[42] = 'cloud_12';
		$icon[43] = 'cloud_16';
		$icon[44] = 'na';
		$icon[45] = 'moon_7';
		$icon[46] = 'moon_13';
		$icon[47] = 'moon_9';

		$ret = $icon[$iconIndex];

		return $ret;
	}
	
	public function prepare()
	{
	}
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new weather_weather(array_merge($_GET, $_POST));
echo $service->json();

?>