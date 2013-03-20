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
    },
    
  /**
    * Does a write-request with a value
    *
    * @param      the item 
    * @param      the value 
    */
    write: function(item, val) {
		io.send({'cmd': 'item', 'id': item, 'val': val});
		widget.update(item, val);
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
	    io.open();
	},
    
  /**
    * Lets the driver work
    */
    run: function(realtime) {
       	io.monitor();   
    },
		

// -----------------------------------------------------------------------------
// C O M M U N I C A T I O N   F U N C T I O N S
// -----------------------------------------------------------------------------
// The functions in this paragraph may be changed. They are all private and are
// only be called from the public functions above. You may add or delete some
// to fit your requirements and your connected system.
	 
  /**
    * This driver version
    */
    version: 2,

  /**
    * This driver uses a websocket
    */
    socket: false,
    
  /**
    * Opens the connection and add some handlers
    */
    open: function() {
        io.socket = new WebSocket('ws://' + io.address + ':' + io.port + '/');

        io.socket.onopen = function(){
            io.send({'cmd': 'proto', 'ver': io.version});
            io.monitor();
		};

        io.socket.onmessage = function(event) {
            var item, val;
            var data = JSON.parse(event.data);
            // DEBUG: console.log("[io.smarthome.py] receiving data: " + event.data);
            switch(data.cmd) {
                case 'item':
                    for (var i = 0; i < data.items.length; i++) {
                        item = data.items[i][0];
                        val = data.items[i][1];
                        if ( data.items[i].length > 2 ) {
                            // not supported: data.p[i][2] options for visu
                        };
                        widget.update(item, val);
                    };
                    break;

                case 'rrd':
					// DEBUG: console.log("[io.smarthome.py] receiving rrd: " + event.data);
            
					var time = data.start * 1000;
			        var step = data.step * 1000;
					
					if (data.frame == 'update') {
						// single value (remove the oldest)
                		widget.plot().each(function(idx) {
							if (data.step == $(this).attr('data-step') || $(this).attr('data-step') === undefined) {
								var items = widget.explode($(this).attr('data-item')); 
								for (var i = 0; i < items.length; i++) { 
									if (items[i] == data.item) {
					            	var series = widget.get(items[i] + '.rrd.' + $(this).attr('data-period'));
									series.shift();
									series.push([time, data.series[0]]);
									widget.set(data.item + '.rrd.' + $(this).attr('data-period'), series);	
					   			}}
							}
						});
					} else {
				    	// complete graph  
					 	var series = Array();
				        for (var i = 0; i < data.series.length; i++) {
				            series.push([time, data.series[i]]);
				            time += step;
				        };

						widget.set(data.item + '.rrd.' + data.frame, series);
					};
					
					widget.plot(data.item).each(function(idx) {
						var items = widget.explode($(this).attr('data-item'));	
			        	var values = Array();
			
						for (var i = 0; i < items.length; i++) { 
							series = widget.get(items[i] + '.rrd.' + $(this).attr('data-period'));
							if (series !== undefined)
								values.push(series);
						}
						
						$(this).trigger('update', [values]);
					})	
					break;

                case 'dialog':
                    notify.info(data.header, data.content);
					break;

                case 'proto':
                    var proto = parseInt(data.ver);
                    if (proto != io.version) {
                        notify.info('Driver: smarthome.py', 'Protocol mismatch<br \>driver is: v' + io.version + '<br />smarthome.py is: v' + proto);
                    };
                    break;
            };
        };

        io.socket.onerror = function(error){
            notify.error('Driver: smarthome.py', 'Could not connect to smarthome.py server!<br \> Websocket error ' + error.data + '.');
        };

        io.socket.onclose = function(){
            // notify.error('Driver: smarthome.py', 'Connection closed to smarthome.py server!');
        };
    },
    
  /**
    * Sends data to the connected system
    */         
    send: function(data) {
        if (io.socket.readyState == 1) {
            io.socket.send(unescape(encodeURIComponent(JSON.stringify(data))));
            // DEBUG: console.log('[io.smarthome.py] sending data: ' + JSON.stringify(data));
            }
    },

  /**
    * Monitors the items
    */         
    monitor: function() {
		if (widget.listening()) {
	    	io.send({'cmd': 'monitor', 'items': widget.listeners()});
			
			widget.plot().each(function(idx) {
				var items = widget.explode($(this).attr('data-item')); 
				for (var i = 0; i < items.length; i++) { 
	            	io.send({'cmd': 'rrd', 'item': items[i], 'frame': $(this).attr('data-period')});
		   	}});
        }
    },

  /**
    * Closes the connection
    */     
    close: function() {
		console.log("[io.smarthome.py] close connection");
		
		if (io.socket.readyState > 0)
        	io.socket.close(); 

        io.socket = null;
    }

}