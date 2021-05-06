<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      knatter
 * @copyright   30.04.2020
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @hide		weather_postal
 */
 
 /**
 * Releasenotes:
 * 13.04.20 : Initial Version
 * 30.04.20 : fixed overflow issue to next month
 * 17.11.20 : Metadata for config page added by wvhn
 */

require_once '../../../lib/includes.php';
require_once const_path_system.'weather/weather.php';
require_once const_path_system.'class_cache.php';


/**
 * This class generates a weather 
 */
class weather_openweathermap extends weather
{

	/**
	 * retrieve the content
	 */
	public function run()
	{
		// api call 
		$cache = new class_cache('openweathermap_'.$this->location.'.json');
			//error_log($this->cache_duration_minutes);

		if ($cache->hit($this->cache_duration_minutes))
		{
			$content = $cache->read();
			//error_log('hit');
		}
		else
		{
			//no cache hit
			$loadError = '';
			//if location is given by id=..., lat=...&lon= or zip=... (postal code), a '=' is in the string
			//otherwise consider it to be the city name
			if (strpos($this->location,'=') === false)
				$this->location = 'q='.$this->location;
			$url_current = 'http://api.openweathermap.org/data/2.5/weather?'.$this->location.'&lang='.trans('openweathermap', 'lang').'&units='.trans('openweathermap','units').'&appid='.config_weather_key;
			$url_forecast = 'http://api.openweathermap.org/data/2.5/forecast?'.$this->location.'&lang='.trans('openweathermap', 'lang').'&units='.trans('openweathermap','units').'&appid='.config_weather_key;
			$content = '{"today":'.file_get_contents($url_current).', "forecast":'.file_get_contents($url_forecast).'}';
			if (substr($this->errorMessage, 0, 17) != 'file_get_contents')
				$cache->write($content);
			else
				$loadError = substr(strrchr($this->errorMessage, ':'), 2);
		}

		$parsed_json = json_decode($content);
		if ($parsed_json->{'today'}->{'main'})
		{
			// current
			$this->debug($parsed_json);
			$this->data['city'] = (string)$parsed_json->{'today'}->{'name'};
			$this->data['current']['temp'] = transunit('temp', (float)$parsed_json->{'today'}->{'main'}->{'temp'});
			$this->data['current']['icon'] = $this->icon(substr((string)$parsed_json->{'today'}->{'weather'}[0]->{'icon'}, 0, -1), $this->icon_sm);
			$this->data['current']['conditions'] = (string)$parsed_json->{'today'}->{'weather'}[0]->{'description'};
			$wind_speed = transunit('speed', (float)$parsed_json->{'today'}->{'wind'}->{'speed'});
			$wind_dir = weather::getDirection((float)$parsed_json->{'today'}->{'wind'}->{'deg'});
			$wind_desc = weather::getWindDescription ($wind_speed);
			$this->data['current']['wind'] = $wind_desc.' '.translate('from', 'weather').' '.$wind_dir.' '.translate('at', 'weather').' '.$wind_speed;
			$this->data['current']['more'] = translate('humidity', 'weather').' '.(float)$parsed_json->{'today'}->{'main'}->{'humidity'}.'%';
			$this->data['current']['misc'] = translate('air pressure', 'weather').' '.(float)$parsed_json->{'today'}->{'main'}->{'pressure'}.' hPa';		

			// forecast
			// openweathermap provides forecast infos for 5days in 3h slots (free account)
			$i = -1;
			$add = '';
			$tempMin = 100;
			$tempMax = -100;
			$nextday = (date('w', (int)$parsed_json->{'today'}->{'dt'})+1) %7;
			foreach ($parsed_json->{'forecast'}->{'list'} as $day)
			{
				$fday = date('w', (int)$day->{'dt'});
				if($fday == $nextday)
				{ 
					if($i >= 0)
					{
						$init = false;
						$this->data['forecast'][$i]['temp'] = transunit('weathertemp', round($tempMax, 0)).'/'.transunit('weathertemp', round($tempMin, 0));
						$add = $add." ID:".$i.$this->data['forecast'][$i]['temp'];
					}
					$nextday = ($fday+1) % 7;
					$tempMin = 100;
					$tempMax = -100;					
					if (++$i>3)
					  break;				
				}
				// take min/max temps from night/day
				if((float)$day->{'main'}->{'temp'} >  $tempMax)
					$tempMax = (float)$day->{'main'}->{'temp'};
				if((float)$day->{'main'}->{'temp'} <  $tempMin)
					$tempMin = (float)$day->{'main'}->{'temp'};

				if(($i >=0)&&(date('G', (int)$day->{'dt'}) > 11)&&(date('G', (int)$day->{'dt'}) <= 14))
				{ // take forecast icons and descriptions out of midday
					$this->data['forecast'][$i]['date'] = date('Y-m-d', (int)$day->{'dt'});
					$this->data['forecast'][$i]['conditions'] = (string)$day->{'weather'}[0]->{'description'};
					$this->data['forecast'][$i]['icon'] = $this->icon(substr((string)$day->{'weather'}[0]->{'icon'}, 0, -1));
					$add = $add." ".$this->data['forecast'][$i]['date'].$this->data['forecast'][$i]['conditions'].$this->data['forecast'][$i]['icon'];
				}
			}
		}
		else
		{
			if ($loadError != '')
				$add = $loadError;
			else
				$add = $parsed_json->{'response'}->{'error'}->{'description'};
							
			$this->error('Weather: openweathermap.org', 'Read request failed'.($add ? ' with message: <br>'.$add : '!'));
		}	
	}

	/*
	* Icon-Mapper
	*/
	function icon($name, $sm = 'sun_')
	{
		$ret = '';

		$icon['01'] = $sm.'1'; 					// sky clear
		$icon['02'] = $sm.'2';					// few clouds
		$icon['03'] = $sm.'3';					// scattered clouds
		$icon['04'] = $sm.'5';					// broken clouds
		$icon['50'] = $sm.'6';					// mist
		$icon['09'] = $sm.'7';					// shower rain
		$icon['10'] = 'cloud_8';				// rain
		$icon['13'] = $sm.'13';					// snow
		$icon['11'] = 'cloud_10';				// thunderstorm

		$ret = $icon[$name];

		return $ret;
	}
}

		
// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new weather_openweathermap(array_merge($_GET, $_POST));
echo $service->json();

?>
