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

		// only read if source was not read before
		if($this->config_by_source[$source] == null) {

			$this->config_by_source[$source] = array();

			switch($source) {

				// default system configuration
				case 'default':
					$this->config_by_source[$source] = parse_ini_file(const_path_system.'defaults.ini', true, INI_SCANNER_TYPED);
					break;

				// global configuration (including default)
				case 'global':
					$config = $this->get('default');
					$this->config_by_source[$source] = array_replace($config, $this->get('globalonly'));
					break;

				// global configuration (excluding default)
				case 'globalonly':
					if (is_file(const_path.'config.ini'))
						$this->config_by_source[$source] = parse_ini_file(const_path.'config.ini', true, INI_SCANNER_TYPED);
					elseif (is_file(const_path.'config.php')) {
						// read legacy config.php
						$configphp = file_get_contents(const_path.'config.php');
						preg_match_all("/define\s*\s*\('config_(.*?)'\s*,\s*(.*)\s*\)\s*;\s*[\r\n]+/", $configphp, $matches, PREG_SET_ORDER);

						$config = array();
						foreach($matches as $match) {
							$config[$match[1]] = eval('return '.$match[2].';');
						}

            $this->config_by_source[$source] = $config;
					}
					break;

				// configuration per pages (config.ini in current pages folder)
				case 'pages':
					$config_for_pages = $this->get('global');
					// configuration of pages in cookie
					$config_for_pages = array_replace($config_for_pages, $this->get('cookie'));
					// pages in request
					if ($_REQUEST['pages'] != '')
						$config_for_pages['pages'] = $_REQUEST['pages'];

					if (is_file(const_path.'pages/'.$config_for_pages['pages'].'/config.ini'))
						$this->config_by_source[$source] = parse_ini_file(const_path.'pages/'.$config_for_pages['pages'].'/config.ini', true, INI_SCANNER_TYPED);
					break;

				// configuration per client in cookie
				case 'cookie':
					if (!empty($_COOKIE['config']))
				    $this->config_by_source[$source] = json_decode($_COOKIE['config'], true);
					break;

				// actually applied (all sources merged)
				case 'all':
					$config = $this->get('global');
					$config = array_replace($config, $this->get('pages'));
					$config = array_replace($config, $this->get('cookie'));
					$this->config_by_source[$source] = $config;
					break;

			}

		}

		return $this->config_by_source[$source];
	}

	/**
	 * write config to file
	 */
	public function save($target, $options, $pages) {

		$config = $target == 'global' ? $this->get('globalonly') : array();
		$config = array_replace($config, $options);
		ksort($config);

		$success = false;

		switch($target) {
			case 'global':
				$success = write_ini_file($config, const_path.'config.ini', false);
				break;
			case 'pages':
				$success = write_ini_file($config, const_path.'pages/'.$pages.'/config.ini', false);
				break;
			case 'cookie':
				$basepath = substr(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), 0, -strlen(substr($_SERVER['SCRIPT_FILENAME'], strlen(const_path))));
				if(count($config) > 0) // some options are set
					$success = setcookie('config', json_encode($config), time()+60*60*24*364*10, $basepath); // store for 10 years
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