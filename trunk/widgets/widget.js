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
    *  Static function for exploding the a text with comma-seperated values into unique array  
    *       
    *  @return     the values as array  
    */        
	explode: function(text) {
	    var ret = Array();
		var unique = Array();

    	// More than one item?
		if (text.indexOf(',') >= 0) {
			var parts = text.explode();

			for (var i = 0; i < parts.length; i++) {
				if (parts[i] != '')
					unique[parts[i]] = '';
			}
		} 
		// One item
		else if (text != '') {
			unique[text] = '';
		};
		
		for (var part in unique)     
            ret.push(part);

		return ret;   
    },

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
    * 
    * @param	retain only widgets with special data-entity attribute
    */         
	listeners: function(entity) {
		var ret = Array();
		var unique = Array();

		//$('[data-item]' + ((type !== undefined) ? ' [data-type]="' + type + '"' : '') ).each(function(idx) {
		$('[data-item]').each(function(idx) {
			if (entity == $(this).attr('data-entity')) {
				var items = widget.explode($(this).attr('data-item')); 
				for (var i = 0; i < items.length; i++)
					unique[items[i]] = '';
			}
		}); 

		for (var item in unique)     
            ret.push(item);

        return ret;       
    },

  /**
    * List all items and the number of listeners in console.log
    */         
	list: function() {
	    var widgets = 0;
		$('[data-item]').each(function(idx) {
			if ($(this).attr('data-item').trim() != '') {
		    	console.log("[widget] '" + this.id + "' listen on '" + $(this).attr('data-item') + "'");
            	widgets++;
			}
    	});
        console.log("[widget] --> " + widgets + " listening.");
    },
    
  /**
    * Checks if all item/s defined in the buffer
    * 
    * @param    the item/s 
    */         
	check: function(items) {

		if (items instanceof Array) {
			for (var i = 0; i < items.length; i++)
				if (items[i] === undefined)
					return false;
		} else
			if (widget.buffer[items] === undefined)
				return false;
		
		return true;
	},

  /**
    * Get one or more value/s for an item/s from the buffer
    * 
    * @param    the item/s 
    */         
	get: function(items) {

		if (items instanceof Array) {
        	var ret = Array();

			for (var i = 0; i < items.length; i++) { 
				ret.push(widget.buffer[items[i]]);
			}
		} else
			var ret = widget.buffer[items]; 
		
		return ret;
	},

  /**
    * Set a value of an item in the buffer
    * 
    * @param    an item 
    * @param	the value        
    */         
	set: function(item, val) {

		if (val !== undefined) {
            widget.buffer[item] = val;
			// console.log("[widget] '" + item + "' -> '" + widget.buffer[item] + "'");
		}
	},

  /**
    * Update an item and all widgets listening on that
    * 
    * @param    the item 
    * @param	the value        
    */         
    update: function(item, val) {
        
		// update if value has changed
		if (widget.buffer[item] !== val || val === undefined) {
			widget.set(item, val);
		    
			$('[data-item*="' + item + '"]').each(function(idx) {
				var items = widget.explode($(this).attr('data-item')); 

				// only the item witch is been updated
				for (var i = 0; i < items.length; i++) { 
					var values = widget.get(items);
			
		        	if (items[i] == item && widget.check(values)) {
						$(this).trigger('update', [values]);
				}}
			});
		}
	},

  /**
    * Refreshes all widgets on the current page
    */ 
	refresh: function() {             
		$('[id^="' + $.mobile.activePage.attr('id') + '-"][data-item]').each(function(idx) {
			var items = widget.get(widget.explode($(this).attr('data-item'))); 
			if (widget.check(items))
				$(this).trigger('update', [items]);
		})
	},

  /**
    *  Returns the widgets with plot functionality 
    *       
    *  @return     jQuery Objectlist    
    */        
	plot: function(item) {
	   	var ret = $();
		
		if (item) {
    		$('[data-widget*="plot."][data-item*="' + item + '"]').each(function(idx) {
				var items = widget.explode($(this).attr('data-item')); 

				for (var i = 0; i < items.length; i++) { 
                	if (items[i] == item) {
						ret = ret.add(this);
				}};
			})
		} else
			ret = $('[data-widget*="plot."][data-item]'); 
      
        return ret;   
    }
} 




// -----------------------------------------------------------------------------
// W I D G E T   D E L E G A T E   F U N C T I O N S
// -----------------------------------------------------------------------------



// ----- b a s i c -------------------------------------------------------------
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
  		$(this).prop('checked', response != 0).checkboxradio('refresh');
    },

	'change': function(event) {
	    // DEBUG: console.log("[basic.checkbox] click item: " + $(this).attr('data-item') + " val: " + $(this).prop("checked")); 
		io.write($(this).attr('data-item'), ($(this).prop('checked') ? 1 : 0)); 
	}
});    


// ----- basic.flip ------------------------------------------------------------
$(document).delegate('select[data-widget="basic.flip"]', { 
	'update': function(event, response) {
		$(this).val(response > 0 ? 'on' : 'off').slider('refresh');
    },

	'change': function(event) {
	    // DEBUG: console.log("[basic.flip] click item: " + $(this).attr('data-item') + " val: " + $(this).val());  
		io.write($(this).attr('data-item'), ($(this).val() == 'on' ? 1 : 0));
	}
});


// ----- basic.silder ----------------------------------------------------------
// The slider had to be handled in a more complex manner. A 'lock' is used
// to stop the change after a refresh. And a timer is used to fire the trigger
// only every 400ms if it was been moved. There should be no trigger on init.
$(document).delegate('input[data-widget="basic.slider"]', {
	'update': function(event, response) {
		// DEBUG: console.log("[basic.slider] update val: " + response + " timer: " + $(this).attr('timer') + " lock: " + $(this).attr('lock'));   

		$(this).attr('lock', 1); 
	    $('#' + this.id).val(response).slider('refresh');
		$('#' + this.id).attr('mem', $(this).val());
    },

	'slidestop': function(event) {
		if ($(this).val() != $(this).attr('mem')) {
			$(this).trigger('click'); 
    	}
   	},

	'change': function(event) {
        // DEBUG: console.log("[basic.slider] change val: " + $(this).val() + " timer: " + $(this).attr('timer') + " lock: " + $(this).attr('lock'));   

        if( ( $(this).attr('timer') === undefined || $(this).attr('timer') == 0 && $(this).attr('lock') == 0 )
			&& ($(this).val() != $(this).attr('mem')) ) {
			
			if ($(this).attr('timer') !== undefined)
				$(this).trigger('click');
			
			$(this).attr('timer', 1);
			setTimeout("$('#" + this.id + "').attr('timer', 0);", 400);
		}

		$(this).attr('lock', 0);
    },

	'click': function(event) {             
		io.write($(this).attr('data-item'), $(this).val());  
	} 
}); 


// ----- basic.symbol ----------------------------------------------------------
$(document).delegate('span[data-widget="basic.symbol"]', { 
	'update': function(event, response) {

		// response will be an array, if more then one item is requested 
        var bit = ($(this).attr('data-mode') == 'and');
        if (response instanceof Array) {
            for(var i = 0; i < response.length; i++) {
                if ($(this).attr('data-mode') == 'and')
                    bit = bit && (response[i] == $(this).attr('data-val'));
	            else
                    bit = bit || (response[i] == $(this).attr('data-val'));
            }
        }
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
        var items = $(this).attr('data-item').explode();
        
		if ($('#' + this.id + ' img').attr('src') == $(this).attr('data-pic-off') ) {
			io.write(items[0], 1); 
	    } else {
      		io.write(items[0], 0);
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
            val = val.limit($(this).attr('data-min'), $(this).attr('data-max'), 1);
        
		var items = $(this).attr('data-item').explode();
		if (items[1] !='' && x > 52)
			io.write(items[1], val);
		else
			io.write(items[0], val);
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
        var items = $(this).parent().attr('data-item').explode();
        
        io.write(items[0], Math.round(rgb[1] / 255 * max ));
        io.write(items[1], Math.round(rgb[2] / 255 * max ));
        io.write(items[2], Math.round(rgb[3] / 255 * max ));   
        
        $(this).parent().popup('close'); 
    },
    
    'mouseenter': function(event) {
		$(this).addClass("ui-focus");
	},

    'mouseleave': function(event) {
		$(this).removeClass("ui-focus");
	}
});


// ----- basic.colordisc -------------------------------------------------------
$(document).delegate('a[data-widget="basic.colordisc"]', { 
	'update': function(event, response) {
		// response is: {{ gad_r }}, {{ gad_g }}, {{ gad_b }}
        
		var max = $(this).attr('data-max');
		$('#' + this.id + ' span').css('background-color', 'rgb(' + Math.round(response[0] / max * 255) + ',' + Math.round(response[1] / max * 255) + ',' + Math.round(response[2] / max * 255) + ')');  
    },

    'click': function(event) {
		$('#' + this.id + '-screen').removeClass('hide');
		$('#' + this.id + '-screen').addClass('in');

		// reposition canvas
		var offset = $(this).offset();
        var disc = $('#' + this.id + '-disc');
		var top = offset.top - (disc.height() / 2) + 15;
		var left = offset.left - (disc.width() / 2) + 25;
		
		disc.css('top', top.limit(5, $(window).height() + $(document).scrollTop() - disc.height() - 5, 1) );
		disc.css('left', left.limit(5, $(window).width() - disc.width() - 5, 1) );
		disc.show();
    }
});

$(document).delegate('div[data-widget="basic.colordisc"]', { 
	'click': function(event) {
		var uid = this.id.substr(0, this.id.length - 7);

		$('#' + uid + '-disc').hide(); 

		$('#' + uid + '-screen').removeClass('in');
		$('#' + uid + '-screen').addClass('hide');	
	}
});

$(document).delegate('canvas[data-widget="basic.colordisc"]', { 
    'click': function(event) {
		var uid = this.id.substr(0, this.id.length - 5);
		var disc = $(this)[0];
		var ctx = disc.getContext("2d");
	   	
		var offset = $(this).offset();
        var x = Math.round(event.pageX - offset.left);
        var y = Math.round(event.pageY - offset.top);
        var rgb = ctx.getImageData(x, y, 1, 1).data;
	    // DEBUG: console.log([rgb[0], rgb[1], rgb[2]]);
		
		var max = $('#' + uid).attr('data-max');
        var items = $('#' + uid).attr('data-item').explode();
        
        io.write(items[0], Math.round(rgb[0] / 255 * max ));
        io.write(items[1], Math.round(rgb[1] / 255 * max ));
        io.write(items[2], Math.round(rgb[2] / 255 * max ));   
        
        $(this).hide(); 
    
		$('#' + uid + '-screen').removeClass('in');
		$('#' + uid + '-screen').addClass('hide');	
	}
});


// ----- basic.tank ------------------------------------------------------------
$(document).delegate('div[data-widget="basic.tank"]', { 
	'update': function(event, response) {
		$('#' + this.id + ' div').css('height', Math.round(Math.min(response / $(this).attr('data-max'), 1) * 180));  
    }
});


// ----- basic.notify ----------------------------------------------------------
$(document).delegate('span[data-widget="basic.notify"]', { 
	'update': function(event, response) {
		// response is: {{ gad_trigger }}, {{ gad_message }}

		if (response[0] != 0) {
	        notify.add($(this).attr('data-mode'), $(this).attr('data-signal'), $('#' + this.id + ' h1').html(), 
				'<b>' + response[1] + '</b><br />' + $('#' + this.id + ' p').html());
	        notify.display();
    	}
	}
});



// ----- d e v i c e -----------------------------------------------------------
// -----------------------------------------------------------------------------

// ----- device.rtr ------------------------------------------------------------
$(document).delegate('div[data-widget="device.rtr"] > div > a[data-icon="minus"]', {
	'click': function(event, response) {
		var uid = $(this).parent().parent().attr('id');
		var step = $('#' + uid).attr('data-step');
		var item = $('#' + uid + 'set').attr('data-item');

		var temp = (Math.round((widget.get(item) - step) * 10) / 10).toFixed(1);
        io.write(item, temp);
    },
});

$(document).delegate('div[data-widget="device.rtr"] > div > a[data-icon="plus"]', {
	'click': function(event, response) {
		var uid = $(this).parent().parent().attr('id');
		var step = $('#' + uid).attr('data-step');
		var item = $('#' + uid + 'set').attr('data-item');

		var temp = (Math.round((widget.get(item) * 1 + step * 1) * 10) / 10).toFixed(1);
        io.write(item, temp);
    },
});



// ----- p l o t ---------------------------------------------------------------
// -----------------------------------------------------------------------------

// ----- plot.period -----------------------------------------------------------
$(document).delegate('div[data-widget="plot.period"]', { 
	'update': function(event, response) {
		// response is: [ [ [t1, y1], [t2, y2] ... ], [ [t1, y1], [t2, y2] ... ], ... ] 
	 	// DEBUG: console.log("[plot.series] update '" + this.id + "' with "); console.log(response);
		
		var label = $(this).attr('data-label').explode();
		var color = $(this).attr('data-color').explode();
		var exposure = $(this).attr('data-exposure').explode();
		
		var series = Array();
		for (var i = 0; i < response.length; i++) { 
			series[i] = {
				type: (exposure[i] != '' ? exposure[i] : 'line'),
				name: label[i],
				data: response[i],
				color: (color[i] != '' ? color[i] : null)
		}};
	
		$('#' + this.id).highcharts({
            series: series,
 		    xAxis: { type: 'datetime' },
		   	yAxis: { min: $(this).attr('data-min'), max: $(this).attr('data-max') }
        });
    }
});


// ----- plot.rtr -----------------------------------------------------------
$(document).delegate('div[data-widget="plot.rtr"]', { 
	'update': function(event, response) {
		// response is: {{ gad_actual }}, {{ gad_set }} 
	 	
		var label = $(this).attr('data-label').explode();
		
		$('#' + this.id).highcharts({
            chart: { type: 'line' },
			series: [{ 
				name: label[0],
				data: response[0],
			} , {
				name: label[1],
				data: response[1],
				dashStyle: 'shortdot',
				
			}],
 		    xAxis: { type: 'datetime' },
		   	yAxis: { min: $(this).attr('data-min'), max: $(this).attr('data-max'),
				title: { text: 'Temperature' } },
			tooltip: { valueSuffix: '°'}
        });
    }
});



$(document).delegate('div[data-widget="xxplot.period"]', { 
	'update': function(event, response) {
		// response is: [ [ [t1, y1], [t2, y2] ... ], [ [t1, y1], [t2, y2] ... ], ... ] 
	 	// DEBUG: console.log("[plot.series] update '" + this.id + "' with "); console.log(response);
		
		var step = $(this).attr('data-step'); 
		var label = $(this).attr('data-label').explode();
		var color = $(this).attr('data-color').explode();
		var exposure = $(this).attr('data-exposure').explode();
		
		var plots = Array();
		for (var i = 0; i < response.length; i++) { 
			plots[i] = {
				data: response[i],
				label: (label[i] !== undefined ? label[i] : null),
				color: (color[i] !== undefined ? color[i] : null),
				lines:  { 
					show: (exposure[i] == 'lines' || exposure[i] == 'steps' || exposure[i] == '' || exposure[i] === undefined), 
					steps: (exposure[i] == 'steps')
				},
				bars: 	{ show: (exposure[i] == 'bars'), align: 'center', barWidth: step * 750 },
				points: { show: (exposure[i] == 'points'), radius: 1 }
			};
		};

		var options = {
			xaxis: { mode: "time", timezone: "browser", font: { color: '#999' } },
            yaxis: { min: $(this).attr('data-min'), max: $(this).attr('data-max'), font: { color: '#999' } },   
			legend: { position: 'nw', backgroundOpacity: 0 }
		};

	    $.plot('#' + this.id, plots, options);
    }
});

// ----- plot.comfortchart -----------------------------------------------------
$(document).delegate('div[data-widget="plot.comfortchart"]', { 
	'update': function(event, response) {
		// response is: {{ gad_trigger }}, {{ gad_message }}
		
       	var color = $(this).attr('data-color').explode();
		var plots = Array();
		
		plots[0] = {
			data: [ [17, 35, 35], [16, 75, 35], [17, 85, 35], [21, 80, 35], [25, 60, 35], [27, 35, 35] ],
			 label: 'almost nice', color: color[1], lines: { show: true, fill: true }
		};

		plots[1] = {
			data: [ [17, 35, 35], [20, 20, 35], [25, 19, 35], [27, 35, 35] ],
			color: color[1], lines: { show: true, fill: true }
		};

		plots[2] = {
			data: [ [18, 50, 50], [17, 75, 50], [22.5, 65, 50], [23.7, 50, 50] ],
			label: 'comfortable',  color: color[0], lines: { show: true, fill: true }
		};

		plots[3] = {
			data: [ [18, 50, 50], [18.5, 35, 50], [25, 33, 50], [23.7, 50, 50] ],
			color: color[0], lines: { show: true, fill: true }
		};

		plots[4] = {
			data: [ [response[0], response[1]] ], 
			color: '#fff', points: { show: true,  fill: false, radius: 4 }
		};
		
		var options = {
			xaxis: { min: 10, max: 35, font: { color: '#999' } },
            yaxis: { min: 0, max: 100, font: { color: '#999' } }, 
			legend: { position: 'se', backgroundOpacity: 0 }  
		};

	    $.plot('#' + this.id, plots, options);
    }
});