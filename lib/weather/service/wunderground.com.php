<?
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Florian Meister
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */

    // get config-variables 
    require_once '../../../config.php';
    require_once const_path_system.'class_cache.php';
    
    // init parameters
    $request = array_merge($_GET, $_POST);
     
    $location = $request['location'];
    $lang = $request['lang'];
    
    if($lang == 'de')
        $wlang = 'DL';
    else
        $wlang = strtoupper($lang);
    
    // api call 
    $cache = new class_cache('wunderground_'.$location.'.json');
    
    if ($cache->hit())
        $parsed_json = json_decode($cache->read());
    else
    {
        $url = 'http://api.wunderground.com/api/'.config_weather_key.'/conditions/forecast/lang:'.$wlang.'/q/'.$location.'.json';
        $parsed_json = json_decode($cache->write(file_get_contents($url)));
    }
      
    if($parsed_json)
    {
        // today
        $weather['city'] = (string)$parsed_json->{'current_observation'}->{'display_location'}->{'city'};
        
        if (config_lang == 'de')
            $weather['current']['temp'] = (int)$parsed_json->{'current_observation'}->{'temp_c'}.'&deg;C';
        else
            $weather['current']['temp'] = (int)$parsed_json->{'current_observation'}->{'temp_f'}.'&deg;F';
        
        $weather['current']['conditions']   = (string)$parsed_json->{'current_observation'}->{'weather'};
        $weather['current']['icon']         = icon((string)$parsed_json->{'current_observation'}->{'icon'});
        $weather['current']['wind']         = (string)$parsed_json->{'current_observation'}->{'wind_string'}; 
        $weather['current']['more']         = (string)$parsed_json->{'current_observation'}->{'relative_humidity'};
    
        // forecast
        $i=0;
        foreach($parsed_json->{'forecast'}->{'simpleforecast'}->{'forecastday'} as $day) {
            $weather['forecast'][$i]['date']        = (string)$day->{'date'}->{'weekday'};
            $weather['forecast'][$i]['conditions']  = (string)$day->{'conditions'}; 
            $weather['forecast'][$i]['icon']        = icon((string)$day->{'icon'});
            $weather['forecast'][$i]['temp']        = (int)$day->{'low'}->{'celsius'}.'&deg; / '.(int)$day->{'high'}->{'celsius'}.'&deg;';
            $i++;
        }
    
        echo json_encode($weather);
    } 
    else
        header("HTTP/1.0 404 Not Found");
    
    
// -----------------------------------------------------------------------------
// I C O N - M A P P E R
// -----------------------------------------------------------------------------

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
        $icon["rain"]               = "sun_8";
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
?>