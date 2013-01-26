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
	   // TODO
    },
    
  /**
    * Does a write-request with a value
    *
    * @param      the item 
    * @param      the value 
    */
    write: function(item, val) {
        // TODO
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
        
        // TODO
        
        io.remove();
    },
    
  /**
    * Lets the driver work
    */
    run: function(realtime) {
        // TODO   
    },
		

// -----------------------------------------------------------------------------
// C O M M U N I C A T I O N   F U N C T I O N S
// -----------------------------------------------------------------------------
// The functions in this paragrah may be changed. They are all private and are
// only be called from the public functions above. You may add or delete some
// to fit your requirements and your connected system.
	
  // TODO

}
