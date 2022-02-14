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
  * Webserver with PHP 7.3.2 and above. Compatibility with php v8.0 is verified.
  * Firefox, Chrome, IE, Safari, iPhone, iPad, Android Phone or Android Tablet
 
 
## INSTALLATION 
  * if you are using Apache2 as web server make sure the following php packets are installed: libawl-php, php-curl, php, php-json, php-xml, php-mbstring
  * the server directory is /var/www/html. Create a subdirectory "smartVISU" (or any other name), set the rights for your user and copy / clone the smartVISU package to that directory (be sure to type the dot at the end of the last line).
    ```cd /var/www/html
    sudo mkdir smartvisu
    sudo chown smarthome:www-data smartvisu
    chmod g+rws smartvisu/
    cd smartvisu
    git clone https://github.com/Martin-Gleiss/smartvisu.git .
    
  * Afterwards set the rights for the temp folder and some system configuration and data files:
 
    `bash setpermissions`


 
## 10 STEP GUIDE TOWARDS YOUR VISU
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
     The widget assistant in the system menu will help you to parametrize the widgets correctly.
  6. If you need to change the design, select a design in the user interface section.  
     If you want to develop your own widgets, place them in ./dropins/widgets (preferred) or ./pages/YOURPROJECT/widgets.   
     Provide a mywidget.html and a mywidget.js (if you need one). The files will be imported automatically.   
     Avoid names which are already used in the "smartvisu/widgets" directory or other sytem file names.
  7. Test your page with: http://localhost/smartVISU/index.php?page=mypage  
     Note: replace "localhost" with the hostname or IP address from your server      
  8. Create all pages you need. The template checker will check the formal correctness of the completed set of pages.
  9. At the end of your project set "cache" to "on" in the user interface area to speed up your smartVISU
  10. Enjoy smartVISU!
