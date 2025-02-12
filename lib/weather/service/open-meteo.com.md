# Open-meteo.com weather service for smartVISU

## Installation
1. in SmartVISU config page 1. choose open-meteo.com, 2. enter your location (i.e. Köln)   
	Location can be entered in the following ways:
	* use latitude and longitude of your location e.g. `latitude=50.93331&longitude=6.95`

## Troubleshooting/Debug:
1. check for file smartVISU/temp/open-meteo_YOURLOCATION.json
	this is the api response from open-meteo.com after you have called the service once. 
	View it with a json viewer (i.e. addon to chrome)
2. debug the service by calling the following URL in your browser: YOURSERVER/smartVISU/lib/weather/service/open-meteo.com.php?debug=1
3. check for 'open-meteo.com' entries in var/log/nginx/error.log (or /var/log/apache2/)
