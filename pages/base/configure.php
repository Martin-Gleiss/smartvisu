<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Stefan Widmer
 * @copyright   2016
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

require_once '../../lib/includes.php';

header('Content-Type: application/json');

// just clear pagecache
if($_GET['clear_cache']) {
	$success = delTree(const_path.'temp/pagecache') || ! is_dir(const_path.'temp/pagecache');
	if($success) {
		$success = delTree(const_path.'temp/twigcache') || ! is_dir(const_path.'temp/pagecache');
		if($success)
			echo json_encode(array('title' => 'Configuration', 'text' => 'Pagecache cleared.'));
		else { // save fails
			header("HTTP/1.0 600 smartVISU Config Error");
			echo json_encode(array('title' => 'Configuration', 'text' => 'Error deleting Twig cache!<br />Please check the file permissions temp/twigcache'));
		}
	}
	else { // save fails
		header("HTTP/1.0 600 smartVISU Config Error");
		echo json_encode(array('title' => 'Configuration', 'text' => 'Error deleting page cache!<br />Please check the file permissions temp/pagecache'));
	}
}
// save configuration
else if(isset($_GET['target'])) {
	$config = new config();
	$success = $config->save($_GET['target'], $_POST, $_GET['pages']);
	if($success) {
		$success = delTree(const_path.'temp/pagecache') || ! is_dir(const_path.'temp/pagecache');
		if($success)
			echo json_encode(array('title' => 'Configuration', 'text' => 'Configuration changes saved.'));
		else { // save fails
			header("HTTP/1.0 600 smartVISU Config Error");
			echo json_encode(array('title' => 'Configuration', 'text' => 'Error saving config or deleting the cache.<br />Please check the file permissions "config.ini" (it must be writeable)!'));
		}

	}
	else { // save fails
		header("HTTP/1.0 600 smartVISU Config Error");
		echo json_encode(array('title' => 'Configuration', 'text' => 'Error saving configuration!<br />Please check the file permissions on "config.ini" (it must be writeable)!'));
	}
}
// read configuration
else {
	$config = new config();

	$sources = array('all');
	if(isset($_GET['source']))
		$sources = $_GET['source'];
	if(!is_array($sources)) $sources = array($sources);

	$result = array();
	foreach($sources as $source) {
		if($source != null && $source != '')
			$result[$source] = $config->get($source);
	}

	echo(json_encode($result));
}
?>
