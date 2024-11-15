<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Andre Kohler
 * @copyright   2020 -2024
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


// get config-variables 
require_once '../../lib/includes.php';


// ************************************************
// function to get the items
// ************************************************
function load_items ()
{
	
	$myArray = array();
	$mypages = $_GET["pages"];
	if ( $mypages == NULL || $mypages == "")
		{ 
			return $myArray;
		}
	

	try {
		if (is_file(const_path.'pages/'.$mypages.'/masteritem.json'))
		{
			$myFile = file_get_contents(const_path.'pages/'.config_pages.'/masteritem.json');
			$Items1 = str_replace('[','',$myFile);
			$Items1 = str_replace(']','',$Items1);
			$Items1 = str_replace("\"",'',$Items1);
			$Items2=explode(",",$Items1);
			
			foreach ($Items2 as $key) { 
				$myArray[trim(explode('|',$key)[0])] = trim(explode('|',$key)[1]);
				}
		}
		
	}
	catch (Exception $e) {
		$myArray = NULL;
	}
	
    return $myArray;
}
// main

$items = load_items();
if (count($items)>1)
{
	$ret = array('icon' => 'message_ok.svg', 'text' => trans('templatechecker', 'misuccess'));
}
else
{
	header("HTTP/1.1 500 Internal Server Error");
	$ret = array('icon' => 'message_attention.svg', 'text' => trans('templatechecker', 'mifail'));
}

echo json_encode($ret);
?>