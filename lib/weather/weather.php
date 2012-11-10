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
* This class is the base of all weather services
*/ 
class weather extends service
{
    var $location = '';
      
  /** 
	* initalisation of some parameters
	*/      
    public function init($request)
    {
        parent::init($request);
        
        $this->location = $request['location']; 
    }

  /** 
	* prepare the data
	*/      
    public function prepare()
    {
        foreach($this->data['forecast'] as $id => $ds)
        {
            $this->data['forecast'][$id]['date'] = smartdate('D', strtotime($ds['date']));   
        }
    }

}

?>