/**
 * -----------------------------------------------------------------------------
 * @package     smartVisu
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 
 
// KNX-Controller
var knx = {
    timer: 0,
    tim: false,
    listeners: new Object(),
    werte: new Object(),
    
    dolisten: function() {
        var i = 0;
        for (var gad in knx.listeners)
            i++;
        
        return i > 0;        
    },
    
    loop: function()
    {
        if (knx.dolisten())
            knx.timer = setTimeout('knx.loop(); knx.refresh();', 1000);
    },
    start: function ()
    {
        if (!knx.tim && knx.dolisten())
        {
            knx.loop();
            knx.tim = true;
        }
    },
    
    stop: function ()
    {
        clearTimeout(knx.timer);
        knx.tim = false;
    },


	// to add a gad to listen on
	add: function(obj) {
    	var gad = obj.gad;
    	
    	if (gad instanceof Array) {
    		for(var i = 0; i < gad.length; i++) {
                if (gad[i] != '') {
                    if (!knx.listeners[gad[i]])
                        knx.listeners[gad[i]] = Array();
                        
                    knx.listeners[gad[i]].push(obj);
                }
            }
        } else {
            if (!knx.listeners[gad])
                knx.listeners[gad] = Array();
            
            var drin = false;
            for(var i = 0; i < knx.listeners[gad].length; i++) {
                if ((knx.listeners[gad][i].update).toString() == (obj.update).toString())
                    drin = true;    
            }
            
            if (!drin)
                knx.listeners[gad].push(obj);
        }
    },
    
	remove: function(gad) {
	   knx.listeners = new Object();  
    },
    
	update: function(gad, val) {
        if (val !== undefined)
            knx.werte[gad] = val;
                
        var listeners = knx.listeners[gad];
        if (listeners) {
            for (var i = 0; i < listeners.length; i++) {
                {
                if (listeners[i].gad instanceof Array)
                {
                    vals = Array();
                    for(var j = 0; j < listeners[i].gad.length; j++) {
                        vals.push(knx.werte[listeners[i].gad[j]]);
                    }
                    listeners[i].update(vals);
                }
                else
                    listeners[i].update(knx.werte[gad]);
                }
            }
        }
	}, 
	
	read: function(gad) {
	    $.ajax ({  url: "driver/driver_offline.php", 
                data: ({gad: gad}), 
                type: "GET",   
                dataType: 'text',                                      
                async: true,
                cache: false
            })
            .done(function ( response ) {
                knx.werte[gad] = response;
            })
    },
    
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
	
	refresh: function(force) {
        var gads = '';
        var gelesen = new Object();
        
        if (knx.dolisten())
        {        for (var gad in knx.listeners)
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
                $.each(response, function(gad, val) {
                    gelesen[gad] = val;
                })
                
                for (var gad in gelesen)
                {
                    if (knx.werte[gad] != gelesen[gad] || (force !== undefined))
                    {
                        knx.werte[gad] = gelesen[gad];
                        knx.update(gad);
                    }    
                }
            })
        }
    },
    
	list: function() {
        for (var gad in this.listeners)
            console.log("knx driver: listen on '" + gad + "': " + this.listeners[gad].length);
    }
}
