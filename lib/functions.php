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