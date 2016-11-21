<?php
/*
 * Uses Minify by Matthias Mullie, https://github.com/matthiasmullie/minify
 */
 
$request = array_merge($_GET, $_POST);

header('Content-Type: text/' . $request['type']);

require_once 'lib/includes.php';

require_once const_path.'vendor/Twig/Autoloader.php';
Twig_Autoloader::register();


if(config_cache === true) {
	$cache = new Twig_Cache_Filesystem(const_path.'temp/pagecache');
	$key = $cache->generateKey('assets.' . $request['type'], implode('|', $request['files']));
}

if($cache != null && ($mtime = $cache->getTimestamp($key)) > 0) { // requested file combination does exist in cache 

  $gmt_mtime = gmdate('D, d M Y H:i:s', $mtime) . ' GMT';
  $etag = sprintf('%08x-%08x', crc32($key), $mtime);

  header('ETag: "' . $etag . '"');
  header('Last-Modified: ' . $gmt_mtime);
  //header('Cache-Control: private');
  header_remove('Expires'); // we don't send an "Expires:" header to make clients/browsers use if-modified-since and/or if-none-match
  
  if (@strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) >= strtotime($gmt_mtime)) {
    $exploded = explode(';', $_SERVER['HTTP_IF_NONE_MATCH']); // IE fix!
  	if(!isset($_SERVER['HTTP_IF_NONE_MATCH']) 
			|| empty($_SERVER['HTTP_IF_NONE_MATCH'])
		)
	  {
	    if(!empty($exploded[0]) && strtotime($exploded[0]) == strtotime($gmt_mtime) 
				|| str_replace(array('\"', '"'), '', $_SERVER['HTTP_IF_NONE_MATCH']) == $etag
				)
	    {
	      header('HTTP/1.1 304 Not Modified');
	      die();
	    }
		}
	}

//	header('Content-Encoding: gzip');
 	echo $cache->load($key);
 	
}
else {

	$path = 'vendor/MatthiasMullie';
	require_once $path . '/minify/src/Minify.php';
	require_once $path . '/minify/src/CSS.php';
	require_once $path . '/minify/src/JS.php';
	require_once $path . '/minify/src/Exception.php';
	require_once $path . '/path-converter/src/Converter.php';

  switch($request['type']) {
  	case 'css':
			$minifier = new MatthiasMullie\Minify\CSS();
  		break;
  	case 'js':
  	case 'javascript':
			$minifier = new MatthiasMullie\Minify\JS();
  		break;
	}
		
	foreach($request['files'] as $fileName) {
		// if filename ends with '.php', evaluate it and add the result
		if(substr_compare($fileName, '.php', -4) == 0) {
			ob_start();
			$wd_was = getcwd();
	    chdir(dirname(const_path.$fileName));
		  include const_path.$fileName;
		  chdir($wd_was); 
		  $content = ob_get_clean();
			$minifier->add($content);
	 	}
	 	// otherwise just add it
		else
			$minifier->add($fileName);
	}

	// get minified content 
	$content = $minifier->execute("assets." . $request['type']);
//	$content = gzencode($content, 9, FORCE_GZIP);

	if($cache != null)
		$cache->write($key, preg_replace("/(<[\\?%]|[\\?%]>)/m", "<?php echo '$1'; ?".">", $content));

//	header('Content-Encoding: gzip');
	echo $content;
}

?>