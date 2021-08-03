<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Patrik Germann
 * @copyright   2021
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

	// get config-variables
	require_once '../lib/includes.php';

	//make URL
	if (config_driver_ssl == true) {
		$url = 'https://' . config_driver_address . (config_driver_tlsport ? ':' . config_driver_tlsport : '') . "/rest/";
	} else {
		$url = 'http://' . config_driver_address . (config_driver_port ? ':' . config_driver_port : '') . "/rest/";
	}
	$url .= $_GET['url'];
	
	$options = array(
		'http' => array(
			'method' => $_SERVER['REQUEST_METHOD'],
			'header' => '',
		),
	);

	//Authentication
	if (config_driver_username) {
		$options['http']['header'] = 'Authorization: Basic ' . base64_encode(config_driver_username . ':' . config_driver_password) . "\r\n";
	}

	// data to send
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
		$options['http']['header'] .= "Content-Type: $_SERVER[CONTENT_TYPE]\r\n";
		$options['http']['content'] = file_get_contents('php://input');
	}

	$context = stream_context_create($options);

	if (strpos($_GET['url'],'event') === false) {
		$result = file_get_contents($url, false, $context);
		foreach ($http_response_header as $rHeader) {
			header($rHeader);
		}
		header('Cache-Control: no-cache');

		echo $result;
	}
?>