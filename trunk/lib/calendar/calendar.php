<?
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 
 
require_once const_path_system.'service.php';
 
 
/** 
* This class is the base class of all services
*/ 
class calendar extends service
{

  /** 
	* initalisation of some parameters
	*/      
    public function init($request)
    {
        $this->debug = ($request['debug'] == 1);
        
        $this->server = config_calendar_server;
        $this->user = config_calendar_user;
        $this->pass = config_calendar_pass;
    }
          
  /** 
	* prepare the data
	*/      
    public function prepare()
    {
        /*
        foreach($this->data as $id => $ds)
        {
            $ret[] = $ds;
        }
        
        $this->data = $ret;
        */
    }

}

?>