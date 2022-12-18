<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Wolfram v. Hülsen
 * @copyright   2012 - 2021
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 *
 * read a dircetory on the server, apply a filter to the file extensions
 * and return an array of available filenames
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
	
	