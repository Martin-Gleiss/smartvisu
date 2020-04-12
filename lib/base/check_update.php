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

// get contents of remote version-info.php on githut master branch
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

$ret["local"] = config_version_full; // config_version;
$ret["remote"] = $VersionMajor.".".$VersionMinor.".".$VersionRevision;

if (config_version_revision >= "a") 
{
	$ret["update"] = true;
	$ret["icon"] = 'message_attention.svg';
	$ret["text"] = 'You are using a develop version';
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
echo json_encode($ret);
?>
