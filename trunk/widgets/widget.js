/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
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
 * 'init': function(event) { }
 * Triggered from the widget (macro) itself to change it dynamically on startup.
 *
 * 'update': function(event, response) { }
 * Triggered through widget.update if a item has been changed.
 *
 * 'point': function(event, response) { }
 * Triggerd only for plots through widget.update if the plot is already drawn
 * and only a new point has to be added to the series.
 *
 * 'change', 'click' ...
 * Standard jquery-mobile events, triggered from the framework.
 *
 */
var widget = {

	// a list with all item and values
	buffer: new Object(),

	/**
	 * Static function for exploding the a text with comma-seperated values into
	 * unique array.
	 *
	 * @param    text   the text
	 * @return   array  the items as an array (one or more entries)
	 */
	explode: function (text) {
		var ret = Array();
		var unique = Array();

		// More than one item?
		if (text.indexOf(',') >= 0) {
			var parts = text.explode();

			for (var i = 0; i < parts.length; i++) {
				if (parts[i] != '') {
					unique[parts[i]] = '';
				}
			}

			for (var part in unique) {
				ret.push(part);
			}
		}

		// One item
		else if (text.trim() != '') {
			ret.push(text.trim());
		}

		return ret;
	},

	/**
	 *  Checks if there are any listeners.
	 *
	 *  @return    boolean  true, if there are any listeners
	 */
	listening: function () {
		var ret = false;

		// are there any?
		if ($('[id^="' + $.mobile.activePage.attr('id') + '-"][data-item]').size() > 0) {
			ret = true;
		}

		return ret;
	},

	/**
	 * Returns all items listening on. This is used to get an unique list of the
	 * items independent on the number of widgets.
	 *
	 * @return    array  unique list of the items
	 */
	listeners: function () {
		var ret = Array();
		var unique = Array();

		// all except plots
		$('[id^="' + $.mobile.activePage.attr('id') + '-"][data-item]').each(function (idx) {
			//if ($(this).attr('data-widget').substr(0, 5) != 'plot.' ) {
			var items = widget.explode($(this).attr('data-item'));
			for (var i = 0; i < items.length; i++) {
				unique[items[i]] = '';
			}
			//}
		});

		for (var item in unique) {
			ret.push(item);
		}

		return ret;
	},

	/**
	 * List all items and the number of listeners in console.log.
	 */
	list: function () {
		var widgets = 0;
		$('[data-item]').each(function (idx) {
			if ($(this).attr('data-item').trim() != '') {
				console.log("[" + $(this).attr('data-widget') + "] '" + this.id + "' listen on '" + $(this).attr('data-item') + "'");
				widgets++;
			}
		});
		console.log("[widget] --> " + widgets + " listening.");
	},

	/**
	 * Checks if the value/s are valid (not undefined and not null)
	 *
	 * @param    values   the value/s
	 * @return   boolean  true if no item is undefined or null
	 */
	check: function (values) {

		// case: more values
		if (values instanceof Array) {
			for (var i = 0; i < values.length; i++) {
				if (values[i] === undefined || values[i] == null) {
					return false;
				}
			}
		}
		// case: one value
		else if (values === undefined || values == null) {
			return false;
		}

		return true;
	},

	/**
	 * Get one or more value/s for an item/s from the buffer.
	 *
	 * @param    items   the item/s
	 * @return   string  a single value or an array of values
	 */
	get: function (items) {

		// case: more items
		if (items instanceof Array) {
			var ret = Array();

			for (var i = 0; i < items.length; i++) {
				ret.push(widget.buffer[items[i]]);
			}
		}
		// case: one item
		else {
			var ret = widget.buffer[items];
		}

		return ret;
	},

	/**
	 * Set a value of an item in the buffer.
	 *
	 * @param    item   an item
	 * @param    value  the value
	 */
	set: function (item, value) {

		// case: a series
		if (widget.buffer[item] instanceof Array) {
			// don't add it to the buffer, because highchart will do it for us.   
			//var series = widget.buffer[item];
			//series.push(value);
		}
		else if (value !== undefined) {
			widget.buffer[item] = ( $.isNumeric(value) ? value * 1.0 : value);
		}

		// DEBUG: console.log("[widget] '" + item, widget.buffer[item]);
	},

	/**
	 * Update an item and all widgets listening on that. The value is been written
	 * to the buffer and the widgets are called if all values are set.
	 *
	 * @param    item   the item
	 * @param    value  the value
	 */
	update: function (item, value) {

		// update if value has changed
		if (value === undefined || widget.buffer[item] !== value ||
			(widget.buffer[item] instanceof Array && widget.buffer[item].toString() != value.toString())) {
			widget.set(item, value);

			$('[data-item*="' + item + '"]').each(function (idx) {
				var items = widget.explode($(this).attr('data-item'));

				// only the item witch is been updated
				for (var i = 0; i < items.length; i++) {
					if (items[i] == item) {
						var values = Array();

						// update to a plot: only add a point
						if ($(this).attr('data-widget').substr(0, 5) == 'plot.' && $('#' + this.id).highcharts()) {

							// if more than one item, only that with the value
							for (var j = 0; j < items.length; j++) {
								values.push(items[j] == item ? value : null);
							}
							if (value !== undefined && value != null) {
								// DEBUG:
								console.log("[" + $(this).attr('data-widget') + "] point '" + this.id + "':", values);
								$(this).trigger('point', [values]);
							}
						}

						// regular update to the widget with all items   
						else {
							values = widget.get(items);
							if (widget.check(values)) {
								// DEBUG:
								console.log("[" + $(this).attr('data-widget') + "] update '" + this.id + "':", values);
								$(this).trigger('update', [values]);
							}
						}
					}
				}
			});
		}
	},

	/**
	 * Prepares some widgets on the current page.
	 * Bind to jquery mobile 'pagebeforeshow'.
	 */
	prepare: function () {
		// all plots on the current page.
		$('[id^="' + $.mobile.activePage.attr('id') + '-"][data-widget^="plot."][data-item]').each(function (idx) {

			if ($('#' + this.id).highcharts()) {
				$('#' + this.id).highcharts().destroy();
			}
		});
	},

	/**
	 * Refreshes all widgets on the current page. Used to put the values to the
	 * widgets if a new page has been opened. Bind to jquery mobile 'pageshow'.
	 */
	refresh: function () {
		$('[id^="' + $.mobile.activePage.attr('id') + '-"][data-item]').each(function (idx) {

			var values = widget.get(widget.explode($(this).attr('data-item')));

			if (widget.check(values)) {
				$(this).trigger('update', [values]);
			}
		})
	},

	// ----- s p e c i a l ---------------------------------------------------------

	/**
	 * Returns all widgets with plot functionality or plots listening to an item.
	 * Matching 'plot' in attribute 'data-widget'.
	 *
	 * @param    item  item: matches all plot-widgets with that item
	 * @return   jQuery objectlist
	 */
	plot: function (item) {
		var ret = $();

		if (item) {
			$('[id^="' + $.mobile.activePage.attr('id') + '-"][data-widget^="plot."][data-item*="' + item + '"]').each(function (idx) {
				var items = widget.explode($(this).attr('data-item'));

				for (var i = 0; i < items.length; i++) {
					if (items[i] == item) {
						ret = ret.add(this);
					}
				}
			})
		}
		else {
			ret = $('[id^="' + $.mobile.activePage.attr('id') + '-"][data-widget^="plot."][data-item]');
		}

		return ret;
	},

	/**
	 * Checks if the item is a series.
	 *
	 * @param    item  an item
	 */
	is_series: function (item) {

		var pt = item.split('.');

		return ((pt instanceof Array) && (pt[pt.length - 3] == 'avg' || pt[pt.length - 3] == 'sum' ||
			pt[pt.length - 3] == 'min' || pt[pt.length - 3] == 'max'))
	}
};


// -----------------------------------------------------------------------------
// W I D G E T   D E L E G A T E   F U N C T I O N S
// -----------------------------------------------------------------------------

// ----- b a s i c -------------------------------------------------------------
// -----------------------------------------------------------------------------

// ----- basic.value -----------------------------------------------------------
$(document).delegate('[data-widget="basic.value"]', {
	'update': function (event, response) {
		$('#' + this.id).html(response + ' ' + $(this).attr('data-unit'));
	}
});

// ----- basic.float -----------------------------------------------------------
$(document).delegate('[data-widget="basic.float"]', {
	'update': function (event, response) {
		if ($(this).attr('data-unit') == '°') {
			$('#' + this.id).html(parseFloat(response).transTemp());
		}
		else if ($(this).attr('data-unit') == '%') {
			$('#' + this.id).html(parseFloat(response).transPercent());
		}
		else if ($(this).attr('data-unit') == '€') {
			$('#' + this.id).html(parseFloat(response).transCurrency());
		}
		else {
			$('#' + this.id).html(parseFloat(response).transFloat() + ' ' + $(this).attr('data-unit'));
		}

	}
});

// ----- basic.text ------------------------------------------------------------
$(document).delegate('[data-widget="basic.text"]', {
	'update': function (event, response) {
		$('#' + this.id).html((response == $(this).attr('data-val-on') ? $(this).attr('data-txt-on') : $(this).attr('data-txt-off')));
	}
});

// ----- basic.checkbox --------------------------------------------------------
$(document).delegate('input[data-widget="basic.checkbox"]', {
	'update': function (event, response) {
		$(this).prop('checked', response != 0).checkboxradio('refresh');
	},

	'change': function (event) {
		// DEBUG: console.log("[basic.checkbox] change '" + this.id + "':", $(this).prop("checked")); 
		io.write($(this).attr('data-item'), ($(this).prop('checked') ? 1 : 0));
	}
});

// ----- basic.flip ------------------------------------------------------------
$(document).delegate('select[data-widget="basic.flip"]', {
	'update': function (event, response) {
		$(this).val(response > 0 ? 'on' : 'off').slider('refresh');
	},

	'change': function (event) {
		// DEBUG: console.log("[basic.flip] change '" + this.id + "':", $(this).val());  
		io.write($(this).attr('data-item'), ($(this).val() == 'on' ? 1 : 0));
	}
});

// ----- basic.silder ----------------------------------------------------------
// The slider had to be handled in a more complex manner. A 'lock' is used
// to stop the change after a refresh. And a timer is used to fire the trigger
// only every 400ms if it was been moved. There should be no trigger on init.
$(document).delegate('input[data-widget="basic.slider"]', {
	'update': function (event, response) {
		// DEBUG: console.log("[basic.slider] update '" + this.id + "': " + response + " timer: " + $(this).attr('timer') + " lock: " + $(this).attr('lock'));   
		$(this).attr('lock', 1);
		$('#' + this.id).val(response).slider('refresh').attr('mem', $(this).val());
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
			setTimeout("$('#" + this.id + "').attr('timer', 0);", 400);
		}

		$(this).attr('lock', 0);
	},

	'click': function (event) {
		// $('#' + this.id).attr('mem', $(this).val());       
		io.write($(this).attr('data-item'), $(this).val());
	}
});

// ----- basic.symbol ----------------------------------------------------------
$(document).delegate('span[data-widget="basic.symbol"]', {
	'update': function (event, response) {

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

		$('#' + this.id + ' img').attr('title', new Date());

		if (bit) {
			$('#' + this.id).show();
		}
		else {
			$('#' + this.id).hide();
		}
	}
});

// ----- basic.switch ----------------------------------------------------------
$(document).delegate('span[data-widget="basic.switch"]', {
	'update': function (event, response) {
		$('#' + this.id + ' img').attr('src', (response == $(this).attr('data-val-on') ? $(this).attr('data-pic-on') : $(this).attr('data-pic-off')));
	},

	'click': function (event) {
		if ($('#' + this.id + ' img').attr('src') == $(this).attr('data-pic-off')) {
			io.write($(this).attr('data-item'), $(this).attr('data-val-on'));
		}
		else {
			io.write($(this).attr('data-item'), $(this).attr('data-val-off'));
		}
	}
});

$(document).delegate('span[data-widget="basic.switch"] > a > img', 'hover', function (event) {
	if (event.type === 'mouseenter') {
		$(this).addClass("ui-focus");
	}
	else {
		$(this).removeClass("ui-focus");
	}
});

// ----- basic.shifter ---------------------------------------------------------
$(document).delegate('span[data-widget="basic.shifter"]', {
	'update': function (event, response) {
		var step = Math.min((response[1] / $(this).attr('data-max') * 10 + 0.49).toFixed(0) * 10, 100);

		if (response[0] != 0 && step > 0) {
			$('#' + this.id + ' img').attr('src', $(this).attr('data-pic-on').replace('00', step));
		}
		else {
			$('#' + this.id + ' img').attr('src', $(this).attr('data-pic-off'));
		}
	},

	'click': function (event) {
		var items = $(this).attr('data-item').explode();

		if ($('#' + this.id + ' img').attr('src') == $(this).attr('data-pic-off')) {
			io.write(items[0], 1);
		}
		else {
			io.write(items[0], 0);
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

// ----- basic.button ----------------------------------------------------------
$(document).delegate('a[data-widget="basic.button"]', {
	'click': function (event) {
		if ($(this).attr('data-val') != '') {
			io.write($(this).attr('data-item'), $(this).attr('data-val'));
		}
	}
});

// ----- basic.dual ------------------------------------------------------------
$(document).delegate('a[data-widget="basic.dual"]', {
	'update': function (event, response) {
		$('#' + this.id + ' img').attr('src', (response == $(this).attr('data-val-on') ? $(this).attr('data-pic-on') : $(this).attr('data-pic-off')));
	},

	'click': function (event) {
		if ($('#' + this.id + ' img').attr('src') == $(this).attr('data-pic-off')) {
			io.write($(this).attr('data-item'), $(this).attr('data-val-on'));
		}
		else {
			io.write($(this).attr('data-item'), $(this).attr('data-val-off'));
		}
	}
});

// ----- basic.shutter ---------------------------------------------------------
$(document).delegate('div[data-widget="basic.shutter"]', {
	'update': function (event, response) {
		// response is: {{ gad_pos }}, {{ gad_angle }}

		var a = 13;
		var mode = ($(this).attr('data-mode') == 'half' ? 0.5 : 1);
		if (response[1] !== undefined) {
			a = parseInt(13 / mode * (response[1] / $(this).attr('data-max') + mode - 1));
		}

		var style;

		var h = parseInt(response[0] * 13 * 14 / $(this).attr('data-max'));
		for (var i = 12; i >= 1; i--) {
			if (h >= 14) {
				var w = 13 - Math.abs(a);
				style = 'height: ' + ((h > i * 14) && a == 13 ? (14 - w) : (15 - w)) + 'px;';

				if (a != 13) {
					style += 'margin-top: ' + (h - 15 >= 14 ? w : parseInt(w / 2)) + 'px;';
				}
				else {
					style += 'border-top: 1px dotted ' + (h > i * 14 ? '#ccc' : '#333') + ';';
				}

				if (a > 0) {
					$('#' + this.id + '-' + i).attr('class', 'blade-pos');
				}
				else {
					$('#' + this.id + '-' + i).attr('class', 'blade-neg');
				}

				$('#' + this.id + '-' + i).attr('style', style);
				h = h - 15;
			}
			else {
				style = 'height: ' + h + 'px;';
				style += 'border-top: 1px dotted #aaa;';
				$('#' + this.id + '-' + i).attr('style', style);
				h = 1;
			}
		}
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
		$('#' + this.id + ' .control').fadeIn(400);
	},

	'mouseleave': function (event) {
		$('#' + this.id + ' .control').fadeOut(400);
	}
});

// ----- basic.rgb -------------------------------------------------------------
$(document).delegate('a[data-widget="basic.rgb"]', {
	'update': function (event, response) {
		// response is: {{ gad_r }}, {{ gad_g }}, {{ gad_b }}

		var max = $(this).attr('data-max');
		$('#' + this.id + ' span').css('background-color', 'rgb(' + Math.round(response[0] / max * 255) + ',' + Math.round(response[1] / max * 255) + ',' + Math.round(response[2] / max * 255) + ')');
	}
});

$(document).delegate('div[data-widget="basic.rgb-popup"] > div', {
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

// ----- basic.colordisc -------------------------------------------------------
$(document).delegate('a[data-widget="basic.colordisc"]', {
	'update': function (event, response) {
		// response is: {{ gad_r }}, {{ gad_g }}, {{ gad_b }}

		var max = $(this).attr('data-max');
		$('#' + this.id + ' span').css('background-color', 'rgb(' + Math.round(response[0] / max * 255) + ',' + Math.round(response[1] / max * 255) + ',' + Math.round(response[2] / max * 255) + ')');
	},

	'click': function (event) {
		$('#' + this.id + '-screen').removeClass('hide').addClass('in');

		// reposition canvas
		var offset = $(this).offset();
		var disc = $('#' + this.id + '-disc');
		var top = offset.top - (disc.height() / 2) + 15;
		var left = offset.left - (disc.width() / 2) + 25;

		disc.css('top', top.limit(5, $(window).height() + $(document).scrollTop() - disc.height() - 5, 1));
		disc.css('left', left.limit(5, $(window).width() - disc.width() - 5, 1));
		disc.show();
	}
});

$(document).delegate('div[data-widget="basic.colordisc"]', {
	'click': function (event) {
		var uid = this.id.substr(0, this.id.length - 7);

		$('#' + uid + '-disc').hide();

		$('#' + uid + '-screen').removeClass('in').addClass('hide');
	}
});

$(document).delegate('canvas[data-widget="basic.colordisc"]', {
	'init': function (event) {
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
	},

	'click': function (event) {
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

		io.write(items[0], Math.round(rgb[0] / 255 * max));
		io.write(items[1], Math.round(rgb[1] / 255 * max));
		io.write(items[2], Math.round(rgb[2] / 255 * max));

		$(this).hide();

		$('#' + uid + '-screen').removeClass('in').addClass('hide');
	}
});

// ----- basic.tank ------------------------------------------------------------
$(document).delegate('div[data-widget="basic.tank"]', {
	'update': function (event, response) {
		$('#' + this.id + ' div').css('height', Math.round(Math.min(response / $(this).attr('data-max'), 1) * 180));
	}
});

// ----- basic.notify ----------------------------------------------------------
$(document).delegate('span[data-widget="basic.notify"]', {
	'update': function (event, response) {
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
	'click': function (event, response) {
		var uid = $(this).parent().parent().attr('id');
		var step = $('#' + uid).attr('data-step');
		var item = $('#' + uid + 'set').attr('data-item');

		var temp = (Math.round((widget.get(item) - step) * 10) / 10).toFixed(1);
		io.write(item, temp);
	}
});

$(document).delegate('div[data-widget="device.rtr"] > div > a[data-icon="plus"]', {
	'click': function (event, response) {
		var uid = $(this).parent().parent().attr('id');
		var step = $('#' + uid).attr('data-step');
		var item = $('#' + uid + 'set').attr('data-item');

		var temp = (Math.round((widget.get(item) * 1 + step * 1) * 10) / 10).toFixed(1);
		io.write(item, temp);
	}
});


// ----- p l o t ---------------------------------------------------------------
// -----------------------------------------------------------------------------

// ----- plot.period -----------------------------------------------------------
$(document).delegate('div[data-widget="plot.period"]', {
	'update': function (event, response) {
		// response is: [ [ [t1, y1], [t2, y2] ... ], [ [t1, y1], [t2, y2] ... ], ... ] 

		var label = $(this).attr('data-label').explode();
		var color = $(this).attr('data-color').explode();
		var exposure = $(this).attr('data-exposure').explode();
		var axis = $(this).attr('data-axis').explode();
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
		$('#' + this.id).highcharts({
			series: series,
			xAxis: { type: 'datetime', title: { text: axis[0] } },
			yAxis: { min: $(this).attr('data-ymin'), max: $(this).attr('data-ymax'), title: { text: axis[1] } }
		});
	},

	'point': function (event, response) {
		for (var i = 0; i < response.length; i++) {
			if (response[i]) {
				var chart = $('#' + this.id).highcharts();

				// more points?
				for (var j = 0; j < response[i].length; j++) {
					chart.series[i].addPoint(response[i][j], false, (chart.series[i].data.length >= 100));
				}
				chart.redraw();
			}
		}
	}
});

// ----- plot.rtr --------------------------------------------------------------
$(document).delegate('div[data-widget="plot.rtr"]', {
	'update': function (event, response) {
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
		$('#' + this.id).highcharts({
			chart: { type: 'line' },
			series: [
				{
					name: label[0], data: response[0], type: 'spline'
				} ,
				{
					name: label[1], data: response[1], dashStyle: 'shortdot', step: 'left'
				} ,
				{
					type: 'pie', name: '∑ On: ',
					data: [
						{
							name: 'On', y: percent
						},
						{
							name: 'Off', y: (100 - percent), color: null
						}
					],
					center: [ '95%', '90%' ],
					size: 15,
					showInLegend: false,
					dataLabels: { enabled: false }
				}
			],
			xAxis: { type: 'datetime' },
			yAxis: { min: $(this).attr('data-min'), max: $(this).attr('data-max'), title: { text: axis[1] } },
			tooltip: { formatter: function () {
				return this.series.name + ' <b>' + (this.percentage ? this.y.transPercent() : this.y.transTemp()) + '</b>';
			}}
		});
	},

	'point': function (event, response) {
		for (var i = 0; i < response.length; i++) {
			var chart = $('#' + this.id).highcharts();

			if (response[i] && (i == 0 || i == 1)) {
				for (var j = 0; j < response[i].length; j++) {
					chart.series[i].addPoint(response[i][j], false, (chart.series[i].data.length >= 100));
				}
			}
			else if (response[i] && (i == 2)) {
				// TODO: plot.rtr, recalc pie diagram after new point received
			}
			chart.redraw();
		}
	}
});

// ----- plot.comfortchart -----------------------------------------------------
$(document).delegate('div[data-widget="plot.comfortchart"]', {
	'update': function (event, response) {
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

		$('#' + this.id).highcharts({
			series: plots,
			xAxis: { min: 10, max: 35, title: { text: axis[0], align: 'high', margin: -2 } },
			yAxis: { min: 0, max: 100, title: { text: axis[1], margin: 7 } },
			plotOptions: { area: { enableMouseTracking: false } },
			tooltip: { formatter: function () {
				return this.x.transTemp() + ' / ' + this.y.transPercent();
			} }
		});
	},

	'point': function (event, response) {
		var chart = $('#' + this.id).highcharts();
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

// ----- plot.temprose -----------------------------------------------------
$(document).delegate('div[data-widget="plot.temprose"]', {
	'update': function (event, response) {
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

		$('#' + this.id).highcharts({
			chart: {polar: true, type: 'line', marginLeft: 10 },
			series: plots,
			xAxis: { categories: axis, tickmarkPlacement: 'on', lineWidth: 0 },
			yAxis: { gridLineInterpolation: 'polygon', lineWidth: 0 },
			tooltip: { formatter: function () {
				return this.x + ' - ' + this.series.name + ': <b>' + this.y.transTemp() + '</b>';
			} },
			legend: { x: 10, layout: 'vertical' }
		});
	},

	'point': function (event, response) {
		var chart = $('#' + this.id).highcharts();
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


// ----- i c o n ---------------------------------------------------------------
// -----------------------------------------------------------------------------


$(document).delegate('svg[data-widget^="icon."]', {
	'update': function (event, response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		
		if (response instanceof Array) {
			document.getElementById(this.id).setAttributeNS(null , 'class', 'icon' + (response[1] ? ' icon1' : ' icon0'));
		}
	},
	
	'click': function (event) {
		var items = $(this).attr('data-item').explode();
		
		if (items[1]) {
			io.write(items[1], (widget.get(items[1]) == 0 ? 1 : 0));
		}
	}
});

// ----- icon.arrow ---------------------------------------------------------
$(document).delegate('svg[data-widget="icon.arrow"]', {
	'update': function (event, response) {
		// response is: {{ gad_value }}, {{ gad_switch }}

		var ang = response[0] / $(this).attr('data-max') * 2 * Math.PI;
		
		var pt = [];
		pt = pt.concat([50, 50], fx.rotate([25, 50], ang, [50, 50]), fx.rotate([50, 18], ang, [50, 50]), fx.rotate([75, 50], ang, [50, 50]), [50, 50]);
		$('#' + this.id + ' #line0').attr('points', pt.toString());

		pt = [];
		pt = pt.concat(fx.rotate([32, 50], ang, [50, 50]), fx.rotate([32, 60], ang, [50, 50]), fx.rotate([68, 60], ang, [50, 50]), fx.rotate([68, 50], ang, [50, 50]));
		$('#' + this.id + ' #line1').attr('points', pt.toString());
	}
});

// ----- icon.shutter ---------------------------------------------------------
$(document).delegate('svg[data-widget="icon.battery"]', {
	'update': function (event, response) {
		// response is: {{ gad_value }}, {{ gad_switch }}

		var val = Math.round(response[0] / $(this).attr('data-max') * 40);
		fx.grid(this, val, [38, 68], [61, 28]);
	}
});

// ----- icon.compass ----------------------------------------------------------
$(document).delegate('svg[data-widget="icon.compass"]', {
	'update': function (event, response) {
		// response is: {{ gad_value }}, {{ gad_switch }}

		var ang = response[0] / $(this).attr('data-max') * 2 * Math.PI;
		
		var pt = [];
		pt = pt.concat(fx.rotate([40, 50], ang, [50, 50]), fx.rotate([50, 25], ang, [50, 50]), fx.rotate([60, 50], ang, [50, 50]));
		$('#' + this.id + ' #pin0').attr('points', pt.toString());

		pt = [];
		pt = pt.concat(fx.rotate([40, 50], ang, [50, 50]), fx.rotate([50, 75], ang, [50, 50]), fx.rotate([60, 50], ang, [50, 50]));
		$('#' + this.id + ' #pin1').attr('points', pt.toString());
	}
});

// ----- icon.shutter ---------------------------------------------------------
$(document).delegate('svg[data-widget="icon.shutter"]', {
	'update': function (event, response) {
		// response is: {{ gad_value }}, {{ gad_switch }}

		var val = Math.round(response[0] / $(this).attr('data-max') * 38);
		fx.grid(this, val, [14, 30], [86, 68]);
	}
});

// ----- icon.windrose ---------------------------------------------------------
$(document).delegate('svg[data-widget="icon.windrose"]', {
	'update': function (event, response) {
		// response is: {{ gad_value }}, {{ gad_switch }}

		var ang = response[0] / $(this).attr('data-max') * 2 * Math.PI;
		
		var pt = [];
		pt = pt.concat(fx.rotate([50, 60], ang, [50, 50]), fx.rotate([37, 71], ang, [50, 50]), fx.rotate([50, 29], ang, [50, 50]));
		$('#' + this.id + ' #pin0').attr('points', pt.toString());

		pt = [];
		pt = pt.concat(fx.rotate([50, 60], ang, [50, 50]), fx.rotate([63, 71], ang, [50, 50]), fx.rotate([50, 29], ang, [50, 50]));
		$('#' + this.id + ' #pin1').attr('points', pt.toString());
	}
});

// ----- icon.windsock ---------------------------------------------------------
$(document).delegate('svg[data-widget="icon.windsock"]', {
	'update': function (event, response) {
		// response is: {{ gad_value }}, {{ gad_switch }}

		var ang = response[0] / $(this).attr('data-max') * 0.45 * Math.PI;
		
		var pt = [];
		pt = pt.concat(fx.rotate([70, 40], ang, [80, 22]), [80, 22], fx.rotate([90, 40], ang, [80, 22]));
		$('#' + this.id + ' #top').attr('points', pt.toString());

		for (var i = 0; i < 3; i++) {
			pt = [];
			pt = pt.concat(fx.rotate([71 + i * 2, 50 + i * 14], ang, [80, 22]), fx.rotate([89 - i * 2, 50 + i * 14], ang, [80, 22]),
				fx.rotate([88 - i * 2, 54 + i * 14], ang, [80, 22]), fx.rotate([72 + i * 2, 54 + i * 14], ang, [80, 22]));
			$('#' + this.id + ' #part' + i).attr('points', pt.toString());
		}
		
		pt = [];
		pt = pt.concat(fx.rotate([70, 40], ang, [80, 22]), fx.rotate([76, 82], ang, [80, 22]), fx.rotate([84, 82], ang, [80, 22]), fx.rotate([90, 40], ang, [80, 22]));
		$('#' + this.id + ' #part3').attr('points', pt.toString());
	}
});
