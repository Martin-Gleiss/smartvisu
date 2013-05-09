<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */


require_once '../../config.php';
require_once const_path_system.'service.php';
require_once const_path_system.'class_cache.php';
    

/** 
 * This class generates a weather
 */   
class rss extends service
{
	var $url = '';
	
  /**
	* initialization of some parameters
	*/
	public function init($request)
	{
		parent::init($request);

		$this->url = $request['url'];
	}
	
  /** 
	* retrieve the content
	*/     
    public function run()
    {
        // api call 
        $cache = new class_cache(strtolower($this->url).'.rss');
        
        if ($cache->hit())
            $xml = simplexml_load_string($cache->read());
        else
            $xml = simplexml_load_string($cache->write(file_get_contents($this->url)));
          
        if($xml)
        {
			
			print_r($xml);
			
            //today
            $this->data['city']       = (string)$xml->location->name;
            
            
        }
        else
            $this->error('RSS', 'Read request failed \''.$this->url.'\'');
     
    }

}
   

// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new rss(array_merge($_GET, $_POST));
echo $service->json();

?>
