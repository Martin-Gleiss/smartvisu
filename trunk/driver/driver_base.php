<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 
 
/** 
* This class is the base-class of all drivers
*/ 
class driver_base
	{
    var $address    = '';
    var $port       = '';
    
    
    public function __construct($address = '', $port = '')
		{
        $this->address = $address;
        $this->port = $port;
        }
        
  
  /** 
	* About this dirver
	*/      
    public function info()
    {
        $ret = 'smartVISU Basistreiber';
        
        return $ret;
    }
    
          
  /** 
	* Open the connection
	*/      
    public function open()
    {
        $ret = '';
        
        return $ret;
    }
    
    
  /** 
	* Read from bus
	*/      
    public function read($gad)
        {
        $ret = '';
        
        return $ret;
        }
    
    
  /** 
	* Write to bus
	*/      
    public function write($gad, $val)
        {
        $ret = '';
        
        return $ret;
        }    


  /** 
	* Close connection
	*/      
    public function close()
        {
        $ret = '';
        
        return $ret;
        }
	}

?>