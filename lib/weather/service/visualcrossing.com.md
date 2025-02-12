# VisualCrossing.com weather service for smartVISU

## Installation
1. register at visualcrossing.com to get an api key
2. in SmartVISU config page 1. choose visualcrossing.com, 2. enter your location  3. enter your api key  
	Location can be entered in the following ways:
	* use latitude and longitude of your location, separated by a comma e.g. `50.93331,6.95`
	* the city name can be used, too, e.g. "Würzburg" or "Würzburg, Bayern, Deutschland"

## Troubleshooting/Debug:
1. check for file smartVISU/temp/visualcrossing_YOURLOCATION.json
	this is the api response from visualcrossing.com after you have called the service once. 
	View it with a json viewer (normally integrated in the browser)
2. debug the service by calling the following URL in your browser: YOURSERVER/smartVISU/lib/weather/service/visualcrossing.com.php?debug=1
3. check for 'visualcrossing.com' entries in var/log/nginx/error.log (or /var/log/apache2/)
