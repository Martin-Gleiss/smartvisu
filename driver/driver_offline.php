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
require_once '../config.php';
    
   
/** 
 * This class is an offline driver as a replacement for knx-bus
 */   
class driver_offline
{
    var $gad        = '';
    var $val        = '';
   
    var $filename   = ''; 
    var $fp         = null;
   
    
  /** 
	* constructor
	*/ 
    public function __construct($request)
	{
        $this->gad = explode(",", $request['gad']);
	    $this->val = $request['val'];
	    $this->filename = const_path.'temp/offline_'.config_pages.'.var';
    }


  /** 
	* Read all gads from the file
	*/      
    private function fileread()
    {
        $ret = array();
        
        if (!is_file($this->filename))
            touch($this->filename);
        
        $this->fp = fopen($this->filename, 'r+');
		
        if ($this->fp)
        {
            while (($line = fgets($this->fp, 4096)) !== false)
            {
                list($gad, $val) = explode('=', $line);
                $ret[trim($gad)] = trim($val);
            }
        }
 
        return $ret;
    }
    
    
  /** 
	* Store all gads in the file
	*/      
    private function filewrite($data)
    {
        $ret = '';
        
        if ($this->fp)
        {
            fseek($this->fp, 0, SEEK_SET);
            
            foreach($data as $gad => $val)
            {
                if ($gad != '')
                    $line .= $gad.' = '.$val."\r\n";
            }
                
            fwrite($this->fp, $line, strlen($line));
            fclose($this->fp);
        }
        
        return $ret;
    }
    
    
  /** 
	* get a json formated response
	*/ 
    public function json()
	{
        $ret = array();
	   
        $data = $this->fileread();
        
        // write if a value is given
        if ($this->val != '')
        {
            foreach ($this->gad as $gad)
                $data[$gad] = $this->val;
            
            $this->filewrite($data);    
        }
        
        foreach ($this->gad as $gad)
            $ret[$gad] = $data[$gad];
        
        return json_encode($ret);
    }
}


// -----------------------------------------------------------------------------
// call the driver
// -----------------------------------------------------------------------------

$driver = new driver_offline(array_merge($_GET, $_POST));
echo $driver->json();

?>