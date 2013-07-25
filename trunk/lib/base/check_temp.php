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

if (is_writeable(const_path.'/temp'))
{
	$ret = array('icon' => 'icons/gn/message_ok.png', 'text' => "'temp' is writeable");
}
else
{
	header("HTTP/1.0 600 smartVISU Config Error");
	$ret = array('icon' => 'icons/or/message_attention.png', 'text' => "'temp' is not writeable!");
}

echo json_encode($ret);
?>
