/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Raik Alber and Martin Gleiß
 * @copyright   2013
 * @license     GPL <http://www.gnu.de>
 * @version	    0.1
 * ----------------------------------------------------------------------------- 
 */
 
 
/**
 * Class for controlling all communication with a connected system. There are 
 * simple I/O functions, and complex functions for real-time values. 
 */  
var io = {

    // the adress
    adress:     '',
    
    // the port
    port:       '',
    

// -----------------------------------------------------------------------------
// P U B L I C   F U N C T I O N S
// -----------------------------------------------------------------------------
	
  /**
    * Does a read-request and adds the result to the buffer
    * 
    * @param      the item      
    */
	read: function(item) {
	   io.get(item);
    },
    
  /**
    * Does a write-request with a value
    *
    * @param      the item 
    * @param      the value 
    */
    write: function(item, val) {
        io.put(item, val);
    },
    
  /**
    * Initializion of the driver
    *
    * @param      the ip or url to the system (optional)
    * @param      the port on which the connection should be made (optional) 
    */
   	init: function(address, port) {
   	    io.address = address;
   	    io.port = port;
        io.stop();
    },
    
  /**
    * Lets the driver work
    */
    run: function(realtime) {
        io.all(true);
        
        if (realtime)
            io.start();   
    },
		

// -----------------------------------------------------------------------------
// C O M M U N I C A T I O N   F U N C T I O N S
// -----------------------------------------------------------------------------
// The function in this paragrah may be changed. They are all private and are
// only be called from the public functions above. You may add or delete some
// to fit your requerements and your connected system.
	
    timer: 0,               
    timer_run: false,
    actualIndexNumber: -1,
    actualRequest: false,
    allDataReadTimer: 0,
    lastRequestStarted: 0,
    reloadAllDataTime: 1800,
    restartRequestTime: 60,

    checkRequest: function() {

        var thisTime = Math.floor($.now() / 1000);
        if (thisTime - io.restartRequestTime  > io.lastRequestStarted) {
            io.actualRequest.abort(); io.all();
        }
        if (thisTime - io.reloadAllDataTime > io.allDataReadTimer) {
            io.actualRequest.abort(); io.all(true);
        }
        setTimeout('io.checkRequest()', 1000);
    },

  /**
    * Start the real-time values. Can only be started once
    */         
    start: function ()
    {
        if (!io.timer_run && widget.listening())
        {

            io.timer_run = true;
            setTimeout('io.checkRequest()', 1000);
        }
    },
    
  /**
    * Stop the real-time values
    */         
    stop: function ()
    {
        clearTimeout(io.timer);
        io.timer_run = false;
    },

    convertData: function(inputData, dataType, direction) {

	if ( dataType == '9.xxx' ) {

        if (direction == 'from') {

            data = parseInt(inputData,16).toString(10);
            wert = (data & 0x07ff);

            if ((data & 0x08000) != 0) {
                wert = wert | 0xfffff800;
            	wert = wert * -1;
            }
	
	        wert = wert << ((data & 0x07800) >> 11);
	
	        if ((data & 0x08000) != 0) {
	            wert = wert * -1;
	        }
	        returnData = wert/100;

        } else {
            inputData = inputData * 100;

            var dpt9 = 0;
            var exponent = 0;

            if (inputData < 0) {
                dpt9 = 0x08000;
                inputData = -inputData;
            }
            while (inputData > 0x07ff) {
                inputData >>= 1;
                exponent++;
            }
            if (dpt9 != 0) {
                inputData = -inputData;
            }

            dpt9 |= inputData & 0x7ff;
            dpt9 |= (exponent << 11) & 0x07800;

            returnData = Number(dpt9 + 0x800000  ).toString(16);

            while (returnData.length < 5) {

                returnData = "0" + returnData;
            }

           }
	} else if (dataType == '1.001') {
	    if (direction == 'to') {

	        returnData = '8' + inputData;
            }
	} else if (dataType == '5.001') {

        if (direction == 'from') {

            returnData = inputData;
            //returnData = Math.round(parseInt(inputData, 10) / 2.55);


        } else if (direction == 'to') {

            returnData = inputData;
            returnData = Math.round(inputData * 2.55) + 0x8000;
            returnData = returnData.toString(16);
        }

    } else {

        returnData = inputData;
	}
        return returnData;
    },
    
  /**
    * Read a specific item from bus and add it to the buffer
    */         
	get: function(item) {

	    $.ajax ({  url: "/cgi-bin/r?" + getForUrl,
                type: "GET",
                dataType: 'json',
                async: true,
                cache: false
            })
            .done(function ( response ) {
                widget.update(item, response[item]);
            })
    },

  /**
    * Write a value to bus
    */         
    put: function (item, val) {
        var timer_run = io.timer_run;

        io.stop();

        $.ajax 
            ({  url: "/cgi-bin/w",
                data: ({a: item.substring(0, (item.length - 6) ), v: io.convertData(val,item.slice(-5), 'to'), ts: $.now()}),
                type: "GET", 
                dataType: 'json', 
                cache: false
            })
            .done(function ( response ) {
				widget.update(item, val);
				
                if (timer_run)
                    io.start();
            })
    },
	
  /**
    * Reads all values from bus and refreshes the pages	
    */	 
	all: function(force) {
        var items = '';
       
        if (force) {
            io.actualIndexNumber = -1;
            io.allDataReadTimer = Math.floor($.now() / 1000);
        }

        io.lastRequestStarted = Math.floor($.now() / 1000);

        // only if anyone listens
        if (widget.listening())
        {
            // prepare url
            var getForUrl = '';
            var counter = 0;

			var item = widget.listeners();
			for (var i = 0; i < widget.listeners().length; i++)
                if (counter > 0 ) {
                    getForUrl = getForUrl + '&';
                }

                getForUrl = getForUrl + 'a=' + item[i].substring(0, (item[i].length - 6) );
                counter++;
            }
            getForUrl = getForUrl + '&i=' + io.actualIndexNumber;

            io.actualRequest = $.ajax ({  url: '/cgi-bin/r?' + getForUrl,
                    type: 'GET',
                    dataType: 'json',                                      
                    async: true,
                    cache: false                       
                })
                .done(function (response) {
                    if (typeof(response) == 'object') {
                        // these are the new values
                        $.each(response, function(item, val) {
                            if (item == 'i') {
                                io.actualIndexNumber = val;
                            }
                            if (item == 'd') {
                                $.each(val, function(id, value) {
                                    for(var item in io.listeners) {
                                        if (item.substring(0, (item.length - 6) ) == id) {
                                            var dataType = item.slice(-5);
                                            value = io.convertData(value, dataType, 'from');
                                            widget.update(item, value);
			                            }
                                    }

                                } );
                            }
                        })
                        io.all();
                    }
                    else
						notify.error('Driver: eibd', response);
                })
        }
    }

}
