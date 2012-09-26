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
    
    // Tyskland/Bayern/Würzburg
    $location = $request['location'];  
    $lang = $request['lang'];
    
    // api call 
    $url = 'http://www.yr.no/place/'.$location.'/forecast.xml';
    $xml = simplexml_load_string(file_get_contents($url));
    
     // today
    $weather['city']       = (string)$xml->location->name;
    
    // forecast
    $i = 0;
    foreach($xml->forecast->tabular->time as $day) {
        if ($i == 0) {
            $weather['current']['date']        = date('D', strtotime((string)$day->attributes()->from));
            $weather['current']['conditions']  = (string)$day->symbol->attributes()->name;                 
            $weather['current']['wind']        = (string)$day->windSpeed->attributes()->name.' from '.(string)$day->windDirection->attributes()->code.' at '.(string)$day->windSpeed->attributes()->mps.' MPH';                 
            $weather['current']['icon']        = icon((string)$day->symbol->attributes()->number);
            $weather['current']['temp']        = (float)$day->temperature->attributes()->value.'&deg;C';
            $weather['current']['more']        = (int)$day->pressure->attributes()->value.' hPa';
            $i++;
        }
        
        if ($i < 5 and $day->attributes()->period == 2) {
            $weather['forecast'][$i]['date']        = date('D', strtotime((string)$day->attributes()->from));
            $weather['forecast'][$i]['conditions']  = (string)$day->symbol->attributes()->name;                 
            $weather['forecast'][$i]['wind']        = (string)$day->windSpeed->attributes()->name.' from '.(string)$day->windDirection->attributes()->code.' at '.(string)$day->windSpeed->attributes()->mps.' MPH';                 
            $weather['forecast'][$i]['icon']        = icon((string)$day->symbol->attributes()->number);
            $weather['forecast'][$i]['temp']        = (float)$day->temperature->attributes()->value.'&deg;C';
            $weather['forecast'][$i]['more']        = (int)$day->pressure->attributes()->value.' hPa';
            $i++;
        }
    }
  
    echo json_encode($weather);
    
    
// -----------------------------------------------------------------------------
// I C O N - M A P P E R
// -----------------------------------------------------------------------------

    function icon($name)
    {
        $ret = '';
        
        /*
        1 sun
        2 lightcloud
        3 partlycloud
        4 cloud
        5 lightrainsun
        6 lightrainthundersun
        7 sleetsun
        8 snowsun
        9 lightrain
        10 rain
        11 rainthunder
        12 sleet
        13 snow
        14 snowthunder
        15 fog
        16 sun ( used for winter darkness )
        17 lightcloud ( winter darkness )
        18 lightrainsun ( used for winter darkness )
        19 snowsun ( used for winter darkness )
        20 sleetsunthunder
        21 snowsunthunder
        22 lightrainthunder
        23 sleetthunder
        */
    
        $icon[1]                    = "sun_1";
        $icon[2]                    = "sun_2";
        $icon[3]                    = "sun_3";
        $icon[4]                    = "sun_5";
        $icon[5]                    = "sun_7";
        $icon[6]                    = "sun_9";
        $icon[7]                    = "sun_11";
        $icon[7]                    = "sun_13";
        
        $icon[9]                    = "cloud_7";
        $icon[10]                   = "cloud_8";
        $icon[11]                   = "cloud_10";
        $icon[12]                   = "cloud_11";
        $icon[13]                   = "cloud_13";
        $icon[14]                   = "cloud_15";
        $icon[15]                   = "cloud_6";
        
        $icon[20]                   = "sun_10";
        $icon[21]                   = "sun_10";
        $icon[22]                   = "cloud_10";
        $icon[23]                   = "cloud_17";
        
        $ret = $icon[$name];
        
        return $ret;
    }    
?>