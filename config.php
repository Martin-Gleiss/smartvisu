<?
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */


  /**
    * Version of smartVISU
    */
    define ('config_version',               '2.0');
    

// -----------------------------------------------------------------------------
// Communication
// -----------------------------------------------------------------------------

  /**
    * Driver to KNX
    */
    define ('config_driver',                'offline');
  
  /**
    * The address, might be a url or filename
    */
    define ('config_driver_address',        '192.168.x.x');

  /**
    * The port, if the driver needs one
    */
    define ('config_driver_port',           '1028');


// -----------------------------------------------------------------------------
// User-Interface
// -----------------------------------------------------------------------------
    
  /**
    * The name of the stylesheet. Results in NAME.min.css
    * You may change your desing with the jquerymobile theme roller
    *     
    * @link     http://jquerymobile.com/themeroller/        
    */
    define ('config_design',                'night');
   
  /**
    * smartVISU supports different projects, located under 'pages'
    * this ist the directory for your project    
    */
    define ('config_pages',                 'docu');
   
  /**
    * Select your language. Some widgets are multilanguage 
    */
    define ('config_lang',                  'de');
     
  /**
    * The default page loaded in the project directory   
    */
    define ('config_index',                 'index');

  /**
    * The title of the html-pages  
    */
    define ('config_title',                 'YOUR NAME [smartVISU]');
    
  /**
    * Is the page-cache enabled?
    */
    define ('config_cache',                 false);

  /**
    * the refresh-delay between glued widgets 
    */
    define ('config_delay',                 '750');


// -----------------------------------------------------------------------------
// Widgets
// -----------------------------------------------------------------------------

  /**
    * Witch service should by used?
    * 
    * @value    offline: random values
    * @value    google: google api (deprecated)
    * @value    wunderground: get key: http://www.wunderground.com/weather/api  
    * @value    yr.no: http://www.yr.no       
    */
    define ('config_weather_service',       'offline');

  /**
    * What is the default location?
    */
    define ('config_weather_location',      'Germany/Bayern/Würzburg');
 
  /**
    * Is there a key for the service?
    */
    define ('config_weather_key',           '');
    
  
  /**
    * Witch phone-system should by used?
    * 
    * @value    offline: random values
    * @value    auerswald: Auerswald VoiP 5010, 5020, Commander Basic.2
    * @value    fritzbox: Firtzbox 7050     
    */
    define ('config_phone_service',         'offline');

  /**
    * What is the ip-address of the phone-system?
    */
    define ('config_phone_server',          '192.168.x.x');
 
  /**
    * Is there a user to autheticate?
    */
    define ('config_phone_user',            '');
  
  /**
    * Is there a user to autheticate?
    */
    define ('config_phone_pass',            '');  
    
      
  /**
    * Witch calender should be used?
    * 
    * @value offline: random values
    * @value google: Google Calendar            
    */
    define ('config_calendar_service',      'offline');
  
  /**
    * What is the private url?
    */
    define ('config_calendar_url',          'http://www.google.com/calendar/feeds/...'); 
    

// -----------------------------------------------------------------------------
// Common
// -----------------------------------------------------------------------------
    
// Normaly, no need to change values here!

  /**
    * Path of smartVISU
    */
    define ('const_path',                   dirname(__FILE__).'/');

  /**
    * Path of system-directory
    */
    define ('const_path_system',            const_path.'lib/'); 
    
    date_default_timezone_set('Europe/Berlin');
?>