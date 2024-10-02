<?php

/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Thomas Ernst
 * @copyright   2016 - 2024
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

/**
 * Valdation functions for single widget parameter
 */
class WidgetParameterChecker {

	/**
	 * Widget
	 * @var Widget
	 */
	private $widget;

	/**
	 * Index of parameter to check
	 * @var integer
	 */
	private $paramIndex;

	/**
	 * Config for parameter to check
	 * @var array
	 */
	private $paramConfig;
	
	/**
	 * Settings
	 * @var array
	 */
	private $settings;
	

	/**
	 * Available dynamic icons
	 * @var array
	 */
	private $dynamicIcons;

	/**
	 * Available dynamic icons
	 * @var array
	 */
	private $dynamicSymbols;

	/**
	 * Collection of messages to add messages to
	 * @var MessageCollection
	 */
	private $messages;

	/** 
	 * Collection of messages to add messages to
	 * @var array
	 */
	private $items;

	/**
	 * Backreference to calling template checker (to be used to check widgets which are parameter of current widget)
	 * @var TemplateChecker
	 */
	private $templateCecker;

	
	/**
	 * If templatechecker adds default array values they are still in string format, e.g. '[0,1]' 
	 * These must be integrated into the parameter array as if they had been parsed in the parameter string
	 * @param $string: string to convert
	 * @params $start / $end: delimiters used to split the string into array levels - mostly square brackets
	 * @param $single: 'single' makes the array one-dimensional 
	 *
	 */
	function get_arrays($string, $start, $end, $single){
		$string = $start . str_replace(', ', ',', $string) . $end;
		$string = str_replace("'", "", $string);
		$string = str_replace('"', '', $string);
		$p1 = explode($start, $string);
		for($i=1; $i < \count($p1); $i++){
				$p2 = explode($end, $p1[$i]);
				$p3 = (isset($p2[1])) ? explode(',', $p2[1]) : array();
				$p3 = array_filter($p3, 'strlen');
				if ($single == 'single'){
					$p2_0 = explode(',', $p2[0]);
					$p[] = array_merge($p2_0, $p3);
				}
				else {
					$p2_0 = explode(',', $p2[0]);
					$p[] = array($p2_0) + $p3;
				}
		}
		if (\count($p) > 1)
			array_shift($p);
		else
			return $p;
		$x = array();
		foreach($p as $key){
			$x = array_merge($x, $key);
		}
		return $x;
	}
	
	public static function performChecks($widget, $paramIndex, $paramConfig, $messages, $items, $templateCecker) {  //new: items
		$checker = new WidgetParameterChecker($widget, $paramIndex, $paramConfig, $messages, $items, $templateCecker);
		$checker->run();
	}

	/**
	 *
	 * @param Widget $widget Widget Widget
	 * @param integer $paramIndex Index of parameter to check
	 * @param array $paramConfig Config for parameter to check
	 * @param MessageCollection $messages Collection of messages to add messages to
	 */
	private function __construct($widget, $paramIndex, $paramConfig, $messages, $items, $templateCecker) {
		$this->widget = $widget;
		$this->paramIndex = $paramIndex;
		$this->paramConfig = $paramConfig;
		$this->messages = $messages;
    	$this->templateCecker = $templateCecker;
		$this->settings = Settings::getInstance();
		$this->dynamicIcons = twig_docu(const_path . 'widgets/icon.html');
		$this->dynamicSymbols = twig_docu(const_path .'widgets/basic.html'); 
		
		$this->dynamicIcons['basic.symbol'] = $this->dynamicSymbols['basic.symbol'];
		$this->items = $items;
		
		
		
	}

	/**
	 * return parameter config setting
	 * @param string $setting name of setting to return
	 * @param mixed $default default value if setting is not part of paramConfig array
	 * @return mixed parameter config setting
	 */
	private function getParamConfig($setting, $default = '') {
		return \array_key_exists($setting, $this->paramConfig) ? $this->paramConfig[$setting] : $default;
	}

	/**
	 * run actual checks
	 */
	private function run() {
		$type = $this->getParamConfig('type', 'unknown');
		if($type == 'unknown') {
			$this->addWarning('WIDGET PARAM CHECK', 'Parameter type not defined. Check manually!', null);
			return;
		}

		$values = $this->getParameterValue($type);
		if ($values === NULL)
			return;
		
		// get uzsu item - in quad widgets just before uzsu param array
		if ($type == 'uzsuparam'){
			$uzsuitem = $this->widget->getParam($this->paramIndex - 1);
			if ($uzsuitem == null || $uzsuitem == '')
				return;
			// we can check only one of the items as dummy in the recursive uzsu widget check 
			// so item names in the info lines may differ from the real items 
			// items have been checked as individual parameters before
			if (\is_array($uzsuitem)){
				foreach($uzsuitem as $item)
					if ($item != '') break;
				$uzsuitem = "'". $item . "'";
			}		
			if ($uzsuitem == "''")
				return;
		}
		
		if (!\is_array($values))
			$values = array($values);

		foreach ($values as $value) {
			switch ($type) {
				case 'id':
					$this->checkParameterTypeId($value);
					break;
				case 'image':
					$this->checkParameterTypeImage($value);
					break;
				case 'text':
					$this->checkParameterTypeText($value);
					break;
				case 'value':
					$this->checkParameterTypeValue($value);
					break;
				case 'color':
					$this->checkParameterTypeColor($value);
					break;
				case 'item':
					$this->checkParameterTypeItem($value);	//new
					break;
				case 'mode':
					$this->checkParameterTypeMode($value);	//new
					break;
				case 'type':
					$this->checkParameterTypeType($value);
					break;
				case 'duration':
					$this->checkParameterTypeDuration($value);
					break;
				case 'format':
					// in the future there may be the possibility to validate formats.
					// for now we perform the same tests than for type "text"
					$this->checkParameterTypeText($value);
					break;
				case 'formula':
					// in the future there may be the possibility to validate formulas.
					// for now we perform the same tests than for type "text"
					$this->checkParameterTypeText($value);
					break;
				case 'url':
					// in the future there may be the possibility to validate urls.
					// for now we perform the same tests than for type "text"
					$this->checkParameterTypeText($value);
					break;
				case 'percent':
					$this->checkParameterTypePercent($value);	//new
					break;
				case 'widget':
					$node = $this->widget->getNode();
					$this->templateCecker->checkWidget($node, $this->widget->getName()." #". $this->paramIndex ."->". $value);
					//DEBUG: echo ($value."<br>");
					break;
				case 'plotparam':
					$node = $this->widget->getNode();
					$this->templateCecker->checkWidget($node, $this->widget->getName()." #". $this->paramIndex ."->plot.period('',". $value .")");
					// DEBUG: echo "plot.period('',". $value .")".'<br>';
					break;
				case 'uzsuparam':
					$node = $this->widget->getNode(); 
					$this->templateCecker->checkWidget($node, $this->widget->getName()." #". $this->paramIndex ."->device.uzsuicon('', ".$uzsuitem. ", '', " . $value .")");
					//DEBUG: echo ("device.uzsuicon('', ".$uzsuitem. ", '', " . $value .")<br>");
					break;
				case 'sliderparam':
					$node = $this->widget->getNode(); 
					$this->templateCecker->checkWidget($node, $this->widget->getName()." #". $this->paramIndex ."->basic.slider(''," . $value .")");
					//DEBUG: echo ("basic.slider('', " . $value .")<br>");
				case 'placeholder':
					// no need to check anything here
					break;
				case 'unspecified':
					// this type is not validated at all
					$this->addInfo('WIDGET UNSPECIFIED PARAM TYPE', 'Parameter can not be checked, check manually', $value);
					break;
				default:
					error_log('Template Checker: Unknown type ' . $type);
					break;
			}
		}
	}

	/**
	 * Determine value of parameter
	 *
	 * Considered ParamConfig values:
	 * optional		boolean		Flag indicating if parameter is optional. Default: FALSE
	 * default		mixed		Default value to for optional parameter if parameter is missing. Default: Empty String
	 * array_form	string		Indicates if array form must, may or must not be used. Values "must", "may" or "no". Default: "no"
	 *
	 * @return mixed. value, array of values (if parameter is given in array form) or NULL (if errors occured)
	 */
	private function getParameterValue($type) {
		
		$stringParam = $type == 'plotparam' || $type == "uzsuparam" || $type == 'sliderparam' || $type == 'unspecified';
		if ($stringParam == true){
			$value = $this->widget->getSingleParamString($this->paramIndex) || '';
			if ($type != 'unspecified'){
				$actualWidget = $this->widget->getName();
				
				// some quad widgets define parameter array sizes by certain parameters
				// we need to know these in order to parse parameter arrays correctly
				if (\array_key_exists($actualWidget, TemplateCheckerConfig::ArrayDimensionSetter)){
					$widgetElements = $this->widget->getParam(TemplateCheckerConfig::ArrayDimensionSetter[$actualWidget]);
					$widgetElementsCount = (\is_array($widgetElements) ? \count($widgetElements) : 0);
					$test = json_decode(str_replace("'", '"', $value));
					$plotSpecial = ($type == 'plotparam' && \is_array($test) && \count($test) == 17 && \in_array($actualWidget, ['quad.stateswitch', 'quad.select']) );
					$uzsuSpecial = ($type == 'uzsuparam' && !\is_array($this->widget->getParam($this->paramIndex - 1)) && \in_array($actualWidget, ['quad.stateswitch', 'quad.select']) );			
					if (\is_array($test) && $plotSpecial == false && $uzsuSpecial == false){
						if (\count($test) == $widgetElementsCount || $widgetElementsCount == 0 ){
							$value = [];
							// prepare populated array elements / ignore empty elements  
							for ($i = 0; $i < $widgetElementsCount; $i++){
								if($test[$i] != ''){
									if (\is_array($test[$i]) && $type == 'sliderparam'){
										// adjust parameter sequence for basic.slider
										if (\count($test[$i]) > 4)
											$test[$i] = array_merge(\array_slice($test[$i], 0, 4, true), array('horizontal'), \count($test[$i]) >= 6 ? array_slice($test[$i], 5, null, true) : null);
									}

									if (\is_array($test[$i]) || $widgetElementsCount == 0){
										$value[] = substr(str_replace('"', "'", json_encode($test[$i])), 1, -1);}
									else
										$value[] = str_replace('"', "'", json_encode($test[$i]));
								}
							}   
						}
						else 
							$this->addWarning('WIDGET PARAM CHECK', 'Array size does not match the widgets parameter count, check manually', $value);
					}
					else {
						if (substr($value, 0, 1) == '[' && substr($value, -1, 1) == ']')
						$value = substr($value, 1, -1);
					}
				}
				else {
					if (substr($value, 0, 1) == '[' && substr($value, -1, 1) == ']')
					$value = substr($value, 1, -1);
				}
			}
		}
		else
			$value = $this->widget->getParam($this->paramIndex);

		// parameter not given
		if ($value == NULL || $value == '') {
			if ($this->getParamConfig('optional', TRUE)) {
				// missing optional parameter, return default value
				$value = $this->getParamConfig('default', '');
				// convert into array if applicable
				if (!\is_array($value) && $stringParam == false) {
					$test = explode(',', $value);
					if (substr( $value, 0, 1 ) === "[" && \count($test) > 1)
						$value = $this->get_arrays($value, '[', ']', 'single');
				}		
			} else {
				// missing mandatory parameter
				$this->addError('WIDGET PARAM CHECK', 'Mandatory parameter missing', $value);
				return NULL;
			}
		}

		// no check for arrayform if value is empty
		if ($stringParam == true && ($value == "''" || $value == ''))
			return NULL;
		if($value == '')
			return $value;

		$allowArray = $this->getParamConfig('array_form', 'no');
		$valueIsArray = \is_array($value) || ($stringParam && \is_array($this->widget->getParam($this->paramIndex)));
		if ($valueIsArray && $allowArray != 'must' && $allowArray != 'may') { // array form
			$this->addError('WIDGET PARAM CHECK', 'Array form not allowed for parameter', $value);
			return NULL;
		} else if ($valueIsArray == false && $allowArray == 'must') { // not array form
			$this->addError('WIDGET PARAM CHECK', 'Array form required for parameter', $value);
			return NULL;
		}

		return $value;
	}

	/**
	 * Check if parameter is empty and add error message if mandatory parameter is empty
	 *
	 * Considered ParamConfig values:
	 * optional		boolean		Flag indicating if parameter is optional. Default: FALSE
	 *
	 * @param $value mixed parameter value
	 * @return boolean Flag: Continue other checks
	 */
	private function checkParameterNotEmpty($value) {
		// parameter not empty -> checks can be continued
		if ($value != '')
			return TRUE;

		// parameter empty, but optional -> checks are finished here
		if ($this->paramConfig['optional'])
			return FALSE;

		// parameter is empty:  Error message
		$this->addError('WIDGET PARAM CHECK', 'Parameter must not be empty', $value);
		return FALSE;
	}

	private function checkParameterValidValues($value) {
		return \in_array($value, $this->paramConfig['valid_values'] ?? array());
	}

	/**
	 * Check widget parameter of type "image"
	 * @param $value mixed parameter value
	 */
	private function checkParameterTypeImage($value) {
		if (!$this->checkParameterNotEmpty($value))
			return;

		//consider noembed option
		if (substr($value, -3, 3) == "/ne" )
			$value = substr($value, 0, -3);

		// inline picture
		if (\in_array($value, TemplateCheckerConfig::SmartvisuInlinePictures))
			return;

		// additional widget-specific valid values
		if ($this->checkParameterValidValues($value))
			return;

		if (substr($value, 0, 5) == 'icon.') {
			$node = $this->widget->getNode();
			$this->templateCecker->checkWidget($node, $this->widget->getName()." #". $this->paramIndex ."->".$value);

			$dyniconWiget = explode('(', $value, 2);
			if (\array_key_exists($dyniconWiget[0], $this->dynamicIcons)) {
				// existing dynamic icon
				if (Settings::SHOW_SUCCESS_TOO)
					$this->addInfo('WIDGET IMAGE PARAM CHECK', 'Existing dynamic image', $value);
			} else {
				// unknown dynamic icon
				$this->addError('WIDGET IMAGE PARAM CHECK', 'Missing dynamic image', $value);
			}

		}
		else if (substr($value, 0, 12) == 'basic.symbol') {
			$node = $this->widget->getNode();
			$this->templateCecker->checkWidget($node, $this->widget->getName()." #". $this->paramIndex ."->".$value);
			$dyniconWiget = explode('(', $value, 2);
			if (\array_key_exists($dyniconWiget[0], $this->dynamicIcons)) {
				// existing dynamic icon
				if (Settings::SHOW_SUCCESS_TOO)
					$this->addInfo('WIDGET IMAGE PARAM CHECK', 'Existing dynamic image', $value);
			} else {
				// unknown dynamic icon
				$this->addError('WIDGET IMAGE PARAM CHECK', 'Missing dynamic image', $value);
			}

		}
		else {

			$file = $value;

			switch (TemplateChecker::isFileExisting($file)) {
				case TemplateChecker::FILE_MISSING:
					$this->addError('WIDGET IMAGE PARAM CHECK', 'Image missing', $value, array('Checked File' => $file));
					break;
				case TemplateChecker::FILE_EXISTING:
					if (Settings::SHOW_SUCCESS_TOO)
						$this->addInfo('WIDGET IMAGE PARAM CHECK', 'Image existing', $value, array('Checked File' => $file));
					break;
				case TemplateChecker::FILE_REMOTE:
					if (Settings::SHOW_SUCCESS_TOO)
						$this->addInfo('WIDGET IMAGE PARAM CHECK', 'Image from remote location', $value, array('Checked File' => $file));
					break;
				case TemplateChecker::FILE_CONTAINS_PARAMS:
					if (Settings::SHOW_SUCCESS_TOO)
						$this->addWarning('WIDGET IMAGE PARAM CHECK', 'Image path still contains parameters. Check manually!', $value, array('Checked File' => $file));
					break;
			}
		}
	}

	/**
	 * Check widget parameter of type "id"
	 *
	 * Considered ParamConfig values:
	 * unique		boolean		Flag indicating if id must be unique. Default: TRUE

	 * * @param $value mixed parameter value
	 */
	private function checkParameterTypeId($value) {
		if (!$this->checkParameterNotEmpty($value))
			return;

		if (\in_array($value, Settings::getInstance()->getUsedWidgetIds())) {
			if ($this->getParamConfig('unique', TRUE))
				$this->addError('WIDGET ID PARAM CHECK', 'Id already used', $value);
			else if (Settings::SHOW_SUCCESS_TOO)
				$this->addInfo('WIDGET ID PARAM CHECK', 'Id already used, but must not be unique', $value);
		} else {
			// first occurrence of id
			Settings::getInstance()->addUsedWidgetId($value);
			if (Settings::SHOW_SUCCESS_TOO)
				$this->addInfo('WIDGET ID PARAM CHECK', 'First usage of Id', $value);
		}
	}

	/**
	 * Check widget parameter of type "type"
	 * @param $value mixed parameter value
	 */
	private function checkParameterTypeType($value) {
		if (!$this->checkParameterNotEmpty($value))
			return;

		// moved to function twig_docu @v3.1
		//if (in_array($value, TemplateCheckerConfig::SmartvisuButtonTypes))
		//	return;

		// additional widget-specific valid values
		if ($this->checkParameterValidValues($value))
			return;

		$this->addError('WIDGET TYPE PARAM CHECK', 'Unknown type', $value);
	}
	
	/**
	 * Check widget parameter of type "mode" (database aggregations provided by the backend)
	 * @param $value mixed parameter value
	 */
	private function checkParameterTypeMode($value) {
		if (!$this->checkParameterNotEmpty($value))
			return;
		
		$driver = $this->templateCecker->getDriver();
		if (\in_array($value, TemplateCheckerConfig::aggregationModes[$driver]))
			return;

		// additional widget-specific valid values
		if ($this->checkParameterValidValues($value))
			return;

		$this->addError('WIDGET MODE PARAM CHECK', 'Mode not supported by backend "'.$driver.'"', $value);
	}

	/**
	 * Check widget parameter of type "color"
	 * @param $value mixed parameter value
	 */
	private function checkParameterTypeColor($value) {
		if (!$this->checkParameterNotEmpty($value))
			return;

		// widget-specific valid values, e.g. classes icon0 through icon5
		if ($this->checkParameterValidValues($value))
			return;

		// known html colors
		if (\array_key_exists(strtolower($value), TemplateCheckerConfig::HtmlColors))
			return;

		// basic.window and device.window and maybe other dynamic icons in future have a special color mode (variable / constant)
		// constant mode needs to start with '!' and continue with one of the allowed colors or classes 
		if ($this->checkParameterValidValues('!') && substr($value, 0, 1) == '!') {
			$this->checkParameterTypeColor(substr($value,1));
			return;
		}
		
		// basic.stateswitch and maybe other widgets in the future have a color parameter as indicator with a timeout
		// timout may be added with a colon followed by an integer value after the color
		if ($this->checkParameterValidValues(':') && strpos($value, ':') !== false && is_numeric(substr($value, strpos($value, ':')+1 ))) {
			$this->checkParameterTypeColor(substr($value,0, strpos($value, ':')));
			return;
		}
		
		// anything else needs to start with '#' and be 4 (#+3), 5, 7 or 9 (#+8) characters long including RBGA colors
		if (substr($value, 0, 1) == '#' && (\strlen($value) == 4 || \strlen($value) == 5 || \strlen($value) == 7 || \strlen($value) == 9) && ctype_xdigit(substr($value, 1)))
			return;

		// TODO: rgb() / rgba() / hsl()

		$this->addError('WIDGET COLOR PARAM CHECK', 'Unknown color', $value);
	}
	/**
	 * Check widget parameter of type "item" (new)
	 *
	 * Considered ParamConfig values:
	 * valid_values	array		Array, containing valid values. If not set, all values are allowed. Default: not set
	 *
	 * @param $value mixed parameter value
	 */
	private function checkParameterTypeItem($value) {
		if ($value == "" || $this->items->getState() == FALSE)
			return;
		
		// check for combined status/control items, e.g. "item_status:item_control"
		if (strpos($value, ":") !== false){
			$values = explode(':', $value);
			if (\count($values) != 2){
				$this->addError('ITEM-EXISTING CHECK', 'Combined status/control item must consist of two items', $value, array());
				return FALSE;
			}
			$this->checkParameterTypeItem($values[0]);
			$this->checkParameterTypeItem($values[1]);
			return;
		}

		if ($this->items->ItemExists($value)) {
		if (Settings::SHOW_SUCCESS_TOO)
				$this->addInfo('ITEM-EXISTING CHECK', 'Item is valid', $value, array());
		} else {
			$this->addError('ITEM-EXISTING CHECK', 'Item is not valid - not found in MasterItem-File', $value, array());
			return FALSE;
		}

		if (isset($this->paramConfig['valid_values']) && $this->paramConfig['valid_values']) {
			if ($this->items->getItemType($value)) {
				if (\in_array($this->items->getItemType($value), $this->paramConfig['valid_values'])) {
					if (Settings::SHOW_SUCCESS_TOO)
						$this->addInfo('ITEM-TYPE CHECK', 'Type is valid', $this->items->getItemType($value), array('Valid Values' => $this->paramConfig['valid_values']));
					return TRUE;
				} else {
					$this->addError('ITEM-TYPE CHECK', 'Type of Item is not valid', $this->items->getItemType($value), array('Valid Values' => $this->paramConfig['valid_values']));
					return FALSE;
				}
			}
		}

	}

	/**
	 * Check widget parameter of type "text"
	 *
	 * Considered ParamConfig values:
	 * valid_values	array		Array, containing valid values. If not set, all values are allowed. Default: not set
	 *
	 * @param $value mixed parameter value
	 */
	private function checkParameterTypeText($value) {
		if (!$this->checkParameterNotEmpty($value))
			return;


		if (isset($this->paramConfig['valid_values'])) {
			if ($this->checkParameterValidValues($value)) {
				if (Settings::SHOW_SUCCESS_TOO)
					$this->addInfo('WIDGET TEXT PARAM CHECK', 'Value is valid', $value, array('Valid Values' => $this->paramConfig['valid_values']));
				return TRUE;
			} else if (\is_numeric($value) && \in_array('anynumber', $this->paramConfig['valid_values'])) {
				if (Settings::SHOW_SUCCESS_TOO)
					$this->addInfo('WIDGET TEXT PARAM CHECK', 'Value is valid', $value, array('Valid Values' => $this->paramConfig['valid_values']));
				return TRUE;
			} else {
				$this->addError('WIDGET TEXT PARAM CHECK', 'Text Value is not valid', $value, array('Valid Values' => $this->paramConfig['valid_values']));
				return FALSE;
			}
		}

	}

	/**
	 * Check widget parameter of type "duration"
	 * @param $value mixed parameter value
	 */
	private function checkParameterTypeDuration($value) {
		if (!$this->checkParameterNotEmpty($value))
			return;

		if ($value == 'now' || ctype_digit($value))
			return;

		// additional widget-specific valid values
		if ($this->checkParameterValidValues($value))
			return;

		$parts = explode(' ', $value);
		foreach ($parts as $part) {
			// Last char: Interval
			$interval = substr($part, -1);
			if (!\in_array($interval, TemplateCheckerConfig::SmartvisuDurationIntervals)) {
				$this->addError('WIDGET DURATION PARAM CHECK', 'Invalid duration interval identifier', $value, array('Invalid Identifier' => $interval, 'Valid Identifiers' => TemplateCheckerConfig::SmartvisuDurationIntervals));
				return;
			}
			$numstart = 0;
			if (substr($part,0,1) == '-') {
				$numstart = 1;
			}
			// everything before last char needs to be numbers only
			$number = substr($part, $numstart, -1);
			if (!ctype_digit($number)) {
				$this->addError('WIDGET DURATION PARAM CHECK', 'Invalid duration value', $value, array('Checked Value' => $number, 'Valid Identifiers' => TemplateCheckerConfig::SmartvisuDurationIntervals));
				return;
			}
		}
	}

	/**
	 * Check widget parameter of type "value"
	 * @param $value mixed parameter value
	 */
	private function checkParameterTypeValue($value) {
		if (!$this->checkParameterNotEmpty($value))
			return;

		if (!\is_numeric($value)) {
			$this->addError('WIDGET VALUE PARAM CHECK', 'Numeric value required', $value);
			return;
		}

		$numVal = $value + 0;
		if (isset($this->paramConfig['min']) && $numVal < $this->paramConfig['min'] + 0) {
			$this->addError('WIDGET VALUE PARAM CHECK', 'Value less than allowed minimum value', $value, array('Minimum Value' => $this->paramConfig['min']));
			return;
		}
		if (isset($this->paramConfig['max']) && $numVal > $this->paramConfig['max'] + 0) {
			$this->addError('WIDGET VALUE PARAM CHECK', 'Value greater than allowed maximum value', $value, array('Maximum Value' => $this->paramConfig['max']));
			return;
		}
	}
	
		/**
	 * Check widget parameter of type "value"
	 * @param $value mixed parameter value
	 */
	private function checkParameterTypePercent($value) {
		if (!$this->checkParameterNotEmpty($value))
			return;
		$testPos = strpos($value, '%');
		if ($testPos === false || !\is_numeric(substr($value, 0, $testPos)) || \strlen($value) != $testPos + 1) {
			$this->addError('WIDGET VALUE PARAM CHECK', 'Percent value required', $value);
			return;
		}
	}

	/**
	 * Add widget related error to list of messages
	 * @param string $test Name of test
	 * @param string $message Message
	 * @param string $message Parameter value
	 * @param array $additionalData Additional data
	 */
	private function addError($test, $message, $value, $additionalData = array()) {
		$this->addMessage(MessageCollection::SEVERITY_ERROR, $test, $message, $value, $additionalData);
	}

	/**
	 * Add widget related warning to list of messages
	 * @param string $test Name of test
	 * @param string $message Message
	 * @param string $message Parameter value
	 * @param array $additionalData Additional data
	 */
	private function addWarning($test, $message, $value, $additionalData = array()) {
		$this->addMessage(MessageCollection::SEVERITY_WARNING, $test, $message, $value, $additionalData);
	}

	/**
	 * Add widget related info to list of messages
	 * @param string $test Name of test
	 * @param string $message Message
	 * @param string $message Parameter value
	 * @param array $additionalData Additional data
	 */
	private function addInfo($test, $message, $value, $additionalData = array()) {
		$this->addMessage(MessageCollection::SEVERITY_INFO, $test, $message, $value, $additionalData);
	}

	/**
	 * Add widget related message to list of messages
	 * @param string $severity Severity
	 * @param string $test Name of test
	 * @param string $message Message
	 * @param string $message Parameter value
	 * @param array $additionalData Additional data
	 */
	private function addMessage($severity, $test, $message, $value, $additionalData = array()) {
		$data = array(
			'Widget' => $this->widget->getName(),
			'Parameters' => $this->widget->getParamString(),
			'Parameter Index' => $this->paramIndex,
			'Parameter Value' => $value,
		);
		$data = array_merge($data, $additionalData);
		$this->messages->addMessage($severity, $test, $message, $this->widget->getLineNumber(), $this->widget->getMacro(), $data);
	}

}
