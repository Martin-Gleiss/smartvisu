<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiss
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
$actual_pages = (isset($request['pages']) && $request['pages'] != '') ? $request['pages'] : config_pages;

// if page is not in $request use default index page defined in defaults.ini
if (!isset($request['page']) || $request['page'] == '')
	$request['page'] = config_index;

// Caching
$config_cache = ($request ['page'] == 'assistant') ? false : config_cache;

header('Cache-Control: must-revalidate');
require_once 'lib/pagecache.php';
$cache = new Pagecache(const_path . 'temp/pagecache/' . config_cachefolder . '/' . $actual_pages . '/' . $request['page'] . '.html', $config_cache);

if (is_file(const_path."pages/".$actual_pages."/".$request['page'].".html")
		or is_file(const_path."apps/".$request['page'].".html")
		or is_file(const_path."pages/smarthome/".$request['page'].".html")
		or is_file(const_path."pages/base/".$request['page'].".html")
		or is_file(const_path."dropins/".$request['page'].".html")
)
{
	// init template engine
	require_once const_path.'vendor/autoload.php';
	
	$loader = new \Twig\Loader\FilesystemLoader(const_path.'apps');

	if (is_dir(const_path.'pages/'.$actual_pages))
		$loader->addPath(const_path.'pages/'.$actual_pages);
	
	if (is_dir(const_path.'pages/'.$actual_pages.'/widgets'))
		$loader->addPath(const_path.'pages/'.$actual_pages.'/widgets');

	if (dirname($request['page']) != '.' && is_dir(const_path.'pages/'.$actual_pages.'/'.dirname($request['page'])))
		$loader->addPath(const_path.'pages/'.$actual_pages.'/'.dirname($request['page']));

	// add smarthome dir if it is not directly chosen. 
	// allows combination of custom pages with auto-generated pages from smarthomeNG
	if (substr(config_driver, 0, 9) == 'smarthome' and $actual_pages != 'smarthome' and is_dir(const_path."pages/smarthome"))
		$loader->addPath(const_path.'pages/smarthome');

   // make sure SV doesn't load stuff from dropins unless pages are configured
	if ($actual_pages != '') {
			$loader->addPath(const_path.'dropins');
			$loader->addPath(const_path.'dropins/widgets');
			$loader->addPath(const_path.'dropins/shwidgets');
	}
	$loader->addPath(const_path.'pages/base');
	$loader->addPath(const_path.'widgets');

	// init environment
	$twig = new \Twig\Environment($loader);
	$twig->addExtension(new \Twig\Extension\StringLoaderExtension());
	
	if (defined('config_debug')) {
		if (config_debug) {
			$twig->enableDebug();
			$twig->addExtension(new \Twig\Extension\DebugExtension());
		}
	}

	if ($config_cache)
		$twig->setCache(const_path.'temp/twigcache');

	foreach ($request as $key => $val)
	{
		if ($key == "page")
			$val = basename(str_replace('.', '_', $val));

		$twig->addGlobal($key, $val);
	}
  
	$twig->addGlobal('icon1', config_design_icon1);
	$twig->addGlobal('icon0', config_design_icon0);
	

	foreach (get_defined_constants() as $key => $val)
	{
		if (substr($key, 0, 6) == 'config')
			$twig->addGlobal($key, $val);
	}
	
	// TO DO: better global concept for "config_pages" in order to distinguish between actual pages and configured pages
    // today global value in php can be different from value with same name in Twig if the "pages" parameter is set 
	$twig->addGlobal('config_pages', $actual_pages);
	$twig->addGlobal('configured_pages', config_pages);
	$twig->addGlobal('pagepath', dirname($request['page']));
	$twig->addGlobal('const_path', const_path);
	$twig->addGlobal('mbstring_available', function_exists('mb_get_info'));

	$twig->addFilter( new \Twig\TwigFilter('_', 'twig_concat'));
	$twig->addFilter( new \Twig\TwigFilter('bit', 'twig_bit'));
	$twig->addFilter( new \Twig\TwigFilter('substr', 'twig_substr'));
	$twig->addFilter( new \Twig\TwigFilter('smartdate', 'twig_smartdate'));
	$twig->addFilter( new \Twig\TwigFilter('deficon', 'twig_deficon', array('needs_environment' => true)));
	$twig->addFilter( new \Twig\TwigFilter('md5', 'twig_md5'));

	$twig->addFunction( new \Twig\TwigFunction('uid', 'twig_uid'));
	$twig->addFunction( new \Twig\TwigFunction('once', 'twig_once'));
	$twig->addFunction( new \Twig\TwigFunction('isfile', 'twig_isfile'));
	$twig->addFunction( new \Twig\TwigFunction('isdir', 'twig_isdir'));
	$twig->addFunction( new \Twig\TwigFunction('dir', 'twig_dir'));
	$twig->addFunction( new \Twig\TwigFunction('docu', 'twig_docu'));
	$twig->addFunction( new \Twig\TwigFunction('configmeta', 'twig_configmeta'));
	$twig->addFunction( new \Twig\TwigFunction('lang', 'twig_lang'));
	$twig->addFunction( new \Twig\TwigFunction('read_config', 'twig_read_config'));
	$twig->addFunction( new \Twig\TwigFunction('timezones', 'twig_timezones'));
	$twig->addFunction( new \Twig\TwigFunction('implode', 'twig_implode', array('is_safe' => array('html'))));
	$twig->addFunction( new \Twig\TwigFunction('items', 'twig_items'));
	$twig->addFunction( new \Twig\TwigFunction('asset_exists', 'twig_asset_exists'));

	// init lexer comments
	$lexer = new \Twig\Lexer($twig, array('tag_comment' => array('/**', '*/')));
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
		echo str_repeat(" ", 60).date('H:i, d.m').", v".config_version_full."\n";
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
	echo str_repeat(" ", 60).date('H:i, d.m').", v".config_version_full."\n";
	echo str_repeat("-", 80)."\n\n";
	echo "Error loading Page '<b>".$request['page']."</b>' !\n\n";
	echo "Check config.php -> 'config_pages' for correct Pages/Project configuration\n";
	echo "or try the <a href='index.php'>index</a> page!\n\n";
	echo str_repeat("-", 80)."\n\n";
	echo "\n</pre>";
}
?>