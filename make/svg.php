<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

// get config-variables 
require_once 'lib/includes.php';
require_once const_path_system.'functions.php';
require_once const_path_system.'functions_twig.php';

$form = array_merge($_GET, $_POST);


echo "<pre>\n";
echo str_repeat(" ", 69)."smart[VISU]\n";
echo str_repeat(" ", 68).date('H:i, d.m')."\n";
echo str_repeat("-", 80)."\n\n";

// load raw
$dir = twig_dir('temp');

foreach ($dir as $file)
{
	$name = $file['name'];
	
    // DEBUG: $name = "audio_audio.svg";

	$out = fileread('temp/'.$name);

	echo $name.' ('.strlen($out).' Bytes) ...';

    if($form['debug'])
		echo htmlentities($out);
    
    $out = str_replace(' xmlns:xlink="http://www.w3.org/1999/xlink"', '', $out);
    $out = str_replace(' viewBox="0 0 361 361"', ' viewBox="20 20 321 321"', $out);
    $out = str_replace(' width="361"', '', $out);
    $out = str_replace(' height="361"', '', $out);
    
    $out = str_replace(' enable-background="new 0 0 361 361"', '', $out);
    // $out = str_replace(' stroke-width="10"', '', $out);
    $out = str_replace(' stroke-miterlimit="10"', '', $out);
     
	echo '... '.strlen($out).' Bytes'."\n";

	if($form['debug'])
		echo htmlentities($out);

	filewrite('../smartVISU/icons/ws/'.$name, $out);
    
    $out = str_replace(' fill="#fff"', ' fill="#000"', $out);
    $out = str_replace(' stroke="#fff"', '  stroke="#000"', $out);
    
    filewrite('../smartVISU/icons/sw/'.$name, $out);
}

echo str_repeat("-", 80)."\n\n";
echo "\n</pre>";

?>                                                         
