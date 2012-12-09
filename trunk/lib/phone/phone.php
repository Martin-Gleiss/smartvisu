<?php
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
* This class is the base class of all phone systems
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
                $ds['date'] = smartdate('short', strtotime($ds['date'])); 
                
                if ($ds['number'] != '' and is_file(const_path.'pics/phone/'.$ds['number'].'.jpg'))
                    $ds['pic'] = $ds['number'].'.jpg';
                else
                    $ds['pic'] = '0.jpg'; 
                	
                
                $ds['dirpic'] = 'dir.png';
                
                if($ds['dir'] > 0)
                    $ds['dirpic'] = 'dir_incoming.png';
                
                if($ds['dir'] < 0)
                    $ds['dirpic'] = 'dir_outgoing.png';
                
                $ret[] = $ds;
            }
        }
        $this->data = $ret;
    }

}

?>