<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 

// -----------------------------------------------------------------------------
// Filters for Twig
// -----------------------------------------------------------------------------
 
 
    function twig_concat($val, $text = '')
    {
        if ($text != '')
            $val .= "_".$text;
            
        return $val;
    } 
    
    function twig_round($val, $precision = 0)
    {
        return round($val, $precision);
    }

    function twig_bit($val)
    {
        return ($val ? 'true' : 'false');
    }
    
    function twig_substr($val, $start, $end = null)
    {
        if ($end)    
            $ret = substr($val, $start, $end);
        else
            $ret = substr($val, $start);
               
        return $ret;
    } 
    
    function twig_smartdate($val, $format = 'date')
    {
        return smartdate($format, $val);
    }
    
 
// -----------------------------------------------------------------------------
// Functions for Twig
// -----------------------------------------------------------------------------
       

    function twig_once($name)
    {
        $ret = false;
        
        static $singular = array();
        
        if (!isset($singular[$name]))
            $ret = true;    
        
        $singular[$name] += 1;       
        
        return $ret;
    }
    
 	function twig_dir($dir, $filter = '(.*)')
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
                    $ret[] = array("file" => $itemparts[0], "name" => $itemparts[1], "label" => ucfirst($itemparts[1]));
		    }
   		}
   		
		$dirlist->close();
	   
		return $ret;
 		}       
    
  
 	function twig_docu($filename)
    {
        $ret = array();
        $rettmp = array();
        
        $file = file_get_contents($filename);
        
        // Header
        preg_match_all('#.+?@(.+?)\W+(.*)#i', substr($file, 0, strpos($file, '*/') + 2), $header);
        
        // Body 
        preg_match_all('#\/\*\*[\r\n](.+?)\*\/.+?\{\% macro(.+?)\%\}#is', strstr($file, '*/'), $widgets);
        
        if (count($widgets[2]) > 0)
        {
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
                foreach($header[1] as $headerno => $headertag)
                {
                    if ( !($headertag == "author" and trim($header[2][$headerno]) == "Martin Gleiß") )
                        $ret[$headertag] = trim($header[2][$headerno]);
                }
                
                $rettmp[$no]['subpackage'] = substr(mb_strtolower(basename($filename), 'UTF-8'), 0, -5);
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
        }
        else
        {
            foreach($header[1] as $headerno => $headertag)
            {
                if ( !($headertag == "author" and trim($header[2][$headerno]) == "Martin Gleiß") )
                    $ret[$headertag] = trim($header[2][$headerno]);
            }
        }
         
        return $ret;
 	}      

?>