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
    
    // a list with all values, all communication goes through the buffer
    buffer: new Object(),

    // a list with all listeners
    listeners: new Object(),


// -----------------------------------------------------------------------------
// H E L P E R   F U N C T I O N S
// -----------------------------------------------------------------------------
// These functions are private and only called from other functions within.
   
  /**
    *  Checks if there are any listeners 
    *       
    *  @param      a specific obj is tested     
    *  @return     true, if there are any listeners     
    */            
    listening: function(item, update) {
        var ret = false;
        
        if (item !== undefined && update !== undefined) {
            for(var i = 0; i < io.listeners[item].length; i++) {
                if ((io.listeners[item][i].update).toString() == (update).toString())
                    ret = true;    
            }
        }
        else
            for (var i in io.listeners)
                ret = true;
        
        return ret;        
    },

    
// -----------------------------------------------------------------------------
// P U B L I C   F U N C T I O N S
// -----------------------------------------------------------------------------
// The function-interfaces in this paragraph should not be changed. They are 
// called from the widgets.

  /**
    * Add a item to listen on. 
    *     
    * @param      the item 
    * @param      the function for update the widget 
    */         	
	add: function(item, update) { 	
    	// 'item' is a array if listening on more than one
    	if (item instanceof Array) {
    		for(var i = 0; i < item.length; i++) {
                if (item[i] != '') {
                    if (!io.listeners[item[i]])
                        io.listeners[item[i]] = Array();
                    
                    if (!io.listening(item[i], update))    
                        io.listeners[item[i]].push({item: item, update: update});
                }
            }
            
        // 'item' is a string
        } else if (item != '') {
            if (!io.listeners[item])
                io.listeners[item] = Array();
            
            if (!io.listening(item, update))
                io.listeners[item].push({item: item, update: update});
        }
    },
    
  /**
    * Remove a item from the listeners
    *      
    * @param      the item, (optional, removes all if no item is given)
    */         
    remove: function(item) {
        if (item !== undefined)
            delete io.listeners[item];
        else
            io.listeners = new Object();  
    },
    
  /**
    * List all items and the number of listeners in console.log
    */         
	list: function() {
	    var items = 0;
        var listeners = 0;
        for (var item in this.listeners) {
            console.log("[io] " + io.listeners[item].length + " widget(s) listen on '" + item + "'");
            listeners += io.listeners[item].length;
            items++;
        }
        console.log("[io] --> " + listeners + " widget(s) listen on " + items + " items.");
    },
    
  /**
    * Update all listeners hearing on a item
    * 
    * @param      the item         
    */         
    update: function(item, val) {
        if (val !== undefined)
            io.buffer[item] = val;
            
        var listeners = io.listeners[item];
        if (listeners) {
            for (var i = 0; i < listeners.length; i++) {
                {
                // more than on item? than all values in repsonse
                if (listeners[i].item instanceof Array)
                {
                    vals = Array();
                    for(var j = 0; j < listeners[i].item.length; j++) {
                        vals.push(io.buffer[listeners[i].item[j]]);
                    }
                    listeners[i].update(vals);
                }
                else
                    listeners[i].update(io.buffer[item]);
                }
            }
        }
	},
	
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
        io.remove();
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
        if (!io.timer_run && io.listening())
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

    convertData: function(inputData, direction) {

	if ( ( String(inputData).indexOf('.') > -1 ) || (direction == 'from') ) {

       	    if (direction == 'from') {
            	data = parseInt(inputData,16).toString(10);
            	wert = (data & 0x07ff);


            	if ((data & 0x08000) != 0)
            	{
            	    wert = wert | 0xfffff800;
            	    wert = wert * -1;
            	}
	
	            wert = wert << ((data & 0x07800) >> 11);
	
	            if ((data & 0x08000) != 0)
	            {
	                wert = wert * -1;
	            }
	            returnData = wert/100;
	
            } else {

                inputData = inputData * 100;
                var dpt9 = 0;
                var exponent = 0;
                if (inputData < 0)
                {
                    dpt9 = 0x08000;
                    inputData = -inputData;
                }
                while (inputData > 0x07ff)
                {
                    inputData >>= 1;
                    exponent++;
                }
                if (dpt9 != 0) inputData = -inputData;

                dpt9 |= inputData & 0x7ff;
                dpt9 |= (exponent << 11) & 0x07800;

                returnData = Number(dpt9 + 0x800000  ).toString(16);

                while (returnData.length < 5) {
                    returnData = "0" + returnData;
                }

           }
	} else if (inputData == 0 || inputData == 1) {
	    returnData = '8' + inputData;
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
                io.buffer[item] = response;
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
                data: ({a: item, v: io.convertData(val, 'to'), ts: $.now()}),
                type: "GET", 
                dataType: 'text', 
                cache: false
            })
            .done(function ( response ) {
                if (timer_run)
                    io.start();
            })
    },
	
  /**
    * Reads all values from bus and refreshes the pages	
    */	 
	all: function(force) {
        var items = '';
        var actual = new Object();

        if (force) {
            io.actualIndexNumber = -1;
            io.allDataReadTimer = Math.floor($.now() / 1000);
        }

        io.lastRequestStarted = Math.floor($.now() / 1000);

        // only if anyone listens
        if (io.listening())
        {
            // prepare url
            var getForUrl = '';
            var counter = 0;
            for(var item in io.listeners) {
                if (counter > 0 ) {
                    getForUrl = getForUrl + '&';
                }

                getForUrl = getForUrl + 'a=' + item;
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
                                    if (parseInt(value, 16)) {
                                        value = io.convertData(value, 'from');
                                    }
                                    actual[id] = value;
                                } );
                            }
                        })
                        
                        for (var item in actual)
                        {
                            // did they change? only then call update
                            if (io.buffer[item] != actual[item] || (force))
                                io.update(item, actual[item]);
                        }

                        io.all();
                    }
                    else
                        smart.alert('error', '', 'eibd', response);
                })
        }
    }

}
