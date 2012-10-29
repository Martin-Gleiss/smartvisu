<?
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 
 
/** 
* This class is the base class of all services
*/ 
class service
{
    var $debug = false;
    
    var $server = '';
    var $user = '';
    var $pass = '';
    
    var $data = array();
    
    
  /** 
	* constructor
	*/ 
    public function __construct($request)
	{
	    $this->init($request);
    }

  /** 
	* initalisation of some parameters
	*/      
    public function init($request)
    {
        $this->debug = ($request['debug'] == 1);
        
        $this->server = $request['server'];
        $this->user = $request['user'];
        $this->pass = $request['pass'];
    }
    
  /** 
	* retrieve the content
	*/      
    public function run()
    {
        // get the content and store
        $this->data = array();
    }
      
  /** 
	* prepare the data
	*/      
    public function prepare()
    {
        foreach($this->data as $ds)
        {
            true;
        }
    }

  /** 
	* get a json formated response
	*/ 
    public function json()
	{
        $ret = "";
	   
        $this->run();
        $this->prepare();
        
        return json_encode($this->data); 
    }
       
  /** 
	* print some debug information if needed
	*/      
    public function debug($text, $title = "")
    {
        if ($this->debug)
        {   
            echo "<pre>\n";
            if ($title)
            {
                echo $title."\n";
                echo str_repeat("-", 80)."\n";
            }
            print_r($text);
            echo "\n</pre>";
        }
    }
}

?>