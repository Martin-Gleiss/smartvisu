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
class driver_linknx extends driver_base
	{
    var $fp         = null;
    

    public function __construct($address = '127.0.0.1', $port = '1028')
	{
	    parent::__construct($address, $port);
    }

    
  /** 
	* About this dirver
	*/      
    public function info()
    {
        $ret = 'smartVISU Linknx-Treiber: Dieser Treiber baut eine Verbinung zum Linknx-Server auf und verwendet diesen
            um Gruppentelegramme zu senden und zu empfangen.';
        
        return $ret;
    }
    
            
  /** 
	* Open the connection
	*/      
    public function open()
    {
        $ret = '';
        
        $this->fp = fsockopen($this->address, $this->port, $errno, $errstr, 3);
		
		if (!$this->fp) 
           $ret = "$errno ($errstr)\n";
           
        return $ret;
    }
    
    
  /** 
	* Read from bus
	*/      
    public function read($gad)
    {
        $ret = '';
        
        if ($this->fp)
            {
            fwrite($this->fp, "<read><object id='$gad'/></read>\n\4");
            
            $cnt = 0;
            while ($cnt < 4 && $this->fp && !feof($this->fp))
                {
                $ret .= fgets($this->fp, 128);
                $stc = fgetc($this->fp);
                
                if ($stc == "\4")
                    {
                    if (substr($ret, 0, 30) == "<read status='success'></read>")
                        $ret = '';
                    if (preg_match("#<read status='success'>([^<]+)</read>#i", $ret, $regs))
                        $ret = $regs[1];
                        
                    break;
                    }
                    
                $ret .= $stc;
                $cnt++;
                }
            
            // Check if $respons is binary
            if ($ret == "on")
                $ret = 1;
            elseif ($ret == "off")
                $ret = 0;
            }
        
        return $ret;
    }
    
    
  /** 
	* Wirte to bus
	*/      
    public function write($gad, $val)
    {
        $ret = '';
        
        if ($this->fp)
        {
            fwrite($this->fp, "<write><object id='$gad' value='$val'/></write>\n\4");
            
            $cnt = 0;
            while ($cnt < 4 && $this->fp && !feof($this->fp))
            {
                $ret .= fgets($this->fp, 128);
                $stc = fgetc($this->fp);
                
                if ($stc == "\4")
                    {
                    if (preg_match("#<write status='success'#i", $ret))
                        return 1;
                    break;
                    }
                
                $ret .= $stc;
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
}

?>