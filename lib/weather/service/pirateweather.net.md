# Pirateweather.net weather service for smartVISU

## Installation
1. register at pirateweather.net to get an api key
2. in SmartVISU config page 1. choose pirateweather.net, 2. enter your location  3. enter your api key  
	Location can be entered in the following ways:
	* use latitude and longitude of your location, separated by a comma e.g. `50.93331,6.95`

## Troubleshooting/Debug:
1. check for file smartVISU/temp/pirateweather_YOURLOCATION.json
	this is the api response from pirateweather.net after you have called the service once. 
	View it with a json viewer (i.e. addon to chrome)
2. debug the service by calling YOURSERVER/smartVISU/lib/weather/service/pirateweather.net.php?debug=1
3. check for 'pirateweather.net' entries in var/log/nginx/error.log (or /var/log/apache2/)
