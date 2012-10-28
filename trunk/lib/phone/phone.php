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
	* prepare the data
	*/      
    public function prepare()
    {
        foreach($this->data as $id => $ds)
        {
            if ($ds['number'] != '' and is_file(const_path.'pics/phone/'.$ds['number'].'.jpg'))
                $this->data[$id]['pic'] = $ds['number'].'.jpg';
            else
                $this->data[$id]['pic'] = '0.jpg';
        }
    }

}

?>