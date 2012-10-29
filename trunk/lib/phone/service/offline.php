<?
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */


require_once '../../../config.php';
require_once const_path_system.'phone/phone.php';
    

/** 
 * This class reads the phonelist of an auerswald phonesystem
 */   
class phone_offline extends phone
{
    /** 
    * Check if the cache-file exists
    */      
    public function run()
    {
        $this->data[] = array (
            "pos" => "1", 
            "date" => "01.10.2012", 
            "time" => "12:00:00", 
            "number" => "0931".rand(1000000, 9999999), 
            "name" => "Gleiß Martin");
    
        $this->data[] = array (
            "pos" => "1", 
            "date" => "01.10.2012", 
            "time" => "13:00:00", 
            "number" => "0931".rand(1000000, 9999999), 
            "name" => "");       
            
        $this->data[] = array (
            "pos" => "1", 
            "date" => "01.10.2012", 
            "time" => "14:00:00", 
            "number" => "0931".rand(1000000, 9999999), 
            "name" => "Gleiß Martin");       
    }
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new phone_offline(array_merge($_GET, $_POST));
echo $service->json();

?>