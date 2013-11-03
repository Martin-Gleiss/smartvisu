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
		// not supported
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
	 * This driver version
	 */
	version: '0.1',

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
			console.log("[io.domotiga] receiving data: " + event.data);
			switch (data.cmd) {
				case 'item': // item
					for (var i = 0; i < data.items.length; i = i + 2) {
						item = data.items[i];
						val = data.items[i + 1];
						console.log("[io.domotiga]: update item: " + item + " val: " + val);
						widget.update(item, val);
					}
					;
					/*
					 for (var i = 0; i < data.items.length; i++) {
					 item = data.items[i][0];
					 val = data.items[i][1];
					 if ( data.items[i].length > 2 ) {
					 // not supported: data.p[i][2] options for visu
					 };
					 console.log("[io.domotiga] update item: " + item + " val: " + val);
					 io.update(item, val);
					 };
					 */
					break;
				case 'dialog':
					notify.info(data.header, data.content);
				case 'proto':
					var proto = data.ver;
					if (proto != io.version) {
						notify.info('Driver: DomotiGa', 'Protocol mismatch<br />Driver is at version v' + io.version + '<br />DomotiGa is at version v' + proto);
					}
					;
				case 'log':
					break;
			}
			;
		};
		io.socket.onerror = function (error) {
			notify.error('Driver: DomotiGa', 'Websocket error: ' + error);
		};
		io.socket.onclose = function () {
			notify.error('Driver: DomotiGa', 'Could not connect to DomotiGa server!');
		};
	},

	/**
	 * Sends data to the connected system
	 */
	send: function (data) {
		if (io.socket.readyState == 1) {
			io.socket.send(unescape(encodeURIComponent(JSON.stringify(data))));
			console.log('[io.domotiga] sending data: ' + JSON.stringify(data));
			// } else {
			// notify.error('Driver: domotiga', 'Websocket not available. Could not send data!');
		}
	},

	/**
	 * Monitors the items
	 */
	monitor: function () {
		if (widget.listeners().length) {
			io.send({'cmd': 'monitor', 'items': widget.listeners()});
		}
	},


	/**
	 * Closes the connection
	 */
	close: function () {
		io.socket.close();
		io.socket = null;
	}

};
