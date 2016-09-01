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
require_once '../../lib/includes.php';

PageChecker::run();

class PageChecker {

	public static function getRequestParameter($param) {
		if (filter_has_var(INPUT_POST, $param))
			return filter_input(INPUT_POST, $param);
		if (filter_has_var(INPUT_GET, $param))
			return filter_input(INPUT_GET, $param);
		return NULL;
	}

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
					$ret = self::getFileArray('pages/' . config_pages, '.html');
					break;
				default:
					throw new Exception('Invalid command');
			}
			echo json_encode($ret);
		} catch (Exception $e) {
			header('HTTP/1.1 500 Internal Server Booboo');
			header('Content-Type: application/json; charset=UTF-8');
			die(json_encode(array('message' => $e->getMessage())));
		}
	}

	/**
	 * Read files in directory, including files in subdirectories
	 * @param string $dir directory to read (relative to const_path)
	 * @return array list of files
	 */
	private static function getFileArray($dir) {
		clearstatcache();

		$ret = array();
		$dirlist = dir(const_path . $dir);
		while (($item = $dirlist->read()) !== false) {
			if ($item != '.' and $item != '..' and substr($item, 0, 1) != '.') {
				if (is_dir(const_path . $dir . '/' . $item)) {
					$ret = array_merge($ret, self::getFileArray($dir . '/' . $item, $filter));
				} else {
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

	private static function analyzeFile() {
		$file = self::getRequestParameter('file');
		$messages = new MessageCollection();
		TemplateChecker::run($file, $messages);
		return array(
			'file' => $file,
			'id' => 'r' . substr($id, 1),
			'total_severity' => $messages->getMaxSeverity(),
			'messages' => $messages->getMessages(),
		);
	}

}

class MessageCollection {

	/**
	 * Constant: Severity "Error"
	 */
	const SEVERITY_ERROR = 'E';

	/**
	 * Constant: Severity "Warning"
	 */
	const SEVERITY_WARNING = 'W';

	/**
	 * Constant: Severity "Information"
	 */
	const SEVERITY_INFO = 'I';

	/**
	 * Constant: Severity "None"
	 */
	const SEVERITY_NONE = 'N';

	/**
	 * List of messages
	 * @var array 
	 */
	private $messages;

	/**
	 * Number of messages by severity
	 * @var array 
	 */
	private $messageCount;

	/**
	 * Constructor
	 */
	function __construct() {
		$this->messages = array();
		$this->messageCount = array(
			self::SEVERITY_ERROR => 0,
			self::SEVERITY_WARNING => 0,
			self::SEVERITY_INFO => 0,
		);
	}

	/**
	 * Add error to list of messages
	 * @param string $test Name of test
	 * @param string $message Message
	 * @param integer $lineNo Line number
	 * @param string $line Line text
	 * @param array $data Additional data
	 */
	public function addError($test, $message, $lineNo = 0, $line = '', $data = array()) {
		$this->addMessage(MessageCollection::SEVERITY_ERROR, $test, $message, $lineNo,
				$line, $data);
	}

	/**
	 * Add warning to list of messages
	 * @param string $test Name of test
	 * @param string $message Message
	 * @param integer $lineNo Line number
	 * @param string $line Line text
	 * @param array $data Additional data
	 */
	public function addWarning($test, $message, $lineNo = 0, $line = '', $data = array()) {
		$this->addMessage(MessageCollection::SEVERITY_WARNING, $test, $message,
				$lineNo, $line, $data);
	}

	/**
	 * Add information to list of messages
	 * @param string $test Name of test
	 * @param string $message Message
	 * @param integer $lineNo Line number
	 * @param string $line Line text
	 * @param array $data Additional data
	 */
	public function addInfo($test, $message, $lineNo = 0, $line = '', $data = array()) {
		$this->addMessage(MessageCollection::SEVERITY_INFO, $test, $message, $lineNo,
				$line, $data);
	}

	/**
	 * Add message to list of messages
	 * @param string $severity Severity
	 * @param string $test Name of test
	 * @param string $message Message
	 * @param integer $lineNo Line number
	 * @param string $line Line text
	 * @param array $data Additional data
	 */
	public function addMessage($severity, $test, $message, $lineNo = 0, $line = '', $data = array()) {
		$this->messages[] = array(
			'severity' => $severity,
			'test' => $test,
			'message' => $message,
			'lineNo' => $lineNo,
			'line' => $line,
			'data' => $data
		);
		$this->messageCount[$severity] += 1;
	}

	/**
	 * return list of messages
	 * @return array
	 */
	public function getMessages() {
		return $this->messages;
	}

	/**
	 * return number of messages for certain severity
	 * @param string $severity Severity
	 * @return int number of messages
	 */
	public function getMessageCount($severity) {
		if (array_key_exists($severity, $this->messageCount))
			return($this->messageCount[$severity]);
		return 0;
	}

	/**
	 * return total number of messages
	 * @return int number of messages
	 */
	function getTotalMessageCount() {
		$total = 0;
		foreach ($this->messageCount as $severity => $count)
			$total += $count;
		return $total;
	}

	/**
	 * return maximum severity
	 * @return string
	 */
	function getMaxSeverity() {
		if ($this->messageCount[self::SEVERITY_ERROR] != 0)
			return self::SEVERITY_ERROR;
		if ($this->messageCount[self::SEVERITY_WARNING] != 0)
			return self::SEVERITY_WARNING;
		if ($this->messageCount[self::SEVERITY_INFO] != 0)
			return self::SEVERITY_INFO;
		return self::SEVERITY_NONE;
	}

}

class TemplateChecker {

	const SHOW_SUCCESS_TOO = true;

	/**
	 * Message Collection
	 * @var MessageCollection 
	 */
	private $messages;

	/**
	 * Array containing known inline pictures
	 * @var array 
	 */
	private $inline_pics = array('arrow-l', 'arrow-r', 'arrow-u', 'arrow-d', 'delete',
		'plus', 'minus', 'check', 'gear', 'refresh', 'forward', 'back', 'grid', 'star',
		'alert', 'info', 'home', 'search');

	/**
	 * Array containing parameter information on widgeds
	 * @var array
	 */
	private $image_params = array(
		'basic.button' => array(3 => 'image'),
		'basic.dual' => array(2 => 'image', 3 => 'image'),
		'basic.checkbox' => array(),
		'basic.colordisc' => array(),
		'basic.flip' => array(),
		'basic.float' => array(),
		'basic.formula' => array(),
		'basic.glue' => array(),
		'basic.multistate' => array(),
		'basic.rgb' => array(),
		'basic.shifter' => array(),
		'basic.shutter' => array(),
		'basic.slider' => array(),
		'basic.switch' => array(2 => 'image', 3 => 'image'),
		'basic.symbol' => array(3 => 'image'),
		'basic.tank' => array(),
		'basic.text' => array(),
		'basic.trigger' => array(),
		'basic.value' => array(),
		'calendar.list' => array(),
		'clock.digiclock' => array(),
		'clock.iconclock' => array(),
		'clock.miniclock' => array(),
		'device.blind' => array(),
		'device.codepad' => array(),
		'device.dimmer' => array(),
		'device.shutter' => array(),
		'lib.updatecheck' => array(),
		'appliance.iprouter' => array(),
		'icon.arrow' => array(),
		'icon.battery' => array(),
		'icon.windrose' => array(),
		'phone.list' => array(),
		'phone.missedlist' => array(),
		'plot.comfortchart' => array(),
		'plot.minmaxavg' => array(),
		'plot.period' => array(),
		'plot.rtr' => array(),
		'multimedia.image' => array(1 => 'image'),
		'multimedia.music' => array(),
		'multimedia.slideshow' => array(),
		'multimedia.station' => array(2 => 'image'),
		'status.collapse' => array(),
		'status.log' => array(),
		'status.message' => array(),
		'status.notify' => array(),
		'weather.current' => array(),
		'weather.forecast' => array(),
		'weather.forecastweek' => array(),
		'weather.map' => array(),
		'weather.mapslides' => array(),
		'weather.weather' => array(),
	);

	/**
	 * file to test
	 * @var type 
	 */
	private $fileName;

	/**
	 * DOMDocument object for file
	 * @var DOMDocument
	 */
	private $domDocument;

	/**
	 * path for icon0
	 * @var string
	 */
	private $icon0;

	/**
	 * path for icon1
	 * @var string
	 */
	private $icon1;

	public static function run($fileName, MessageCollection $messages) {
		$checker = new TemplateChecker($fileName, $messages);
		$checker->performTests();
		return $checker;
	}

	/**
	 * Constructor
	 * @param string $fileName file to test
	 * @param MessageCollection $messages MessageCollection to add messages to
	 */
	public function __construct($fileName, MessageCollection $messages) {
		$this->messages = $messages;
		$this->fileName = $fileName;

		// Taken from index.php, adapted
		if (config_design == 'ice') {
			$this->icon1 = 'icons/bl/';
			$this->icon0 = 'icons/sw/';
		} elseif (config_design == 'greenhornet') {
			$this->icon1 = 'icons/gn/';
			$this->icon0 = 'icons/ws/';
		} else {
			$this->icon1 = 'icons/or/';
			$this->icon0 = 'icons/ws/';
		}
	}

	/**
	 * Run tests and populate message array
	 */
	public function performTests() {
		// dom extension available?
		if (!extension_loaded('dom')) {
			$this->messages->addError('PREREQUISITIONS',
					'php module "dom" not available!');
			return;
		}

		// File given?
		if (!$this->fileName) {
			$this->messages->addError('FILE CHECK', 'Invalid data. No file given!');
			return;
		}

		// File existing?
		$absFile = const_path . $this->fileName;
		if (!is_file($absFile)) {
			$this->messages->addError('FILE CHECK', 'Not a file: ' . $this->file);
			return;
		}

		if (!$this->readFile($absFile))
			return;

		$this->checkNode($this->domDocument->documentElement);
	}

	/**
	 * Open file
	 * @return \DOMDocument
	 */
	private function readFile($absFile) {
		// Read file into DOMDocument, add errors for parsing issues
		$this->domDocument = new DOMDocument();
		libxml_use_internal_errors(true);
		$this->domDocument->loadHTMLFile($absFile);
		$errors = libxml_get_errors();
		foreach ($errors as $error) {
			/* @var $error LibXMLError */
			$data = array(
				"Level" => $error->level,
				"Column" => $error->column,
				"Code" => $error->code,
			);
			$this->messages->addWarning('HTML PARSER', $error->message, $error->line, '',
					$data);
			return false;
		}
		libxml_clear_errors();
		libxml_use_internal_errors(false);
		return true;
	}

	/**
	 * Check Node
	 * @param \DOMElement $node Node to check
	 * @param integer $level Nesting level
	 */
	function checkNode($node, $level = 0) {
		if ($node->nodeType == XML_ELEMENT_NODE) {
			switch ($node->tagName) {
				case 'img':
					$src = $node->getAttribute('src');
					$this->checkImageSrc($node, $src);
					break;
			}
		} else if ($node->nodeType == XML_TEXT_NODE) {
			$value = trim($node->textContent);
			if (preg_match_all("/{{(.*?)}}/", $value, $macros)) {
				for ($i = 0; $i < count($macros[0]); $i++)
					$this->checkWidget($node, trim($macros[1][$i]));
			}
		}

		// Check child nodes recursively
		if ($node->hasChildNodes()) {
			foreach ($node->childNodes as $childNode) {
				$this->checkNode($childNode, $level + 1);
			}
		}
	}

	/**
	 * Check Image src
	 * @param \DOMElement $node currently checked node
	 * @param string $src value of src-attribute
	 */
	private function checkImageSrc($node, $src) {
		$file = $src;
		$existing = $this->isFileExisting($file);
		$lineNo = $node->getLineNo();
		$line = $node->ownerDocument->saveXML($node);
		$data = array(
			"Image File" => $src,
			"Checked File" => $file,
		);
		if (!$existing) {
			$this->messages->addError('IMG TAG CHECK', 'Missing image', $lineNo, $line,
					$data);
		} else if (self::SHOW_SUCCESS_TOO) {
			$this->messages->addInfo('IMG TAG CHECK', 'Existing image', $lineNo, $line,
					$data);
		}
	}

	/**
	 * Check widget
	 * @param \DOMElement $node currently checked node
	 * @param string $macro widget (including parameters)	 
	 */
	private function checkWidget($node, $macro) {
		if (!preg_match("/^[^\(]+/", $macro, $name))
			return;

		$widget = trim(strtolower($name[0]));

		if (!preg_match("/\((.*?)\)/", $macro, $parameters))
			return;
		$param_array = explode(",", $parameters[1]);

		if (array_key_exists($widget, $this->image_params)) {
			foreach ($this->image_params[$widget] as $param_no => $param_check)
				switch ($param_check) {
					case 'image':
						$this->checkWidgetImageParameter($node, $macro, $widget, $param_array,
								$param_no);
						break;
				}
		} else {
			$data = array(
				'Widget' => $widget,
				'Parameters' => $param_array,
			);

			$lineNo = $node->getLineNo();
			$this->messages->addWarning('WIDGET PARAM CHECK',
					'Unknown Widget found. Check manually!', $lineNo, $macro, $data);
		}
	}

	/**
	 * Check image parameter of widget
	 * @param \DOMElement $node currently checked node
	 * @param string $macro widget (including parameters)
	 * @param type $widget name of widget
	 * @param type $param_array array containing parameters
	 * @param type $param_no index of parameter to check
	 * @return boolean TRUE: Image parameter OK, FALSE: Image Parameter wrong
	 */
	private function checkWidgetImageParameter($node, $macro, $widget, $param_array, $param_no) {
		// optional parameter not given
		if (count($param_array) <= $param_no)
			return true;

		// parameter empty
		$param = trim($param_array[$param_no], " \t\n\r\0\x0B'");
		if ($param == '')
			return true;

		// inline pic
		if (in_array($param, $this->inline_pics))
			return true;

		$file = $param;
		if (!$this->isFileExisting($file)) {
			$data = array(
				'Widget' => $widget,
				'Parameters' => $param_array,
				'Parameter' => $param_no,
				'Parameter Value' => $param,
				'File' => $file,
			);
			$lineNo = $node->getLineNo();
			$this->messages->addWarning('WIDGET PARAM CHECK', 'Image not found', $lineNo,
					$macro, $data);
		} else if (self::SHOW_SUCCESS_TOO) {
			$data = array(
				'Widget' => $widget,
				'Parameters' => $param_array,
				'Parameter' => $param_no,
				'Parameter Value' => $param,
				'File' => $file,
			);
			$lineNo = $node->getLineNo();
			$this->messages->addInfo('WIDGET PARAM CHECK', 'Image found', $lineNo,
					$macro, $data);
			return true;
		}
	}

	/**
	 * Check if file is existing
	 * @param string $file file to check
	 * @return boolean TRUE: File is existing, FALSE: File is not existing
	 */
	private function isFileExisting(&$file) {
		// Remote file via http or https: Do not check further for now
		if (strtolower(substr($file, 0, 7)) == 'http://' ||
				strtolower(substr($file, 0, 8)) == 'https://')
			return true;

		// replace {{ icon0 }} and {{ icon1 }}
		if (preg_match_all("/{{(.*?)}}/", $file, $match)) {
			for ($i = 0; $i < count($match[0]); $i++) {
				switch (strtolower(trim($match[1][$i]))) {
					case 'icon0':
						$file = str_replace($match[0][$i], $this->icon0, $file);
						break;
					case 'icon1':
						$file = str_replace($match[0][$i], $this->icon1, $file);
						break;
					default:
						// still a parameter in the image, no further testing at the moment
						return true;
						break;
				}
			}
		}

		// add const_path if $file is relative
		if (substr($file, 0, 1) != '/') {
			if (strpos($file, '/') === false) {
				$file = const_path . $this->icon0 . $file;
			} else {
				$file = const_path . $file;
			}
		}

		$file = substr($file, 0, 1) == '/' ? $file : const_path . $file;

		return is_file($file);
	}

}

?>