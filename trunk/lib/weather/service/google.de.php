<?
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */

    // get config-variables 
    require_once '../../../config.php';
    
    // init parameters
    $request = array_merge($_GET, $_POST);
     
    $location = $request['location'];
    $lang = $request['lang'];
    
    // Anstelle einer Stadt bzw. einer PLZ kann auch kommagetrennt
    // Längen- und Breitengrad eines Ortes angegeben werden,
    // z.B. http://www.google.de/ig/api?weather=,,,48187575,11513672&hl=de
    // für München
    
    $url ="http://www.google.com/ig/api?weather=".$location."&hl=".$lang;
    
    // api call
    $data = mb_convert_encoding(file_get_contents($url), "UTF-8", "ISO-8859-1");
    $xml = simplexml_load_string($data);
    
    // today
    $weather['city']       = (string)$xml->weather->forecast_information->city[data];
    
    if (config_lang == "de")
        $weather['current']['temp']     = (int)$xml->weather->current_conditions->temp_c[data];
    else
        $weather['current']['temp']     = (int)$xml->weather->current_conditions->temp_f[data];
    
    $weather['current']['conditions']   = (string)$xml->weather->current_conditions->condition[data];
    $weather['current']['icon']         = icon((string)$xml->weather->current_conditions->icon[data]);
    $weather['current']['wind']         = (string)$xml->weather->current_conditions->wind_condition[data]; 
    $weather['current']['humidity']     = (string)$xml->weather->current_conditions->humidity[data]; 
    
    // forecast
    $days = 4;
    for ($i = 0; $i < $days; $i++) {
        $weather['forecast'][$i]['date']       = (string)$xml->weather->forecast_conditions[$i]->day_of_week[data];
        $weather['forecast'][$i]['conditions'] = (string)$xml->weather->forecast_conditions[$i]->condition[data];                 
        $weather['forecast'][$i]['icon']       = icon((string)$xml->weather->forecast_conditions[$i]->icon[data]);
        $weather['forecast'][$i]['temp']       = (int)$xml->weather->forecast_conditions[$i]->high[data].'&deg; / '.(int)$xml->weather->forecast_conditions[$i]->low[data].'&deg;';
    }
    
    echo json_encode($weather);
    
    
// -----------------------------------------------------------------------------
// I C O N - M A P P E R
// -----------------------------------------------------------------------------
    function icon($name)
    {
        $ret = '';
        
        $icon['sunny']              = 'sun_1';
        $icon['mostly_sunny']       = 'sun_2';
        $icon['partly_cloudy']      = 'sun_3';
        $icon['mostly_cloudy']      = 'sun_5';
        $icon['mist']               = 'sun_6';
        $icon['chance_of_rain']     = 'sun_7';
        $icon['rain']               = 'sun_8';
        $icon['chance_of_storm']    = 'sun_9';
        $icon['storm']              = 'sun_10';
        $icon['chance_of_snow']     = 'sun_11';
        $icon['snow']               = 'sun_12';  
        
        $icon['cloudy']             = 'cloud_4';
        $icon['showers']            = 'cloud_8';
        $icon['thunderstorm']       = 'cloud_10';
        $icon['rain_snow']          = 'cloud_15';
        $icon['foggy']              = 'cloud_6';
        $icon['fog']                = 'cloud_6';
        $icon['icy']                = 'cloud_16';
        $icon['smoke']              = 'na';
        $icon['dusty']              = 'na';
        $icon['hazy']               = 'na';
        
        $ret = $icon[substr(basename($name), 0, -4)];
        
        return $ret;
    }
?>