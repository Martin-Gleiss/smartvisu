<?php

/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Thomas Ernst
 * @copyright   2016
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */
// get config-variables 
require_once '../includes.php';
require_once 'class.Config.php';
require_once 'class.MessageCollection.php';
require_once 'class.Settings.php';
require_once 'class.Widget.php';
require_once 'class.WidgetParameterChecker.php';
require_once 'class.TemplateChecker.php';

RequestHandler::run();

class RequestHandler {

	/**
	 * Get request parameter (if existing)
	 * @param string $param name of parameter
	 * @return any value of parameter or NULL if parameter not found
	 */
	private static function getRequestParameter($param) {
		if (filter_has_var(INPUT_POST, $param))
			return filter_input(INPUT_POST, $param);
		if (filter_has_var(INPUT_GET, $param))
			return filter_input(INPUT_GET, $param);
		return NULL;
	}

	/**
	 * Handle request and return result
	 */
	public static function run() {
		$cmd = self::getRequestParameter('cmd');
		try {
			if (!$cmd)
				throw new Exception('Invalid data: Command missing');

			switch ($cmd) {
				case 'analyze':
					$ret = self::analyzeFile();
					break;
				case 'getfiles':
					$ret = self::getFileArray('pages/' . self::getRequestParameter('pages'), '.html');
					break;
				default:
					throw new Exception('Invalid command');
			}
			header('Content-Type: application/json; charset=UTF-8');
			echo json_encode($ret);
		} catch (Exception $e) {
			header('HTTP/1.1 500 Internal Server Error');
			header('Content-Type: application/json; charset=UTF-8');
			die(json_encode(array('message' => $e->getMessage())));
		}
	}

	/**
	 * Read files in directory, including files in subdirectories
	 * @param string $dir directory to read (relative to const_path)
	 * @return array list of files
	 */
	private static function getFileArray($dir, $suffix) {
		clearstatcache();

		$ret = array();
		$dirlist = dir(const_path . $dir);
		while (($item = $dirlist->read()) !== false) {
			if (substr($item, 0, 1) != '.') {
				if (is_dir(const_path . $dir . '/' . $item)) {
					$ret = array_merge($ret, self::getFileArray($dir . '/' . $item, $suffix));
				} else if (substr($item, -strlen($suffix)) == $suffix) {
					$id = str_replace('/', '-', $dir . '/' . $item);
					$id = str_replace('.', '-', $id);
					$ret[$id] = $dir . '/' . $item;
				}
			}			
		}
		$dirlist->close();
		ksort($ret);
		return $ret;
	}

	/**
	 * Run template checker for file. Parameters are read from request
	 * @return array
	 */
	private static function analyzeFile() {
		$file = self::getRequestParameter('file');
		$fileid = self::getRequestParameter('fileid');
		$messages = new MessageCollection();
		TemplateChecker::run($file, $messages);
		return array(
			'file' => $file,
			'resultid' => 'r' . substr($fileid, 1),
			'total_severity' => $messages->getMaxSeverity(),
			'messages' => $messages->getMessagesGrouped(),
			'counts' => $messages->getMessageCounts(),
			'total_count' => $messages->getTotalMessageCount(),
		);
	}

}

?>