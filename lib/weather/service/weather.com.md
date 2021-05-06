# Weather.com weather service for smartVISU

## Installation
1. register at weather.com to get an api key or use the public key 6532d6454b8aa370768e63d6ba5a832e
2. in SmartVISU config page 
- choose weather.com, 
- look for a Wunderground station code for your area on Wunderground and enter it in the location field 
- enter your api key  
- enter your postal code followed by ":" and the country code, e.g. 70000:DE

## Troubleshooting/Debug:
1. check for files smartVISU/temp/weather_YOURSTATION_current.json andn weather_YOURSTATION_forecast.json.
	These are the api responses from weather.com after you have called the service once. 
	View them with a json viewer (i.e. addon to chrome)
2. debug the service by calling YOURSERVER/smartVISU/lib/weather/service/weather.com.php?debug=1
3. check for 'weather.com' entries in var/log/nginx/error.log (or /var/log/apache2/)
