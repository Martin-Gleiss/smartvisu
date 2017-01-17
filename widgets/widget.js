/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiss, Stefan Widmer
 * @copyright   2012 - 2016
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

/**
 * Class for controlling all widgets.
 *
 * Concept:
 * --------
 * Every item has a name. The value of the item may be of type: int, float, or
 * array. The items are stored in the widget.buffer. The drivers will fill the
 * buffer through the widget.update (and therefore widget.set). Asynchronly
 * all widgets on a page may be updated. The update is been triggerd from
 * widget.update, if a item has been changed. Updates are only made if all
 * items are in buffer needed for that update. If one is missing the update is
 * not been made. If some plots placed on the page, the update will look if it
 * is possible to add only one point (if the widget is already initialized).
 *
 * Events:
 * -------
 * Some new events are introduced to control the widgets and there visual
 * appearance.
 *
 * 'update': function(event, response) { }
 * Triggered through widget.update if a item has been changed.
 *
 * 'draw': function (event) { }
 * Triggered only for svgs, if it is loaded
 *
 * 'point': function(event, response) { }
 * Triggered only for plots through widget.update if the plot is already drawn
 * and only a new point has to be added to the series.
 *
 * 'repeat': function(event) { }
 * Triggerd after the specified time, when 'data-repeat' ist been used.
 *
 * 'change', 'click' ...
 * Standard jquery-mobile events, triggered from the framework.
 *
 */


$(document).on('pagecreate', function (bevent, bdata) {

// ----- f u n c t i o n s ----------------------------------------------------
// ----------------------------------------------------------------------------

	var colorizeText = function(widget, value) {
		var currentIndex = null, currentThreshold = null;
		if(!isNaN(value)) {
			$.each($(widget).attr('data-thresholds').explode(), function(index, threshold) {
				if(threshold == '' && currentThreshold == null) {
					currentIndex = index;
				}
				else if(parseFloat(threshold) <= parseFloat(value) && (currentThreshold == null || currentThreshold <= parseFloat(threshold))) {
					currentThreshold = parseFloat(threshold);
					currentIndex = index;
				}
			});
		}

		var color = (currentIndex == null) ? '' : $(widget).attr('data-colors').explode()[currentIndex];
		if(color == '' || color == 'icon0')
			$(widget).removeClass('icon1').css('color','');
		else if (color == 'icon1')
			$(widget).addClass('icon1').css('color','');
		else
			$(widget).removeClass('icon1').css('color',color);
	}

// ----- b a s i c ------------------------------------------------------------
// ----------------------------------------------------------------------------

	// ----- basic.checkbox -------------------------------------------------------
	$(bevent.target).find('input[data-widget="basic.checkbox"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			$(this).prop('checked', response != 0).checkboxradio('refresh');
		},

		'change': function (event) {
			// DEBUG: console.log("[basic.checkbox] change '" + this.id + "':", $(this).prop("checked"));
			io.write($(this).attr('data-item'), ($(this).prop('checked') ? 1 : 0));
		}
	});

	// ----- basic.colordisc ------------------------------------------------------
	$(bevent.target).find('a[data-widget="basic.colordisc"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_r }}, {{ gad_g }}, {{ gad_b }}

			var max = $(this).attr('data-max');
			$(this).find('span').css('background-color', 'rgb(' + Math.round(response[0] / max * 255) + ',' + Math.round(response[1] / max * 255) + ',' + Math.round(response[2] / max * 255) + ')');
		},

		'click': function (event) {
			// reposition canvas
			var offset = $(this).offset();
			var disc = $(this).siblings('canvas');
			var top = offset.top - (disc.height() / 2) + 15;
			var left = offset.left - (disc.width() / 2) + 25;

			disc.css('top', top.limit(5, $(window).height() + $(document).scrollTop() - disc.height() - 5, 1));
			disc.css('left', left.limit(5, $(window).width() - disc.width() - 5, 1));

			disc.show();
			$(this).siblings('div').show();
		}
	});

	$(bevent.target).find('div[data-widget="basic.colordisc"]').on( {
		'click': function (event) {
			$(this).hide();
			$(this).siblings('canvas').hide();
		}
	});

	$(bevent.target).find('canvas[data-widget="basic.colordisc"]').on( {
		'click': function (event) {
			var disc = $(this)[0];
			var ctx = disc.getContext("2d");

			var offset = $(this).offset();
			var x = Math.round(event.pageX - offset.left);
			var y = Math.round(event.pageY - offset.top);
			var rgb = ctx.getImageData(x, y, 1, 1).data;
			// DEBUG: console.log([rgb[0], rgb[1], rgb[2]]);

			var max = $(this).siblings('a').attr('data-max');
			var items = $(this).siblings('a').attr('data-item').explode();

			io.write(items[0], Math.round(rgb[0] / 255 * max));
			io.write(items[1], Math.round(rgb[1] / 255 * max));
			io.write(items[2], Math.round(rgb[2] / 255 * max));

			$(this).siblings('div').hide();
			$(this).hide();
		}
	})
	.each(function () { // init canvas
		var colors = parseFloat($(this).attr('data-colors'));
		var size = 280;
		var canvas = $(this)[0];
		var step = 100 / ($(this).attr('data-step') / 2);

		var arc = Math.PI / (colors + 2) * 2;
		var startangle = -(Math.PI / 2) + arc;
		var gauge = (size - 10) / 16 / ($(this).attr('data-step') / 8);
		var share = 360 / colors;
		var ctx;

		canvas.width = size;
		canvas.height = size;

		if (canvas.getContext) {
			var center = size / 2 - 1;
			ctx = canvas.getContext("2d");

			// draw background
			ctx.beginPath();
			ctx.fillStyle = '#888';
			ctx.shadowColor = 'rgba(96,96,96,0.4)';
			ctx.shadowOffsetX = 2;
			ctx.shadowOffsetY = 2;
			ctx.shadowBlur = 4;
			ctx.arc(center, center, size / 2 - 1, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.beginPath();
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 0;
			ctx.fillStyle = '#555';
			ctx.arc(center, center, size / 2 - 2, 0, 2 * Math.PI, false);
			ctx.fill();

			// draw colors
			var v, s;

			for (var i = 0; i <= colors; i++) {
				var angle = startangle + i * arc;
				var ring = 1;
				var h = i * share;
				for (v = step; v <= 100; v += step) {
					ctx.beginPath();
					ctx.fillStyle = fx.hsv2rgb(h, 100, v);
					ctx.arc(center, center, ring * gauge + gauge + 1, angle, angle + arc + 0.01, false);
					ctx.arc(center, center, ring * gauge, angle + arc + 0.01, angle, true);
					ctx.fill();
					ring += 1;
				}
				for (s = (100 - step); s >= step; s -= step) {
					ctx.beginPath();
					ctx.fillStyle = fx.hsv2rgb(h, s, 100);
					ctx.arc(center, center, ring * gauge + gauge + 1, angle, angle + arc + 0.01, false);
					ctx.arc(center, center, ring * gauge, angle + arc + 0.01, angle, true);
					ctx.fill();
					ring += 1;
				}
			}

			// draw grey
			i -= 1;
			angle = startangle + i * arc;
			ring = 1;
			h = i * share;
			for (v = step; v <= 100; v += (step / 2)) {
				ctx.beginPath();
				ctx.fillStyle = fx.hsv2rgb(h, 0, v);
				ctx.arc(center, center, ring * gauge + gauge + 1, angle, angle + 2 * arc + 0.01, false);
				ctx.arc(center, center, ring * gauge, angle + 2 * arc + 0.01, angle, true);
				ctx.fill();
				ring += 1;
			}

			// draw center
			ctx.beginPath();
			ctx.fillStyle = 'rgb(0,0,0)';
			ctx.arc(center, center, gauge + 1, 0, 2 * Math.PI, false);
			ctx.fill();
		}
	});

	// ----- basic.maptext --------------------------------------------------------
	$(bevent.target).find('span[data-widget="basic.maptext"]').on( {
		'update': function (event, response) {
			var txt_arr = widget.explode($(this).attr('data-txt'));
			var val_arr = widget.explode($(this).attr('data-val'));
			var index = $.inArray(String(response), val_arr);
			var match = txt_arr[index];
			$(this).text(match);
		}
	});

	// ----- basic.flip -----------------------------------------------------------
	$(bevent.target).find('select[data-widget="basic.flip"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			$(this).val(response > 0 ? 'on' : 'off').flipswitch('refresh');
		},

		'change': function (event) {
			// DEBUG: console.log("[basic.flip] change '" + this.id + "':", $(this).val());
			io.write($(this).attr('data-item'), ($(this).val() == 'on' ? 1 : 0));
		}
	});

	// ----- basic.float ----------------------------------------------------------
	$(bevent.target).find('[data-widget="basic.float"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			if ($(this).attr('data-unit') != '') {
				$(this).html(parseFloat(response).transUnit($(this).attr('data-unit')));
			}
			else {
				$(this).html(parseFloat(response).transFloat());
			}
			colorizeText(this, response);
		}
	});

	// ----- basic.formula ----------------------------------------------------------
	$(bevent.target).find('[data-widget="basic.formula"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			var calc = 0;
			var pos = 0;
			var unit = $(this).attr('data-unit');
			var mode = $(this).attr('data-formula').substring(0, 3); // functions SUM, AVG, SUB only used, if they are the first 3 chars in formula string
			var formula = $(this).attr('data-formula');

			if (unit == 'date' || unit == 'time' || unit == 'short' || unit == 'long') {
				var date = new Date(response[0]);
				$(this).html(date.transUnit(unit));
			}
			else {
				if (formula.indexOf('VAR1') > -1) {
					for (var i = 0; i < response.length; i++) {
						formula = formula.replace(new RegExp('VAR' + (i + 1), "g"), response[i]);
					}
					calc = eval(formula);
				}
				else {
					if (mode == 'SUB') {
						calc = response[pos];
						pos++;
					}

					for (var i = pos; i < response.length; i++) {
						if (mode == 'SUB') {
							calc = calc - response[i];
						}
						else {
							calc = calc + response[i];
						}
					}

					if (mode == 'AVG') {
						calc = calc / i;
					}

					if (mode != '') {
						calc = eval(formula.replace(/VAR/g, calc).replace(/AVG/g, '').replace(/SUM/g, '').replace(/SUB/g, ''));
					}
				}

				$(this).html(parseFloat(calc).transUnit(unit));
			}

			colorizeText(this, calc);
		}
	});

	// ----- basic.print ----------------------------------------------------------
	$(bevent.target).find('[data-widget="basic.print"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			
			var format = $(this).attr('data-format');
			var formatLower = format.toLowerCase();
			var formula = $(this).attr('data-formula');
			
			var type;
			if (formatLower == 'date' || formatLower == 'time' || formatLower == 'short' || formatLower == 'long')
				type = 'Date';
			else if (formatLower == 'text' || formatLower == 'html')
				type = 'String';
			else
				type = 'Number';
		
			var replacements = { SUM: 0, CONCAT: [], '\\(\\s*VAR\\s*\\)': '' }; // Key is RegEx
			$.each(response, function(i, value) {
				if(type == 'String') {
					value = '"' + String(value).replace(/(\\")/, '\\$1') + '"';
					replacements.CONCAT.push(value);
				}
				else if(type == 'Date')
					value = new Date(value);
				else
					value = parseFloat(value);
				
				replacements['VAR'+(i+1)] = value;
				
				replacements.SUM += value;
				if(replacements.MIN === undefined || replacements.MIN > value)
					replacements.MIN = value;
				if(replacements.MAX === undefined || replacements.MAX < value)
					replacements.MAX = value;
			});
			
			if(type == 'String')
				replacements.SUM = replacements.CONCAT = replacements.CONCAT.join('+" "+');
			else {
				replacements.SUB = 2 * response[0] - replacements.SUM; // difference equals to two times first value minus sum, because sum contains first value
				replacements.AVG = replacements.SUM / response.length;
			}
			
			$.each(replacements, function(placeholder, value) {
				formula = formula.replace(new RegExp(placeholder + '(\\D|$)' , 'g'), value + '$1');
			});
			
			var calc = eval(formula);
			
			if(type == 'Date')
				calc = new Date(calc).transUnit(format);
			else if (type == 'Number')
				calc = parseFloat(calc).transUnit(format);
		
			// print the result
			if (formatLower == 'html')
				$(this).html(calc);
			else
				$(this).text(calc);

			colorizeText(this, calc);
		}
	});

	// ----- basic.rgb ------------------------------------------------------------
	$(bevent.target).find('a[data-widget="basic.rgb"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_r }}, {{ gad_g }}, {{ gad_b }}

			var max = $(this).attr('data-max');
			$(this).find('span').css('background-color', 'rgb(' + Math.round(response[0] / max * 255) + ',' + Math.round(response[1] / max * 255) + ',' + Math.round(response[2] / max * 255) + ')');
		}
	});

	$(bevent.target).find('div[data-widget="basic.rgb-popup"] > div').on( {
		'click': function (event) {
			var rgb = $(this).css('background-color');
			rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

			var max = $(this).parent().attr('data-max');
			var items = $(this).parent().attr('data-item').explode();

			io.write(items[0], Math.round(rgb[1] / 255 * max));
			io.write(items[1], Math.round(rgb[2] / 255 * max));
			io.write(items[2], Math.round(rgb[3] / 255 * max));

			$(this).parent().popup('close');
		},

		'mouseenter': function (event) {
			$(this).addClass("ui-focus");
		},

		'mouseleave': function (event) {
			$(this).removeClass("ui-focus");
		}
	});

	// ----- basic.shifter ---------------------------------------------------------
	$(bevent.target).find('span[data-widget="basic.shifter"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var step = Math.min((response[0] / $(this).attr('data-max') * 10 + 0.49).toFixed(0) * 10, 100);

			if (response[1] != 0 && step > 0) {
				$(this).find('img').attr('src', $(this).attr('data-pic-on').replace('00', step));
			}
			else {
				$(this).find('img').attr('src', $(this).attr('data-pic-off'));
			}
		},

		'click': function (event) {
			var items = $(this).attr('data-item').explode();

			if ($(this).find('img').attr('src') == $(this).attr('data-pic-off')) {
				io.write(items[1], 1);
			}
			else {
				io.write(items[1], 0);
			}
		}
	});

	$(document).delegate('span[data-widget="basic.shifter"] > a > img', 'hover', function (event) {
		if (event.type === 'mouseenter') {
			$(this).addClass("ui-focus");
		}
		else {
			$(this).removeClass("ui-focus");
		}
	});

	// ----- basic.shutter --------------------------------------------------------
	$(bevent.target).find('div[data-widget="basic.shutter"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_pos }}, {{ gad_angle }}

			var a = 13;
			var mode = ($(this).attr('data-mode') == 'half' ? 0.5 : 1);
			if (response[1] !== undefined) {
				a = parseInt(13 / mode * (response[1] / $(this).attr('data-max') + mode - 1));
			}

			var style;

			var h = parseInt(response[0] * 13 * 14 / $(this).attr('data-max'));
			$.each($(this).find('.blade-pos, .blade-neg').get().reverse(), function(i) {
				if (h >= 14) {
					var w = 13 - Math.abs(a);
					style = 'height: ' + ((h > (12-i) * 14) && a == 13 ? (14 - w) : (15 - w)) + 'px;';

					if (a != 13) {
						style += 'margin-top: ' + (h - 15 >= 14 ? w : parseInt(w / 2)) + 'px;';
					}
					else {
						style += 'border-top: 1px dotted ' + (h > (12-i) * 14 ? '#ccc' : '#333') + ';';
					}

					if (a > 0) {
						$(this).attr('class', 'blade-pos');
					}
					else {
						$(this).attr('class', 'blade-pos');
					}
					
					$(this).attr('style', style);

					h = h - 15;
				}
				else {
					style = 'height: ' + h + 'px;';
					style += 'border-top: 1px dotted #aaa;';
					$(this).attr('style', style);
					h = 1;
				}
			});
		},

		'click': function (event) {
			var offset = $(this).offset();
			var x = Math.round(event.pageX - offset.left);
			var y = (event.pageY - offset.top);
			var val = Math.floor((y / 160 - 10 / 160) * $(this).attr('data-max') / $(this).attr('data-step')) * $(this).attr('data-step');
			val = val.limit($(this).attr('data-min'), $(this).attr('data-max'), 1);

			var items = $(this).attr('data-item').explode();
			if (items[1] != '' && x > 52) {
				io.write(items[1], val);
			}
			else {
				io.write(items[0], val);
			}
		},

		'mouseenter': function (event) {
			$(this).find('.control').fadeIn(400);
		},

		'mouseleave': function (event) {
			$(this).find('.control').fadeOut(400);
		}
	});

	// ----- basic.slider ---------------------------------------------------------
	// The slider had to be handled in a more complex manner. A 'lock' is used
	// to stop the change after a refresh. And a timer is used to fire the trigger
	// only every 400ms if it was been moved. There should be no trigger on init.
	$(bevent.target).find('input[data-widget="basic.slider"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// DEBUG: console.log("[basic.slider] update '" + this.id + "': " + response + " timer: " + $(this).attr('timer') + " lock: " + $(this).attr('lock'));
			$(this).attr('lock', 1);
			$(this).val(response).slider('refresh').attr('mem', $(this).val());
		},

		'slidestop': function (event) {
			if ($(this).val() != $(this).attr('mem')) {
				io.write($(this).attr('data-item'), $(this).val());
			}
		},

		'change': function (event) {
			// DEBUG: console.log("[basic.slider] change '" + this.id + "': " + $(this).val() + " timer: " + $(this).attr('timer') + " lock: " + $(this).attr('lock'));
			if (( $(this).attr('timer') === undefined || $(this).attr('timer') == 0 && $(this).attr('lock') == 0 )
				&& ($(this).val() != $(this).attr('mem'))) {

				if ($(this).attr('timer') !== undefined) {
					$(this).trigger('click');
				}

				$(this).attr('timer', 1);
				setTimeout(function(slider) { $(slider).attr('timer', 0); }, 400, this);
			}

			$(this).attr('lock', 0);
		},

		'click': function (event) {
			io.write($(this).attr('data-item'), $(this).val());
		}
	});

	// ----- basic.stateswitch ------------------------------------------------------
	$(bevent.target).find('span[data-widget="basic.stateswitch"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// get list of values
			var list_val = $(this).attr('data-vals').explode();
			// get received value
			var val = response.toString().trim();
			// hide all states and show the first corrseponding to value. If none corrseponds, the first will be shown by using .addBack(':first') and .last()
			$(this).next('a[data-widget="basic.stateswitch"][data-index]').insertBefore($(this).children('a:eq(' + $(this).next('a[data-widget="basic.stateswitch"][data-index]').attr('data-index') + ')'));
			$(this).after($(this).children('a[data-widget="basic.stateswitch"]').filter('[data-val="' + val + '"]:first').addBack(':first').last());
			// memorise the value for next use
			$(this).attr('data-value', val);
		}
	})
	.children('a[data-widget="basic.stateswitch"]').on( {
		'click': function (event) {
			var widget = $(this).prev('span[data-widget="basic.stateswitch"]')
			// get the list of values
			var list_val = widget.attr('data-vals').explode();
			// get the last memorised value
			var old_val = widget.attr('data-value');
			// get the index of the memorised value
			var old_idx = list_val.indexOf(old_val);
			// compute the next index
			var new_idx = (old_idx + 1) % list_val.length;
			// get next value
			var new_val = list_val[new_idx];
			// send the value to driver
			io.write(widget.attr('data-item'), new_val);
			// memorise the value for next use
			widget.attr('data-value', new_val);
		}
	})
	// init
	.end().each(function() {
		// replicate ui-last-child if last sibling of tag 'a' has it
		if($(this).children('a:last').hasClass('ui-last-child'))
			$(this).children('a').addClass('ui-last-child');
		// display first control as default
		$(this).after($(this).children('a[data-widget="basic.stateswitch"]:first'));
	});

	// ----- basic.symbol ---------------------------------------------------------
	$(bevent.target).find('span[data-widget="basic.symbol"]').on({
		'update': function (event, response) {
			event.stopPropagation();
			// response will be an array, if more then one item is requested
			var bit = ($(this).attr('data-mode') == 'and');
			if (response instanceof Array) {
				for (var i = 0; i < response.length; i++) {
					if ($(this).attr('data-mode') == 'and') {
						bit = bit && (response[i] == $(this).attr('data-val'));
					}
					else {
						bit = bit || (response[i] == $(this).attr('data-val'));
					}
				}
			}
			else {
				bit = (response == $(this).attr('data-val'));
			}

			$(this).find('img').attr('title', new Date());

			if (bit) {
				$(this).show();
			}
			else {
				$(this).hide();
			}
		}
	});

	// ----- basic.tank -----------------------------------------------------------
	$(bevent.target).find('div[data-widget="basic.tank"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			$(this).find('div').css('height', Math.round(Math.min(response / $(this).attr('data-max'), 1) * 180));
		}
	});

	// ----- basic.text -----------------------------------------------------------
	$(bevent.target).find('[data-widget="basic.text"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			$(this).html((response == $(this).attr('data-val-on') ? $(this).attr('data-txt-on') : $(this).attr('data-txt-off')));
		}
	});

	// ----- basic.trigger ---------------------------------------------------------
	$(bevent.target).find('a[data-widget="basic.trigger"]').on( {
		'click': function (event) {
			io.trigger($(this).attr('data-name'), $(this).attr('data-val'));
		}
	});

	// ----- basic.value ----------------------------------------------------------
	$(bevent.target).find('[data-widget="basic.value"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			var unit = $(this).attr('data-unit');

			if (unit == 'date' || unit == 'time' || unit == 'short' || unit == 'long') {
				var date = new Date(response);
				$(this).html(date.transUnit(unit));
				response = Number(new Date(response));
			}
			else if (unit != '' && !isNaN(response)) {
				$(this).html(parseFloat(response).transUnit(unit));
			}
			else {
				$(this).html(response);
			}

			colorizeText(this, response);
		}
	});

// ----- c l o c k ------------------------------------------------------------
// ----------------------------------------------------------------------------

	// init servertime offset on all clocks
	$(bevent.target).find('span[data-widget="clock.iconclock"], span[data-widget="clock.miniclock"], div.digiclock[data-widget="clock.digiclock"]').each(function() { // init
		var localtime = (window.performance !== undefined && window.performance.timing !== undefined && window.performance.timing.responseStart !== undefined) ? window.performance.timing.responseStart : Date.now();
		localtime = localtime + new Date().getTimezoneOffset()*60000;

		var servertime = $(this).attr('data-servertime');
		if(isNaN(servertime) || servertime == "")
			servertime = localtime;
		else
			servertime = Number(servertime) * 1000;

		$(this).data('offset', servertime - localtime);
	});

	// ----- clock.digiclock ------------------------------------------------------
	$(bevent.target).find('div.digiclock[data-widget="clock.digiclock"]').each(function() {
		$(this).digiclock({ svrOffset: Number($(this).data('offset')) });
	});
	
	$(bevent.target).find('div.digiweather[data-widget="clock.digiclock"]').each(function() {
		var node = $(this);
		$.getJSON($(this).attr("data-service-url"), function (data) {
			node.find('img').attr('src', 'lib/weather/pics/' + data.current.icon + '.png');
			node.find('.city').html(data.city);
			node.find('.cond').html(data.current.conditions);
			node.find('.temp').html(data.current.temp);
		});
	});

	// ----- clock.iconclock ------------------------------------------------------
	$(bevent.target).find('span[data-widget="clock.iconclock"]').on( {
		'repeat': function (event) {
			event.stopPropagation();

			var now = new Date(Date.now() - Number($(this).data('offset')));
			var minutes = Math.floor((now - now.setHours(0, 0, 0, 0)) / 1000 / 60);
			$(this).find('svg').trigger('update', [
				[minutes],
				[0]
			]);

			// DEBUG: console.log("[iconclock] '" + this.id + "'", minutes);
		}
	});

	// ----- clock.miniclock ------------------------------------------------------
	$(bevent.target).find('span[data-widget="clock.miniclock"]').on( {
		'repeat': function (event) {
			event.stopPropagation();

			var now = new Date(Date.now() - Number($(this).data('offset')));
			$(this).text(now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes());
		}
	})


// ----- d e v i c e ----------------------------------------------------------
// ----------------------------------------------------------------------------

	// ----- device.codepad -------------------------------------------------------
	$(bevent.target).find('div[data-widget="device.codepad"]').on( {
		'keyup': function (event) {
			if (event.keyCode == 13) {
				$(this).find('#' + this.id + '-ok').click();
			}
		},
		
		'click': function (event) {
			if (!$(this).attr('data-access')) {
				$(this).popup('open');
				$(this).val('').focus();
			}
		}
	});

	$(bevent.target).find('div[data-widget="device.codepad"] > div > a').on( {
		'click': function (event) {
			var node = $(this).parent().parent();
			var code = node.find('input');
			var key = $(this).attr('data-val');

			code.focus();

			if (key == "ok") {
				if (node.attr('data-val') == code.val().md5()) {
					// DEBUG: console.log('[device.codepad] ' + node.attr('id') + ' unlocked');
					$('[data-bind="' + node.attr('data-id') + '"]').attr('data-access', new Date().getTime()).removeClass('codepad');
					setTimeout(function () {
						$('[data-bind="' + node.attr('data-id') + '"]').attr('data-access', '').addClass('codepad');
					}, new Date().duration(node.attr('data-duration')).valueOf());
					node.popup("close");
					node.data("originally-clicked").trigger("click");
				}
				else {
					// DEBUG: console.log('[device.codepad] ' + node.attr('id') + ' wrong code ' + code.val());
					code.val('');
					node.addClass('ui-focus');
					setTimeout(function () {
						node.removeClass('ui-focus');
					}, 400);
				}
			}
			else if (key == "-") {
				code.val('');
			}
			else {
				code.val(code.val() + key);
			}
		}
	});

	// ----- device.rtr -----------------------------------------------------------
	$(bevent.target).find('div[data-widget="device.rtr"] > div > a[data-sign]').on( {
		'click': function (event, response) {
			var node = $(this).parent().parent();
			var step = node.attr('data-step') * $(this).attr('data-sign');
			var item = node.find('.temp span').attr('data-item');

			var temp = (Math.round((widget.get(item) * 1 + step) * 10) / 10).toFixed(1);
			io.write(item, temp);
		}
	});

	// ----- device.uzsu -----------------------------------------------------------
	// ----------------------------------------------------------------------------
	//
	// Neugestaltetes UZSU Widget zur Bedienung UZSU Plugin
	//
	// Darstellung der UZSU Einträge und Darstellung Widget in Form eine Liste mit den Einträgen
	// Umsetzung
	// (c) Michael Würtenberger 2014,2015,2016
	//
	//  APL 2.0 Lizenz
	//
	// Basis der Idee des dynamischen Popups übernommen von John Chacko
	// 		jQuery Mobile runtime popup
	// 		16. November 2012 · 0 Comments
	// 		http://johnchacko.net/?p=44
	//
	// ----------------------------------------------------------------------------
	// Basis der Architektur: document.update und document.click baut die handler in die Seite für das Popup ein.
	// document.update kopiert bei einem update die Daten aus dem Backend (per Websocket) in das DOM Element ("uzsu") ein
	// document.click übernimmt die Daten aus dem DOM Element in Variable des JS Bereichs und baut über runtimepopup
	// dynamisch header, body und footer des popup zusammen und hängt sie an die aktuelle seite an (append, pagecreate)
	// danach werden die Daten aus den Variablen in die Elemente der Seite kopiert. Die Elemente der Seite bilden immer
	// den aktuellen Stand ab und werden von dort in die Variablen zurückgespeichert, wenn notwendig (save, sort).
	// In der Struktur können Zeilen angehängt (add) oder gelöscht werden (del). Dies geschieht immer parallel in den Variablen
	// und den Elementen der Seite. Die Expertenzeilen werden immer sofort mit angelegt, sind aber zu Beginn nicht sichtbar.
	// Beim verlassen des Popups werden die dynamisch angelegten DOM Elemente wieder gelöscht (remove).
	//
	// Datenmodell: Austausch über JSON Element
	// 				{ 	"active" 	: bool,
	//					"list" 		: 					Liste von einträgen mit schaltzeiten
	//					[	"active"	:false,			Ist der einzelne Eintrag darin aktiv ?
	//						"rrule"		:'',			Wochen / Tag Programmstring
	//						"time"		:'00:00',		Uhrzeitstring des Schaltpunktes / configuration
	//						"value"		:0,				Wert, der gesetzt wird
	//						"event":	'time',			Zeitevent (time) oder SUN (sunrise oder sunset)
	//						"timeMin"	:'',			Untere Schranke SUN
	//						"timeMax"	:'',			Oberere Schranke SUN
	//						"timeCron"	:'00:00',		Schaltzeitpunkt
	//						"timeOffset":''				Offset für Schaltzeitpunkt
	//						"condition"	: 	{	Ein Struct für die Verwendung mit conditions (aktuell nur FHEM), weil dort einige Option mehr angeboten werden
	//											"deviceString"	: text	Bezeichnung des Devices oder Auswertestring
	//											"type"			: text	Auswertetype (logische Verknüpfung oder Auswahl String)
	//											"value"			: text	Vergleichwert
	//											"active"		: bool	Aktiviert ja/nein
	//										}
	//						"delayedExec": 	{	Ein Struct für die Verwendung mit delayed exec (aktuell nur FHEM), weil dort einige Option mehr angeboten werden
	//											"deviceString"	: text	Bezeichnung des Devices oder Auswertestring
	//											"type"			: text	Auswertetype (logische Verknüpfung oder Auswahl String)
	//											"value"			: text	Vergleichwert
	//											"active"		: bool	Aktiviert ja/nein
	//										}
	//						"holiday":		{
	//											"workday"	: bool	Aktiviert ja/nein
	//											"weekend" 	: bool	Aktiviert ja/nein
	//										}
	//					]
	//				}
	var uzsu = {
		//----------------------------------------------------------------------------
		// Funktionen für den Seitenaufbau
		//----------------------------------------------------------------------------
		uzsuBuildTableHeader: function(headline, designType, valueType, valueParameterList) {
			// Kopf und überschrift des Popups
			var tt = "";
			// hier kommt der Popup Container mit der Beschreibung ein Eigenschaften
			tt += 	"<div data-role='popup' data-overlay-theme='b' data-theme='a' class='messagePopup' id='uzsuPopupContent' data-dismissible = 'false' data-history='false' data-position-to='window'>" +
						"<button data-rel='back' data-icon='delete' data-iconpos='notext' class='ui-btn-right' id='uzsuClose'></button>" +
						"<div class='uzsuClear'>" +
							"<div class='uzsuPopupHeader'>" + headline + "</div>" +
							"<div class='uzsuTableMain' id='uzsuTable'>";
			return tt;
		},
		uzsuBuildTableRow: function(designType, valueType, valueParameterList) {
			// Tabelleneinträge
			var tt = "";

			tt += 	"<div class='uzsuRow'>" +
						"<div class='uzsuCell'>" +
							"<div class='uzsuCellText'>Weekday</div>" +
								"<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true' class='uzsuWeekday'>";
								// rrule Wochentage (ist eine globale Variable von SV, Sonntag hat index 0 deshalb Modulo 7)
                $.each([ 'MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU' ], function(index, value) {
									tt += "<label title='" + lang.weekday[(index + 1) % 7] + "'><input type='checkbox' value='" + value + "'>" + lang.shortday[(index + 1) % 7] + "</label>";
								});
			tt +=			"</fieldset>" +
							"</div>";

			tt += 	"<div class='uzsuCell uzsuValueCell'>" +
						"<div class='uzsuCellText'>Value</div>";
			if (valueType === 'bool') {
				// Unterscheidung Anzeige und Werte
				if (valueParameterList[0].split(':')[1] === undefined) {
					tt += 	"<select data-role='flipswitch' data-value='1'> " +
									"<option value='0'>" + valueParameterList[1] + "</option>" +
									"<option value='1'> "	+ valueParameterList[0] + " </option>" +
								"</select>";
				}
				else {
					tt += 	"<select data-role='flipswitch' data-value='1'>" +
									"<option value='" + valueParameterList[1].split(':')[1]	+ "'>" + valueParameterList[1].split(':')[0] + "</option>" +
									"<option value='" + valueParameterList[0].split(':')[1]	+ "'> "	+ valueParameterList[0].split(':')[0] + " </option>" +
								"</select>";
				}
			}
			else if (valueType === 'num') {
				tt += 	"<input type='number' " + valueParameterList[0] + " data-clear-btn='false' class='uzsuValueInput' pattern='[0-9]*'>";
			}
			else if (valueType === 'text') {
				tt += 	"<input type='text' data-clear-btn='false' class='uzsuTextInput'>";
			}
			else if (valueType === 'list') {
				// das Listenformat mit select ist sehr umfangreich nur einzubauen.
				tt += 	"<select data-mini='true'>";
								for (var numberOfListEntry = 0; numberOfListEntry < valueParameterList.length; numberOfListEntry++) {
									// Unterscheidung Anzeige und Werte
									if (valueParameterList[0].split(':')[1] === undefined) {
										tt += "<option value='" + valueParameterList[numberOfListEntry].split(':')[0]	+ "'>"+ valueParameterList[numberOfListEntry].split(':')[0]	+ "</option>";
									}
									else {
										tt += "<option value='" + valueParameterList[numberOfListEntry].split(':')[1]	+ "'>"+ valueParameterList[numberOfListEntry].split(':')[0]	+ "</option>";
									}
								}
				tt += 	"</select>";
			}
			tt+=	"</div>"
			tt+=	"<div class='uzsuCell'>" +
						"<div class='uzsuCellText'>Time</div>" +
						"<input type='time' data-clear-btn='false' class='uzsuTimeInput uzsuTimeCron'>" +
					"</div>" +
					"<div class='uzsuCell'>" +
						"<div class='uzsuCellText'></div>" +
						"<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true'>" +
							"<label><input type='checkbox' class='uzsuActive'>Act</label>" +
						"</fieldset>" +
					"</div>" +
					"<div class='uzsuCellExpert'>" +
						"<div class='uzsuCellText'>Expert</div>" +
						"<button data-mini='true' data-icon='arrow-d' data-iconpos='notext' class='ui-icon-shadow'></button>" +
					"</div>" +
					"<div class='uzsuCell ui-mini'>" +
						"<div class='uzsuCellText'></div>" +
						"<button class='uzsuDelTableRow' data-mini='true'>Del</button>" +
					"</div>";
			// Tabelle Zeile abschliessen
			tt += "</div>";
			// und jetzt noch die unsichbare Expertenzeile
			tt += 	"<div class='uzsuRowExpHoli' style='display:none;'>" +
						"<div class='uzsuRowExpert' style='float: left;'>" +
							"<div class='uzsuRowExpertText'>Sun</div>" +
							"<div class='uzsuCell'>" +
								"<div class='uzsuCellText'>earliest</div>" +
								"<input type='time' data-clear-btn='false' class='uzsuTimeMaxMinInput uzsuTimeMin'>" +
							"</div>" +
							"<div class='uzsuCell uzsuEvent'>" +
								"<div class='uzsuCellText'>Event</div>" +
								"<select data-mini='true'>" +
									"<option value='sunrise'>Sunrise</option>" +
									"<option value='sunset'>Sunset</option>" +
								"</select>" +
							"</div>" +
							"<div class='uzsuCell'>" +
								"<div class='uzsuCellText'>+/- min</div>" +
								"<input type='number' data-clear-btn='false' class='uzsuTimeOffsetInput'>" +
							"</div>" +
							"<div class='uzsuCell'>" +
								"<div class='uzsuCellText'>latest</div>" +
								"<input type='time' data-clear-btn='false' class='uzsuTimeMaxMinInput uzsuTimeMax'>" +
							"</div>" +
							"<div class='uzsuCell'>" +
								"<div class='uzsuCellText'></div>" +
								"<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true'>" +
									"<label><input type='checkbox' class='expertActive uzsuSunActive'>Act</label>" +
								"</fieldset>" +
							"</div>" +
						"</div>";
							// hier die Einträge für holiday weekend oder nicht
				if (designType === '2'){
					tt += 	"<div class='uzsuRowHoliday' style='float: left;'>" +
								"<div class='uzsuRowHolidayText'>Holiday</div>" +
								"<div class='uzsuCell'>" +
									"<div class='uzsuCellText'>Holiday</div>" +
									"<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true'>" +
										"<label><input type='checkbox' class='expertActive uzsuHolidayWorkday'>!WE</label>" +
					 					"<label><input type='checkbox' class='expertActive uzsuHolidayWeekend'>WE</label>" +
									"</fieldset>" +
								"</div>" +
							"</div>";
				}
				tt+= 	"</div>";
			// und jetzt noch die unsichbare Condition und delayed Exec Zeile
			if(designType == '2'){
				tt += 	"<div class='uzsuRowCondition' style='display:none;'>" +
							"<div class='uzsuRowConditionText'>Condition</div>" +
							"<div class='uzsuCell'>" +
								"<div class='uzsuCellText'>Device / String</div>" +
								"<input type='text' data-clear-btn='false' class='uzsuConditionDeviceStringInput'>" +
							"</div>" +
							"<div class='uzsuCell'>" +
								"<div class='uzsuCellText'>Condition Type</div>" +
								"<select data-mini='true' class='uzsuConditionType'>" +
									"<option value='eq'>=</option>" +
									"<option value='<'><</option>" +
									"<option value='>'>></option>" +
									"<option value='>='>>=</option>" +
									"<option value='<='><=</option>" +
									"<option value='ne'>!=</option>" +
									"<option value='String'>String</option>" +
								"</select>" +
							"</div>" +
							"<div class='uzsuCell'>" +
								"<div class='uzsuCellText'>Value</div>" +
								"<input type='text' data-clear-btn='false' class='uzsuConditionValueInput'>" +
							"</div>" +
							"<div class='uzsuCell'>" +
								"<div class='uzsuCellText'></div>" +
								"<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true'>" +
									"<label><input type='checkbox' class='expertActive uzsuConditionActive'>Act</label>" +
								"</fieldset>" +
							"</div>" +
						"</div>";
				// delayed exec zeile
				tt += 	"<div class='uzsuRowDelayedExec' style='display:none;'>" +
							"<div class='uzsuRowDelayedExecText'>DelayedExec</div>" +
							"<div class='uzsuCell'>" +
								"<div class='uzsuCellText'>Device / String</div>" +
								"<input type='text' data-clear-btn='false' class='uzsuDelayedExecDeviceStringInput'>" +
							"</div>" +
							"<div class='uzsuCell'>" +
								"<div class='uzsuCellText'>DelayedExec Type</div>" +
								"<select data-mini='true' class='uzsuDelayedExecType'>" +
									"<option value='eq'>=</option>" +
									"<option value='<'><</option>" +
									"<option value='>'>></option>" +
									"<option value='>='>>=</option>" +
									"<option value='<='><=</option>" +
									"<option value='ne'>!=</option>" +
									"<option value='String'>String</option>" +
								"</select>" +
							"</div>" +
							"<div class='uzsuCell'>" +
								"<div class='uzsuCellText'>Value</div>" +
								"<input type='text' data-clear-btn='false' class='uzsuDelayedExecValueInput'>" +
							"</div>" +
							"<div class='uzsuCell'>" +
								"<div class='uzsuCellText'></div>" +
								"<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true'>" +
									"<label><input type='checkbox' class='expertActive uzsuDelayedExecActive'>Act</label>" +
								"</fieldset>" +
							"</div>" +
						"</div>";
			}
			return tt;
		},
		uzsuBuildTableFooter: function(designType) {
			var tt = "";
			// Zeileneinträge abschliessen und damit die uzsuTableMain
			tt += "</div>";
			// Aufbau des Footers
				tt += "<div class='uzsuTableFooter'>" +
						"<div class='uzsuRowFooter'>" +
							"<span style='float:right'>" +
								"<div class='uzsuCell'>" +
									"<form>" +
										"<fieldset data-mini='true'>" +
											"<label><input type='checkbox' id='uzsuGeneralActive'>Active</label>" +
										"</fieldset>" +
									"</form>" +
								"</div>" +
								"<div class='uzsuCell'>" +
								"<div data-role='controlgroup' data-type='horizontal' data-inline='true' data-mini='true'>" +
									"<button id='uzsuAddTableRow'>Add</button>" +
									"<button id='uzsuSortTime'>Sort</button>" +
								"</div>" +
							"</div>" +
								"<div class='uzsuCell'>" +
										"<div data-role='controlgroup' data-type='horizontal' data-inline='true' data-mini='true'>" +
											"<button id='uzsuCancel'>Cancel</button>" +
											"<button id='uzsuSaveQuit'>OK</button>" +
										"</div>" +
									"</div>" +
								"</div>" +
							"</span>" +
						"</div>";
			// und der Abschluss des uzsuClear als Rahmen für den float:left und des uzsuPopup divs
			tt += "</div></div>";
			return tt;
		},
		//----------------------------------------------------------------------------
		// Funktionen für das dynamische Handling der Seiteninhalte des Popups
		//----------------------------------------------------------------------------
		// Setzt die Farbe des Expertenbuttons, je nach dem, ob eine der Optionen aktiv geschaltet wurde
		uzsuSetExpertColor: function(changedCheckbox){
			var rows = changedCheckbox.parents('.uzsuRowExpHoli, .uzsuRowCondition, .uzsuRowDelayedExec').prevAll('.uzsuRow').first().nextUntil('.uzsuRow').addBack();
			if (rows.find('.expertActive').is(':checked'))
				rows.find('.uzsuCellExpert button').addClass('ui-btn-active');
			else
				rows.find('.uzsuCellExpert button').removeClass('ui-btn-active');
		},
		// Toggelt die eingabemöglichkeit für SUN Elemente in Abhängigkeit der Aktivschaltung
		uzsuSetSunActiveState: function(element){
			// status der eingaben setzen, das brauchen wir an mehreren stellen
			var uzsuRowExpHoli = element.parents('.uzsuRowExpHoli');
			var uzsuTimeCron = uzsuRowExpHoli.prevUntil('.uzsuRowExpHoli').find('.uzsuTimeCron');
			if (uzsuRowExpHoli.find('.uzsuSunActive').is(':checked')){
				uzsuTimeCron.val(uzsuRowExpHoli.find('.uzsuEvent select').val()).textinput('disable');
			}
			else{
				if(uzsuTimeCron.val().indexOf('sun')===0)
					uzsuTimeCron.val('00:00');
				uzsuTimeCron.textinput('enable');
			}
		},
		uzsuFillTable: function(response, designType, valueType, valueParameterList) {
			// Tabelle füllen. Es werden die Daten aus der Variablen response gelesen und in den Status Darstellung der Widgetblöcke zugewiesen. Der aktuelle Status in dann in der Darstellung enthalten !
			var numberOfEntries = response.list.length;
			// jetzt wird die Tabelle befüllt allgemeiner Status, bitte nicht mit attr, sondern mit prop, siehe	// https://github.com/jquery/jquery-mobile/issues/5587
			$('#uzsuGeneralActive').prop('checked', response.active).checkboxradio("refresh");
			// dann die Werte der Tabelle
			$('.uzsuRow').each(function(numberOfRow) {
				var responseEntry = response.list[numberOfRow];
				uzsuCurrentRows = $(this).nextUntil('.uzsuRow').addBack();
				// beim Schreiben der Daten Unterscheidung, da sonst das Element falsch genutzt wird mit Flipswitch für die bool Variante
				if (valueType === 'bool') {
					uzsuCurrentRows.find('.uzsuValueCell select').val(responseEntry.value).flipswitch("refresh");
				}
				// mit int Value für die num Variante
				else if ((valueType === 'num') || (valueType === 'text')) {
					uzsuCurrentRows.find('.uzsuValueCell input').val(responseEntry.value);
				}
				else if (valueType === 'list') {
					uzsuCurrentRows.find('.uzsuValueCell select').val(responseEntry.value).selectmenu('refresh', true);
				}
				// Values in der Zeile setzen
				uzsuCurrentRows.find('.uzsuActive').prop('checked',responseEntry.active).checkboxradio("refresh");
				// hier die conditions, wenn sie im json angelegt worden sind und zwar pro zeile !
				if(designType === '2'){
					// Condition
					uzsuCurrentRows.find('.uzsuConditionDeviceStringInput').val(responseEntry.condition.deviceString);
					uzsuCurrentRows.find('select.uzsuConditionType').val(responseEntry.condition.type).selectmenu('refresh', true);
					uzsuCurrentRows.find('.uzsuConditionValueInput').val(responseEntry.condition.value);
					uzsuCurrentRows.find('.uzsuConditionActive').prop('checked',responseEntry.condition.active).checkboxradio("refresh");
					// Delayed Exec Zeile
					uzsuCurrentRows.find('.uzsuDelayedExecDeviceStringInput').val(responseEntry.delayedExec.deviceString);
					uzsuCurrentRows.find('select.uzsuDelayedExecType').val(responseEntry.delayedExec.type).selectmenu('refresh', true);
					uzsuCurrentRows.find('.uzsuDelayedExecValueInput').val(responseEntry.delayedExec.value);
					uzsuCurrentRows.find('.uzsuDelayedExecActive').prop('checked',responseEntry.delayedExec.active).checkboxradio("refresh");
				}
				uzsuCurrentRows.find('.uzsuTimeMin').val(responseEntry.timeMin);
				uzsuCurrentRows.find('.uzsuTimeOffsetInput').val(parseInt(responseEntry.timeOffset));
				uzsuCurrentRows.find('.uzsuTimeMax').val(responseEntry.timeMax);
				uzsuCurrentRows.find('.uzsuTimeCron').val(responseEntry.timeCron);
				// und die pull down Menüs richtig, damit die Einträge wieder stimmen und auch der active state gesetzt wird
				if(responseEntry.event === 'time'){
					uzsuCurrentRows.find('.uzsuSunActive').prop('checked',false).checkboxradio("refresh");
				}
				else{
					uzsuCurrentRows.find('.uzsuSunActive').prop('checked',true).checkboxradio("refresh");
					uzsuCurrentRows.find('.uzsuRowExpert .uzsuEvent select').val(responseEntry.event).selectmenu('refresh', true);
				}
				// in der Tabelle die Werte der rrule, dabei gehe ich von dem Standardformat FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR,SA,SU aus und setze für jeden Eintrag den Button.
				var rrule = responseEntry.rrule;
				if (typeof rrule === "undefined") {
					rrule = '';
				}
				var ind = rrule.indexOf('BYDAY');
				// wenn der Standard drin ist
				if (ind > 0) {
					var days = rrule.substring(ind);
					// Setzen der Werte
					uzsuCurrentRows.find('.uzsuWeekday input[type="checkbox"]').each(function(numberOfDay) {
						$(this).prop('checked', days.indexOf($(this).val()) > 0).checkboxradio("refresh");
					});
				}
				// jetzt die holiday themem für fhem
				if(designType === '2'){
					uzsuCurrentRows.find('.uzsuHolidayWorkday').prop('checked', responseEntry.holiday.workday).checkboxradio("refresh");
					uzsuCurrentRows.find('.uzsuHolidayWeekend').prop('checked', responseEntry.holiday.weekend).checkboxradio("refresh");
				}
				// Fallunterscheidung für den Expertenmodus
				uzsu.uzsuSetSunActiveState(uzsuCurrentRows.find('.uzsuRowExpert .uzsuEvent select'));
				uzsu.uzsuSetExpertColor(uzsuCurrentRows.find('.expertActive').first());
			});
		},
		uzsuSaveTable: function(item, response, designType, valueType, valueParameterList, saveSmarthome) {
			// Tabelle auslesen und speichern
			var numberOfEntries = response.list.length;
			// hier werden die Daten aus der Tabelle wieder in die items im Backend zurückgespielt bitte darauf achten, dass das zurückspielen exakt dem der Anzeige enspricht. Gesamthafte Aktivierung
			response.active = $('#uzsuGeneralActive').is(':checked');
			// Einzeleinträge
			$('.uzsuRow').each(function(numberOfRow) {
				var responseEntry = response.list[numberOfRow];
				uzsuCurrentRows = $(this).nextUntil('.uzsuRow').addBack();
				responseEntry.value = uzsuCurrentRows.find('.uzsuValueCell select').val();
				responseEntry.active = uzsuCurrentRows.find('.uzsuActive').is(':checked');
				// hier die conditions, wenn im json angelegt
				if(designType == '2'){
					// conditions
					responseEntry.condition.deviceString = uzsuCurrentRows.find('.uzsuConditionDeviceStringInput').val();
					responseEntry.condition.type = uzsuCurrentRows.find('select.uzsuConditionType').val();
					responseEntry.condition.value = uzsuCurrentRows.find('.uzsuConditionValueInput').val();
					responseEntry.condition.active = uzsuCurrentRows.find('.uzsuConditionActive').is(':checked');
					// deleayed exec
					responseEntry.delayedExec.deviceString = uzsuCurrentRows.find('.uzsuDelayedExecDeviceStringInput').val();
					responseEntry.delayedExec.type = uzsuCurrentRows.find('select.uzsuDelayedExecType').val();
					responseEntry.delayedExec.value = uzsuCurrentRows.find('.uzsuDelayedExecValueInput').val();
					responseEntry.delayedExec.active = uzsuCurrentRows.find('.uzsuDelayedExecActive').is(':checked');
				}
				responseEntry.timeMin = uzsuCurrentRows.find('.uzsuTimeMin').val();
				responseEntry.timeOffset = uzsuCurrentRows.find('.uzsuTimeOffsetInput').val();
				responseEntry.timeMax = uzsuCurrentRows.find('.uzsuTimeMax').val();
				responseEntry.timeCron = uzsuCurrentRows.find('.uzsuTimeCron').val();
				// event etwas komplizierter, da übergangslösung
				if(uzsuCurrentRows.find('.uzsuSunActive').is(':checked')){
					responseEntry.event = uzsuCurrentRows.find('.uzsuEvent select').val();
				}
				else{
					responseEntry.event = 'time';
				}
				// in der Tabelle die Werte der rrule, dabei gehe ich von dem Standardformat FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR,SA,SU aus und setze für jeden Eintrag den Button. Setzen der Werte.
				var first = true;
				var rrule = '';
				uzsuCurrentRows.find('.uzsuWeekday input[type="checkbox"]').each(function(numberOfDay) {
					if ($(this).is(':checked')) {
						if (first) {
							first = false;
							rrule = 'FREQ=WEEKLY;BYDAY=' + $(this).val();
						}
						else {
							rrule += ',' + $(this).val();
						}
					}
				});
				responseEntry.rrule = rrule;
				// jetzt die holiday themem für fhem
				if(designType === '2'){
					responseEntry.holiday.workday = uzsuCurrentRows.find('.uzsuHolidayWorkday').is(':checked');
					responseEntry.holiday.weekend = uzsuCurrentRows.find('.uzsuHolidayWeekend').is(':checked');
				}
			});
			// über json Interface / Treiber herausschreiben
			if (saveSmarthome) {
				uzsu.uzsuCollapseTimestring(response);
				io.write(item, {active : response.active,list : response.list});
			}
		},
		uzsuCollapseTimestring: function(response){
			$.each(response.list, function(numberOfEntry, entry) {
				// zeitstring wieder zusammenbauen, falls Event <> 'time', damit wir den richtigen Zusammenbau im zeitstring haben
				if(entry.event === 'time'){
					// wenn der eintrag time ist, dann kommt die zeit rein
					entry.time = entry.timeCron;
				}
				else{
					// ansonsten wird er aus der bestandteilen zusammengebaut
					entry.time = '';
					if(entry.timeMin.length > 0){
						entry.time += entry.timeMin + '<';
					}
					entry.time += entry.event;
					if(entry.timeOffset > 0){
						entry.time += '+' + entry.timeOffset + 'm';
					}
					else if(entry.timeOffset < 0){
						entry.time += entry.timeOffset + 'm';
					}
					if(entry.timeMax.length > 0){
						entry.time += '<' + entry.timeMax;
					}
				}
			});
		},		
		//----------------------------------------------------------------------------
		// Funktionen für das Erweitern und Löschen der Tabelleneinträge
		//----------------------------------------------------------------------------
		uzsuAddTableRow: function(response, designType, valueType, valueParameterList) {
			// Tabellenzeile einfügen
			// alten Zustand mal in die Liste rein. da der aktuelle Zustand ja nur im Widget selbst enthalten ist, wird er vor dem Umbau wieder in die Variable response zurückgespeichert.
			uzsu.uzsuSaveTable(1, response, designType, valueType, valueParameterList, false);
			// ich hänge immer an die letzte Zeile dran ! erst einmal das Array erweitern
			response.list.push({active:false,rrule:'',time:'00:00',value:0,event:'time',timeMin:'',timeMax:'',timeCron:'00:00',timeOffset:'',condition:{deviceString:'',type:'String',value:'',active:false},delayedExec:{deviceString:'',type:'String',value:'',active:false},holiday:{workday:false,weekend:false}});
			// dann eine neue HTML Zeile genenrieren
			tt = uzsu.uzsuBuildTableRow(designType, valueType,	valueParameterList);
			// Zeile in die Tabelle einbauen
			$(tt).appendTo('#uzsuTable').enhanceWithin();
			// und Daten ausfüllen. hier werden die Zeile wieder mit dem Status beschrieben. Status ist dann wieder im Widget
			uzsu.uzsuFillTable(response, designType, valueType, valueParameterList);
		},
		uzsuDelTableRow: function(response, designType, valueType, valueParameterList, e) {
			// Zeile und Zeilennummer heraus finden
			var row = $(e.currentTarget).closest('.uzsuRow');
			var numberOfRowToDelete = row.parent().find('.uzsuRow').index(row);
			// Daten aus der Liste löschen
			response.list.splice(numberOfRowToDelete, 1);
			// Die entsprechende Zeile inkl. den nachfolgenden Expertenzeilen aus dem DOM entfernen
			row.nextUntil('.uzsuRow').addBack().remove();
		},

		//Expertenzeile mit Eingaben auf der Hauptzeile benutzbar machen oder sperren bzw. die Statusupdates in die Zeile eintragen
		uzsuShowExpertLine: function(e) {
			// erst einmal alle verschwinden lassen
			uzsu.uzsuHideAllExpertLines();
			// Tabellezeile ermitteln, wo augerufen wurde
			var uzsuExpertButton = $(e.currentTarget);
			var row = uzsuExpertButton.closest('.uzsuRow');
			// Zeile anzeigen
			row.nextUntil('.uzsuRow').show();
			// jetzt noch den Button in der Zeile drüber auf arrow up ändern
			uzsuExpertButton.buttonMarkup({ icon: "arrow-u" });
		},
		uzsuHideAllExpertLines: function() {
			$('.uzsuRowExpHoli, .uzsuRowCondition, .uzsuRowDelayedExec').hide();
			$('.uzsuCellExpert button').buttonMarkup({ icon: "arrow-d" });
		},
		//----------------------------------------------------------------------------
		// Funktionen für das Sortrieren der Tabelleneinträge
		//----------------------------------------------------------------------------
		uzsuSortTime: function(response, designType, valueType, valueParameterList, e) {
			// erst aus dem Widget zurücklesen, sonst kann nicht im Array sortiert werden (alte daten)
			uzsu.uzsuSaveTable(1, response, designType, valueType, valueParameterList, false);
			// sortieren der Listeneinträge nach zeit
			response.list.sort(function(a, b) {
				// sort Funktion, wirklich vereinfacht für den speziellen Fall
				// ergänzt um das sunrise und sunset Thema
				var A = a.timeCron.replace(':', '');
				var B = b.timeCron.replace(':', '');
				// Reihenfolge ist erst die Zeiten, dann sunrise, dann sunset
				if(A == 'sunrise') A = '2400';
				if(A == 'sunset') A = '2401';
				if(B == 'sunrise') B = '2400';
				if(B == 'sunset') B = '2401';
				return (A - B);
			});
			// dann die Einträge wieder schreiben
			uzsu.uzsuFillTable(response, designType, valueType, valueParameterList);
		},
		//----------------------------------------------------------------------------
		// Funktionen für den Aufbau des Popups und das Einrichten der Callbacks
		//----------------------------------------------------------------------------
		uzsuRuntimePopup: function(response, headline, designType, valueType, valueParameterList, item) {
			// Steuerung des Popups erst einmal wird der Leeranteil angelegt
			// erst den Header, dann die Zeilen, dann den Footer
			var tt = uzsu.uzsuBuildTableHeader(headline, designType, valueType, valueParameterList);
			for (var numberOfRow = 0; numberOfRow < response.list.length; numberOfRow++) {
				tt += uzsu.uzsuBuildTableRow(designType, valueType, valueParameterList);
			}
			tt += uzsu.uzsuBuildTableFooter(designType);
			// dann hängen wir das an die aktuelle Seite
			//$(bevent.target).append(tt).trigger('pagecreate');
			var uzsuPopup = $(tt).appendTo(bevent.target).enhanceWithin().popup();
			// dann speichern wir uns für cancel die ursprünglichen im DOM gespeicherten Werte in eine Variable ab
			var responseCancel = jQuery.extend(true, {}, response);
			// dann die Werte eintragen.
			uzsu.uzsuFillTable(response, designType, valueType, valueParameterList);
			// Popup schliessen mit close rechts oben in der Box oder mit Cancel in der Leiste
			uzsuPopup.find('#uzsuClose, #uzsuCancel').bind('tap', function(e) {
				// wenn keine Änderungen gemacht werden sollen (cancel), dann auch im cache die alten Werte
				uzsuPopup.popup('close');
			});
			// speichern mit SaveQuit
			$(bevent.target).find('#uzsuSaveQuit').bind('tap', function(e) {
				// jetzt wird die Kopie auf das Original kopiert und geschlossen
				uzsu.uzsuSaveTable(item, response, designType, valueType, valueParameterList, true);
				uzsuPopup.popup('close');
			});
			// Eintrag hinzufügen mit add
			uzsuPopup.find('#uzsuAddTableRow').bind('tap', function(e) {
				uzsu.uzsuAddTableRow(response, designType, valueType, valueParameterList);
			});
			// Eintrag sortieren nach Zeit
			uzsuPopup.find('#uzsuSortTime').bind('tap', function(e) {
				uzsu.uzsuSortTime(response, designType, valueType, valueParameterList);
			});
			// Löschen mit del als Callback eintragen
			uzsuPopup.delegate('.uzsuDelTableRow', 'tap', function(e) {
				uzsu.uzsuDelTableRow(response, designType, valueType, valueParameterList, e);
			});
			// call Expert Mode
			uzsuPopup.delegate('.uzsuCellExpert button', 'tap', function(e) {
				if($(this).hasClass('ui-icon-arrow-u'))
					uzsu.uzsuHideAllExpertLines();
				else
					uzsu.uzsuShowExpertLine(e);
			});
			// Handler, um den expert button Status zu setzen
			uzsuPopup.delegate('input.expertActive', 'change', function (){
				uzsu.uzsuSetExpertColor($(this));
			});
			// Handler, um den Status anhand des Pulldowns SUN zu setzen
			uzsuPopup.delegate('.uzsuRowExpert .uzsuEvent select, input.uzsuSunActive', 'change', function (){
				uzsu.uzsuSetSunActiveState($(this));
			});

			// hier wir die aktuelle Seite danach durchsucht, wo das Popup ist und im folgenden das Popup initialisiert, geöffnet und die schliessen
			// Funktion daran gebunden. Diese entfernt wieder das Popup aus dem DOM Baum nach dem Schliessen mit remove
			uzsuPopup.popup('open').bind({
				popupafterclose: function () {
					$(this).remove();
				}
			});
		},
		//----------------------------------------------------------------------------
		//Funktionen für das Verankern des Popup auf den Webseiten
		//----------------------------------------------------------------------------
		uzsuDomUpdate: function(event, response) {
			// Initialisierung zunächst wird festgestellt, ob Item mit Eigenschaft vorhanden. Wenn nicht: active = false
			// ansonsten ist der Status von active gleich dem gesetzten Status
			var active;
			// erst einmal prüfen, ob ein Objekt tasächlich vohanden ist
			if(response.length > 0) {
				active = response[0].active;
			}
			else{
				active = false;
			}
			// Das Icon wird aktiviert, falls Status auf aktiv, ansonsten deaktiviert angezeigt. Basiert auf der Implementierung von aschwith
			if(active === true) {
				$('#' + this.id + '-off').hide();
				$('#' + this.id + '-on').show();
			}
			else {
				$('#' + this.id + '-on').hide();
				$('#' + this.id + '-off').show();
			}
			// wenn keine Daten vorhanden, dann ist kein item mit den eigenschaften hinterlegt und es wird nichts gemacht
			if (response.length === 0){
				notify.error("UZSU widget", "No UZSU data available in item '" + $(this).attr('data-item') + "' for widget " + this.id + ".");
				return;
			}
			// Wenn ein Update erfolgt, dann werden die Daten erneut in die Variable uzsu geladen damit sind die UZSU objekte auch in der click Funktion verfügbar
			if (response[0].list instanceof Array) {
				$(this).data('uzsu', response[0]);
			}
			else {$(this).data('uzsu', {active : true,list : []	});
			}
		},
		uzsuDomClick: function(event) {
			// hier werden die Parameter aus den Attributen herausgenommen und beim Öffnen mit .open(....) an das Popup Objekt übergeben
			// und zwar mit deep copy, damit ich bei cancel die ursprünglichen werte nicht überschrieben habe
			var response = jQuery.extend(true, {}, $(this).data('uzsu'));
			// erst gehen wir davon aus, dass die Prüfungen positiv und ein Popup angezeigt wird
			var popupOk = true;
			// Fehlerbehandlung für ein nicht vorhandenes DOM Objekt. Das response Objekt ist erst da, wenn es mit update angelegt wurde. Da diese
			// Schritte asynchron erfolgen, kann es sein, dass das Icon bereits da ist, clickbar, aber nocht keine Daten angekommen. Dann darf ich nicht auf diese Daten zugreifen wollen !
			if(response.list === undefined){
				notify.error("UZSU widget", "No UZSU data available in item '" + $(this).attr('data-item') + "' for widget " + this.id + ".");
			}
			else{
			 	// Auswertung der Übergabeparameter aus dem HTML Widget
				var headline = $(this).attr('data-headline');
				var designType = $(this).attr('data-designType');
				if(designType === undefined || designType === '') {
					designType = io.uzsu_type;
				}
				var valueType = $(this).attr('data-valueType');
				// hier wird die komplette Liste übergeben. widget.explode kehrt das implode aus der Webseite wieder um
				var valueParameterList = widget.explode($(this).attr('data-valueParameterList'));
				// default Werte setzen fuer valueParameterList
				if(valueParameterList.length === 0){
					if(valueType === 'bool') valueParameterList = ['On','Off'];
					else if (valueType === 'num') valueParameterList = [''];
					else if (valueType === 'text') valueParameterList = [''];
					else if (valueType === 'list') valueParameterList = [''];
				}
				
				// data-item ist der sh.py item, in dem alle Attribute lagern, die für die Steuerung notwendig ist ist ja vom typ dict. das item, was tatsächlich per
				// Schaltuhr verwendet wird ist nur als attribut (child) enthalten und wird ausschliesslich vom Plugin verwendet. wird für das rückschreiben der Daten an smarthome.py benötigt
				var item = $(this).attr('data-item');
				// jetzt kommt noch die Liste von Prüfungen, damit hinterher keine Fehler passieren, zunächst fehlerhafter designType (unbekannt)
				if ((designType !== '0') && (designType !== '2')) {
					notify.error("UZSU widget", "Design type '" + designType + "' is not supported in widget " + this.id + ".");
					popupOk = false;
				}
				// fehlerhafter valueType (unbekannt)
				if ((valueType !== 'bool') && (valueType !== 'num')	&& (valueType !== 'text') && (valueType !== 'list')) {
					notify.error("UZSU widget", "Value type '" + valueType + "' is not supported in widget " + this.id + ".");
					popupOk = false;
				}
																
				//
				// Umsetzung des time parameters in die Struktur, die wir hinterher nutzen wollen
				//
				$.each(response.list, function(numberOfRow, entry) {
					// test, ob die einträge für holiday gesetzt sind
					if (entry.event === 'time')
						entry.timeCron = entry.time;
					else
						entry.timeCron = '00:00';

					// bei designType '0' wird rrule nach Wochentagen umgewandelt und ein festes Format vorgegegeben hier sollte nichts versehentlich überschrieben werden
					if (designType == '0') {
						// test, ob die RRULE fehlerhaft ist
						if ((entry.rrule.indexOf('FREQ=WEEKLY;BYDAY=') !== 0) && (entry.rrule.length > 0)) {
							if (!confirm("Error: Parameter designType is '0', but saved RRULE string in UZSU '" + entry.rrule + "' does not match default format FREQ=WEEKLY;BYDAY=MO... on item " + item	+ ". Should this entry be overwritten?")) {
								popupOk = false;
								// direkter Abbruch bei der Entscheidung!
								return false;
							}
						}
					}

					// wenn designType = '2' und damit fhem auslegung ist muss der JSON String auf die entsprechenden einträge erweitert werden (falls nichts vorhanden)
					if (designType == '2') {
						// test, ob die einträge für conditions vorhanden sind
						if (entry.condition === undefined){
							entry.condition = {deviceString:'',type:'String',value:'',active:false};
						}
						// test, ob die einträge für delayed exec vorhanden sind
						if (entry.delayedExec === undefined){
							entry.delayedExec = {deviceString:'',type:'String',value:'',active:false};
						}
						// test, ob die einträge für holiday gesetzt sind
						if (entry.holiday === undefined){
							entry.holiday = {workday:false, weekend:false};
						}
					}
				});

				if (popupOk) {
					// Öffnen des Popups bei clicken des icons und Ausführung der Eingabefunktion
					uzsu.uzsuRuntimePopup(response, headline, designType, valueType, valueParameterList, item);
				}
			}
		}
	}
	// Verankerung als Callback in den DOM Elementen
	$(bevent.target).find('[data-widget="uzsu.uzsuicon"]').on( {
		'update': uzsu.uzsuDomUpdate,
		'click': uzsu.uzsuDomClick
	});


/// ----- p l o t ---------------------------------------------------------------
// -----------------------------------------------------------------------------

	// ----- plot.comfortchart ----------------------------------------------------
	$(bevent.target).find('div[data-widget="plot.comfortchart"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_temp }}, {{ gad_humidity }}

			var label = $(this).attr('data-label').explode();
			var axis = $(this).attr('data-axis').explode();
			var plots = Array();

			plots[0] = {
				type: 'area', name: label[0], lineWidth: 0,
				data: [
					[17, 35],
					[16, 75],
					[17, 85],
					[21, 80],
					[25, 60],
					[27, 35],
					[25, 19],
					[20, 20],
					[17, 35]
				]
			};
			plots[1] = {
				type: 'area', name: label[1], lineWidth: 0,
				data: [
					[17, 75],
					[22.5, 65],
					[25, 33],
					[18.5, 35],
					[17, 75]
				]
			};

			plots[2] = {
				name: 'point',
				data: [
					[response[0] * 1.0, response[1] * 1.0]
				],
				marker: { enabled: true, lineWidth: 2, radius: 6, symbol: 'circle' },
				showInLegend: false
			};

			$(this).highcharts({
				series: plots,
				xAxis: { min: 10, max: 35, title: { text: axis[0], align: 'high', margin: -2 } },
				yAxis: { min: 0, max: 100, title: { text: axis[1], margin: 7 } },
				plotOptions: { area: { enableMouseTracking: false } },
				tooltip: {
					formatter: function () {
						return this.x.transUnit('temp') + ' / ' + this.y.transUnit('%');
					}
				}
			});
		},

		'point': function (event, response) {
			event.stopPropagation();
			var chart = $(this).highcharts();
			var point = chart.series[2].data[0];
			if (!response[0]) {
				response[0] = point.x;
			}
			if (!response[1]) {
				response[1] = point.y;
			}

			chart.series[2].data[0].update([response[0] * 1.0, response[1] * 1.0], true);
		}
	});

	// ----- plot.multiaxes ----------------------------------------------------------
	$(bevent.target).find('div[data-widget="plot.multiaxis"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: [ [ [t1, y1], [t2, y2] ... ], [ [t1, y1], [t2, y2] ... ], ... ]

			var ymin = [];
			if ($(this).attr('data-ymin')) {
				ymin = $(this).attr('data-ymin').explode();
			}

			var ymax = [];
			if ($(this).attr('data-ymax')) {
				ymax = $(this).attr('data-ymax').explode();
			}

			var label = $(this).attr('data-label').explode();
			var color = $(this).attr('data-color').explode();
			var exposure = $(this).attr('data-exposure').explode();
			var axis = $(this).attr('data-axis').explode();
			var zoom = $(this).attr('data-zoom');

			var assign = [];
			if ($(this).attr('data-assign')) {
				assign = $(this).attr('data-assign').explode();
			}

			var opposite = [];
			if ($(this).attr('data-opposite')) {
				opposite = $(this).attr('data-opposite').explode();
			}

			var ycolor = [];
			if ($(this).attr('data-ycolor')) {
				ycolor = $(this).attr('data-ycolor').explode();
			}

			var series = [];
			var yaxis = [];

			var i = 0;

			// series
			for (i = 0; i < response.length; i++) {
				series[i] = {
					type: (exposure[i] != 'stair' ? exposure[i] : 'line'),
					step: (exposure[i] == 'stair' ? 'left' : false),
					name: label[i],
					data: response[i],
					color: (color[i] ? color[i] : null),
					yAxis: (assign[i] ? assign[i] - 1 : 0)
				};
			}

			// y-axis
			for (i = 0; i < axis.length - 1; i++) {
				yaxis[i] = {
					min: (ymin[i] ? ymin[i] : null),
					max: (ymax[i] ? ymax[i] : null),
					title: {text: axis[i + 1]},
					opposite: (opposite[i] > 0),
					minPadding: 0.05,
					maxPadding: 0.05,
					endOnTick: false,
					startOnTick: false
				};
				if (ycolor[i]) {
					yaxis[i].lineColor = ycolor[i];
					yaxis[i].tickColor = ycolor[i];
				}
			}

			// draw the plot
			if (zoom) {
				$(this).highcharts({
					chart: {
						zoomType: 'x'
					},
					series: series,
					xAxis: {type: 'datetime', title: {text: axis[0]}, minRange: new Date().duration(zoom).valueOf()},
					yAxis: yaxis
				});
			}
			else {
				$(this).highcharts({
					series: series,
					xAxis: {type: 'datetime', title: {text: axis[0]}},
					yAxis: yaxis
				});
			}

		},

		'point': function (event, response) {
			event.stopPropagation();
			var count = $(this).attr('data-count');
			if (count < 1) {
				count = 100;
			}
			for (var i = 0; i < response.length; i++) {
				if (response[i]) {
					var chart = $(this).highcharts();

					// more points?
					for (var j = 0; j < response[i].length; j++) {
						chart.series[i].addPoint(response[i][j], false, (chart.series[i].data.length >= count));
					}
					chart.redraw();
				}
			}
		}
	});

	// ----- plot.period ----------------------------------------------------------
	$(bevent.target).find('div[data-widget="plot.period"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: [ [ [t1, y1], [t2, y2] ... ], [ [t1, y1], [t2, y2] ... ], ... ]

			var label = $(this).attr('data-label').explode();
			var color = $(this).attr('data-color').explode();
			var exposure = $(this).attr('data-exposure').explode();
			var axis = $(this).attr('data-axis').explode();
			var zoom = $(this).attr('data-zoom');
			var series = Array();

			for (var i = 0; i < response.length; i++) {
				series[i] = {
					type: (exposure[i] != 'stair' ? exposure[i] : 'line'),
					step: (exposure[i] == 'stair' ? 'left' : false),
					name: label[i],
					data: response[i],
					color: (color[i] ? color[i] : null)
				}
			}

			// draw the plot
			if (zoom) {
				$(this).highcharts({
					chart: {zoomType: 'x'},
					series: series,
					xAxis: {type: 'datetime', title: {text: axis[0]}, minRange: new Date().duration(zoom).valueOf()},
					yAxis: {min: $(this).attr('data-ymin'), max: $(this).attr('data-ymax'), title: {text: axis[1]}}
				});
			}
			else {
				$(this).highcharts({
					series: series,
					xAxis: {type: 'datetime', title: {text: axis[0]}},
					yAxis: {min: $(this).attr('data-ymin'), max: $(this).attr('data-ymax'), title: {text: axis[1]}}
				});
			}
		},

		'point': function (event, response) {
			event.stopPropagation();
			var count = $(this).attr('data-count');
			if (count < 1) {
				count = 100;
			}
			for (var i = 0; i < response.length; i++) {
				if (response[i]) {
					var chart = $(this).highcharts();

					// more points?
					for (var j = 0; j < response[i].length; j++) {
						chart.series[i].addPoint(response[i][j], false, (chart.series[i].data.length >= count));
					}
					chart.redraw();
				}
			}
		}
	});

	// ----- plot.rtr -------------------------------------------------------------
	$(bevent.target).find('div[data-widget="plot.rtr"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_actual }}, {{ gad_set }}, {{ gat_state }}

			var label = $(this).attr('data-label').explode();
			var axis = $(this).attr('data-axis').explode();

			// calculate state: diff between timestamps in relation to duration
			var state = response[2];
			var stamp = state[0][0];
			var percent = 0;

			for (var i = 1; i < state.length; i++) {
				percent += state[i - 1][1] * (state[i][0] - stamp);
				stamp = state[i][0];
			}
			percent = percent / (stamp - state[0][0]);

			if (percent < 1) {
				percent = percent * 100;
			}
			else if (percent > 100) {
				percent = percent / 255 * 100;
			}

			// draw the plot
			$(this).highcharts({
				chart: {type: 'line'},
				series: [
					{
						name: label[0], data: response[0], type: 'spline'
					},
					{
						name: label[1], data: response[1], dashStyle: 'shortdot', step: 'left'
					},
					{
						type: 'pie', name: '∑  On: ',
						data: [
							{
								name: 'On', y: percent
							},
							{
								name: 'Off', y: (100 - percent), color: null
							}
						],
						center: ['95%', '90%'],
						size: 35,
						showInLegend: false,
						dataLabels: {enabled: false}
					}
				],
				xAxis: {type: 'datetime'},
				yAxis: {min: $(this).attr('data-min'), max: $(this).attr('data-max'), title: {text: axis[1]}},
				tooltip: {
					formatter: function () {
						return this.series.name + ' <b>' + (this.percentage ? this.y.transUnit('%') : this.y.transUnit('temp')) + '</b>';
					}
				}
			});
		},

		'point': function (event, response) {
			event.stopPropagation();
			var count = $(this).attr('data-count');
			if (count < 1) {
				count = 100;
			}
			for (var i = 0; i < response.length; i++) {
				var chart = $(this).highcharts();

				if (response[i] && (i == 0 || i == 1)) {
					for (var j = 0; j < response[i].length; j++) {
						chart.series[i].addPoint(response[i][j], false, (chart.series[i].data.length >= count));
					}
				}
				else if (response[i] && (i == 2)) {
					// TODO: plot.rtr, recalc pie diagram after new point received
				}
				chart.redraw();
			}
		}
	});

	// ----- plot.temprose --------------------------------------------------------
	$(bevent.target).find('div[data-widget="plot.temprose"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_actual_1, gad_actual_2, gad_actual_3, gad_set_1, gad_set_2, gad_set_3 }}

			var label = $(this).attr('data-label').explode();
			var axis = $(this).attr('data-axis').explode();
			var count = parseInt($(this).attr('data-count'));

			var plots = Array();
			plots[0] = {
				name: label[0], pointPlacement: 'on',
				data: response.slice(0, count)
			};

			if (response.slice(count).length == count) {
				plots[1] = {
					name: label[1], pointPlacement: 'on',
					data: response.slice(count),
					dashStyle: 'shortdot'
				}
			}

			$(this).highcharts({
				chart: {polar: true, type: 'line', marginLeft: 10 },
				series: plots,
				xAxis: { categories: axis, tickmarkPlacement: 'on', lineWidth: 0 },
				yAxis: { gridLineInterpolation: 'polygon', lineWidth: 0 },
				tooltip: {
					formatter: function () {
						return this.x + ' - ' + this.series.name + ': <b>' + this.y.transUnit('temp') + '</b>';
					}
				},
				legend: {x: 10, layout: 'vertical'}
			});
		},

		'point': function (event, response) {
			event.stopPropagation();
			var chart = $(this).highcharts();
			var point = chart.series[2].data[0];
			if (!response[0]) {
				response[0] = point.x;
			}
			if (!response[1]) {
				response[1] = point.y;
			}

			chart.series[2].data[0].update([response[0] * 1.0, response[1] * 1.0], true);
		}
	});

	// ----- plot.minmaxavg ----------------------------------------------------------
	$(bevent.target).find('div[data-widget="plot.minmaxavg"]').on( {
		'update': function (event, response) {
			// response is: [[t1 , {{ gad.min }}], [t2 , {{ gad.max }}], [t3 , {{ gad.avg }}]]
			event.stopPropagation();

			var axis = $(this).attr('data-axis').explode();
			var unit = $(this).attr('data-unit');

			var minValues = response[0];
			var maxValues = response[1];

			var ranges = [];
			for (var i = 0; i < minValues.length; i++) {
				ranges[i] = [minValues[i][0], minValues[i][1], maxValues[i][1]];
			}

			// draw the plot
			$(this).highcharts({
				chart: {
					type: 'columnrange',
					inverted: false
				},
				series: [{
					data: ranges,
					enableMouseTracking: false
				}, {
					type: 'line',
					data: response[2]
				}],
				xAxis: {
					type: 'datetime',
					title: { text: axis[0] }
				},
				yAxis: {
					min: $(this).attr('data-ymin'),
					max: $(this).attr('data-ymax'),
					title: { text: axis[1] }
				},
				plotOptions: {
					columnrange: {
						dataLabels: {
							enabled: true,
							formatter: function () {
								if (unit != '') {
									return parseFloat(this.y).transUnit(unit);
								} else {
									return parseFloat(this.y).transFloat();
								}
							}
						}
					}
				},
				tooltip: {
					pointFormatter: function() {
						var value = this.y;
						if (unit != '') {
							value = parseFloat(this.y).transUnit(unit);
						} else {
							value = parseFloat(this.y).transFloat();
						}
						return '<span style="color:' + this.color + '">\u00D8</span>  <b>' + value + '</b><br/>'
					}
				},
				legend: { enabled: false }
			});
		},
		'point': function (event, response) {
			event.stopPropagation();
			var count = $(this).attr('data-count');
			if (count < 1) {
				count = 100;
			}

			var minValues = response[0];
			var maxValues = response[1];

			for (var i = 0; i < minValues.length; i++) {
				var chart = $(this).highcharts();
				chart.series[0].addPoint([minValues[i][0], minValues[i][1], maxValues[i][1]], false, (chart.series[i].data.length >= count));
				chart.series[1].addPoint(response[2][i], false, (chart.series[i].data.length >= count));
				chart.redraw();
			}
		}
	});

// ----- s t a t u s -----------------------------------------------------------
// -----------------------------------------------------------------------------

	// ----- status.collapse -------------------------------------------------------
	$(bevent.target).find('span[data-widget="status.collapse"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_trigger }}

			var target = $('div[data-bind="' + $(this).attr('data-id') + '"]');
			if (response[0] != $(this).attr('data-val-collapsed')) {
				target.not('.ui-collapsible').not('.ui-popup').show();
				target.filter('.ui-collapsible').collapsible("expand");
 				target.filter('.ui-popup').popup("open");
			}
			else {
				target.not('.ui-collapsible').not('.ui-popup').hide();
				target.filter('.ui-collapsible').collapsible("collapse");
				target.filter('.ui-popup').popup("close");
			}
		}
	});

	// ----- status.log -----------------------------------------------------------
	$(bevent.target).find('span[data-widget="status.log"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			var ret;
			var line = '';

			if (response[0] instanceof Array) {
				// only the last entries
				var list = response[0].slice(0, $(this).attr('data-count'));

				for (var i = 0; i < list.length; i++) {
					ret = '<div class="color ' + list[i].level.toLowerCase() + '"></div>';
					ret += '<h3>' + new Date(list[i].time).transLong() + '</h3>';
					ret += '<p>' + list[i].message + '</p>';
					line += '<li data-icon="false">' + ret + '</li>';
				}

				$(this).find('ul').html(line).trigger('prepare').listview('refresh').trigger('redraw');
			}
		}
	});

	// ----- status.notify ----------------------------------------------------------
	$(bevent.target).find('span[data-widget="status.notify"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_trigger }}, {{ gad_message }}

			if (response[0] != 0) {
				notify.add($(this).attr('data-mode'), $(this).attr('data-signal'), $(this).find('h1').html(),
					'<b>' + response[1] + '</b><br  />' + $(this).find('p').html());
				notify.display();
			}
		}
	});

	// ----- status.message -------------------------------------------------------
	$(bevent.target).find('span[data-widget="status.message"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_trigger }}, {{ gad_message }}

			if (response[0] != 0) {
				$('#' + this.id + '-message p span').html(response[1] ? '<b>' + response[1] + '</b><br />' : '');
				$('#' + this.id + '-message .stamp').html(response[2] ? new Date(response[2]).transShort() : new Date().transShort());
				$('#' + this.id + '-message').popup('open');
				console.log(this.id + ' open ' + response[0]);
			}
			else {
				$('#' + this.id + '-message').popup('close');
				console.log(this.id + ' ' + response[0]);
			}
		}
	});

// ----- i c o n --------------------------------------------------------------
// ----------------------------------------------------------------------------

	$(bevent.target).find('svg[data-widget^="icon."]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			if (response instanceof Array) {
				this.setAttributeNS(null, 'class', 'icon' + (response[0] && response[1] ? ' icon1' : ' icon0'));
			}
		},

		'click': function (event) {
			if ($(this).attr('data-item')) {
				var items = $(this).attr('data-item').explode();

				if (items[1]) {
					io.write(items[1], (widget.get(items[1]) == 0 ? 1 : 0));
				}
			}
		}
	});

	// ----- icon.arrow -----------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.arrow"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var ang = response[0] / $(this).attr('data-max') * 2 * Math.PI;

			var pt = [];
			pt = pt.concat([50, 50], fx.rotate([25, 50], ang, [50, 50]), fx.rotate([50, 18], ang, [50, 50]), fx.rotate([75, 50], ang, [50, 50]), [50, 50]);
			$(this).find('#line0').attr('points', pt.toString());

			pt = [];
			pt = pt.concat(fx.rotate([32, 50], ang, [50, 50]), fx.rotate([32, 60], ang, [50, 50]), fx.rotate([68, 60], ang, [50, 50]), fx.rotate([68, 50], ang, [50, 50]));
			$(this).find('#line1').attr('points', pt.toString());
		}
	});

	// ----- icon.battery ---------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.battery"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var val = Math.floor(response[0] / $(this).attr('data-max') * 40 / 6) * 6;
			fx.grid(this, val, [39, 68], [61, 28]);
		}
	});

	// ----- icon.blade -----------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.blade"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			// calculate angle in (0 - ~90°)
			var ang = response[0] / $(this).attr('data-max') * 0.4 * Math.PI;
			var pt;

			for (var i = 0; i <= 3; i++) {
				pt = [];
				pt = pt.concat(fx.rotate([37, 20 + i * 20], ang, [50, 20 + i * 20]), fx.rotate([63, 20 + i * 20], ang, [50, 20 + i * 20]));
				$(this).find('#blade' + i).attr('points', pt.toString());
			}
		}
	});

	// ----- icon.blade2 -----------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.blade2"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			// calculate angle in (0 - ~180°)
			var val = response[1];
			var ang = -1 * (response[0] / $(this).attr('data-max') * -0.7 * Math.PI + 0.35 * Math.PI);
			var pt;

			for (var i = 0; i <= 3; i++) {
				pt = [];
				pt = pt.concat(fx.rotate([37, 20 + i * 20], ang, [50, 20 + i * 20]), fx.rotate([63, 20 + i * 20], ang, [50, 20 + i * 20]));
				$(this).find('#blade' + i).attr('points', pt.toString());
			}
		}
	});

	// ----- icon.blade_z ---------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.blade_z"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			// calculate angle in (0 - 90°)
			var ang = response[0] / $(this).attr('data-max') * 0.5 * Math.PI * -1;

			var pt = [];
			pt = pt.concat(fx.rotate([25, 25], ang, [50, 30]), fx.rotate([45, 25], ang, [50, 30]), fx.rotate([55, 35], ang, [50, 30]), fx.rotate([75, 35], ang, [50, 30]));
			$(this).find('#blade0').attr('points', pt.toString());

			pt = [];
			pt = pt.concat(fx.rotate([25, 65], ang, [50, 70]), fx.rotate([45, 65], ang, [50, 70]), fx.rotate([55, 75], ang, [50, 70]), fx.rotate([75, 75], ang, [50, 70]));
			$(this).find('#blade1').attr('points', pt.toString());
		}
	});

	// ----- icon.blade_arc -------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.blade_arc"]').on( {
			'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			// calculate angle in (0 - 90°)
			var ang = response[0] / $(this).attr('data-max') * -0.7 * Math.PI + 0.35 * Math.PI;
			var pt;

			pt = 'M ' + fx.rotate([30, 40], ang, [50, 37]) + ' Q ' + fx.rotate([50, 22], ang, [50, 30]) + ' ' + fx.rotate([70, 40], ang, [50, 37]);
			$(this).find('#blade0').attr('d', pt);

			pt = 'M ' + fx.rotate([30, 80], ang, [50, 77]) + ' Q ' + fx.rotate([50, 62], ang, [50, 70]) + ' ' + fx.rotate([70, 80], ang, [50, 77]);
			$(this).find('#blade1').attr('d', pt);
		}
	});

	// ----- icon.clock -----------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.clock"]').on( {
		'update': function (event, response) {
			event.stopPropagation();

			// response is: {{ gad_value }}, {{ gad_switch }}

			var ang_l = (response[0] % 60) / 60 * 2 * Math.PI;
			$(this).find('#hand_l').attr('points', '50,50 ' + fx.rotate([50, 30], ang_l, [50, 50]).toString());

			var ang_s = (Math.floor(response[0] / 60) * 5) / 60 * 2 * Math.PI;
			$(this).find('#hand_s').attr('points', '50,50 ' + fx.rotate([50, 35], ang_s, [50, 50]).toString());
		}
	});

	// ----- icon.compass ---------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.compass"]').on( {
		'update': function (event, response) {
			event.stopPropagation();

			// response is: {{ gad_value }}, {{ gad_switch }}

			var ang = response[0] / $(this).attr('data-max') * 2 * Math.PI;

			var pt = [];
			pt = pt.concat(fx.rotate([40, 50], ang, [50, 50]), fx.rotate([50, 25], ang, [50, 50]), fx.rotate([60, 50], ang, [50, 50]));
			$(this).find('#pin0').attr('points', pt.toString());

			pt = [];
			pt = pt.concat(fx.rotate([40, 50], ang, [50, 50]), fx.rotate([50, 75], ang, [50, 50]), fx.rotate([60, 50], ang, [50, 50]));
			$(this).find('#pin1').attr('points', pt.toString());
		}
	});

	// ----- icon.graph -----------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.graph"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var val = Math.round(response[0] / $(this).attr('data-max') * 70);
			var graph = $(this).find('#graph').attr('d').substr(8);
			var points = graph.split('L');

			if (points.length > 8) {
				points.shift();
			}

			graph = 'M 15,85 ';
			for (var i = 1; i < points.length; i++) {
				graph += 'L ' + (i * 10 + 5) + ',' + points[i].substr(points[i].indexOf(',') + 1).trim() + ' ';
			}

			$(this).find('#graph').attr('d', graph + 'L ' + (i * 10 + 5) + ',' + (85 - val));
		}
	});

	// ----- icon.light ---------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.light"]').on( {
		'update': function (event, response) {
			// response is: {{ gad_value }}, {{ gad_switch }}
			var val = Math.round(response[0] / $(this).attr('data-max') * 10);
			// Iterate over all child elements
			var i = 1;
			$(this).find('g#light-rays line').each(function () {
				$(this).css("visibility", (val >= i ? "visible" : "hidden"));
				i++;
			});
		}
	});

	// ----- icon.meter -----------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.meter"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var ang = response[0] / $(this).attr('data-max') * 0.44 * Math.PI;
			$(this).find('#pointer').attr('points', '50,85 ' + fx.rotate([15, 48], ang, [50, 85]).toString());
		}
	});

	// ----- icon.shutter ---------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.shutter"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var val = Math.round(response[0] / $(this).attr('data-max') * 38);
			fx.grid(this, val, [14, 30], [86, 68]);
		}
	});

	// ----- icon.ventilation -----------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.ventilation"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var val = (1 - response[0] / $(this).attr('data-max')) * 4.5 + 0.5;
			$(this).find('#anim').attr('dur', (response[0] > 0 ? val : 0)).attr('begin', 0);
		}
	});

	// ----- icon.volume ---------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.volume"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var val = Math.round(response[0] / $(this).attr('data-max') * 71);
			// fx.bar(this, val, [left, bottom], [right, top]);
			fx.bar(this, val, [18, 68], [89, 50]);
		}
	});

	// ----- icon.windmill --------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.windmill"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var val = (1 - response[0] / $(this).attr('data-max')) * 4.5 + 0.5;
			$(this).find('#anim1').attr('dur', (response[0] > 0 ? val : 0)).attr('begin', 0);
		}
	});

	// ----- icon.windrose --------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.windrose"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var ang = response[0] / $(this).attr('data-max') * 2 * Math.PI;

			var pt = [];
			pt = pt.concat(fx.rotate([50, 60], ang, [50, 50]), fx.rotate([37, 71], ang, [50, 50]), fx.rotate([50, 29], ang, [50, 50]));
			$(this).find('#pin0').attr('points', pt.toString());

			pt = [];
			pt = pt.concat(fx.rotate([50, 60], ang, [50, 50]), fx.rotate([63, 71], ang, [50, 50]), fx.rotate([50, 29], ang, [50, 50]));
			$(this).find('#pin1').attr('points', pt.toString());
		}
	});

	// ----- icon.windsock --------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.windsock"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var ang = response[0] / $(this).attr('data-max') * 0.45 * Math.PI;

			var pt = [];
			pt = pt.concat(fx.rotate([70, 40], ang, [80, 22]), [80, 22], fx.rotate([90, 40], ang, [80, 22]));
			$(this).find('#top').attr('points', pt.toString());

			for (var i = 0; i < 3; i++) {
				pt = [];
				pt = pt.concat(fx.rotate([71 + i * 2, 50 + i * 14], ang, [80, 22]), fx.rotate([89 - i * 2, 50 + i * 14], ang, [80, 22]),
					fx.rotate([88 - i * 2, 54 + i * 14], ang, [80, 22]), fx.rotate([72 + i * 2, 54 + i * 14], ang, [80, 22]));
				$(this).find('#part' + i).attr('points', pt.toString());
			}

			pt = [];
			pt = pt.concat(fx.rotate([70, 40], ang, [80, 22]), fx.rotate([76, 82], ang, [80, 22]), fx.rotate([84, 82], ang, [80, 22]), fx.rotate([90, 40], ang, [80, 22]));
			$(this).find('#part3').attr('points', pt.toString());
		}
	});

	// ----- icon.zenith ----------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.zenith"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var ang = response[0] / $(this).attr('data-max') * Math.PI;
			pt = fx.rotate([10, 90], ang, [50, 90]);

			$(this).find('#sun').attr('x', pt[0] - 50);
			$(this).find('#sun').attr('y', pt[1] - 50);
		}
	});

});