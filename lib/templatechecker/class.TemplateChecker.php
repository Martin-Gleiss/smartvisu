<?php

class TemplateChecker {

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
	 * Array containing parameter information for custom widgeds
	 * @var array
	 */
	private $widgets = array();
	
	private $ignore_html_error_code = array(
		68 => array(), //error parsing attribute name 
		800 => array(), // Missplaced ***
		//801 => array('maxline' => 10),
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
	 * Perform template checks for single file
	 * @param string $fileName name of file to check
	 * @param MessageCollection $messages MessageCollection to which messages should be added
	 * @return \TemplateChecker
	 */
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
		$this->widgets = twig_docu();
	}

	/**
	 * Run tests and populate message array
	 */
	public function performTests() {
		// dom extension available?
		if (!extension_loaded('dom')) {
			$this->messages->addError('PREREQUISITIONS', 'php module "dom" not available!');
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

		// HTML FILE
		$ext = strtolower(pathinfo($absFile, PATHINFO_EXTENSION));
		if ($ext != 'html') {
			$this->messages->addInfo('FILE CHECK', 'Not an html file: ' . $this->file);
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
		// Create DOMDocument from html, add errors for parsing issues
		$this->domDocument = new DOMDocument('1.0', 'UTF-8');
    $content = file_get_contents($absFile);
		libxml_use_internal_errors(true);
		//$this->domDocument->loadHTMLFile($absFile);
    $this->domDocument->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'));
		$errors = libxml_get_errors();
		foreach ($errors as $error) {
			if (array_key_exists($error->code, $this->ignore_html_error_code)) {
				$conditions = $this->ignore_html_error_code[$error->code];
				$ignore = true;
				if ($conditions['maxline'] && $error->line > $conditions['maxline'])
					$ignore = false;
				if ($conditions['minline'] && $error->line < $conditions['minline'])
					$ignore = false;
				if ($ignore)
					continue;
			}
			/* @var $error LibXMLError */
			$data = array(
				"Level" => $error->level,
				"Column" => $error->column,
				"Code" => $error->code,
			);
			$this->messages->addWarning('HTML PARSER', $error->message, $error->line, '', $data);
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
		if ($node == NULL)
			return;
		if ($node->nodeType == XML_ELEMENT_NODE) {
			switch ($node->tagName) {
				case 'img':
					$src = $node->getAttribute('src');
					$this->checkImageSrc($node, $src);
					break;
				case 'code':
				case 'pre':
					// do not check anything in "code" or "pre" nodes
					return;
			}
		} else if ($node->nodeType == XML_TEXT_NODE) {
			// do not check code wrapped by {% verbatim %} or in twig comment /**...*/
			$value = preg_replace('/{%\s*verbatim\s*%}.*?{%\s*endverbatim\s*%}|\/\*\*.*?\*\//', '', trim($node->textContent));
			if (preg_match_all("/{{(.*?)}}/s", $value, $macros)) {
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
				$this->messages->addError('IMG TAG CHECK', 'Image missing', $lineNo, $line, $data);
				break;
			case self::FILE_EXISTING:
				if (Settings::SHOW_SUCCESS_TOO)
					$this->messages->addInfo('IMG TAG CHECK', 'Image existing', $lineNo, $line, $data);
				break;
			case self::FILE_REMOTE:
				if (Settings::SHOW_SUCCESS_TOO)
					$this->messages->addInfo('IMG TAG CHECK', 'Image from remote location', $lineNo, $line, $data);
				break;
			case self::FILE_CONTAINS_PARAMS:
				if (Settings::SHOW_SUCCESS_TOO)
					$this->messages->addWarning('IMG TAG CHECK', 'Image path still contains parameters. Check manually!', $lineNo, $line, $data);
				break;
		}
	}

	/**
	 * Check widget
	 * @param \DOMElement $node currently checked node
	 * @param string $macro widget (including parameters)	 
	 */
	public function checkWidget($node, $macro) {
		$widget = Widget::create($node, $macro, $this->messages);
		if ($widget == NULL)
			return;

		$widgetConfig = $this->getWidgetConfig($widget->getName());

		if ($widgetConfig === NULL || !array_key_exists('param', $widgetConfig)) {
			$this->messages->addWarning('WIDGET PARAM CHECK', 'Unknown widget found. Check manually!', $widget->getLineNumber(), $widget->getMacro(), $widget->getMessageData());
			return;
		}

		// check all parameters of widget
		$paramConfigs = array_values($widgetConfig['param']);
		foreach ($paramConfigs as $paramIndex => $paramConfig) {
			WidgetParameterChecker::performChecks($widget, $paramIndex, $paramConfig, $this->messages, $this);
		}

		if (array_key_exists('deprecated', $widgetConfig)) {
			$messageData = $widget->getMessageData();
			if(array_key_exists('replacement', $widgetConfig)) {
				$messageData['Replacement'] = preg_replace("/(\\s*,\\s*''\\s*)+(\\)\\s*}}\\s*)$/", '$2', vsprintf($widgetConfig['replacement'], $widget->getParamArray() + array_map(function($element) { return "'" . $element['default'] . "'"; }, $paramConfigs)));
			}
			$this->messages->addWarning('WIDGET DEPRECATION CHECK', 'Deprecated widget', $widget->getLineNumber(), $widget->getMacro(), $messageData);
		}
	}

	/**
	 * get parameter config for widget
	 * @param string $name name of widget
	 * @return array parameter config for widget or NULL if widget is unknown
	 */
	private function getWidgetConfig($name) {
		if (array_key_exists($name, $this->widgets)) {
			return $this->widgets[$name];
		} else {
			return NULL;
		}
	}

	/**
	 * Check if file is existing
	 * @param string $file file to check
	 * @return boolean TRUE: File is existing, FALSE: File is not existing
	 */
	public static function isFileExisting(&$file) {
		$settings = Settings::getInstance();
		// Remote file via http or https: Do not check further for now
		if (strtolower(substr($file, 0, 7)) == 'http://' ||
				strtolower(substr($file, 0, 8)) == 'https://')
			return self::FILE_REMOTE;

		if (substr($file, 0, 7) == 'icon0~\'') {
			$file = $settings->getIcon0() . substr($file, 7);
		} else if (substr($file, 0, 7) == 'icon1~\'') {
			$file = $settings->getIcon1() . substr($file, 7);
		}

		// replace {{ icon0 }} and {{ icon1 }}
		if (preg_match_all("/{{(.*?)}}/s", $file, $match)) {
			for ($i = 0; $i < count($match[0]); $i++) {
				switch (strtolower(trim($match[1] [$i]))) {
					case 'icon0':
						$file = str_replace($match[0][$i], $settings->getIcon0(), $file);
						break;
					case 'icon1': $file = str_replace($match[0][$i], $settings->getIcon1(), $file);
						break;
					default:
						// still a parameter in the image, no further testing at the moment
						return self::FILE_CONTAINS_PARAMS;
						break;
				}
			}
		}

		// check different locations and variants if file has no path set
		if(strpos($file, '/') === false) {
			if(is_file(const_path . 'dropins/' . $settings->getIcon0() . $file))
				return self::FILE_EXISTING;
			if(is_file(const_path . 'dropins/' . $settings->getIcon0() . $file . '.svg'))
				return self::FILE_EXISTING;
			if(is_file(const_path . 'dropins/' . $settings->getIcon0() . 'jquery_' . $file . '.svg'))
				return self::FILE_EXISTING;

			if(is_file(const_path . $settings->getIcon0() . $file))
				return self::FILE_EXISTING;
			if(is_file(const_path . $settings->getIcon0() . $file . '.svg'))
				return self::FILE_EXISTING;
			if(is_file(const_path . $settings->getIcon0() . 'jquery_' . $file . '.svg'))
				return self::FILE_EXISTING;

			return self::FILE_MISSING;
		}
		else {
			// add const_path if $file is relative
			if (substr($file, 0, 1) != '/')
				$file = const_path . $file;
			return is_file($file) ? self::FILE_EXISTING : self::FILE_MISSING;
		}
	}

}