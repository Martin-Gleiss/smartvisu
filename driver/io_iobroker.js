/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Stefan Widmer (inspired by https://github.com/ioBroker/ioBroker.socketio/blob/master/example/conn.js)
 * @copyright   2017 - 2024
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @label       ioBroker
 *
 * @default     driver_autoreconnect   true
 * @default     driver_port            8084
 * @hide		driver_tlsport 
 * @hide        driver_realtime
 * @hide		reverseproxy
 * @hide        driver_consoleport
 * @hide        driver_consoleusername
 * @hide        driver_consolepassword
 * @hide		driver_ssl
 * @hide		driver_username
 * @hide		driver_password
 * @hide		driver_loopback
 * @hide        driver_signalBusy
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

	// value type of all items
	valueType: Array(),
	
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
			var sendItemPos = item.indexOf(':');
			var sendItem = (sendItemPos == -1 ? item : item.substring(sendItemPos + 1));
			var v = val;
			//console.log('A) ' + sendItem + ': ' + val);
			switch (io.valueType[sendItem]) {
				case 'boolean': // convert to boolean
					v = ((v == 0) || (v == '') || (v == '0') || (v == 'false')) ? false:true;
					break;
				case 'number': // convert to numeric
					v = v * 1.0;
					break;
				case 'json': // convert to json string ("{ ... }")
					try {
						v = JSON.stringify(v);
					} catch (e) {
						console.log(sendItem + '-data seems to be an json, but cannot convert it: ' + val);
					}
					break;
				case 'string': // convert to string
					try {						
						if (val.constructor === Array) {
							// item return an array but ioBroker used for array a string ("x,y,z...")
							v = JSON.stringify(v);					
							if (v.length > 2 && v[0] === '[' && v[v.length - 1] === ']') { 							
								v = v.slice(1).slice(0, -1); // remove '[' and ']'
							}
						}
					} catch (e) {
						console.log(sendItem + '-data seems to be an array, but cannot convert it to string: ' + val);
					}
					break;
				case 'array': // convert to array ("[ ... ]")
					try {
						v = JSON.stringify(v);
						if (v.length > 0 && v[0] !== '[') v = '[' + v + ']';						
					} catch (e) {
						console.log(sendItem + '-data seems to be an array, but cannot convert it: ' + val);
					}
					break;
				default:
					break;
			}
			//console.log('B) ' + sendItem + ': ' + vval);				
			io.socket.emit('setState', sendItem, v, callback);
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
				notify.message('warning', 'Driver: ioBroker', 'Passing value to a script is not supported in ioBroker.');
		}
	},

	/**
	* Initialization of the driver
	*
	* Driver config parameters are globally available as from v3.2
	*/
	init: function () {
		io.address = sv.config.driver.address;
		io.port = sv.config.driver.port;
		
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
	run: function () {
		// refresh all widgets with values from the buffer
		widget.refresh();

		// subscribe item updates from the backend
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
	
	listeners: [],
	
	/**
	 * supported aggregate functions in the backends database
	 * https://www.iobroker.net/docu/index-83.htm?page_id=4531&lang=en
	 * - minmax - is ordered as 2 series: min and max
	 * - min
	 * - max
	 * - avergage = avg 
	 * - total = on 
	 * - count
	 */
	aggregates: ['avg', 'min', 'max', 'on', 'count'],


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
					notify.message('error', 'Driver: ioBroker', 'No answer from server.');
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
						notify.message('error', 'Driver: ioBroker', 'Authentication failed.');
					}
				});
			}, 50);
		});

		io.socket.on('error', function (err) {
			notify.message('error', 'Driver: ioBroker', JSON.stringify(err));
		});
		
		io.socket.on('connect_error', function (err) {
			if(io.socketErrorNotification == null || !notify.exists(io.socketErrorNotification))
				io.socketErrorNotification = notify.message('error', 'Driver: ioBroker', 'connect_error: '+JSON.stringify(err));
			//io.reconnect(connOptions);
		});
		
		io.socket.on('permissionError', function (err) {
			notify.message('error', 'Driver: ioBroker', 'permissionError: '+JSON.stringify(err));
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

	plots: Array(),	// [id, item, stateChanged enabled]
	firstPlotTimeout: 0,

	updatePlot: function(plot) {
		var pt = plot[1].split('.');
		var options = {
			'aggregate': pt[pt.length - 4], // avg, min, max, on
			'start': new Date() - new Date().duration(pt[pt.length - 3]),
			'end': new Date() - new Date().duration(pt[pt.length - 2]),
			'count': pt[pt.length - 1]
		};
		options.aggregate = options.aggregate == 'avg' ? 'average' : options.aggregate == 'on' ? 'total' : options.aggregate;
		
		io.socket.emit('getHistory', plot[0], options, function (err, result) {
			var val = [];
			$.each(result, function(index, state) {
				val.push([state.ts, state.val]);
			});
			widget.update(plot[1], val);
		});
	},

	delayPlots: function() {
		var items = Array();
		io.plots.forEach(plot => {
			io.updatePlot(plot);
			plot[2] = true; // enable stateChanged
			items.push(plot[0]);
		});
		if (items.length) {
			//console.log('items: ' + items);
			io.socket.emit('subscribe', items);
			io.read(items);
		}
	},

	monitor: function() {
		io.listeners = [];
		var listeners = widget.listeners();
		var listenItem;
		var listenItemEnd;
		for (var i=0; i < listeners.length; i++){
			listenItemEnd = listeners[i].indexOf(':');
			listenItem = (listenItemEnd == -1 ? listeners[i] : listeners[i].substring(0, listenItemEnd));
			if ( io.listeners[listenItem] == undefined || listenItem == io.listeners[listenItem])
				io.listeners[listenItem] = listeners[i];
		}
		var items = Object.keys(io.listeners);
		
		if (io.checkConnected() && items.length) {
			io.socket.emit('subscribe', items);
			io.read(items);

			// plot
			io.plots = Array();                        
			clearTimeout(io.firstPlotTimeout);
			io.firstPlotTimeout = 0;
			var unique = Array();
			widget.plot().each(function (idx) {
				var items = widget.explode($(this).attr('data-item'));
				$.each(items, function() {
					var item = String(this);                    
					var pt = item.split('.');
					if (!unique[item] && (pt instanceof Array) && widget.checkseries(item)) {
						unique[item] = 1;
						if (io.plots.find(plot => plot[1] === item) === undefined) {
							var id = item.substr(0, item.length - 4 - pt[pt.length - 4].length - pt[pt.length - 3].length - pt[pt.length - 2].length - pt[pt.length - 1].length);
							io.plots.push([id, item, false]);
						}
						io.firstPlotTimeout = -1;
					}
				});
			});
			
			// Start subscribing and draw with a delay in the plots so the "normal" widgets are populated with data first.
			// This speeds up page loading when there is a lot of data in the plots.
			if (io.firstPlotTimeout == -1) io.firstPlotTimeout = setTimeout(io.delayPlots, 1000);             
		}
	},

	stateChanged: function(item, state) {
		if (state === null || typeof state !== 'object') return;
		
		if (io.plots.find(plot => (plot[0] === item) && plot[2]) !== undefined) {
			//console.log('item ' + item + ' is a plot');
			// update all plots with the same item name
			io.plots.forEach(plot => {				
				//console.log(plot[0] + ": " + plot[1]);
				if (plot[0] === item) 
					io.updatePlot(plot);
			});
		} else {
			var val = state.val;
			io.valueType[item] = typeof val; // remember value type
			
			// convert boolean
			if (val === false) 
				val = 0;
			if (val === true) 
				val = 1;

			// numbers get converted in widget.update -> no need to do it here

			// text needs no conversion

			// convert arrays and JSON arrays        

			if (val &&
				typeof val === 'string' &&
				val[0] === '{' &&
				val[val.length - 1] === '}') {
				try {
					val = JSON.parse(val);
					io.valueType[item] = 'json'; // is used for example by device.uzsuicon
				} catch (e) {
					console.log('Data seems to be an json, but cannot parse it: ' + val);
				}
			} else {     
				if (val &&
					typeof val === 'string' &&
					val[0] === '[' &&
					val[val.length - 1] === ']') {
					try {
						val = JSON.parse(val);
						io.valueType[item] = 'array'; // is used for example by basic.select with itemvals/itemtxts or status.activelist
					} catch (e) {
						console.log('Data seems to be an array, but cannot parse it: ' + val);
					}
				}        
			}       

			widget.update(item, val);
			if (item != io.listeners[item])
				widget.update(io.listeners[item], val);
		}
	},

	/**
	* stop all subscribed series
	*/
	stopseries: function () {
		if (io.isConnected) {
			var items = io.listeners != [] ? Object.keys(io.listeners) : widget.listeners();
			io.plots.forEach(plot => {
				items.push(plot[0]);
			});
			io.socket.emit('unsubscribe', items);
			io.read(items);
		}
		valueType = Array(); // clear list
	}

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
