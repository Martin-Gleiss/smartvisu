/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @default     driver_port            2121
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

	// -----------------------------------------------------------------------------
	// P U B L I C   F U N C T I O N S
	// -----------------------------------------------------------------------------

	/**
	 * Does a read-request and adds the result to the buffer
	 *
	 * @param      item
	 */
	read: function (item) {
	},

	/**
	 * Does a write-request with a value
	 *
	 * @param      item
	 * @param      value
	 */
	write: function (item, val) {
		io.send({'cmd': 'item', 'id': item, 'val': val});
		widget.update(item, val);
	},

	/**
	 * Trigger an event or action
	 *
	 * @param      type: event, action
	 * @param      id
	 */
	trigger: function (type, id) {
		io.send({'cmd': 'trigger', 'type': type, 'id': id});
	},

	/**
	 * Initialization of the driver
	 *
	 * @param      the ip or url of the system (optional)
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
		if (io.socket.readyState > 1) {
			io.open();
		}
		else {
			// old items
			widget.refresh();

			// new items
			io.monitor();
		}
	},


	// -----------------------------------------------------------------------------
	// C O M M U N I C A T I O N   F U N C T I O N S
	// -----------------------------------------------------------------------------
	// The functions in this paragraph may be changed. They are all private and are
	// only be called from the public functions above. You may add or delete some
	// to fit your requirements and your connected system.

	/**
	 * The driver version
	 */
	version: '0.4',

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
			// remove socket error notification on reconnect
			if(io.socketErrorNotification != null)
				notify.remove(io.socketErrorNotification);

			io.send({'cmd': 'proto', 'ver': io.version});
			io.monitor();
		};
		io.socket.onmessage = function (event) {
			var item, val;
			var data = JSON.parse(event.data);
			// console.log("[io.domotiga] receiving data: " + event.data);
			switch (data.cmd) {
				case 'item': // item
					for (var i = 0; i < data.items.length; i = i + 2) {
						item = data.items[i];
						val = data.items[i + 1];
						// console.log("[io.domotiga]: update item: " + item + " val: " + val);
						widget.update(item, val);
					};
					break;

				case 'series':
					// console.log("[io.domotiga]: series id: " + data.items.id);
					// console.log("[io.domotiga]: series data: " + data.items.plotdata);
					widget.update(data.items.id, data.items.plotdata);
					break;

				case 'dialog':
					notify.info(data.header, data.content);
					break;

				case 'log':
				//	if (data.init) {
				//		widget.update(data.name, data.log);
				//	}
				//	else {
						var log = widget.get(data.name); // only a reference

						for (var i = 0; i < data.log.length; i++) {
							log.unshift(data.log[i]);

							if (log.length >= 50) {
								log.pop();
							}
						}
						widget.update(data.name);
			//		}
					break;

				case 'proto':
					var proto = data.ver;
					if (proto != io.version) {
						notify.info('Driver: DomotiGa', 'Protocol version mismatch<br />Driver is at version v' + io.version + '<br />DomotiGa is at version v' + proto);
					}
					break;
			}
		};
		io.socket.onerror = function (error) {
			if(io.socketErrorNotification == null || !notify.exists(io.socketErrorNotification))
				io.socketErrorNotification = notify.error('Driver: DomotiGa', 'Could not connect to the DomotiGa server!<bre >?Websocket error: ' + error.data + '.');
		};
		io.socket.onclose = function () {
			notify.error('Driver: DomotiGa', 'No connection with the DomotiGa server!');
		};
	},

	/**
	 * Send JSON data to the server
	 */
	send: function (data) {
		if (io.socket.readyState == 1) {
			io.socket.send(unescape(encodeURIComponent(JSON.stringify(data))));
			// console.log('[io.domotiga] sending data: ' + JSON.stringify(data));
		}
	},

	/**
	 * Monitor items
	 */
	monitor: function () {
		if (widget.listeners().length) {
			// items
			io.send({'cmd': 'monitor', 'items': widget.listeners()});
		}

		// series/plot (avg, min, max, sum)
		var unique = Array();
		widget.plot().each(function (idx) {
			var items = widget.explode($(this).attr('data-item'));
			for (var i = 0; i < items.length; i++) {

				var pt = items[i].split('.');

				if (!unique[items[i]] && !widget.get(items[i]) && (pt instanceof Array) && widget.checkseries(items[i])) {
					var item = items[i].substr(0, items[i].length - 4 - pt[pt.length - 4].length - pt[pt.length - 3].length - pt[pt.length - 2].length - pt[pt.length - 1].length);
					io.send({'cmd': 'series', 'item': item, 'mode': pt[pt.length -4], 'tmin': pt[pt.length - 3], 'tmax': pt[pt.length - 2], 'count': pt[pt.length - 1]});
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
	 * Close the connection
	 */
	close: function () {
		// console.log("[io.domotiga] close connection");

		if (io.socket.readyState > 0) {
			io.socket.close();
		}

		io.socket = null;
	}
};
