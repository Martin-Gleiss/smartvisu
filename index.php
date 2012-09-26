<?
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
    
    // init parameters
    $request = array_merge($_GET, $_POST);
    
    // dedect page and path
    if($request['page'] == '')
       $request['page'] = config_index;
    
     
    if ( is_file(const_path."pages/".config_pages."/".$request['page'].".html")
        or is_file(const_path."pages/base/".$request['page'].".html") )
    {
        // init template engine
        require_once const_path.'lib/Twig/Autoloader.php';
        Twig_Autoloader::register();
        
        $loader = new Twig_Loader_Filesystem(array(const_path."pages/".config_pages, const_path."pages/base", const_path."widgets"));
        
        $parm = array();
        
        if (config_cache)
            $parm['cache'] = dirname(__FILE__).'/temp';
        
        $twig = new Twig_Environment($loader, $parm);
        
    	$lexer = new Twig_Lexer($twig, array(
    		'tag_comment'  => array('/**', '*/'),
    		'tag_block'    => array('{%', '%}'),
    		'tag_variable' => array('{{', '}}'),
    		));
    		
    	$twig->setLexer($lexer);
    
        foreach($request as $key => $val)
        {
            if ($key == "page")
                $val = str_replace('.', '_', $val);
        
            $twig->addGlobal($key, $val);
        }
        
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
                $twig->addGlobal(substr($key, 7), $val);
        }
        
        $twig->addFilter('_', new Twig_Filter_Function('filter_concat'));
        $twig->addFilter('round', new Twig_Filter_Function('filter_round'));
        $twig->addFilter('bit', new Twig_Filter_Function('filter_bit'));
        $twig->addFilter('substr', new Twig_Filter_Function('filter_substr'));
        
        $twig->addFunction('dir', new Twig_Function_Function('fn_dir'));
        $twig->addFunction('once', new Twig_Function_Function('fn_once'));
        $twig->addFunction('docu', new Twig_Function_Function('fn_docu'));    
        
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
    
   
// -----------------------------------------------------------------------------
// Filter extensioins
// -----------------------------------------------------------------------------

    function filter_concat($val, $text = '')
    {
        if ($text != '')
            $val .= "_".$text;
            
        return $val;
    } 
    
    function filter_round($val, $precision = 0)
    {
        return round($val, $precision);
    }

    function filter_bit($val)
    {
        return ($val ? 'true' : 'false');
    }
    
    function filter_substr($val, $start, $end = null)
    {
        if ($end)    
            $ret = substr($val, $start, $end);
        else
            $ret = substr($val, $start);
               
        return $ret;
    } 

 
// -----------------------------------------------------------------------------
// Function extensioins
// -----------------------------------------------------------------------------
   
    function fn_once($name)
    {
        $ret = false;
        
        static $singular = array();
        
        if (!isset($singular[$name]))
            $ret = true;    
        
        $singular[$name] += 1;       
        
        return $ret;
    }
    
 	function fn_dir($dir, $filter = '(.*)')
    {
        $ret = array();
        
        clearstatcache();
        
        // read directory contents
        $dirlist = dir(const_path.$dir);
        	
        while (($item = $dirlist->read()) !== false)
        {
            if ($item != '.' and $item != '..' and$item != '.svn' and substr($item, 0, 1) != '_')
            {
                if (preg_match("#".$filter."$#i", $item, $itemparts) > 0)
                    $ret[] = array("name" => $itemparts[1], "label" => ucfirst($itemparts[1]));
		    }
   		}
   		
		$dirlist->close();
	   
		return $ret;
 		}       
    
  
 	function fn_docu($filename)
    {
        $ret = array();
        $rettmp = array();
        
        $file = file_get_contents($filename);
        
        // Header
        preg_match_all('#.+?@(.+?)\W+(.*)#i', substr($file, 0, strpos($file, '*/') + 2), $header);
        
        // Body 
        preg_match_all('#\/\*\*\r\n(.+?)\*\/.+?\{\% macro(.+?)\%\}#is', strstr($file, '*/'), $widgets);
        
        foreach ($widgets[2] as $no => $macro)
        {
            preg_match_all('#(.+?)\((.+?)\)#i', $macro, $desc);
            $rettmp[$no]['name'] = trim($desc[1][0]);
            $rettmp[$no]['params'] = trim($desc[2][0]);
        }
        
        foreach ($widgets[1] as $no => $docu)
        {
            $rettmp[$no]['desc'] = trim(str_replace('* ', '', substr($docu, 0, strpos($docu, '@'))));
        
            // Header-Tags 
            foreach ($header[1] as $headerno => $headertag)
                $rettmp[$no][$headertag] = trim($header[2][$headerno]);    
            $rettmp[$no]['subpackage'] = substr(strtolower(basename($filename)), 0, -5);
            $rettmp[$no]['command'] = $rettmp[$no]['subpackage'].".".$rettmp[$no]['name'];
            $rettmp[$no]['call'] = $rettmp[$no]['command']."(".$rettmp[$no]['params'].")";
        
            // Widget-Tags
            preg_match_all('#.+?@(.+?)\W+(.*)#i', $docu, $tags);
            
            $param = 0;
            $params = explode(',', $rettmp[$no]['params']);
            
            foreach($tags[1] as $id => $tag)
            {
                if ($tag == 'param')
                {
                    $rettmp[$no]['param'][trim($params[$param++])] = trim($tags[2][$id]);     
                }
                else
                    $rettmp[$no][$tag] = trim($tags[2][$id]);     
            }    
        }
	               
	    foreach ($rettmp as $attributes)
	       $ret[$attributes['subpackage'].'.'.$attributes['name']] = $attributes;
          
        return $ret;
 	}      

?>