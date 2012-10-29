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
class phone extends service
{

  /** 
	* initalisation of some parameters
	*/      
    public function init($request)
    {
        $this->debug = ($request['debug'] == 1);
        
        $this->server = config_phone_server;
        $this->user = config_phone_user;
        $this->pass = config_phone_pass;
    }
          
  /** 
	* prepare the data
	*/      
    public function prepare()
    {
        foreach($this->data as $id => $ds)
        {
            if ($ds['number'] != '' or $ds['name'] != '')
            {
                $ds['time'] = date('H:i', strtotime($ds['time'])); 
                
                if ($ds['number'] != '' and is_file(const_path.'pics/phone/'.$ds['number'].'.jpg'))
                    $ds['pic'] = $ds['number'].'.jpg';
                else
                    $ds['pic'] = '0.jpg'; 
                	
                $ret[] = $ds;
            }
        }
        $this->data = $ret;
    }

}

?>