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

if (version_compare(PHP_VERSION, '5.2.4'))
{
	$ret = array('icon' => 'icons/sw/message_ok.svg', 'text' => 'PHP v'.phpversion().' is ok');
}
else
{
	header("HTTP/1.0 600 smartVISU Config Error");
	$ret = array('icon' => 'icons/sw/message_attention.svg', 'text' => 'PHP v'.phpversion().' failure, you need at least 5.2.4!');
}

echo json_encode($ret);
?>
