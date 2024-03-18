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
	 * Array containing parameter information for custom widgets
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
	
	private $driver;

	/**
	 * DOMDocument object for file
	 * @var DOMDocument
	 */
	private $domDocument;

	/**
	 * Object for the Icons
	 */
	private $items;
	
	/**
	 * get configured driver
	 * @return string
	 */
	public function getDriver() {
		return $this->driver;
	}

	/**
	 * Perform template checks for single file
	 * @param string $fileName name of file to check
	 * @param MessageCollection $messages MessageCollection to which messages should be added
	 * @return \TemplateChecker
	 */
	public static function run($fileName, MessageCollection $messages, $checkItems) {
		$checker = new TemplateChecker($fileName, $messages,$checkItems);
		$checker->performTests();
		return $checker;
	}

	/**
	 * Constructor
	 * @param string $fileName file to test
	 * @param MessageCollection $messages MessageCollection to add messages to
	 */
	public function __construct($fileName, MessageCollection $messages, $checkItems) {
		$this->messages = $messages;
		$this->fileName = $fileName;
		$fileFolder = strstr(pathinfo($fileName)["dirname"], 'pages');
		$widgetFolder = ((strrpos($fileFolder, '/') == 5 ) ? $fileFolder : substr($fileFolder, 0, strrpos($fileFolder, '/'))).'/widgets';
		if(twig_isdir($widgetFolder, '(.*.\.html)')) {
			$widgetFiles = twig_dir($widgetFolder, '(.*.\.html)');
			$this->widgets = array_merge( twig_docu(), twig_docu($widgetFiles), OldWidgets::getRemoved());
		}
		else {
			$this->widgets = array_merge( twig_docu(), OldWidgets::getRemoved());
		}
		$this->items = new Items(pathinfo($fileName)["dirname"]); //new
		if ($checkItems == "false")
			{ $this->items->setState(FALSE);}

		// some checks require info of the configured driver (e.g. database aggregation modes in backend)
		// get the configured driver if templaechecker is called from the configured pages or use offline driver instead
		$fileFolder = str_replace('/widgets', '', $widgetFolder);
		$this->driver = (substr($fileFolder, 6, ) == config_pages ? config_driver : 'offline');
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

		if (!$this->checkTwigTemplate($absFile))
			return;

		if (!$this->readFile($absFile))
			return;

		$this->checkNode($this->domDocument->documentElement);
	}

		private function checkTwigTemplate($absFile) {
			$templatePath = pathinfo($absFile, PATHINFO_DIRNAME);
			$loader = new \Twig\Loader\FilesystemLoader($templatePath);
			$twig = new \Twig\Environment($loader);
			$twig->addFilter( new \Twig\TwigFilter('_', 'twig_concat'));
			$twig->addFilter( new \Twig\TwigFilter('bit', 'twig_bit'));
			$twig->addFilter( new \Twig\TwigFilter('substr', 'twig_substr'));
			$twig->addFilter( new \Twig\TwigFilter('smartdate', 'twig_smartdate'));
			$twig->addFilter( new \Twig\TwigFilter('deficon', 'twig_deficon', array('needs_environment' => true)));
			$twig->addFilter( new \Twig\TwigFilter('md5', 'twig_md5'));
			$twig->addFilter( new \Twig\TwigFilter('preg_replace', 'twig_preg_replace'));

			$twig->addFunction( new \Twig\TwigFunction('uid', 'twig_uid'));
			$twig->addFunction( new \Twig\TwigFunction('once', 'twig_once'));
			$twig->addFunction( new \Twig\TwigFunction('isfile', 'twig_isfile'));
			$twig->addFunction( new \Twig\TwigFunction('isdir', 'twig_isdir'));
			$twig->addFunction( new \Twig\TwigFunction('dir', 'twig_dir'));
			$twig->addFunction( new \Twig\TwigFunction('docu', 'twig_docu'));
			$twig->addFunction( new \Twig\TwigFunction('configmeta', 'twig_configmeta'));
			$twig->addFunction( new \Twig\TwigFunction('lang', 'twig_lang'));
			$twig->addFunction( new \Twig\TwigFunction('read_config', 'twig_read_config'));
			$twig->addFunction( new \Twig\TwigFunction('timezones', 'twig_timezones'));
			$twig->addFunction( new \Twig\TwigFunction('implode', 'twig_implode', array('is_safe' => array('html'))));
			$twig->addFunction( new \Twig\TwigFunction('items', 'twig_items'));
			$twig->addFunction( new \Twig\TwigFunction('asset_exists', 'twig_asset_exists'));
			$twig->addFunction( new \Twig\TwigFunction('localize_svg', 'twig_localize_svg'));

			// init lexer comments
			$lexer = new \Twig\Lexer($twig, array('tag_comment' => array('/**', '*/')));
			$twig->setLexer($lexer);
			$templateName = pathinfo($absFile, PATHINFO_BASENAME);

			try {
				// Lade das Template
				$template = $twig->load($templateName);

				// Prüfe die Syntax des Templates
				$template->getSourceContext()->getCode();
				
				//if (Settings::SHOW_SUCCESS_TOO)
				//	$this->messages->addInfo('TWIG PARSER', 'Twig syntax is valid.');
			} catch (\Twig\Error\SyntaxError $e) {
				$this->messages->addError('TWIG TEMPLATE PARSER', 'Twig syntax error: '. $e->getMessage(), $e->getLine());
			}
			return true;
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
    $this->domDocument->loadHTML(htmlspecialchars_decode(htmlentities($content)));
		$errors = libxml_get_errors();
		foreach ($errors as $error) {
			if (array_key_exists($error->code, $this->ignore_html_error_code)) {
				$conditions = $this->ignore_html_error_code[$error->code];
				$ignore = true;
				if (isset($conditions['maxline']) && $error->line > $conditions['maxline'])
					$ignore = false;
				if (isset($conditions['minline']) && $error->line < $conditions['minline'])
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
			$value = preg_replace('/{%\s*verbatim\s*%}.*?{%\s*endverbatim\s*%}|\/\*\*\s*.*?\s*\*\//', '', trim($node->textContent));
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

		$widgetName = $widget->getName();
		
		// strip calling macros name in recursive check
		if (strpos($widgetName, '->') > 0 )
			$widgetName = substr($widgetName,  strpos($widgetName, '->') + 2);

		// a test with twig tokenize as marcro syntax checker in this place showed no significant advantage
		// https://stackoverflow.com/questions/27191916/check-if-string-has-valid-twig-syntax
		
		$widgetConfig = $this->getWidgetConfig($widgetName);

		if ($widgetConfig === NULL || (!array_key_exists('param', $widgetConfig) && !array_key_exists('removed', $widgetConfig)) ) {
			$this->messages->addWarning('WIDGET PARAM CHECK', 'Unknown widget found. Check manually!', $widget->getLineNumber(), $widget->getMacro(), $widget->getMessageData());
			// var_dump ($this); //will show the whole widget array within a list item with "unknown widget" error
			return;
			}
		if (array_key_exists('removed', $widgetConfig)) {
			$paramConfigs = explode (',', $widgetConfig['params']);  // Parameters of widget macro
			$paramConfigLen = count($paramConfigs);
			$messageData = $widget->getMessageData();
			$messageParams = explode(',', $messageData['Parameters']); // Parameters in widget call
			$messageParamsLen = count($messageParams);
			// fill missing parameters w/ empty quotes
			if ($paramConfigLen > $messageParamsLen){
				do {
					$messageParams[$messageParamsLen] = "''";
					$messageParamsLen++;
				} while ($messageParamsLen < $paramConfigLen);
			}
			
			if(array_key_exists('replacement', $widgetConfig)) {
				$messageData['Replacement'] = preg_replace("/(\\s*,\\s*''\\s*)+(\\)\\s*}}\\s*)$/", '$2', vsprintf($widgetConfig['replacement'], $messageParams));
				$messageData['Replacement'] = str_replace ("['', '']", "''", $messageData['Replacement']);
			}
			$this->messages->addError('WIDGET DEPRECATION CHECK', 'Removed widget', $widget->getLineNumber(), $widget->getMacro(), $messageData);
		} else {
			// check all parameters of widget
			$paramConfigs = array_values($widgetConfig['param']);
			
			foreach ($paramConfigs as $paramIndex => $paramConfig) {
				WidgetParameterChecker::performChecks($widget, $paramIndex, $paramConfig, $this->messages,$this->items, $this); //new: items
			}
			if (array_key_exists('deprecated', $widgetConfig)) {
				$messageData = $widget->getMessageData();
				if(array_key_exists('replacement', $widgetConfig)) {
					$messageData['Replacement'] = preg_replace("/(\\s*,\\s*''\\s*)+(\\)\\s*}}\\s*)$/", '$2', vsprintf($widgetConfig['replacement'], $widget->getParamArray() + array_map(function($element) { return isset($element['default']) ? "'" . $element['default']. "'" : null; }, $paramConfigs)));
				}
			$this->messages->addWarning('WIDGET DEPRECATION CHECK', 'Deprecated widget', $widget->getLineNumber(), $widget->getMacro(), $messageData);
			}
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
