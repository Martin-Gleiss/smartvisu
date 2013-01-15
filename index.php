<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 
 
    // get config-variables 
    require_once 'config.php';
    require_once const_path_system.'functions.php';
    require_once const_path_system.'functions_twig.php';
    
    // init parameters
    $request = array_merge($_GET, $_POST);
    
    // dedect page and path
    if($request['page'] == '')
       $request['page'] = config_index;
    
    if ( is_file(const_path."pages/".config_pages."/".$request['page'].".html")
        or is_file(const_path."apps/".$request['page'].".html")
        or is_file(const_path."pages/base/".$request['page'].".html") )
    {
        // init template engine
        require_once const_path.'vendor/Twig/Autoloader.php';
        Twig_Autoloader::register();
    
        $loader = new Twig_Loader_Filesystem(const_path.'pages/'.config_pages);
        
        if (dirname($request['page']) != '.')
            $loader->addPath(const_path.'pages/'.config_pages.'/'.dirname($request['page']));
        
        $loader->addPath(const_path.'apps');
        $loader->addPath(const_path.'pages/base'); 
        
        // add dir if is not directly choosen
        if (config_driver == 'smarthome.py' and config_pages != 'smarthome' and is_dir(const_path."pages/smarthome"))
            $loader->addPath(const_path.'pages/smarthome');
        
        $loader->addPath(const_path.'widgets');
        
        
        // get environment
        $twig = new Twig_Environment($loader);
        
        if (config_cache)
            $twig->setCache(dirname(__FILE__).'/temp');
        
        
        // get lexer
    	$lexer = new Twig_Lexer($twig, array(
    		'tag_comment'  => array('/**', '*/'),
    		'tag_block'    => array('{%', '%}'),
    		'tag_variable' => array('{{', '}}'),
    		));
    		
    	$twig->setLexer($lexer);
    
        foreach($request as $key => $val)
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
        else
        {
            $twig->addGlobal('icon1', 'icons/or/');
            $twig->addGlobal('icon0', 'icons/ws/');
        }
        
        foreach(get_defined_constants() as $key => $val)
        {
            if (substr($key, 0, 6) == 'config')
                $twig->addGlobal($key, $val);
        }
        
        $twig->addFilter('_',           new Twig_Filter_Function('twig_concat'));
        $twig->addFilter('round',       new Twig_Filter_Function('twig_round'));
        $twig->addFilter('bit',         new Twig_Filter_Function('twig_bit'));
        $twig->addFilter('substr',      new Twig_Filter_Function('twig_substr'));
        $twig->addFilter('smartdate',   new Twig_Filter_Function('twig_smartdate'));
        
        $twig->addFunction('dir',       new Twig_Function_Function('twig_dir'));
        $twig->addFunction('once',      new Twig_Function_Function('twig_once'));
        $twig->addFunction('docu',      new Twig_Function_Function('twig_docu'));    
        $twig->addFunction('array2script',  new Twig_Function_Function('twig_array2script', array('is_safe' => array('html'))));
        
        // load template
        try
        {
            $template = $twig->loadTemplate($request['page'].'.html');
            echo $template->render(array());
        }
        catch (Exception $e)
        {
            echo "<pre>\n";
            echo str_repeat(" ", 69)."smart[VISU]\n";
            echo str_repeat(" ", 62).date('H:i, d.m').", v".config_version."\n";
            echo str_repeat("-", 80)."\n\n";
            echo "Error accoured in twig-template engine!\n\n";
            echo "error: ".$e->getRawMessage()."\n";
            echo "file:  ".$e->getTemplateFile()."\n";
            echo "line:  ".$e->getTemplateLine()."\n\n";
            echo str_repeat("-", 80)."\n\n";
            echo "\n</pre>";
        }
    }
    else
        header("HTTP/1.0 404 Not Found");

?>