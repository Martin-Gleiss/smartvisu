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
  * [smarthome.py](http://mknx.github.io/smarthome/), [linknx](http://sourceforge.net/projects/linknx/), [domotiga](https://domotiga.nl/projects/domotiga/wiki/Home) or [eibd](http://www.auto.tuwien.ac.at/~mkoegler/index.php/eibd) backend
  * Webserver with PHP 5.2.4 
  * Firefox, Chrome, IE, Safari, iPhone, iPad, Android Phone or Android Tablet
 
 
## 10 STEP GUIDE
For your own Project do the following:
    
  1. Create a new directory in "pages", for example "pages/visu" or "pages/YOURPROJECT".  
     This is your individual project-directory where you may work.  
     Copy all files from "pages/_template" to your project-directory
  2. Check the config.php and set the "config_pages" to "YOURPROJECT"
  3. Set the "config_driver" to your backend-environment
       * linknx: for linxknx and eibd environment
       * smarthome.py: for SmartHome.py environment
       * domotiga: for Domotiga environment
       * eibd: for direct access
       * offline: only for testing, all GADs will be stored in a textfile ("temp/offline_YOURPROJECT.var")
  4. Create a new page in your project-directory, for example "mypage.html"  
       Note: Do not use "base.html, basic.html, device.html", these are system pages
  5. Fill the page with your preferred content and widgets
  6. If you need to change the design, use a "visu.css" - stylesheet file in your project-directory.  
       If you want to develop your own widgets, also place them in your directory.   
       Name the javascript-file (if you need one) to "visu.js" and it will be included automatically.   
       Name the file with the widgets e.g. "custom.html"
  7. Test your page with: http://localhost/smartVISU/index.php?page=mypage  
       Note: replace "localhost" with the hostname from your server      
  8. Create all pages you need
  9. At the end of your project set "config_cache" to "true" to speed up your smartVISU
  10. Enjoy smartVISU!
