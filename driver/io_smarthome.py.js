/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß, Martin Sinn, Wolfram v. Hülsen
 * @copyright   2012 - 2021
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @label       SmartHomeNG
 *
 * @default     driver_autoreconnect   true
 * @default     driver_port            2424
 * @default     driver_tlsport         2425
 * @default	    reverseproxy           false
 * @hide        driver_realtime
 * @hide		driver_ssl
 * @hide		driver_username
 * @hide		driver_password
 * @hide		sv_hostname
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
	 * Driver config parameters are globally available as from v3.2
	 */
	init: function () {
		io.address = sv.config.driver.address;
		io.open();
	},

	/**
	 * Lets the driver work
	 */
	run: function () {
		// refresh all widgets with values from the buffer
		widget.refresh();

		// subscribe item updates from the backend
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
	 * This is the websocket module / plugin and the websocket opening time
	 */
	server: '', 
	opentime: null,

	/**
	 * This driver uses a websocket
	 */
	socket: false,
	
	triggerqueue: [],
	
	/**
	 * Opens the connection and add some handlers
	 */
	open: function () {
		var protocol = '';
		var ports = [];
		ports['ws://'] = sv.config.driver.port;
		ports['wss://'] = sv.config.driver.tlsport;

		if (!io.address || io.address.indexOf('://') < 0) {
			// adopt websocket security to current protocol (https -> wss and http -> ws)
			// if the protocol shall be forced, put it as prefix to the address in the config page
			protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
			if (!io.address) {
				// use url of current page if not defined
				io.address = location.hostname;
			}
			io.port = ports[protocol];

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
		else {
			// forced protocol (identified in address)
			io.port = ports[io.address.substr(0, io.address.indexOf(':'))+'://'];
		}
		// DEBUG:
		console.log("[io.smarthome.py] opening websocket on "+ protocol + io.address + ':' + io.port);
		io.socket = new WebSocket(protocol + io.address + ':' + io.port);
		
		io.socket.onopen = function () {
			// remove socket error notification on reconnect
			if(io.socketErrorNotification != null)
				notify.remove(io.socketErrorNotification);

			io.send({'cmd': 'proto', 'ver': io.version});
			var browser = io.getBrowser();
			io.send({'cmd': 'identity', 'sw': 'smartVISU', 'ver': 'v'+sv.config.version, 'browser': browser.name, 'bver': browser.version});
			// send commands queued when socket was not ready
			io.sendqueue();
			// start monitoring the items pepared for the current page
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
					//if (io.version <= 3)
					//	data.sid = data.sid + '.100';
					
					widget.update(data.sid.replace(/\|/g, '\.'), data.series);
					break;

				case 'dialog':
					notify.message('info', data.header, data.content);
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
					if (data.server != undefined){ 
						io.server = data.server;
						io.opentime = new Date(data.time);
					}
					$(document).trigger('ioAlive');
					break;

				case 'url':
					$.mobile.changePage(data.url);
					break;					
			}
		};

		io.socket.onerror = function (error) {
			if(io.socketErrorNotification == null || !notify.exists(io.socketErrorNotification))
				io.socketErrorNotification = notify.message('error', 'Driver: smarthome.py', 'Could not connect to smarthome.py server!<br /> Websocket error ' + error.data + '.');
		};

		io.socket.onclose = function () {
			console.log('[io_smarthome.py]: Connection closed to smarthome.py server!');
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
		else {
			// DEBUG:
			console.log('[io.smarthome.py] web socket not ready: ', JSON.stringify(data));
			if (data.cmd == 'logic') io.triggerqueue.push(JSON.stringify(data));
		};
	},

	/**
	 * Monitors the items
	 */
	monitor: function () {
		if (widget.listeners().length) {
			// subscribe all items used on the page
			io.send({'cmd': 'monitor', 'items': widget.listeners()});
		}

		// subscribe all plots defined for the page 
		// types: avg, min, max, on
		io.startseries ();
		
		// log
		widget.log().each(function (idx) {
			io.send({'cmd': 'log', 'name': $(this).attr('data-item'), 'max': $(this).attr('data-count')});
		
		});
	},

	/**
	 * Sends trigger commands buffered when websocket was not ready
	 */	
	sendqueue: function () {
		while (io.triggerqueue.length > 0) {
			// DEBUG:
			console.log('[io.smarthome.py] send from queue: ', io.triggerqueue[0]);
			io.socket.send(io.triggerqueue.shift());
		}
	},
	
	/**
	 * (re-)start all subscribed series
	 */
	startseries: function () {
		io.plotcontrol('series');
	},
	
	/**
	 * stop all subscribed series
	 */
	stopseries: function () {
		io.plotcontrol('series_cancel');
	},
	
	// identify all subscribed series and execute given command
	plotcontrol: function(seriescmd) {
		var unique = Array();
		widget.plot().each(function (idx) {
			var items = widget.explode($(this).attr('data-item'));
			for (var i = 0; i < items.length; i++) {

				var pt = items[i].split('.');

				if (!unique[items[i]] && (pt instanceof Array) && widget.checkseries(items[i])) {
					var item = items[i].substr(0, items[i].length - 4 - pt[pt.length - 4].length - pt[pt.length - 3].length - pt[pt.length - 2].length - pt[pt.length - 1].length);

					io.send({'cmd': seriescmd, 'item': item, 'series': pt[pt.length - 4], 'start': pt[pt.length - 3], 'end': pt[pt.length - 2], 'count': pt[pt.length - 1]});
					
					unique[items[i]] = 1;
				}
			}
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
