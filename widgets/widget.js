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
		var currentIndex = 0;
		$.each($(widget).attr('data-thresholds').explode(), function(index, threshold) {
			if((isNaN(value) || isNaN(threshold)) ? (threshold > value) : (parseFloat(threshold) > parseFloat(value)))
				return false;
			currentIndex++;
		});
		var color = $(widget).attr('data-colors').explode()[currentIndex];
		if(color == '' || color == 'icon0')
			$(widget).removeClass('icon1').css('color', '');
		else if (color == 'icon1')
			$(widget).addClass('icon1').css('color', '');
		else
			$(widget).removeClass('icon1').css('color', color);
	}

// ----- b a s i c ------------------------------------------------------------
// ----------------------------------------------------------------------------

	// ----- basic.badge -------------------------------------------------------
	$(bevent.target).find('span[data-widget="basic.badge"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			$(this).children('span').text(response[0]);

			// coloring
			var currentIndex = 0;
			$.each($(this).attr('data-thresholds').explode(), function(index, threshold) {
				if((isNaN(response[0]) || isNaN(threshold)) ? (threshold > response[0]) : (parseFloat(threshold) > parseFloat(response[0])))
					return false;
				currentIndex++;
			});
			var color = $(this).attr('data-colors').explode()[currentIndex];

			if(color == 'hidden') {
				$(this).children('span').hide().css('background-color', null);
			}
			else {
				$(this).children('span').show().css('background-color', color);
			}
		}
	});

	// ----- basic.checkbox -------------------------------------------------------
	$(bevent.target).find('input[data-widget="basic.checkbox"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			$(this).prop('checked', response[0] != $(this).attr('data-val-off')).checkboxradio('refresh');
		},

		'change': function (event) {
			// DEBUG: console.log("[basic.checkbox] change '" + this.id + "':", $(this).prop("checked"));
			io.write($(this).attr('data-item'), $(this).prop('checked') ? $(this).attr('data-val-on') : $(this).attr('data-val-off'));
		}
	});

	// ----- basic.color ------------------------------------------------------
	$(bevent.target).find('[data-widget="basic.color"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_r }}, {{ gad_g }}, {{ gad_b }}

			var max = $(this).attr('data-max').explode();
			var min = $(this).attr('data-min').explode();
			// ensure max and min as array of 3 floats (fill by last value if array is shorter)
			for(var i = 0; i <= 2; i++) {
				max[i] = parseFloat(max[Math.min(i, max.length-1)])
				min[i] = parseFloat(min[Math.min(i, min.length-1)])
			}

			if(response.length == 1) // all values as list in one item
				values = response[0];
			else
				values = response;

			var rgb, hsl, hsv;
			switch($(this).attr('data-colormodel')) {
				case 'rgb':
					rgb = [
						Math.round(Math.min(Math.max((values[0] - min[0]) / (max[0] - min[0]), 0), 1) * 255),
						Math.round(Math.min(Math.max((values[1] - min[1]) / (max[1] - min[1]), 0), 1) * 255),
						Math.round(Math.min(Math.max((values[2] - min[2]) / (max[2] - min[2]), 0), 1) * 255)
					];
					hsl = fx.rgb2hsl(rgb[0], rgb[1], rgb[2]);
					hsv = fx.rgb2hsv(rgb[0], rgb[1], rgb[2]);
					break;
				case 'hsl':
					hsl = [
						Math.round(Math.min(Math.max((values[0] - min[0]) / (max[0] - min[0]), 0), 1) * 360),
						Math.round(Math.min(Math.max((values[1] - min[1]) / (max[1] - min[1]), 0), 1) * 100),
						Math.round(Math.min(Math.max((values[2] - min[2]) / (max[2] - min[2]), 0), 1) * 100)
					];
					rgb = fx.hsl2rgb(hsl[0], hsl[1], hsl[2]);
					hsv = fx.hsv2hsl(hsl[0], hsl[1], hsl[2]);
					break;
				case 'hsv':
					hsv = [
						Math.round(Math.min(Math.max((values[0] - min[0]) / (max[0] - min[0]), 0), 1) * 360),
						Math.round(Math.min(Math.max((values[1] - min[1]) / (max[1] - min[1]), 0), 1) * 100),
						Math.round(Math.min(Math.max((values[2] - min[2]) / (max[2] - min[2]), 0), 1) * 100)
					];
					rgb = fx.hsv2rgb(hsv[0], hsv[1], hsv[2]);
					hsl = fx.hsv2hsl(hsv[0], hsv[1], hsv[2]);
					break;
			}

			if($(this).attr('data-style') == 'slider') {
				// set slider background color
				//var brightness = hsl[2]+hsl[1]/2*(1-Math.abs(2*hsl[2]/100-1)); // value/brightness in HSV is HSL minimal saturation (also used to calculate maximal saturation and maximal lightness)
				$(this).find('.color-hue .ui-slider-track').css('background-image', 'linear-gradient(90deg, hsl(0,'+hsl[1]+'%,'+hsl[2]+'%), hsl(60,'+hsl[1]+'%,'+hsl[2]+'%), hsl(120,'+hsl[1]+'%,'+hsl[2]+'%), hsl(180,'+hsl[1]+'%,'+hsl[2]+'%), hsl(240,'+hsl[1]+'%,'+hsl[2]+'%), hsl(300,'+hsl[1]+'%,'+hsl[2]+'%), hsl(360,'+hsl[1]+'%,'+hsl[2]+'%))');
				$(this).find('.color-saturation .ui-slider-track').css('background-image', 'linear-gradient(90deg, hsl('+hsl[0]+',0%,'+hsv[2]+'%), hsl('+hsl[0]+',100%,'+Math.round(hsv[2]/2)+'%) )');
				$(this).find('.color-lightness .ui-slider-track').css('background-image', 'linear-gradient(90deg, hsl('+hsl[0]+',0%,0%), hsl('+hsl[0]+',100%,'+Math.round(hsl[2]/hsv[2]*100)+'%) )');

				// refresh slider position
				$(this).attr('lock', 1);
				$(this).find('.color-hue input').val(hsv[0]).slider('refresh').attr('mem', hsv[0]);
				$(this).find('.color-saturation input').val(hsv[1]).slider('refresh').attr('mem', hsv[1]);
				$(this).find('.color-lightness input').val(hsv[2]).slider('refresh').attr('mem', hsv[2]);
			}
			else { // 'rect' or 'circle'
				$(this).find('span').css('background-color', 'rgb(' + rgb.join(',') + ')');
			}
		}
	})
	// color in rectangular display (as former basic.rgb)
	.filter('a[data-style="rect"]').on( {
		click: function(event) {
			
			var html = '<div class="rgb-popup">';
			
			var colors = parseInt($(this).attr('data-colors'));
			var steps = parseInt($(this).attr('data-step'));
			var step = Math.round(2 * 100 / (steps + 1) * 10000) / 10000;
			var share = 360 / colors;
			
			for (var s = step ; s <= (100-step/2); s += step) {
				for (var i = 0; i < colors; i++) {
					html += '<div data-s="'+s+'" style="background-color: rgb(' + fx.hsv2rgb(i * share, s, 100).join(',') + ');"></div>';
				}
				html += '<div style="background-color: rgb(' + fx.hsv2rgb(0, 0, 100 - (s / step - 1) * 16.7).join(',') + ');"></div><br />';
			}
			for (var v = 100 - step * ((steps + 1) % 2)/2; v >= step/2; v -= step) {
				for (var i = 0; i < colors; i++) {
					html += '<div data-v="'+v+'" style="background-color: rgb(' + fx.hsv2rgb(i * share, 100, v).join(',') + ');"></div>';
				}
				html += '<div style="background-color: rgb(' + fx.hsv2rgb(0, 0, (v / step - 1) * 16.7).join(',') + ');"></div><br />';
			}
			
			html += '</div>';
			
			var items = $(this).attr('data-item').explode();
			var colormodel = $(this).attr('data-colormodel');
			var max = $(this).attr('data-max').explode();
			var min = $(this).attr('data-min').explode();
			// ensure max and min as array of 3 floats (fill by last value if array is shorter)
			for(var i = 0; i <= 2; i++) {
				max[i] = parseFloat(max[Math.min(i, max.length-1)])
				min[i] = parseFloat(min[Math.min(i, min.length-1)])
			}


			$(html).popup({ theme: "a", overlayTheme: "a", positionTo: this }).popup("open")
			.on("popupafterclose", function() { $(this).remove(); })
			.children('div').on( {
				'click': function (event) {
					var rgb = $(this).css('background-color');
					var values = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
					values.shift(); // remove match of hole string

					switch(colormodel) {
						case 'rgb':
							values = [
								Math.round(values[0] / 255 * (max[0] - min[0])) + min[0],
								Math.round(values[1] / 255 * (max[1] - min[1])) + min[1],
								Math.round(values[2] / 255 * (max[2] - min[2])) + min[2]
							];
							break;
						case 'hsl':
							values = fx.rgb2hsl(values[0],values[1],values[2]);
							values = [
								Math.round(values[0] / 360 * (max[0] - min[0])) + min[0],
								Math.round(values[1] / 100 * (max[1] - min[1])) + min[1],
								Math.round(values[2] / 100 * (max[2] - min[2])) + min[2]
							];
							break;
						case 'hsv':
							values = fx.rgb2hsv(values[0],values[1],values[2]);
							values = [
								Math.round(values[0] / 360 * (max[0] - min[0])) + min[0],
								Math.round(values[1] / 100 * (max[1] - min[1])) + min[1],
								Math.round(values[2] / 100 * (max[2] - min[2])) + min[2]
							];
							break;
					}

					if(items[1] == '') { // all values as list in one item
						io.write(items[0], values);
					}
					else {
						io.write(items[0], values[0]);
						io.write(items[1], values[1]);
						io.write(items[2], values[2]);
					}

					$(this).parent().popup('close');
				},
				
				'mouseenter': function (event) {
					$(this).addClass("ui-focus");
				},
				
				'mouseleave': function (event) {
					$(this).removeClass("ui-focus");
				}
			});
		}
	})
	// colors on disc (as former basic.colordisc)
	.end().filter('a[data-style="disc"]').on( {
		'click': function (event) {
			var canvas = $('<canvas style="border: none;">')
			
			var size = 280;
			var colors = parseInt($(this).attr('data-colors'));
			var steps = parseInt($(this).attr('data-step'));
			var step = Math.round(2 * 100 / (steps + 1) * 10000) / 10000;

			var arc = Math.PI / (colors + 2) * 2;
			var startangle = arc - Math.PI / 2;
			var gauge = (size - 2) / 2 / (steps + 1);
			var share = 360 / colors;
			var center = size / 2;

			if (canvas[0].getContext) {
				var ctx = canvas[0].getContext("2d");
				ctx.canvas.width = size;
				ctx.canvas.height = size;
				canvas.width(size).height(size);

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
				for (var i = 0; i <= colors; i++) {
					var angle = startangle + i * arc;
					var ring = 1;
					var h = i * share;
					for (var v = step; v <= 100 - step/2; v += step) {
						ctx.beginPath();
						ctx.fillStyle = 'rgb('+fx.hsv2rgb(h, 100, v).join(',')+')';
						ctx.arc(center, center, ring * gauge + gauge + 1, angle, angle + arc + 0.01, false);
						ctx.arc(center, center, ring * gauge, angle + arc + 0.01, angle, true);
						ctx.fill();
						ring += 1;
					}
					for (var s = (100 - step * ((steps + 1) % 2)/2); s >= step/2; s -= step) {
						ctx.beginPath();
						ctx.fillStyle = 'rgb('+fx.hsv2rgb(h, s, 100).join(',')+')';
						ctx.arc(center, center, ring * gauge + gauge + 1, angle, angle + arc + 0.01, false);
						ctx.arc(center, center, ring * gauge, angle + arc + 0.01, angle, true);
						ctx.fill();
						ring += 1;
					}
				}

				// draw grey
				angle = startangle - 2 * arc;
				ring = 1;
				h = i * share;
				for (var v = step; v <= 100; v += (step / 2)) {
					ctx.beginPath();
					ctx.fillStyle = 'rgb('+fx.hsv2rgb(h, 0, v).join(',')+')';
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

			var items = $(this).attr('data-item').explode();
			var colormodel = $(this).attr('data-colormodel');
			var max = $(this).attr('data-max').explode();
			var min = $(this).attr('data-min').explode();
			// ensure max and min as array of 3 floats (fill by last value if array is shorter)
			for(var i = 0; i <= 2; i++) {
				max[i] = parseFloat(max[Math.min(i, max.length-1)])
				min[i] = parseFloat(min[Math.min(i, min.length-1)])
			}

			// event handler on color select
			canvas.popup({ theme: 'none', overlayTheme: 'a', shadow: false, positionTo: this }).popup("open")
			.on( {
				'popupafterclose': function() { $(this).remove(); },
				'click': function (event) {
					var offset = $(this).offset();
					var x = Math.round(event.pageX - offset.left);
					var y = Math.round(event.pageY - offset.top);

					var values = canvas[0].getContext("2d").getImageData(x, y, 1, 1).data;
					// DEBUG: console.log([rgb[0], rgb[1], rgb[2], rgb[3]]);

					if(values[3] > 0) { // set only if selected color is not transparent
						switch(colormodel) {
							case 'rgb':
								values = [
									Math.round(values[0] / 255 * (max[0] - min[0])) + min[0],
									Math.round(values[1] / 255 * (max[1] - min[1])) + min[1],
									Math.round(values[2] / 255 * (max[2] - min[2])) + min[2]
								];
								break;
							case 'hsl':
								values = fx.rgb2hsl(values[0],values[1],values[2]);
								values = [
									Math.round(values[0] / 360 * (max[0] - min[0])) + min[0],
									Math.round(values[1] / 100 * (max[1] - min[1])) + min[1],
									Math.round(values[2] / 100 * (max[2] - min[2])) + min[2]
								];
								break;
							case 'hsv':
								values = fx.rgb2hsv(values[0],values[1],values[2]);
								values = [
									Math.round(values[0] / 360 * (max[0] - min[0])) + min[0],
									Math.round(values[1] / 100 * (max[1] - min[1])) + min[1],
									Math.round(values[2] / 100 * (max[2] - min[2])) + min[2]
								];
								break;
						}

						if(items[1] == '') { // all values as list in one item
							io.write(items[0], values);
						}
						else {
							io.write(items[0], values[0]);
							io.write(items[1], values[1]);
							io.write(items[2], values[2]);
						}
					}
					
					$(this).popup("close");
				}
			});

		}
	})
	.end().filter('div[data-style="slider"]').find('input').on( {
		'slidestop': function (event) {
			if ($(this).val() != $(this).attr('mem')) {
				$(this).trigger('click');
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
			var widget = $(this).closest('div[data-style="slider"]');
			var colormodel = widget.attr('data-colormodel');
			var max = widget.attr('data-max').explode();
			var min = widget.attr('data-min').explode();
			// ensure max and min as array of 3 floats (fill by last value if array is shorter)
			for(var i = 0; i <= 2; i++) {
				max[i] = parseFloat(max[Math.min(i, max.length-1)])
				min[i] = parseFloat(min[Math.min(i, min.length-1)])
			}

			// get value of all 3 sliders
			var values = widget.find('input').map(function(){ return $(this).val(); }).get();
			switch(colormodel) {
				case 'rgb':
					values = fx.hsv2rgb(values[0],values[1],values[2]);
					values = [
						Math.round(values[0] / 255 * (max[0] - min[0])) + min[0],
						Math.round(values[1] / 255 * (max[1] - min[1])) + min[1],
						Math.round(values[2] / 255 * (max[2] - min[2])) + min[2]
					];
					break;
				case 'hsl':
					values = fx.hsv2hsl(values[0],values[1],values[2]);
					values = [
						Math.round(values[0] / 360 * (max[0] - min[0])) + min[0],
						Math.round(values[1] / 100 * (max[1] - min[1])) + min[1],
						Math.round(values[2] / 100 * (max[2] - min[2])) + min[2]
					];
					break;
				case 'hsv':
					values = [
						Math.round(values[0] / 360 * (max[0] - min[0])) + min[0],
						Math.round(values[1] / 100 * (max[1] - min[1])) + min[1],
						Math.round(values[2] / 100 * (max[2] - min[2])) + min[2]
					];
					break;
			}

			var items = widget.attr('data-item').explode();
			if(items[1] == '') { // all values as list in one item
				io.write(items[0], values);
			}
			else {
				io.write(items[0], values[0]);
				io.write(items[1], values[1]);
				io.write(items[2], values[2]);
			}
		}
	});

	;

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
			$(this).val(response[0]).flipswitch('refresh');
		},

		'change': function (event) {
			// DEBUG: console.log("[basic.flip] change '" + this.id + "':", $(this).val());
			io.write($(this).attr('data-item'), $(this).val());
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
			else if (formatLower == 'text' || formatLower == 'html' || formatLower == 'script')
				type = 'String';
			else
				type = 'Number';
			
			formula = formula.replace(/VAR(\d+)/g, 'VAR[$1-1]');
			 
			var VAR = response;
			var SUM = function(val) {
				return val.reduce(function(a, b) {
					return a + b;
				});
 			};
			var SUB = function(val) {
				return 2 * val[0] - SUM(val); // difference equals to two times first value minus sum, because sum contains first value
			};
			var AVG = function(val) {
			 return SUM(val) / val.length;
			};
			var MIN = function(val) {
				return val.reduce(function(a, b) {
					return a < b && a !== undefined ? a : b;
				});
 			};
			var MAX = function(val) {
				return val.reduce(function(a, b) {
					return b < a && a !== undefined ? a : b;
				});
 			};
 			
			var calc = eval(formula);
			
			if(type == 'Date')
				calc = new Date(calc).transUnit(format);
			else if (type == 'Number' && !isNaN(calc))
				calc = parseFloat(calc).transUnit(format);
			else if (formatLower == 'script') // no output for format 'script'
				calc = '';

			// print the result
			if (formatLower == 'html')
				$(this).html(calc);
			else
				$(this).text(calc);

			colorizeText(this, calc);
		}
	});

	// ----- basic.select ----------------------------------------------------------
	$(bevent.target).find('select[data-widget="basic.select"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
      $(this).val(response[0]).selectmenu('refresh');
		},

		'change': function (event) {
			var item = $(this).attr('data-item');
			io.write(item, $(this).val());
		}
	});

	// ----- basic.shifter ---------------------------------------------------------
	$(bevent.target).find('span[data-widget="basic.shifter"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var max = parseInt($(this).attr('data-max'));
			var min = parseInt($(this).attr('data-min'));

			var step = Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 10 + 0.49) * 10;

			if (response[1] != 0 && step > min) {
				var percent = Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 100);
				$(this).find('img').attr('src', $(this).attr('data-pic-on').replace('00', step)).attr('alt', percent + '%').attr('title', percent + '%');
			}
			else {
				$(this).find('img').attr('src', $(this).attr('data-pic-off')).attr('alt', '0%').attr('title', '0%');
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
			
			var max = parseInt($(this).attr('data-max'));
			var min = parseInt($(this).attr('data-min'));
			
			var a = 13;
			var mode = ($(this).attr('data-mode') == 'half' ? 0.5 : 1);
			if (response[1] !== undefined) {
				a = parseInt(13 / mode * ((response[1] - min) / (max - min) + mode - 1));
			}

			var style;

			var h = parseInt(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 13 * 14);
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
			var max = parseInt($(this).attr('data-max'));
			var min = parseInt($(this).attr('data-min'));
			var step = parseInt($(this).attr('data-step'));
			
			var offset = $(this).offset();
			var x = event.pageX - offset.left;
			var y = event.pageY - offset.top;
			var val = Math.floor(y / $(this).outerHeight() * (max - min) / step) * step + min;
			
			var items = $(this).attr('data-item').explode();
			if (items[1] != '' && x > $(this).outerWidth() / 2) {
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
				$(this).trigger('click');
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
			// hide all states
			$(this).next('a[data-widget="basic.stateswitch"][data-index]').insertBefore($(this).children('a:eq(' + $(this).next('a[data-widget="basic.stateswitch"][data-index]').attr('data-index') + ')'));
			// stop activity indicator
			$(this).children('a[data-widget="basic.stateswitch"]').trigger('stopIndicator');
			// show the first corrseponding to value. If none corrseponds, the last one will be shown by using .addBack(':last') and .first()
			$(this).after($(this).children('a[data-widget="basic.stateswitch"]').filter('[data-val="' + val + '"]:first').addBack(':last').first());
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
			// activity indicator
			var indicatorType = widget.attr('data-indicator-type');
			var indicatorDuration = parseInt(widget.attr('data-indicator-duration'));
			if(indicatorType && indicatorDuration > 0) {
				// add one time event to stop indicator
				$(this).one('stopIndicator',function(event) {
					clearTimeout($(this).data('indicator-timer'));
					event.stopPropagation();
					var prevColor = $(this).attr('data-col');
					if(prevColor != null) {
						if(prevColor != 'icon1')
							$(this).removeClass('icon1').find('svg').removeClass('icon1');
						if(prevColor != 'blink')
							$(this).removeClass('blink').find('svg').removeClass('blink');
						if(prevColor == 'icon1' || prevColor == 'icon0')
							prevColor = '';
						$(this).css('color', prevColor).find('svg').css('fill', prevColor).css('stroke', prevColor);
					}
				})
				// set timer to stop indicator after timeout
				.data('indicator-timer', setTimeout(function() { $(this).trigger('stopIndicator') }, indicatorDuration*1000 ));
				// start indicator
				if(indicatorType == 'icon1' || indicatorType == 'icon0' || indicatorType == 'blink') {
					$(this).addClass(indicatorType).find('svg').addClass(indicatorType);
					indicatorType = '';
				}
				$(this).css('color', indicatorType).find('svg').css('fill', indicatorType).css('stroke', indicatorType);
			}
		}
	})
	// init
	.end().each(function() {
		// replicate ui-first-child and ui-last-child if first resp. last sibling of tag 'a' has it
		if($(this).children('a:first').hasClass('ui-first-child'))
			$(this).children('a').addClass('ui-first-child');
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

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));

			var factor = Math.min(Math.max((response[0] - min) / (max - min), 0), 1);

			$(this).attr('title', Math.round(factor * 100) + '%')
				.find('div').css('height', factor * $(this).height());
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


// ----- c l o c k ------------------------------------------------------------
// ----------------------------------------------------------------------------

	// ----- clock.digiclock ------------------------------------------------------
	$(bevent.target).find('div.digiclock[data-widget="clock.digiclock"]').on( {
		'init': function(event) {
			$(this).digiclock({ svrOffset: window.servertimeoffset || 0 });
		}
	})
	.trigger('init');
	
	$(bevent.target).find('div.digiweather[data-widget="clock.digiclock"]').each(function() {
		var node = $(this);
		$.getJSON($(this).attr("data-service-url"), function (data) {
			node.find('img').attr('src', 'lib/weather/pics/' + data.current.icon + '.png').attr('alt', data.current.icon);
			node.find('.city').html(data.city);
			node.find('.cond').html(data.current.conditions);
			node.find('.temp').html(data.current.temp);
		});
	});

	// ----- clock.iconclock ------------------------------------------------------
	$(bevent.target).find('span[data-widget="clock.iconclock"]').on( {
		'repeat': function (event) {
			event.stopPropagation();

			var now = new Date(Date.now() - (window.servertimeoffset || 0));
			var minutes = Math.floor(now.getHours()*60 + now.getMinutes());
			$(this).find('svg').trigger('update', [[minutes]]);

			// DEBUG: console.log("[iconclock] '" + this.id + "'", minutes);
		}
	});

	// ----- clock.miniclock ------------------------------------------------------
	$(bevent.target).find('span[data-widget="clock.miniclock"]').on( {
		'repeat': function (event) {
			event.stopPropagation();

			var now = new Date(Date.now() - (window.servertimeoffset || 0));
			$(this).text(now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes());
		}
	});

	// init servertime offset on all clocks
	$(bevent.target).find('[data-servertime-url]:first').each(function() { // init
		if(window.servertimeoffset === undefined) {
			var localtime = Date.now();
			$.ajax({
				url: $(this).attr("data-servertime-url"),
				cache: false
			}).done(function(resp) {
				var servertime = Number(resp) * 1000;
				// use average of start and end request timestamp and make it local time
				localtime = localtime / 2 + Date.now() / 2;
				window.servertimeoffset = servertime - localtime;
				$(bevent.target).find('[data-servertime-url]').trigger('init').trigger('repeat');
			});
		}
		else {
			$(bevent.target).find('[data-servertime-url]').trigger('init');
		}
	});

// ----- c a l e n d a r ------------------------------------------------------
// ----------------------------------------------------------------------------

	// ----- calendar.list --------------------------------------------------------
	$(bevent.target).find('div[data-widget="calendar.list"]').on( {
		'repeat': function (event) {
			var node = $(this);
			$.getJSON('lib/calendar/service/'+node.attr('data-service')+'.php?count='+node.attr('data-count')+'&calendar='+node.attr('data-calendar'), function (data) {

				var calendars = node.attr('data-calendar').explode();
				var calcolors = {};
				$.each(node.attr('data-color').explode(), function(i, color) {
					calcolors[(calendars[i]||'').toLowerCase()] = color;
				});

				var ul = node.children('ul:first').empty();

				$.each(data, function(index, entry) {
					
					// parse start and end as Date
					if(isNaN(entry.start)) // legacy: start in format 'y-m-d H:i:s'
						entry.start = new Date(Date.parse('20' + entry.start));
					else // start as timestamp
						entry.start = new Date(entry.start*1000);

					if(isNaN(entry.end)) // legacy: end in format 'y-m-d H:i:s'
						entry.end = new Date(Date.parse('20' + entry.end));
					else // end as timestamp
						entry.end = new Date(entry.end*1000);

					// build period string to display
					var period;
					// Start and end on same day: show day only once
					if(entry.end.transUnit('date') == entry.start.transUnit('date'))
						period = entry.start.transUnit('date') + ' ' + entry.start.transUnit('time') + ' - ' + entry.end.transUnit('time');
					// Full day entrys: don't show time
					else if (entry.start.getHours()+entry.start.getMinutes()+entry.start.getSeconds() == 0
						&& entry.end.getHours()+entry.end.getMinutes()+entry.end.getSeconds() == 0) {
						entry.end.setDate(entry.end.getDate()-1); // subtract one day from end
						if(entry.end.transUnit('date') == entry.start.transUnit('date')) // One day only: Show just start date
							period = entry.start.transUnit('date');
						else // Multiple days: Show start and end date
							period = entry.start.transUnit('date') + ' - ' + entry.end.transUnit('date');
					}
					else
						period = entry.start.transUnit('date') + ' ' + entry.start.transUnit('time') + ' - ' + entry.end.transUnit('date') + ' ' + entry.end.transUnit('time');

					// handle calendar_event_format in lang.ini
					$.each(sv_lang.calendar_event_format, function(pattern, attributes) {
						if(entry.title.toLowerCase().indexOf(pattern.toLowerCase()) > -1) { // event title contains pattern
							// set each defined property
							$.each(attributes, function(prop, val) {
								entry[prop] = val;
							});
						}
					});

					// handle tags in event description
					var tags = (entry.content||'').replace(/\\n/,'\n').match(/@(.+?)\W+(.*)/igm) || [];
					$.each(tags, function(i, tag) {
						// parse tag
						tag = tag.match(/@(.+?)\W+(.*)/i);
						// prepend # if color is hexadecimal number of 3 or 6 digits
						if(tag[1] == 'color' && /^([0-9a-f]{3}){1,2}\W*$/i.test(tag[2]))
							tag[2] = '#'+tag[2];
						// apply tag to events properties
						entry[tag[1]] = tag[2];
					});

					// amend icon path/filename
					if(entry.icon) {
						// add default path if icon has no path
						if(entry.icon.indexOf('/') == -1)
							entry.icon = 'icons/ws/'+entry.icon;
						// add svg suffix if icon has no suffix
						if(entry.icon.indexOf('.') == -1)
							entry.icon = entry.icon+'.svg';
					}
					
					// add entry
					var a = $('<a>').append(
						$('<img class="icon">').css('background', entry.color || 'transparent').attr('src', entry.icon || 'pages/base/pics/trans.png')
					).append(
						$('<div class="color">').css('background', calcolors[(entry.calendarname||'').toLowerCase()] || entry.calendarcolor || node.attr('data-color').explode()[0] || '#666666')
					).append(
						$('<h3>').text(entry.title)
					).append(
						$('<p>').text(period)
					).appendTo(
					 $('<li data-icon="false">').appendTo(ul)
					);
					if(entry.link)
						a.attr('href', entry.link);
					if(entry.where)
						a.append($('<span class="ui-li-count">').text(entry.where));

				});

				ul.trigger('prepare').listview('refresh').trigger('redraw');
			})
			.error(notify.json);
		}
	});

	// ----- calendar.waste -------------------------------------------------------
	$(bevent.target).find('div[data-widget="calendar.waste"]').on( {
		'repeat': function(event) {
			var node = $(this);

			var morgen = new Date();
			morgen.setHours(0);
			morgen.setMinutes(0);
			morgen.setSeconds(0);
			morgen.setMilliseconds(0);
			morgen.setDate(morgen.getDate() + 1);
			var uebermorgen = new Date(morgen);
			uebermorgen.setDate(uebermorgen.getDate() + 1);

			var spalte = 0;
			var muell_html = "";//<table class ='ui-btn-up-a' style='width:100%;text-align:center;overflow:hidden;'><tr>";

			$.getJSON('lib/calendar/service/'+node.attr('data-service')+'.php?count='+node.attr('data-count')+'&calendar='+node.attr('data-calendar'), function (data) {

				$.each(data, function(index, entry) {
					// parse start as Date
					if(isNaN(entry.start)) // legacy: start in format 'y-m-d H:i:s'
						entry.start = new Date(Date.parse('20' + entry.start));
					else // start as timestamp
						entry.start = new Date(entry.start*1000);

					// handle calendar_event_format in lang.ini
					$.each(sv_lang.calendar_event_format, function(pattern, attributes) {
						if(entry.title.toLowerCase().indexOf(pattern.toLowerCase()) > -1) { // event title contains pattern
							// set each defined property
							$.each(attributes, function(prop, val) {
								entry[prop] = val;
							});
						}
					});

					// handle tags in event description
					var tags = (entry.content||'').replace(/\\n/,'\n').match(/@(.+?)\W+(.*)/igm) || [];
					$.each(tags, function(i, tag) {
						// parse tag
						tag = tag.match(/@(.+?)\W+(.*)/i);
						// prepend # if color is hexadecimal number of 3 or 6 digits
						if(tag[1] == 'color' && /^([0-9a-f]{3}){1,2}\W*$/i.test(tag[2]))
							tag[2] = '#'+tag[2];
						// apply tag to events properties
						entry[tag[1]] = tag[2];
					});

					entry.icon = "icons/ws/message_garbage_2.svg";

					muell_html += '<div style="float: left; width: ' + Math.floor(100 / Number(node.attr('data-count'))) + '%;">';
					muell_html += '<div style="margin: 0 1px; ';
					if (entry.start < morgen)
						muell_html += 'border-bottom: red 8px inset; overflow: hidden;';
					else if (entry.start < uebermorgen)
						muell_html += 'border-bottom: orange 8px inset; overflow: hidden;';
					muell_html += '">'
          muell_html += '<img class="icon icon1" src="' + entry.icon + '" style="width: 100%; height: 100%; fill: ' + entry.color + '; stroke: ' + entry.color + '" />';
					muell_html += '<div style="font-size: 0.9em;">' + entry.start.transUnit('D') + ', ' + entry.start.transUnit('day') + '</div>'
					muell_html += '</div>';
					muell_html += '</div>';

				});

				node.find('div').html(muell_html);
				fx.init(); // load svg inline

			})
			.error(notify.json);
		}
	});

// ----- d e v i c e ----------------------------------------------------------
// ----------------------------------------------------------------------------

	// ----- device.codepad -------------------------------------------------------
	$(bevent.target).find('div[data-widget="device.codepad"]').each(function() {
		var codepad = $(this);
		var id = codepad.attr('data-id');
		$('[data-bind="' + id + '"]').find('*').on('click', function(event) {
			if (!$(this).closest('[data-bind="' + id + '"]').attr('data-access')) {
				codepad.popup('open');
				codepad.find('input').val('').focus();
				codepad.data('originally-clicked', $(this));
				event.stopPropagation();
				event.preventDefault();
			}
		});
	})
	.on( {
		'keyup': function (event) {
			if (event.keyCode == 13) {
				$(this).find('[data-val="ok"]').click();
			}
		},
		
		'click': function (event) {
			if (!$(this).attr('data-access')) {
				$(this).popup('open');
				$(this).val('').focus();
			}
		}
	})
	.find('> div > a').on( {
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
			var item = node.find('.set .temp span').attr('data-item');

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
								var daydate = new Date(0);
								$.each([ 'MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU' ], function(index, value) {
									daydate.setDate(5 + index); // Set date to one on according weekday (05.01.1970 was a monday)
									tt += "<label title='" + daydate.transUnit('l') + "'><input type='checkbox' value='" + value + "'>" + daydate.transUnit('D') + "</label>";
								});
			tt +=			"</fieldset>" +
							"</div>";

			tt += 	"<div class='uzsuCell uzsuValueCell'>" +
						"<div class='uzsuCellText'>Value</div>";
			if (valueType === 'bool') {
				// Unterscheidung Anzeige und Werte
				if (valueParameterList[0].split(':')[1] === undefined) {
					tt += "<select data-role='flipswitch'>" +
									"<option value='0'>" + valueParameterList[1] + "</option>" +
									"<option value='1'>"	+ valueParameterList[0] + "</option>" +
								"</select>";
				}
				else {
					tt += "<select data-role='flipswitch'>" +
									"<option value='" + valueParameterList[1].split(':')[1]	+ "'>" + valueParameterList[1].split(':')[0] + "</option>" +
									"<option value='" + valueParameterList[0].split(':')[1]	+ "'>" + valueParameterList[0].split(':')[0] + "</option>" +
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
				uzsuTimeCron.attr('type','input').val(uzsuRowExpHoli.find('.uzsuEvent select').val()).textinput('disable');
			}
			else{
				if(uzsuTimeCron.val().indexOf('sun')===0)
					uzsuTimeCron.attr('type','time').val('00:00');
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

				if(responseEntry.value != null) {
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
				responseEntry.value = uzsuCurrentRows.find('.uzsuValueCell select, .uzsuValueCell input').val();
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
			response.list.push({active:false,rrule:'',time:'00:00',value:null,event:'time',timeMin:'',timeMax:'',timeCron:'00:00',timeOffset:'',condition:{deviceString:'',type:'String',value:'',active:false},delayedExec:{deviceString:'',type:'String',value:'',active:false},holiday:{workday:false,weekend:false}});
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
				$(this).find('.icon-off').hide();
				$(this).find('.icon-on').show();
			}
			else {
				$(this).find('.icon-on').hide();
				$(this).find('.icon-off').show();
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


	// ----- plot.period ----------------------------------------------------------
	$(bevent.target).find('div[data-widget="plot.period"]').on( {
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
			var mode = $(this).attr('data-mode');
			var units = $(this).attr('data-unit').explode();
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
			var ytype = $(this).attr('data-ytype').explode();

			// series
			var series = [];

			if(mode == 'minmax' || mode == 'minmaxavg') {
				var itemCount = response.length / (mode == 'minmax' ? 2 : 3);

				var minResponse = response.slice(0, itemCount);
				var maxResponse = response.slice(itemCount, itemCount * 2);
				response = response.slice(itemCount * 2);

				for (var i = 0; i < itemCount; i++) {
					var minValues = minResponse[i];
					var maxValues = maxResponse[i];

					var data = [];
					for (var j = 0; j < minValues.length; j++) {
						data.push( [ minValues[j][0], minValues[j][1], maxValues[j][1] ] );
					}

					series.push({
						type: 'columnrange',
						enableMouseTracking: false,
						name: (label[i] == null ? 'Item ' + (i+1) : label[i]) + (mode == 'minmaxavg' && label[i] !== '' ? ' (min/max)' : ''),
						showInLegend: false,
						data: data,
						color: (color[i] ? color[i] : Highcharts.getOptions().colors[i]),
						yAxis: (assign[i] ? assign[i] - 1 : 0)
					});
				}
			}

			for (var i = 0; i < response.length; i++) {
				series.push({
					type: (exposure[i] != 'stair' ? exposure[i] : 'line'),
					step: (exposure[i] == 'stair' ? 'left' : false),
					name: (label[i] == null ? 'Item ' + (i+1) : label[i]),
					data: response[i],
					color: (color[i] ? color[i] : null),
					yAxis: (assign[i] ? assign[i] - 1 : 0)
				});
			}

			// y-axis
			var numAxis = 1;
			if(assign.length > 0)
				numAxis = Math.max.apply(null, assign); // find highest y-axis index on assignments

			var yaxis = [];
			for (var i = 0; i < numAxis; i++) {
				yaxis[i] = {
					min: (ymin[i] ? (isNaN(ymin[i]) ? 0 : ymin[i]) : null),
					max: (ymax[i] ? (isNaN(ymax[i]) ? 1 : ymax[i]) : null),
					title: {text: axis[i + 1]},
					opposite: (opposite[i] > 0),
					endOnTick: false,
					startOnTick: false,
					type: ytype[i] || 'linear',
					svUnit: units[i] || 'float'
				};
				if(ycolor[i]) {
					yaxis[i].lineColor = ycolor[i];
					yaxis[i].tickColor = ycolor[i];
				}
				if(ytype[i] == 'boolean') {
					yaxis[i].categories = [ymin[i] || 0, ymax[i] || 1];
					yaxis[i].type = 'category';
					yaxis[i].gridLineColor = 'transparent';
					yaxis[i].gridLineWidth = 0;
				}
			}

			// draw the plot
			var chartOptions = {
				chart: {},
				series: series,
				xAxis: {type: 'datetime', title: {text: axis[0]}},
				yAxis: yaxis,
				legend: { enabled: label.length > 0 },
				tooltip: {
					pointFormatter: function() {
						var unit = this.series.yAxis.userOptions.svUnit;
						var value = (this.series.yAxis.categories) ? this.series.yAxis.categories[this.y] : parseFloat(this.y).transUnit(unit);

						if(mode == 'minmax' || mode == 'minmaxavg') {
							var minmax = this.series.chart.series[this.series.index - this.series.chart.series.length / 2].data[this.index];
							var minValue = parseFloat(minmax.low).transUnit(unit);
							var maxValue = parseFloat(minmax.high).transUnit(unit);
							return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ' \u00D8: <b>' + value + '</b><br/>' +
								'<span style="visibility: hidden">\u25CF</span> min: <b>' + minValue + '</b> max: <b>' + maxValue + '</b><br/>';
						}
						else
							return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + value + '</b><br/>';
					}
				},
				plotOptions: {
					columnrange: {
						dataLabels: {
							enabled: true,
							formatter: function () {
								return parseFloat(this.y).transUnit(this.series.yAxis.userOptions.svUnit);
							}
						}
					}
				}
			};

			if(zoom) {
				chartOptions.chart.zoomType = 'x';
				chartOptions.xAxis.minRange = new Date().duration(zoom).valueOf();
			}

			$(this).highcharts(chartOptions);

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

	// ----- plot.gauge solid ------------------------------------------------------
	$(bevent.target).find('div[data-widget="plot.gauge"][data-mode^="solid"]').on( {
		'update': function (event, response) {
			event.stopPropagation();

			//debug: console.log("[plot.gauge-solid] '" + this.id + "' update: " + response);

			var stop = [];
			if ($(this).attr('data-stop') && $(this).attr('data-color')) {
				var datastop = $(this).attr('data-stop').explode();
				var color = $(this).attr('data-color').explode();

				if (datastop.length == color.length)
				{
					for (var i = 0; i < datastop.length; i++) {
						stop[i] = [ parseFloat(datastop[i])/100, color[i]]
					}
				}
			}

			var unit = $(this).attr('data-unit');
			var headline = $(this).attr('data-label') ? $(this).attr('data-label') : null;

			var axis = $(this).attr('data-axis').explode();

			var diff = parseFloat($(this).attr('data-min'));
			var range = parseFloat($(this).attr('data-max')) - parseFloat($(this).attr('data-min'));
			var percent = (((response - diff) * 100) / range);

			var options = {
				chart: {
					type: 'solidgauge',
					margin: [0, 15, 0, 15],
					spacing: [0, 0, 5, 0]
				},

				title: {
					text: headline,
					verticalAlign: 'middle',
					y: -20
				},

				pane: {
					center: ['50%', '50%'],
					//startAngle: depends on type, see below,
					//endAngle: depends on type, see below,
					background: [{
						outerRadius: '100%',
						innerRadius: '60%',
						shape: 'arc'
					}]
				},

				tooltip: {
					enabled: false
				},

				// the value axis
				yAxis: {
					min: 0,
					max: 100,
					stops: stop.length > 0 ? stop : null,
					lineWidth: 0,
					gridLineColor: 'transparent',
					minorTickInterval: null,
					tickAmount: 2,
					labels: {
						distance: -15,
						step: 1,
						enabled: true,
						formatter: function () { return (((this.value * range) / 100) + diff); }
					}
				},

				plotOptions: {
					solidgauge: {
						dataLabels: {
							borderWidth: 0,
							useHTML: true
						}
					},
					linecap: 'round',
					stickyTracking: false,
					rounded: true
				},

				series: [{
					name: headline,
					data: [percent],
					dataLabels: {
						formatter: function () { return (((this.y * range) / 100) + diff).transUnit(unit); }
					}
				}]
			}

			var marginBottom;
      if ($(this).attr('data-mode') == 'solid-half')
			{
				options.pane.startAngle = -90;
				options.pane.endAngle = 90;
				options.yAxis.labels.y = 16;
				options.yAxis.labels.distance = -8;
				options.plotOptions.solidgauge.dataLabels.y = options.title.y = -25;
				marginBottom = '-40%';
			}
			else if ($(this).attr('data-mode') == 'solid-cshape')
			{
				options.pane.startAngle = -130;
				options.pane.endAngle = 130;
				options.yAxis.labels.y = 20;
				options.plotOptions.solidgauge.dataLabels.y = options.title.y = -15;
				marginBottom = '-20%';
			}
			else if ($(this).attr('data-mode') == 'solid-circle')
			{
				options.pane.startAngle = 0;
				options.pane.endAngle = 360;
				options.pane.background.shape = 'circle';
				options.yAxis.labels.y = -20;
				options.yAxis.labels.step = 2;
				options.plotOptions.solidgauge.dataLabels.y = options.title.y = -10;
			}

			$(this).highcharts(options);

			if(marginBottom) {
				$(this).find('.highcharts-container').css('margin-bottom', marginBottom);
			}
		},

		'point': function (event, response) {
			if (response)
			{
				var diff = parseFloat($(this).attr('data-min'));
				var range = parseFloat($(this).attr('data-max')) - parseFloat($(this).attr('data-min'));
				var percent = (((response - diff) * 100) / range);
				var chart = $(this).highcharts();
				chart.series[0].points[0].update(percent);
				chart.redraw();
			}
		}
	});

	// ----- plot.gauge angular ----------------------------------------------------
	$(bevent.target).find('div[data-widget="plot.gauge"][data-mode="speedometer"], div[data-widget="plot.gauge"][data-mode="scale"]').on( {
		'update': function (event, response) {
			event.stopPropagation();

			var headline = $(this).attr('data-label') ? $(this).attr('data-label') : null;
			var unit = $(this).attr('data-unit');
			var axis = $(this).attr('data-axis').explode();
			var mode = $(this).attr('data-mode');
			var datastop = $(this).attr('data-stop').explode();
			var color = $(this).attr('data-color').explode();

			var diff = parseFloat($(this).attr('data-min'));
			var range = parseFloat($(this).attr('data-max') - $(this).attr('data-min'));
			var percent = (((response - diff) * 100) / range);

			var yaxis = [];
			var gauge = [];
			var pane = [];
			var series = [];
			for (var i = 0; i < response.length; i++) {
				if (mode == 'scale') { // type = scale
					var bands = [{
							outerRadius: '99%',
							thickness: 15,
							from: percent,
							to: 100,
							color: 'rgba(255, 255, 255, 0.2)'
						}];
					if (datastop.length > 0 && datastop.length == color.length)
					{
						for (var j = 0; j < datastop.length; j++) {
							bands.push({
								outerRadius: '99%',
								thickness: 15,
								from: j == 0 ? 0 : parseFloat(datastop[j-1]),
								to: Math.min(parseFloat(datastop[j]), percent),
								color: color[j]
							});
							if(parseFloat(datastop[j]) >= percent)
								break;
						}
					}
					else {
						bands.push({
							outerRadius: '99%',
							thickness: 15,
							from: 0,
							to: percent,
							color: color[0] ? color[0] : Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.8).get()
						});
					}

					yaxis[i] = {
						min: 0,
						max: 100,
						lineWidth: 0,
						minorTickInterval: 1.5,
						minorTickWidth: 2,
						minorTickLength: 17,
						minorTickPosition: 'inside',
						minorTickColor: '#444',
						tickWidth: 0,
						labels: {
							enabled: true,
							distance: -25,
							style: {'color': 'lightgrey'},
							formatter: function () {return (((this.value * range) / 100) + diff)}
						},
						plotBands: bands,
						title: {
							text: axis[i],
							style: {
								color: '#bbb',
								fontSize: '15px',
							},
							y: 14
						}
					}
					gauge[i] = {
						dial: {
							radius: '100%',
							color: '#eee',
							backgroundColor: '#eee',
							baseWidth: 3,
							topWidth: 3,
							baseLength: '90%', // of radius
							rearLength: '-70%'
						},
						pivot: {
							radius: 0
						}
					}
					pane[i] = {
						startAngle: -130,
						endAngle: 130,
						background: [{
							backgroundColor: '#555',
							borderWidth: 0,
							outerRadius: '108%'
						}]
					}
					series[i] = {
						name: headline,
						data: [percent],
						yAxis: i,
						dataLabels: {
							borderWidth: 0,
							formatter: function () {return (((this.y * range) / 100) + diff).transUnit(unit)},
							style: {
								fontSize: '30px',
								color: 'grey',
							},
							y: -20
						},
						tooltip: {
							enabled: false
						}
					}
				}
				else // type = speedometer
				{
					var bands = [];
					if ($(this).attr('data-stop') && $(this).attr('data-color')) {
						var datastop = $(this).attr('data-stop').explode();
						var color = $(this).attr('data-color').explode();

						if (datastop.length == color.length)
						{
							for (var j = 0; j < datastop.length; j++) {
								bands.push({
									from: j == 0 ? 0 : parseFloat(datastop[j-1]),
									to: parseFloat(datastop[j]),
									color: color[j]
								});
							}
						}
					}

					yaxis[i] = {
						min: 0,
						max: 100,
						minorTickInterval: 'auto',
						minorTickWidth: 1,
						minorTickLength: 10,
						minorTickPosition: 'inside',
						minorTickColor: '#666',
						tickPixelInterval: 30,
						tickWidth: 2,
						tickPosition: 'inside',
						tickLength: 10,
						tickColor: '#666',
						labels: {
							step: 2,
							rotation: 'auto',
							formatter: function () {return (((this.value * range) / 100) + diff)}
						},
						title: {
							text: axis[i]
						},
						plotBands: bands.length > 0 ? bands : null
					}
					gauge[i] = {
					}
					pane[i] = {
						startAngle: -150,
						endAngle: 150,
						size: "95%",
						background: [{
							backgroundColor: {
								linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
								stops: [
									[0, '#FFF'],
									[1, '#333']
								]
							},
							borderWidth: 0,
							outerRadius: '109%'
						}, {
							backgroundColor: {
								linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
								stops: [
									[0, '#333'],
									[1, '#FFF']
								]
							},
							borderWidth: 1,
							outerRadius: '107%'
						}, {
						// default background
						}, {
							backgroundColor: '#DDD',
							borderWidth: 0,
							outerRadius: '105%',
							innerRadius: '103%'
						}]
					}
					series[i] = {
						name: headline,
						data: [percent],
						yAxis: i,
						dataLabels: {
							color: 'grey',
							formatter: function () {return (((this.y * range) / 100) + diff).transUnit(unit)}
						}
					}
				}
			}

			$(this).highcharts({
				chart: {
					type: 'gauge',
					plotBackgroundColor: null,
					plotBackgroundImage: null,
					plotBorderWidth: 0,
					plotShadow: false
				},

				title: {
					text: headline
				},

				plotOptions: {
					 gauge: gauge[0],
				},

				pane: pane,

				tooltip: {
					enabled: false
				},

				// the value axis
				yAxis: yaxis,
				series: series
			});
		},

		'point': function (event, response) {

			//debug: console.log("[plot.gauge-speedometer] '" + this.id + "' point: " + response);

			var diff = ($(this).attr('data-max') - ($(this).attr('data-max') - $(this).attr('data-min')));
			var range = $(this).attr('data-max') - $(this).attr('data-min');
			var datastop = $(this).attr('data-stop').explode();
			var color = $(this).attr('data-color').explode();

			var data = [];
			var items = $(this).attr('data-item').explode();
			for (i = 0; i < items.length; i++) {
				if (response[i]) {
					data[i] = (((+response[i] - diff) * 100) / range);
				}
				else
				{
					data[i] = (((+widget.get(items[i]) - diff) * 100) / range);
				}
			}

			var chart = $(this).highcharts();

			for (i = 0; i < data.length; i++) {
				var percent = data[i];
				if($(this).attr('data-mode') == 'scale')
				{
					chart.yAxis[i].removePlotBand();
					chart.yAxis[i].addPlotBand({
							outerRadius: '99%',
							thickness: 15,
							from: percent,
							to: 100,
							color: 'rgba(255, 255, 255, 0.2)'
						});
					if (datastop.length > 0 && datastop.length == color.length)
					{
						for (var j = 0; j < datastop.length; j++) {
							chart.yAxis[i].addPlotBand({
								outerRadius: '99%',
								thickness: 15,
								from: j == 0 ? 0 : parseFloat(datastop[j-1]),
								to: Math.min(parseFloat(datastop[j]), percent),
								color: color[j]
							});
							if(parseFloat(datastop[j]) >= percent)
								break;
						}
					}
					else {
						chart.yAxis[i].addPlotBand({
							outerRadius: '99%',
							thickness: 15,
							from: 0,
							to: percent,
							color: color[0] ? color[0] : Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.8).get()
						});
					}
					chart.series[i].setData([percent], false);
				}
				else {
					chart.series[i].points[0].update(percent);
				}
			}
			chart.redraw();
		}
	});

	// ----- plot.gauge-vumeter ----------------------------------------------------------
	$(bevent.target).find('div[data-widget="plot.gauge"][data-mode="vumeter"]').on( {
		'update': function (event, response) {
			event.stopPropagation();

			var headline = $(this).attr('data-label') ? $(this).attr('data-label') : null;
			var chartHeight = $(this).attr('data-label') == '' ? 150 : 200;

			var diff = parseFloat($(this).attr('data-min'));
			var range = parseFloat($(this).attr('data-max')) - parseFloat($(this).attr('data-min'));

			var bands = [];
			if ($(this).attr('data-stop') && $(this).attr('data-color')) {
				var datastop = $(this).attr('data-stop').explode();
				var color = $(this).attr('data-color').explode();

				if (datastop.length == color.length)
				{
					for (var j = 0; j < datastop.length; j++) {
						bands.push({
							from: j == 0 ? 0 : parseFloat(datastop[j-1]),
							to: parseFloat(datastop[j]),
							color: color[j],
							innerRadius: '100%',
							outerRadius: '105%'
						});
					}
				}
			}

			var axis = [];
			var pane = [];
			var series = [];

			for (i = 0; i < response.length; i++) {
				axis[i] = {
					min: 0,
					max: 100,
					minorTickPosition: 'outside',
					tickPosition: 'outside',
					labels: {
						rotation: 'auto',
						distance: 20,
						formatter: function () {return (((this.value * range) / 100) + diff)}
					},
					plotBands: bands,
					pane: i,
					title: {
						text: 'VU<br/><span style="font-size:8px">Channel ' + (i+1) + '</span>',
						y: -40
					}
				}
				pane[i] = {
					startAngle: -45,
					endAngle: 45,
					background: null,
          center: [(100/response.length/2*(2*i+1))+'%', '145%'],
					size: 280
				}
				series[i] = {
					name: 'Channel ' + i,
					data: [(((response[i] - diff) * 100) / range)],
					yAxis: i
				}
			}

			$(this).highcharts({
				chart: {
					type: 'gauge',
					plotBorderWidth: 1,
					plotBackgroundColor: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0, '#FFF4C6'],
							[0.3, '#FFFFFF'],
							[1, '#FFF4C6']
						]
					},
					plotBackgroundImage: null,
					height: chartHeight
				},

				title: {
					text: headline,
				},

				pane: pane,

				tooltip: {
					enabled: false,
				},

				// the value axis
				yAxis: axis,

				plotOptions: {
					gauge: {
						dataLabels: {
							enabled: false
						},
						dial: {
							radius: '100%'
						}
					}
				},

				series: series,
			});
		},

		'point': function (event, response) {

			//debug: console.log("[plot.gauge-vumeter] '" + this.id + "' point: " + response);

			var diff = ($(this).attr('data-max') - ($(this).attr('data-max') - $(this).attr('data-min')));
			var range = $(this).attr('data-max') - $(this).attr('data-min');

			var data = [];
			var items = $(this).attr('data-item').explode();
			for (i = 0; i < items.length; i++) {
				if (response[i]) {
					data[i] = (((+response[i] - diff) * 100) / range);
				}
				else
				{
					data[i] = (((+widget.get(items[i]) - diff) * 100) / range);
				}
			}

			var chart = $(this).highcharts();
			for (i = 0; i < data.length; i++) {
				chart.series[i].points[0].update(data[i]);
			}
			chart.redraw();
		}
	});

	// ----- plot.pie --------------------------------------------------------------
	$(bevent.target).find('div[data-widget="plot.pie"]').on( {
		'update': function (event, response) {
			event.stopPropagation();

			// DEBUG: console.log("[plot.pie] '" + this.id + "': " + response + ' ' + response.length);

			var isLabel = false;
			var isLegend = false;
			var labels = [];
			if ($(this).attr('data-label')) {
				labels = $(this).attr('data-label').explode();
				isLabel = true;
			}
			if ($(this).attr('data-mode') == 'legend') {
				isLegend = true;
				isLabel = false;
			}
			else if ($(this).attr('data-mode') == 'none') {
				isLabel = false;
			}
			var colors = [];
			if ($(this).attr('data-color')) {
				colors = $(this).attr('data-color').explode();
			}
			var val = 0;
			for (i = 0; i < response.length; i++) {
				val = val + response[i];
			}
			var data = [];
			for (i = 0; i < response.length; i++) {
				data[i] = {
					name: labels[i],
					y: response[i] * 100 / val,
					color: (colors[i] ? colors[i] : null)
				}
			}

			// design
			var headline = $(this).attr('data-text');
			var position = 'top';
			if ($(this).attr('data-text') == '') {
				position = 'bottom';
			}

			// draw the plot
			$(this).highcharts({
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					type: 'pie'

				},
				legend: {
					align: 'center',
					verticalAlign:  position,
					x: 0,
					y: 20
				},
				title: {
					text: headline
				},
				tooltip: {
					formatter: function() {
						return this.point.name + ' <b>' + this.y.transUnit('%') + '</b>';
					},
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: isLabel,
							formatter: function() {
								return this.point.name + ' <b>' + this.y.transUnit('%') + '</b>';
							},
							style: {
								color: null
							}
						},
						showInLegend: isLegend
					}
				},
				series: [{
					name: headline,
					colorByPoint: true,
					data: data
				}],
			});
		},
		'point': function (event, response) {

			// DEBUG: console.log("[plot.pie point] '" + this.id + "': " + response);

			var val = 0;
			var data = [];
			var items = $(this).attr('data-item').explode();
			for (i = 0; i < items.length; i++) {
				if (response[i]) {
					val = val +  +response[i];
				}
				else
				{
					val = val +  +widget.get(items[i]);
				}
			}
			for (i = 0; i < items.length; i++) {
				if (response[i]) {
					data[i] = +response[i] * 100 / val;
				}
				else
				{
					data[i] = +widget.get(items[i]) * 100 / val;
				}
			}

			var chart = $(this).highcharts();
			for (i = 0; i < data.length; i++) {
				chart.series[0].data[i].update(data[i]);
			}
			chart.redraw();
		},
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
			var unit = $(this).attr('data-unit');

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
						return this.x + ' - ' + this.series.name + ': <b>' + this.y.transUnit(unit) + '</b>';
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

				var max = parseFloat($(this).attr('data-max'));
				var min = parseFloat($(this).attr('data-min'));
        var percent = Math.round(response[1] == 0 ? 0 : Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 100);
				$(this).attr('alt', $(this).attr('data-widget').substr(5) + ' ' + percent+'%').attr('title', percent+'%').children('title').remove().end().prepend('<title>'+percent+'%</title>');
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

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 2 * Math.PI;

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

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			var val = Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 40 / 6) * 6;
			fx.grid(this, val, [39, 68], [61, 28]);
		}
	});

	// ----- icon.blade -----------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.blade"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			// calculate angle in (0 - ~90°)
			var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 0.4 * Math.PI;
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

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			// calculate angle in (0 - ~180°)
			var val = response[1];
			var ang = -1 * (Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * -0.7 * Math.PI + 0.35 * Math.PI);
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

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			// calculate angle in (0 - 90°)
			var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 0.5 * Math.PI * -1;

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

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			// calculate angle in (0 - 90°)
			var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * -0.7 * Math.PI + 0.35 * Math.PI;
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

			var timestring = ('0' + Math.floor(response[0] / 60)).substr(-2) + ':' + ('0' + (response[0] % 60)).substr(-2);
			$(this).attr('alt', 'clock ' + timestring).attr('title', timestring);
		}
	});

	// ----- icon.compass ---------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.compass"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 2 * Math.PI;

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

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			var val = Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 70);
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

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			var val = Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 10);
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

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 0.44 * Math.PI;
			$(this).find('#pointer').attr('points', '50,85 ' + fx.rotate([15, 48], ang, [50, 85]).toString());
		}
	});

	// ----- icon.shutter ---------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.shutter"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			var val = Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 38);
			fx.grid(this, val, [14, 30], [86, 68]);
		}
	});

	// ----- icon.ventilation -----------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.ventilation"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			var val = (1 - Math.min(Math.max((response[0] - min) / (max - min), 0), 1)) * 4.5 + 0.5;
			$(this).find('#anim').attr('dur', (response[0] > 0 ? val : 0)).attr('begin', 0);
		}
	});

	// ----- icon.volume ---------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.volume"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			var val = Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 71);
			// fx.bar(this, val, [left, bottom], [right, top]);
			fx.bar(this, val, [18, 68], [89, 50]);
		}
	});

	// ----- icon.windmill --------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.windmill"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			var val = (1 - Math.min(Math.max((response[0] - min) / (max - min), 0), 1)) * 4.5 + 0.5;
			$(this).find('#anim1').attr('dur', (response[0] > 0 ? val : 0)).attr('begin', 0);
		}
	});

	// ----- icon.windrose --------------------------------------------------------
	$(bevent.target).find('svg[data-widget="icon.windrose"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_value }}, {{ gad_switch }}

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 2 * Math.PI;

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

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 0.45 * Math.PI;

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

			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			
			var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * Math.PI;
			pt = fx.rotate([10, 90], ang, [50, 90]);

			$(this).find('#sun').attr('x', pt[0] - 50);
			$(this).find('#sun').attr('y', pt[1] - 50);
		}
	});

});