/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


/**
 * -----------------------------------------------------------------------------
 * J A V A S C R I P T   F U N C T I O N S
 * -----------------------------------------------------------------------------
 */
function printf(format, val) {
	var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(([\.,])(\*\d+\$|\*|\d+))?([sScboxXuideEfFgG])/g;

	var fmtString = function (val, wth, prc) {
		if (prc > 0) {
			val = val.slice(0, prc);
		}
		return val;
	};

	var fmtBase = function (val, base, pre) {
		var number = val >>> 0;
		pre = pre && number && { '2': '0b', '8': '0', '16': '0x' }[base] || '';

		return pre + number.toString(base);
	};

	var fmtFloat = function (val, sep) {
		if (sep != '.') {
			val = val.replace('.', sep);
		}

		return val;
	};

	var fmt = function (str, idx, flg, wth, prt, sep, prc, typ) {
		// DEBUG: console.log('[base.printf]', 'str:' + str, 'idx:' + idx, 'flg:' + flg, 'wth:' + wth, 'prt' + prt, 'sep:' + sep, 'prc:' + prc, 'typ:' + typ);

		var num, pre = '';

		if (str === '%%') {
			return '%';
		}

		if (flg == '+') {
			pre = '+';
		}

		switch (typ) {
			case 's':
				return fmtString(String(val), wth, prc);
			case 'S':
				return fmtString(String(val), wth, prc).toUpperCase();
			case 'c':
				return fmtString(String.fromCharCode(+val), wth, prc);
			case 'b':
				return fmtBase(val, 2, pre);
			case 'o':
				return fmtBase(val, 8, pre);
			case 'x':
				return fmtBase(val, 16, pre);
			case 'X':
				return fmtBase(val, 16, pre).toUpperCase();
			case 'u':
				return fmtBase(val, 10, pre);
			case 'i':
			case 'd':
				num = +val || 0;
				num = Math.round(num - num % 1);
				pre = num < 0 ? '-' : pre;
				return pre + String(Math.abs(num));
			case 'e':
			case 'E':
			case 'f':
			case 'F':
			case 'g':
			case 'G':
				num = +val;
				pre = num < 0 ? '-' : pre;
				var method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(typ.toLowerCase())];
				var transform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(typ) % 2];
				return fmtFloat((pre + Math.abs(num)[method](prc))[transform](), sep);
			default:
				return str;
		}
	}

	return format.replace(regex, fmt);
}


/**
 * -----------------------------------------------------------------------------
 * J A V A S C R I P T   S T A T I C   E X T E N T I O N S
 * -----------------------------------------------------------------------------
 */

/**
 * Checks min / max and step
 */
Number.prototype.limit = function (min, max, step) {
	var ret = this;

	if (ret < min) {
		ret = min;
	}

	if (ret > max) {
		ret = max;
	}

	if (step) {
		ret = Math.floor(ret, step);
	}

	return ret;
};

/**
 * Splits a string into parts
 */
String.prototype.explode = function (delimiter) {
	var ret = Array();

	if (this.length) {
		ret = this.split(delimiter !== undefined ? delimiter : ',');

		for (var i = 0; i < ret.length; i++) {
			ret[i] = ret[i].trim();
		}
	}

	return ret;
};


/**
 * Calculates a date based on a relative time (1h 30m)
 */
Date.prototype.duration = function (str) {

	var toks = {
		y: 30758400000, /*  365 * d */
		m: 2592000000, /*   30 * d */
		w: 604800000, /*    7 * d */
		d: 86400000, /*   24 * h */
		h: 3600000, /*   60 * i */
		i: 60000, /*   60 * s */
		s: 1000   /* 1 * 1000 */
	};

	var result = 0;

	if (str) {
		var tokens = str.toLowerCase().split(" ");

		var val = 0;
		var scale = 1;
		var tok;
		var cur = -1;
		result = 0;

		for (var i = 0; i < tokens.length; i += 1) {
			tok = false;
			if (Number(tokens[i])) {
				val = tokens[i];
			}
			else {
				cur = tokens[i].match(/[a-z]/);

				if (cur) {
					var j = cur.index;
					tok = tokens[i].substr(j);
					if (j > 0) {
						val = tokens[i].substr(0, j);
					}
				}
				else {
					tok = tokens[i];
				}

				if (tok && val) {
					scale = toks[tok];
					result += val * scale;
					val = 0;
					tok = false;
				}
			}
		}

		// default is 's'
		if (result == 0 && val > 0) {
			result = val * toks['s'];
		}
	}

	return new Date(result);
};


/**
 * -----------------------------------------------------------------------------
 * C L A S S   E X T E N T I O N S
 * -----------------------------------------------------------------------------
 */

/**
 * Class for manipulation some grafix
 */
var fx = {
	/**
	 * Initialisation
	 */
	init: function () {

		// svgs: we need them inline to modify them per css
		$('img.icon1[src$=".svg"], a.icon1 > img.icon[src$=".svg"]').each(function () {
			var img = $(this), img_id = img.attr('id'), img_class = img.attr('class'), img_src = img.attr('src');

			$.get(img_src, function (data) {
				var svg = $(data).find('svg');

				if (typeof img_id !== 'undefined') {
					svg = svg.attr('id', img_id);
				}

				svg = svg.attr('class', 'fx-' + img_class);
				// $svg = $svg.attr('viewBox', '0 0 400 400');

				svg.find('[fill!="none"]').removeAttr('fill');
				svg.find('g').children().removeAttr('stroke');
				svg.children().removeAttr('stroke');

				img.replaceWith(svg);
			}, 'xml');

		});
	},


	/**
	 * Expects an array with coordinates x, y. Rotates them around origin with an angle
	 */
	rotate: function (coordinates, angle, origin) {

		var xd = Math.cos(angle) * (coordinates[0] - origin[0]) - Math.sin(angle) * (coordinates[1] - origin[1]) + origin[0];
		var yd = Math.sin(angle) * (coordinates[0] - origin[0]) + Math.cos(angle) * (coordinates[1] - origin[1]) + origin[1];

		return [xd, yd];
	},

	/**
	 * Draws a grid made of lines
	 */
	grid: function (obj, val, start, end) {
		var line;

		this.remove(obj);

		while (val > 0) {
			line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			line.setAttributeNS(null, 'x1', start[0]);
			line.setAttributeNS(null, 'y1', (start[1] < end[1] ? start[1] + val : start[1] - val));
			line.setAttributeNS(null, 'x2', end[0]);
			line.setAttributeNS(null, 'y2', (start[1] < end[1] ? start[1] + val : start[1] - val));
			$('#' + obj.id + ' g').append(line);
			val = val - 6;
		}
	},

	/**
	 * Removes all the elements from the svg
	 */
	remove: function (obj, element) {

		if (!element) {
			element = 'line';
		}

		$('#' + obj.id + ' g').children().each(function (index) {
			var g = $(this);
			if (g.is(element)) {
				g.remove();
			}
		});
	},

	/**
	 * Converts a hsv value to rgb value
	 */
	hsv2rgb: function (h, s, v) {
		var r, g, b;
		var i;
		var f, p, q, t;

		// test range
		h = Math.max(0, Math.min(360, h));
		s = Math.max(0, Math.min(100, s));
		v = Math.max(0, Math.min(100, v));

		s /= 100;
		v /= 100;

		if (s == 0) {
			// achromatic (grey)
			r = g = b = v;
		}
		else {
			h /= 60; // sector 0 to 5
			i = Math.floor(h);
			f = h - i; // factorial part of h
			p = v * (1 - s);
			q = v * (1 - s * f);
			t = v * (1 - s * (1 - f));

			switch (i) {
				case 0:
					r = v;
					g = t;
					b = p;
					break;
				case 1:
					r = q;
					g = v;
					b = p;
					break;
				case 2:
					r = p;
					g = v;
					b = t;
					break;
				case 3:
					r = p;
					g = q;
					b = v;
					break;
				case 4:
					r = t;
					g = p;
					b = v;
					break;
				default:
					r = v;
					g = p;
					b = q;
			}
		}

		r = Math.round(r * 255);
		g = Math.round(g * 255);
		b = Math.round(b * 255);

		return 'rgb(' + r + ',' + g + ',' + b + ')';
	}
};


/**
 * Class for displaying notifications and notes
 */
var notify = {

	i: 0,

	// a list with all values, all communication it through the buffer
	messages: new Object(),

	/**
	 *  Checks if there are any messages
	 */
	exists: function () {
		var ret = false;

		for (var i in notify.messages) {
			ret = true;
		}

		return ret;
	},

	/**
	 * Add a new message
	 */
	add: function (level, signal, title, text) {
		notify.i++;
		notify.messages[notify.i] = Array();
		notify.messages[notify.i] = ({level: level, signal: signal, title: title, text: text, time: Date.now()});

		// log to console
		console.log('[notify.' + notify.messages[notify.i].level + '] ' + notify.messages[notify.i].title + ' - ' + notify.messages[notify.i].text);
	},

	/**
	 * Add a new debug-message
	 */
	debug: function (title, text) {
		//notify.add('debug', 'DEBUG', title, text);
	},

	/**
	 * Add a new update-message
	 */
	update: function (title, text) {
		notify.add('update', 'UPDATE', title, text);
		notify.display();
	},

	/**
	 * Add a new info-message
	 */
	info: function (title, text) {
		notify.add('info', 'INFO', title, text);
		notify.display();
	},

	/**
	 * Add a new info-message
	 */
	warning: function (title, text) {
		notify.add('warning', 'WARN', title, text);
		notify.display();
	},

	/**
	 * Add a new error-message
	 */
	error: function (title, text) {
		notify.add('error', 'ERROR', title, text);
		notify.display();
	},

	/**
	 * Add a new error-message from a ajax error request
	 * @param    error object
	 * @param    status
	 * @param    '600 smartVISU Config Error'
	 * @param    '601 smartVISU Service Error'
	 * @param    '602 smartVISU Template Error'
	 * @param    '603 smartVISU Driver Error'
	 * @param    '610 smartVISU Updatecheck Error'
	 */
	json: function (jqXHR, status, errorthrown) {

		var message = jqXHR.responseJSON;

		notify.add('error', 'ERROR', message.title, message.text);
		notify.display();
	},

	/**
	 * Removes a note, or all if no id is given
	 */
	remove: function (id) {
		var message = notify.messages[notify.i];

		$('.alert').popup('close');
		$('.signal').removeClass(message.level).hide();

		if (id !== undefined) {
			delete notify.messages[id];
		}
		else {
			notify.messages = new Object();
		}
	},

	/**
	 * Displays the message at the top right corner
	 */
	display: function () {
		var message = notify.messages[notify.i];

		if (message) {
			$('.alert h1').html(message.title);
			$('.alert p').html(message.text);
			$('.alert .stamp').html(new Date(message.time).transShort());
			$('.signal').addClass(message.level).html(message.signal).show();
		}
	}
};


/**
 * Class for repeating widgets
 *
 * Concept:
 * --------
 * Every widget may use 'data-repeat'. This causes smartVISU to trigger
 * 'repeat' after the specified time. It will try to adjust the trigger
 * time to a full minute or hour or day. So it will be triggered exactly when
 * the diget changes.
 *
 * Events:
 * -------
 *
 * 'repeat': function(event) { }
 * Triggerd after the specified time.
 *
 */
var repeater = {

	// a list of all repeaters
	dir: new Object(),

	/**
	 * Searches for 'data-repeat' and builds the dir
	 */
	init: function () {
		$('[data-repeat]').each(function (idx) {

			// init every repeater only once
			if (!repeater.dir[this.id]) {

				var obj = $('#' + this.id);
				repeater.dir[this.id] = new Date().duration(obj.attr('data-repeat'));

				obj.trigger('repeat');
				repeater.tick(this.id);
			}
		});
	},

	/**
	 * Starts the ticking-loop
	 */
	tick: function (uid) {

		var now = new Date();
		var delay = repeater.dir[uid];

		if (delay >= 60 * 1000) {
			delay = (delay - now.getSeconds() * 1000);
		}
		if (delay >= 60 * 60 * 1000) {
			delay = (delay - now.getMinutes() * 60 * 1000);
		}
		if (delay >= 24 * 60 * 60 * 1000) {
			delay = (delay - now.getHours() * 60 * 60 * 1000);
		}

		setTimeout("$('#" + uid + "').trigger('repeat'); repeater.tick('" + uid + "');", delay);
	},

	/**
	 * List all widgets with the 'data-repeat' tag
	 */
	list: function () {
		var count = 0;

		$('[data-repeat]').each(function (idx) {
			console.log("[" + $(this).attr('data-widget') + "] '" + this.id + "' repeats every '" + $(this).attr('data-repeat') + "'");
			count++;
		});

		console.log("[repeater] --> " + count + " widgets - ", Object.keys(repeater.dir).length + " in dir");
	}

};


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
			// arrays passed by reference so no need to add it to the buffer, the caller (driver, highchart, ...) will do it.   
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

	/**
	 * Is the item a series?
	 */
	checkseries: function (item) {
		var pt = item.split('.');
		return ($.inArray(pt[pt.length - 3], Array('avg', 'min', 'max', 'sum', 'diff', 'rate', 'on')) >= 0 );
	},


	// ----- l i s t e n e r s ------------------------------------------------

	/**
	 * Returns all unique items from all widgets except plots and logs.
	 *
	 * @return    array  unique list of the items
	 */
	listeners: function () {
		var ret = Array();
		var unique = Array();

		$('[id^="' + $.mobile.activePage.attr('id') + '-"][data-item]').each(function (idx) {
			if (!($(this).attr('data-widget') == 'status.log')) {
				var items = widget.explode($(this).attr('data-item'));
				for (var i = 0; i < items.length; i++) {
					if (!widget.checkseries(items[i])) {
						unique[items[i]] = '';
					}
				}
			}
		});

		for (var item in unique) {
			ret.push(item);
		}

		return ret;
	},

	/**
	 * Returns all widgets with plot functionality or plots listening to an item.
	 * Matching 'plot.' in attribute 'data-widget'.
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
	 * Returns all widgets with log functionality.
	 * Matching 'status.log' in attribute 'data-widget'.
	 *
	 * @param    item  item: matches all log-widgets with that item
	 * @return   jQuery objectlist
	 */
	log: function (item) {
		var ret = $();

		if (item) {
			$('[id^="' + $.mobile.activePage.attr('id') + '-"][data-widget="status.log"][data-item="' + item + '"]').each(function (idx) {
				var items = widget.explode($(this).attr('data-item'));
				for (var i = 0; i < items.length; i++) {
					if (items[i] == item) {
						ret = ret.add(this);
					}
				}
			})
		}
		else {
			ret = $('[id^="' + $.mobile.activePage.attr('id') + '-"][data-widget="status.log"][data-item]');
		}

		return ret;
	}

};

