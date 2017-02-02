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

// just clear pagecache
if($_GET['clear_cache']) {

	delTree(const_path.'temp/pagecache');
	$ret = array('title' => 'Configuration', 'text' => 'Pagecache cleared.');
	echo json_encode($ret);

}
else {

	// save configuration
	if(isset($_GET['target'])) {
		$config = new config();

		if($config->save($_GET['target'], $_POST, $_GET['pages']) === true) {
			if($_POST['cache'] != 'true')
				delTree(const_path.'temp/pagecache');

			echo json_encode(array('title' => 'Configuration', 'text' => 'Configuration changes saved.'));
		}
		else { // save fails
			header("HTTP/1.0 600 smartVISU Config Error");
			return array('title' => 'Configuration',
				'text' => 'Error saving configuration!<br />Please check the file permissions on "config.php" (it must be writeable)!');
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
}
?>