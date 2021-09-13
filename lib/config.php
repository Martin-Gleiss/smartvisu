<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Stefan Widmer
 * @copyright   2016
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


/**
 * This class manages configuration
 */
class config {

	var $config = array(); // holds configuration values
	var $config_by_source = array(); // cache values of single sources
	const INI_SCANNER = INI_SCANNER_NORMAL;

	/**
	 * constructor
	 */
	public function __construct()
	{
	}

	/**
	 * reads
	 */
	public function get($source = 'all')
	{
		$config = (isset($this->config_by_source[$source]) ? $this->config_by_source[$source] : null);
		// only read if source was not read before
		if($config == null) {

			$config = array();

			switch($source) {

				// default system configuration
				case 'default':
					$config = parse_ini_file(const_path_system.'defaults.ini', true, self::INI_SCANNER);
					break;

				// global configuration (including default)
				case 'global':
					$config = $this->get('default');
					$config = array_replace($config, $this->get('globalonly'));
					break;

				// global configuration (excluding default)
				case 'globalonly':
					if (is_file(const_path.'config.ini'))
						$config = parse_ini_file(const_path.'config.ini', true, self::INI_SCANNER);
					
					//drop support for legacy config.php as of v3.1
					//
					//elseif (is_file(const_path.'config.php')) {
						// read legacy config.php
					//	$configphp = file_get_contents(const_path.'config.php');
					//	preg_match_all("/define\s*\s*\('config_(.*?)'\s*,\s*(.*)\s*\)\s*;\s*[\r\n]+/", $configphp, $matches, PREG_SET_ORDER);

					//	$config = array();
					//	foreach($matches as $match) {
					//		$config[$match[1]] = eval('return '.$match[2].';');
					//	}
					//}
					break;

				// configuration per pages (config.ini in current pages folder)
				case 'pages':
					if (isset($_REQUEST['pages']) && $_REQUEST['pages'] != '') // pages in request
						$config_for_pages['pages'] = $_REQUEST['pages'];
					else {
						// configuration of pages in cookie
						$config_for_pages = $this->get('cookie');
						if(!isset($config_for_pages['pages']) || $config_for_pages['pages'] == '')
							$config_for_pages = $this->get('global');
	 				}

					if (is_file(const_path.'pages/'.$config_for_pages['pages'].'/config.ini'))
						$config = parse_ini_file(const_path.'pages/'.$config_for_pages['pages'].'/config.ini', true, self::INI_SCANNER);
					break;

				// configuration per client in cookie
				case 'cookie':
					if (!empty($_COOKIE['config']))
						$config = json_decode($_COOKIE['config'], true);
					break;

				// actually applied (all sources merged)
				case 'all':
					$config = $this->get('global');
					$config = array_replace($config, $this->get('pages'));
					$config = array_replace($config, $this->get('cookie'));
					break;

			}

			$this->config_by_source[$source] = $config;
		}

		return $config;
	}

	/**
	 * write config to file
	 */
	public function save($target, $options) {

		$config = $target == 'global' ? $this->get('globalonly') : array();
		if ($options['driver'] != $config['driver']) {
			foreach ($config as $key => $val) {
				if (strpos($key, 'driver') === 0) {
					unset($config[$key]);
				}
			}
		}
		$config = array_replace($config, $options);
		ksort($config);

		$success = false;

		switch($target) {
			case 'global':
				$success = write_ini_file($config, const_path.'config.ini', false);
				break;
			case 'pages':
				if (isset($options['pages']) && $options['pages'] != '') {
					$pages = $options['pages'];
				} else {
					$config_for_pages = $this->get('global');
					$pages = $config_for_pages['pages'];
				}
				$success = write_ini_file($config, const_path . "pages/$pages/config.ini", false);
				break;
			case 'cookie':
				$basepath = substr(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), 0, -strlen(substr($_SERVER['SCRIPT_FILENAME'], strlen(const_path))));
				if (isset($config['cache'])) {
					// generate unique cache folder for cookie (combination of remote IP, forwarded IP and time should be unique)
					if(!isset($config['cachefolder']) || $config['cachefolder'] == 'global')
						$config['cachefolder'] = md5($_SERVER['REMOTE_ADDR'] . ($_SERVER['HTTP_CLIENT_IP'] ?: $_SERVER['HTTP_X_FORWARDED_FOR'] ?: $_SERVER['HTTP_X_FORWARDED'] ?: $_SERVER['HTTP_FORWARDED_FOR'] ?: $_SERVER['HTTP_FORWARDED']) . time());
				} else
					unset($config['cachefolder']);
				
				if(count($config) > 0){ // some options are set
					foreach ($config as $key=>&$val) {
						$val = ($val == "true") ? "1" : $val;
						$val = ($val == "false") ? "" : $val;
					}
					$confexpire = time()+3600*24*364*10;  // expires after 10 years
					$success = setcookie('config', json_encode($config), ['expires' => $confexpire, 'path' => $basepath, 'samesite' => 'Lax']); 
				}
				else
					$success = setcookie('config', '', time() - 3600, $basepath); // delete cookie
				break;
		}

		if($success)
			$this->config_by_source[$target] = $config;
			
		return $success;
	}

}

?>