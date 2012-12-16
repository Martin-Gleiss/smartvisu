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
    -   Firefox, Chrome, IE, Safari, iPhone, iPad, Android Phone or Android 
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
    - MainMenu: Display selected menu-button
    - basic.tristate button for rtr-mode
    - Main: Alert function
    - Buttons: change icon
    - Buttons: pressed short / long
    - Szenes
 

HISTORY
--------------------------------------------------------------------------------
v 2.1
    - widget: basic.symbol allows more gads now
    - widget: basic.shutter may now be clicked to change the position

v 2.0 14.12.12
    - realtime polling
    - updated driver: 'linknx' for polling
    - updated driver: 'offline' for polling
    - new widget: shutter (widgets/device.html)
    - widget: basic.button now supports different icons
    - docu for buttongroups
    - docu for popups
    - new <?php tags in all files
    
v 1.9 28.11.12
    - new widget-file: widgets/calendar.html for google calendar
      use the google-calendar private xml-adress in the config dialog
      with http: (not https:). In your event you may use:
        @icon        icons/ws/meld_muell.png
        @color       #222266
      as description to set the icon and color.
    - function.php: smartdate for dates relating on language
    - improved design of configuration
    - fixes in phonelist
    
v 1.8 02.11.12
    - new widget-file: widgets/phone.html for phonelists
      A phone system is required. Supported are:
      Auerwald VoiP 5010, VoiP 5020, Commander Basic.2
      fritz!box 7050, 7170 and similar types
    - add: apps now support more docu
    - updated: jQuery plugins
    
v 1.7 06.10.12
    - new feature: Apps (an app is a complete html-page, witch can be easily
      used in your project. Use lib.app('NAME OF APP') to show one on your page.
      all apps are located in pages/apps
    - app: Impressions Frankfurt, Impressions Würzburg
    - app: Weather Tagesschau
    - basic.symbol now with text
    - new widget-file: widgets/weather.html with weather.map, weather.mapslides
    - new widget-file: widgets/clock.html
    - cacheing for remote-calls
    - pages/project folders now support subdirectories
    - improved forms
    - favicon
    - update lib/jQueryMobile 1.2.0
    - smartVISU moved to code.google.com 
    
v 1.6 25.09.12
    - weather-widget now configurable
    - weather-widget with new service: wunderground.com
      generate your key for free at: http://www.wunderground.com/weather/api/
      special thanks to Florian Meister for implementation
    - weather-widget with new service: yr.no
      get your location at: http://www.yr.no
    - iPad improvements
    - fixed basic.glue
    - update lib/jQuery 1.8.2
    - update lib/Twig 1.9.2

v 1.5 01.08.12
    - new basic-widget: "basic.smybol" to display a gad
    - new device-widget: "device.blind" to control blinds, with 2 new slider 
      types (vertical, semicircle)
    - offline-driver enhancement (values now for each project)
    - more docu     
    - update lib/jQueryMobile 1.1.1
    
v 1.4 02.07.12
    - new and official "smartVISU" - Logo 
      special thanks to by Björn Bertschy
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

 
    