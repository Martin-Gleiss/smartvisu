<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

// get config-variables 
require_once 'lib/includes.php';
require_once const_path_system.'functions.php';
require_once 'vendor/google.closure/smart_closure.php';


echo "<pre>\n";
echo str_repeat(" ", 69)."smart[VISU]\n";
echo str_repeat(" ", 68).date('H:i, d.m')."\n";
echo str_repeat("-", 80)."\n\n";

compile("lib/base/base.js");
echo "\n";
compile("lib/base/jquery.mobile.slider.js");
echo "\n";

echo "\n";

compile("widgets/widget.js");
echo "\n";
compile("widgets/animation.js");
echo "\n";

echo "\n";


compile_dir("designs");
echo "\n";

compile_dir("driver");
echo "\n";

echo str_repeat("-", 80)."\n\n";
echo "\n</pre>";

function compile_dir($dir) {
	$dh  = opendir($dir);
	while (false !== ($filename = readdir($dh))) {
		if(strlen($filename) < 3 || substr($filename, -3) != '.js')
			continue;
		if(strlen($filename) >= 7 && substr($filename, -7) == '.min.js')
			continue;
		if(substr($filename, 0, 1) == '_')
			continue;
	  compile($dir.'/'.$filename);
		echo "\n";
	}
}

function compile($file)
{
	echo "<b>".$file."</b>\n";

	if (is_file($file))
	{
		// compile it
		$c = new smartClosure();
		$result = $c->add($file)->simpleMode()->_compile();

		// write it
		$compiled = substr($result, strpos($result, '*/') + 3);
		$compiled = "/* smartVISU, Martin Gleiß, 2012 - 2015, GPL [http://www.gnu.de] */\n".$compiled;
		filewrite(substr($file, 0, -3).".min.js", $compiled);

		// status
		$pos = strpos($result, '\'') + 1;
		echo str_replace(" Size", "", str_replace("\\n", ", ", substr($result, $pos + 50, strpos($result, ');') - $pos - 1 - 104)));
		echo "\n";
	}
	else
		echo "...not found!\n";
}

?>                                                         
