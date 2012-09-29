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
    
    // api call 
    $url = 'http://.../api?location='.$location.'&lang='.$lang;
    
    
    // today
    $weather['city'] = ucfirst($location);
    
    if (config_lang == "de")
        $weather['current']['temp']   = '25&deg;C';
    else
        $weather['current']['temp']   = '10&deg;F';
    
    $weather['current']['conditions']   = 'sunny';
    $weather['current']['icon']         = icon('sunny');
    $weather['current']['wind']         = 'light winds from NO at 5 MPH'; 
    $weather['current']['more']         = '45%, 1050 hPa'; 
    
    // forecast
    $days = 4;
    for ($i = 0; $i < $days; $i++) {
        $weather['forecast'][$i]['date']        = date('D', time() + 24 * 60 * 60 * ($i + 1));
        $weather['forecast'][$i]['conditions']  = 'sunny';                 
        $weather['forecast'][$i]['icon']        = 'sun_'.rand(1,5);
        $weather['forecast'][$i]['temp']        = rand(22, 25).'&deg; / '.rand(18, 20).'&deg;';
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
        
        $ret = $icon[$name];
        
        return $ret;
    }
?>