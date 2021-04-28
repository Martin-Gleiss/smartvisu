<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

require_once 'includes.php';
require_once const_path_system.'functions_twig.php';

	$request = array_merge($_GET, $_POST);
	$dir = $request['directory'];
	if (isset($request['filter']))
		$filter = $request['filter']; 
	else
		$filter = '(.*)';
	
	$ret = array ();
	$ret= twig_dir($dir, $filter);
		
	header('Content-Type: text/json');
	echo json_encode($ret);

?>
	
	