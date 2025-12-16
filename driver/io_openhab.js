/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß, Patrik Germann
 * @copyright   2012 - 2024
 * @license     GPL [http://www.gnu.de]
 * @version     2.6.0
 * -----------------------------------------------------------------------------
 * @label       openHAB
 *
 * @default     driver_port             8080
 * @default     driver_tlsport          8443
 * @default     driver_realtime         true
 * @default     driver_autoreconnect    true
 * @default     driver_consoleport      8101
 * @default     driver_consoleusername  openhab
 * @default     driver_consolepassword  habopen
 *
 * @hide        reverseproxy
 * @hide        proxy
 * @hide        proxy_url
 * @hide        proxy_user
 * @hide        proxy_password
 * @hide        driver_loopback
 * @hide        driver_signalBusy
 */

/**
 * Class for controlling all communication with a connected system. There are
 * simple I/O functions, and complex functions for real-time values.
 */
var io = {

	//  debug switch
	debug   : false,

	// -----------------------------------------------------------------------------
	// P U B L I C   F U N C T I O N S
	// -----------------------------------------------------------------------------

	/**
	 * Does a read-request and adds the result to the buffer
	 *
	 * @param      the item
	 */
	read: function (item) {
		io.debug && console.log("io.read(item = " + item + ")");
		io.item.get(item);
	},

	/**
	 * Does a write-request with a value
	 *
	 * @param      the item
	 * @param      the value
	 */
	write: function (item, val) {
		io.debug && console.log("io.write(item = " + item + ", val = " + val + ")");
		io.item.set(item, val);
	},

	/**
	 * Trigger a logic
	 *
	 * @param      command
	 * @param      options
	 */
	trigger: function (name, val) {
		io.debug && console.log("io.trigger(name = " + name + ", val = " + val + ")");
		var cmd = name + ((val) ? ' ' + val : '');
		io.console(cmd, function(response){
			io.debug && console.debug('io.console(response = [' + response + '])');
			if (response.length && response[0]) {
				notify.message('info', sv_lang.status_event_format.info.response, response.join('<br>'));
			}
		});
	},

	/**
	 * Initializion of the driver
	 *
	 * Driver config parameters are globally available as from v3.2
	 */
	init: function () {
		!io.debug && console.info("Type 'io.debug=true;' to console to see more details.");
		io.debug && console.log("io.init()");

		if (!sv.config.driver) { //kompatibiliät zu smartVISU <= 3.1
			sv.config['driver'] = {
				address : arguments[0],
				port    : arguments[1]
			};
		}

		io.debug && console.debug("io.init(address = " + sv.config.driver.address + ", port = " + sv.config.driver.port + ", ssl = " + sv.config.driver.ssl + ", username = " + sv.config.driver.username + ", password = " + sv.config.driver.password + ")");

		if (sv.config.driver.ssl == true) {
			io.url = 'https://' + sv.config.driver.address + (sv.config.driver.tlsport ? ":" + sv.config.driver.tlsport : '') + "/rest/";
		} else {
			io.url = 'http://' + sv.config.driver.address + (sv.config.driver.port ? ":" + sv.config.driver.port : '') + "/rest/";
		}
		io.debug && console.debug("url = " + io.url);

		if (sv.config.driver.username) {
			io.auth = {"Authorization": "Basic " + btoa(sv.config.driver.username + ':' + sv.config.driver.password)};
		}
		io.debug && console.debug("io.init(auth = " + io.auth + ")");

		var serverResponseTimeStart = new Date().getTime();
		$.ajax({
			url      : io.url + 'items?fields=' + encodeURI('name,type'),
			headers  : (io.auth !== false ? io.auth : {}),
			type     : 'GET',
			timeout  : 15 * 1000,
			async    : false,
			cache    : true
		}).done(function(ohItems) {
			io.serverResponseTime = new Date().getTime() - serverResponseTimeStart;
			for (var i = 0; i < ohItems.length; i++) {
				if (ohItems[i].type != 'Group') {
					io.item.type[ohItems[i].name] = ohItems[i].type;
				}
			}
		}).fail(function(jqXHR, status, errorthrown) {
			if (status == 'error' && jqXHR.statusText.indexOf('NetworkError') === 0) {
				if (notify.message) { //kompatibiliät zu smartVISU <= 3.1
					notify.message('error', sv_lang.status_event_format.error.timeout, sv_lang.status_event_format.error.servererror);
				} else {
					notify.error('Timeout', 'Server not available. Hostname and Port correct?');
				}
			} else {
				notify.json(jqXHR, status, errorthrown);
			}
			sv.config.driver.realtime = false;
		});

		io.serverResponseTime = Math.ceil(io.serverResponseTime / 1000);
		io.serverTimeout      = (io.serverTimeout + io.serverResponseTime) * 1000;
		io.item.refreshTimer  = (io.item.refreshTimer + io.serverResponseTime) * 1000;
		io.plot.refreshTimer  = (io.plot.refreshTimer + io.serverResponseTime) * 1000;
		io.log.refreshTimer   = (io.log.refreshTimer + io.serverResponseTime) * 1000;
	},

	/**
	 * Lets the driver work
	 */
	run: function () {
		io.debug && console.log("io.run(realtime = " + sv.config.driver.realtime + ")");

		if (widget.listeners().length || widget.log().length || widget.series().length) {
			var items = new Array();

			if (widget.listeners().length) {
				items = items.concat(widget.listeners());
				io.debug && console.log("io.run: io.item.getall()");
				io.item.getall();
			}

			if (widget.log().length) {
				io.debug && console.log("io.run: io.log.get()");
				io.log.get();
			}

			if (widget.series().length) {
				io.debug && console.log("io.run: io.plot.init()");
				io.plot.init();
				items = items.concat(Object.keys(io.plot.listeners));
			}

			if (sv.config.driver.realtime) {
				io.debug && console.log("io.run: io.item.eventListener(" + items + ")");
				io.item.eventListener(items);

				if (widget.log().length) {
					io.debug && console.log("io.run: setInterval(io.log.get(), " + io.log.refreshTimer + ")");
					io.log.refreshIntervall = setInterval(function() {
						io.log.get();
					}, io.log.refreshTimer);
				}
			}
		}
	},


	// -----------------------------------------------------------------------------
	// C O M M U N I C A T I O N   F U N C T I O N S
	// -----------------------------------------------------------------------------
	// The functions in this paragraph may be changed. They are all private and are
	// only be called from the public functions above. You may add or delete some
	// to fit your requirements and your connected system.

	url                : '',
	auth               : false,
	serverTimeout      : 10,
	serverResponseTime : 0,
	
	/**
	 * supported aggregate functions in the backends database
	 * ('avg' is not really supported, is only for compatibility to plots without aggregate mode)
	 */
	aggregates: ['raw','avg'],


	/**
	 * convert states from openHAB
	 *
	 * @param      item
	 * @param      state
	 */
	convertState: function (item, state) {
		io.debug && console.debug("io.convertState(item = " + item + ", state = " + state + ")");

		var transval = {
			"NULL"   : 0,
			"OFF"    : 0, "ON"   : 1,
			"CLOSED" : 0, "OPEN" : 1
		}

		if ($.isNumeric(state)) {
			// Workaround, weil in openHAB numerische Werte manchmal viele Nullen nachkomma hat.
			state = parseFloat((state.indexOf('000000') > 0) ? state.slice(0, state.indexOf('000000')) : state);
		}

		switch (io.item.type[item]) {
			case "Color":
				return (state == "NULL") ? "0,0,0" : state;
			case "DateTime":
				if (state.slice(0, 9) == '1970-01-0') {
					state = new Date(Date.now()).toISOString().slice(0,10) + state.slice(10, 23);
				}
				return io.convertDateTime(state);
			case "String":
				return (state == "NULL") ? "" : state;
			default:
				return (state in transval) ? transval[state] : state;
		}
	},

	/**
	 * convert DateTime from openHAB
	 *
	 * @param      timestamp [yyyy-mi-dd hh:mm:ss.ms]
	 */
	convertDateTime: function (timestamp) {
		if (timestamp.length == 23) {
			var yyyy = parseInt(timestamp.slice(0, 4));
			var mi = parseInt(timestamp.slice(5, 7)) - 1;
			var dd = parseInt(timestamp.slice(8, 10));
			var hh = parseInt(timestamp.slice(11, 13));
			var mm = parseInt(timestamp.slice(14, 16));
			var ss = parseInt(timestamp.slice(17, 19));
			var ms = parseInt(timestamp.slice(20, 23));
			timestamp = new Date(yyyy, mi, dd, hh, mm, ss, ms);
		}
		return timestamp;
	},

	item: {
		type             : new Array(),
		socket           : null,
		refreshTimer     : 1,
		refreshIntervall : false,

		get: function (item) {
			io.debug && console.log("io.item.get(item = " + item + ")");
	
			$.ajax({
				url     : io.url + 'items/' + item + '/state',
				headers : (io.auth !== false ? io.auth : {}),
				type    : 'GET',
				timeout : io.serverTimeout,
				async   : true,
				cache   : false
			}).done(function(state) {
				var val = io.convertState(item, state);
				io.debug && console.debug("io.item.get: widget.update(item = " + item + ", value = " + val + ")");
				widget.update(item, val);
				if (io.plot.listeners[item] && Date.now() - io.plot.items[io.plot.listeners[item]] > io.plot.refreshTimer) {
					io.plot.get(io.plot.listeners[item]);
				}
			}).fail(notify.json);
		},

		getall: function () {
			io.debug && console.log("io.item.getall()");

			$.ajax({
				url      : io.url + 'items?fields=' + encodeURI('name,state'),
				headers  : (io.auth !== false ? io.auth : {}),
				type     : 'GET',
				timeout  : io.serverTimeout,
				async    : true,
				cache    : false
			}).done(function(ohItems) {
				for (var i = 0; i < ohItems.length; i++) {
					var item = ohItems[i].name;
					var val = io.convertState(item, ohItems[i].state);
					if (io.item.type[item] != 'Group') {
						io.debug && console.debug("io.item.getall: widget.set(item = " + item + ", value = " + val + ")");
						widget.set(item, val);
					}
				}
				io.debug && console.log("io.item.getall: widget.refresh()");
				widget.refresh();
			}).fail(notify.json);
		},

		set: function (item, val) {

			var transval = new Array();
			switch (io.item.type[item]) {
				case "Contact":
					transval[0] = "CLOSED";
					transval[1] = "OPEN";
				break;
				//case "Dimmer":
				case "Switch":
					transval[0] = "OFF";
					transval[1] = "ON";
				break;
				case "Rollershutter":
					transval[0] = "UP";
					transval[1] = "STOP";
					transval[100] = "DOWN";
				break;
			}

			var state = (val in transval) ? transval[val] : val;
			io.debug && console.debug("io.item.set(item = " + item + ", val = " + state + ")");
			$.ajax({
				url         : io.url + 'items/' + item,
				headers     : (io.auth !== false ? io.auth : {}),
				data        : state.toString(),
				method      : 'POST',
				contentType : 'text/plain',
				timeout     : io.serverTimeout,
				cache       : false
			}).success(function() {
				if (!sv.config.driver.realtime || io.item.refreshIntervall) {
					io.debug && console.debug("io.item.set: widget.update(item = " + item + ", value = " + val + ")");
					widget.update(item, val);
				}
			}).fail(notify.json);
		},

		eventListener: function (items) {
			if (io.auth && typeof EventSourcePolyfill == 'function') {
				io.item.socket = new EventSourcePolyfill(io.url + 'events/states', {heartbeatTimeout: 18000000, headers: (io.auth !== false ? io.auth : {})});
			} else if (typeof EventSource == 'function') {
				io.item.socket = new EventSource(io.url + 'events/states');
			}
			if (io.item.socket) {
				io.debug && console.log("io.item.eventListener: addEventlistener()");
				io.item.socket.addEventListener('ready', function(message) {
					$.ajax({
						url         : io.url + 'events/states/' + message.data,
						headers     : (io.auth !== false ? io.auth : {}),
						data        : JSON.stringify(items),
						method      : 'POST',
						contentType : 'application/json',
						timeout     : io.serverTimeout,
						async       : true,
						cache       : false
					}).success(function() {
						io.debug && console.debug('io.item.socket.addEventListener = ' + message.data);
						io.item.socket.onmessage = function(message) {
							io.debug && console.log('io.item.socket.message:');
							io.debug && console.log(message);
							var states = JSON.parse(message.data);
							Object.keys(states).forEach((item) => {
								var val = states[item].state;
								io.debug && console.debug("io.item.eventListener: eventmessage(item = " + item + ", value = " + val + ")");
								val = io.convertState(item, val);
								io.debug && console.debug("io.item.eventListener: widget.update(item = " + item + ", value = " + val + ")");
								widget.update(item, val);

								if (io.plot.listeners[item]) {
									var plotval = new Array;
									plotval.push([Date.now(), io.plot.convertValue(val)]);
									io.debug && console.debug("io.item.eventListener: widget.update(item = " + io.plot.listeners[item] + ", value = " + plotval + ")");
									widget.update(io.plot.listeners[item], plotval);
								}
							});
						}
					}).fail(notify.json);
				});
			} else {
				io.debug && console.log("io.item.eventListener: setInterval(io.item.getall())");
				io.item.refreshIntervall = setInterval(function() {
					io.item.getall();
				}, io.item.refreshTimer);
			}
		}
	},

	log: {
		refreshTimer     : 10,
		refreshIntervall : false,

		/**
		 * read log
		 */
		get: function () {
			io.debug && console.log("io.log.get()");

			widget.log().each(function () {
				var logname = $(this).attr('data-item');
				var logcount = $(this).attr('data-count');
				io.debug && console.debug("io.log.get(logname = " + logname + ")");
				var cmd = "log:display " + logname + ((logcount) ? " " + logcount : null);
				io.console(cmd, function(log) {
					if (log.length) {
						var newhash = log[0].id;
						var lasthash = null;
						if (widget.get(logname)) {
							var curlog = widget.get(logname);
							lasthash = curlog[0].id;
						}
						io.debug && console.debug("io.log.get(logname = " + logname + ", lasthash = " + lasthash + ", newhash = " + newhash + ")");
						if (newhash != lasthash) {
							for (let i=0; i<log.length; i++) {
								log[i].time = io.convertDateTime(log[i].time);
							}
							io.debug && console.debug("io.log.get: widget.log.update(item = " + logname + ", value = " + log + ")");
							widget.update(logname, log);
						}
					}
				});
			});
		}
	},

	plot: {
		items        : new Array(),
		listeners    : new Array(),
		refreshTimer : 10,

		convertValue: function (value) {
			io.debug && console.debug("io.plot.convertValue(" + value + ")");

			if (isNaN(value)) {
				value = 0;
			} else if (Number(value) == value && value % 1 !== 0) { //isFloat
				value = Math.round((value + Number.EPSILON) * 100) / 100; //Rundung auf max. zwei Nachkommastellen
			}
			return value;
		},

		convertItem: function (item) {
			io.debug && console.debug("io.plot.convertItem(item = " + item + ")");

			var i = item.split('.');
			if (i.length >= 5) {
				var o = new Object;
				o.count = i[i.length -1];
				o.tmax = i[i.length -2];
				o.tmin = i[i.length -3];
				o.mode = i[i.length -4];
				o.item = i.slice(0, i.length -4).join('.');
				o.name = item;
				return o;
			} else {
				return false;
			}
		},

		/**
		 * Initializion of plots
		 */
		init: function() {
			io.debug && console.log("io.plot.init()");

			io.plot.listeners = new Array();
			widget.plot().each(function() {
				var items = widget.explode($(this).attr('data-item'));
				for (var i = 0; i < items.length; i++) {
					var pI = io.plot.convertItem(items[i]);
					if (!io.plot.items[pI.name] && pI && widget.checkseries(pI.name)) {
						if (pI.tmax == 'now') {
							io.plot.listeners[pI.item] = pI.name;
						}
						io.plot.get(pI.name);
						io.plot.items[pI.name] = true;
					}
				}
			});
		},

		/**
		 * read plotdata
		 *
		 * @param      plotItem
		 */
		get: function(plotItem) {
			io.debug && console.log("io.plot.get(plotItem = " + plotItem + ")");

			var pI = io.plot.convertItem(plotItem);
			pI.dtmin = new Date().duration(pI.tmin);
			pI.starttime = new Date(Date.now() - pI.dtmin);
			var url = io.url + "persistence/items/" + pI.item + "?starttime=" + pI.starttime.toISOString();
			if (pI.tmax != 'now') {
				pI.dtmax = new Date().duration(pI.tmax);
				pI.endtime = new Date(new Date() - pI.dtmax);
				url += "&endtime=" + pI.endtime.toISOString();
			}

			$.ajax({
				url      : url,
				headers  : (io.auth !== false ? io.auth : {}),
				type     : 'GET',
				dataType : 'json',
				timeout  : io.serverTimeout,
				async    : true,
				cache    : false
			}).done(function(persistence) {
				var plotData = new Array();
				if (persistence.data.length > 0) {
					$.each(persistence.data, function(key, data) {
						var val = io.convertState(pI.item, data.state);
						plotData.push([data.time, io.plot.convertValue(val)]);
					});
					plotData.sort(function(a, b) {
						return a[0] - b[0];
					});
				} else {
					plotData.push([Date.parse(starttime), 0]);
					plotData.push([endtime ? Date.parse(endtime) : Date.now(), 0])
				}
				io.plot.items[plotItem] = Date.now();
				io.debug && console.debug("io.plot.get: widget.update(plotItem = " + plotItem + ", plotData = " + plotData + ")");
				widget.update(plotItem, plotData);
			}).fail(notify.json);
		}
	},

	/**
	 * Send a command to the console and execute callback
	 *
	 * @param      command
	 * @param      function (callback)
	 */
	console: function (command, func) {
		io.debug && console.log("io.console(command = " + command + ")");
		
		$.ajax({
			url      : 'driver/openhab/console.php',
			data     : 'cmd=' + command,
			type     : 'POST',
			dataType : 'json',
			timeout  : io.serverTimeout*2,
			async    : true,
			cache    : false
		}).done(function(data) {
			func(data);
		}).fail(notify.json);
	},

	/**
	 * stop all subscribed series
	 */
	stopseries: function () {
		io.debug && console.log("io.stopseries()");

		if (io.item.socket) {
			io.debug && console.debug("io.stopseries: io.item.socket.close()");
			io.item.socket.close();
		}

		if (io.item.refreshIntervall) {
			io.debug && console.debug("io.stopseries: clearTimeout(io.item.refreshIntervall)");
			clearTimeout(io.item.refreshIntervall);
			io.item.refreshIntervall = false;
		}

		if (io.log.refreshIntervall) {
			io.debug && console.debug("io.stopseries: clearTimeout(io.log.refreshIntervall)");
			clearTimeout(io.log.refreshIntervall);
			io.log.refreshIntervall = false;
		}
	}
}