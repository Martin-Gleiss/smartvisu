<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


// get config-variables 
require_once '../../lib/includes.php';

// init parameters
$request = array_merge($_GET, $_POST);

// get contents
$url = "http://smartvisu.de/download/check.php";

$url .= "?local=".$request["local"];
exec('cat /sys/class/net/eth0/address', $out, $error);
if ($error)
	$out[0] = $_SERVER['SERVER_SOFTWARE'].$_SERVER['SERVER_NAME'].$_SERVER['SERVER_ADDR'];

$url .= "&hash=".md5($out[0]).substr(config_driver, 0, 1);
$data = json_decode(file_get_contents($url, false));

$ret["local"] = $data->local;
$ret["remote"] = $data->remote;

if ($data->update)
{
	$ret["update"] = true;
	$ret["icon"] = 'icons/sw/message_attention.svg';
	$ret["text"] = 'please make update to v'.$data->remote;
}
else
{
	$ret["update"] = false;
	$ret["icon"] = 'icons/sw/message_ok.svg';
	$ret["text"] = 'smartVISU is up to date';
}

echo json_encode($ret);
?>


