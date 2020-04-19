/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Stefan Widmer (inspired by https://github.com/ioBroker/ioBroker.socketio/blob/master/example/conn.js)
 * @copyright   2017
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @label       ioBroker
 *
 * @default     driver_autoreconnect   true
 * @default     driver_port            8084
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

	// -----------------------------------------------------------------------------
	// P U B L I C	 F U N C T I O N S
	// -----------------------------------------------------------------------------

	/**
	 * Does a read-request and adds the result to the buffer
	 *
	 * @param		the item
	 */
	read: function (items) {
		if (io.checkConnected) {
			io.socket.emit('getStates', items, function (err, data) {
				if (err || !data) {
					alert(err || 'Authentication required');
				}
				else {
					$.each(data, io.stateChanged);
				}
			});
		}
	},

	/**
	 * Does a write-request with a value
	 *
	 * @param		the item
	 * @param		the value
	 */
	write: function (item, val, callback) {
		if (io.checkConnected) {
			io.socket.emit('setState', item, val, callback);
		}
	},

	/**
	 * Trigger a logic
	 *
	 * @param		the logic
	 * @param		the value
	 */
	trigger: function (name, val) {
		if (io.checkConnected) {
			io.write('javascript.0.scriptEnabled.' + name, false, function() {
				io.write('javascript.0.scriptEnabled.' + name, true);
			})
			
			if(val && val != '')
				notify.warning('Driver: ioBroker', 'Passing value to a script is not supported in ioBroker.');
		}
	},

	/**
	 * Initialization of the driver
	 *
	 * @param		the ip or url to the system (optional)
	 * @param		the port on which the connection should be made (optional)
	 */
	init: function (address, port) {
		io.address = address;
		io.port = port;
		
		// use current protocol (https or http)
		// if the protocol should be forced, add it to the address
		var protocol = io.address.indexOf('://') < 0 ? location.protocol + '//' : '';
		if (!io.address) {
			// use url of current page if not defined
			io.address = location.hostname;
		}
		if (!io.port) {
			// use port of current page if not defined and needed
			io.port = location.port;
		}
		
		io.url = protocol + io.address + ':' + io.port;
		
		exports = {}; // required because of conflicting name 'io'
		$.getScript(io.url + "/socket.io/socket.io.js", function() {
			io.open(exports.io);
		})
		.fail(notify.json);
	},

	/**
	 * Let the driver work
	 */
	run: function (realtime) {
		// old items
		widget.refresh();

		// new items
		io.monitor();
	},


	/**
	 * This driver uses a websocket
	 */
	socket: false,

	isConnected: false,
	
	checkConnected() {
		if (!io.socket || !io.isConnected) {
			console.log('ioBroker not connected');
			return false;
		}	
		else
			return true;
	},

	/**
	 * Opens the connection and add some handlers
	 */
	open: function (socketIo) {

		io.socket = new socketIo.connect(io.url);

		io.socket.on('connect', function () {
			io.socket.emit('name', 'smartVISU');
			console.log("ioBroker: Connected to '" + io.url + "', authenticating...");
			setTimeout(function () {
				var wait = setTimeout(function() {
					notify.error('Driver: ioBroker', 'No answer from server.');
				}, 3000);

				io.socket.emit('authenticate', function (isOk, isSecure) {
					clearTimeout(wait);
					if (isOk) {
						console.log('ioBroker: Authenticated and ready.')
						// remove socket error notification on reconnect
						if(io.socketErrorNotification != null)
							notify.remove(io.socketErrorNotification);

						io.isConnected = true;
						io.monitor();
					} else {
						 notify.error('Driver: ioBroker', 'Authentication failed.');
					}
				});
			}, 50);
		});

		io.socket.on('error', function (err) {
			 notify.error('Driver: ioBroker', JSON.stringify(err));
		});
		
		io.socket.on('connect_error', function (err) {
			if(io.socketErrorNotification == null || !notify.exists(io.socketErrorNotification))
				io.socketErrorNotification = notify.error('Driver: ioBroker', 'connect_error: '+JSON.stringify(err));
			//io.reconnect(connOptions);
		});
		
		io.socket.on('permissionError', function (err) {
			 notify.error('Driver: ioBroker', 'permissionError: '+JSON.stringify(err));
		});

		io.socket.on('disconnect', function () {
			console.log('ioBroker: disconnected');
			io.isConnected = false;
			//io.reconnect(connOptions);
		});

		io.socket.on('stateChange', function (id, state) {
			if (!id || state === null || typeof state !== 'object') return;
			io.stateChanged(id, state);
/*
			if (that._connCallbacks.onCommand && id === that.namespace + '.control.command') {
				if (state.ack) return;

				if (state.val &&
					typeof state.val === 'string' &&
					state.val[0] === '{' &&
					state.val[state.val.length - 1] === '}') {
					try {
						state.val = JSON.parse(state.val);
					} catch (e) {
						console.log('Command seems to be an object, but cannot parse it: ' + state.val);
					}
				}

				// if command is an object {instance: 'iii', command: 'cmd', data: 'ddd'}
				if (state.val && state.val.instance) {
					if (io.onStateChange(state.val.instance, state.val.command, state.val.data)) {
						// clear state
						that.setState(id, {val: '', ack: true});
					}
				} else {
					if (io.onStateChange(that._cmdInstance, state.val, that._cmdData)) {
						// clear state
						that.setState(id, {val: '', ack: true});
					}
				}
			} else if (id === that.namespace + '.control.data') {
				that._cmdData = state.val;
			} else if (id === that.namespace + '.control.instance') {
				that._cmdInstance = state.val;
			} else if (that._connCallbacks.onUpdate) {
				that._connCallbacks.onUpdate(id, state);
			}
*/
		});
	},

	monitor: function() {
		var items = widget.listeners();
		if (io.checkConnected() && items.length) {
			io.socket.emit('subscribe', items);
			io.read(items);

			// plot
			var unique = Array();
			widget.plot().each(function (idx) {
				var items = widget.explode($(this).attr('data-item'));
				$.each(items, function() {
					var item = String(this);
					var pt = item.split('.');

					if (!unique[item] && !widget.get(item) && (pt instanceof Array) && widget.checkseries(item)) {
						var id = item.substr(0, item.length - 4 - pt[pt.length - 4].length - pt[pt.length - 3].length - pt[pt.length - 2].length - pt[pt.length - 1].length);
						var options = {
							'aggregate': pt[pt.length - 4], // avg, min, max, on
							'start': new Date() - new Date().duration(pt[pt.length - 3]),
							'end': new Date() - new Date().duration(pt[pt.length - 2]),
							'count': pt[pt.length - 1]
						};
						options.aggregate = options.aggregate == 'avg' ? 'average' : options.aggregate == 'on' ? 'total' : options.aggregate;

						io.socket.emit('getHistory', id, options, function (err, result) {
							var val = [];
							$.each(result, function(index, state) {
								val.push([state.ts, state.val]);
							});
							widget.update(item, val);
						});

						unique[item] = 1;
					}
				});
			});
		}

	},

	stateChanged: function(item, state) {
		var val = state.val;
		widget.update(item, val);
	},
/*
	logout: function() {
		if (!io.isConnected) {
			console.log('No connection!');
			return;
		}

		io.socket.emit('logout', function() {
			alert('logged out');
		});
	},
*/
}
