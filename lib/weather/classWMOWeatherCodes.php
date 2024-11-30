<?php
/*
 * WMO Weather interpretation codes (WW) used by e.g. open-meteo.com
 *
	Code 	Description
	0 	Clear sky
	1, 2, 3 	Mainly clear, partly cloudy, and overcast
	45, 48 	Fog and depositing rime fog
	51, 53, 55 	Drizzle: Light, moderate, and dense intensity
	56, 57 	Freezing Drizzle: Light and dense intensity
	61, 63, 65 	Rain: Slight, moderate and heavy intensity
	66, 67 	Freezing Rain: Light and heavy intensity
	71, 73, 75 	Snow fall: Slight, moderate, and heavy intensity
	77 	Snow grains
	80, 81, 82 	Rain showers: Slight, moderate, and violent
	85, 86 	Snow showers slight and heavy
	95 * 	Thunderstorm: Slight or moderate
	96, 99 * 	Thunderstorm with slight and heavy hail
*/

class WMO {
	
	const weatherCode = array (
		0 => array(
			"condition" => "clearsky",
			"icon" => "sun_1" 
			),
		1 => array(
			"condition" => "fair",
			"icon" => "sun_2" 
			),
		2 => array(
			"condition" => "partlycloudy",
			"icon" => "sun_3" 
			),
		3 => array(
			"condition" => "cloudy",
			"icon" => "sun_5" 
			),
		45 => array(
			"condition" => "fog",
			"icon" => "cloud_6" 
			),
		48 => array(
			"condition" => "fog",
			"icon" => "cloud_6" 
			),
		51 => array(
			"condition" => "lightdrizzle",
			"icon" => "cloud_7" 
			),

		53 => array(
			"condition" => "drizzle",
			"icon" => "cloud_7" 
			),

		55 => array(
			"condition" => "heavydrizzle",
			"icon" => "cloud_7" 
			),

		56 => array(
			"condition" => "freezing lightdrizzle",
			"icon" => "cloud_7" 
			),

		57 => array(
			"condition" => "freezing heavydrizzle",
			"icon" => "cloud_7" 
			),
		61 => array(
			"condition" => "lightrain",
			"icon" => "cloud_7" 
			),

		63 => array(
			"condition" => "rain",
			"icon" => "cloud_7" 
			),

		65 => array(
			"condition" => "heavyrain",
			"icon" => "cloud_8" 
			),

		66 => array(
			"condition" => "freezing lightrain",
			"icon" => "sun_1" 
			),

		67 => array(
			"condition" => "freezing heavyrain",
			"icon" => "sun_1" 
			),

		71 => array(
			"condition" => "lightsnow",
			"icon" => "cloud_12" 
			),

		73 => array(
			"condition" => "snow",
			"icon" => "cloud_12" 
			),

		75 => array(
			"condition" => "heavysnow",
			"icon" => "cloud_13" 
			),

		77 => array(
			"condition" => "sleet",
			"icon" => "cloud_11" 
			),

		80 => array(
			"condition" => "lightrainshowers",
			"icon" => "sun_7" 
			),

		81 => array(
			"condition" => "rainshowers",
			"icon" => "sun_7" 
			),

		82 => array(
			"condition" => "heavyrainshowers",
			"icon" => "sun_8" 
			),

		85 => array(
			"condition" => "lightsnowshowers",
			"icon" => "sun_13" 
			),

		86 => array(
			"condition" => "heavysnowshowers",
			"icon" => "sun_13" 
			),

		95 => array(
			"condition" => "thunderstorm",
			"icon" => "sun_10" 
			),

		96 => array(
			"condition" => "lighthailandthunder",
			"icon" => "cloud_16" 
			),

		99 => array(
			"condition" => "heavyhailandthunder",
			"icon" => "cloud_17" 
			)
		);
}