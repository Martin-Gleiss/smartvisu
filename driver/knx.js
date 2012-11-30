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
    listeners: new Object(),
    werte: new Object(),
    
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
            
            knx.listeners[gad].push(obj);
        }
    },
	
	update: function(gad) {
        var listeners = knx.listeners[gad];
        if (listeners) {
            for (var i = 0; i < listeners.length; i++) {
                {
                if (listeners[i].gad instanceof Array)
                {
                    val = Array();
                    for(var j = 0; j < listeners[i].gad.length; j++) {
                        val.push(knx.werte[listeners[i].gad[j]]);
                    }
                    listeners[i].update(val);
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
        $.ajax 
            ({  url: "driver/driver_offline.php", 
                data: ({gad: gad, val: val}), 
                type: "GET", 
                dataType: 'text', 
                cache: false
            });
    },
	
	refresh: function(force = false) {
        var gads = '';
        var gelesen = new Object();
        
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
                $.each(response, function(gad, val) {
                    gelesen[gad] = val;
                })
                
                for (var gad in gelesen)
                {
                    if (knx.werte[gad] != gelesen[gad] || force)
                    {
                        knx.werte[gad] = gelesen[gad];
                        knx.update(gad);
                    }    
                }
            })
    },
    
    periodic: function() {
		knx.refresh();
		setTimeout('knx.periodic();', 1000);
	},
	
	list: function() {
        for (var gad in this.listeners)
            document.write("<dd>" + gad + ": " + this.listeners[gad].length + "<\/dd>");
    }
	
    
}
