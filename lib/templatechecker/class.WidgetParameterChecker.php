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
	 * Collection of messages to add messages to
	 * @var MessageCollection
	 */
	private $messages;

	/**
	 * value of parameter
	 * @var mixed 
	 */
	private $value;

	public static function performChecks($widget, $paramIndex, $paramConfig, $messages) {
		$checker = new WidgetParameterChecker($widget, $paramIndex, $paramConfig, $messages);
		$checker->run();
	}

	/**
	 * 
	 * @param Widget $widget Widget Widget
	 * @param integer $paramIndex Index of parameter to check
	 * @param array $paramConfig Config for parameter to check
	 * @param MessageCollection $messages Collection of messages to add messages to
	 */
	private function __construct($widget, $paramIndex, $paramConfig, $messages) {
		$this->widget = $widget;
		$this->paramIndex = $paramIndex;
		$this->paramConfig = $paramConfig;
		$this->messages = $messages;
		$this->settings = Settings::getInstance();
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
		if (!$this->getParameterValue())
			return;

		$type = $this->getParamConfig('type', 'unknown');
		switch ($type) {
			case 'id':

				$this->checkParameterTypeId();
				break;
			case 'image':
				$this->checkParameterTypeImage();
				break;
			case 'text':
				$this->checkParameterTypeText();
				break;
			case 'value':
				// currently no further checks
				break;
			case 'color':
				$this->checkParameterTypeColor();
				break;
			case 'item':
				// currently no further checks
				break;
			case 'iconseries':
				$this->checkParameterTypeIconseries();
				break;
			case 'type':
				$this->checkParameterTypeType();
				break;
			default:
				error_log('unknown type ' . $type);
				break;
			case 'unknown':
			case 'tbd':
				break;
		}
	}

	/**
	 * Determine value of parameter
	 * 
	 * Considered ParamConfig values:
	 * optional		boolean		Flag indicating if parameter is optional. Default: FALSE
	 * default		mixed		Default value to for optional parameter if parameter is missing. Default: Empty String
	 * 
	 * @return TRUE: Value found, FALSE: mandatory parameter missing 
	 */
	private function getParameterValue() {
		$this->value = $this->widget->getParam($this->paramIndex);

		// parameter not given
		if ($this->value == NULL || $this->value == '') {
			if ($this->getParamConfig('optional', FALSE)) {
				// missing optional parameter, return default value
				$this->value = $this->getParamConfig('default', '');
				return TRUE;
			} else {
				// missing mandatory parameter
				$this->addError('WIDGET PARAM CHECK', 'Mandatory parameter missing');
				return FALSE;
			}
		} else {
			// return trimmed parameter
			$this->value = trim($this->value, " \t\n\r\0\x0B'");
			return TRUE;
		}
	}

	/**
	 * Check if parameter is empty and add error message if mandatory parameter is empty
	 * 
	 * Considered ParamConfig values:
	 * optional		boolean		Flag indicating if parameter is optional. Default: FALSE
	 * 
	 * @return boolean Flag: Continue other checks 
	 */
	private function checkParameterNotEmpty() {
		// parameter not empty -> checks can be continued
		if ($this->value != '')
			return TRUE;

		// parameter empty, but optional -> checks are finished here
		if ($this->paramConfig['optional'])
			return FALSE;
		
		// parameter is empty:  Error message
		$this->addError('WIDGET PARAM CHECK', 'Parameter must not be empty');
		return FALSE;
	}

	/**
	 * Check widget parameter of type "iconseries"
	 */
	private function checkParameterTypeIconseries() {
		if (!$this->checkParameterNotEmpty())
			return;

		if (substr($this->value, 0, 5) == 'icon.') {
			if (array_key_exists($this->value, Config::SmartvisuDefaultWidgets)) {
				// existing dynamic icon
				if (Settings::SHOW_SUCCESS_TOO)
					$this->addInfo('WIDGET ICONSERIES PARAM  CHECK', 'Existing dynamic image');
			} else {
				// unknown dynamic icon
				$this->addError('WIDGET ICONSERIES PARAM  CHECK', 'Missing dynamic image');
			}
		} else if (substr($this->value, -7) == '_00.svg') {
			for ($i = 1; $i < 11; $i++) {
				$file = str_replace('_00.svg', '_' . $i . '0.svg', $this->value);
				// add color if required
				if (strpos($file, '/') === false && substr($file, 0, 7) != 'icon0~\'' && substr($file, 0, 7) != 'icon1~\'') {
					$file = Settings::getInstance()->getIcon0() . $file;
				}

				switch (TemplateChecker::isFileExisting($file)) {
					case TemplateChecker::FILE_MISSING:
						$this->addError('WIDGET ICONSERIES PARAM CHECK', 'Image missing', array('Percentage' => $i * 10, 'Checked File' => $file));
						break;
					case TemplateChecker::FILE_EXISTING:
						if (Settings::SHOW_SUCCESS_TOO)
							$this->addInfo('WIDGET ICONSERIES PARAM  CHECK', 'Image existing', array('Percentage' => $i * 10, 'Checked File' => $file));
						break;
					case TemplateChecker::FILE_REMOTE:
						if (Settings::SHOW_SUCCESS_TOO)
							$this->addInfo('WIDGET ICONSERIES PARAM  CHECK', 'Image from remote location', array('Percentage' => $i * 10, 'Checked File' => $file));
						break;
					case TemplateChecker::FILE_CONTAINS_PARAMS:
						if (Settings::SHOW_SUCCESS_TOO)
							$this->addWarning('WIDGET ICONSERIES PARAM  CHECK', 'Image path still contains parameters. Check manually!', array('Percentage' => $i * 10, 'Checked File' => $file));
						break;
				}
			}
		} else {
			// unknown dynamic icon
			$this->addError('WIDGET ICONSERIES PARAM  CHECK', 'Invalid value for iconseries');
		}
	}

	/**
	 * Check widget parameter of type "image"
	 */
	private function checkParameterTypeImage() {
		// parameter empty
		if ($this->value == '')
			return;

		// inline picture
		if (in_array($this->value, Config::SmartvisuInlinePictures))
			return;

		$file = $this->value;

		// add color if required
		if (strpos($file, '/') === false && substr($file, 0, 7) != 'icon0~\'' && substr($file, 0, 7) != 'icon1~\'') {
			$file = Settings::getInstance()->getIcon0() . $file;
		}

		switch (TemplateChecker::isFileExisting($file)) {
			case TemplateChecker::FILE_MISSING:
				$this->addError('WIDGET IMAGE PARAM CHECK', 'Image missing', array('Checked File' => $file));
				break;
			case TemplateChecker::FILE_EXISTING:
				if (Settings::SHOW_SUCCESS_TOO)
					$this->addInfo('WIDGET IMAGE PARAM  CHECK', 'Image existing', array('Checked File' => $file));
				break;
			case TemplateChecker::FILE_REMOTE:
				if (Settings::SHOW_SUCCESS_TOO)
					$this->addInfo('WIDGET IMAGE PARAM  CHECK', 'Image from remote location', array('Checked File' => $file));
				break;
			case TemplateChecker::FILE_CONTAINS_PARAMS:
				if (Settings::SHOW_SUCCESS_TOO)
					$this->addWarning('WIDGET IMAGE PARAM  CHECK', 'Image path still contains parameters. Check manually!', array('Checked File' => $file));
				break;
		}
	}

	/**
	 * Check widget parameter of type "id"
	 * 
	 * Considered ParamConfig values:
	 * unique		boolean		Flag indicating if id must be unique. Default: TRUE
	 */
	private function checkParameterTypeId() {
		if (!$this->checkParameterNotEmpty())
			return;

		if (in_array($this->value, Settings::getInstance()->getUsedWidgetIds())) {
			if ($this->getParamConfig('unique', TRUE))
				$this->addError('WIDGET ID PARAM CHECK', 'Id already used');
			else if (Settings::SHOW_SUCCESS_TOO)
				$this->addInfo('WIDGET ID PARAM CHECK', 'Id already used, but must not be unique');
		} else {
			// first occurrence of id
			Settings::getInstance()->addUsedWidgetId($this->value);
			if (Settings::SHOW_SUCCESS_TOO)
				$this->addInfo('WIDGET ID PARAM CHECK', 'First usage of Id');
		}
	}

	/**
	 * Check widget parameter of type "type"	 
	 */
	private function checkParameterTypeType() {
		if (!$this->checkParameterNotEmpty())
			return;

		if (in_array($this->value, Config::SmartvisuButtonTypes))
			return;

		$this->addError('WIDGET TYPE PARAM CHECK', 'Unknown type', array('Type' => $this->value));
	}

	/**
	 * Check widget parameter of type "color"
	 */
	private function checkParameterTypeColor() {
		if (!$this->checkParameterNotEmpty())
			return;

		// these are defined based on the smartvisu layout
		if ($this->value == 'icon0' || $this->value == 'icon1')
			return;

		// known html colors
		if (array_key_exists(strtolower($this->value), Config::HtmlColors))
			return;

		// anything else needs to start with '#' and be 4 (#+3) or 7 (#+6) characters long
		if (substr($this->value, 0, 1) == '#' && (strlen($this->value) == 4 || strlen($this->value) == 7)) {
			if (ctype_xdigit(substr($this->value, 1)))
				return;
		}

		$this->addError('WIDGET COLOR PARAM CHECK', 'Unknown color', array('Type' => $this->value));
	}

	/**
	 * Check widget parameter of type "text"
	 * 
	 * Considered ParamConfig values:
	 * valid_values	array		Array, containing valid values. If not set, all values are allowed. Default: not set
	 * 
	 */
	private function checkParameterTypeText() {
		if (!$this->checkParameterNotEmpty())
			return;

		if ($this->paramConfig['valid_values']) {
			if (in_array($this->value, $this->paramConfig['valid_values'])) {
				if (Settings::SHOW_SUCCESS_TOO)
					$this->addInfo('WIDGET TEXT PARAM CHECK', 'Value is valid', array('Valid Values' => $this->paramConfig['valid_values']));
			} else {
				$this->addError('WIDGET TEXT PARAM CHECK', 'Value is not valid', array('Valid Values' => $this->paramConfig['valid_values']));
			}
		}

		//$this->addError('WIDGET TYPE PARAM CHECK', 'Unknown type', array('Type' => $this->value));
	}

	/**
	 * Add widget related error to list of messages
	 * @param string $test Name of test
	 * @param string $message Message
	 * @param array $additionalData Additional data
	 */
	private function addError($test, $message, $additionalData = array()) {
		$this->addMessage(MessageCollection::SEVERITY_ERROR, $test, $message, $additionalData);
	}

	/**
	 * Add widget related warning to list of messages
	 * @param string $test Name of test
	 * @param string $message Message
	 * @param array $additionalData Additional data
	 */
	private function addWarning($test, $message, $additionalData = array()) {
		$this->addMessage(MessageCollection::SEVERITY_WARNING, $test, $message, $additionalData);
	}

	/**
	 * Add widget related info to list of messages
	 * @param string $test Name of test
	 * @param string $message Message
	 * @param array $additionalData Additional data
	 */
	private function addInfo($test, $message, $additionalData = array()) {
		$this->addMessage(MessageCollection::SEVERITY_INFO, $test, $message, $additionalData);
	}

	/** 	 
	 * Add widget related message to list of messages
	 * @param string $severity Severity
	 * @param string $test Name of test
	 * @param string $message Message
	 * @param array $additionalData Additional data
	 */
	private function addMessage($severity, $test, $message, $additionalData = array()) {
		$data = array(
			'Widget' => $this->widget->getName(),
			'Parameters' => $this->widget->getParamString(),
			'Parameter Index' => $this->paramIndex,
			'Parameter Value' => $this->value,
		);
		$data = array_merge($data, $additionalData);
		$this->messages->addMessage($severity, $test, $message, $this->widget->getLineNumber(), $this->widget->getMacro(), $data);
	}

}
