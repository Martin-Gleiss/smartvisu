<?php

/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Wolfram v. Hülsen
 * @copyright   2021
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 *
 * provide item properties with their types for item checking (smarthomeNG item properties)
 * http://www.smarthomeng.de/user/referenz/items/properties.html
 */

class itemProperties {
	
	const properties = array (
		'attributes' => 'list',
		'defined_in' => 'str',
		'enforce_updates' => 'bool',
		'eval' => 'str',
		'eval_unexpanded' => 'str',
		'last_change' => 'datetime',
		'last_change_age' => 'num',
		'last_change_by' => 'str',
		'last_update' => 'datetime',
		'last_update_age' => 'num',
		'last_update_by' => 'str',
		'last_value' => 'str',
		'name' => 'str',
		'on_change_unxpanded' => 'list',
		'on_change' => 'list',
		'on_update' => 'list',
		'on_update_unexpanded' => 'list',
		'path' => 'str',
		'prev_change' => 'datetime',
		'prev_change_age' => 'num',
		'prev_change_by' => 'str',
		'prev_update' => 'datetime',
		'prev_update_age' => 'num',
		'prev_update_by' => 'str',
		'prev_value' => 'str',
		'trigger' => 'list',
		'trigger_unexpanded' => 'list',
		'type' => 'str',
		'value' => 'str'
	);
	
	public static function propertyExists($name) {
		return !self::properties[$name] == null;
	}
	
	public static function getPropertyType($name) {
		return self::properties[$name];
	}
}
