# Openweathermap.org weather service for smartVISU

## Installation
1. register at openweathermap.org to get an api key
2. in SmartVISU config page 1. choose openweather.org, 2. enter your location (i.e. Köln) 3. enter your api key  
	Location can be entered in the following ways:
	* use latitude and longitude of your location e.g. `lat=50.93331&lon=6.95`
	* use the city ID provided by openweathermap.org e.g. `id=2886242`
	* use the ZIP code of your location, e.g. `zip=50667,DE`
	* use the city name e.g. `Köln,DE`

## Troubleshooting/Debug:
1. check for file smartVISU/temp/openweathermap_YOURCITY.json
	this is the api response from openweathermap.org after you have called the service once. 
	View it with a json viewer (i.e. addon to chrome)
2. debug the service by calling YOURSERVER/smartVISU/lib/weather/service/openweathermap.org.php?debug=1
3. check for 'openweathermap.org' entries in var/log/nginx/error.log (or /var/log/apache2/)
