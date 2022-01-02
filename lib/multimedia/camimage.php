<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Wolfram v. Hülsen
 * @copyright   2021 
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

require_once '../../lib/includes.php';
require_once const_path_system.'service.php';

class mm_camimage extends service 
{
	
	public function init($request){
		parent::init($request);
		 if(isset($request['url'])){
				// url format is "url=http://admin:xxxxxxxx@192.168.yyy.yyy/record/current.jpg&_=1640270894254" or
				// "url=http://IP-ADRESSE/cgi-bin/api.cgi?cmd=Snap&channel=0&rs=wuuPhkmUCeI9WG7C&user=user&password=password&_=1640270894254"
				$this->url = substr($_SERVER['QUERY_STRING'],4, (strpos($_SERVER['QUERY_STRING'], '&_=') >0 ? strpos($_SERVER['QUERY_STRING'], '&_=')-4 : null));
		 }
	}
	
	public function run(){	
		if(isset($this->url) && $this->url !=''){ 
			readfile($this->url);
			if (substr($this->errorMessage, 0, 8) != 'readfile')
				flush();
			else 
				$this->error('multimedia.image','Read request to '.$this->url.' failed with message: '. substr(strrchr($this->errorMessage, ':'), 2));
		}
		else
			$this->error('multimedia.image','image URL is missing in püarameter set');
	}
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new mm_camimage(array_merge($_GET, $_POST));
$result = $service->json();
if (strpos($result,'multimedia.image') != -1)
	echo($result);
?>