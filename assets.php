<?php
/*
 * Uses Minify by Matthias Mullie, https://github.com/matthiasmullie/minify
 */
 
$request = array_merge($_GET, $_POST);
$type = $request['type'];
$suffix = $type == 'javascript' ? 'js' : $type;

header('Content-Type: text/' . $type);

require_once 'lib/includes.php';

require_once 'lib/pagecache.php';
$key = hash('sha256', implode('|', $request['files']));
$cache = new Pagecache(const_path . 'temp/pagecache/' . config_cachefolder . '/' . $request['pages'] . '/' . $key . '.' . $suffix, config_cache);

echo '/** '.implode(' | ', $request['files']).' **/';

$path = 'vendor/MatthiasMullie';
require_once $path . '/minify/src/Minify.php';
require_once $path . '/minify/src/CSS.php';
require_once $path . '/minify/src/JS.php';
require_once $path . '/minify/src/Exception.php';
require_once $path . '/minify/src/Exceptions/BasicException.php';
require_once $path . '/minify/src/Exceptions/FileImportException.php';
require_once $path . '/minify/src/Exceptions/IOException.php';
require_once $path . '/path-converter/src/ConverterInterface.php';
require_once $path . '/path-converter/src/Converter.php';

if($type == 'javascript' && \defined('config_debug') && !config_debug)
	array_unshift($request['files'], 'console.log = function() {};');

foreach($request['files'] as $fileName) {

	// if filename ends with '.php', evaluate it and add the result
	if(substr_compare($fileName, '.php', -4) == 0) {
		ob_start();
		chdir(\dirname(const_path.$fileName));
		include const_path.$fileName;
		chdir(\dirname($_SERVER['SCRIPT_FILENAME']));
		$rawcontent = ob_get_clean();
 	}
 	// otherwise just add it
	else
		$rawcontent = $fileName;

	switch($type) {
		case 'css':
			$minifier = new MatthiasMullie\Minify\CSS($rawcontent);
			break;
		case 'js':
		case 'javascript':
			$minifier = new MatthiasMullie\Minify\JS($rawcontent);
			break;
	}

	$content = "\n/* ".$fileName." */\n";

	// avoid errors thrown by minifying already minified highcharts files
	if ( substr_compare($fileName, 'vendor/plot.highcharts', 0, 22) == 0 )
		$content .= preg_replace('#\/\*\*.*?\*\/#s', '', file_get_contents($fileName));
	else
		// get minified content
		$content .= $minifier->execute("assets." . $type);

	if($type == 'javascript')
	  $content .= ';';

	$cache->append($content);
}

?>