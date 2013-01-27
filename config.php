<?php
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
    define ('config_version',               '2.2');
    

// -----------------------------------------------------------------------------
// C O M M U N I C A T I O N
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

  /**
    * Use the realtime-mode if possible
    */
    define ('config_driver_realtime',       false);
    

// -----------------------------------------------------------------------------
// U S E R - I N T E R F A C E
// -----------------------------------------------------------------------------
    
  /**
    * The name of the stylesheet. Results in NAME.min.css
    * You may change your design with the jquerymobile theme roller
    *     
    * @link     http://jquerymobile.com/themeroller/        
    */
    define ('config_design',                'greenhornet');
   
  /**
    * smartVISU supports different projects, located under 'pages'
    * this is the directory for your project    
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
// W I D G E T S
// -----------------------------------------------------------------------------

  /**
    * Which service should by used?
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
    * Which phone-system should by used?
    * 
    * @value    offline: random values
    * @value    auerswald: Auerswald VoiP 5010, 5020, Commander Basic.2
    * @value    fritz!box: Fritzbox 7050 
    * @value    fritz!box_v5.50: Fritzbox 7390        
    */
    define ('config_phone_service',         'offline');

  /**
    * What is the ip-address of the phone-system?
    */
    define ('config_phone_server',          '192.168.x.x');
 
  /**
    * Is there a user to authenticate?
    */
    define ('config_phone_user',            '');
  
  /**
    * Is there a user to authenticate?
    */
    define ('config_phone_pass',            '');  
    
      
  /**
    * Which calender should be used?
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
// C O M M O N
// -----------------------------------------------------------------------------
    
// Normally, no need to change values here!

  /**
    * Path of smartVISU
    */
    define ('const_path',                   dirname(__FILE__).'/');

  /**
    * Path of system-directory
    */
    define ('const_path_system',            const_path.'lib/'); 

  /**
    * Special design variable. Defines the eye cancer of using a flavor.
    */
    define ('const_cvsucks',                10);
   
  /**
    * The timezone
    */    
    date_default_timezone_set(              'Europe/Berlin');

  /**
    * Change permissions to enable delete in temp dir
    */    
    umask(                                  0002);
 
  /**
    * PHP Error-level
    */    
    error_reporting(                        'E_ALL & ~E_NOTICE');
?>
