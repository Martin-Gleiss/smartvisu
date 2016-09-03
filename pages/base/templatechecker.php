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
	const FILE_MISSING = 0;
	const FILE_EXISTING = 1;
	const FILE_REMOTE = 2;
	const FILE_CONTAINS_PARAMS = 3;

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
		'basic.button' => array(
			3 => array('type' => 'image', 'color' => 6, 'defaultcolor' => 'icon0')
		),
		'basic.dual' => array(
			2 => array('type' => 'image', 'color' => 7, 'defaultcolor' => 'icon1'),
			3 => array('type' => 'image', 'color' => 8, 'defaultcolor' => 'icon0')
		),
		'basic.checkbox' => array(),
		'basic.colordisc' => array(),
		'basic.flip' => array(),
		'basic.float' => array(),
		'basic.formula' => array(),
		'basic.glue' => array(),
		'basic.imate' => array(1 => 'image'),
		'basic.multistate' => array(),
		'basic.rgb' => array(),
		'basic.shifter' => array(),
		'basic.shutter' => array(),
		'basic.slider' => array(),
		'basic.switch' => array(
			2 => array('type' => 'image', 'color' => 6, 'defaultcolor' => 'icon1'),
			3 => array('type' => 'image', 'color' => 7, 'defaultcolor' => 'icon0')
		),
		'basic.symbol' => array(
			3 => array('type' => 'image', 'color' => 6, 'defaultcolor' => 'icon0')
		),
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
		'device.rtr' => array(),
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
		'multimedia.image' => array(
			1 => array('type' => 'image')
		),
		'multimedia.music' => array(),
		'multimedia.slideshow' => array(),
		'multimedia.station' => array(
			2 => array('type' => 'image')
		),
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
	private $ignore_html_error_code = array(
		68, //error parsing attribute name 
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
		$html = file_get_contents($absFile);
		$html = mb_convert_encoding($html, 'HTML-ENTITIES', "UTF-8");
//remove comments (/** .... */)
		$html = preg_replace("/(\/\*\*)(.*?)(\*\/)/si", "", $html);

// Create DOMDocument from html, add errors for parsing issues
		$this->domDocument = new DOMDocument();
		libxml_use_internal_errors(true);
		$this->domDocument->loadHTML($html);
		$errors = libxml_get_errors();
		foreach ($errors as $error) {
			if (in_array($error->code, $this->ignore_html_error_code))
				continue;
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
			"Image Source" => $src,
			"Checked File" => $file,
		);


		switch ($existing) {
			case self::FILE_MISSING:
				$this->messages->addError('IMG TAG CHECK', 'Image missing', $lineNo, $line,
						$data);
				break;
			case self::FILE_EXISTING:
				if (self::SHOW_SUCCESS_TOO)
					$this->messages->addInfo('IMG TAG CHECK', 'Image existing', $lineNo, $line,
							$data);
				break;
			case self::FILE_REMOTE:
				if (self::SHOW_SUCCESS_TOO)
					$this->messages->addInfo('IMG TAG CHECK', 'Image from remote location',
							$lineNo, $line, $data);
				break;
			case self::FILE_CONTAINS_PARAMS:if (self::SHOW_SUCCESS_TOO)
					$this->messages->addWarning('IMG TAG CHECK',
							'Image path still contains parameters. Check manually!', $lineNo, $line,
							$data);
				break;
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

		if (!preg_match_all("/\[(?:[^()]|(?R))+\]|'[^']*'|[^(),\s]+/", $parameters[1],
						$param_array)) {
			$data = array(
				'Widget' => $widget,
				'Parameters' => $parameters[1],
			);
			$lineNo = $node->getLineNo();
			$this->messages->addWarning('WIDGET PARAM CHECK',
					'Unable to split Parameters. Check manually!', $lineNo, $macro, $data);
			return;
		}
		$param_array = $param_array[0];

		if (array_key_exists($widget, $this->image_params)) {
			foreach ($this->image_params[$widget] as $param_no => $param_check)
				switch ($param_check['type']) {
					case 'image':
						$this->checkWidgetImageParameter($node, $macro, $widget, $param_array,
								$param_no, $param_check);
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

	private function getWidgetParameter($param_array, $param_no) {
		// optional parameter not given
		if (count($param_array) <= $param_no)
			return '';

		// return trimmed parameter
		return trim($param_array[$param_no], " \t\n\r\0\x0B'");
	}

	/**
	 * Check image parameter of widget
	 * @param \DOMElement $node currently checked node
	 * @param string $macro widget (including parameters)
	 * @param type $widget name of widget
	 * @param type $param_array array containing parameters
	 * @param type $param_no index of parameter to check
	 * @param array $param_check Config for parameter checker
	 */
	private function checkWidgetImageParameter($node, $macro, $widget, $param_array, $param_no, $param_check) {
		$param = $this->getWidgetParameter($param_array, $param_no);

		// parameter empty or not given
		if ($param == '')
			return;

		// inline pic
		if (in_array($param, $this->inline_pics))
			return;

		$file = $param;

		// get color if required
		if (strpos($file, '/') === false && substr($file, 0, 7) != 'icon0~\'' && substr($file,
						0, 7) != 'icon1~\'') {
			$file = $this->icon0 . $file;
		}

		$existing = $this->isFileExisting($file);
		$data = array(
			'Widget' => $widget,
			'Parameters' => $param_array,
			'Parameter No.' => $param_no,
			'Parameter Value' => $param,
			'Checked File' => $file,
		);
		if ($color)
			$data['Color'] = $color;
		$lineNo = $node->getLineNo();

		switch ($existing) {
			case self::FILE_MISSING:
				$this->messages->addError('WIDGET PARAM CHECK', 'Image missing', $lineNo,
						$macro, $data);
				break;
			case self::FILE_EXISTING:
				if (self::SHOW_SUCCESS_TOO)
					$this->messages->addInfo('WIDGET PARAM CHECK', 'Image existing', $lineNo,
							$macro, $data);
				break;
			case self::FILE_REMOTE:
				if (self::SHOW_SUCCESS_TOO)
					$this->messages->addInfo('WIDGET PARAM CHECK',
							'Image from remote location', $lineNo, $macro, $data);
				break;
			case self::FILE_CONTAINS_PARAMS:if (self::SHOW_SUCCESS_TOO)
					$this->messages->addWarning('WIDGET PARAM CHECK',
							'Image path still contains parameters. Check manually!', $lineNo, $macro,
							$data);
				break;
		}

		return;
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
			return self::FILE_REMOTE;

		if (substr($file, 0, 7) == 'icon0~\'') {
			$file = $this->icon0 . substr($file, 7);
		} else if (substr($file, 0, 7) == 'icon1~\'') {
			$file = $this->icon1 . substr($file, 7);
		}

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
						return self::FILE_CONTAINS_PARAMS;
						break;
				}
			}
		}

		// add const_path if $file is relative
		if (substr($file, 0, 1) != '/')
			$file = const_path . $file;

		$file = substr($file, 0, 1) == '/' ? $file : const_path . $file;

		return is_file($file) ? self::FILE_EXISTING : self::FILE_MISSING;
	}

}

?>