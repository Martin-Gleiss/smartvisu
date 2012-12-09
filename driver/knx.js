/**
 * -----------------------------------------------------------------------------
 * @package     smartVisu
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 
 
/**
 * Class for controlling all communication with the KNX bus. There are simple
 * I/O functions, and komplex functions for real-time values. 
 */  
var knx = {

    // real-time control
    timer: 0,               
    timer_run: false,
    
    // a list with all listeners
    listeners: new Object(),
    
    // all values from bus are cached
    cache: new Object(),
    
    
    // Helper
    // -------------------------------------------------------------------------
    
    /**
     *  Checks if there are any listeners 
     *  @param      a specific obj ist tested     
     *  @return     true, if there are any listeners     
     */            
    listening: function(gad, obj) {
        var ret = false;
        
        if (gad !== undefined && obj !== undefined) {
            for(var i = 0; i < knx.listeners[gad].length; i++) {
                if ((knx.listeners[gad][i].update).toString() == (obj.update).toString())
                    ret = true;    
            }
        }
        else
            for (var i in knx.listeners)
                ret = true;
        
        return ret;        
    },
    
    
    // Real-Time Control
    // -------------------------------------------------------------------------
    
    /**
     * The real-time pollin loop, only if there are listeners     
     */         
    loop: function()
    {
        if (knx.listening())
            knx.timer = setTimeout('knx.loop(); knx.refresh(true);', 1000);
    },
    
    /**
     * Start the real-time values. Can only be started once
     */         
    start: function ()
    {
        if (!knx.timer_run && knx.listening())
        {
            knx.loop();
            knx.timer_run = true;
        }
    },
    
    /**
     * Stop the real-time values
     */         
    stop: function ()
    {
        clearTimeout(knx.timer);
        knx.timer_run = false;
    },

    
    // Real-Time Control
    // -------------------------------------------------------------------------
    
    /**
	 * Add a gad to listen on. 
	 * @param      obj with variable 'gad' and function 'update' 
	 */         	
	add: function(obj) {
    	var gad = obj.gad;
    	
    	// gad is a array to listen on more than one groupaddress
    	if (gad instanceof Array) {
    		for(var i = 0; i < gad.length; i++) {
                if (gad[i] != '') {
                    if (!knx.listeners[gad[i]])
                        knx.listeners[gad[i]] = Array();
                    
                    if (!knx.listening(gad[i], obj))    
                        knx.listeners[gad[i]].push(obj);
                }
            }
            
        // gad is a string
        } else {
            if (!knx.listeners[gad])
                knx.listeners[gad] = Array();
            
            if (!knx.listening(gad, obj))
                knx.listeners[gad].push(obj);
        }
    },
    
    /**
     * Remove on gad from the listeners or remove all
     */         
    remove: function(gad) {
        if (gad !== undefined)
            delete knx.listeners[gad];
        else
            knx.listeners = new Object();  
    },
    
    /**
     * Update all listeners hearing on a gad
     */         
    update: function(gad, val) {
        // use value from cache if no one is given
        if (val !== undefined)
            knx.cache[gad] = val;
                
        var listeners = knx.listeners[gad];
        if (listeners) {
            for (var i = 0; i < listeners.length; i++) {
                {
                // special: if the obj listens on more values, it should response all of them
                if (listeners[i].gad instanceof Array)
                {
                    vals = Array();
                    for(var j = 0; j < listeners[i].gad.length; j++) {
                        vals.push(knx.cache[listeners[i].gad[j]]);
                    }
                    listeners[i].update(vals);
                }
                else
                    listeners[i].update(knx.cache[gad]);
                }
            }
        }
	}, 
	
	
	// Access the bus
    // -------------------------------------------------------------------------
    
    /**
     * Read a specific gad from bus and add it to the cache
     */         
	read: function(gad) {
	    $.ajax ({  url: "driver/driver_offline.php", 
                data: ({gad: gad}), 
                type: "GET",   
                dataType: 'text',                                      
                async: true,
                cache: false
            })
            .done(function ( response ) {
                knx.cache[gad] = response;
            })
    },
    
    /**
     * Write a value to bus
     */         
    write: function (gad, val) {
        knx.stop();
        $.ajax 
            ({  url: "driver/driver_offline.php", 
                data: ({gad: gad, val: val}), 
                type: "GET", 
                dataType: 'text', 
                cache: false
            })
            .done(function ( response ) {
                knx.start();
            })
    },
	
	/**
	 * Reads all values from bus and refreshes the pages	
	 */	 
	refresh: function(force) {
        var gads = '';
        var actual = new Object();
        
        // only if anyone listens
        if (knx.listening())
        {        
            // prepare url
            for (var gad in knx.listeners)
                gads += gad + ',';
            gads = gads.substr(0, gads.length - 1);
        
            $.ajax ({  url: 'driver/driver_offline.php', 
                    data: ({gad: gads}), 
                    type: 'POST',   
                    dataType: 'json',                                      
                    async: true,
                    cache: false
                })
                .done(function (response) {
                    // these are the new values
                    $.each(response, function(gad, val) {
                        actual[gad] = val;
                    })
                    
                    for (var gad in actual)
                    {
                        // did they change? only then call update
                        if (knx.cache[gad] != actual[gad] || (force === undefined))
                        {
                            knx.cache[gad] = actual[gad];
                            knx.update(gad);
                        }    
                    }
                })
        }
    },
    
    /**
     * List all gads and the number of listeners in console.log
     */         
	list: function() {
        for (var gad in this.listeners)
            console.log("knx driver: listen on '" + gad + "': " + this.listeners[gad].length);
    }
}
