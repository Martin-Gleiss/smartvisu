<?php

/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Andre Kohler
 * @copyright   2020
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */
/**
 * Class representing an array with all the items and types
 */
class Items {

	/**
	 * items containing the widget
	 */
	private $items;

	/**
	 * ready
	 */
	private $ready;

	/**
	 * getState
	 */
	public function getState() {
		return $this->ready;
	}
	public function setState($value) {
		$this->ready = $value;
	}
	/**
	 * get items Array
	 */
	public function getItems() {
		return $this->items;
	}

	/**
	 * getItemType
	 */
	public function getItemType($name) {
		return $this->items[$name];
	}
	
	/**
	 * ItemExists
	 */
	public function ItemExists($name) {
		if (strpos($name, 'property') === false)
			return isset($this->items[$name]) && !$this->items[$name] == null;
		else {
			$pos = strpos($name, 'property');
			$itemname = substr($name, 0, $pos -1);
			$propertyname = substr($name, $pos + 9); 
			if (isset($this->items[$name]) && !$this->items[$itemname] == null && itemProperties::propertyExists($propertyname)) 
				$this->items[$name] = itemProperties::getPropertyType($propertyname);
			
			return isset($this->items[$name]) && !$this->items[$name] == null;
		}
	}

	/**
	 * constructor
	 * Reads the masteritem file and transforms it into an array
	 */
	function __construct($path) {
		$this->ready = FALSE;
		$this->items = array();
		try {
			if (is_file(const_path.$path.'/masteritem.json'))
			{
			@$myFile = file_get_contents(const_path.'pages/'.config_pages.'/masteritem.json');
			$Items1 = str_replace('[','',$myFile);
			$Items1 = str_replace(']','',$Items1);
			$Items1 = str_replace("\"",'',$Items1);
			$Items2=explode(",",$Items1);
			
			foreach ($Items2 as $key) { 
				$this->items[trim(explode('|',$key)[0])] = trim(explode('|',$key)[1]);
				}
			}
			if ($this->items != NULL && count($this->items) > 1)
			$this->ready = TRUE;
		}
		catch (Exception $e) {
			$this->ready = FALSE;
		}
		
	}

}