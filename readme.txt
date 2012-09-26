/**
 * -----------------------------------------------------------------------------
 * @package     smartVisu
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */

DISCRIPTION
--------------------------------------------------------------------------------
smartVISU is a framework to create a visualisation for a knx-installation with
simple html-pages. To read and write group-telegramms special tags are used.
You don't need to know javscript.


SYSTEMREQUIREMENTS
--------------------------------------------------------------------------------
    -   KNX-Bus
    -   eibd, linknx
    -   Webserver with PHP 5.2.4 
    -   Firefox, Chrome, IE, Safari, iPphone, iPad, Android Phone or Android 
        Tablet
 
 
10 STEP GUIDE:
--------------------------------------------------------------------------------

    For your own Project do the following:
    
    1.  Create a new pages directory in "pages", for example "pages/visu" or 
        "pages/YOURNAME"
        Copy all files from "pages/_template" to "pages/visu" directory
    
    2.  Check the config.php and set the "config_pages" to "visu" or "YOURNAME"
      
    3.  Set the "config_driver" to your KNX-environment
        - linknx: for linxknx and eibd environment
        - offline: only for testing, all GADs will be stored in a textfile 
          ("temp/offline.var")
        - debug: only for testing, all GADs will gather a random number
        
    4.  Create a new page in your pages-directory, for example "mypage.html"
        Note: Do not use "base.html, basic.html, device.html", these are system
        pages
    
    5.  Fill the page with your prefered content and widgets
    
    6.  If you need to change the design, use a "visu.css" - stylesheet file in 
        your pages-directory ("visu" or "YOURNAME")
    
    7.  Change your design (theme) with:
        http://jquerymobile.com/themeroller/
        
        Drop your new design (theme) in the "designs" directory
        Set "config_design" to your new design-name (without .css), mention that
        "NAME.min.css" is been loaded
     
    8.  Test your page with:
        http://localhost/smartVISU/index.php?page=mypage
        Note: replace "localhost" with your hostname from your server      
   
    9.  Create all pages you need
     
   10.  At the end of your project set "config_cache" to "true" to speed up your
        smartVISU
        
        Enjoy smartVISU!
        
 
TODO
--------------------------------------------------------------------------------
    -       Real-time-polling
    -       Advanced driver model
    -       MainMenu: Display selected menu-button
    -       basic.tristate button for rtr-mode
    -       Main: Alert function
    -       Buttons: change icon
    -       Buttons: pressed short / long
 

HISTORY
--------------------------------------------------------------------------------
v 1.7
    - basic.symbol now with text
 
v 1.6  25.09.2012
    - weather-widget now configurable
    - weather-widget with new service: wunderground.com
      generate your key for free at: http://www.wunderground.com/weather/api/
      special thanks to Florian Meister for implementation
    - weather-widget with new service: yr.no
      get your location at: http://www.yr.no
    - iPad improvements
    - fixed basic.glue
    - update lib/jquery 1.8.2
    - update lib/Twig 1.92

v 1.5 01.08.12
    - New basic-widget: "basic.smybol" to display a gad
    - New device-widget: "device.blind" to control blinds, with 2 new slider 
      types (vertical, semicircle)
    - offline-driver enhancement (values now for each project)
    - more docu     
    - update lib/jQueryMobile 1.1.1
    
v 1.4 02.07.12
    - New and official "smartVISU" - Logo
    - position fixed on MainMenu
    - smother scrolling, better responsive design
    
v 1.3 19.06.12  
    - background picture support (17 backgrounds in 'pics/bg' included)
    - widget-documentation, with phpdoc based documentation
    - update display mechanism
    - basic language support
    
v 1.2 18.05.12
    - clock and weather
    
v 1.1 03.05.12
    - add config
    - more designs
    
v 1.0 26.04.12
    - first offical release
 
 
 
 
    