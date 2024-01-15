## 3.4.a
### New / Changed Widgets
- basic.tank is now able to change colors according to reached thresholds

### Other New Features
- improved spline display for the starting point in device.uzsugraph
- new icons scene_cooking_drink and scene_robovac_dock (thanks to @Pacifia15))

### Improvements
- allowed database modes for series moved into the individual backend drivers
- parameter type "mode" introduced. Templatechecker reads available database modes individually for configured backend.
- docu page design>icons shows all icons in dropins/icons/ws (or .../sw, whatever is configured) 

### Updated Libraries

### Deprecated

### Removed Features
- old wiget pathnames w/o namespace (deprecated in v3.3)

### Fixed Bugs
- system page was not shown due to missing infoblock.html if pages were configured to "Smarthome" but pages had not been created yet by the "smartvisu" plugin of smarthomeNG.
- behaviour of device.uzsugraph interpolation style was inconsistent if more than one uzsugraph widget was on a page.  
- device.uzsugraph threw an error while a point was dragged
- status.activelist did not display texts if no svg icon was selected, i.e. the default icon "trans.png" was displayed
- corrected background image name "scale_pallets.png" to "scale_pellets.png"
- basic.print did not print timestamps correctly as dates and was not able to colorize them
- links on same page with anchor did not work under all conditions, e.g. href="index.php?page=myPage&anchor=myAnchor"
 
### Known Bugs
- if item contains a stringified number (e.g. with leading zero). widget.set converts it back to numeric format - so basic.print can not print it as text
- smartVISU versions 3.3.1 and older display incorrect version info in the update messages since the deprecated format has been removed from version-info.php 


## 3.4
### New / Changed Widgets
- quad.blind and quad.shutter can be configured to move the shutter on short- or longpress
- new widget plot.timeshift scrolls a plot in time-range by cancelling actual series in this plot and subscribing new series fo the same item(s) with changed start / end times.
- plot.rtr now accepts Highcharts chartOptions object as parameter like plot.period
- IDs are now optional in basic.roundslider and device.rtrslider
- new dynamic icon "icon.slidinggate"
- new widget / dynamic icon "basic.skylight" for a roof window with closed / tilt status and shutter position (thanks to raman)
- id parameter is now fully optional in status toast, even with multiple toasts on a page
- new "live" parameters in device.blind, device.dimmer, device.window, quad.dimmer, quad.color, quad.shutter, quad.blind and quad.playercontrol enable the usage of the live mode feture of basic.slider
- new live / silent mode for basic.roundslider (similar to basic.slider) 
- new widget clock.countup shows the time difference between the actual time and a start time given by an item.
- series data for plots in popups may be loaded on demand during popup open. Add "plotpopup" to the plot ID to postpone the individual series request from page load to popup open. This is now default behaviour for the Quad widgets.
- new widget plot.sparkline displays trend curves inside tables.
- plot.period now displays day plots (zoom = 'day') for days in the past - starting next day at 00:00 after tmin ('24h' = today, '48h' = yesterday ...). 
- new widget status.customstyle applies custom CSS styles to any linked widget or html element if values of a trigger item match the given conditions.
- refactored weather app and widgets weather.map and weather.mapslides after change of Tagesschau content management. (Thanks to Tagesschau technical management for hints on new API).
- new "style" option for basic slider allows applying CSS styles to the slider track
- basic.stateswitch can now use an additional icon or a simulated dynamic icon in the "indicator" phase when waiting for an item update 


### Other New Features
- weather service pirateweather.net as replacement for darksky.net (thanks to aschwith) 
- improved unit handling in weather services via language files
- designs "darkblue" and "flatdarkblue" habe been completed with missing swatches (thanks to @onkelandy)
- new folder ./dropins/designs for custom design CSS files (please adjust urls of e.g. background images in the files)
- page and service for backup and restore of configuration, dropins and custom pages (thanks to @hijacker7)
- new Italian language package (granzie tante a @hijacker7)
- drivers smarthomeNG, eibd/knxd, offline and ioBroker now support status and control items/GAs in one item, separated by a colon. Format is "item_status:item_control" (or e.g. "1/0/0:1/0/1" for eibd/knxd)
- new config option "collapsible_reset" resets the room menu in the sidebar to the pages default state on every page change (pagecontainershow event).
- help texts for GoogleV3 calendar OAuth procedure updated according to current workflow in Google developer console
- some new icons from KNX-UF icon set (modernized cars, HEV charging, manual)

### Improvements
- Template checker now ignores multi-line comments  
- offline driver is now able to cancel series and to log communication information to the console
- new functions to subsribe and cancel series for an individual plot (smarthomeNG and offline driver)
- new function to cancel log subscriptions for an individual or for all log widgets (smarthomeNG driver))
- show additional menu icon in header on normal phones - toggle Home/Info button on small phones
- room and system menues now use the icon embedding method of v3.3.x
- improved icon embedding in basic.roundslider for better stylability
- round sliders fully styled with CSS
- reconnect interval can be configured in config.ini by the key "reconnect_time"
- template checker recursively checks widget calls within widgets, e.g. dynamic icons and in quad widgets (w/ new parameter type "widget")
- template checker now checks parameter arrays for plots, uzsu and sliders in quad widgets w/ new parameter types "plotparam", "uzsuparam" and "sliderparam"
- reduced checking of parameters of type 'unspecified': no checking of empty parameters and new unchecked type "placeholder"
- template checker is now able to check single files 
- outer slider of device.rtrslider (display slider for actual temperature) is configured as readOnly to disable manual interaction
- info message after successful configuration save is shown again after page reload
- first fixes to avoid deprecation warnings in PHP8.2
- template checker has now an option to extend PHP skript execution timeouts from 120 sec to 240 sec (for slow smartVISU servers)
- included a link to display the changelog in the update message
- if timesource is configured to "server", DST and client-server-offsets get updated with every page change (no reload needed)

### Updated Libraries
- MatthiasMullie/minify patched to get back to the original performance see version-info in the src folder
- Highcharts v11.0.1 (yet only es5 scripts to keep backward compatibility w/ older devices)
- iCal ICS parser v3.2.1 (php 8.2 compatible)

### Deprecated

### Removed Features
- parameter type "iconseries" for template checker removed since basic shifter was removed in v3.3
- weather services yr.no and darksky.net removed due to discontinuation of the services
- notify.error(), notify.warning(), notify.info() removed which had been replaced by notify.message()

### Fixed Bugs
- multiple icons of icon.heating on one page could only be colored with the color of the first occurance and disappeared otherwise
- colorizing in basic.print did not change colors after first change (due to faulty removeClass() statement)
- wind speed in openweathermap service was in m/s but unit was km/h
- status toast was closed on item change even if param_allowclose was 'false'
- status toast did not always select the right toast to close 
- duplicate widget updates were triggered if names of items were fully part of other items (e.g. updates on "test.test" triggered also widgets listening to "test.testa" and "test.testb" on the same page)
- plot.gauge (speedometer and vumeter) did only receive correct CSS background styles if page was reloaded 
- plot.gauge and device.uzsugraph did not disable the export menu correctly
- template checker did not evaluate item properties correctly
- widget assistant inserted too many quotes in autocomplete mode if user entry had started with a quote
- basic.window showed wrong icon when optinal item "window_r" was not defined
- select menu did not send changed value if screen was smaller than the select list (hence jQuery mobile switched to scrollable page mode)
- Google oauth authorization for the calendar credentials stopped working due to a changed js library on apis.google.com
- "daycount" option in calendar.list delivered faulty results over the end of a month
- device.uzsugraph caused an error if the additional decorative points at the ends of the graph outside the default scroll area were clicked
- duration for 1y was 356 days instead of 365. Nobody noticed that over years :-))) 
- clocks / plots did not switch to/from DST if configured time source was server and cache was enabled 
 
### Known Bugs
- if item contains a stringified number (e.g. with leading zero). widget.set converts it back to numeric format - so basic.print can not print it as text


## 3.3.1
### New / Changed Widgets
- calendar.list now has an option limiting the shown time span (measured in days)

### Other New Features
- smarthomeNG driver now has an alternative address which can be used in addition to IP-address and SV hostname. This is important if an encrypted connection is required and the certificate is bound to a domain name. 
  This name is not part of the config page and must be defined manually as "driver_address2" in config.ini
- new app for Spiegel Online RSS feed

### Improvements
- Tankerkoenig and TV Spielfilm apps optimized for small screens
- bugfixing (most likely) and improved error handling in driver io_json 

### Updated Libraries

### Deprecated

### Removed Features

### Fixed Bugs
- calendar.waste showed double entries if a second calendar with the same URL was on the same page
- "navbar" workaroud caused navbars on mobile devices to fail. Workaround not necessary if "ui-state-persist" is used.
- SVG icons with <defs> section in ./dropins/icons/ws caused 404 error in fx.init
- basic.symbol color parameter did not colorize dynamic icons
- plot.period zoom preset did not work, zoom level got lost during series updates
- io.close() threw errors with some drivers and blocked page reload via smartVISU logo
- Fully browser could initialize a second websocket connection by firing "screenOn" event after automatic startup 

### Known Bugs
- if item contains a stringified number (e.g. with leading zero). widget.set converts it back to numeric format - so basic.print can not print it as text


## 3.3
### New / Changed Widgets
- icon styling is now standardized on all widgets including dynamic icons using 6 icon classes defined with the designs plus color names and hex color codes. 4 classes for "red", yellow,"green" and "blue" have been added in the designs
- svg icons in widgets get loaded directly into the html-DOM in order to provide faster loading and better stylability. This methods also profits from the cache mechanism if activated
- SVG embedding can be avoided by using full file name with path and adding "/ne" at the end (e.g. "icons/ws/myicon.svg/ne"
- new widget lib.svgimg loads an svg icon directly into the html-DOM
- status.collapse now has an option to define the action (hide / show) performed when the trigger item reaches a specified value
- basic.input: new modes datetime and datetimeflip allow setting datetime items with date and time in one step
- basic.window & design.window provide more styling capabilities
- calendar.list changes event title to "private appointment" if event is marked as private. Enable with new config option "hide private"
- basic.print got a new format option "F" which displays numbers with thousand-sperarators, e.g. 12.345,67
- plot.period: xAxis timescale can be overridden by options in the "chartOptions" parameter

### Other New Features
- if the configured driver is not available (e.g. removed after deprecation) a warning is displayed and the offline driver is used (also in config page) in order to throw no errors due to missing io. 
- new Javascript function fx.load dynamically inserts svg into html-DOM
- new twig filter preg_replace allows regex-based replacements (used for clean svg loading)
- all clocks, plot.period and plot.rtr are now able to use server time as reference (if configured on the config page)
- items can be used multiple times in all widgets (double usage had been blocked up to now). 
- new design "FlatDarkBlue". Thanks to @uwe5.
- new CSS class .hide-phone hides contents on a smartphone display (accordingly, .visible-phone shows contents only on smartphone displays)
- new app "Tankerkönig" for gasoline prices in Germany
- smarthomeNG driver now has a "loopback" option. If activated, after sending a command items are only updated by the backends answer. Up to now, a send command updated the item internally .
- iobroker driver now subscribes plot data and updates plots on receiving new values (thanks to @uwe5)
- javascript add-on for iobroker enables usage of UZSU widgets with iobroker (see "hints_iobroker_uzsu.md in ./driver/iobroker_uzsu/). Thanks to @uwe5 !

### Improvements
- calendar.waste recognizes event titles *starting* with the search pattern from lang.ini instead of requiring full congruence
- lib.supersize hides the block's collapse button if located on the right, adjusts the vertical scroll position and selects the appropriate icon color
- driver io_iobroker.js optimized to handle numeric data, JSON and arrays.
- device.uzsuicon and device.uzsutable only initialize a dict, if at least the "active"-property is initialized by the backend. This prevents writing dicts to non-UZSU items
- rooms with navbars in example1.smarthome now show the selected item repeatedly as active - not only at first visit (by adding "ui-state-persistent" to the "ui-btn-active" class)
- name spaces for icons and widgets allow more flexibility with filenames
- some measures to avoid "deprecated" warnings in Twig on php8.1 (set default values in widgets explicitely since arguments in some twig filters must not be empty (null))
- web services "phone" and "calendar" throw errors if php-dom module is not loaded
- plot exporting to png and pdf has been switched to local ("offline") mode. This avoids sending data to highcharts servers.
- replaced outdated links in various apps
- item monitoring was not stopped with smarthomeNG after page change if new page had no items to monitor (e.g.info page). Now, an empty monitor command is sent in such cases, stopping the former subscriptions.
- websocket is only reconnected if smartVISU is visible in the browser. This avoids unnecessary reconnects in mobile browsers and makes reconnecting more reliable.
- shNG driver now sends status 1000 when actively closing the websocket. This avoids some (but not all) abnormal closing warnings in the backend

### Updated Libraries
- JTSage datebox plugin v4.4.1 with patch for smartVISU time / timeflip limits
- Patches in Twig scripts: see CHANGELOG in Twig folder
- ICal ICS Parser v3.2.0
- Highcharts v10.3.0
- minify to v1.3.69 and path-converter to current master branch (2022-12-07) from Matthias Mullie (thanks!)

### Deprecated
- smarthome.py.js driver has been deprectated and moved to ./driver/deprecated 
- openhab2.js driver has been deprectated and moved to ./driver/deprecated
- widget import without path is deprecated. New: {% import "@widgets/mywidget.html" as mywidget %}

### Removed Features
- basic.shifter (deprecated since v3.0.0)
- "tv movie" app since they discontinued the rss feed, "Würzburg" app since webcam is inactive

### Fixed Bugs
- basic.input did not set time/timeflip values if min / max options were defined
- device.uzsutable threw errors if sunrise was not set or not calculated
- navbars and listviews changed display if an already active anchor was clicked
- server time could not be used as selected in configuration
- device.uzsugraph threw errors on new points with sun-based series events
- twig filter "deficon" did not work on arrays 
- select menu for timezone in config page did not open correctly
- multimedia.image error handler was deleted after first error. Update by item did not work with timer. 
- twig function "asset_exists" did not search in ./dropins/shwidgets (the folder where the backend stores plugin-related widgets)
- default duration in device.codepad did not disable access due to a missing unit
- plot.period and plot.xyplot did not accept units in printf-like format, e.g. %01,2f%
- plot.period showed faulty values on "stair" plots if chart resolution was not enough (corrected by disabling dataGrouping in Highcharts)
- plot.period changed xAxis scaling if series data exeeded the parametrized range
- blocking of browser back function on config, templatechecker and widget assistant pages did not work since v3.2.1
- example3.graphic navigation was faulty if called with the pages parameter
- basic.roundslider did not show scales in cached mode

### Known Bugs
- if item contains a stringified number (e.g. with leading zero). widget.set converts it back to numeric format - so basic.print can not print it as text


## 3.2.2
### New / Changed Widgets
- calendar.list has an option to show event links and locations in collapsible areas scrolling down on click.
- device.smallshut also takes numeric position values for item_saved (yet only boolean if position was saved in the actuator)
- new type 'textarea' for basic.input allows entering a string with multiple lines 

### Other New Features
- fully kiosk browser closes websocket when going to sleep and re-activates it on wake-up
- openHAB driver enables console commands via basic.trigger (thanks to Patrik Germann)
- openHAB driver receives log info via openHAB console (thanks to Patrik Germann)

### Improvements
- performance increased by avoiding long executions times of frequent jQuery mobile pagecontainer widget calls
- template checker now allows RBGA colors 
- fhem driver: websocket can be closed by the client without reconnect

### Updated Libraries
- new icons from knxuf icon set

### Deprecated

### Removed Features

### Fixed Bugs
- calendar names in config did not allow whitespace after comma / iCal calendars ignored calendar names w/ whitespace
- clock.digiclock always had double events
- widget assistant deleted whitespaces even within the parameters (e.g. calendar names containing whistespaces wont't work)
- calendar.list always showed icons in white. Now configured icon0 class is used.
- smarthome(NG) drivers did not send special characters in UTF-8 encoding
- iobroker driver threw errors if item was not set
- Updatecheck did not work correctly with version info from github
- default config values were not applied to boolean options (using flipswitches)
- basic.input did not take values for seconds in duration and durationflip mode 

### Known Bugs
- if item contains a stringified number (e.g. with leading zero). widget.set converts it back to numeric format - so basic.print can not print it as text


## 3.2.1
### New / Changed Widgets

### Other New Features
- page "driver_debug" for visualizing communication parameters. Good if browser tools are not available, e.g. on smartphones 
- phone widget widget displays callees image on outgoing calls and accepts images also with callers / callees names 

### Improvements
- docu for image displaying widgets improved (multimedia.widget, basic.print)
- basic.window takes 'closed', 'tilted' and 'open' as arguments, as frequently used in fhem. example3.graphic widgets also updated.

### Updated Libraries

### Deprecated

### Removed Features

### Fixed Bugs
- menu item "smarthomeNG" got lost if new smarthomeNG driver was selected
- calendars with names containing whitespaces were not loaded (since at least v2.9)
- smarthomeNG new driver did not work on old browsers (javascript replaceAll() function not available)
- mixing autogenerated pages from smarthomeNG with own pages did not work with the new smarthomeNG driver
- menus in config page did not show as dialogs if screen was too small (e.g. split w/ browser tools)
- config page did not work if ./dropins/lang folder was missing 
- cache folders were not created separately for different devices. This caused CSS mix if cache was activated and differnet designs were configured  
- on iOS9 the UZSU widgets did not run and even prevented smartVISU from starting if cache was activated
- new smarthomeng.js driver did not work if a port was provided in the URL
- device.uzsutable did not run on iOS9 devices (even after general uzsu fix)
- offline driver stopped working on large number of items (php request overflow)
- status.activelist did not work correctly if more than one status.activelist was on a page

### Known Bugs
- if item contains a stringified number (e.g. with leading zero). widget.set converts it back to numeric format - so basic.print can not print it as text


## 3.2.0
### New / Changed Widgets
- basic.window and device.window provide an additional color mode: icon0 if closed / custom color if open
- weather service met.no displays city name retrieved from geonames.org with geo coordinates (new service getLocation.php)
- basic.offset accepts min / max limits as parameters
- device.rtrslider offset buttons are limited to min / max but accept a symmetric "tolerance" for backward compatibility
- basic flip slider track can be styled with any valid color
- basic.stateswitch can be configured to open any named popup on a long-press (mobile: tap-hold) event 
- plot.period shows data for the running day from 0:00 to 24:00 if zoom parameter ist set to 'day'
- plot widgets interpret duration values without units as timestamps (same behaviour as smarthomeNG)
- new widget appliance.iprouter_v2 displays data from refactored enertex ip router service
- uzsu widgets support the time series mode provided by the new smarthomeNG UZSU plugin.
- device.uzsutable provides more colors corresponding to the "on" and "off" values and a fill option until the next switching event.
- device.uzsugraph provides a scrollbar and zoom buttons to scroll through 7 days stating from "today" (good to review sun-based events)
- calendar.list can be configured to additionally show the individual weekday in short or long format 
- plot.period can be used with data from list items (as an alternative to standard database series).  
- new widget lib.supersize expands single blocks to full screen width and resizes plots (if available). See docu page for design -> blocks
- multimedia.image uses new parameter 'localize' to enable URLs containing credentials. If 'true', image is loaded by php script ./lib/multimedia/camimage.php
- status.toast uses the widget id as additional class name (pure id like in parameter set). This can be used for css styling.
- new widget plot.xyplot displays x/y data provided by the backend in list item(s)

### Other New Features
- template checker now checks smarthomeNG item properties (valid properties and types)
- openHAB driver from Patrik Germann (thanks!) supports SSL and authentication
- smarthome(NG) driver (io_smarthome.py.js) accepts a second port for TLS communication. Port & protocol will be switched according to host protocol (http / https) 
- refactored php service (enertex.iprouter-v2.php) for enertex IP Router connects to current firmware version and provides more data 
- anchor links can now be used, e.g. href="index.php?page=myPage&anchor=myAnchor" 
- ressource intensive pages (config, templatechecker, widegt assistant) are cleared from DOM after usage in order to optimize performance. 
  Browser back/ forward buttons are blocked on these pages.
- header menu icons get animated on click in order to visualize an activated link on slow devices 
- custom language file can be placed in ./dropins/lang
- with the new menu system, the secondary page area containing weather / calendar / phone widgets is now available on smartphone displays (as infopage.html)
- new smarthomeNG driver with enhanced connectivity. Connects always with IP v4 & ports, with host name & ports if host name equals configured smartVISU host name, other alpha-numeric requests via URL & port 80/443 

### Improvements
- Driver config data are globally availble now in the sv.config.driver{} array
- Config page layout adapted to new options
- Scripts for config page stored in separate js-file (to save some ressources/time on normal visu pages)
- device.rtrslider sets the display formats according to the decimals of the parameter 'step'
- improved error notifications with basis for language specific message texts and error source identification
- fritz!box TR-064 phone service shows blocked calls as "rejected" instead of outgoing (w/ new icon)
- additional js-scripts can be loaded with a backend driver if stored in a folder with the drivers name
- new system menu in navigation on primary side (right hand side) saves ressources. Config page must be called as menu item. 
- base language is recognized from first "extends" value during language file processing. Accessible in JavaScript as "sv_lang.baselang" and in twig as lang('baselang') 
- config tabs 'pages' and 'device' now show the globally selected options if no specific value is defined (yet select menus only since they steer the options structure as well)

### Updated Libraries
- jQuery v2.2.4 with patch in jQuery mobile v1.4.5
- twig v1.44.6: final and last release for v1.x which still supports global macros (v2.x and v3.x don't)
- highcharts/ highcharts stock v9.3.1

### Deprecated
- openHAB2 driver
- notify.info/warning/error(title, text): use notify.message("info" / "warning" / "error", title, text) instead

### Removed Features
- replaced several deprecated jQuery / jQuery mobile functions & attributes
- deprecated Fritz!Box drivers. See deprecation notice in ./lib/phone/service

### Fixed Bugs
- Sliders for HSV color model did not send updated values if only one slider was changed
- plot data lost their ascending sequence occationally which resulted in lines across the plots
- Page navigation away from widget assistant often failed and / or threw errors in console
- status.activelist expanded all contents when unser returned to the page (now all are collapsed)
- digiclock disappeared or showed wrong times if more than one page with clock was in the DOM
- offline data were not correctly loaded if "pages" parameter was used in the URL. Now we evaluate "pages" and set the offline filename accordingly.
- after reload, config page showed settings that should have been hidden
- Firefox ignored jQM theme selection for collapsible block headings
- some drivers threw errors due to empty function io.stopseries and interrupted the page change process (2nd click necessary to change page)
- iobroker driver did not work with boolean items. A conversion is integrated now.

### Known Bugs
- if item contains a stringified number (e.g. with leading zero). widget.set converts it back to numeric format - so basic.print can not print it as text


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
