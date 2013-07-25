<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


// get config-variables 
require_once '../../lib/includes.php';

// init parameters
$request = array_merge($_GET, $_POST);

$url = "http://code.google.com/feeds/p/smartvisu/downloads/basic";

// get contents
$data = file_get_contents($url);
$xml = simplexml_load_string($data);

$file = basename((string)$xml->entry->id);

$ret["local"] = (strlen($request["local"]) > 3 ? $request["local"] : str_replace('.', '.0', $request["local"]));

$remote = substr(strstr($file, '_'), 1, -4);
$ret["remote"] = (strlen($remote) > 3 ? $remote : str_replace('.', '.0', $remote));

if ((float)$ret["remote"] > (float)$ret["local"])
{
	$ret["update"] = true;
	$ret["icon"] = 'icons/or/message_attention.png';
	$ret["text"] = 'please make a update!';
}
else
{
	$ret["update"] = false;
	$ret["icon"] = 'icons/gn/message_ok.png';
	$ret["text"] = 'smartVISU is up to date';
}

echo json_encode($ret);
?>


