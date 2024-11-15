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

if (is_writeable(const_path.'temp'))
{
	$ret = array('icon' => 'message_ok.svg', 'text' => "'temp' ".translate('directory is writeable', 'templatechecker'));
}
else
{
	header("HTTP/1.0 600 smartVISU Config Error");
	$ret = array('icon' => 'message_attention.svg', 'text' => "'".const_path."temp' ".translate('directory is not writeable', 'templatechecker'));
}

echo json_encode($ret);
?>