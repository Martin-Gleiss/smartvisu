/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß, Stefan Widmer, Wolfram v. Hülsen
 * @copyright   2012 - 2021
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
		pre = pre && number && {'2': '0b', '8': '0', '16': '0x'}[base] || '';

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
 * Activates check and reload for lost WebSocket connection
 */
function activateAutoReconnect() {
	if(io.socket) {
		var autoReconnectIntervalId = window.setInterval(function () {
			// console.log('checking if websocket is alive: state = '+ io.socket.readyState);
			if(io.socket != null && io.socket.readyState == 3) {
				console.log("WebSocket closed, reconnect...");
				io.init();
			}
		}, 5000);

		// clear interval removed after pr#353 to fix reconnect after frozen tab 		
		window.onbeforeunload = function() {
		//console.log('event onbeforeunload');
		window.clearInterval(autoReconnectIntervalId);
		};
	}
}

/**
 * Displays a timestamp as time in H:i:s format
 */
function timedisplay (num) {
	var ret='';
	if (num <0){  
		num = -num;
		ret +='-'
	};
	var timestamp = new Date(num - num%1000);
	var s = timestamp.getSeconds();
	var i = timestamp.getMinutes();
	var h = (timestamp - s*1000 - i*60000)/3600000;
	ret +=(h<10?'0'+h : h)+':';
	ret +=(i<10?'0'+i : i)+':';
	ret +=(s<10?'0'+s : s);
	return ret;
};

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
 * Determine count of decimals of a number 
 */
Number.prototype.decimals = function (){
	if (parseInt(this) == this)
		return 0;
	else {
		var parts = Array();
		parts = String(this).split('.');
		return parts[1].length;
	}
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
 * Calculates a md5 from the given string
 */
String.prototype.md5 = function () {

	var md5cycle = function (x, k) {
		var a = x[0], b = x[1], c = x[2], d = x[3];

		a = ff(a, b, c, d, k[0], 7, -680876936);
		d = ff(d, a, b, c, k[1], 12, -389564586);
		c = ff(c, d, a, b, k[2], 17, 606105819);
		b = ff(b, c, d, a, k[3], 22, -1044525330);
		a = ff(a, b, c, d, k[4], 7, -176418897);
		d = ff(d, a, b, c, k[5], 12, 1200080426);
		c = ff(c, d, a, b, k[6], 17, -1473231341);
		b = ff(b, c, d, a, k[7], 22, -45705983);
		a = ff(a, b, c, d, k[8], 7, 1770035416);
		d = ff(d, a, b, c, k[9], 12, -1958414417);
		c = ff(c, d, a, b, k[10], 17, -42063);
		b = ff(b, c, d, a, k[11], 22, -1990404162);
		a = ff(a, b, c, d, k[12], 7, 1804603682);
		d = ff(d, a, b, c, k[13], 12, -40341101);
		c = ff(c, d, a, b, k[14], 17, -1502002290);
		b = ff(b, c, d, a, k[15], 22, 1236535329);

		a = gg(a, b, c, d, k[1], 5, -165796510);
		d = gg(d, a, b, c, k[6], 9, -1069501632);
		c = gg(c, d, a, b, k[11], 14, 643717713);
		b = gg(b, c, d, a, k[0], 20, -373897302);
		a = gg(a, b, c, d, k[5], 5, -701558691);
		d = gg(d, a, b, c, k[10], 9, 38016083);
		c = gg(c, d, a, b, k[15], 14, -660478335);
		b = gg(b, c, d, a, k[4], 20, -405537848);
		a = gg(a, b, c, d, k[9], 5, 568446438);
		d = gg(d, a, b, c, k[14], 9, -1019803690);
		c = gg(c, d, a, b, k[3], 14, -187363961);
		b = gg(b, c, d, a, k[8], 20, 1163531501);
		a = gg(a, b, c, d, k[13], 5, -1444681467);
		d = gg(d, a, b, c, k[2], 9, -51403784);
		c = gg(c, d, a, b, k[7], 14, 1735328473);
		b = gg(b, c, d, a, k[12], 20, -1926607734);

		a = hh(a, b, c, d, k[5], 4, -378558);
		d = hh(d, a, b, c, k[8], 11, -2022574463);
		c = hh(c, d, a, b, k[11], 16, 1839030562);
		b = hh(b, c, d, a, k[14], 23, -35309556);
		a = hh(a, b, c, d, k[1], 4, -1530992060);
		d = hh(d, a, b, c, k[4], 11, 1272893353);
		c = hh(c, d, a, b, k[7], 16, -155497632);
		b = hh(b, c, d, a, k[10], 23, -1094730640);
		a = hh(a, b, c, d, k[13], 4, 681279174);
		d = hh(d, a, b, c, k[0], 11, -358537222);
		c = hh(c, d, a, b, k[3], 16, -722521979);
		b = hh(b, c, d, a, k[6], 23, 76029189);
		a = hh(a, b, c, d, k[9], 4, -640364487);
		d = hh(d, a, b, c, k[12], 11, -421815835);
		c = hh(c, d, a, b, k[15], 16, 530742520);
		b = hh(b, c, d, a, k[2], 23, -995338651);

		a = ii(a, b, c, d, k[0], 6, -198630844);
		d = ii(d, a, b, c, k[7], 10, 1126891415);
		c = ii(c, d, a, b, k[14], 15, -1416354905);
		b = ii(b, c, d, a, k[5], 21, -57434055);
		a = ii(a, b, c, d, k[12], 6, 1700485571);
		d = ii(d, a, b, c, k[3], 10, -1894986606);
		c = ii(c, d, a, b, k[10], 15, -1051523);
		b = ii(b, c, d, a, k[1], 21, -2054922799);
		a = ii(a, b, c, d, k[8], 6, 1873313359);
		d = ii(d, a, b, c, k[15], 10, -30611744);
		c = ii(c, d, a, b, k[6], 15, -1560198380);
		b = ii(b, c, d, a, k[13], 21, 1309151649);
		a = ii(a, b, c, d, k[4], 6, -145523070);
		d = ii(d, a, b, c, k[11], 10, -1120210379);
		c = ii(c, d, a, b, k[2], 15, 718787259);
		b = ii(b, c, d, a, k[9], 21, -343485551);

		x[0] = add32(a, x[0]);
		x[1] = add32(b, x[1]);
		x[2] = add32(c, x[2]);
		x[3] = add32(d, x[3]);

	};

	var cmn = function (q, a, b, x, s, t) {
		a = add32(add32(a, q), add32(x, t));
		return add32((a << s) | (a >>> (32 - s)), b);
	};

	var ff = function (a, b, c, d, x, s, t) {
		return cmn((b & c) | ((~b) & d), a, b, x, s, t);
	};

	var gg = function (a, b, c, d, x, s, t) {
		return cmn((b & d) | (c & (~d)), a, b, x, s, t);
	};

	var hh = function (a, b, c, d, x, s, t) {
		return cmn(b ^ c ^ d, a, b, x, s, t);
	};

	var ii = function (a, b, c, d, x, s, t) {
		return cmn(c ^ (b | (~d)), a, b, x, s, t);
	};

	var md51 = function (s) {
		var txt = '';
		var n = s.length,
			state = [1732584193, -271733879, -1732584194, 271733878], i;
		for (i = 64; i <= s.length; i += 64) {
			md5cycle(state, md5blk(s.substring(i - 64, i)));
		}
		s = s.substring(i - 64);
		var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		for (i = 0; i < s.length; i++) {
			tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
		}
		tail[i >> 2] |= 0x80 << ((i % 4) << 3);
		if (i > 55) {
			md5cycle(state, tail);
			for (i = 0; i < 16; i++) {
				tail[i] = 0;
			}
		}
		tail[14] = n * 8;
		md5cycle(state, tail);
		return state;
	};

	var md5blk = function (s) {
		var md5blks = [], i;
		for (i = 0; i < 64; i += 4) {
			md5blks[i >> 2] = s.charCodeAt(i)
			+ (s.charCodeAt(i + 1) << 8)
			+ (s.charCodeAt(i + 2) << 16)
			+ (s.charCodeAt(i + 3) << 24);
		}
		return md5blks;
	};

	var hex_chr = '0123456789abcdef'.split('');

	var rhex = function (n) {
		var s = '', j = 0;
		for (; j < 4; j++) {
			s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
			+ hex_chr[(n >> (j * 8)) & 0x0F];
		}
		return s;
	};

	var hex = function (x) {
		for (var i = 0; i < x.length; i++) {
			x[i] = rhex(x[i]);
		}
		return x.join('');
	};

	var add32 = function (a, b) {
		return (a + b) & 0xFFFFFFFF;
	};

	return hex(md51(this));
};

/**
 * Escapes html-specific characters to display in status messages and log from backend
 */
 	var specialchars = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };
  
 String.prototype.htmlescape = function () {
	 return this.replace(/[&<>"'\/]/g, function (s) {
      return specialchars[s];
    });
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
		i: 60000,  /*   60 * s */
		s: 1000   /* 1 * 1000 */
	};

	var result = 0;

	if (str) {

		if(str === 'now')
			return new Date(0);

		var tokens = String(str).toLowerCase().split(" ");

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

		// interpret as timestamp if no duration format is given 
		// changed in v3.2 from "default = 's' "
		if (result == 0 && val > 0) {
			//result = val * toks['s'];
			result = new Date() - val;
		}
	}

	return new Date(result);
};

/**
 * Compares arrays
 * Source: https://stackoverflow.com/a/14853974
 */
// Check if overriding existing method
if(!Array.prototype.equals) {
	// attach the .equals method to Array's prototype to call it on any array
	Array.prototype.equals = function (array) {
		// if the other array is a falsy value, return
		if (!array)
			return false;

		// compare lengths - can save a lot of time
		if (this.length != array.length)
			return false;

		for (var i = 0, l=this.length; i < l; i++) {
			// Check if we have nested arrays
			if (this[i] instanceof Array && array[i] instanceof Array) {
				// recurse into the nested arrays
				if (!this[i].equals(array[i]))
					return false;
			}
			else if (this[i] != array[i]) {
				// Warning - two different object instances will never be equal: {x:20} != {x:20}
				return false;
			}
		}
		return true;
	}
	// Hide method from for-in loops
	Object.defineProperty(Array.prototype, "equals", {enumerable: false});
}

/**
 * Get values of an Object
 * (Polyfill for IE and older browsers)
 */
if (!Object.values) {
	Object.values = function(obj) {
		var vals = [];
		for (var key in obj) {
			vals.push(obj[key]);
		}
		return vals;
	};
}

/*
 * Polyfill of padStart and padEnd for IE
 */
// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}
// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
if (!String.prototype.padEnd) {
    String.prototype.padEnd = function padEnd(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return String(this) + padString.slice(0,targetLength);
        }
    };
}

/**
 * Invert jQuery filtered list
 * Source: https://stackoverflow.com/a/2798774
 */
$.fn.invert = function() {
  return this.end().not(this);
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
	init3: function () {

		var group = {};
		$('img.icon1[src$=".svg"], a.icon1 > img.icon[src$=".svg"]').each(function () {
			var img = $(this), src = img.attr('src');
			//img.attr('src','').hide(); // prevent double loading (once by img html, once by $.get above)
			if(group[src])
				group[src] = group[src].add(img);
			else
				group[src] = img;
		});

		$.each(group, function(src, imgs) {
			$.get(src, function (data) {
				var baseSvg = $(data).find('svg');
				baseSvg.attr('role', 'img');
				baseSvg.find('[fill!="none"]').removeAttr('fill');
				//baseSvg.find('[style*="fill:"]').css('fill', '');
				baseSvg.find('g').children().removeAttr('stroke');
				baseSvg.children().removeAttr('stroke');
				//imgs = imgs.replaceWith(svg);

				imgs.each(function(index) {
					var img = $(this), svg = (index == imgs.length - 1) ? baseSvg : baseSvg.clone();

					// copy all attributes of img to svg
					$.each(img[0].attributes, function() {
						if(this.specified) {
							if(this.name == 'src')
								return;
							if(this.name == 'class')
								return;
							else if(this.name == 'alt')
								svg.attr('aria-label', this.value);
							else if (this.name == 'title')
								svg.children('title').remove().end().prepend('<title>'+this.value+'</title>');
							svg.attr(this.name, this.value);
						}
					});

					svg.attr('class', 'fx-' + img.attr('class'));

					img.attr('src', 'data:image/svg+xml,'+encodeURI('<?xml-stylesheet href="pages/base/base.css" type="text/css"?>'+$('<div>').append(svg).html()));

					// if the svg is loaded and replaced, we try to draw if it is a widget
					var img_id = img.attr('id');
					if (typeof img_id !== 'undefined') {
						$('#' + img_id.substr(0, img_id.lastIndexOf('-'))).trigger('draw');
					}
				});
			}, 'xml');
		});
	},

	/**
	 * Initialisation
	 */
	init3: function () {

		var group = {};
		var sprite = $('#svgsprite');
		if(!sprite.length) {
			sprite = $('<svg id="svgsprite" xmlns="http://www.w3.org/2000/svg"></svg>').prependTo('body');
		}

		$('.icon use').each(function () {
			var img = $(this), src = img.attr('data-src');
			var id = src.replace(/[^a-zA-Z0-9_\-]/g, '-');
			//img.attr('src','').hide(); // prevent double loading (once by img html, once by $.get above)
			if(!sprite.find('#id').length) {
				if(group[src])
					group[src] = group[src].add(img);
				else
					group[src] = img;
			}
		});

		$('img.icon1[src$=".svg"], a.icon1 > img.icon[src$=".svg"]').each(function () {
			var img = $(this), src = img.attr('src');
			var id = src.replace(/[^a-zA-Z0-9_\-]/g, '-');
			var svg = $('<svg role="img" xmlns="http://www.w3.org/2000/svg"><use href="#'+id+'"></svg>');
			// copy all attributes of img to svg
			$.each(img[0].attributes, function() {
				if(this.specified) {
					if(this.name == 'src')
						return;
					if(this.name == 'class')
						return;
					else if(this.name == 'alt')
						svg.attr('aria-label', this.value);
					else if (this.name == 'title')
						svg.children('title').remove().end().prepend('<title>'+this.value+'</title>');
					svg.attr(this.name, this.value);
				}
			});

			svg.attr('class', 'fx-' + img.attr('class'));

			img.replaceWith(svg);

			//img.attr('src','').hide(); // prevent double loading (once by img html, once by $.get above)
			if(!sprite.find('#id').length) {
				if(group[src])
					group[src] = group[src].add(img);
				else
					group[src] = img;
			}
		});

		var spriteArray = [];
		var groupCount = Object.keys(group).length;
		$.each(group, function(src, imgs) {
			$.get(src, function (data) {
				var baseSvg = $(data).children('svg');
				baseSvg.find('[fill!="none"]').removeAttr('fill');
				//baseSvg.find('[style*="fill:"]').css('fill', '');
				baseSvg.find('g').children().removeAttr('stroke');
				baseSvg.children().removeAttr('stroke');
/*
				var symbol = $('<symbol>')
					.attr('id', src.replace(/[^a-zA-Z0-9_\-]/g, '-'))
					.attr('viewBox', baseSvg.attr('viewBox'))
					.html(baseSvg.html())
					.appendTo(sprite);
*/
				//sprite.html(sprite.html() + '<symbol id="' + src.replace(/[^a-zA-Z0-9_\-]/g, '-') + '" viewBox="' + baseSvg.attr('viewBox') + '">' + baseSvg.html() + '</symbol>');

				spriteArray.push('<symbol id="' + src.replace(/[^a-zA-Z0-9_\-]/g, '-') + '" viewBox="' + baseSvg.attr('viewBox') + '">' + baseSvg.html() + '</symbol>');
				if(spriteArray.length == groupCount)
					sprite.html(spriteArray.join(''));

			}, 'xml');
		});
	},

/*
		$('img.icon1[src$=".svg"], img.icon[src$=".svg"]').each(function () {
			var img = $(this);//, svg = (index == imgs.length - 1) ? baseSvg.clone() : baseSvg;
			var svg = $('<svg xmlns="http://www.w3.org/2000/svg" class="fx-icon"><use href="'+img.attr('src')+'#svg" /></svg>');

			// copy all attributes of img to svg
			$.each(img[0].attributes, function() {
				if(this.specified) {
					if(this.name == 'src')
						return;
					if(this.name == 'class')
						return;
					else if(this.name == 'alt')
						svg.attr('aria-label', this.value);
					else if (this.name == 'title')
						svg.children('title').remove().end().prepend('<title>'+this.value+'</title>');
					svg.attr(this.name, this.value);
				}
			});

			svg.attr('class', 'icon fx-' + img.attr('class') + (!img.hasClass('icon1') ? ' icon0' : ''));

			img.replaceWith(svg);

			// if the svg is loaded and replaced, we try to draw if it is a widget
			var img_id = img.attr('id');
			if (typeof img_id !== 'undefined') {
				$('#' + img_id.substr(0, img_id.lastIndexOf('-'))).trigger('draw');
			}
		});
*/

	/**
	 * Initialisation
	 */
	init: function () {
		//Possibliy helpfull in here: http://keith-wood.name/svg.html

		var group = {};
		$('img.icon1[src$=".svg"], img.do-fx[src$=".svg"], a.icon1 > img.icon[src$=".svg"]').each(function () {
			var img = $(this), src = img.attr('src');
			//img.attr('src','').hide(); // prevent double loading (once by img html, once by $.get above)
			if(group[src])
				group[src] = group[src].add(img);
			else
				group[src] = img;
		});

		$.each(group, function(src, imgs) {
			$.get(src, function (data) {
				var baseSvg = $(data).find('svg');
				baseSvg.attr('role', 'img');
				baseSvg.find('[fill!="none"]').removeAttr('fill');
				//baseSvg.find('[style*="fill:"]').css('fill', '');
				baseSvg.find('g').children().removeAttr('stroke');
				baseSvg.children().removeAttr('stroke');
				//imgs = imgs.replaceWith(svg);

				// if svg has defs (e.g. filter) prepend them to body (otherwise they may get hidden and won't work anymore)
				if(baseSvg.children('defs').length > 0) {
					var defsSvg = baseSvg.clone();
					defsSvg.children(':not(defs)').remove();
					defsSvg.css('width', 0).css('height', 0).css('visibility', 'hidden').prependTo('body');
				}

				imgs.each(function(index) {
					var img = $(this), svg = (index == imgs.length - 1) ? baseSvg : baseSvg.clone();

					// copy all attributes of img to svg
					$.each(img[0].attributes, function() {
						if(this.specified) {
							if(this.name == 'src')
								return;
							if(this.name == 'class')
								return;
							else if(this.name == 'alt')
								svg.attr('aria-label', this.value);
							else if (this.name == 'title')
								svg.children('title').remove().end().prepend('<title>'+this.value+'</title>');
							svg.attr(this.name, this.value);
						}
					});

					svg.attr('class', 'fx-' + img.attr('class'));

					// Trigger jQuery Mobile initialization
					$('<div>').append(svg).enhanceWithin();

					img.replaceWith(svg);

					// if the svg is loaded and replaced, we try to draw if it is a widget
					var img_id = img.attr('id');
					if (typeof img_id !== 'undefined') {
						$('#' + img_id.substr(0, img_id.lastIndexOf('-'))).trigger('draw');
					}
				});

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
			$(obj).find('g').append(line);
			val = val - 6;
		}
	},

	/**
	 * Draws a volume bar made of lines
	 */
	bar: function (obj, val, start, end) {
		var line;

		this.remove(obj);

		var stepx = 6;
		var stepy = 3;
		var iy = 0;
		var ix = 0;

		while (ix < val) {
			line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			line.setAttributeNS(null, 'x1', (start[0] + ix));
			line.setAttributeNS(null, 'y1', start[1]);
			line.setAttributeNS(null, 'x2', (start[0] + ix));
			line.setAttributeNS(null, 'y2', (start[1] - iy));
			$(obj).find('g').append(line);
			ix = ix + stepx;
			iy = iy + stepy;
		}
	},

	/**
	 * Removes all the elements from the svg
	 */
	remove: function (obj, element) {

		if (!element) {
			element = 'line';
		}

		$(obj).find('g').children().each(function (index) {
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

		return [ r, g, b ];
	},

	/**
	 * Converts a hsv value to rgb value
	 * Adapted from: https://gist.github.com/mjackson/5311256
	 */
	rgb2hsv: function (r, g, b) {
		r /= 255, g /= 255, b /= 255;

		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, v = max;

		var d = max - min;
		s = max == 0 ? 0 : d / max;

		if (max == min) {
			h = 0; // achromatic
		} else {
			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}

			h /= 6;
		}

		h = Math.round(h * 360);
		s = Math.round(s * 100);
		v = Math.round(v * 100);

		return [ h, s, v ];
	},

	/**
	 * Converts a hsl value to rgb value
	 * Adapted from: https://gist.github.com/mjackson/5311256
	 */
	hsl2rgb: function (h, s, l) {
		var r, g, b;

		// test range
		h = Math.max(0, Math.min(360, h));
		s = Math.max(0, Math.min(100, s));
		l = Math.max(0, Math.min(100, l));

		h /= 360;
		s /= 100;
		l /= 100;

		if (s == 0) {
			r = g = b = l; // achromatic
		} else {
			function hue2rgb(p, q, t) {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1/6) return p + (q - p) * 6 * t;
				if (t < 1/2) return q;
				if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}

			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;

			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}

		r = Math.round(r * 255);
		g = Math.round(g * 255);
		b = Math.round(b * 255);

		return [ r, g, b ];
	},

	/**
	 * Converts a rgb value to hsl value
	 * Adapted from: https://gist.github.com/mjackson/5311256
	 */
	rgb2hsl: function (r, g, b) {
		r /= 255, g /= 255, b /= 255;

		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if (max == min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}

			h /= 6;
		}

		h = Math.round(h * 360);
		s = Math.round(s * 100);
		l = Math.round(l * 100);

		return [ h, s, l ];
	},

	hsv2hsl: function (h, s, v) {
		s = Math.max(0, Math.min(100, s));
		v = Math.max(0, Math.min(100, v));
		s /= 100;
		v /= 100;

		var l = v-v*s/2;
		var so = s*v/(1-Math.abs(2*l-1));

		so = Math.round(so * 100);
		l = Math.round(l * 100);

		return [ h, so, l ];
	},

	hsl2hsv: function (h, s, l) {
		s = Math.max(0, Math.min(100, s));
		l = Math.max(0, Math.min(100, l));
		s /= 100;
		l /= 100;

		var v = l+s*(1-Math.abs(2*l-1))/2;
		var so = 2-2*l/v;


		so = Math.round(so * 100);
		v = Math.round(v * 100);

		return [ h, so, v ];
	}
};


/**
 * Class for displaying notifications and notes
 */
var notify = {

	// incremental message id
	i: 0,

	// a list with all values, all communication it through the buffer
	messagesIndexed: {},
	messagesPerLevel: { error: [], warning: [], info: [], debug: [], update: [] },

	/**
	 * Checks if there are any messages
	 */
	exists: function (id) {
		if(id !== undefined) {
			return Object.prototype.hasOwnProperty.call(notify.messagesIndexed, id);
		}
		else { // check if any exists
			for (var prop in notify.messages) {
				if (Object.prototype.hasOwnProperty.call(notify.messagesIndexed, prop)) {
					return true;
				}
			}
			return false;
		}
	},

	/**
	 * Add a new message
	 */
	add: function (level, signal, title, text, ackitem, ackval) {
		if (text.toLowerCase().trim().substr(-16 ) == 'operation failed')
			text += '<br><br><u>Notice:</u><br>The message "operation failed" is thrown if a connect fails before the request can be executed. ' 
				+'Very often, this is due to failed ssl communication. Try calling the service directly in debug mode for more information.<br><br>'
				+'<u>Example:</u><br> YourIP/YourSmartvisuDir/lib/weather/service/YourService.php?debug=1';   
		var message = {level: level, signal: signal, title: title, text: text, time: Date.now(), id: ++notify.i, ackitem: ackitem, ackval: ackval}
		notify.messagesIndexed[message.id] = message;
		notify.messagesPerLevel[level].push(message);

		// log to console
		console.log('[notify.' + level + '] ' + 'id = '+ message.id +': ' + title + ' - ' + text);

		// return id
		return message.id;
	},

	/**
	 * Add a new notification message
	 */
	message:function (level, title, text) {
		var id = notify.add(level, sv_lang.status_event_format[level].signal, title, text);
		notify.display();
		return id;
	},

	/**
	 * Add a new info-message - deprecated: use notify.message("info",...) instead
	 */
	info: function (title, text) {
		var id = notify.add('info', sv_lang.status_event_format.info.signal, title, text);
		notify.display();
		return id;
	},

	/**
	 * Add a new warn-message - deprecated: use notify.message("warning",...) instead
	 */
	warning: function (title, text) {
		var id = notify.add('warning', sv_lang.status_event_format.warning.signal, title, text);
		notify.display();
		return id;
	},

	/**
	 * Add a new error-message - deprecated: use notify.message("error",...) instead
	 */
	error: function (title, text) {
		var id = notify.add('error', sv_lang.status_event_format.error.signal, title, text);
		notify.display();
		return id;
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
		//console.log ('Ajax request failed with status: "'+status+'" and message: "'+errorthrown+'" in smartVISU process "'+jqXHR.svProcess+'".');
		//console.log (jqXHR);
		
		var message=[];
		if (jqXHR.responseJSON != undefined){
			if (jqXHR.responseJSON instanceof Array && jqXHR.responseJSON[0].title != null)		//response from smartVISU services 
				message = jqXHR.responseJSON[0]; 
			else if (jqXHR.responseJSON.title != null)											//response e.g. from smartVISU drivers 
				message = jqXHR.responseJSON;
		}
		if (message.length < 1) {																// other ajax responses
			var errortitles = ['timeout', 'error', 'abort', 'parsererror', 'servererror'];
			message.title = (errortitles.includes(status) ? sv_lang.status_event_format.error[status] : sv_lang.status_event_format.error.na);
			if (jqXHR.svProcess != undefined)
				message.title += ' in '+jqXHR.svProcess;
			message.text = (jqXHR.status != 0 ? 'HTTP ' + jqXHR.status + ' - ' : '') + (errortitles.includes(jqXHR.statusText) ? sv_lang.status_event_format.error[jqXHR.statusText] : jqXHR.statusText);
			if (jqXHR.responseText != undefined)
				message.text += jqXHR.responseText;
		}

		var id = notify.add('error', sv_lang.status_event_format.error.signal, message.title, message.text);
		
		notify.display();
		return id;
	},

	/**
	 * Removes a note, or all if no id is given
	 */
	remove: function (id, opennext) {

		if (id !== undefined) {
			var message = notify.messagesIndexed[id];
			if (message != undefined) {
				delete notify.messagesIndexed[id];
				messagesInCurrentLevel = notify.messagesPerLevel[message.level];
				for(var i = 0; i < messagesInCurrentLevel.length; i++) {
					if(messagesInCurrentLevel[i].id == id) {
						messagesInCurrentLevel.splice(i, 1);
						break;
					}
				}

				if(message.ackitem)
					io.write(message.ackitem, message.ackval);
			}
		}
		else {
			notify.messagesIndexed = {};
			notify.messagesPerLevel = { error: [], warning: [], info: [], debug: [], update: [] };
		}

		notify.display(opennext);

	},

	/**
	 * Displays the message at the top right corner
	 */
	display: function (openpopup) {

		// find next message with priority according to level order in messagesPerLevel
		var message;
		if(Object.keys(notify.messagesIndexed).length > 0) {
			for(var level in notify.messagesPerLevel) {
				if(message = notify.messagesPerLevel[level][0])
					break;
			}
		}

		if (message) {
			$('.signal').removeClass(Object.keys(notify.messagesPerLevel).join(" ")).addClass(message.level).html(message.signal).show();
			$('.alert h1').html(message.title);
			$('.alert p').html(message.text);
			$('.alert .stamp').html(new Date(message.time).transShort());
			$('.alert').data('message-id', message.id);
			if(openpopup)
				$('.alert').popup('open');
		}
		else {
			$('.signal').removeClass(Object.keys(notify.messagesPerLevel).join(" ")).hide();
			$('.alert').data('message-id', null).filter(':data("mobile-popup")').popup('close');
		}
	}
};

// create signal corner and global popup
$(document).on('pagecreate', function (event, ui) {
	if(!$('#alert-popup').length)
		$('<div class="alert" id="alert-popup" data-theme="a" data-overlay-theme="a"> <div data-role="header" data-theme="c"><h1 style="white-space: normal;"></h1></div> <p></p> </div>')
			.append(
				$('<div class="control"><span class="stamp"></span> </div>')
				.append($('<a class="ui-btn ui-btn-a ui-btn-inline ui-mini ui-icon-check ui-btn-icon-top ui-corner-all ui-shadow">OK</a>').on('click', function() { notify.remove($('#alert-popup').data('message-id'), true); }))
				.append($('<a class="ui-btn ui-btn-a ui-btn-inline ui-mini ui-icon-delete ui-btn-icon-top ui-corner-all ui-shadow">Cancel</a>').on('click', function() { $('#alert-popup').popup('close'); }))
			)
			.prependTo('body')
			.enhanceWithin()
			.popup()

	$(event.target).remove('.signal');
	$('<div class="signal hide">').prependTo($(event.target)).on('click', function() { $('#alert-popup').popup('open'); });
});


/**
 * Class for repeating widgets
 * DEPRECATED. Not used for jQuery Mobile based Widgets
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
		// init every repeater only once
		$('[data-repeat]:not([data-repeat-milliseconds])').each(function (idx) {
			$(this).attr('data-repeat-milliseconds', Number(new Date().duration($(this).attr('data-repeat'))));
			repeater.tick(this);
		});
	},

	/**
	 * Starts the ticking-loop
	 */
	tick: function (element) {

		$(element).trigger('repeat');

		var now = new Date();
		var delay = Number($(element).attr('data-repeat-milliseconds'));

		if (delay >= 60 * 1000) {
			delay = (delay - now.getSeconds() * 1000);
		}
		if (delay >= 60 * 60 * 1000) {
			delay = (delay - now.getMinutes() * 60 * 1000);
		}
		if (delay >= 24 * 60 * 60 * 1000) {
			delay = (delay - now.getHours() * 60 * 60 * 1000);
		}

		setTimeout(function() {
			repeater.tick(element);
		}, delay);
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

		console.log("[repeater] --> " + count + " widgets");
	}

};


/**
 * Class for controlling all widgets.
 *
 * Concept:
 * --------
 * Every item has a name. The value of the item may be of type int, float, or
 * array. The items are stored in the array "widget.buffer". The drivers fill 
 * the buffer through "widget.update" (and therefore widget.set). All widgets 
 * on a page may be updated asynchronously. This is triggerd by widget.update
 * as soon as an item change is received via the driver. Updates are only made 
 * if all items needed are available in the buffer. If one is missing the update 
 * is skipped. If plots are placed on the page, the update will check whether it
 * is possible to add only new points (if the widget is already initialized).
 *
 * Events:
 * -------
 * Some new events are introduced to control the widgets and their visual
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
 * 'exit': function() 
 * Triggered when page is being left in order to stop certain activities of the
 * widgets (e.g. delete timers)  
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
		
		// More than one item?
		if (text.indexOf(',') >= 0) {
			var parts = text.explode();

			for (var i = 0; i < parts.length; i++) {
				if(!ret.includes(parts[i]) && parts[i] != '' )	ret.push(parts[i]);	
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

		// case: multiple values
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
		var ret;

		// case: more items
		if (items instanceof Array) {
			ret = Array();

			for (var i = 0; i < items.length; i++) {
				if(widget.checkseries(items[i]) && widget.buffer[items[i]] != null)
					ret.push(Object.values(widget.buffer[items[i]]).sort(function(a,b){return a[0]-b[0]}));
				else
					ret.push(widget.buffer[items[i]]);
			}
		}
		// case: one item
		else {
			if(widget.checkseries(items) && widget.buffer[items] != null)
				ret = Object.values(widget.buffer[items]).sort(function(a,b){return a[0]- b[0]});
			else
				ret = widget.buffer[items];
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
		if(widget.checkseries(item)) {
			if(widget.buffer[item] === undefined)
				widget.buffer[item] = {};
			var b = widget.buffer[item];
			var definition = widget.parseseries(item);
			var minstart = new Date() - new Date().duration(definition.start);
			var maxend = new Date() - new Date().duration(definition.end);
			// add values
			$.each(value, function(idx, val) {
				b[val[0]] = val;
			});
			// remove values which are not in desired time window
			var lastbeforekey = null;
			for(key in b) {
				if(key < minstart) {
					// last value before time window should be preserved
					if(lastbeforekey < key) {
						delete b[lastbeforekey];
						lastbeforekey = key;
					}
					else
						delete b[key]
				}
				//if(key > maxend)
				//	delete b[key];
			}
		}
		else if (value !== undefined) {
			widget.buffer[item] = ( $.isNumeric(value) ? value * 1.0 : value);
		}

		// DEBUG: console.log("[widget] '" + item, widget.buffer[item]);
	},

	/**
	 * Update an item and all widgets listening on that. Write the value
	 * to the buffer and call the widgets update methods if all values are set.
	 *
	 * @param    item   the item
	 * @param    value  the value
	 */
	update: function (item, value) {

		// update if value has changed or is omitted
		if (value === undefined || widget.buffer[item] === undefined || widget.buffer[item] !== value && !(widget.buffer[item] instanceof Array && widget.buffer[item].equals(value))) {

			widget.set(item, value);
			
			$(":mobile-pagecontainer").pagecontainer( "getActivePage" ).find('[data-item*="' + item + '"]').filter(':data("sv-widget")').widget('update', widget.get(item), item) // new jQuery Mobile style widgets
			
		}
	},


	/**
	 * Refreshes all widgets on the current page. Used to put the values to the
	 * widgets if a new page has been opened. Bind to jquery mobile 'pageshow'.
	 */
	refresh: function () {
		$(":mobile-pagecontainer").pagecontainer( "getActivePage" ).find('[data-item]').filter(':data("sv-widget")').widget('update') // new jQuery Mobile style widgets

		//TODO: call io.run here instead of this in io.run and io.run in root.html
		// config_driver_realtime needs to be evaluated

	},


	/**
	 * Get data from url 
	 * Called in widgets repeat events, e.g. calendar.
	 */
	getUrlData: function (jqWidgets) {
		$.each(widget.urls(jqWidgets), function(idx, url) {
			$.ajax({
				url: url.substr(4), 
				beforeSend: function(jqXHR, settings) { jqXHR.svProcess = 'Get URL Data'; },
				success: function (data) {
					widget.update(url, data);
				}
			})
			.fail(notify.json);
		});
	},

	/**
	 * Is the item a series?
	 */
	checkseries: function (item) {
		var pt = item.split('.');
		var aggregate = pt[pt.length - 4];
		if(aggregate != undefined && aggregate.length >= 5 && aggregate.substr(0,5) == 'diff:')
			aggregate = aggregate.substr(5);
		if(aggregate != undefined && aggregate.length > 5 && aggregate.substr(0,5) == 'count')
			aggregate = aggregate.substr(0,5);
		return ($.inArray(aggregate, Array('avg', 'min', 'max', 'sum', 'diff', 'rate', 'on', 'raw', 'count')) >= 0);
	},

	/**
	 * Splits a series item in its parts, e.g. "foo.bar.max.24h.now.100" to {item: "foo.bar", aggregate: "max", start: "24h", end: "now", count: "100"}
	 */
	parseseries: function (item) {
		if (widget.checkseries(item)) {
			var pt = item.split('.');
			return {'item': pt.slice(0, pt.length - 4).join('.'), 'mode': pt[pt.length - 4], 'start': pt[pt.length - 3], 'end': pt[pt.length - 2], 'count': pt[pt.length - 1]}
		}
		else
			return null;
	},

	// ----- l i s t e n e r s ------------------------------------------------

	/**
	 * Returns all unique items from all widgets except plots, logs and url data sources.
	 *
	 * @return    array  unique list of the items
	 */
	listeners: function () {
		var unique = {};

		$(":mobile-pagecontainer").pagecontainer( "getActivePage" ).find('[data-item]').each(function (idx) {
			if (!($(this).attr('data-widget') == 'status.log')) {
				var items = widget.explode($(this).attr('data-item'));
				for (var i = 0; i < items.length; i++) {
					if (!widget.checkseries(items[i]) && items[i].substr(0,4) != 'url:') {
						unique[items[i]] = '';
					}
				}
			}
		});

		return Object.keys(unique);
	},

	/**
	 * Returns all url data sources, optionally filtered by items
	 *
	 * @return    array  unique list of urls
	 */
	urls: function (jqWidgets) {
		var unique = {};

		if(jqWidgets == null)
			jqWidgets = $(":mobile-pagecontainer").pagecontainer( "getActivePage" ).find('[data-item*="url:"]');

		jqWidgets.each(function (idx) {
			var items = widget.explode($(this).attr('data-item'));
			for (var i = 0; i < items.length; i++) {
				if (items[i].substr(0,4) == 'url:') {
					unique[items[i]] = '';
				}
			}
		});

		return Object.keys(unique);
	},

	/**
	 * Returns all unique series items.
	 *
	 * @param    item  item: matches all plot-widgets with that item
	 * @return   array  unique list of the items
	 */
	series: function (item) {
		var unique = {};

		$(":mobile-pagecontainer").pagecontainer( "getActivePage" ).find('[data-widget^="plot."][data-item'+(item ? '*="' + item + '"' : '')+']').each(function (idx) {
			var items = widget.explode($(this).attr('data-item'));
			$.each(items, function(idx, currentItem) {
				if ((!item || currentItem == item) && widget.checkseries(currentItem)) {
					unique[currentItem] = widget.parseseries(currentItem);
				}
			});
		})

		return Object.values(unique);
	},

	/**
	 * Returns all unique log items with count.
	 *
	 * @param    item  item: matches only that item
	 * @return   array  unique list of objects containing item and count
	 */
	logs: function (item) {
		var unique = {};

		$(":mobile-pagecontainer").pagecontainer( "getActivePage" ).find('[data-widget="status.log"][data-item'+(item ? '*="' + item + '"' : '')+']').each(function (idx) {
			var jqNodes = $(this);
			var items = widget.explode(jqNodes.attr('data-item'));
			var count = jqNodes.attr('data-count');
			$.each(items, function(idx, currentItem) {
				if (!item || currentItem == item) {
					if(unique[currentItem] && unique[currentItem].count > count) // get the highest occurring count of that item
						count = unique[currentItem].count;
					unique[currentItem] = {"item": currentItem, "count": count};
				}
			});
		})

		return Object.values(unique);
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
			$(":mobile-pagecontainer").pagecontainer( "getActivePage" ).find('[data-widget^="plot."][data-item*="' + item + '"]').each(function (idx) {
				var items = widget.explode($(this).attr('data-item'));
				for (var i = 0; i < items.length; i++) {
					if (items[i] == item) {
						ret = ret.add(this);
					}
				}
			})
		}
		else {
			ret = $(":mobile-pagecontainer").pagecontainer( "getActivePage" ).find('[data-widget^="plot."][data-item]');
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
			$(":mobile-pagecontainer").pagecontainer( "getActivePage" ).find('[data-widget="status.log"][data-item="' + item + '"]').each(function (idx) {
				var items = widget.explode($(this).attr('data-item'));
				for (var i = 0; i < items.length; i++) {
					if (items[i] == item) {
						ret = ret.add(this);
					}
				}
			})
		}
		else {
			ret = $(":mobile-pagecontainer").pagecontainer( "getActivePage" ).find('[data-widget="status.log"][data-item]');
		}

		return ret;
	},

};


/**
 * -----------------------------------------------------------------------------
 * G L O B A L   E V E N T   H A N D L E R S
 * -----------------------------------------------------------------------------
 */
 
/**
 * Append pages parameter to async page loads if one is passed in url
 */
$(document).on("pagecontainerbeforeload", function(event, data) {
	var regExPagesParam = /[?&](pages=.+?)(&|$)/;
	var locationPages = (regExPagesParam.exec(location.search)||[,""])[1];
	var loadPages = (regExPagesParam.exec(data.url)||[,""])[1];
	if(locationPages != "" && loadPages == "") {
		event.preventDefault();
		data.deferred.reject(data.absUrl, data.options);
		$.mobile.pageContainer.pagecontainer("change", data.url + (data.url.indexOf("?") == -1 ? "?" : "&") + locationPages);
	}
});

/** 
 * stop series subscriptions and trigger 'exit' method in all widgets on current page
 * before new page is being loaded. Trigger only if page is different (not just a return to same page)
 */
 $(document).on('pagecontainerbeforetransition', function(event,ui) {
	if (ui.prevPage!= undefined && ui.toPage[0].id != ui.prevPage[0].id) { 
		io.stopseries ();
		$(":mobile-pagecontainer").pagecontainer( "getActivePage" ).find('[data-widget]').filter(':data("sv-widget")').widget('exit');
	}
});

/** 
* modify links on pages with special ressources loaded (config, templatechecker, widget_assistant)
* in order to force a reload when the page is being left and thus remove the special ressources from the DOM
*/
$(document).on('pagecontainerchange', function(event, ui) {
	$(":mobile-pagecontainer").pagecontainer( "getActivePage" ).filter('#config, #templatechecker, #widget_assistant')
		.find('[href^="index.php"]').attr('data-ajax', false) 		// modify all internal links to block ajax navigation
		.end().each(function(){										// block browser back / foreward buttons
			var currentURL = $(this).context.baseURI;
			$(document).on("pagecontainerbeforechange", function (e, data) {
				if (typeof data.toPage == "string" && data.prevPage != undefined  && data.options.role != "popup" && data.options.role != "dialog" && data.options.direction != "back") {  
					data.toPage = currentURL;
					history.pushState(null,'',currentURL);
					console.log(currentURL + ': clear history in order to block the back / forward buttons');
					}
			});
		});
});

/**
 * Workaround of a bug in jQuery Mobile 1.4.5 tabs (see https://github.com/jquery/jquery-mobile/issues/7169)
 */
$.widget( "ui.tabs", $.ui.tabs, {

	_createWidget: function( options, element ) {
		var page, delayedCreate,
			that = this;

		if ( $.mobile.page ) {
			page = $( element )
				.parents( ":jqmData(role='page'),:mobile-page" )
				.first();

			if ( page.length > 0 && !page.hasClass( "ui-page-active" ) ) {
				delayedCreate = this._super;
				page.one( "pagebeforeshow", function() {
					delayedCreate.call( that, options, element );
				});
			}
		} else {
			return this._super();
		}
	}
});

/**
 * -----------------------------------------------------------------------------
 * P R O T O T Y P E   F O R   S V . W I D G E T S
 * -----------------------------------------------------------------------------
 */
$.widget("sv.widget", {
	options: {
		id: null,
		widget: null,
		item: "",
		repeat: null
	},

	_create: function() {
		this.items = widget.explode(this.options.item);

		this.element.data('sv-widget', this);

		if(this._events)
			this._on(this._events);
	},

	_init: function() {
		this._super();
		if(this.options.repeat) {
			this._repeat_milliseconds = Number(new Date().duration(this.options.repeat));
			this.repeat();
		}
	},
/*
	_setOption: function ( key, value ) {
		this._super( "_setOption", key, String(value) );
	},
*/

	/**
	* TODO: check if partial update is still needed here. With smarthome.py the complete series is transferred
	*/
	
	update: function(values, item) {
		if(this.allowPartialUpdate && item != null) {
			if (values !== undefined) {
				var partialValues = new Array(this.items.length);
				partialValues[this.items.indexOf(item)] = values;
				this._update(partialValues);
			}
		}
		else {
			if(values === undefined || item != null) {
				values = widget.get(this.items);
			}
			if (widget.check(values)) {
				this._update(values);
			}
		}
	},

	repeat: function() {
		this._repeat();

		var now = new Date();
		var delay = this._repeat_milliseconds;

		if (delay >= 60 * 1000) {
			delay = (delay - now.getSeconds() * 1000);
		}
		if (delay >= 60 * 60 * 1000) {
			delay = (delay - now.getMinutes() * 60 * 1000);
		}
		if (delay >= 24 * 60 * 60 * 1000) {
			delay = (delay - now.getHours() * 60 * 60 * 1000);
		}

		this._delay(this.repeat, delay);
	},

	_write: function(value, itemindex) {
		io.write(this.items[itemindex || 0], value);
	},

	_update: $.noop,
	
/**
 * Check if exit function exists in the widget and run it
 */
	exit: function(){
		if (this._exit) this._exit();
	}

});
