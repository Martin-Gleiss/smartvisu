<?php

/**
 * Class representing a single widget call found in coding
 */
class Widget {

	/**
	 * Node containing the widget
	 * @var \DOMElement 
	 */
	private $node;

	/**
	 * get node containing the widget
	 * @return \DOMElement
	 */
	public function getNode() {
		return $this->node;
	}

	/**
	 * macro (whole widget string)
	 * @var string 
	 */
	private $macro;

	public function getMacro() {
		return $this->macro;
	}

	/**
	 * name of widget
	 * @var string 
	 */
	private $name;

	/**
	 * get name of widget
	 * @return string
	 */
	public function getName() {
		return $this->name;
	}

	/**
	 * parameters given for widget
	 * @var string
	 */
	private $paramString;

	public function getParamString() {
		return $this->paramString;
	}

	/**
	 * parameters given for widget
	 * @var array 
	 */
	private $paramArray;

	/**
	 * number of parameters in $paramArray
	 * @var integer
	 */
	private $paramCount;

	/**
	 * return single parameter
	 * @param integer $index Index of parameter to return
	 * @return mixed, NULL if no parameter with give index is available
	 */
	public function getParam($index) {
		return $this->paramCount >= $index ? $this->paramArray[$index] : NULL;
	}

	/**
	 * return all parameters
	 * @return array
	 */
	public function getParamArray() {
		return $this->paramArray;
	}

	/**
	 * line number from node
	 * @var integer 
	 */
	private $lineNumber;

	/**
	 * return line number from node
	 * @return integer
	 */
	public function getLineNumber() {
		return $this->lineNumber;
	}

	/**
	 * return widget related data for messages
	 * @return array
	 */
	public function getMessageData() {
		return array(
			'Widget' => $this->name,
			'Parameters' => $this->paramString,
		);
	}

	/**
	 * create new widget object from given data
	 * @param \DOMElement $node node containing the widget
	 * @param string $macro widget (including parameters)
	 * @param \MessageCollection $messages message collection to add messages if required	 
	 * @return \Widget new widget object or NULL if no widget object created
	 */
	public static function create($node, $macro, $messages) {
		if (!preg_match('/^(.+?\..+?)\((.*)\)/s', $macro, $parts))
			return NULL; // not a widget

		$name = trim(strtolower($parts[1]));
		$parameters = $parts[2];

		if ($parameters) {
			/*
			if (!preg_match_all("/[^(,]*(?:\([^)]+\))?[^),]/", $parameters[1], $param_array)) {
				$this->messages->addWarning('WIDGET PARAM CHECK', 'Unable to split Parameters. Check manually!', $node->getLineNo(), $macro, array('Widget' => $name, 'Parameters' => $parameters[1]));
				return NULL;
			}			
			$paramArray = $param_array[0];
			*/
			$paramArray = self::splitParameters($parameters, $name, $node, $macro, $messages);			
		} else {
			// No parameters			
			$paramArray = array();
		}

		return new Widget($node, $macro, $name, $parameters, $paramArray);
	}

	private static function splitParameters($paramString, $name, $node, $macro, $messages) {
		$inSingleQuotes = FALSE;
		$squareBracketLevel = 0;
		$roundBracketLevel = 0;
		$paramArray = array();
		$currentParam = '';
		$lastChar = '';
		$isArray = false;
		foreach (str_split($paramString) as $char) {
			if ($char == '\'' && $lastChar != '\\') {
				$inSingleQuotes = !$inSingleQuotes;
				$currentParam .= $char;
			} else if ($char == '[' && !$inSingleQuotes) {
				$squareBracketLevel++;
				$isArray = true;
			} else if ($char == ']' && !$inSingleQuotes) {
				$squareBracketLevel--;
			} else if ($char == '(' && !$inSingleQuotes) {
				$roundBracketLevel++;
				$currentParam .= $char;
			} else if ($char == ')' && !$inSingleQuotes) {
				$roundBracketLevel--;
				$currentParam .= $char;
			} else if ($char == ',' && !$inSingleQuotes && $squareBracketLevel == 0 && $roundBracketLevel == 0) {
				if($isArray)
					$currentParam = self::splitParameters($currentParam, $name, $node, $macro, $messages);
				else
					$currentParam = trim($currentParam, " \t\n\r\0\x0B'");
				//TODO: Recursively check widgets in parameters
				$paramArray[] = $currentParam;
				$currentParam = '';
				$isArray = false;
			} else {
				$currentParam .= $char;
			}
			$lastChar = $char;
		}
		if ($currentParam) {
			if($isArray)
				$currentParam = self::splitParameters($currentParam, $name, $node, $macro, $messages);
			else
				$currentParam = trim($currentParam, " \t\n\r\0\x0B'");
			$paramArray[] = $currentParam;
		}

		if ($inSingleQuotes) {
			$data = array('Widget' => $name, 'Parameters' => $paramString);
			$i=0;
			foreach($paramArray as $param) 
				$data['Parameter ' . $i++] = $param;
			$messages->addWarning('WIDGET PARAM SPLIT', 'Single Quotes not matching!', $node->getLineNo(), $macro, $data);
		}
		if ($squareBracketLevel != 0) {
			$data = array('Widget' => $name, 'Parameters' => $paramString);
			$i=0;
			foreach($paramArray as $param) 
				$data['Parameter ' . $i++] = $param;
			$messages->addWarning('WIDGET PARAM SPLIT', 'Square Brackets not matching!', $node->getLineNo(), $macro, $data);
		}
		return $paramArray;
	}

	/**
	 * constructor
	 * @param \DOMElement $node node containing the widget
	 * @param string $macro widget (including parameters)
	 * @param string $name name of widget
	 * @param string $paramString parameter string of widget
	 * @param array $paramArray array of parameters
	 */
	private function __construct($node, $macro, $name, $paramString, $paramArray) {
		$this->node = $node;
		$this->macro = $macro;
		$this->lineNumber = $node->getLineNo();
		$this->name = $name;
		$this->paramString = $paramString;
		$this->paramArray = $paramArray;
		$this->paramCount = count($paramArray);
	}

}