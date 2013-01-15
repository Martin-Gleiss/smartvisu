/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 
 
/**
 * Class for controlling all communication with a connected system. There are 
 * simple I/O functions, and komplex functions for real-time values. 
 */  
var io = {

    // the adress
    adress:     '',
    
    // the port
    port:       '',
    
    // a list with all values, all communication it through the buffer
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
    *  @param      a specific obj ist tested     
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
// The function-interfaces in this paragrah should not be changed. They are 
// called form the widgets.

  /**
    * Add a item to listen on. 
    *     
    * @param      the item 
    * @param      the function for update the widget 
    */         	
	add: function(item, update) { 	
    	// 'item' is a array if listeing on more than one
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
        } else {
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
            console.log("io: " + io.listeners[item].length + " widget(s) listen on '" + item + "'");
            listeners += io.listeners[item].length;
            items++;
        }
        console.log("io: --> " + listeners + " widget(s) listen on " + items + " items.");
    },
    
  /**
    * Update all listeners hearing on a item
    * 
    * @param      the item         
    */         
    update: function(item) {
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
        io.buffer[item] = val;
        io.put(item, val);
    },
    
  /**
    * Initializion of the driver
    *
    * @param      the ip or url to the system (optional)
    * @param      the port on witch the connection should be made (optional) 
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
// The functions in this paragrah may be changed. They are all private and are
// only be called from the public functions above. You may add or delete some
// to fit your requirements and your connected system.
	
    timer: 0,               
    timer_run: false,
    
  /**
    * The real-time pollin loop, only if there are listeners     
    */         
    loop: function()
    {
        if (io.listening())
            io.timer = setTimeout('io.loop(); io.all();', 1000);
    },
    
  /**
    * Start the real-time values. Can only be started once
    */         
    start: function ()
    {
        if (!io.timer_run && io.listening())
        {
            io.loop();
            io.timer_run = true;
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
    
  /**
    * Read a specific item from bus and add it to the buffer
    */         
	get: function(item) {
	    $.ajax ({  url: "driver/io_offline.php", 
                data: ({item: item}), 
                type: "GET",   
                dataType: 'text',                                      
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
            ({  url: "driver/io_offline.php", 
                data: ({item: item, val: val}), 
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
        
        // only if anyone listens
        if (io.listening())
        {        
            // prepare url
            for (var item in io.listeners)
                items += item + ',';
            items = items.substr(0, items.length - 1);
        
            $.ajax ({  url: 'driver/io_offline.php', 
                    data: ({item: items}), 
                    type: 'POST',   
                    dataType: 'json',                                      
                    async: true,
                    cache: false                       
                })
                .done(function (response) {
                    // these are the new values
                    $.each(response, function(item, val) {
                        actual[item] = val;
                    })
                    
                    for (var item in actual)
                    {
                        // did they change? only then call update
                        if (io.buffer[item] != actual[item] || (force))
                        {
                            io.buffer[item] = actual[item];
                            io.update(item);
                        }    
                    }
                })
        }
    }

}
