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

$cachetext = trans('configuration_page', 'cache');
clearstatcache(true, const_path.'temp');
if (is_writeable(const_path.'temp'))
{
	$ret = array('icon' => 'message_ok.svg', 'text' => "'temp' $cachetext[writable]");
}
else
{
	header("HTTP/1.0 600 smartVISU Config Error");
	$ret = array('icon' => 'message_attention.svg', 'text' => "'".const_path."temp' $cachetext[notwritable]");
}

echo json_encode($ret);
?>