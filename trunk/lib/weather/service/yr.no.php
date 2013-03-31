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
class weather_yr extends weather
{

  /** 
	* retrieve the content
	*/     
    public function run()
    {
        // api call 
        $cache = new class_cache('yr.no_'.substr(strrchr($this->location, '/'), 1).'.xml');
        
        if ($cache->hit())
            $xml = simplexml_load_string($cache->read());
        else
        {
            $url = 'http://www.yr.no/place/'.urlencode($this->location).'/forecast.xml';
            $xml = simplexml_load_string($cache->write(file_get_contents($url)));
        }
          
        if($xml)
        {
            //today
            $this->data['city']       = (string)$xml->location->name;
            
            // forecast
            $i = 0;
            foreach($xml->forecast->tabular->time as $day)
            {
                if (config_lang == 'de')
                    $windspeed = ' mit '.round( ((string)$day->windSpeed->attributes()->mps * 3.6), 1).' km/h';
                elseif (config_lang == 'nl')
                    $windspeed = ' mit '.round( ((string)$day->windSpeed->attributes()->mps * 3.6), 1).' km/u';
                else
                    $windspeed = ' at '.round( ((string)$day->windSpeed->attributes()->mps * 2.24), 1).' MPH';
                
                if ($i == 0)
                {
                    $this->data['current']['date']        = (string)$day->attributes()->from;
                    $this->data['current']['conditions']  = translate((string)$day->symbol->attributes()->name, 'yr.no');
                    $this->data['current']['wind']		  = translate((string)$day->windSpeed->attributes()->name.' from '.(string)$day->windDirection->attributes()->code, 'yr.no').$windspeed;
                    $this->data['current']['icon']        = $this->icon((string)$day->symbol->attributes()->number);
                    $this->data['current']['temp']        = (float)$day->temperature->attributes()->value.'&deg;C';
                    $this->data['current']['more']        = (int)$day->pressure->attributes()->value.' hPa';
                    $i++;
                }
                
                if ($i < 5 and $day->attributes()->period == 2)
                {
                    
                    $this->data['forecast'][$i]['date']        = (string)$day->attributes()->from;
                    $this->data['forecast'][$i]['conditions']  = translate((string)$day->symbol->attributes()->name, 'yr.no');
                    $this->data['forecast'][$i]['wind']        = translate((string)$day->windSpeed->attributes()->name.' from '.(string)$day->windDirection->attributes()->code, 'yr.no').$windspeed;
                    $this->data['forecast'][$i]['icon']        = $this->icon((string)$day->symbol->attributes()->number);
                    $this->data['forecast'][$i]['temp']        = (float)$day->temperature->attributes()->value.'&deg;C';
                    $this->data['forecast'][$i]['more']        = (int)$day->pressure->attributes()->value.' hPa';
                    $i++;
                }
            }
        }
        else
            $this->error('Weather: yr.no', 'Read request failed!');
     
    }
    
   /*
    * Icon-Mapper
    */
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

}
   

// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new weather_yr(array_merge($_GET, $_POST));
echo $service->json();

?>
