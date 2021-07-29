## 3.1.a
### New / Changed Widgets
- basic.window and device.window provide an additional color mode: icon0 if closed / custom color if open
- weather service met.no displays city name retrieved from geonames.org with geo coordinates (new service getLocation.php)
- basic.offset accepts min / max limits as parameters
- device.rtrslider offset buttons are limited to min / max but accept a symmetric "tolerance" for backward compatibility
- basic flip slider track can be styled with any valid color
- basic.stateswitch can be configured to open any named popup on a long-press (mobile: tap-hold) event 

### Other New Features
- template checker now checks smarthomeNG item properties (valid properties and types)
- openHAB driver from Patrik Germann (thanks!) supports SSL and authentication
- smarthome.py driver accepts a second port for TLS communication. Port & protocol will be switched according to host protocol (http / https) 

### Improvements
- Driver config data are globally availble now in the sv.config.driver{} array
- Config page layout adapted to new options, popup for driver security / authorization
- Scripts for config page stored in separate js-file (to save some ressources/time on normal visu pages)

### Updated Libraries
- jQuery v2.2.4 with patch in jQuery mobile v1.4.5

### Deprecated
- openHAB2 driver

### Removed Features
- replaced several deprecated jQuery / jQuery mobile functions & attributes

### Fixed Bugs
- Sliders for HSV color model did not send updated values if only one slider was changed
- plot data lost their ascending sequence occationally which resulted in lines across the plots

### Known Bugs


## 3.1
### New / Changed Widgets
- new weather service API met.no for deprecated yr.no
- new widget status.activelist to display json messages as active listview
- device.uzsuicon can be displayed as button with additional "type" parameter (micro, mini or midi)
- basic.symbol provides button design as additional options btn-micro, btn-mini or btn-midi with additional text on icon
- basic.slider provides a new silent mode. Live mode (default) sends changed values constantly, silent mode only if change is completed.
- plot.period provides stacked plots for line, area and column
- image / data exporting via context menu in plot.period 
- status.collapse supports a list of multiple values for control of collapsing / hiding
- device.rtrslider supports offset temperature for MDT RTR and supplements (like device.rtr)
- multimedia.slideshow now refreshes available images in a defineable time
- basic.offset rounds result to the count of decimals given by "step" attribute
- weather service openweathermap.org accepts location by ID (id=...), postal code (zip=...) or latidude&longitude (lat=...&lon=...) in adddition to city name

### Other New Features
- php8 compatibility (mainly solved by new management of warnings and 'nullsafe' programming)
- parameter [debug = "1"] in config.ini enables error reporting for php warnings
- new public functions in weather.php plus new language category [weather] to centrally determine verbal wind direction and strength
- weather services use humidity and air pressure as additional data (has been max. one out of both)
- demoseries in offline driver have been synchronized to the minute in order to enable stacking of demoseries
- new function Number.prototype.decimals() to determine count of decimals of a number
- new page ./pages/base/widget_docu.html displays parameter info for all widgets (tool to optimize custom widgets docstrings)

### Improvements
- error reporting for weather services and CalDav / iCloud calendars shows answers from remote
- error reporting for phone service improved
- error notification avoids duplicate messages (weather and phone services)
- error notification is cleared if service is running again (weather and phone services)
- complete review of all parameter definitions in order to improve results in template checker
- improved autocomplete lists and styling in widget assistent

### Updated Libraries
- Highcharts updated to v9.1
- ICal ICS Parser updated to v2.2.2

### Deprecated
- weather service yr.no (use met.no as replacement)
- weather service wunderground (use weather.com as replacement) 
- fritz!box services other than TR-064
- custom widgets using sliders ( <input type="range" ... >) must use attributes "data-orientation" and "data-handleinfo" instead of "orientation" and "handleinfo"

### Removed Features
- support for older widgets (non jQuery mobile types) has been finally removed
- unsued Google Closure compiler has been removed
- deprecated ov.colordisc and ov.rgb removed from example3.graphics. Use ovbasic.color instead

### Fixed Bugs
- plot.pie did not show series titles as labels / legend
- some weather services did not use correct language if user defined language extension file was used
- some weather services did not use the units specified in the language file
- default repeat interval for phone services was 15 months. Corrected to 15 minutes.
- design colors where not defined in 'pages' and 'device' options of the config page
- config options selectable with flip switches where not stored properly in "device" tab (cookie mode) 
- cache folders where deleted completely regardless of source (global / cookie)
- met.no weather service showed no icon if started directly after midnight and had problems with chages to summer time
- when leaving a page via the "back" button, widgets exit method and cancellation of plot data subscriptions didn't work.
- conflicts between exit method and older versions of back-to-home functions 
- templatechecker did not consider widgets in the pages subfolder
- plot.gauge threw warnings due to faulty "data-axis" parameter. 
- 100% check of docu pages and widgets with W3C validator revealed some issues - fixed. 
- widget assistant threw errors with nested curly brackets (e.g. in plot options)

### Known Bugs


## 3.0.1
### New / Changed Widgets

### Other New Features
- Template Checker allows copying to clipboard
- new design "holo-inspired"

### Improvements
- improved readability in template checker (new global config variable sv.config.icon0 / .icon1 for symbols, improved colors )
- page reload link in top right corner has been re-activated
- new warning message in template checker if optional masteritem file is not available

### Fixed Bugs
- faulty page navigation if files had been in ./dropins or ./dropins/widgets before configuration was completed
- template checker didn't run on certain systems which took a '?> ' before EOF too serious in a class definition 
- widget assistant did not show rendered widgets while page cache was enabled
- scalable icons caused a problem in stateswitch button with text
- fixed search string in calendar.waste and improved icon scalability
- php errors thrown in calendar service due to usage of deprecated join() statement
- outline render page for widget assistant has been fixed, also for Apple devices

### Known Bugs
- when leaving a page via the "back" button, widgets exit method and cancellation of plot data subscriptions won't work.
  (root cause documented in base.js line 1804)


## 3.0

### New / Changed Widgets
- new "widget assistant" tool to parametrize and test widgets (thanks to Andre Kohler)
- template checker checks for items and item types with masteritem file form backend (thanks to Andre Kohler)
- template checker provides replacement proposals for older widgets which have been removed already in the current version
- darksky weather service shows verbal wind directions instead of angle values
- new weather service weather.com as replacement for Wunderground
- deprecated widgets from v2.8 and earlier have been deleted
- basic.trigger can trigger logics on page create (new) and / or by button
- basic.select "menu"-type accepts dynamic option lists and texts via items (list type)
- new dynamic icon "icon.battery2"
- new widget lib.connection to display the URL of the websocket plus shNG websocket server (module / plugin) and start time
- added setpoint item to quad.rtr 
- new widget clock.countdown to visualize timers in backend
- new widget lib.timestamp to write a timestamp of "now" to an item (used for countdown doc page)
- new widget device.uzsutable to display a timer in a table format of 24 hours / 7 days
- new widget ovbasic.symbol in example3.graphic - same features as basic.symbol but with absolute positioning
- icon sizes can be changed by parameters in basic.symbol and basic.icon 
- widget weather.current takes weather values from backend item alternativly to online weather informaion
- new widget event "exit" allows stopping of functions before page change (e.g. deleting timers)
- new widget basic.roundslider with flexible design options (thanks to Bonze)
- new widget device.rtrslider for slider control of set temperature and functionality of device.rtr (thanks to Bonze)
- new widget status.toast to display notifications (thanks to Bonze)
- new widget basic.window shows opening status of windows and sutter position 
- new widget device.window shows window status and opens popup to control the shutter
- new widget plot.heatingcurve shows actual outside and feed temperatures on the heating curve 
- phone list shows called number on outgoing call if available from backend

### Other New Features
- bash script "setpermissions" added for setting file permissions during initial setup. To be called by 'sudo bash setpermissions'
- new option "Reverse Proxy" in backend driver section on config page clears IP address and port (yet activated for shNG only)
- config page disables cache activation in case cache directory is not writeable
- support for smarthomeNG feature "series_cancel" to stop subscription of series data
- series subscriptions will be cancelled when next page is about to load
- widget assistant can be deactivated in config page in order to save ressources
- new version number format (e.g. v2.9.2) is standard in communication w/ io-drivers, old format is deprecated
- menu button for German "Kurzanleitung" (separately available on github.com/smartvisu-newstuff/kurzanleitung) integrated in system menu
- language is switched to "en" by default if configured language file does not exist any more
- new twig function 'twig_items()' provides a list of all items from 'masteritem.json'
- new twig function 'asset_exists()' replaces former AssetExistExtension 
- simplified import of widgets by extended twig loader path 
- new event 'ioAlive' on $(document) is triggered when websocket server has started communicating
- new welcome page in pages/smarthome for users who configure "smarthome" without having started page auto-generation in shNG

### Improvements
- function Date().duration changed to accept negative values (for plots reaching into the future)
- new function 'sendqueue' in io.smarthome.py.js sends 'logic'-commands queued while websocket is not ready
- endless timer for digiclock is stopped during page change. This avoids useless loading of multiple pics every minute
- index.html shows phone list and calendar by default, unless "service_disabled" is selected in config page
- html escaping function for status.log
- improved integration of custom widgets in docu - show only title but no link if docu page doesn't exist
- improved docu page for examples of blocks - explain code for collapsibles and show variation of width
- changed smartVISU and Miniclock appearance in top-right corner - now in CSS defined colors but without page-reload link
- default colors are now declared in the head area of the design CSS files - not hard-coded any more in index.php
- multimedia.image stops loading images after page has been left (via exit event)
- increased time limit in template checker to avoid fatal timeout errors while checking big pages w/ plenty of wifgets
- added welcome page for users having "smarthome" pages configured (normally used for shNG autogenerated pages)
- language formats now distinguish between angular degrees (°) and temperature (°C / °F)
- prepare for new folder dropins/shwidgets where backends can handle widgets

### Updated Libraries
- updated Twig to v1.44.2 (2021/01/05)
- a bunch of new icons (thanks to @mfd)

### Deprecated
- widget basic.shifter replaced by dynamic icons (basic.icon)

### Removed Features
- deprecated widgets from v2.8 and earlier have been deleted
- removed protocol versions <= 3 in smarthome.py driver
- support for older widgets (non jQuery mobile types) has been terminated 
  (in case of urgency re-activateable in ./lib/base/base.js by uncommenting widget.update, widget.prepare, widget.refresh)

### Fixed Bugs
- error thrown if default calender icons in language files were missing
- language files distinguish between temperature and angular degrees (°C/°F vs. °)
- obsolete parameters in init functions of service.php and calendar.php caused faulty error messages
- fixed debug feature in php services 
- fixed device.rtr misleading night / day icons 
- all examples and docu checked and optimized with template checker
- calendar.waste entries got overruled by smaller snippets (e.g. "green bin" by "bin" ) if snippet was not listed first 
- widget.explode() was sorting purely numeric item names, so occationally items were swapped
- fritz!box_TR-064 driver threw warnings disturbing the data stream in certain environments

### Known Bugs
- when leaving a page via the "back" button, widgets exit method and cancellation of plot data subscriptions won't work.
  (root cause documented in base.js line 1804)
- On Apple devices with Safari browser, the widget assistant does not open a new window for rendering. 
  Deactivate "Preview in new Window" option to view the result in the box below the option panel.

## 2.9.2

### New / Changed Widgets
- basic.stateswitch accepts items of type 'list'
- default icon can be defined for calendar / waste calendar, improved icon definition.

### Other New Features
- new weather service openweathermap

### Improvements
- new versioning (major.minor.revision). Update checker looks for remote version on smartvisu.de AND github master
- update check is paused for 7 days after every execution (by cookie "updchk")
- system page for SmartHomeNG has been updated. SmartHomeNG icons added to icons folder
- added timezone handling for different OS in OpenHAB 2 driver
- improved docu pages e.g. for dynamic icons and status widget
- cookie security adapted to recent standards ("samesite" option) for config and update check
- added custom pages folders to .gitignore

### Updated Libraries

### Fixed Bugs
- writing config file was not reliable under windows.
- cache execution failed in quad design if more than one device was used 
- Twig didn't report lib.updatecheck to the template checker
- ovdevice.dimmer (example3.graphic): stateswitch fired twice if item_switch was used in dynamic icon
- text2br option for basic.print didn't display correctly
- example3.graphic: centering of icons was missing in absolute positioning of visu elements
- mixed spelling of "adress" / "address" in eibd driver 

## v 2.9

### New / Changed Widgets
- ID is now optional in most widgets
- New: basic.stateswitch (improves and supersedes basic.button, basic.dual, basic.multistate and basic.switch)
- New: basic.icon (shows an icon, optionally colored statically or dynamically by item)
- New: basic.input (displays an input field for text, number or date/time/duration)
- New: basic.print (improves and supersedes basic.float, basic.formula and basic.value)
- New: basic.select (select a value by menu or array of buttons)
- New: basic.color (supersedes basic.colordisc and basic.rgb) with new parameter 'colormodel' for HSV or HSL model and possibility to pass values as list in one item
- New: status.badge (displays a notification badge)
- New: basic.offset (button to increase or decrease a value)
- New: device.roofwindow (to show and control a roof window)
- New: device.uzsuicon (to control UZSU in smarthome.py and FHEM)
- New: device.uzsugraph (to control UZSU in smarthome.py and FHEM)
- New: device.smallshut (a line of small control and monitoring elements for shutters)
- New: calendar.waste (compact view of waste collection dates)
- New: multimedia.audio (plays a soundfile)
- New: multimedia.timeslider (to show and control the current time of a media file)
- New: multimedia.playpause (toggle between play and pause to control a music/video player)
- New: plot.gauge
- New: plot.pie
- New: icon.cistern
- New: icon.garagedoor
- New: icon.heating (displays a heating colored with dynamic gradient)
- New: icon.roofwindow
- New: popup.extpopup (to mix widgets in one popup)
- New: popup.locks (motion sensor and/or light priority in one popup)
- basic.symbol: Can also be used to show text only and to render as link, mode extended to adaptable formula (including thresholds), and - most important - may have multiple states now (so eventually, no series of symbols is needed anymore to cover mutiple states)
- plot.period: Among other things: merged functionality of plot.minmaxavg and plot.multiaxis into it, more options like logarithmic and boolean scale, units, an advanced zoom mode as in Highstock, individual count and mode per series and the possibility to set any additional chart options
- plot.temprose: New parameters 'series_label' and 'unit'
- plot.rtr: New parameters 'tmin', 'tmax' and 'state_max' (last one is used to set datatype of state item). Additionally the algorithm for guessing dataype has been improved.
- basic.slider: New parameters 'value_display', 'min_display' and 'max_display'
- device.blind & device.shutter: item_move is now optional
- basic.shutter & device.shutter: min/max are renamed to value_top/bottom and value_top may be less than value_bottom
- device.shutter: Value and text for pos1 and pos2 can be set by parameter
- basic.tank & icon.* (dynamic icons): min is now implemented and max may be less than min
- device.dimmer: New parameters to specify pic, color, 'min_display', 'max_display' and position of the switch (left or right)
- device.rtr: New parameters to specify separate offset item and additional content
- Use of dynamic icons in other widgets possible (e.g. basic.multiswitch or basic.symbol)
- calendar.list: New parameters to select and colorize calendars
- basic.checkbox & basic.flip: Value_on and value_off can be set by parameters
- multimedia.slideshow: Fix items, add control buttons and reverse parameter
- clock.miniclock: New parameter 'format'
- status.notify: New items for title, signal, level and acknowledgement
- multimedia.image: add items to define source and refresh trigger 

### Other New Features
- Inline documentation can be called directly in system menu now (i.e. w/o changing pages in configuration)
- Allow pages selection by url parameter (e.g. index.php?pages=foo)
- Configuration can be overridden per page and per client. Options stored in .ini now. Redesign of configuration page
- Clear pagecache (by button and on disabling on configuration page)
- New dropins folder to add custom extensions and overrides (see details in [README.md](./dropins/README.md) inside dropins/)
- Custom widgets in a folder `widgets` inside own pages will be imported automatically (like in dropins)
- Language files can be overridden. This allows regional variations and custom extensions. And they are stored in clearer ini format
- Timezone is configurable now (was hardcoded to 'Europe/Berlin')
- Configurable time source (show time of server or client)
- Automatically return to home page after a configurable duration
- Template Checker
- Added 50 icons of jQuery Mobile - before they were just available on buttons as background (aka inline) icons
- New CalDav calendar service
- Auto-loading of any .js file inside subfolder 'js' and any .css file inside 'css' in current pages folder
- New driver for [ioBroker](http://www.iobroker.net)
- New weather service [darksky.net](https://darksky.net/)
- New Fritz!Box phone service using TR-064
- Updated Quad design with new features
- Twig function 'asset_exists' checks availability of files (to be used before importing these files)
- Documentation of custom widgets will be imported from dropins/widgets
- New structure of updated examples 

### Improvements
- Replaced make.php by on-the-fly minification (needs page cache set on)
- Replaced Twig cache by output cache (makes html files cachable)
- Some performance optimizations
- ICal service: Multiple URLs and calendar naming possible
- Calendar coloring in configuration
- Google calendar authorization on configuration page
- Date format allows more patterns: l, D, j, F, M, n, G (the meaning is same as in php date function)
- Notification corner shows messages ordered by severity

### Updated Libraries
- jQuery Mobile to 1.4.5
- jQuery to 2.1.4
- Highcharts changed to Highstock (which includes Highcharts), updatet to 6.2.0 and migrated to styled mode

### Fixed Bugs
- Changes were not visible immediately after saving configuration
- Some other minor bugs fixed

### Now Deprecated
- basic.button, basic.dual, basic.multistate and basic.switch (use basic.stateswitch instead)
- basic.text (use basic.symbol instead)
- basic.float, basic.formula and basic.value (use basic.print instead)
- basic.colordisc and basic.rgb (use basic.color instead)
- plot.minmaxavg and plot.multiaxis (use plot.period instead)
- Calendar service GoogleV3 (use ICS/iCal instead)


## v 2.8 03.10.16

### New / Changed Widgets
- new widget: basic.multistate
- new widget: plot.multiaxes
- new widget: plot.minmaxavg
- new widget: device.codepad
- new widget: status.collapse
- new widget: status.popup
- multimedia.image has new mode "fill"
- basic.button extended to set color for svgs
- basic.switch modified to allow color specification 'icon0' and 'icon1' for `color_on` and `color_off`
- dynamic icons: added option to set color of icon

### New / Changed Icons
- New icon light_standing_light.svg

### Other New Features
- Added proxy settings in configuration
- Auto reconnect for drivers can be enabled in configuration
- Drivers for FHEM and openHAB2
- Template Checker
 
### Improvements
- Loading time seriously decreased
- Added Google calendar API V3
- Changed smarthome.py driver to version 4
- Extended smarthome.py driver to send data about the visu client (version, browser)

### Fixed Bugs
- switched many broken icons to SVG
- a bunch of bugs fixed

### Updated Libraries
- highcharts updated to version 4.2.6


## v 2.7 03.11.13

- new: SmartHome.py Montior page
- new: animations on/off for better performance on slow devices
- new model house: alber, as eibd-driver example by Raik Alber
- new SmartHome.py Monitor
- new widget: clock.iconclock
- new widget: status.log
- improved widget: plot.period now zoomable
- moved widget: basic.image -> mulimedia.image
- moved widget: basic.notify -> status.notify
- new static-svg-icons colored white (ws), black (sw)
- new svg-icons: icon.blade, icon.blade_arc, icon.blade_z by Mario Zanier
- new svg-icon: icon.meter, icon.clock
- improvments on svg-icons
- deprecated: icons/bl, icons/or, icons/gn -> use .svg instead 
  see index.php?page=design/design_icons for examples
- update plot.highcharts 3.0.5

## v 2.6 06.08.13

- dynamic icons: svg-icons for continuous values
- new: config splitted in lib/defaults.php and config.php (individual)
- improved devive.rtr now with more modes depending on the driver
- update vendor/plot.highcharts 3.0.2       
- update vendor/jquery 2.0.3 (IE 6, 7, 8 are no longer supported)
- update vendor/jquery.mobile 1.3.2

## v 2.5 01.06.13

- new apps: tv-movie, tv-spielfilm
- new: rss-feed-reader (lib/feeds)
- new widget: multimedia.station for tv- and radio-stations 
- new widget: multimedia.slideshow for image-based slideshows 
- new widget: plot.temprose for all temperatures in a building
- improved: phone drivers
- improved: drivers now with datatypes: int, float, string, array
- improved: basic.tank now with variable width
- new .js files are now minified. Based on google closure
- new model-house: fleischer by Marco Fleischer
- new: animations :-) [beta]

## v 2.4 26.04.13 Happy Birthday smartVISU!

- improved widget: basic.shutter, now with dynamic symbols
- improved design: cube v2, best viewed with solar_winds.png background                                          
- project: visu.css and visu.js are included if they are in own project
- new widget: plot.period for plotting graphs
- new widget: plot.rtr for an rtr graph visualisation
- new widget: plot.comfortchart for a graph showing humans well-feel-zone
- new widget: basic.notify for notifications (info, warnings, errors)
- new widget: basic.colordisc by Marcus Popp
- improved design: shutter pics now .png with transparency
- imporved widget: basic.rgb now with configurable colors
- improved widgets for speed
- improved drivers: only refresh if necessary
- update vendor/jquery.mobile 1.3.1

## v 2.3 04.03.13

- device.rtr now with 3x bit-mode or 1x byte-mode
- undeprecated: basic.glue: used to glue widgets together
- new language: fr, special tanks to Pierre-Yves Kerviel
- basic.symbol now with mode 'or', 'and'
- new: smartVISU checks configuration of the server
- new widget: basic.tank for (partly) filled tanks
- new widget: basic.shifter for switch an value on one symbol
- improved widget: basic.shutter now supports sending of the angle
- re-engineered widget: basic.slider with super soft sliding
- new driver: eibd (with ajax long-polling)
- phone service: fritz!box v5.20 (international version)
- new icons from mfd
- docu improved
- update vendor/jquery 1.9
- update vendor/jquery.mobile 1.3
- improved speed: gzip compressed output
- improved speed: javascript separated

## v 2.2 01.02.13

- new driver: SmartHome.py (with websocket)
- new driver: domotiga (with websocket)
- improved error handling and notification
- phone service: fritz!box v5.50. Special thanks to Stefan Vonbrunn
- new design: greenhornet
- new icons: gn (green)
- new pages: meister (as model-home)
- weather: yr.no now in en and de. Special thanks to Raik Alber
- update: Twig, with continuous integration
- new icons: They are named in english. thanks to mfd
- improved driver: offline, linknx, json
- new smart.alert js-function for alerts and logging
- driver linknx: with error-handling

## v 2.1 09.01.12

- new pages: otterstaetter (as model-home)
- widget: multimedia.music for a player
- widget: appliance.iprouter for the enertex knxnet/ip-router
- re-engineered widget: basic.slider 
- re-engineered widget: basic.button 
- widget: basic.rgb with color-selector
- widget: basic.symbol allows more gads/items now
- widget: basic.shutter may now be clicked to change the position
- improved design: device.rtr
- improved design: weather and clock for small devices  
- changed design: header now fixed on mobile devices

## v 2.0 14.12.12

- realtime polling
- updated driver: 'linknx' for polling
- updated driver: 'offline' for polling
- new widget: shutter (widgets/device.html)
- widget: basic.button now supports different icons
- docu for buttongroups
- docu for popups
- new <?php tags in all files

## v 1.9 28.11.12

- new widget-file: widgets/calendar.html for google calendar
  use the google-calendar private xml-adress in the config dialog
  with http: (not https:). In your event you may use:  
      `@icon        icons/ws/meld_muell.png`  
      `@color       #222266`  
  as description to set the icon and color.
- function.php: smartdate for dates relating on language
- improved design of configuration
- fixes in phonelist

## v 1.8 02.11.12

- new widget-file: widgets/phone.html for phonelists
  A phone system is required. Supported are:
  Auerwald VoiP 5010, VoiP 5020, Commander Basic.2
  fritz!box 7050, 7170 and similar types
- add: apps now support more docu
- updated: jQuery plugins

## v 1.7 06.10.12

- new feature: Apps (an app is a complete html-page, which can be easily
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

## v 1.6 25.09.12

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

## v 1.5 01.08.12

- new basic-widget: "basic.smybol" to display a gad
- new device-widget: "device.blind" to control blinds, with 2 new slider 
  types (vertical, semicircle)
- offline-driver enhancement (values now for each project)
- more docu     
- update lib/jQueryMobile 1.1.1

## v 1.4 02.07.12

- new and official "smartVISU" - Logo 
  special thanks to Björn Bertschy
- position fixed on MainMenu
- smother scrolling, better responsive design

## v 1.3 19.06.12

- background picture support (17 backgrounds in 'pics/bg' included)
- widget-documentation, with phpdoc based documentation
- update display mechanism
- basic language support

## v 1.2 18.05.12

- clock and weather

## v 1.1 03.05.12

- add config
- more designs

## v 1.0 26.04.12

- first offical release
