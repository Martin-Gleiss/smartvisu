<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL [http://www.gnu.de]
 * ----------------------------------------------------------------------------- 
 */


// get config-variables 
require_once '../lib/includes.php';
    
   
/** 
 * This class is an offline driver as a replacement for knx-bus
 */   
class driver_linknx
{
    var $item        = '';
    var $val        = '';
    
    var $fp         = null;
   
   
  /** 
	* constructor
	*/ 
    public function __construct($request)
	{
        $this->item = explode(",", $request['item']);
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
           $ret = "$errstr ($errno)\n";
           
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
            $req = "<read><objects>";
            foreach ($this->item as $item)
                $req .= "<object id='".$item."' />";
            $req .= "</objects></read>";
        
            fwrite($this->fp, $req."\n\4");
       
            while ($this->fp && !feof($this->fp))
                {
                $res .= fgets($this->fp, 128);
                $stc = fgetc($this->fp);
                
                if ($stc == "\4")
                    {
                    $xml = simplexml_load_string($res);
                    
                    if ((string)$xml->attributes()->status == 'success')
                    {
                        foreach($xml->objects->object as $obj)
                        {
                            $item = (string)$obj->attributes()->id;
                            $val = (string)$obj->attributes()->value;
                            
                            // Check if $res is binary
                            if (strlen($val) == 2)
                                $val = str_replace("on", 1, $val);
							
                            if (strlen($val) == 3)
                                $val = str_replace("off", 0, $val);

							if (is_numeric($val))
								$ret[$item] = (float)$val;
                        	else
								$ret[$item] = $val;
                        }
                    }
                    else
                        $ret = (string)$xml; 
                        
                    break;
                    }
                    
                $res .= $stc;
                }
            }
        
        return $ret;
    }
    
    
  /** 
	* Write to bus
	*/      
    public function write()
    {
        $res = '';
        
        if ($this->fp)
        {
            fwrite($this->fp, "<write><object id='".$this->item[0]."' value='".$this->val."'/></write>\n\4");
            
            $cnt = 0;
            while ($cnt < 4 && $this->fp && !feof($this->fp))
            {
                $res .= fgets($this->fp, 128);
                $stc = fgetc($this->fp);
                
                if ($stc == "\4")
                    {
                    if (preg_match("#<write status='success'#i", $res))
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
	* get a json formatted response
	*/ 
    public function json()
	{
        $ret = array();
	   
	    // open
        $ret = $this->open();
        
		if ($this->fp) 
        {
            $ret = $this->read();
            
            // write if a value is given
            if ($this->val != '')
                $ret = $this->write();
        }
        
        $this->close();
        
        return json_encode($ret);
    }
}


// -----------------------------------------------------------------------------
// call the driver
// -----------------------------------------------------------------------------

$driver = new driver_linknx(array_merge($_GET, $_POST));
echo $driver->json();

?>
