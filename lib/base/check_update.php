<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiss, Wolfram v. Huelsen
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


// get config-variables 
require_once '../../lib/includes.php';

if (empty($_COOKIE['updchk'])) 
{	
	// get contents from smartvisu.de (main version only)
	$request = array_merge($_GET, $_POST);
	$url_sv = "https://smartvisu.de/download/check.php?local=".(isset($request["local"]) ? $request["local"] : config_version);
	$data_sv = json_decode(file_get_contents($url_sv, false));

	// get contents of remote version-info.php on github master branch (main version plus revision)
	$url = "https://raw.githubusercontent.com/martin-gleiss/smartvisu/master/";
	$VersionBuffer = file($url.'version-info.php');

	// Filter version info from the array
	$VersionOldFormat = substr ($VersionBuffer [2], 27, -4);

	if ($VersionBuffer [4]) {		// version-info.php contains new version formats
		$VersionMajor = substr ($VersionBuffer [3], 33, -4);
		$VersionMinor = substr ($VersionBuffer [4], 33, -4);
		$VersionRevision = substr ($VersionBuffer [5], 36, -4);
	}
	else{
		$VersionMajor = substr ($VersionOldFormat, 0, 1);
		$VersionMinor = substr ($VersionOldFormat, 2);
		$VersionRevision = "0";
	}

	$extension = "";
	if ((!$data_sv->update) && ($VersionRevision > config_version_revision)) {
		$extension = ' (github only)';
	}
	
	$ret["local"] = config_version_full; // config_version;
	$ret["remote"] = $VersionMajor.".".$VersionMinor.".".$VersionRevision.$extension;
		
	if (config_version_revision >= "a") 
	{
		$ret["update"] = true;
		$ret["icon"] = 'message_attention.svg';
		$ret["text"] = 'This version from develop branch <br> might be unstable';
	}
	else
	{
		if ( ($VersionMajor > config_version_major) or ($VersionMinor > config_version_minor) or ($VersionRevision > config_version_revision) )
		{
			$ret["update"] = true;
			$ret["icon"] = 'message_attention.svg';
			$ret["text"] = 'smartVISU update available!';
		}
		else
		{
			$ret["update"] = false;
			$ret["icon"] = 'message_ok.svg';
			$ret["text"] = 'smartVISU is up to date';
		}
	}
	$basepath = substr(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), 0, -strlen(substr($_SERVER['SCRIPT_FILENAME'], strlen(const_path))));
	$exptime = time()+3600*24*7; // 1 week until next version check
	setcookie('updchk', 'version checked', ['expires' => $exptime, 'path' => $basepath, 'samesite' => 'Lax']);   
}
else
{
	$ret["update"] = false;
	$ret["icon"] = 'message_ok.svg';
	$ret["text"] = 'update check skipped for 7 days';
}	
echo json_encode($ret);
?>
