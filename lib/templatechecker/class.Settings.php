<?php

/**
 * Class containing all required settings (Singleton)
 */
class Settings {

	/**
	 * instance
	 * @var Settings 
	 */
	private static $instance;

	/**
	 * get instance of class
	 * @return Settings
	 */
	public static function getInstance() {
		if (self::$instance == NULL)
			self::$instance = new self();
		return self::$instance;
	}

	/**
	 * flag: add messages for successful checks, too?
	 * @var boolean
	 */
	const SHOW_SUCCESS_TOO = true;

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

	/**
	 * list of used widget id's
	 * @var array 
	 */
	private $usedWidgetIds;

	/**
	 * get path for icon0
	 * @return string
	 */
	public function getIcon0() {
		return $this->icon0;
	}

	/**
	 * get path for icon1
	 * @return string
	 */
	public function getIcon1() {
		return $this->icon1;
	}

	/**
	 * get array with used widged ID's
	 * @return array
	 */
	public function getUsedWidgetIds() {
		return $this->usedWidgetIds;
	}

	/**
	 * add entry to array with used widget ID's
	 * @param string $widgetId
	 */
	public function addUsedWidgetId($widgetId) {
		$this->usedWidgetIds[] = $widgetId;
	}

	/**
	 * clear array with used widget ID's
	 */
	public function clearUsedWidgetIds() {
		$this->usedWidgetIds = array();
	}

	/**
	 * constructor
	 */
	private function __construct() {
		$this->clearUsedWidgetIds();

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

}
