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

if ((!is_file(const_path.'config.ini') && is_writeable(const_path)) || (is_file(const_path.'config.ini') && is_writeable(const_path.'config.ini')))
{
	$ret = array('icon' => 'message_ok.svg', 'text' => "'config.ini' ".translate('file is writeable or can be created', 'templatechecker'));
}
else
{
	header("HTTP/1.0 600 smartVISU Config Error");
	$ret = array('icon' => 'message_attention.svg', 'text' => "'".const_path."config.ini' ".translate('file isnt writeable or cant be created', 'templatechecker'));
}

echo json_encode($ret);
?>
