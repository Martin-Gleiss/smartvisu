<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


// -----------------------------------------------------------------------------
// C O M M O N
// -----------------------------------------------------------------------------

/**
 * PHP Error-level
 */
error_reporting(E_ALL & ~E_NOTICE);


// -----------------------------------------------------------------------------
// C O M M U N I C A T I O N
// -----------------------------------------------------------------------------

/**
 * The backend
 */
define ('config_driver', 'offline');

/**
 * The address, might be a url or filename
 */
define ('config_driver_address', '192.168.x.x');

/**
 * The port, if the driver needs one
 */
define ('config_driver_port', '1028');

/**
 * Use the realtime-mode if possible
 */
define ('config_driver_realtime', false);

/**
 * Use the auto reconnect if possible
 */
define ('config_driver_autoreconnect', false);

// -----------------------------------------------------------------------------
// U S E R - I N T E R F A C E
// -----------------------------------------------------------------------------

/**
 * The name of the stylesheet. Results in NAME.min.css
 * You may change your design with the jquerymobile theme roller
 * @link     http://jquerymobile.com/themeroller/
 */
define ('config_design', 'night');

/**
 * smartVISU supports different projects, located under 'pages'
 * this is the directory for your project
 */
define ('config_pages', '');

/**
 * Select your language. Some widgets are multilanguage
 */
define ('config_lang', 'en');

/**
 * The default page loaded in the project directory
 */
define ('config_index', 'index');

/**
 * The title of the html-pages
 */
define ('config_title', 'YOUR NAME [smartVISU]');

/**
 * Is the page-cache enabled?
 */
define ('config_cache', false);

/**
 * Is the client-dom-cache enabled?
 */
define ('config_cache_dom', true);

/**
 * How is the page-transition made?
 * 'none', 'fade' (default), 'slide'
 */
define ('config_transition', 'fade');

/**
 * Should some html-elements and widgets be animated?
 */
define ('config_animation', false);

/**
 * Shall auto reload for websocket be enabled?
 */
define ('config_autoreload', false);

/**
 * the refresh-delay between glued widgets
 */
define ('config_delay', '750');


// -----------------------------------------------------------------------------
// C O M M U N I C A T I O N
// -----------------------------------------------------------------------------

/**
 * should a proxy be used for outgoing requests
 */
define ('config_proxy', '');

/**
 * the URL of the Proxy - in Form tcp://proxy:port
 */
define ('config_proxy_url', '');

/**
 * the proxy user if needed
 */
define ('config_proxy_user', '');

/**
 * the proxy password if needed
 */
define ('config_proxy_password', '');


// -----------------------------------------------------------------------------
// W I D G E T S
// -----------------------------------------------------------------------------

/**
 * Which service should by used?
 * @value    offline: random values
 * @value    google: google api (deprecated)
 * @value    wunderground: get key: http://www.wunderground.com/weather/api
 * @value    yr.no: http://www.yr.no
 */
define ('config_weather_service', 'offline');

/**
 * What is the default location?
 */
define ('config_weather_location', 'Germany/Bayern/Würzburg');

/**
 * Is there a key for the service?
 */
define ('config_weather_key', '');


/**
 * Which phone-system should by used?
 * @value    offline: random values
 * @value    auerswald: Auerswald VoiP 5010, 5020, Commander Basic.2
 * @value    fritz!box: Fritzbox 7050
 * @value    fritz!box_v5.20: Fritzbox 7390 with fw 5.20+
 * @value    fritz!box_v5.50: Fritzbox 7390 with fw 5.50
 */
define ('config_phone_service', 'offline');

/**
 * What is the ip-address of the phone-system?
 */
define ('config_phone_server', '192.168.x.x');

/**
 * What is the tcp-port of the phone-system?
 */
define ('config_phone_port', '');

/**
 * Is there a user to authenticate?
 */
define ('config_phone_user', '');

/**
 * Is there a password to authenticate?
 */
define ('config_phone_pass', '');


/**
 * Which calender should be used?
 * @value    offline: random values
 * @value    google: Google Calendar
 */
define ('config_calendar_service', 'offline');

/**
 * What is the private url?
 */
define ('config_calendar_url', 'http://www.google.com/calendar/feeds/...');

/**
 * What is the username ?
 */
define ('config_calendar_username', '');

/**
 * What is the password ?
 */
define ('config_calendar_password', '');

/**
 * What is the calendar name ?
 */
define ('config_calendar_name', '');

/**
 * The default code for all Codepads
 */
define ('config_codepad_code', '0000');



// -----------------------------------------------------------------------------
// O P T I M A T I O N S
// -----------------------------------------------------------------------------

// Normally, no need to change values here!

/**
 * Use the minimised files?
 * @value    'js' or 'min.js'
 */
define ('config_js', 'min.js');

/**
 * Special design variable. Defines the eye cancer of using a flavour.
 */
define ('const_cvsucks', 10);

/**
 * The timezone
 */
date_default_timezone_set('Europe/Berlin');

/**
 * Change permissions to enable delete in temp dir
 */
umask(0002);

// -----------------------------------------------------------------------------
// S E T  P R O X Y
// -----------------------------------------------------------------------------

if(config_proxy == "true") {
	$proxy_opts = array(
		'http'=>array(
			'method' => 'GET',
			'proxy' => config_proxy_url,
			'request_fulluri' => True
		)
	);

	if(strlen(proxy_user) > 0) {
		$proxy_opts['http']['header'] = sprintf('Authorization: Basic %s:%s', base64_encode(config_proxy_user), base64_encode(config_proxy_password));
	}
	$default = stream_context_get_default($proxy_opts);
}
?>
