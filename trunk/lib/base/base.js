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
 * J A V A S C R I P T   S T A T I C   E X T E N T I O N S
 * -----------------------------------------------------------------------------
 */

/**
 * Checks min / max and step
 */
Number.prototype.limit = function (min, max, step) {
	ret = this;

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
	ret = Array();

	if (this.length) {
		ret = this.split(delimiter !== undefined ? delimiter : ',');

		for (var i = 0; i < ret.length; i++) {
			ret[i] = ret[i].trim();
		}
	}
	;

	return ret;
};


/**
 * Calculates a date based on a relative time (1h 30m)
 */
Date.prototype.duration = function (str) {

	var toks = {
		y: 30758400000, /* 365 * d */
		m: 2592000000, /* 30 * d */
		w: 604800000, /* 7 * d */
		d: 86400000, /* 24 * h */
		h: 3600000, /* 60 * i */
		i: 60000, /* 60 * s */
		s: 1000 /* 1 * 1000 */
	};

	var result = 0;

	if (str) {
		var tokens = str.toLowerCase().split(" ");

		var val = 0;
		var scale = 1;
		var tok;
		var cur = -1;
		var result = 0;

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
 * Q U E R Y   E X T E N T I O N S
 * -----------------------------------------------------------------------------
 */

/**
 * Mini-Clock
 */
(function ($) {
	$.fn.extend({
		miniclock: function () {
			return this.each(function () {
				var $this = $(this);
				$this.displayMiniClock($this);
			});
		}});

	$.fn.displayMiniClock = function (el) {
		var now = new Date();
		el.html(now.getHours() + ':' + (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()));
		setTimeout(function () {
			$.fn.displayMiniClock(el)
		}, $.fn.delay());
	};

	$.fn.delay = function () {
		var now = new Date();
		var delay = (60 - now.getSeconds()) * 1000;
		return delay;
	}
})(jQuery);


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
	 * Expects an array with coordinates x, y. Rotates them around origin with an angle
	 */
	rotate: function (coordinates, angle, origin) {
		var xs = coordinates[0] - origin[0];
		var ys = coordinates[1] - origin[1];
		var ls = Math.sqrt(xs * xs + ys * ys);

		var ad = Math.atan2(xs, ys) + angle + 0.5 * Math.PI;
		var xd = Math.round(Math.cos(ad) * ls + origin[0]);
		var yd = Math.round(Math.sin(ad) * ls + origin[1]);

		return [xd, yd];
	},

	/**
	 * Draws a grid made of lines
	 */
	grid: function (obj, val, start, end) {
		var line;

		$(obj).children().each(function (index) {
			var g = $(this);
			if (g.is('line')) {
				g.remove();
			}
		});

		while (val > 0) {
			line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			line.setAttribute('x1', start[0]);
			line.setAttribute('y1', start[1] + val);
			line.setAttribute('x2', end[0]);
			line.setAttribute('y2', start[1] + val);
			$(obj).append(line);
			val = val - 6;
		}
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
 * Class for displaying notifications and notes in smartVISU
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
	add: function (status, signal, title, text) {
		notify.i++;
		notify.messages[notify.i] = Array();
		notify.messages[notify.i] = ({status: status, signal: signal, title: title, text: text, stamp: Date.now()});

		// log to console
		console.log('[notify.' + notify.messages[notify.i].status + '] ' + notify.messages[notify.i].title + ' - ' + notify.messages[notify.i].text);
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
	 */
	json: function (jqXHR, status, errorthrown) {

		var messages = jQuery.parseJSON(jqXHR.responseText)

		for (var i = 0; i < messages.length; i++) {
			notify.add('error', 'ERROR', messages[i].title, messages[i].text);
		}

		notify.display();
	},

	/**
	 * Removes a note, or all if no id is given
	 */
	remove: function (id) {
		var message = notify.messages[notify.i];

		$('.alert').popup('close');
		$('.signal').removeClass(message.status);
		$('.signal').hide();

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
			$('.signal').addClass(message.status);
			$('.signal').html(message.signal);
			$('.alert h1').html(message.title);
			$('.alert p').html(message.text);
			$('.alert .stamp').html(new Date(message.stamp).transShort());

			$('.signal').show();
		}
	}
};
