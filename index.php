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
require_once const_path_system.'functions_twig.php';

// init parameters
$request = array_merge($_GET, $_POST);

// detect page and path
if ($request['page'] == '')
	$request['page'] = config_index;

if (is_file(const_path."pages/".config_pages."/".$request['page'].".html")
		or is_file(const_path."apps/".$request['page'].".html")
		or is_file(const_path."pages/smarthome/".$request['page'].".html")
		or is_file(const_path."pages/base/".$request['page'].".html")
)
{
	// init template engine
	require_once const_path.'vendor/Twig/Autoloader.php';
	Twig_Autoloader::register();

	$loader = new Twig_Loader_Filesystem(const_path.'apps');

	if (is_dir(const_path.'pages/'.config_pages))
		$loader->addPath(const_path.'pages/'.config_pages);

	if (dirname($request['page']) != '.')
		$loader->addPath(const_path.'pages/'.config_pages.'/'.dirname($request['page']));

	// add dir if is not directly chosen
	if (config_driver == 'smarthome.py' and config_pages != 'smarthome' and is_dir(const_path."pages/smarthome"))
		$loader->addPath(const_path.'pages/smarthome');

	$loader->addPath(const_path.'pages/base');
	$loader->addPath(const_path.'widgets');

	// init environment
	$twig = new Twig_Environment($loader);

	if (config_cache)
		$twig->setCache(dirname(__FILE__).'/temp');

	foreach ($request as $key => $val)
	{
		if ($key == "page")
			$val = basename(str_replace('.', '_', $val));

		$twig->addGlobal($key, $val);
	}
	$twig->addGlobal('pagepath', dirname($request['page']));

	if (config_design == 'ice')
	{
		$twig->addGlobal('icon1', 'icons/bl/');
		$twig->addGlobal('icon0', 'icons/sw/');
	}
	elseif (config_design == 'greenhornet')
	{
		$twig->addGlobal('icon1', 'icons/gn/');
		$twig->addGlobal('icon0', 'icons/ws/');
	}
	else
	{
		$twig->addGlobal('icon1', 'icons/or/');
		$twig->addGlobal('icon0', 'icons/ws/');
	}

	foreach (get_defined_constants() as $key => $val)
	{
		if (substr($key, 0, 6) == 'config')
			$twig->addGlobal($key, $val);
	}

	$twig->addFilter('_', new Twig_Filter_Function('twig_concat'));
	$twig->addFilter('bit', new Twig_Filter_Function('twig_bit'));
	$twig->addFilter('substr', new Twig_Filter_Function('twig_substr'));
	$twig->addFilter('smartdate', new Twig_Filter_Function('twig_smartdate'));
	$twig->addFilter('deficon', new Twig_Filter_Function('twig_deficon', array('needs_environment' => true)));
	$twig->addFilter('md5', new Twig_Filter_Function('twig_md5'));

	$twig->addFunction('uid', new Twig_Function_Function('twig_uid'));
	$twig->addFunction('once', new Twig_Function_Function('twig_once'));
	$twig->addFunction('isfile', new Twig_Function_Function('twig_isfile'));
	$twig->addFunction('dir', new Twig_Function_Function('twig_dir'));
	$twig->addFunction('docu', new Twig_Function_Function('twig_docu'));
	$twig->addFunction('lang', new Twig_Function_Function('twig_lang'));
	$twig->addFunction('implode', new Twig_Function_Function('twig_implode', array('is_safe' => array('html'))));

	// init lexer comments                   
	$lexer = new Twig_Lexer($twig, array('tag_comment' => array('/**', '*/')));
	$twig->setLexer($lexer);

	// load template
	try
	{
		$template = $twig->loadTemplate($request['page'].'.html');
		$ret = $template->render(array());

		// try to zip the output
		if ((strpos($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') !== false) && (ini_get('zlib.output_compression') !== false))
		{
			header("Content-Encoding: gzip");
			$ret = "\x1f\x8b\x08\x00\x00\x00\x00\x00".substr(gzcompress($ret, 9), 0, -4).pack("V", crc32($ret)).pack("V", strlen($ret));
		}
		echo $ret;
	}
	catch (Exception $e)
	{
		// header("HTTP/1.0 602 smartVISU Template Error");
		
		echo "<pre>\n";
		echo str_repeat(" ", 71)."smartVISU\n";
		echo str_repeat(" ", 62).date('H:i, d.m').", v".config_version."\n";
		echo str_repeat("-", 80)."\n\n";
		echo "Error occurred in twig-template engine!\n\n";
		echo "error: <b>".$e->getRawMessage()."</b>\n";
		echo "file:  ".$e->getTemplateFile()."\n";
		echo "line:  ".$e->getTemplateLine()."\n\n";
		echo str_repeat("-", 80)."\n\n";
		echo "\n</pre>";
	}
}
else
{
	header("HTTP/1.0 404 Not Found");

	echo "<pre>\n";
	echo str_repeat(" ", 71)."smartVISU\n";
	echo str_repeat(" ", 62).date('H:i, d.m').", v".config_version."\n";
	echo str_repeat("-", 80)."\n\n";
	echo "Error loading Page '<b>".$request['page']."</b>' !\n\n";
	echo "Check config.php -> 'config_pages' for correct Pages/Project configuration\n";
	echo "or try the <a href='index.php'>index</a> page!\n\n";
	echo str_repeat("-", 80)."\n\n";
	echo "\n</pre>";
}
?>
