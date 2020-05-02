<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Andre Kohler
 * @copyright   2020
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

// ************************************************
// function to get all the icons
// ************************************************

function get_icons ($value)
{

$dirlist = dir('../../icons/ws/');
$myArray = [];
while (($item = $dirlist->read()) !== false)
{
	if (preg_match("/svg/",$item))
	{
	  array_push($myArray,$item);
	}
}

$dirlist->close();


return json_encode($myArray);
}

// ********************************************************
// function to render the Template for the preview inline
// ********************************************************

function render_inline ($value)
{
	$widget = $value["widget"];
	$myFile = file_get_contents('tmpl_construct_2.html');
	$myFile = str_replace("%widget%",$widget, $myFile);
	file_put_contents('../../pages/base/construct.html', $myFile);
    return 'OK';
}

// ************************************************************************
// function to render the Template for the preview outline with auto-Update
// ************************************************************************

function render_outline ($value)
{
	$widget = $value["widget"];
	$myFile = file_get_contents('tmpl_construct_1.html');
	$myFile = str_replace("%widget%",$widget, $myFile);
	file_put_contents('../../pages/base/construct.html', $myFile);
    return 'OK';
}

// ************************************************
// function to get the items
// ************************************************
function load_items ($value)
{
	$myFile = file_get_contents('masteritem.json');
    return $myFile;
}

// ************************************************
// function to render the Template for the preview
// ************************************************
function get_time_stamp ($value)
{
    $ret = filemtime('../../pages/base/construct.html');
    return $ret;
}

// ************************************************
// main
// ************************************************

$command = $_GET["command"];

switch ($command)
{
    case 'render_inline':
        $ret = render_inline($_GET);
        break;
    case 'render_outline':
        $ret = render_outline($_GET);
        break;
    case 'load_items':
        $ret = load_items($_GET);
        break;
    case 'load_icons':
        $ret = get_icons($_GET);
        break;
    case 'get_time_stamp':
        $ret = get_time_stamp($_GET);
        break;

}

echo $ret;
?>
