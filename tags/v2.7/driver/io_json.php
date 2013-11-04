<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Frank Berlenz
 * @copyright   2012
 * @license     GPL [http://www.gnu.de]
 * ----------------------------------------------------------------------------- 
 */


// get config-variables 
require_once '../lib/includes.php';
    
   
/** 
 * This class is an offline driver as a replacement for knx-bus
 */   
class driver_json
{
    var $item        = '';
    var $val        = '';
    
    var $fp         = null;
   
   
  /** 
	* constructor
	*/ 
    public function __construct($request)
	{
        $this->item = $request['item'];
	    $this->val = $request['val'];
    }


  /** 
	* Open the connection
	*/      
    public function open()
    {
        $ret = '';
        
        $this->fp = fsockopen(config_driver_address, config_driver_port, $errno, $errstr, 3);
		
		if (!$this->fp) 
           $ret = "$errno ($errstr)\n";
           
        return $ret;
    }
    
    
  /** 
	* Read from bus
	*/      
    public function read()
    {
        $res = '';
        
        if ($this->fp)
        {
          fwrite($this->fp, "{".$this->item."}\n\4");
       
          while ($this->fp && !feof($this->fp))
          {
            $res .= fgets($this->fp, 128);
            $stc = fgetc($this->fp);
                
            if ($stc == "\4")
              return $res;

            $res .= $stc;
          }
        }
        
        return $res;
    }
    
    
  /** 
	* Write to bus
	*/      
    public function write()
    {
        $res = '';
        
        if ($this->fp)
        {
            fwrite($this->fp, "{".$this->item.":".$this->val."}\n");
            
            $cnt = 0;
            while ($cnt < 4 && $this->fp && !feof($this->fp))
            {
                $res .= fgets($this->fp, 128);
                $stc = fgetc($this->fp);
                
                if ($stc == "\4")
                {
                    if ($res=="1")
                        $ret[$this->item[0]] = $this->val;
                        
                    break;
                }
                
                $res .= $stc;
                $cnt++;
            }
        }
        
        return $ret;
    }    


  /** 
	* Close connection
	*/      
    public function close()
    {
        $ret = '';
        
        if ($this->fp)
        {
            fclose($this->fp);
        }
        
        return $ret;
    }
    
    
  /** 
	* synchronize data from / to json service
	*/ 
    public function sync()
	{
        $ret = array();
	   
	    // open
        $ret = $this->open();
        
		if ($this->fp) 
        {
            // write if a value is given
            if ($this->val != '')
                $ret = $this->write();
            else
                $ret = $this->read();
        }
        
        $this->close();
        
        return $ret;
    }
}


// -----------------------------------------------------------------------------
// call the driver
// -----------------------------------------------------------------------------

$driver = new driver_json(array_merge($_GET, $_POST));
echo $driver->sync();

?>
