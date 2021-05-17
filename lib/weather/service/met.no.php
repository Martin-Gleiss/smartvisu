<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
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
class weather_met extends weather
{

	/**
	 * retrieve the content
	 */
	public function run()
	{
		// api call 
		$cache = new class_cache('met.no_'.preg_replace(array('/=/','/&/'),'',$this->location).'.json');
		
		if ($cache->hit($this->cache_duration_minutes))
			$content = $cache->read();
		else
		{
			$loadError = '';
			$opts = array(
				'http'=>array(
				'method'=>"GET",
				'header'=>"User-Agent: smartVISU"
				)
			);
			$context = stream_context_create($opts);
			$url = 'https://api.met.no/weatherapi/locationforecast/2.0/complete?'.$this->location;
			$content = file_get_contents($url, false, $context);
			if (substr($this->errorMessage, 0, 17) != 'file_get_contents')
				$cache->write($content);
			else
				$loadError = substr(strrchr($this->errorMessage, ':'), 2);
		}
		
		$parsed_json = json_decode($content);
		$this->debug($parsed_json);
		
		if ($parsed_json->{'properties'}->{'timeseries'}['0']) {	
			// night or day symbol of today 
			$actualconditions = $parsed_json->{'properties'}->{'timeseries'}['0']->{'data'}->{'next_1_hours'}->{'summary'}->{'symbol_code'};
			$actualTimeSymbol = substr(strrchr($actualconditions, '_'),1);
			if ($actualTimeSymbol != '') {
				$actualconditions = substr($actualconditions, 0, strpos($actualconditions, '_'));
				$actualTimeSymbol = ($actualTimeSymbol == 'night') ? 'moon_' : 'sun_';
			}
			else
				$actualTimeSymbol = ($this->icon_sm != '') ? $this->icon_sm : 'sun_';
					
			$actualdata = $parsed_json->{'properties'}->{'timeseries'}['0']->{'data'}->{'instant'}->{'details'};
			$wind_dir = weather::getDirection((float)$actualdata->{'wind_from_direction'});
			$wind_speed = transunit('speed',round(3.6*(float)$actualdata->{'wind_speed'}, 1));
			if (substr($wind_speed,-3) =='mph') 
				$wind_speed = transunit('speed',round(2.24*(float)$actualdata->{'wind_speed'}, 1));
			$wind_desc = weather::getWindDescription($wind_speed);
			
			$this->data['current']['temp'] = transunit('temp', (float)$actualdata->{'air_temperature'});
			$this->data['current']['wind'] = $wind_desc.' '.translate('from', 'weather').' '.$wind_dir.' '.translate('at', 'weather').' '.$wind_speed;
			$this->data['current']['more'] = translate('humidity', 'weather')." ".transunit('%', (float)$actualdata->{'relative_humidity'});
			$this->data['current']['misc'] = translate('air pressure', 'weather')." ".(float)$actualdata->{'air_pressure_at_sea_level'}.' hPa';
			$this->data['current']['conditions'] = translate($actualconditions, 'met.no');
			$this->data['current']['icon'] = $this->icon($actualconditions, $actualTimeSymbol);    
			
			// forecast
				// met.no times are UTC based. We need to sustract timezone from local time in order to fit to the UTC data raster.
				// next_12_hours tag contains a conditions summary for 12 hours -> we use the forecast of 06.00 for the day
				// next_6_hours tag contains values for min and max temperatures  
				// -> we use all data from 00.00, 06.00, 12.00 and 18.00 to compute min/max temperature 
				// if actual time is before 13.00 we use the rest of the day as forecast, and conditions from 12.00
			 
			$forecastCondition = 'NA';
			$timezone = (int)date('Z', strtotime($parsed_json->{'properties'}->{'timeseries'}[0]->{'time'}))/3600;
			$i = 0;
			$dayready = 0;
			$nextday = (int)(date('w', strtotime($parsed_json->{'properties'}->{'timeseries'}[0]->{'time'}) - $timezone * 3600)+1) %7;
			$startTime = (24+ (int)date('G', strtotime($parsed_json->{'properties'}->{'timeseries'}[0]->{'time'})) - $timezone) %24;
			$maxtemp = -100;
			$mintemp = 100;
			
			
			foreach ($parsed_json->{'properties'}->{'timeseries'} as $dataset) {
				$timezone = (int)date('Z', strtotime($dataset->{'time'}))/3600;
				$day = (int)date('w', strtotime($dataset->{'time'})- $timezone * 3600);
				$actualTime = (24 +(int)date('G', strtotime($dataset->{'time'})) - $timezone) % 24;
				
				// first day if requested before 12:00
				if ($startTime <= 12 && $i == 0 && $actualTime <= 23 ) {
					$temps = (float)$dataset->{'data'}->{'instant'}->{'details'}->{'air_temperature'};
					if($temps >  $maxtemp) $maxtemp = $temps;
					if($temps <  $mintemp) $mintemp = $temps;
					if ($actualTime == 12)
						$forecastCondition = $dataset->{'data'}->{'next_1_hours'}->{'summary'}->{'symbol_code'};
					if ($actualTime == 23 ) {
						$dayready = 1;
						$nextday = $day;
					}
				}

				$searchTimes = array (0, 6, 12, 18);
				if ($day == $nextday && $dayready == 0) {
					if (in_array ($actualTime, $searchTimes)) {
						$mintemp_6h = (float)$dataset->{'data'}->{'next_6_hours'}->{'details'}->{'air_temperature_min'};
						$maxtemp_6h = (float)$dataset->{'data'}->{'next_6_hours'}->{'details'}->{'air_temperature_max'};
						if($maxtemp_6h >  $maxtemp) $maxtemp = $maxtemp_6h;
						if($mintemp_6h <  $mintemp) $mintemp = $mintemp_6h;
						if ($actualTime == 6) 
							$forecastCondition = $dataset->{'data'}->{'next_12_hours'}->{'summary'}->{'symbol_code'};
						if ($actualTime == 18)
							$dayready = 1;
					}
				}	

				if ($dayready == 1) {
					if (strpos ($forecastCondition,'_') > 0)
						$forecastCondition = substr($forecastCondition, 0, strpos($forecastCondition, '_'));
					$this->data['forecast'][$i]['date'] = date('Y-m-d', strtotime($dataset->{'time'})-$timezone*3600);
					$this->data['forecast'][$i]['conditions'] = translate($forecastCondition, 'met.no');
					$this->data['forecast'][$i]['icon'] = $this->icon($forecastCondition);
					$this->data['forecast'][$i]['temp'] = round($maxtemp, 0).'&deg;C'.'/'.round($mintemp, 0).'&deg;C';
					
					$maxtemp = -100;
					$mintemp = 100;
					$dayready = 0;
					$nextday = ($nextday + 1) %7;
					
					$i++;
					if ($i == 4) break;
				}
			}
			parse_str($this->location, $location);
						
			$this->data['city'] = getLocation($location['lat'],$location['lon']);
		} 
		else
		{
			if ($loadError != '')
				$add = ' with message: <br>'.$loadError;
			else
				$add = ': <br>'.$this->errorMessage;
							
			$this->error('Weather: met.no', 'Read request failed'.$add );
		}	
	}

	/*
		* Icon-Mapper
		*/
	function icon($name, $sm = 'sun_')
	{
		$ret = '';

		$icon['clearsky'] 					= $sm.'1';
		$icon['fair'] 						= $sm.'2';
		$icon['partlycloudy'] 				= $sm.'3';
		$icon['cloudy'] 					= $sm.'5';
		$icon['lightrainshowers'] 			= $sm.'7';
		$icon['rainshowers'] 				= $sm.'7';
		$icon['heavyrainshowers'] 			= $sm.'8';
		$icon['lightrainshowersandthunder'] = $sm.'9';
		$icon['rainshowersandthunder'] 		= $sm.'9';
		$icon['heavyrainshowersandthunder'] = $sm.'10';
		$icon['lightsleetshowersandthunder']= $sm.'10';
		$icon['sleetshowersandthunder'] 	= $sm.'10';
		$icon['heavysleetshowersandthunder']= $sm.'10';
		$icon['lightsnowshowersandthunder']	= $sm.'10';
		$icon['snowshowersandthunder']		= $sm.'10';
		$icon['heavysnowshowersandthunder']	= $sm.'10';
		$icon['lightsleetshowers'] 			= $sm.'11';
		$icon['sleetshowers'] 				= $sm.'11';
		$icon['heavysleetshowers'] 			= $sm.'12';
		$icon['lightsnowshowers'] 			= $sm.'13';
		$icon['snowshowers'] 				= $sm.'13';
		$icon['heavysnowshowers'] 			= $sm.'13';
		$icon['fog'] 						= 'cloud_6';
		$icon['lightrain'] 					= 'cloud_7';
		$icon['rain'] 						= 'cloud_7';
		$icon['heavyrain'] 					= 'cloud_8';
		$icon['lightrainandthunder'] 		= 'cloud_9';
		$icon['rainandthunder'] 			= 'cloud_9';
		$icon['heavyrainandthunder']	 	= 'cloud_10';
		$icon['lightsleet'] 				= 'cloud_11';
		$icon['sleet'] 						= 'cloud_11';
		$icon['heavysleet'] 				= 'cloud_11';
		$icon['lightsnow'] 					= 'cloud_12';
		$icon['snow'] 						= 'cloud_12';
		$icon['heavysnow'] 					= 'cloud_13';
		$icon['lightsnowandthunder']		= 'cloud_15';
		$icon['snowandthunder']				= 'cloud_15';
		$icon['heavysnowandthunder']		= 'cloud_15';
		$icon['lightsleetandthunder']		= 'cloud_17';
		$icon['sleetandthunder'] 			= 'cloud_17';
		$icon['heavysleetandthunder']		= 'cloud_17';
		$icon['NA']							= 'na';
		$ret = $icon[$name];

		return $ret;
	}

}


// -----------------------------------------------------------------------------
// i c o n - f o r m a t
// -----------------------------------------------------------------------------

/*	   	"clearsky_day",
        "clearsky_night",
        "clearsky_polartwilight",
        "fair_day",
        "fair_night",
        "fair_polartwilight",
        "lightssnowshowersandthunder_day",
        "lightssnowshowersandthunder_night",
        "lightssnowshowersandthunder_polartwilight",
        "lightsnowshowers_day",
        "lightsnowshowers_night",
        "lightsnowshowers_polartwilight",
        "heavyrainandthunder",
        "heavysnowandthunder",
        "rainandthunder",
        "heavysleetshowersandthunder_day",
        "heavysleetshowersandthunder_night",
        "heavysleetshowersandthunder_polartwilight",
        "heavysnow",
        "heavyrainshowers_day",
        "heavyrainshowers_night",
        "heavyrainshowers_polartwilight",
        "lightsleet",
        "heavyrain",
        "lightrainshowers_day",
        "lightrainshowers_night",
        "lightrainshowers_polartwilight",
        "heavysleetshowers_day",
        "heavysleetshowers_night",
        "heavysleetshowers_polartwilight",
        "lightsleetshowers_day",
        "lightsleetshowers_night",
        "lightsleetshowers_polartwilight",
        "snow",
        "heavyrainshowersandthunder_day",
        "heavyrainshowersandthunder_night",
        "heavyrainshowersandthunder_polartwilight",
        "snowshowers_day",
        "snowshowers_night",
        "snowshowers_polartwilight",
        "fog",
        "snowshowersandthunder_day",
        "snowshowersandthunder_night",
        "snowshowersandthunder_polartwilight",
        "lightsnowandthunder",
        "heavysleetandthunder",
        "lightrain",
        "rainshowersandthunder_day",
        "rainshowersandthunder_night",
        "rainshowersandthunder_polartwilight",
        "rain",
        "lightsnow",
        "lightrainshowersandthunder_day",
        "lightrainshowersandthunder_night",
        "lightrainshowersandthunder_polartwilight",
        "heavysleet",
        "sleetandthunder",
        "lightrainandthunder",
        "sleet",
        "lightssleetshowersandthunder_day",
        "lightssleetshowersandthunder_night",
        "lightssleetshowersandthunder_polartwilight",
        "lightsleetandthunder",
        "partlycloudy_day",
        "partlycloudy_night",
        "partlycloudy_polartwilight",
        "sleetshowersandthunder_day",
        "sleetshowersandthunder_night",
        "sleetshowersandthunder_polartwilight",
        "rainshowers_day",
        "rainshowers_night",
        "rainshowers_polartwilight",
        "snowandthunder",
        "sleetshowers_day",
        "sleetshowers_night",
        "sleetshowers_polartwilight",
        "cloudy",
        "heavysnowshowersandthunder_day",
        "heavysnowshowersandthunder_night",
        "heavysnowshowersandthunder_polartwilight",
        "heavysnowshowers_day",
        "heavysnowshowers_night",
        "heavysnowshowers_polartwilight"
*/


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new weather_met(array_merge($_GET, $_POST));
echo $service->json();

?>
