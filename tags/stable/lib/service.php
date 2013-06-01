<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 
 
require_once const_path_system.'functions.php';


/** 
* This class is the base class of all services
*/ 
class service
{
    var $debug = false;
    
    var $server = '';
    var $port = 0;
    var $url = '';
    var $user = '';
    var $pass = '';
    
    var $data = array();
    var $error = array();
    
    
  /** 
	* constructor
	*/ 
    public function __construct($request)
	{
	    $this->init($request);
    }

  /** 
	* initialization of some parameters
	*/      
    public function init($request)
    {
        $this->debug = ($request['debug'] == 1);
        
        $this->server = $request['server'];
        $this->port = (int)$request['port'];
        $this->url = $request['url'];
        $this->user = $request['user'];
        $this->pass = $request['pass'];
    }
    
  /** 
	* sets an errormassage
	*/      
    public function error($title, $message)
    {
        $this->error[] = array('title' => $title, 'text' => $message);
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
        foreach($this->data as $id => $ds)
        {
            true;
        }
    }

  /** 
	* get a json formatted response
	*/ 
    public function json()
	{
        $ret = "";
	   
        if (count($this->error) == 0)
            $this->run();
        
        if (count($this->error) == 0)
        {
            $this->prepare();
            $ret = $this->data; 
        }
        else
        {
            header("HTTP/1.0 601 smartVISU Service Error");
            $ret = $this->error;
        }

        $this->debug($ret, "data");

        return json_encode($ret);
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
