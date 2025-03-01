<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Patrik Germann
 * @copyright   2022
 * @license     GPL [http://www.gnu.de]
 * @version     2.0.0
 * -----------------------------------------------------------------------------
 */

error_reporting(E_ALL);
ini_set('display_errors', 0);

if ($_POST['cmd']) {
	if (substr($_POST['cmd'], 0, 11) == 'log:display') {
		$cmd = explode(' ', $_POST['cmd']);
		$logger = $cmd[1];
		$count = isset($cmd[2]) ? $cmd[2] : null;
		$_POST['cmd'] = "log:display -p '%p|%d{YYYY-MM-dd HH:mm:ss.SSS}|[%c]|%h{%m}%n' --no-color" . ($cmd[1] == 'default' ? ($count ? " -n $count" : '') : " $cmd[1]");
	}

	// get config-variables 
	require_once '../../lib/includes.php';

	if (extension_loaded('ssh2')) {
		$ssh = ssh2_connect(config_driver_address, config_driver_consoleport);
		if (!ssh2_auth_password($ssh, config_driver_consoleusername, config_driver_consolepassword)) {
			header("HTTP/1.0 603 smartVISU Driver Error");
			echo '{"title": "Driver: openHAB-Console", "text": "Login failed"}';
			exit;
		}
		$ssh_stream = ssh2_exec($ssh, $_POST['cmd']);
		stream_set_blocking($ssh_stream, true);
		$response = $output = stream_get_contents($ssh_stream);
	} else {
		header("HTTP/1.0 603 smartVISU Driver Error");
		echo '{"title": "Driver: openHAB-Console", "text": "PHP-Extension SSH2 not loaded"}';
		exit;
	}

	if (error_get_last()) {
		$err = error_get_last();
		header("HTTP/1.0 603 smartVISU Driver Error");
		echo '{"title": "Driver: openHAB-Console", "text": "' . $err['message'] . '"}';
		exit;
	}

	$return = array();
	
	if (substr($_POST['cmd'], 0, 11) == 'log:display') {
		preg_match_all('/(\[[0-9]+m)*([A-Z]+)\|([0-9- :.]+)\|\[(.+)\]\|\[[0-9;]+m(.+)\[m/', $response, $parsedlog, PREG_SET_ORDER);
		$logarray = array();
		foreach ($parsedlog as $line) {
			$logarray[] = array(
				'id'      => md5($line[0]),
				'level'   => str_replace(array('WARN', 'TRACE'), array('WARNING', 'DEBUG'), $line[2]),
				'time'    => $line[3],
				'message' => "[$line[4]] - $line[5]"
			);
		}
		$logarray = array_reverse($logarray);
		$return = array_slice($logarray, 0, $count);
	} else {
		$return = explode("\r\n", $response);
	}
	echo json_encode($return);
} else {
	header("HTTP/1.0 603 smartVISU Driver Error");
	echo '{"title": "Driver: openHAB-Console", "text": "No command"}';
}

?>