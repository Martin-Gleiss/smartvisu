<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Patrik Germann
 * @copyright   2022
 * @license     GPL [http://www.gnu.de]
 * @version     1.0.1
 * -----------------------------------------------------------------------------
 */

// get config-variables 
require_once '../../lib/includes.php';

set_include_path(get_include_path() . PATH_SEPARATOR . 'phpseclib');
include('Net/SSH2.php');

$ssh = new Net_SSH2(config_driver_address, config_driver_consoleport);
if (!$ssh->login(config_driver_consoleusername, config_driver_consolepassword)) {
	header("HTTP/1.0 603 smartVISU Driver Error");
	$return = array('title' => 'Driver: openHAB', 'text' => 'Console-Login failed');
}

$return = null;

if ($_POST['cmd']) {
	$cmd = $_POST['cmd'];
	$response = $ssh->exec($cmd);
	$maincmd = substr($cmd, 0, strpos($cmd, ':'));
	if ($maincmd == 'log') {
		preg_match_all('/(\[[0-9]+m)*([A-Z]+)\|([0-9- :.]+)\|([0-9A-Za-z.]+)\|\[[0-9;]+m(.+)\[m/', $response, $parsedlog, PREG_SET_ORDER);
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
		$return = json_encode($logarray);
	} else {
		$return = $response;
	}
}

echo $return;

?>