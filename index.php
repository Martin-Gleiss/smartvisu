<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

// rediret to index.php if requested as default document (prevents issue of double loading same page by different URL)
if (basename(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)) != basename($_SERVER['SCRIPT_NAME'])) {
  header('Location: index.php?' . parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY) , 301);
	exit;
}

// get config-variables
require_once 'lib/includes.php';

// init parameters
$request = array_merge($_GET, $_POST);

// override configured pages if a corresponding request parameter is passed
$config_pages = ($request['pages'] != '') ? $request['pages'] : config_pages;

// detect page and path
if ($request['page'] == '')
	$request['page'] = config_index;

// Caching
header('Cache-Control: must-revalidate');
require_once 'lib/pagecache.php';
$cache = new Pagecache(const_path . 'temp/pagecache/' . config_cachefolder . '/' . $config_pages . '/' . $request['page'] . '.html', config_cache);

if (is_file(const_path."pages/".$config_pages."/".$request['page'].".html")
		or is_file(const_path."apps/".$request['page'].".html")
		or is_file(const_path."pages/smarthome/".$request['page'].".html")
		or is_file(const_path."pages/base/".$request['page'].".html")
		or is_file(const_path."dropins/".$request['page'].".html")
)
{
	// init template engine
	require_once const_path.'vendor/Twig/Autoloader.php';
	Twig_Autoloader::register();

	$loader = new Twig_Loader_Filesystem(const_path.'apps');

	if (is_dir(const_path.'pages/'.$config_pages))
		$loader->addPath(const_path.'pages/'.$config_pages);

	if (dirname($request['page']) != '.' && is_dir(const_path.'pages/'.$config_pages.'/'.dirname($request['page'])))
		$loader->addPath(const_path.'pages/'.$config_pages.'/'.dirname($request['page']));

	// add dir if is not directly chosen
	if (config_driver == 'smarthome.py' and $config_pages != 'smarthome' and is_dir(const_path."pages/smarthome"))
		$loader->addPath(const_path.'pages/smarthome');

	$loader->addPath(const_path.'dropins');
	$loader->addPath(const_path.'pages/base');
	$loader->addPath(const_path.'widgets');

	// init environment
	$twig = new Twig_Environment($loader);
	$twig->addExtension(new Twig_Extension_StringLoader());

	if (defined('config_debug')) {
		if (config_debug) {
			$twig->enableDebug();
			$twig->addExtension(new Twig_Extension_Debug());
		}
	}

	if (config_cache)
		$twig->setCache(const_path.'temp/twigcache');

	foreach ($request as $key => $val)
	{
		if ($key == "page")
			$val = basename(str_replace('.', '_', $val));

		$twig->addGlobal($key, $val);
	}
  
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
	$twig->addGlobal('config_pages', $config_pages);
	$twig->addGlobal('pagepath', dirname($request['page']));
	$twig->addGlobal('const_path', const_path);
	$twig->addGlobal('mbstring_available', function_exists('mb_get_info'));

	$twig->addFilter('_', new Twig_Filter_Function('twig_concat'));
	$twig->addFilter('bit', new Twig_Filter_Function('twig_bit'));
	$twig->addFilter('substr', new Twig_Filter_Function('twig_substr'));
	$twig->addFilter('smartdate', new Twig_Filter_Function('twig_smartdate'));
	$twig->addFilter('deficon', new Twig_Filter_Function('twig_deficon', array('needs_environment' => true)));
	$twig->addFilter('md5', new Twig_Filter_Function('twig_md5'));

	$twig->addFunction('uid', new Twig_Function_Function('twig_uid'));
	$twig->addFunction('once', new Twig_Function_Function('twig_once'));
	$twig->addFunction('isfile', new Twig_Function_Function('twig_isfile'));
	$twig->addFunction('isdir', new Twig_Function_Function('twig_isdir'));
	$twig->addFunction('dir', new Twig_Function_Function('twig_dir'));
	$twig->addFunction('docu', new Twig_Function_Function('twig_docu'));
	$twig->addFunction('configmeta', new Twig_Function_Function('twig_configmeta'));
	$twig->addFunction('lang', new Twig_Function_Function('twig_lang'));
	$twig->addFunction('read_config', new Twig_Function_Function('twig_read_config'));
	$twig->addFunction('timezones', new Twig_Function_Function('twig_timezones'));
	$twig->addFunction('implode', new Twig_Function_Function('twig_implode', array('is_safe' => array('html'))));

	// init lexer comments
	$lexer = new Twig_Lexer($twig, array('tag_comment' => array('/**', '*/')));
	$twig->setLexer($lexer);

	// load template
	try
	{
		$template = $twig->loadTemplate($request['page'].'.html');
		$content = $template->render(array());

		if ($request['page'] == "manifest")
		{
			header('Content-Type: application/manifest+json');
			die($content);
		}

		// write to cache and output
		$cache->write($content);
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