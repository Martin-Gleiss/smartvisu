<?
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
* This driver stores all data in a file
*/ 
class driver_offline extends driver_base
	{
    var $fp         = null;
    var $data       = array();
    
    
    public function __construct($address = '', $port = '')
	{
	    parent::__construct('temp/offline_'.config_pages.'.var', $port);
    }
    
        
  /** 
	* About this dirver
	*/      
    public function info()
    {
        $ret = 'smartVISU Offline-Treiber: Dieser Treiber speichert die Gruppenadressen lokal in eine Datei,
            es wird keine Verbinung zum Bus aufgebaut.';
        
        return $ret;
    }
    
            
  /** 
	* Open the connection
	*/      
    public function open()
    {
        $ret = '';
        
        if (!is_file($this->address))
            touch($this->address);
        
        $this->fp = fopen($this->address, 'r+');
		
        if ($this->fp)
        {
            while (($line = fgets($this->fp, 4096)) !== false)
            {
                list($gad, $val) = explode('=', $line);
                $this->data[trim($gad)] = trim($val);
            }
        }
 
        return $ret;
    }
    
    
  /** 
	* Read from bus
	*/      
    public function read($gad)
    {
        $ret = $this->data[$gad];
        
        $this->data[$gad] = $ret;
        
        return $ret;
    }
    
    
  /** 
	* Wirte to bus
	*/      
    public function write($gad, $val)
    {
        $ret = '';
        
        $this->data[$gad] = $val;
        
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
            fseek($this->fp, 0, SEEK_SET);
            
            foreach($this->data as $gad => $val)
            {
                if ($gad != '')
                    $line .= $gad.' = '.$val."\r\n";
            }
                
            fwrite($this->fp, $line, strlen($line));
            fclose($this->fp);
        }
        
        return $ret;
    }
}

?>