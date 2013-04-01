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
		// old items (for new widgets with existing values)
		widget.refresh();

		// new items
        io.all();
        
		// run polling
        if (realtime)
            io.start();   
    },
		

// -----------------------------------------------------------------------------
// C O M M U N I C A T I O N   F U N C T I O N S
// -----------------------------------------------------------------------------
// The functions in this paragraph may be changed. They are all private and are
// only be called from the public functions above. You may add or delete some
// to fit your requirements and your connected system.
	
    timer: 0,               
    timer_run: false,
    
  /**
    * The real-time polling loop, only if there are listeners     
    */         
    loop: function()
    {
        if (widget.listening())
            io.timer = setTimeout('io.loop(); io.all();', 1000);
    },
    
  /**
    * Start the real-time values. Can only be started once
    */         
    start: function ()
    {
        if (!io.timer_run && widget.listening())
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
	    $.ajax({  url: "driver/io_offline.php", 
                data: ({item: item}), 
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
        $.ajax({  url: "driver/io_offline.php", 
                data: ({item: item, val: val}), 
                type: "GET", 
                dataType: 'json', 
                cache: false
            })
            .done(function ( response ) {
				widget.update(item, response[item]);

                if (timer_run)
                    io.start();
            })
    },
	
  /**
    * Reads all values from bus and refreshes the pages	
    */	 
	all: function() {
        var items = '';
        
        // only if anyone listens
        if (widget.listening())
        {        
            // prepare url       
			var item = widget.listeners();
			for (var i = 0; i < widget.listeners().length; i++)
                items += item[i] + ',';
            items = items.substr(0, items.length - 1);
        
            $.ajax({  url: 'driver/io_offline.php', 
                    data: ({item: items}), 
                    type: 'POST',   
                    dataType: 'json',                                      
                    async: true,
                    cache: false                       
                })                            
                .done(function (response) {
					
					// if there are plots, fill them with random values
					widget.plot().each(function(idx) {
						var items = widget.explode($(this).attr('data-item')); 
						for (var i = 0; i < items.length; i++) {
                           	if (response[items[i]] == null) 
                                if (!widget.get(items[i]))
									if(items[i].substr(items[i].length - 4, 4) == '.bit')
										response[items[i]] = io.seriesBit($(this).attr('data-period'));
                                	else	
										response[items[i]] = io.seriesFloat($(this).attr('data-period'), $(this).attr('data-min'), $(this).attr('data-max'));
                                else
                                    response[items[i]] = widget.get(items[i]);	
						}	
					});
				
					// update all items	
				    $.each(response, function(item, val) {
						widget.update(item, val);
                    })
                })
        }
    },

  /**
    * Builds a series out of random bit values	
    */	 
	seriesBit: function(period) {

	    var ret = Array();
        var val = 0;
		
		period = new Date().duration(period);
		var now = new Date();
		var start = now - period;
		var step = Math.round((now - start) / 20);
	
		while (start <= now) {
			ret.push([start, Math.random() > 0.5]);
			start += step;
		}

		return ret;
	},

  /**
    * Builds a series out of random float values	
    */	 
	seriesFloat: function(period, min, max) {

	    var ret = Array();
        var val = (min * 1) + ((max - min) / 2);
		var delta = (max - min) / 20;
		
		period = new Date().duration(period);
		var now = new Date();
		var start = now - period;
		var step = Math.round((now - start) / 20);
		
		while (start <= now) {
			val += Math.random() * (2 * delta) - delta;		
            ret.push([start, Math.round(val * 10) / 10]);
			start += step;
		}

		return ret;
	}
}
