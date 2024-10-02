<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Stefan Widmer
 * @copyright   2016 - 2024
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

require_once '../../lib/includes.php';

header('Content-Type: application/json');

// just clear pagecache
if(isset($_GET['clear_cache']) && $_GET['clear_cache']) {
	$success = delTree(const_path.'temp/pagecache') || ! is_dir(const_path.'temp/pagecache');
	if($success) {
		$success = delTree(const_path.'temp/twigcache') || ! is_dir(const_path.'temp/pagecache');
		if($success)
			echo json_encode(array('title' => 'Configuration', 'text' => trans('status_event_format', 'info')['cleared_cache']));
		else { // save fails
			header("HTTP/1.0 600 smartVISU Config Error");
			echo json_encode(array('title' => 'Configuration', 'text' => trans('status_event_format', 'error')['clearing_twig_cache']));
		}
	}
	else { // save fails
		header("HTTP/1.0 600 smartVISU Config Error");
		echo json_encode(array('title' => 'Configuration', 'text' => trans('status_event_format', 'error')['clearing_page_cache']));
	}
}
// save configuration
else if(isset($_GET['target'])) {
	$config = new config();
	$success = $config->save($_GET['target'], $_POST, $_GET['pages']);
	if($success) {
		$success = delTree(const_path.'temp/pagecache/'.config_cachefolder) || ! is_dir(const_path.'temp/pagecache/'.config_cachefolder);
		if($success)
			echo json_encode(array('title' => 'Configuration', 'text' => trans('status_event_format', 'info')['saved_config']));
		else { // save fails
			header("HTTP/1.0 600 smartVISU Config Error");
			echo json_encode(array('title' => 'Configuration', 'text' => trans('status_event_format', 'error')['saving_config_cache']));
		}

	}
	else { // save fails
		header("HTTP/1.0 600 smartVISU Config Error");
		echo json_encode(array('title' => 'Configuration', 'text' => trans('status_event_format', 'error')['saving_config']));
	}
}
// read configuration
else {
	$config = new config();

	$sources = array('all');
	if(isset($_GET['source']))
		$sources = $_GET['source'];
	if(!\is_array($sources)) $sources = array($sources);

	$result = array();
	foreach($sources as $source) {
		if($source != null && $source != '')
			$result[$source] = $config->get($source);
	}

	echo(json_encode($result));
}
?>
