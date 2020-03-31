/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiss, Martin Sinn
 * @copyright   2012 - 2016
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @label       SmartHomeNG
 *
 * @default     driver_autoreconnect   true
 * @default     driver_port            2424
 * @hide        driver_realtime
 */


/**
 * Class for controlling all communication with a connected system. There are
 * simple I/O functions, and complex functions for real-time values.
 */
var io = {

	// the address
	address: '',

	// the port
	port: '',

	uzsu_type: '0',

	// -----------------------------------------------------------------------------
	// P U B L I C   F U N C T I O N S
	// -----------------------------------------------------------------------------

	/**
	 * Does a read-request and adds the result to the buffer
	 *
	 * @param      the item
	 */
	read: function (item) {
	},

	/**
	 * Does a write-request with a value
	 *
	 * @param      the item
	 * @param      the value
	 */
	write: function (item, val) {
		io.send({'cmd': 'item', 'id': item, 'val': val});
		widget.update(item, val);
	},

	/**
	 * Trigger a logic
	 *
	 * @param      the logic
	 * @param      the value
	 */
	trigger: function (name, val) {
		io.send({'cmd': 'logic', 'name': name, 'val': val});
	},

	/**
	 * Initializion of the driver
	 *
	 * @param      the ip or url to the system (optional)
	 * @param      the port on which the connection should be made (optional)
	 */
	init: function (address, port) {
		io.address = address;
		io.port = port;
		io.open();
	},

	/**
	 * Lets the driver work
	 */
	run: function (realtime) {
		// old items
		widget.refresh();

		// new items
		io.monitor();
	},


	// -----------------------------------------------------------------------------
	// C O M M U N I C A T I O N   F U N C T I O N S
	// -----------------------------------------------------------------------------
	// The functions in this paragraph may be changed. They are all private and are
	// only be called from the public functions above. You may add or delete some
	// to fit your requirements and your connected system.

	// New in
	// v4: count - Patch
	
	/**
	 * This is the protocol version
	 */
	version: 4,

	/**
	 * This driver uses a websocket
	 */
	socket: false,

	/**
	 * Opens the connection and add some handlers
	 */
	open: function () {
		var protocol = '';
		if (!io.address || io.address.indexOf('://') < 0) {
			// adopt websocket security to current protocol (https -> wss and http -> ws)
			// if the protocol should be forced, add it to the address
			protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
			if (!io.address) {
				// use url of current page if not defined
				io.address = location.hostname;
			}
			if (!io.port) {
				// use port of current page if not defined and needed
				if (location.port != '') {
					io.port = location.port;
				} else {
					if (location.protocol == 'http:') io.port = '80';
					if (location.protocol == 'https:') io.port = '443';
				}
			}
		}
		io.socket = new WebSocket(protocol + io.address + ':' + io.port);

		io.socket.onopen = function () {
			// remove socket error notification on reconnect
			if(io.socketErrorNotification != null)
				notify.remove(io.socketErrorNotification);

			io.send({'cmd': 'proto', 'ver': io.version});
			var browser = io.getBrowser();
			io.send({'cmd': 'identity', 'sw': 'smartVISU', 'ver': 'v'+sv.config.version, 'browser': browser.name, 'bver': browser.version});
			io.monitor();
		};

		io.socket.onmessage = function (event) {
			var item, val;
			var data = JSON.parse(event.data);
			// DEBUG:
			console.log("[io.smarthome.py] receiving data: ", event.data);

			switch (data.cmd) {
				case 'item':
					for (var i = 0; i < data.items.length; i++) {
						item = data.items[i][0];
						val = data.items[i][1];
						/* not supported:
						 if (data.items[i].length > 2) {
						 data.p[i][2] options for visu
						 };
						 */

						// convert binary
						if (val === false) {
							val = 0;
						}
						if (val === true) {
							val = 1;
						}
						widget.update(item, val);
					}
					break;

				case 'series':
					if (io.version <= 3)
						data.sid = data.sid + '.100';
					
					widget.update(data.sid.replace(/\|/g, '\.'), data.series);
					break;

				case 'dialog':
					notify.info(data.header, data.content);
					break;

				case 'log':
					if (data.init) {
						widget.update(data.name, data.log);
					}
					else {
						var log = widget.get(data.name); // only a reference

						for (var i = 0; i < data.log.length; i++) {
							log.unshift(data.log[i]);

							if (log.length >= 50) {
								log.pop();
							}
						}

						widget.update(data.name);
					}
					break;

				case 'proto':
					io.version = parseInt(data.ver);
					if (io.version < 3) {
						notify.warning('Driver: smarthome.py', 'Protocol mismatch<br />SmartHome.py is: v' + io.version + '<br /><br /> Update the system!');
					}
					break;

				case 'url':
					$.mobile.changePage(data.url);
					break;					
			}
		};

		io.socket.onerror = function (error) {
			if(io.socketErrorNotification == null || !notify.exists(io.socketErrorNotification))
				io.socketErrorNotification = notify.error('Driver: smarthome.py', 'Could not connect to smarthome.py server!<br /> Websocket error ' + error.data + '.');
		};

		io.socket.onclose = function () {
			notify.debug('Driver: smarthome.py', 'Connection closed to smarthome.py server!');
		};
	},

	/**
	 * Sends data to the connected system
	 */
	send: function (data) {
		if (io.socket.readyState == 1) {
			io.socket.send(unescape(encodeURIComponent(JSON.stringify(data))));
			// DEBUG: 
			console.log('[io.smarthome.py] sending data: ', JSON.stringify(data));
		}
	},

	/**
	 * Monitors the items
	 */
	monitor: function () {
		if (widget.listeners().length) {
			// items
			io.send({'cmd': 'monitor', 'items': widget.listeners()});
		}

		// plot (avg, min, max, on)
		var unique = Array();
		widget.plot().each(function (idx) {
			var items = widget.explode($(this).attr('data-item'));
			for (var i = 0; i < items.length; i++) {

				var pt = items[i].split('.');

				if (!unique[items[i]] && (pt instanceof Array) && widget.checkseries(items[i])) {
					var item = items[i].substr(0, items[i].length - 4 - pt[pt.length - 4].length - pt[pt.length - 3].length - pt[pt.length - 2].length - pt[pt.length - 1].length);

					if (io.version <= 3)
						io.send({'cmd': 'series', 'item': item, 'series': pt[pt.length - 4], 'start': pt[pt.length - 3], 'end': pt[pt.length - 2]});
					else
						io.send({'cmd': 'series', 'item': item, 'series': pt[pt.length - 4], 'start': pt[pt.length - 3], 'end': pt[pt.length - 2], 'count': pt[pt.length - 1]});
					
					unique[items[i]] = 1;
				}
			}
		});

		// log
		widget.log().each(function (idx) {
			io.send({'cmd': 'log', 'name': $(this).attr('data-item'), 'max': $(this).attr('data-count')});
		});
	},

	/**
	 * Closes the connection
	 */
	close: function () {
		console.log("[io.smarthome.py] close connection");

		if (io.socket.readyState > 0) {
			io.socket.close();
		}

		io.socket = null;
	},

	getBrowser: function () {
		var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		if(/trident/i.test(M[1])) {
			tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
			return {name:'IE',version:(tem[1]||'')};
		}
		if(M[1]==='Chrome') {
			tem=ua.match(/\bOPR\/(\d+)/)
			if(tem!=null) { return {name:'Opera', version:tem[1]}; }
		}
		M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
		if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
		return {
			name: M[0],
			version: M[1]
		};
	}

};
