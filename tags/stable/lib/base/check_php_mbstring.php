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

if (extension_loaded("mbstring"))
{
	$ret = array('icon' => 'icons/gn/message_ok.png', 'text' => "php extention 'mbstring' loaded");
}
else
{
	header("HTTP/1.0 600 smartVISU Config Error");
	$ret = array('icon' => 'icons/or/message_attention.png', 'text' => "php extention 'mbstring' not loaded!");
}

echo json_encode($ret);
?>
