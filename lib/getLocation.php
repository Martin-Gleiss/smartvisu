<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Wolfram v. Hülsen
 * @copyright   2012 - 2024
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 *
 * read city name for the given coordinates from geonames.org
 */

function getLocation($lat, $lon) {
	$location = 'lat='.$lat.'&lng='.$lon;

	$cache = new class_cache('geonames.org_'.preg_replace(array('/=/','/&/'),'',$location).'.json');
	if ($cache->hit(7*24*60))		//cache duration of one week should be sufficient for city names 
		$content = $cache->read();
	else {
		$url = 'http://api.geonames.org/findNearbyPlaceNameJSON?'.$location.'&radius=2&cities=cities500&username=smartvisu_location';
		
		$content = file_get_contents($url,false);
		if ($content === false) 
			$content = '';
		else
			$cache->write($content);		
	}

	$parsed_json = json_decode($content);

	$ret = $parsed_json->{'geonames'}['0']->{'name'};		
	return $ret;
}

?>
	
	