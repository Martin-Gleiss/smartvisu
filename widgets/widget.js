/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 
   
/**
 * Class for controlling all widgets. 
 */ 
var widget = {

    // a list with all item and values pairs
    buffer: new Object(),


  /**
    *  Checks if there are any listeners 
    *       
    *  @return     true, if there are any listeners     
    */        
	listening: function() {
	    var ret = false;
        
	    if ($('[data-item]').size() > 0)
        	ret = true;
        
        return ret;        
    },

  /**
    * Returns all items listening on
    */         
	listeners: function() {
		var ret = Array();

		$('[data-item]').each(function(idx) {
			var dataitem = $(this).attr('data-item'); 
				
			// More than one item?
			if (dataitem.indexOf(',') >= 0) {
				var items = dataitem.split(',');

				for (var i = 0; i < items.length; i++) {
					if (items[i].trim() != '')
						ret[items[i].trim()] = '';
				}
			} 
			// One item
			else if (dataitem.trim() != '') {
				ret[dataitem.trim()] = '';
			};
		}); 

        return ret;       
    },

  /**
    * List all items and the number of listeners in console.log
    */         
	list: function() {
	    var widgets = 0;
		$('[data-item]' ).each(function(idx) {
            console.log("[widget] '" + this.id + "' listen on '" + $(this).attr('data-item') + "'");
            widgets++;
    	});
        console.log("[widget] --> " + widgets + " listening.");
    },
    
  /**
    * Set a val for a item in the buffer
    * 
    * @param    the item 
    * @param	the val        
    */         
	set: function(item, val) {

		if (val !== undefined) {
            widget.buffer[item] = val;
			// console.log("[widget] '" + item + "' -> '" + widget.buffer[item] + "'");
		}

	},

  /**
    * Update a item and all widgets listening on a that
    * 
    * @param    the item 
    * @param	the val        
    */         
    update: function(item, val) {
        
		// update if value has changed
		if (widget.buffer[item] != val || val === undefined) {

			widget.set(item, val);
    	    
			$('[data-item*=' + item + ']').each(function(idx) {
				var dataitem = $(this).attr('data-item'); 
					
				// More than one item?
				if (dataitem.indexOf(',') >= 0) {
					var items = dataitem.split(',');
	
					for (var i = 0; i < items.length; i++) { 
						if(items[i].trim() == item) {
						
							var vals = Array();        
		                    for(var j = 0; j < items.length; j++) {
		                        vals.push(widget.buffer[items[j].trim()]);
							}
		                	$(this).trigger('update', [vals]);
	
						}
					}
				} 
				// One item
				else if (dataitem.trim() == item) {
					$(this).trigger('update', [widget.buffer[item]]);
				};
			});

		}
	},

  /**
    * Refreshes all widgets on the current page
    */ 
	refresh: function() {
		$('[id^=' + $.mobile.activePage.attr('id') + '-][data-item]').each(function(idx) {
			var dataitem = $(this).attr('data-item'); 
					
			// More than one item?
			if (dataitem.indexOf(',') >= 0) {
				var items = dataitem.split(',');

				for (var i = 0; i < items.length; i++) { 
					var vals = Array();        
                    for(var j = 0; j < items.length; j++) {
                        vals.push(widget.buffer[items[j].trim()]);
					}
                	$(this).trigger('update', [vals]);
				}
			} 
			// One item
			else {
				$(this).trigger('update', [widget.buffer[dataitem.trim()]]);
			};
		})
	}
} 



// -----------------------------------------------------------------------------
// W I D G E T   D E L E G A T E   F U N C T I O N S
// -----------------------------------------------------------------------------


// ----- basic.value -----------------------------------------------------------
$(document).delegate('[data-widget="basic.value"]', { 
	'update': function(event, response) {
		$('#' + this.id).html(response + ' ' + $(this).attr('data-unit'));
    }
});


// ----- basic.float -----------------------------------------------------------
$(document).delegate('[data-widget="basic.float"]', { 
	'update': function(event, response) {
		$('#' + this.id).html( ((Math.round(response * 10) / 10).toFixed(1)) + ' ' + $(this).attr('data-unit'));
    }
});


// ----- basic.checkbox --------------------------------------------------------
$(document).delegate('input[data-widget="basic.checkbox"]', { 
	'update': function(event, response) {
		$('#' + this.id).attr('checked', (response > 0 ? true : false)).checkboxradio('refresh'); 
    },

	'change': function(event) {
	    // DEBUG: console.log("[basic.flip] click item: " + $(this).attr('data-item') + " val: " + $(this).val()); 
		io.write($(this).attr('data-item'), ($('#' + this.id + ':checked').val() == 'on' ? 1 : 0)); 
	}
});    


// ----- basic.flip ------------------------------------------------------------
$(document).delegate('select[data-widget="basic.flip"]', { 
	'update': function(event, response) {
		$('#' + this.id).val(response > 0 ? 'on' : 'off').slider('refresh');
    },

	'change': function(event) {
	    // DEBUG: console.log("[basic.flip] click item: " + $(this).attr('data-item') + " val: " + $(this).val());  
		io.write($(this).attr('data-item'), ($(this).val() == 'on' ? 1 : 0));
	}
});


// ----- basic.silder ----------------------------------------------------------
$(document).delegate('input[data-widget="basic.slider"]', {
	'update': function(event, response) {
		// DEBUG: console.log("[basic.slider] update val: " + $(this).val() + " lock: " + $(this).attr('lock'));   
	    $('#' + this.id).attr('old', response);
		$('#' + this.id).val(response).slider('refresh');
    },

	'slidestop': function(event) {
		// DEBUG: console.log("[basic.slider] slidestop val: " + $(this).val() + " lock: " + $(this).attr('lock'));  

		// use a lock to fire event only every 400ms and if value has changed
		if ($(this).val() != $(this).attr('old')) {
			$(this).attr('lock', 1);
   			$(this).trigger('click'); 

			setTimeout("$('#" + this.id + "').attr('lock', 0);", 400);
		}
   	},

	'change': function(event, ui) {
	    // DEBUG: console.log("[basic.slider] change val: " + $(this).val() + " lock: " + $(this).attr('lock'));   
	    
		// use a lock to fire event only every 400ms, and don't trigger on init
	    if ($(this).attr('lock') == 0 || $(this).attr('lock') === undefined) {
	        $(this).attr('lock', 1);
   			if ($(this).val() != $(this).attr('old') && $(this).attr('old') !== undefined)
				$(this).trigger('click');
       		
			setTimeout("$('#" + this.id + "').attr('lock', 0);", 400);
	    }
    },

	'click': function(event) {             
		io.write($(this).attr('data-item'), $(this).val());  
	} 
}); 


// ----- basic.symbol ----------------------------------------------------------
$(document).delegate('span[data-widget="basic.symbol"]', { 
	'update': function(event, response) {

		// response will be an array, if more then one item is requested 
		var bit = false;
		if (response instanceof Array) {
		    for(var i = 0; i < response.length; i++) {
		        bit = bit || (response[i] == $(this).attr('data-val'));
		}}
		else
		    bit = (response == $(this).attr('data-val'));   
		  
		if (bit)
		    $('#' + this.id).show();
		else
		    $('#' + this.id).hide();
    }
});


// ----- basic.switch ----------------------------------------------------------
$(document).delegate('span[data-widget="basic.switch"]', { 
	'update': function(event, response) {
		$('#' + this.id + ' img').attr('src', (response == $(this).attr('data-val-on') ? $(this).attr('data-pic-on') : $(this).attr('data-pic-off')));
    },

	'click': function(event) {
		if ($('#' + this.id + ' img').attr('src') == $(this).attr('data-pic-off') ) {
			io.write($(this).attr('data-item'), $(this).attr('data-val-on')); 
	    } else {
      		io.write($(this).attr('data-item'), $(this).attr('data-val-off'));
	    }
	}
});

$(document).delegate('span[data-widget="basic.switch"] > a > img', 'hover', function( event ) {
    if( event.type === 'mouseenter' )  
        $(this).addClass("ui-focus");
    else
        $(this).removeClass("ui-focus");  
});


// ----- basic.shifter ---------------------------------------------------------
$(document).delegate('span[data-widget="basic.shifter"]', { 
	'update': function(event, response) {
        var step = Math.min((response[1] / $(this).attr('data-max') * 10 + 0.49).toFixed(0) * 10, 100);
        
        if (response[0] != 0 && step > 0)
            $('#' + this.id + ' img').attr('src', $(this).attr('data-pic-on').replace('00', step));
        else
            $('#' + this.id + ' img').attr('src', $(this).attr('data-pic-off'));
    },

	'click': function(event) {
        var items = $(this).attr('data-item').split(',');
        
		if ($('#' + this.id + ' img').attr('src') == $(this).attr('data-pic-off') ) {
			io.write(items[0].trim(), 1); 
	    } else {
      		io.write(items[0].trim(), 0);
	    }
	}
});

$(document).delegate('span[data-widget="basic.shifter"] > a > img', 'hover', function( event ) {
    if( event.type === 'mouseenter' )  
        $(this).addClass("ui-focus");
    else
        $(this).removeClass("ui-focus");  
});


// ----- basic.button ----------------------------------------------------------
$(document).delegate('a[data-widget="basic.button"]', { 
	'click': function(event) {
		if ($(this).attr('data-val') != '')
			io.write($(this).attr('data-item'), $(this).attr('data-val'));  
	}
});


// ----- basic.dual ------------------------------------------------------------
$(document).delegate('a[data-widget="basic.dual"]', { 
	'update': function(event, response) {
		$('#' + this.id + ' img').attr('src', (response == $(this).attr('data-val-on') ? $(this).attr('data-pic-on') : $(this).attr('data-pic-off')));
    },

	'click': function(event) {
		if ($('#' + this.id + ' img').attr('src') == $(this).attr('data-pic-off') ) {
			io.write($(this).attr('data-item'), $(this).attr('data-val-on')); 
		} else {
      		io.write($(this).attr('data-item'), $(this).attr('data-val-off'));
		}
	}
});


// ----- basic.shutter ---------------------------------------------------------
$(document).delegate('div[data-widget="basic.shutter"]', { 
	'update': function(event, response) {
		// response is: {{ gad_pos }}, {{ gad_angle }}
        
		var a = 13;
        var mode = ($(this).attr('data-mode') == 'half' ? 0.5 : 1);
        if (response[1] !== undefined) {
            a = parseInt(13 / mode * (response[1] / $(this).attr('data-max') + mode - 1));
        }
     
        var style;
            
        h = parseInt(response[0] * 13 * 14 / $(this).attr('data-max') );
        for (var i = 12; i >= 1; i--) {
            if (h >= 14) {
                var w = 13 - Math.abs(a);
                style  = 'height: ' + ((h > i * 14) && a == 13 ? (14 - w) : (15 - w)) + 'px;';
                
                if (a != 13)
                    style += 'margin-top: ' + (h - 15 >= 14 ? w : parseInt(w / 2)) + 'px;';
                else
                    style += 'border-top: 1px dotted ' + (h > i * 14 ? '#ccc' : '#333') + ';';
               
                if (a > 0)
                    $('#' + this.id + '-' + i).attr('class', 'blade-pos');
                else
                    $('#' + this.id + '-' + i).attr('class', 'blade-neg');
                
                $('#' + this.id + '-' + i).attr('style', style);
                h = h - 15;
            }
            else {
                style  = 'height: ' + h + 'px;';
                style += 'border-top: 1px dotted #aaa;';
                $('#' + this.id + '-' + i).attr('style', style);
                h = 1;
            }
        }
    },

	'click': function(event) {
        var offset = $(this).offset();
        var x = Math.round(event.pageX - offset.left);
        var y = (event.pageY - offset.top);
        var val = Math.floor((y / 160 - 10 / 160) * $(this).attr('data-max') / $(this).attr('data-step')) * $(this).attr('data-step');
            val = Math.max( $(this).attr('data-min'), Math.min(val, $(this).attr('data-max')) );
        
		var items = $(this).attr('data-item').split(',');
		if (items[1].trim() !='' && x > 52)
			io.write(items[1].trim(), val);
		else
			io.write(items[0].trim(), val);
	}
});


// ----- basic.rgb -------------------------------------------------------------
$(document).delegate('a[data-widget="basic.rgb"]', { 
	'update': function(event, response) {
		// response is: {{ gad_r }}, {{ gad_g }}, {{ gad_b }}
        
		var max = $(this).attr('data-max');
		$('#' + this.id + ' span').css('background-color', 'rgb(' + Math.round(response[0] / max * 255) + ',' + Math.round(response[1] / max * 255) + ',' + Math.round(response[2] / max * 255) + ')');  
    },
});

$(document).delegate('div[data-widget="basic.rgb-popup"] > div', { 
    'click': function(event) {
        var rgb = $(this).css('background-color');
            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/); 
        
        var max = $(this).parent().attr('data-max');
        var items = $(this).parent().attr('data-item').split(',');
        
        io.write(items[0].trim(), Math.round(rgb[1] / 255 * max ));
        io.write(items[1].trim(), Math.round(rgb[2] / 255 * max ));
        io.write(items[2].trim(), Math.round(rgb[3] / 255 * max ));   
        
        $(this).parent().popup('close'); 
    },
    
    'hover': function(event) {
        if( event.type === 'mouseenter' )  
            $(this).addClass("ui-focus");
        else
            $(this).removeClass("ui-focus"); 
    }
});


// ----- basic.tank -------------------------------------------------------------
$(document).delegate('div[data-widget="basic.tank"]', { 
	'update': function(event, response) {
		$('#' + this.id + ' div').css('height', Math.round(Math.min(response / $(this).attr('data-max'), 1) * 180));  
    }
});
