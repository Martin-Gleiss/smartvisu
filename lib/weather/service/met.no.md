# met.no weather service for smartVISU

## Installation
1. in SmartVISU config page 
- choose met.no, 
- enter geographical coordinates for your location, e.g.  lat=47.1234&lon=9.1234&altitude=123

## Troubleshooting/Debug:
1. check for files smartVISU/temp/met.no_lat47.1234lon9.1234altitude123.json .
	This is the api response from met.no after you have called the service once. 
	View it with a json viewer (i.e. addon to chrome)
2. debug the service by calling YOURSERVER/smartVISU/lib/weather/service/met.no.php?debug=1
3. check for 'met.no' entries in var/log/nginx/error.log (or /var/log/apache2/)
