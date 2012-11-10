<?
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 
 
// -----------------------------------------------------------------------------
// Date handling
// -----------------------------------------------------------------------------
       
  /** 
  	* Date and Time 
  	* 
  	* @param a format for a timestamp, based on php date function
  	* @param a timestamp                     	
	*/      
    function smartdate($format = '', $timestamp = '')
    {
        $de_D = array('Sun' => 'So', 'Mon' => 'Mo', 'Tue' => 'Di', 'Wed' => 'Mi', 'Thu' => 'Do', 'Fri' => 'Fr', 'Sat' => 'Sa');
        $de_l = array('Sunday' => 'Sonntag', 'Monday' => 'Montag', 'Tuesday' => 'Dienstag', 'Wednesday' => 'Mittwoch',
            'Thursday' => 'Donnerstag', 'Friday' => 'Freitag', 'Saturday' => 'Samstag');
        $de_F = array('January' => 'Januar', 'February' => 'Februar', 'March' => 'März', 'April' => 'April', 
            'May' => 'Mai', 'June' => 'Juni', 'July' => 'Juli', 'August' => 'August', 
            'September' => 'September', 'October' => 'Oktober', 'November' => 'November', 'December' => 'Dezmeber');
        
        // allowd formats
        switch ($format)
            {
            case 'date':    $format = (config_lang == 'de' ? 'd.m.y' : 'm/d/y'); break;
            case 'time':    $format = 'H:i'; break;
            case 'short':   $format = (config_lang == 'de' ? 'd.m.y H:i' : 'm/d/y H:i'); break;
            case 'long':    $format = (config_lang == 'de' ? 'd.m.Y H:i:s' : 'm/d/Y H:i:s'); break;
            }                 
        
        $date = date($format, $timestamp);
        
        if (strpos($format, 'D') !== false && config_lang == 'de')
            $date = str_replace(array_keys($de_D), array_values($de_D), $date);
        
        if (strpos($format, 'l') !== false && config_lang == 'de')
            $date = str_replace(array_keys($de_l), array_values($de_l), $date);
        
        if (strpos($format, 'F') !== false && config_lang == 'de')
            $date = str_replace(array_keys($de_F), array_values($de_F), $date);
        
        return $date;
    }
    
              
// -----------------------------------------------------------------------------
// File handling
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


?>