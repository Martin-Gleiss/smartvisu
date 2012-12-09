<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 
 
require_once("driver_base.php");

/** 
* This driver generates random values
*/ 
class driver_debug extends driver_base
	{
    
        
  /** 
	* About this dirver
	*/      
    public function info()
    {
        $ret = 'smartVISU Debug-Treiber: Generiert Zufallszahlen, wenn ein Lesszugriff auf den Bus erfolgt.';
        
        return $ret;
    }
           
    
  /** 
	* Read from bus
	*/      
    public function read($gad)
    {
        $ret = rand(-32, 128);
        
        if ($ret < 0)
            $ret = 0;
    
        return $ret;
    }
    
}

?>