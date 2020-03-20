<?php

/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Thomas Ernst
 * @copyright   2016
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
	 * Available dynamic icons
	 * @var array
	 */
	private $dynamicIcons;

	/**
	 * Collection of messages to add messages to
	 * @var MessageCollection
	 */
	private $messages;


	/**
	 * Backreference to calling template checker (to be used to check widgets which are parameter of current widget)
	 * @var TemplateChecker
	 */
	private $templateCecker;

	function get_arrays($string, $start, $end, $single){
		$string = $start . str_replace(', ', ',', $string) . $end;
		$string = str_replace("'", "", $string);
		$string = str_replace('"', '', $string);
		$p1 = explode($start, $string);

		for($i=1; $i<count($p1); $i++){
				$p2 = explode($end, $p1[$i]);
				$p3 = explode(',', $p2[1]);
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
		if (count($p) > 1)
			array_shift($p);
		else
			return $p;
		$x = array();
		foreach($p as $key){
			$x = array_merge($x, $key);
		}
		return $x;
	}

	public static function performChecks($widget, $paramIndex, $paramConfig, $messages, $templateCecker) {
		$checker = new WidgetParameterChecker($widget, $paramIndex, $paramConfig, $messages, $templateCecker);
		$checker->run();
	}

	/**
	 *
	 * @param Widget $widget Widget Widget
	 * @param integer $paramIndex Index of parameter to check
	 * @param array $paramConfig Config for parameter to check
	 * @param MessageCollection $messages Collection of messages to add messages to
	 */
	private function __construct($widget, $paramIndex, $paramConfig, $messages, $templateCecker) {
		$this->widget = $widget;
		$this->paramIndex = $paramIndex;
		$this->paramConfig = $paramConfig;
		$this->messages = $messages;
    $this->templateCecker = $templateCecker;
		$this->settings = Settings::getInstance();
		$this->dynamicIcons = twig_docu(const_path . 'widgets/icon.html');
	}

	/**
	 * return parameter config setting
	 * @param string $setting name of setting to return
	 * @param mixed $default default value if setting is not part of paramConfig array
	 * @return mixed parameter config setting
	 */
	private function getParamConfig($setting, $default = '') {
		return array_key_exists($setting, $this->paramConfig) ? $this->paramConfig[$setting] : $default;
	}

	/**
	 * run actual checks
	 */
	private function run() {
		$type = $this->getParamConfig('type', 'unknown');
		if($type == 'unknown') {
			$this->addWarning('WIDGET PARAM CHECK', 'Parameter type not defined. Check manually!', $value);
			return;
		}

		$values = $this->getParameterValue();
		if ($values === NULL)
			return;
		if (!is_array($values))
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
					// in the future there may be the possibility to validate items.
					// for now we perform the same tests than for type "text"
					$this->checkParameterTypeText($value);
					break;
				case 'iconseries':
					$this->checkParameterTypeIconseries($value);
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
	private function getParameterValue() {
		$value = $this->widget->getParam($this->paramIndex);
		// parameter not given
		if ($value == NULL || $value == '') {
			if ($this->getParamConfig('optional', TRUE)) {
				// missing optional parameter, return default value
				$value = $this->getParamConfig('default', '');
			} else {
				// missing mandatory parameter
				$this->addError('WIDGET PARAM CHECK', 'Mandatory parameter missing', $value);
				return NULL;
			}
		}

		// no check for arrayform if value is empty
		if($value == '')
			return $value;

		if (!is_array($value))
			$test = explode(',', $value);
		if (!is_array($value) && substr( $value, 0, 1 ) === "[" && count($test) > 1)
		{
			$value = $this->get_arrays($value, '[', ']', 'single');
		}

		$allowArray = $this->getParamConfig('array_form', 'no');
		if (is_array($value) && $allowArray != 'must' && $allowArray != 'may') { // array form
			$this->addError('WIDGET PARAM CHECK', 'Array form not allowed for parameter', $value);
			return NULL;
		} else if (!is_array($value) && $allowArray == 'must') { // not array form
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
		return in_array($value, $this->paramConfig['valid_values'] ?: array());
	}

	/**
	 * Check widget parameter of type "iconseries"
	 * @param $value mixed parameter value
	 */
	private function checkParameterTypeIconseries($value) {
		if (!$this->checkParameterNotEmpty($value))
			return;

		if (substr($value, 0, 5) == 'icon.') {
			if (array_key_exists($value, $this->dynamicIcons)) {
				// existing dynamic icon
				if (Settings::SHOW_SUCCESS_TOO)
					$this->addInfo('WIDGET ICONSERIES PARAM  CHECK', 'Existing dynamic image', $value);
			} else {
				// unknown dynamic icon
				$this->addError('WIDGET ICONSERIES PARAM  CHECK', 'Missing dynamic image', $value);
			}
		} else if (substr($value, -7) == '_00.svg') {
			for ($i = 1; $i < 11; $i++) {
				$file = str_replace('_00.svg', '_' . $i . '0.svg', $value);
				// add color if required
				if (strpos($file, '/') === false && substr($file, 0, 7) != 'icon0~\'' && substr($file, 0, 7) != 'icon1~\'') {
					$file = Settings::getInstance()->getIcon0() . $file;
				}

				switch (TemplateChecker::isFileExisting($file)) {
					case TemplateChecker::FILE_MISSING:
						$this->addError('WIDGET ICONSERIES PARAM CHECK', 'Image missing', $value, array('Percentage' => $i * 10, 'Checked File' => $file));
						break;
					case TemplateChecker::FILE_EXISTING:
						if (Settings::SHOW_SUCCESS_TOO)
							$this->addInfo('WIDGET ICONSERIES PARAM  CHECK', 'Image existing', $value, array('Percentage' => $i * 10, 'Checked File' => $file));
						break;
					case TemplateChecker::FILE_REMOTE:
						if (Settings::SHOW_SUCCESS_TOO)
							$this->addInfo('WIDGET ICONSERIES PARAM  CHECK', 'Image from remote location', $value, array('Percentage' => $i * 10, 'Checked File' => $file));
						break;
					case TemplateChecker::FILE_CONTAINS_PARAMS:
						if (Settings::SHOW_SUCCESS_TOO)
							$this->addWarning('WIDGET ICONSERIES PARAM  CHECK', 'Image path still contains parameters. Check manually!', $value, array('Percentage' => $i * 10, 'Checked File' => $file));
						break;
				}
			}
		} else {
			// unknown dynamic icon
			$this->addError('WIDGET ICONSERIES PARAM  CHECK', 'Invalid value for iconseries', $value);
		}
	}

	/**
	 * Check widget parameter of type "image"
	 * @param $value mixed parameter value
	 */
	private function checkParameterTypeImage($value) {
		if (!$this->checkParameterNotEmpty($value))
			return;

		// inline picture
		if (in_array($value, TemplateCheckerConfig::SmartvisuInlinePictures))
			return;

		// additional widget-specific valid values
		if ($this->checkParameterValidValues($value))
			return;

		//TODO: Replace by recursively checked widgets in parameters in class.Widget.php
		if (substr($value, 0, 5) == 'icon.') {

			$dyniconWiget = explode('(', $value, 2);
			if (array_key_exists($dyniconWiget[0], $this->dynamicIcons)) {
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

		if (in_array($value, Settings::getInstance()->getUsedWidgetIds())) {
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

		if (in_array($value, TemplateCheckerConfig::SmartvisuButtonTypes))
			return;

		// additional widget-specific valid values
		if ($this->checkParameterValidValues($value))
			return;

		$this->addError('WIDGET TYPE PARAM CHECK', 'Unknown type', $value);
	}

	/**
	 * Check widget parameter of type "color"
	 * @param $value mixed parameter value
	 */
	private function checkParameterTypeColor($value) {
		if (!$this->checkParameterNotEmpty($value))
			return;

		// these are defined based on the smartvisu layout
		if ($value == 'icon0' || $value == 'icon1')
			return;

		// additional widget-specific valid values
		if ($this->checkParameterValidValues($value))
			return;

		// known html colors
		if (array_key_exists(strtolower($value), TemplateCheckerConfig::HtmlColors))
			return;

		// anything else needs to start with '#' and be 4 (#+3) or 7 (#+6) characters long
		if (substr($value, 0, 1) == '#' && (strlen($value) == 4 || strlen($value) == 7) && ctype_xdigit(substr($value, 1)))
			return;

		// TODO: rgb() / rgba() / hsl()

		$this->addError('WIDGET COLOR PARAM CHECK', 'Unknown color', $value);
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


		if ($this->paramConfig['valid_values']) {
			if ($this->checkParameterValidValues($value)) {
				if (Settings::SHOW_SUCCESS_TOO)
					$this->addInfo('WIDGET TEXT PARAM CHECK', 'Value is valid', $value, array('Valid Values' => $this->paramConfig['valid_values']));
				return TRUE;
			} else if (is_numeric($value) && in_array('anynumber', $this->paramConfig['valid_values'])) {
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
			if (!in_array($interval, TemplateCheckerConfig::SmartvisuDurationIntervals)) {
				$this->addError('WIDGET DURATION PARAM CHECK', 'Invalid duration interval identifier', $value, array('Invalid Identifier' => $interval, 'Valid Identifiers' => TemplateCheckerConfig::SmartvisuDurationIntervals));
				return;
			}
			// everything before last char needs to be numbers only
			$number = substr($part, 0, -1);
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

		if (!is_numeric($value)) {
			$this->addError('WIDGET VALUE PARAM CHECK', 'Numeric value required', $value);
			return;
		}

		$numVal = $value + 0;
		if ($this->paramConfig['min'] && $numVal < $this->paramConfig['min'] + 0) {
			$this->addError('WIDGET VALUE PARAM CHECK', 'Value less than allowed minimum value', $value, array('Minimum Value' => $this->paramConfig['min']));
			return;
		}
		if ($this->paramConfig['max'] && $numVal > $this->paramConfig['max'] + 0) {
			$this->addError('WIDGET VALUE PARAM CHECK', 'Value greater than allowed maximum value', $value, array('Maximum Value' => $this->paramConfig['max']));
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
