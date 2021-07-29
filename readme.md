# Warning ! The current version in this develop branch is experimental and should not be used in productive environments!
Use version v3.1.0 from the master branch instead.

# smartVISU  

[![Join the chat at https://gitter.im/sVISU/Lobby](https://badges.gitter.im/sVISU/Lobby.svg)](https://gitter.im/sVISU/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
  
## DESCRIPTION
smartVISU is a framework to create a visualisation for a knx-installation with simple html-pages.  
To read and write group-telegrams special tags are used.  
You don't need to know javascript.  
  
SEE: [smartvisu.de](http://www.smartvisu.de)


## FEATURES
  * Pretty: Responsive design, auto adjustment to smartphones and tablets
  * Strict: One template for all devices
  * Easy: Implementation with HTML5
  * Simple: Connect to KNX with commands directly in HTML
  * Universal: Small concept of widgets
  * Connectable: Using drivers for different KNX installations 


## SYSTEM REQUIREMENTS
  * IP-Network, KNX-Bus
  * [smarthomeNG](https://github.com/smarthomeNG), [linknx](http://sourceforge.net/projects/linknx/), [ioBroker](https://github.com/ioBroker/ioBroker), [openHAB](https://www.openhab.org/), [FHEM](https://fhem.de/) or [knxd](https://github.com/knxd/knxd) (deprecated: [eibd](http://www.auto.tuwien.ac.at/~mkoegler/index.php/eibd) ) backend or JSON interface
  * Webserver with PHP. We highly recommend PHP 7.2 and above since older version are end of life and get no more 
    security updates. Some features in quad design explicitely require PHP 7.2+
  * Firefox, Chrome, IE, Safari, iPhone, iPad, Android Phone or Android Tablet
 
 
## 10 STEP GUIDE
For your own Project do the following:
    
  1. Create a new directory in "pages", for example "pages/YOURPROJECT".  
     This is your individual project-directory where you may work.  
     Copy all files from "pages/_template" to your project-directory
  2. Call smartVISU in your browser (http://localhost/smartVISU) and proceed to the configuration page. 
     Select "YOURPROJECT" in the user interface section.
  3. Select your smart home backend in the "smarthome/IoT data source" section
       * linknx: for linxknx and eibd environment
       * smarthomeNG: for SmartHomeNG environment
       * ...
       * knxd / eibd: for direct access
       * offline: only for testing, all GADs will be stored in a textfile ("temp/offline_YOURPROJECT.var")
  4. Create a new page in your project-directory, for example "mypage.html". 
     Note: Do not use "base.html, basic.html, device.html" nor any other reserved name of the system pages.
  5. Fill the page with your preferred content and widgets (see the pages/example*.* sections). 
     The widget constructor in the system menu will help you to parametrize the widgets correctly.
  6. If you need to change the design, select a design in the user interface section.  
     If you want to develop your own widgets, place them in ./pages/YOURPROJECT/widgets or ./dropins.   
     Provide a mywidget.html and a mywidget.js (if you need one). You'll need to import the html
     file in your pages while javascript will be included automatically.   
     Avoid names which are already used in the "smartvisu/widgets" directory or other sytem file names.
  7. Test your page with: http://localhost/smartVISU/index.php?page=mypage  
     Note: replace "localhost" with the hostname from your server      
  8. Create all pages you need. The template checker will check the formal correctness of the completed set of pages.
  9. At the end of your project set "cache" to "on" in the user interface area to speed up your smartVISU
  10. Enjoy smartVISU!
