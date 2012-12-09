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
    

/** 
 * This class generates a weather
 */   
class weather_offline extends weather
{

  /** 
	* retrieve the content
	*/     
    public function run()
    {
        // today
        $this->data['city'] = ucfirst($this->location);
        
        if (config_lang == "de")
            $this->data['current']['temp']   = '25&deg;C';
        else
            $this->data['current']['temp']   = '10&deg;F';
        
        $this->data['current']['conditions']   = 'sunny';
        $this->data['current']['icon']         = 'sun_1';
        $this->data['current']['wind']         = 'light winds from NO at 5 MPH'; 
        $this->data['current']['more']         = '45%, 1050 hPa'; 
        
        // forecast
        $days = 4;
        for ($i = 0; $i < $days; $i++)
        {
            $this->data['forecast'][$i]['date']        = date('Y-m-d', time() + 24 * 60 * 60 * ($i + 1));
            $this->data['forecast'][$i]['conditions']  = 'sunny';                 
            $this->data['forecast'][$i]['icon']        = 'sun_'.rand(1,5);
            $this->data['forecast'][$i]['temp']        = rand(22, 25).'&deg;/'.rand(18, 20).'&deg;';
        }
    }
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new weather_offline(array_merge($_GET, $_POST));
echo $service->json();

?>