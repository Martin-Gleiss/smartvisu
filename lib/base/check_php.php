<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2024
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


// get config-variables 
require_once '../../lib/includes.php';

// init parameters
$request = array_merge($_GET, $_POST);

// specify required PHP version
$reqver = '7.3.2';

if (version_compare(PHP_VERSION, $reqver, '>='))
{
	$ret = array('icon' => 'message_ok.svg', 'text' => 'PHP v'.phpversion().' '.translate(' is ok', 'templatechecker'));
}
else
{
	header("HTTP/1.0 600 smartVISU Config Error");
	$ret = array('icon' => 'message_attention.svg', 'text' => 'PHP v'.phpversion().' '.trans('templatechecker', 'oldversion'.' '.$reqver.'!'));
}

echo json_encode($ret);
?>
