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
    require_once '../../config.php';
     
    // init parameters
    $request = array_merge($_GET, $_POST);
    
    // read config
    $lines = file(const_path.'config.php');
    
    foreach($lines as $line)
    {
        if (preg_match("#\(\'config_(.+?)\',[[:space:]]+(\'?)(.+?)(\'?)\);#i", $line, $match) > 0)
        {
            if ($match[3] == "'" and $match[4] == "")
            {
                $match[3] = "";
                $match[4] = "'";
            }
            
            if (isset($request[$match[1]]))
                $config .= str_replace($match[2].$match[3].$match[4], $match[2].str_replace("'", "", $request[$match[1]]).$match[4], $line);    
            else
                $config .= $line;
        }
        else
            $config .= $line;
    }
    
    // write config
    if (($fp = fopen(const_path.'config.php', 'w')) !== false)
    	{
    	fwrite($fp, $config);
    	fclose($fp);
    	}
    
    echo "true";
    
?>