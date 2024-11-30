<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß, Wolfram v. Hülsen
 * @copyright   2012 - 2024
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


// get config-variables 
require_once '../../lib/includes.php';

if (empty($_COOKIE['updchk']) && config_updatecheck) 
{	
	// we don't need error handling here. Just retry next time if server contact fails
	set_error_handler(
			function($errno, $errstr, $errfile, $errline)
			{
			if (\defined('config_debug') && config_debug == 1)
				return false;	// hand over to standard error reporting
			else
				return true;
			}
		,E_ALL);
		
	// get contents from smartvisu.de (main version only)
	$request = array_merge($_GET, $_POST);
	$url_sv = "https://smartvisu.de/download/check.php?local=".(isset($request["local"]) ? $request["local"] : config_version_major.".".config_version_minor);
	$data_sv = json_decode(file_get_contents($url_sv, false));
	
	// get contents of remote version-info.php on github master branch (main version plus revision)
	$VersionMajor = '';
	$VersionMinor = '';
	$VersionRevision = '';
	$ret["local"] = config_version_full; 

	$url = "https://raw.githubusercontent.com/martin-gleiss/smartvisu/master/";
	$VersionBuffer = file($url.'version-info.php');

	if($VersionBuffer !== false){
		// Filter version info from the array
		$VersionMajor = substr ($VersionBuffer [2], 33, -4);
		$VersionMinor = substr ($VersionBuffer [3], 33, -4);
		$VersionRevision = substr ($VersionBuffer [4], 36, -4);

		$ret["update"] = (($VersionMajor > config_version_major) or ($VersionMinor > config_version_minor) or ($VersionRevision > config_version_revision) ? true : false);
		$extension = "";
		if ((isset($data_sv) && !$data_sv->update) && $ret["update"]) 
			$extension = ' ('.trans('templatechecker', 'github').')';
		$ret["remote"] = $VersionMajor.".".$VersionMinor.".".$VersionRevision.$extension;
		
		if (config_version_revision >= "a") {
			$ret["update"] = true;
			$ret["icon"] = 'message_attention.svg';
			$ret["text"] = trans('update','develop');
		}
		else {
			if ( $ret["update"] ) {
				$ret["icon"] = 'message_attention.svg';
				$ret["text"] = trans('update','newer');
			}
			else {
				$ret["icon"] = 'message_ok.svg';
				$ret["text"] = trans('update','ok');
			}
		}
	}
	else {
		$ret["update"] = false;
		$ret["icon"] = 'text_na.svg';
		$ret["text"] = trans('update','fail');
	}

	if ($ret["update"]){
		$basepath = substr(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), 0, -\strlen(substr($_SERVER['SCRIPT_FILENAME'], \strlen(const_path))));
		$exptime = time()+3600*24*7; // 1 week until next version check
		setcookie('updchk', 'version checked', ['expires' => $exptime, 'path' => $basepath, 'samesite' => 'Lax']); 
	}
}
else
{
	$ret["update"] = false;
	$ret["icon"] = 'message_ok.svg';
	$ret["text"] = trans('update','skip');
}	
echo json_encode($ret);
?>
