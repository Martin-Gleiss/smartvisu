<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

/**
 * Path of system-directory
 */
define ('const_path_system', dirname(__FILE__).'/');
/**
 * Path of smartVISU
 */
define ('const_path', substr(const_path_system, 0, -4));


// -----------------------------------------------------------------------------
// C O M M O N
// -----------------------------------------------------------------------------

/**
 * PHP Error-level
 */
error_reporting(E_ALL & ~E_NOTICE);

/**
 * Change permissions to enable delete in temp dir
 */
umask(0002);

/**
 * Include main-functions
 */
require_once const_path_system.'functions.php';
require_once const_path_system.'functions_twig.php';

// -----------------------------------------------------------------------------
// L O A D  C O N F I G U R A T I O N
// -----------------------------------------------------------------------------

require_once const_path.'version-info.php';
require_once const_path_system.'config.php';

$config = new config();
$GLOBALS['config'] = $config->get();

// define constant for all config values (for backward compatibility)
foreach ($GLOBALS['config'] as $key => $value) {
	define('config_' . $key, $value);
}

/**
 * Set proxy according to config
 */
if($GLOBALS['config']['proxy'] == true) {
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

/**
 * Set timezone according to config
 */
date_default_timezone_set(config_timezone);

?>