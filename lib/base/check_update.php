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
$url = "https://smartvisu.de/download/check.php?local=".(isset($request["local"]) ? $request["local"] : config_version);

$data = json_decode(file_get_contents($url, false));

$ret["local"] = $data->local;
$ret["remote"] = $data->remote;

if ($data->update)
{
	$ret["update"] = true;
	$ret["icon"] = 'message_attention.svg';
	$ret["text"] = 'please make update to v'.$data->remote;
}
else
{
	$ret["update"] = false;
	$ret["icon"] = 'message_ok.svg';
	$ret["text"] = 'smartVISU is up to date';
}

echo json_encode($ret);
?>
