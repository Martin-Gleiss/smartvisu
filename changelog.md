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
