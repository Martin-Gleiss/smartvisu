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


// ----- basic.checkbox -------------------------------------------------------
$.widget("sv.basic_checkbox", $.sv.widget, {

	initSelector: 'input[data-widget="basic.checkbox"]',

	options: {
		'val-on': null,
		'val-off': null
	},

	_update: function(response) {
		this.element.prop('checked', response[0] != this.options['val-off']).checkboxradio('refresh');
	},

	_events: {
		'change': function(ev) {
			this._write(this.element.prop('checked') ? this.options['val-on'] : this.options['val-off']);
		}
	}

});


// ----- basic.select ----------------------------------------------------------
$.widget("sv.basic_select", $.sv.widget, {

	initSelector: 'select[data-widget="basic.select"]',

	_update: function(response) {
		this.element.val(response[0]).selectmenu('refresh');
	},

	_events: {
		'change': function(ev) {
			this._write(this.element.val());
		}
	}

});


// ----- basic.color ----------------------------------------------------------
// base widget for all 3 types
$.widget("sv.basic_color", $.sv.widget, {

	options: {
		min: "0",
		max: "255",
    style: '',
    colormodel: 'rgb',
		step: 7,
    colors: 10,
	},

  _mem: null,
	_lockfor: 0,

	_update: function(response) {
		// response is: {{ gad_r }}, {{ gad_g }}, {{ gad_b }}

		//if widget is locked: reduce lock counter and return
		if(this._lockfor > 0) {
			this._lockfor--;
			return;
		}

		var max = String(this.options.max).explode();
		var min = String(this.options.min).explode();
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
		switch(this.options.colormodel) {
			case 'rgb':
				rgb = [
					Math.round(Math.min(Math.max((values[0] - min[0]) / (max[0] - min[0]), 0), 1) * 255),
					Math.round(Math.min(Math.max((values[1] - min[1]) / (max[1] - min[1]), 0), 1) * 255),
					Math.round(Math.min(Math.max((values[2] - min[2]) / (max[2] - min[2]), 0), 1) * 255)
				];
				this._mem = rgb;
				hsl = fx.rgb2hsl(rgb[0], rgb[1], rgb[2]);
				hsv = fx.rgb2hsv(rgb[0], rgb[1], rgb[2]);
				break;
			case 'hsl':
				hsl = [
					Math.round(Math.min(Math.max((values[0] - min[0]) / (max[0] - min[0]), 0), 1) * 360),
					Math.round(Math.min(Math.max((values[1] - min[1]) / (max[1] - min[1]), 0), 1) * 100),
					Math.round(Math.min(Math.max((values[2] - min[2]) / (max[2] - min[2]), 0), 1) * 100)
				];
				this._mem = hsl;
				rgb = fx.hsl2rgb(hsl[0], hsl[1], hsl[2]);
				hsv = fx.hsl2hsv(hsl[0], hsl[1], hsl[2]);
				break;
			case 'hsv':
				hsv = [
					Math.round(Math.min(Math.max((values[0] - min[0]) / (max[0] - min[0]), 0), 1) * 360),
					Math.round(Math.min(Math.max((values[1] - min[1]) / (max[1] - min[1]), 0), 1) * 100),
					Math.round(Math.min(Math.max((values[2] - min[2]) / (max[2] - min[2]), 0), 1) * 100)
				];
				this._mem = hsv;
				rgb = fx.hsv2rgb(hsv[0], hsv[1], hsv[2]);
				hsl = fx.hsv2hsl(hsv[0], hsv[1], hsv[2]);
				break;
		}

		if(this.options.style == 'slider') {
			// set slider background color
			//var brightness = hsl[2]+hsl[1]/2*(1-Math.abs(2*hsl[2]/100-1)); // value/brightness in HSV is HSL minimal saturation (also used to calculate maximal saturation and maximal lightness)
			this.element.find('.color-hue .ui-slider-track').css('background-image', 'linear-gradient(90deg, hsl(0,'+hsl[1]+'%,'+hsl[2]+'%), hsl(60,'+hsl[1]+'%,'+hsl[2]+'%), hsl(120,'+hsl[1]+'%,'+hsl[2]+'%), hsl(180,'+hsl[1]+'%,'+hsl[2]+'%), hsl(240,'+hsl[1]+'%,'+hsl[2]+'%), hsl(300,'+hsl[1]+'%,'+hsl[2]+'%), hsl(360,'+hsl[1]+'%,'+hsl[2]+'%))');
			this.element.find('.color-saturation .ui-slider-track').css('background-image', 'linear-gradient(90deg, hsl('+hsl[0]+',0%,'+hsv[2]+'%), hsl('+hsl[0]+',100%,'+Math.round(hsv[2]/2)+'%) )');
			this.element.find('.color-lightness .ui-slider-track').css('background-image', 'linear-gradient(90deg, hsl('+hsl[0]+',0%,0%), hsl('+hsl[0]+',100%,'+Math.round(hsl[2]/hsv[2]*100)+'%) )');

			// refresh slider position
			this.element.attr('lock', 1);
			this.element.find('.color-hue input').val(hsv[0]).slider('refresh').attr('mem', hsv[0]);
			this.element.find('.color-saturation input').val(hsv[1]).slider('refresh').attr('mem', hsv[1]);
			this.element.find('.color-lightness input').val(hsv[2]).slider('refresh').attr('mem', hsv[2]);
		}
		else { // 'rect' or 'circle'
			this.element.find('span').css('background-color', 'rgb(' + rgb.join(',') + ')');
		}

	},
});

// type = rect
$.widget("sv.basic_color_rect", $.sv.basic_color, {

	initSelector: 'a[data-style="rect"][data-widget="basic.color"]',

	_events: {
    'click': function(event) {
			var self = this;
			var html = '<div class="rgb-popup">';
			var node = this.element;
			var colors = this.options.colors;
			var steps = this.options.step;
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

			var items = this.options.item.explode();
			var colormodel = this.options.colormodel;
			var max = String(this.options.max).explode();
			var min = String(this.options.min).explode();
			// ensure max and min as array of 3 floats (fill by last value if array is shorter)
			for(var i = 0; i <= 2; i++) {
				max[i] = parseFloat(max[Math.min(i, max.length-1)])
				min[i] = parseFloat(min[Math.min(i, min.length-1)])
			}

			$(html).popup({ theme: "a", overlayTheme: "a", positionTo: this.element }).popup("open")
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
						var oldColors = self._mem;//node.children('span').css('background-color').match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1);
						var diffCount = (values[0] != oldColors[0]) + (values[1] != oldColors[1]) + (values[2] != oldColors[2]) -1;
						self._lockfor = diffCount; // lock widget to ignore next 2 updates
						io.write(items[0], values[0]);
						io.write(items[1], values[1]);
						io.write(items[2], values[2]);
					}
					self._mem = values;

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
	}
});

// type = disc
$.widget("sv.basic_color_disc", $.sv.basic_color, {

	initSelector: 'a[data-style="disc"][data-widget="basic.color"]',

	_events: {
		'click': function (event) {
			var self = this;
			var canvas = $('<canvas style="border: none;">')

			var node = this.element;
			var size = 280;
			var colors = parseInt(this.options.colors);
			var steps = parseInt(this.options.step);
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

			var items = this.options.item.explode();
			var colormodel = this.options.colormodel;
			var max = String(this.options.max).explode();
			var min = String(this.options.min).explode();
			// ensure max and min as array of 3 floats (fill by last value if array is shorter)
			for(var i = 0; i <= 2; i++) {
				max[i] = parseFloat(max[Math.min(i, max.length-1)])
				min[i] = parseFloat(min[Math.min(i, min.length-1)])
			}

			// event handler on color select
			canvas.popup({ theme: 'none', overlayTheme: 'a', shadow: false, positionTo: this.element }).popup("open")
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
							var oldColors = self._mem;//node.children('span').css('background-color').match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1);
							var diffCount = (values[0] != oldColors[0]) + (values[1] != oldColors[1]) + (values[2] != oldColors[2]) -1;
							self._lockfor = diffCount; // lock widget to ignore next 2 updates
							io.write(items[0], values[0]);
							io.write(items[1], values[1]);
							io.write(items[2], values[2]);
						}
            self._mem = values;
					}

					$(this).popup("close");
				}
			});

		}
	}
});

// type = slider
$.widget("sv.basic_color_slider", $.sv.basic_color, {

	initSelector: 'div[data-style="slider"][data-widget="basic.color"]',

	_timer: false,

	_events: {

		'slidestop input': function (event) {
			this._timer = false;
			this._change();
		},

		'change input': function (event) {
			this._change();
		},

	},

	_change: function() {
		if (!this._timer) {
			this._timer = true;

			var widget = this.element.closest('div[data-style="slider"]');
			var colormodel = this.options.colormodel;
			var max = String(this.options.max).explode();
			var min = String(this.options.min).explode();
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

			var oldColors = this._mem;
			var diffCount = (values[0] != oldColors[0]) + (values[1] != oldColors[1]) + (values[2] != oldColors[2]) -1;
			this._lockfor = diffCount; // lock widget to ignore next 2 updates

			if(diffCount > 0) {
				var items = String(this.options.item).explode();
				if(items[1] == '') { // all values as list in one item
					io.write(items[0], values);
				}
				else {
					io.write(items[0], values[0]);
					io.write(items[1], values[1]);
					io.write(items[2], values[2]);
				}
				this._mem = values;

				this._delay(function() { if(this._timer) { this._timer = false; this._change(); } }, 400);
			}
		}
	}
});


// ----- basic.flip -----------------------------------------------------------
$.widget("sv.basic_flip", $.sv.widget, {

	initSelector: 'select[data-widget="basic.flip"]',

	options: {
	},

	_update: function(response) {
		this.element.val(response[0]).flipswitch('refresh');
	},

	_events: {
    'change': function (event) {
			this._write(this.element.val());
		}
	}

});


// ----- basic.icon -----------------------------------------------------------
$.widget("sv.basic_icon", $.sv.widget, {

	initSelector: '[data-widget="basic.icon"][data-item]',

	options: {
		min: 0,
		max: 255,
		colormodel: 'rgb'
	},

	_update: function(response) {
			var max = String(this.options.max).explode();
			var min = String(this.optionx.min).explode();
			// ensure max and min as array of 3 floats (fill by last value if array is shorter)
			for(var i = 0; i <= 2; i++) {
				max[i] = parseFloat(max[Math.min(i, max.length-1)])
				min[i] = parseFloat(min[Math.min(i, min.length-1)])
			}

			if(response.length == 1) // all values as list in one item
				values = response[0];
			else
				values = response;

			var rgb;
			switch(this.options.colormodel) {
				case 'rgb':
					rgb = [
						Math.round(Math.min(Math.max((values[0] - min[0]) / (max[0] - min[0]), 0), 1) * 255),
						Math.round(Math.min(Math.max((values[1] - min[1]) / (max[1] - min[1]), 0), 1) * 255),
						Math.round(Math.min(Math.max((values[2] - min[2]) / (max[2] - min[2]), 0), 1) * 255)
					];
					break;
				case 'hsl':
					var hsl = [
						Math.round(Math.min(Math.max((values[0] - min[0]) / (max[0] - min[0]), 0), 1) * 360),
						Math.round(Math.min(Math.max((values[1] - min[1]) / (max[1] - min[1]), 0), 1) * 100),
						Math.round(Math.min(Math.max((values[2] - min[2]) / (max[2] - min[2]), 0), 1) * 100)
					];
					rgb = fx.hsl2rgb(hsl[0], hsl[1], hsl[2]);
					break;
				case 'hsv':
					var hsv = [
						Math.round(Math.min(Math.max((values[0] - min[0]) / (max[0] - min[0]), 0), 1) * 360),
						Math.round(Math.min(Math.max((values[1] - min[1]) / (max[1] - min[1]), 0), 1) * 100),
						Math.round(Math.min(Math.max((values[2] - min[2]) / (max[2] - min[2]), 0), 1) * 100)
					];
					rgb = fx.hsv2rgb(hsv[0], hsv[1], hsv[2]);
					break;
			}

			this.element.css('color', 'rgb(' + rgb.join(',') + ')').find('svg').css('fill', 'rgb(' + rgb.join(',') + ')').css('stroke', 'rgb(' + rgb.join(',') + ')');
	},

});


// ----- basic.input ----------------------------------------------------------
// simple (w/o datebox)
$.widget("sv.basic_input", $.sv.widget, {

	initSelector: 'input[data-widget="basic.input"][data-role!="datebox"]',

	_update: function(response) {
		this.element.val(response[0]);
	},

	_events: {
		'change': function (event) {
			var newval = this.element.val();
			var type = this.element.attr('type');

			// enforce limits and step for number input
			if(type == 'number') {
				var min = parseFloat(this.element.attr('min'));
				var max = parseFloat(this.element.attr('max'));
				var step = parseFloat(this.element.attr('step'));

				if(isNaN(min)) min = null;
				if(isNaN(max)) max = null;
				if(isNaN(step) || step <= 0) step = 1;

				//From jQuery UI slider, the following source will round to the nearest step
				valModStep = ( newval - (min || 0) ) % step;
				alignValue = newval - valModStep;

				if ( Math.abs( valModStep ) * 2 >= step ) {
					alignValue += ( valModStep > 0 ) ? step : ( -step );
				}

				// Since JavaScript has problems with large floats, round
				// the final value to 5 digits after the decimal point (see jQueryUI: #4124)
				newval = parseFloat( alignValue.toFixed( 5 ) );

				if (min !== null && newval < min) {
					newval = min;
				}
				if (max !== null && newval > max) {
					newval = max;
				}
			}

			this._write(newval);
		}
	}

});

// with datebox
$.widget("sv.basic_input_datebox", $.sv.widget, {

	initSelector: 'input[data-widget="basic.input"][data-role="datebox"]',

	options: {
		'datebox-mode': null,
    'min-dur': null
	},

	_update: function(response) {
		var mode = this.options['datebox-mode'];
		if(mode == 'durationbox' || mode == 'durationflipbox') // data type duration
			this.element.trigger('datebox', {'method': 'set', 'value': this.options['min-dur']*1}).trigger('datebox', {'method': 'dooffset', 'type': 's', 'amount': response[0] - this.options['min-dur']*1}).trigger('datebox', {'method':'doset'});
		else if(mode == 'datebox' || mode == 'flipbox' || mode == 'calbox' || mode == 'slidebox') // data type date
			this.element.datebox('setTheDate', new Date(response[0]));
		else if(mode == 'timebox' || mode == 'timeflipbox') { // data type time
			this.element.val(response[0]);
			this.element.datebox('refresh');
		}
	},

	_events: {
		'datebox': function (event, passed) {
			if (passed.method === 'close' && !passed.closeCancel) {
				var mode = this.options['datebox-mode'];

				var newval;
				if(mode == 'durationbox' || mode == 'durationflipbox') // data type duration
					newval = this.element.datebox('getLastDur');
				else if(mode == 'datebox' || mode == 'flipbox' || mode == 'calbox' || mode == 'slidebox') // data type date
					newval = this.element.datebox('getTheDate');
				else if(mode == 'timebox' || mode == 'timeflipbox') // data type time
					newval = this.element.datebox('callFormat', '%H:%M:%S', this.element.datebox('getTheDate'))
				else
					newval = this.element.val();

				this._write(newval);
			}
		}
	}

});

// ----- basic.offset -----------------------------------------------------------
$.widget("sv.basic_offset", $.sv.widget, {

	initSelector: '[data-widget="basic.offset"]',

	options: {
		step: null
	},

	_update: function(response) {
	},

	_events: {
    'click': function (event) {
			var step = this.options.step * 1;
			this._write(widget.get(this.options.item) * 1 + step);
		}
	}

});


// ----- basic.print ----------------------------------------------------------
//TODO: check time
$.widget("sv.basic_print", $.sv.widget, {

	initSelector: '[data-widget="basic.print"]',

	options: {
    format: "",
    formula: "",
    thresholds: "",
    colors: ""
	},

	_update: function(response) {
		var format = this.options.format;
		var formatLower = format.toLowerCase();
		var formula = this.options.formula;

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

		try {
			var calc = eval(formula);
		}
		catch(ex) {
			notify.error("basic.print: Invalid formula", ex);
		}

		if(type == 'Date')
			calc = new Date(calc).transUnit(format);
		else if (type == 'Number' && !isNaN(calc))
			calc = parseFloat(calc).transUnit(format);
		else if (formatLower == 'script') // no output for format 'script'
			calc = '';

		// print the result
		if (formatLower == 'html')
			this.element.html(calc);
		else
			this.element.text(calc);

		// colorize
		var currentIndex = 0;
		$.each(String(this.options.thresholds).explode(), function(index, threshold) {
			if((isNaN(calc) || isNaN(threshold)) ? (threshold > calc) : (parseFloat(threshold) > parseFloat(calc)))
				return false;
			currentIndex++;
		});
		var color = String(this.options.colors).explode()[currentIndex];
		if(color == '' || color == 'icon0')
			this.element.removeClass('icon1').css('color', '');
		else if (color == 'icon1')
			this.element.addClass('icon1').css('color', '');
		else
			this.element.removeClass('icon1').css('color', color);
	},
});

// ----- basic.shifter ---------------------------------------------------------
$.widget("sv.basic_shifter", $.sv.widget, {

	initSelector: 'span[data-widget="basic.shifter"]',

	options: {
		min: 0,
    max: 255,
    'pic-on': '',
    'pic-off': ''
	},

	_update: function(response) {
		var max = this.options.max;
		var min = this.options.min;

		var step = Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 10 + 0.49) * 10;

		if (response[1] != 0 && step > min) {
			var percent = Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 100);
			this.element.find('img').attr('src', this.options['pic-on'].replace('00', step)).attr('alt', percent + '%').attr('title', percent + '%');
		}
		else {
			this.element.find('img').attr('src', this.options['pic-off']).attr('alt', '0%').attr('title', '0%');
		}
	},

	_events: {
		'click': function (event) {
			var items = this.options.item.explode();

			if (this.element.find('img').attr('src') == this.options['pic-off']) {
				io.write(items[1], 1);
			}
			else {
				io.write(items[1], 0);
			}
		},

		'hover > a > img': function (event) {
			if (event.type === 'mouseenter') {
				$(this).addClass("ui-focus");
			}
			else {
				$(this).removeClass("ui-focus");
			}
		}
	}
});

// ----- basic.shutter --------------------------------------------------------
$.widget("sv.basic_shutter", $.sv.widget, {

	initSelector: 'div[data-widget="basic.shutter"]',

	options: {
		min: 0,
    max: 255,
		step: 5,
		mode: 'half'
	},

	_update: function(response) {
		var max = parseInt(this.options.max);
		var min = parseInt(this.options.min);

		var a = 13;
		var mode = (this.options.mode == 'half' ? 0.5 : 1);
		if (response[1] !== undefined) {
			a = parseInt(13 / mode * ((response[1] - min) / (max - min) + mode - 1));
		}

		var style;

		var h = parseInt(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 13 * 14);
		$.each(this.element.find('.blade-pos, .blade-neg').get().reverse(), function(i) {
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

	_events: {
		'click': function (event) {
			var max = this.options.max;
			var min = this.options.min;
			var step = this.options.step;

			var offset = this.element.offset();
			var x = event.pageX - offset.left;
			var y = event.pageY - offset.top;
			var val = Math.floor(y / this.element.outerHeight() * (max - min) / step) * step + min;

			var items = this.options.item.explode();
			if (items[1] != '' && x > this.element.outerWidth() / 2) {
				io.write(items[1], val);
			}
			else {
				io.write(items[0], val);
			}
		},

		'mouseenter': function (event) {
			this.element.find('.control').fadeIn(400);
		},

		'mouseleave': function (event) {
			this.element.find('.control').fadeOut(400);
		}
	}

});

// ----- basic.slider ---------------------------------------------------------
// The slider had to be handled in a more complex manner. A 'lock' is used
// to stop the change after a refresh. And a timer is used to fire the trigger
// only every 400ms if it was been moved. There should be no trigger on init.
$.widget("sv.basic_slider", $.sv.widget, {

	initSelector: 'input[data-widget="basic.slider"]',

	options: {
		min: 0,
		max: 255,
		'min-send': 0,
		'max-send': 255
	},

	_mem: null,
	_timer: false,
	_lock: false,

	_update: function(response) {
		this._lock = true;
		var max = this.element.attr('max') * 1;
		var min = this.element.attr('min') * 1;
		var maxSend = this.options['max-send'];
		var minSend = this.options['min-send'];
		var val = response[0];
		if(min != minSend || max != maxSend)
			val = (val - minSend) / (maxSend - minSend) * (max - min) + min;
		this.element.val(val).slider('refresh');
		this._lock = false;
		this._mem = this.element.val();
	},

	_events: {
		'slidestop': function (event) {
			this._timer = false;
			this._change();
		},

		'change': function (event) {
			this._change();
		},
	},

	_change: function() {
		if (!this._timer && !this._lock && this.element.val() != this._mem) {
			this._timer = true;
			this._mem = this.element.val();
			var max = this.element.attr('max') * 1;
			var min = this.element.attr('min') * 1;
			var maxSend = this.options['max-send'];
			var minSend = this.options['min-send'];
			var val = this.element.val();
			if(min != minSend || max != maxSend)
				val = (val - min) / (max - min) * (maxSend - minSend) + minSend;
			this._write(val);
			this._delay(function() { if(this._timer) { this._timer = false; this._change(); } }, 400);
		}
	}

});

// ----- basic.stateswitch ------------------------------------------------------
$.widget("sv.basic_stateswitch", $.sv.widget, {

	initSelector: 'span[data-widget="basic.stateswitch"]',

	options: {
		vals: '',
		'indicator-type': '',
		'indicator-duration': 3
	},

	_current_val: null, // current value (used to determin next value to send)

	_create: function() {
		this._super();

		this._on(this.element.find('a[data-widget="basic.stateswitch"]'), {
			'click': function (event) {
				// get the list of values
				var list_val = String(this.options.vals).explode();
				// get the index of the memorised value
				var old_idx = list_val.indexOf(this._current_val);
				// compute the next index
				var new_idx = (old_idx + 1) % list_val.length;
				// get next value
				var new_val = list_val[new_idx];
				// send the value to driver
				io.write(this.options.item, new_val);
				// memorise the value for next use
				this._current_val = new_val;

				// activity indicator
				var target = $(event.delegateTarget);
				var indicatorType = this.options['indicator-type'];
				var indicatorDuration = this.options['indicator-duration'];
				if(indicatorType && indicatorDuration > 0) {
					// add one time event to stop indicator
					target.one('stopIndicator',function(event) {
						clearTimeout(target.data('indicator-timer'));
						event.stopPropagation();
						var prevColor = target.attr('data-col');
						if(prevColor != null) {
							if(prevColor != 'icon1')
								target.removeClass('icon1').find('svg').removeClass('icon1');
							if(prevColor != 'blink')
								target.removeClass('blink').find('svg').removeClass('blink');
							if(prevColor == 'icon1' || prevColor == 'icon0')
								prevColor = '';
							target.css('color', prevColor).find('svg').css('fill', prevColor).css('stroke', prevColor);
						}
					})
					// set timer to stop indicator after timeout
					.data('indicator-timer', setTimeout(function() { target.trigger('stopIndicator') }, indicatorDuration*1000 ));
					// start indicator
					if(indicatorType == 'icon1' || indicatorType == 'icon0' || indicatorType == 'blink') {
						target.addClass(indicatorType).find('svg').addClass(indicatorType);
						indicatorType = '';
					}
					target.css('color', indicatorType).find('svg').css('fill', indicatorType).css('stroke', indicatorType);
				}
			}
		});

		// replicate ui-first-child and ui-last-child if first resp. last sibling of tag 'a' has it
		if(this.element.children('a:first').hasClass('ui-first-child'))
			this.element.children('a').addClass('ui-first-child');
		if(this.element.children('a:last').hasClass('ui-last-child'))
			this.element.children('a').addClass('ui-last-child');
		// display first control as default
		this.element.after(this.element.children('a[data-widget="basic.stateswitch"]:first'));
	},

	_update: function(response) {
		// get list of values
		var list_val = String(this.options.vals).explode();
		// get received value
		var val = response.toString().trim();
		// hide all states
		this.element.next('a[data-widget="basic.stateswitch"][data-index]').insertBefore(this.element.children('a:eq(' + this.element.next('a[data-widget="basic.stateswitch"][data-index]').attr('data-index') + ')'));
		// stop activity indicator
		this.element.children('a[data-widget="basic.stateswitch"]').trigger('stopIndicator');
		// show the first corrseponding to value. If none corrseponds, the last one will be shown by using .addBack(':last') and .first()
		this.element.after(this.element.children('a[data-widget="basic.stateswitch"]').filter('[data-val="' + val + '"]:first').addBack(':last').first());
		// memorise the value for next use
		this._current_val = val;
	},

});


// ----- basic.symbol ---------------------------------------------------------
$.widget("sv.basic_symbol", $.sv.widget, {

	initSelector: '[data-widget="basic.symbol"]',

	options: {
		mode: '',
		val: ''
	},

	_update: function(response) {
		// response will be an array, if more then one item is requested
		var formula = this.options.mode;
		var values = String(this.options.val).explode();

		// legacy support
		if(formula == 'or') {
      formula = 'VAR';
		}
		else if(formula == 'and') {
			formula = response.join(' == VAR[0] && ') + ' == VAR[0] ? VAR[0] : null';
		}

		formula = formula.replace(/VAR(\d+)/g, 'VAR[$1-1]');
		var VAR = response;
		try {
			var val = eval(formula);
		}
		catch(ex) {
			notify.error("basic.symbol: Invalid formula", ex);
		}

		var filter = Array.isArray(val) ? '[data-val="'+val.join('"],[data-val="')+'"]' : '[data-val="'+(typeof val === 'boolean' ? Number(val) : val)+'"]';

		var anyShown = this.element.children('span').hide().filter(filter).first().show().length > 0;
		if(anyShown)
			this.element.show();
		else
			this.element.hide();
	},

});


// ----- basic.tank -----------------------------------------------------------
$.widget("sv.basic_tank", $.sv.widget, {

	initSelector: 'div[data-widget="basic.tank"]',

	options: {
		min: 0,
    max: 255,
	},

	_update: function(response) {
		var max = this.options.max;
		var min = this.options.min;

		var factor = Math.min(Math.max((response[0] - min) / (max - min), 0), 1);

		this.element.attr('title', Math.round(factor * 100) + '%')
			.find('div').css('height', factor * this.element.height());
	},

});

// ----- basic.trigger ---------------------------------------------------------
$.widget("sv.basic_trigger", $.sv.widget, {

	initSelector: 'a[data-widget="basic.trigger"]',

	options: {
		name: null,
		val: ''
	},

	_events: {
		'click': function (event) {
			io.trigger(this.options.name, this.options.val != null ? String(this.options.val) : null);
		}
	}

});