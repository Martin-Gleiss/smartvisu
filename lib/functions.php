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
// L A N G U A G E 
// -----------------------------------------------------------------------------

  /** 
  	* Easy translate function
  	* 
  	* @param expects an array $lang['de'] = array()
  	* @param the text be parsed               	
	*/ 
    function translate($language, $text)
    {
        $ret = $text;
        
        if (config_lang != 'en')
            $ret = str_replace(array_keys($language[config_lang]), array_values($language[config_lang]), $ret);
        
        return $ret;
    }
    
 
// -----------------------------------------------------------------------------
// D A T E 
// -----------------------------------------------------------------------------
       
  /** 
  	* Date and Time 
  	* 
  	* @param a format for a timestamp, based on php date function
  	* @param a timestamp                     	
	*/      
    function smartdate($format = '', $timestamp = '')
    {
        $lang['de'] = array(
            'January' => 'Januar', 'February' => 'Februar', 'March' => 'März', 'April' => 'April', 
            'May' => 'Mai', 'June' => 'Juni', 'July' => 'Juli', 'August' => 'August', 
            'September' => 'September', 'October' => 'Oktober', 'November' => 'November', 'December' => 'Dezmeber',
            
            'Sunday' => 'Sonntag', 'Monday' => 'Montag', 'Tuesday' => 'Dienstag', 'Wednesday' => 'Mittwoch',
            'Thursday' => 'Donnerstag', 'Friday' => 'Freitag', 'Saturday' => 'Samstag',
            
            'Sun' => 'So', 'Mon' => 'Mo', 'Tue' => 'Di', 'Wed' => 'Mi', 'Thu' => 'Do', 'Fri' => 'Fr', 'Sat' => 'Sa');
        
        // allowed formats
        switch ($format)
            {
            case 'date':    $format = (config_lang == 'de' ? 'd.m.y' : 'm/d/y'); break;
            case 'time':    $format = 'H:i'; break;
            case 'short':   $format = (config_lang == 'de' ? 'd.m.y H:i' : 'm/d/y H:i'); break;
            case 'long':    $format = (config_lang == 'de' ? 'd.m.Y H:i:s' : 'm/d/Y H:i:s'); break;
            }                 
        
        if ($timestamp == '')
            $date = date($format);
        else
            $date = date($format, $timestamp);
        
        if ((strpos($format, 'D') !== false or strpos($format, 'l') !== false or strpos($format, 'F') !== false) && config_lang != 'en')
            $date = translate($lang, $date);
        
        return $date;
    }
    
              
// -----------------------------------------------------------------------------
// F I L E
// -----------------------------------------------------------------------------
  
  /** 
  	* Infos about given file
	*/      
    function fileinfo($file)
    {
        $ret = false;
        
        if (is_file(const_path.$file))
        {
            @clearstatcache();
            $ret = @stat(const_path.$file);
        }                       
  
        return $ret;
    }
    
  
  /** 
	* Read a file
	*/      
    function fileread($file)
    {
        $ret = '';
        
        if (is_file(const_path.$file))
        {
            $fp = fopen(const_path.$file, 'r');
		
            if ($fp)
            {
                while (($line = fgets($fp, 4096)) !== false)
                    $ret .= $line;
            }
            
            fclose($fp);
        }
        
        return $ret;
    }
    
    
  /** 
	* Write a file
	*/      
    function filewrite($file, $ret)
    {
        $fp = fopen(const_path.$file, 'w');
		
        if ($fp !== false)
        {
            fwrite($fp, $ret);
            fclose($fp);
        }
        
        return $ret;
    }    

    function lang()
    {
    }
    

?>