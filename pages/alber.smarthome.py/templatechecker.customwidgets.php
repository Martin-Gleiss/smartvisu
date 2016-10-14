<?php

$customWidgets = array(
	'shutter.one' => array(
		0 => array('type' => 'id'),
		1 => array('type' => 'text'),
		2 => array('type' => 'item'),
		3 => array('type' => 'item', 'optional' => TRUE),
		4 => array('type' => 'item'),
		5 => array('type' => 'item', 'optional' => TRUE),
	),
	'shutter.two' => array(
		0 => array('type' => 'id'),
		1 => array('type' => 'text'),
		2 => array('type' => 'item'),
		3 => array('type' => 'item', 'optional' => TRUE),
		4 => array('type' => 'item'),
		5 => array('type' => 'item', 'optional' => TRUE),
	),
	'shutter.three' => array(
		0 => array('type' => 'id'),
		1 => array('type' => 'text'),
		2 => array('type' => 'item'),
		3 => array('type' => 'item', 'optional' => TRUE),
	),
	'smallrtr.one' => array(
		0 => array('type' => 'id'),
		1 => array('type' => 'text'),
		2 => array('type' => 'item'),
		3 => array('type' => 'item'),
		4 => array('type' => 'item'),		
		5 => array('type' => 'value', 'optional' => TRUE, 'default' => '0.5'),
	),
	'smallshutter.smallshut' => array(
		0 => array('type' => 'id'),
		1 => array('type' => 'text'),
		2 => array('type' => 'item'),
		3 => array('type' => 'item'),
		4 => array('type' => 'item'),
	),
	'weatherjustimage.justimage' => array(
		0 => array('type' => 'id'),
		1 => array('type' => 'text'),
		2 => array('type' => 'text', 'valid_values' => array('day', 'night', 'forecast', 'wind', 'europe')),
	),
);
?>