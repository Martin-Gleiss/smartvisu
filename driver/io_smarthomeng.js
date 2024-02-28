/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß, Martin Sinn, Wolfram v. Hülsen
 * @copyright   2012 - 2024
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @label       SmartHomeNG
 *
 * @default     driver_autoreconnect   true
 * @default     driver_port            2424
 * @default     driver_tlsport         2425
 * @hide	    reverseproxy
 * @hide      driver_realtime
 * @hide        driver_consoleport
 * @hide        driver_consoleusername
 * @hide        driver_consolepassword
 * @hide		driver_ssl
 * @hide		driver_username
 * @hide		driver_password
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
		var sendItemPos = item.indexOf(':');
		var sendItem = (sendItemPos == -1 ? item : item.substring(sendItemPos + 1));		
		io.send({'cmd': 'item', 'id': sendItem, 'val': val});
		if (!sv.config.driver.loopback) 
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
	 * (re-)start all subscribed series of a single plot widget
	 * or - if parameter ist empty - all plot widgets on the active page
	 */
	startseries: function (plotwidget) {
		io.plotcontrol('series', plotwidget);
	},
	
	/**
	 * stop all subscribed series of a single plot widget
	 * or - if parameter ist empty - all plot widgets on the active page
	 */
	stopseries: function (plotwidget) {
		io.plotcontrol('series_cancel', plotwidget);
	},

	/**
	 * Initializion of the driver
	 * Driver config parameters are globally available as from v3.2
	 */
	init: function () {
		io.address = sv.config.driver.address;

		// if user-called host is not an IP v4 address check if called host is internal hostname of smartVISU server
		// or configured alternative address (manually set an entry "driver_address2" in config.ini)
		// otherwise assume that call comes from external and then empty io.address
		if (!$.isNumeric(location.hostname.split('.').join(''))) {  // replaceAll() does not work for old browsers
			if (sv.config.driver.address2 && sv.config.driver.address2 !='' && location.hostname == sv.config.driver.address2)
				io.address = sv.config.driver.address2;
			else if ( location.hostname != sv.config.svHostname ) 
				io.address = '';
		} 
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
	 * send "4" while shNG may answer with variant "4.1" which supports log_cancel
	 */
	version: 4,
	shngProto: null,

	/**
	 * supported aggregate functions in the backends database
	 * https://smarthomeng.github.io/smarthome/plugins/database/README.html
	 * TODO: check how comparator for count can be implemented, e.g. "count>10"
	 */
	aggregates: ['avg', 'min', 'max', 'diff', 'sum', 'on', 'raw', 'count', 'countall', 'integrate', 'differentiate', 'duration'],
	
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
	listeners: [],
	monitorComplete: null,
	openItems: [],	
	
	/**
	 * Opens the connection and add some handlers
	 */
	open: function () {
		var protocol = '';
		var ports = [];
		if (io.address){
			ports['ws://'] = sv.config.driver.port;
			ports['wss://'] = sv.config.driver.tlsport;
		}
		if (!io.address || io.address.indexOf('://') < 0) {
			// adopt websocket security to current protocol (https -> wss and http -> ws)
			// if the protocol shall be forced, put it as prefix to the address in the config page
			protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
			if (!io.address) {
				// use url of current page if not defined
				io.address = location.hostname;
			}
			io.port = ports[protocol]; 

			if (!io.port) { // is still undefined, if io.address was empty at start of io.open
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
		console.log("[io.smarthomeng] opening websocket on "+ protocol + io.address + ':' + io.port);
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
			console.log("[io.smarthomeng] receiving data: ", event.data);

			switch (data.cmd) {
				case 'item':
					for (var i = 0; i < data.items.length; i++) {
						item = data.items[i][0];
						val = data.items[i][1];
						/* not supported:
						 if (data.items[i].length > 2)
							data.p[i][2] options for visu;
						 */

						// convert binary
						if (val === false) {
							val = 0;
						}
						if (val === true) {
							val = 1;
						}
						widget.update(item, val);
						io.openItems.removeEntry(item);
						if (item != io.listeners[item])
							widget.update(io.listeners[item], val);
					}
					break;

				case 'series':
					item = data.sid.replace(/\|/g, '\.');
					widget.update(item, data.series);
					io.openItems.removeEntry(item);
					break;

				case 'dialog':
					notify.message('info', data.header, data.content);
					break;

				case 'log':
					if (data.init) {
						widget.update(data.name, data.log);
						io.openItems.removeEntry(data.name);
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
						io.shngProto = data.ver;
					}
					$(document).trigger('ioAlive');
					break;

				case 'url':
					$.mobile.changePage(data.url);
					break;					
			}
			if (io.monitorCompleted == false && io.openItems.length == 0){
				io.monitorCompleted = true;
				$('.smartvisu .visu').removeClass('blink');
			}
		};

		io.socket.onerror = function (error) {
			if(io.socketErrorNotification == null || !notify.exists(io.socketErrorNotification)) {
				var msgText = sv_lang.status_event_format.error.shngdriver_error + ' ' + error.data + '.';
				if (io.address != sv.config.driver.address) {
					msgText += sv_lang.status_event_format.error.shngdriver_hint;
				}
				io.socketErrorNotification = notify.message('error', 'Driver: smarthomeng', msgText);
			}
		};

		io.socket.onclose = function () {
			console.log('[io_smarthomeng]: Connection closed to smarthomeNG server!');
		};
	},

	/**
	 * Sends data to the connected system
	 */
	send: function (data) {
		if (io.socket.readyState == 1) {
			io.socket.send(JSON.stringify(data),10000);  // to do: check if timeout 10000 really solves the log spamming issue
			// DEBUG: 
			console.log('[io.smarthomeng] sending data: ', JSON.stringify(data));
		}
		else {
			// DEBUG:
			console.log('[io.smarthomeng] web socket not ready: ', JSON.stringify(data));
			if (data.cmd == 'logic') io.triggerqueue.push(JSON.stringify(data));
		};
	},

	/**
	 * Monitors the items
	 */
	monitor: function () {
		io.monitorCompleted = false;
		// subscribe all items used on the page or cancel subscription by sending an empty array 
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
		io.send({'cmd': 'monitor', 'items': Object.keys(io.listeners)});
		io.openItems = Object.keys(io.listeners);

		// subscribe all plots defined for the page 
		io.startseries ();
		
		// subscribe all log items defined for the page
		widget.log().each(function (idx) {
			io.send({'cmd': 'log', 'name': $(this).attr('data-item'), 'max': $(this).attr('data-count')});
			io.openItems.push($(this).attr('data-item'));
		});
		if (sv.config.driver.signalBusy)
			$('.smartvisu .visu').addClass('blink');
	},

	/**
	 * Sends trigger commands buffered when websocket was not ready
	 */	
	sendqueue: function () {
		while (io.triggerqueue.length > 0) {
			// DEBUG:
			console.log('[io.smarthomeng] send from queue: ', io.triggerqueue[0]);
			io.socket.send(io.triggerqueue.shift());
		}
	},
	
	// identify all subscribed series and execute given command
	plotcontrol: function(seriescmd, plotwidget) {

		var unique = Array();
		var plotWidgets = [];
		var singleCancel = (seriescmd == 'series_cancel') && (plotwidget != undefined);
		if (plotwidget === undefined)
			plotWidgets = widget.plot();
		else
			plotWidgets = plotwidget;
	
		plotWidgets.each(function (idx) {
			var items = widget.explode($(this).attr('data-item'));
			for (var i = 0; i < items.length; i++) {
				var definition = widget.parseseries(items[i]);
		
				// prevent cancelling a series if not only the specified plot widget has subscribed it 
				// TO DO: check what happens if the specified plot requests a series already available for a different plot 
				if ((singleCancel == true) && (widget.plot(items[i]).length > 1))
					unique[items[i]] = 1;
					
				if (!unique[items[i]] && definition != null) {
					io.send({'cmd': seriescmd, 'item': definition.item, 'series': definition.mode, 'start': definition.start, 'end': definition.end, 'count': definition.count});
					unique[items[i]] = 1;
					if (seriescmd == 'series')
						io.openItems.push(items[i]);
					if (singleCancel == true)
						delete widget.buffer[items[i]];
				}
			}
		});
	},

		
	/**
	 * stop all subscribed logs or a single specified log
	 * available as of shNG protocol version 4.1
	 */
	stoplogs: function (logwidget) {
		if (io.shngProto < 4.1) 
			return
		
		var logWidgets=[];
		if (logwidget === undefined)
			logWidgets = widget.log();
		else
			logWidgets = logwidget;
	
		logWidgets.each(function (idx) {
			io.send({'cmd': 'log_cancel', 'name': $(this).attr('data-item'), 'max': $(this).attr('data-count')});
		})
	},

	/**
	 * Closes the connection
	 */
	close: function () {
		console.log("[io.smarthomeng] close connection");

		if (io.socket.readyState > 0) {
			io.socket.close(1000);
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
