<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */


require_once '../../../config.php';
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
        
        if ($cache->hit())
            $parsed_json = json_decode($cache->read());
        else
        {
            $url = 'http://api.wunderground.com/api/'.config_weather_key.'/conditions/forecast/lang:DL/q/'.urlencode($this->location).'.json';
            $parsed_json = json_decode($cache->write(file_get_contents($url)));
        }
        $this->debug($parsed_json);  
          
        if($parsed_json)
        {
            // today
            $this->data['city'] = (string)$parsed_json->{'current_observation'}->{'display_location'}->{'city'};
            
            if (config_lang == 'de')
                $this->data['current']['temp'] = (int)$parsed_json->{'current_observation'}->{'temp_c'}.'&deg;C';
            elseif (config_lang == 'nl')
                $this->data['current']['temp'] = (int)$parsed_json->{'current_observation'}->{'temp_c'}.'&deg;C';
            else
                $this->data['current']['temp'] = (int)$parsed_json->{'current_observation'}->{'temp_f'}.'&deg;F';
            
            $this->data['current']['conditions']   = (string)$parsed_json->{'current_observation'}->{'weather'};
            $this->data['current']['icon']         = $this->icon((string)$parsed_json->{'current_observation'}->{'icon'});
            $this->data['current']['wind']         = (string)$parsed_json->{'current_observation'}->{'wind_string'}; 
            $this->data['current']['more']         = (string)$parsed_json->{'current_observation'}->{'relative_humidity'};
        
            // forecast
            $i=0;
            foreach($parsed_json->{'forecast'}->{'simpleforecast'}->{'forecastday'} as $day)
            {
                $this->data['forecast'][$i]['date']        = (string)$day->{'date'}->{'year'}.'-'.(string)$day->{'date'}->{'month'}.'-'.(string)$day->{'date'}->{'day'};
                $this->data['forecast'][$i]['conditions']  = (string)$day->{'conditions'}; 
                $this->data['forecast'][$i]['icon']        = $this->icon((string)$day->{'icon'});
                $this->data['forecast'][$i]['temp']        = (int)$day->{'low'}->{'celsius'}.'&deg;/'.(int)$day->{'high'}->{'celsius'}.'&deg;';
                $i++;
            }
        }
        else
            $this->error('Weather: wounderground.com', 'Read request failed!');
    }


   /*
    * Icon-Mapper
    */
    function icon($name)
    {
        $ret = '';
        
        $icon["sunny"]              = "sun_1";
        $icon["mostlysunny"]        = "sun_2";
        $icon["clear"]              = "sun_2";
        $icon["partlycloudy"]       = "sun_3";
        $icon["mostlycloudy"]       = "sun_5";
        $icon["mist"]               = "sun_6";
        $icon["chancerain"]         = "sun_7";
        $icon["rain"]               = "cloud_8";
        $icon["chancestorm"]        = "sun_9";
        $icon["storm"]              = "sun_10";
        $icon["chancesnow"]         = "sun_11";
        $icon["snow"]               = "sun_12";  
        
        $icon["cloudy"]             = "cloud_4";
        $icon["showers"]            = "cloud_8";
        $icon["thunderstorm"]       = "cloud_10";
        $icon["rain_snow"]          = "cloud_15";
        $icon["foggy"]              = "cloud_6";
        $icon["fog"]                = "cloud_6";
        $icon["icy"]                = "cloud_16";
        $icon["smoke"]              = "na";
        $icon["dusty"]              = "na";
        $icon["hazy"]               = "na"; 
        
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