/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


/**
 * Class for controlling all communication with a connected system. There are
 * simple I/O functions, and complex functions for real-time values.
 */
var io = {

	// the adress
	adress: '',

	// the port
	port: '',


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

	/**
	 * This driver version
	 */
	version: 3,

	/**
	 * This driver uses a websocket
	 */
	socket: false,

	/**
	 * Opens the connection and add some handlers
	 */
	open: function () {
		io.socket = new WebSocket('ws://' + io.address + ':' + io.port + '/');

		io.socket.onopen = function () {
			io.send({'cmd': 'proto', 'ver': io.version});
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
					data.sid = data.sid.substr(0, data.sid.length - 3) + '0';
					widget.update(data.sid.replace(/\|/g, '\.'), data.series);
					break;

				case 'dialog':
					notify.info(data.header, data.content);
					break;

				case 'log':
					var log;
					if (data.init) {
						log = data.log;
					}
					else {
						// shift first element and add the new one at last
						var log = widget.get(data.name);
					
						for (var i = 0; i < data.log.length; i++) {
							log.unshift(data.log[i]);
						
							if (log.length >= 50)
								log.pop();
						}
					}
					widget.update(data.name, log);
					break;

				case 'proto':
					var proto = parseInt(data.ver);
					if (proto != io.version) {
						notify.info('Driver: smarthome.py', 'Protocol mismatch<br />driver is: v' + io.version + '<br />smarthome.py is: v' + proto);
					}
					break;
			}
		};

		io.socket.onerror = function (error) {
			notify.error('Driver: smarthome.py', 'Could not connect to smarthome.py server!<br /> Websocket error ' + error.data + '.');
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
		if (widget.listening()) {
			io.send({'cmd': 'monitor', 'items': widget.listeners()});

			// series: avg, min, max, sum, diff, rate
			widget.plot().each(function (idx) {
				var items = widget.explode($(this).attr('data-item'));
				for (var i = 0; i < items.length; i++) {

					if (widget.is_series(items[i]) && !widget.get(items[i])) {
						var pt = items[i].split('.');
						var item = items[i].substr(0, items[i].length - 3 - pt[pt.length - 3].length - pt[pt.length - 2].length - pt[pt.length - 1].length);
						io.send({'cmd': 'series', 'item': item, 'series': pt[pt.length - 3], 'start': pt[pt.length - 2]});
					}
				}
			});
			
			widget.log().each(function (idx) {
				io.send({'cmd': 'log', 'name': $(this).attr('data-item'), 'max': $(this).attr('data-count')});
			});
		}
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
	}

}
