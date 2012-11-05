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
        for($i = 9; $i > 0; $i--)
        {
            $this->data[] = array (
                'pos' => $i, 
                'dir' => rand(-1, 1),
                'date' => '01.10.2012 1'.$i.':'.rand(1,59).':00', 
                'number' => '0931'.rand(1000000, 9999999), 
                'name' => 'Gleiss Martin',
                'duration' => '00:00:'.rand(10,50)
            );
        }
            
        $this->data[] = array (
            'pos' => '2', 
            'dir' => '1',
            'date' => '01.10.2012 10:00:00', 
            'number' => '08003007707', 
            'name' => '',
            'duration' => '00:00:10'
        );         
    }
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new phone_offline(array_merge($_GET, $_POST));
echo $service->json();

?>