##Openweathermap.org weather service for smartVISU

##Installation
1. register at openweathermap.org to get an api key
2. in SmartVISU config page 1. choose openweather.org, 2. enter your location (i.e. Köln) 3. enter your api key  


##Troubleshooting/Debug:
1. check for file smartVISU/temp/openweathermap_YOURCITY.json
	this is the api response from openweathermap.org. View it with a json viewer (i.e. addon to chrome)
2. check for 'openweathermaps' entries in Logs/nginx/error.log (or Logs/apache2/)
