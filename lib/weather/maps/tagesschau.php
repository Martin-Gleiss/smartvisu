<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


require_once '../../../lib/includes.php';
require_once const_path_system.'service.php';
require_once const_path_system.'class_cache.php';


/**
 * This class generates a weather
 */
class tagesschau extends service
{
	var $url = '';
	var $limit = 10;

	/**
	 * initialization of some parameters
	 */
	public function init($request)
	{
		parent::init($request);

		//$this->url = 'www.tagesschau.de/api2u/wetter/deutschland/wettervorhersage-deutschland-100.json';
		$this->cache_duration_minutes = 60*60;
		
		if (isset($request['mode']))
			$this->mode = $request['mode'];
			
		if (isset($request['limit']) && (int)$request['limit'] > 0)
			$this->limit = (int)$request['limit'];
	}

	/**
	 * retrieve the content
	 */
	public function run()
	{
		// api call 
		$cache = new class_cache('tagesschauwetter_D.json');

		if ($cache->hit($this->cache_duration_minutes))
			$content = $cache->read();
		else
		{
			$loadError = '';
			$url = 'https://www.tagesschau.de/api2u/wetter/deutschland/wettervorhersage-deutschland-100.json';
			
			$content = file_get_contents($url);
			if (substr($this->errorMessage, 0, 17) != 'file_get_contents')
				$cache->write($content);
			else
				$loadError = substr(strrchr($this->errorMessage, ':'), 2);
		}
		
		$parsed_json = json_decode($content, true);
		$this->debug($parsed_json);

		if ($parsed_json) {
			$this->data['forecast_D'] = $parsed_json['content'][0]['value'].$parsed_json['content'][2]['value'];
			$this->data['clouds'] = $parsed_json['teaserImage']['imageVariants']['16x9-640'];

			$headlines = array_column($parsed_json['content'], 'value');
			$images = array_column($parsed_json['content'], 'gallery');
			
			if (array_search('<h2>Temperaturen Nacht</h2>', $headlines) > array_search('<h2>Temperaturen Tag</h2>', $headlines)){
				$this->data['day'] = $images[0][0]['imageVariants']['16x9-640'];
				$this->data['night'] = $images[1][0]['imageVariants']['16x9-640'];
			} else {
				$this->data['day'] = $images[1][0]['imageVariants']['16x9-640'];
				$this->data['night'] = $images[0][0]['imageVariants']['16x9-640'];
			}
			
			$this->data['wind'] = $images[2][0]['imageVariants']['16x9-640'];
			$this->data['forecast'] = $images[3][0]['imageVariants']['16x9-640'];

			$cache = new class_cache('tagesschauwetter_EU.json');

			if ($cache->hit($this->cache_duration_minutes))
				$content = $cache->read();
			else
			{
				$url = 'https://www.tagesschau.de/api2u/wetter/deutschland/wettervorhersage-europa-100.json';
				
				$content = file_get_contents($url);
				if (substr($this->errorMessage, 0, 17) != 'file_get_contents')
					$cache->write($content);
			}
			
			$parsed_json = json_decode($content, true);
			$this->debug($parsed_json);
			
			$this->data['forecast_EU'] = $parsed_json['content'][0]['value'];
			$images = array_column($parsed_json['content'], 'gallery');
			$this->data['europe'] = $images[0][0]['imageVariants']['16x9-640'];

			// send image selected by request parameter "mode" to e.g. multimedia.image
			
			if(isset($this->mode) && $this->mode !=''){ 
				readfile($this->data[$this->mode]);
				if (substr($this->errorMessage, 0, 8) != 'readfile')
					flush();
			}
		}
		else {
			if ($loadError != '')
				$add = ' with message: <br>'.$loadError;
			else
				$add = ': <br>'.$this->errorMessage;
							
			$this->error('Weather: Tagesschau', 'Read request failed'.$add );
		}
	}
}



// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new tagesschau(array_merge($_GET, $_POST));
echo $service->json();

?>
