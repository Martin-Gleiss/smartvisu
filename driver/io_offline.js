/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiss
 * @copyright   2012 - 2025
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @hide        driver_address
 * @hide        driver_port
 * @hide        driver_tlsport
 * @hide        driver_autoreconnect
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

	// the ports
	port: '',
	tlsport: '',
	
	// the pages used for offline_*.var filename
	pages: '',
	
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
		io.get(item);
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
		io.put(sendItem, val);
	},

	/**
	 * Trigger a logic
	 *
	 * @param      the logic
	 * @param      the value
	 */
	trigger: function (name, val) {
		console.log('[io.offline]: unsupported trigger command. Name: ' + name + ', value:', val);
	},

	/**
	 * Initializion of the driver
	 *
	 * Driver config parameters are globally available as from v3.2
	 */
	init: function () {
		io.address = '';
		io.port = '';
		io.tlsport = '';
		io.stop();
		var pagesIndex = location.search.indexOf('pages');
		var ampersIndex = location.search.indexOf('&');
		if (pagesIndex > 0){
			io.pages = (ampersIndex > pagesIndex ? location.search.substring(pagesIndex + 6, ampersIndex) : location.search.substring(pagesIndex + 6)) ;	
		}
		// the easy method does not work with older tablets	(e.g. Safari iOS < v10.3)
		//var params = new URLSearchParams(location.search.substring(1));
		//if (params.has("pages"))
		//io.pages = params.get("pages"); 
		console.log('[io.offline]: driver started'+(io.pages != '' ? ' with file "./temp/offline_'+io.pages+'.var"' :''));
	},

	/**
	 * Lets the driver work
	 */
	run: function (realtime) {
		// old items (for new widgets with existing values)
		widget.refresh();

		// new items
		io.all();

		// run polling
		if (realtime) {
			io.start();
		}
	},


	// -----------------------------------------------------------------------------
	// C O M M U N I C A T I O N   F U N C T I O N S
	// -----------------------------------------------------------------------------
	// The functions in this paragraph may be changed. They are all private and are
	// only be called from the public functions above. You may add or delete some
	// to fit your requirements and your connected system.

	timer: 0,
	timer_run: false,
	seriesTimer: [],
	listeners: [],

	/**
	 * supported aggregate functions in the backends database
	 */
	aggregates: ['avg', 'min', 'max', 'sum', 'diff', 'rate', 'on', 'raw', 'count'],


	/**
	 * The real-time polling loop, only if there are listeners
	 */
	loop: function () {
		if (widget.listeners().length) {
			io.timer = setTimeout('io.loop(); io.all();', 5000);
		}
	},

	/**
	 * Start the real-time values. Can only be started once
	 */
	start: function () {
		if (!io.timer_run && widget.listeners().length) {
			io.loop();
			io.timer_run = true;
		}
	},

	/**
	 * Stop the real-time values
	 */
	stop: function () {
		clearTimeout(io.timer);
		io.timer_run = false;
	},

	/**
	 * Read a specific item from bus and add it to the buffer
	 */
	get: function (item) {
		$.ajax({  url: "driver/io_offline.php",
			data: {"pages": io.pages, "item": item},
			type: "GET",
			dataType: 'json',
			async: true,
			cache: false
		})
		.done(function (response) {
			var val = response[item];
			// try to parse as JSON. Use raw value if this fails (value was likely saved before introdution of JSON.stringify in put)
			try {
				val = JSON.parse(response[item]);
			}
			catch(e) {}
			// initialize UZSU data if item is an UZSU item and no data available
			if (item.slice(-5).toLowerCase() == '.uzsu' && val == null) 
				val = {"active":"false", "interpolation": {"type": "none", "initialized": false, "interval": 5, "initage": 0, "itemtype": "bool"}, "list": [], "plugin_version": "2.0.0"}
			console.log('[io.offline] receiving data: ["'+ item +' ": '+ val + ']');
			widget.update(item, val);
		})
		.fail(notify.json)
	},

	/**
	 * Write a value to bus
	 */
	put: function (item, val) {
		var timer_run = io.timer_run;

		io.stop();
		$.ajax({  url: "driver/io_offline.php",
			data: {"pages": io.pages, "item": item, "val": JSON.stringify(val)},
			type: 'POST',
			dataType: 'json',
			cache: false
		})
		.done(function (response) {
			console.log('[io.offline] sending data: ["'+ item +'": '+ response[item].toString() + ']');
			if (item == io.listeners[item])
				widget.update(item, JSON.parse(response[item]));
			else {
				if (io.listeners[item]){
					console.log('[io.offline] updating item "' +io.listeners[item] + '"');
					widget.update(item, JSON.parse(response[item]));
					widget.update(io.listeners[item], JSON.parse(response[item]));
				}
			}

			if (timer_run) {
				io.start();
			}
		})
		.fail(notify.json)
	},

	/**
	 * Reads limited range of items in order to avoid php request overflow
	 */
	 getSlice: function(items) {
		// only if anyone listens
		if (items.length) {
			$.ajax({  url: 'driver/io_offline.php',
				data: {"pages": io.pages, "item": items},
				type: 'GET',
				dataType: 'json',
				async: true,
				cache: false
			})
			.done(function (response) {
				console.log('[io.offline] receiving data: ' + JSON.stringify(response).replace(/\\\"/g,''));
				// update all items	
				$.each(response, function (item, val) {
					// try to parse as JSON. Use raw value if this fails (value was likely saved before introdution of JSON.stringify in put)
					try {
						val = JSON.parse(response[item]);
					}
					catch(e) {}
					// initialize UZSU data if item is an UZSU item and no data available
					if (item.slice(-5).toLowerCase() == '.uzsu' && val == null) 
							val = {"active":"false", "interpolation": {"type": "none", "initialized": false, "interval": 5, "initage": 0, "itemtype": "bool"}, "list": [], "plugin_version": "2.0.0"}
					widget.update(item, val);
					if (item != io.listeners[item])
						widget.update(io.listeners[item], val);
				})
			})
			.fail(notify.json)
		}
	},

	/**
	 * Reads all values from bus and refreshes the pages
	 */
	all: function() {
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

		var allItems = Object.keys(io.listeners);
		var items;
		
		do {
			items = allItems.splice(0,100).join(',');
			io.getSlice(items);
		} while (allItems.length > 0); 

		// plots
		io.startseries();
		
		// logs
		widget.log().each(function (idx) {
			widget.update($(this).attr('data-item'), io.demolog($(this).attr('data-count')));
		});
	},

	/**
	 * Builds a series out of random float values
	 */
	demoseries: function (tmin, tmax, min, max, cnt, val) {

		var ret = Array();

		if (!min || isNaN(min)) {
			min = 0;
		}
		if (!max) {
			max = 255;
		}
		else if (isNaN(max)) { // boolean plot
			max = 1;
		}

		//tmin = new Date().getTime() - new Date().duration(tmin);
		//tmax = new Date().getTime() - new Date().duration(tmax);
		
		//synchronize timestamps for demoseries to the minute in order to allow stacked plots
		var actualTime = new Date()
		var actualMinute = Math.round(actualTime/60000) * 60000; 
		tmin = new Date (actualMinute) - new Date().duration(tmin);
		tmax = new Date (actualMinute) - new Date().duration(tmax);
		
		var step = Math.round((tmax - tmin) / (cnt-1));
		if(step == 0)
			step = 1;

		if(min == 0 && max == 1) { // boolean plot
			if(val === undefined)
				val = 0;
			while (tmin <= tmax) {
				val = (Math.random() < (0.2 + 0.6 * val)) ? 1 : 0; // make changes lazy
				ret.push([tmin, val]);
				tmin += step;
			}
		}
		else {
			var delta = (max - min) / 20;
			if(val === undefined)
				val = (min * 1) + ((max - min) / 2);

			while (tmin <= tmax) {
				var increment = Math.random() * (2 * delta) - delta;
				if (val + increment >= max || val + increment <= min)
					increment *= -1;
				val += increment;
				ret.push([tmin, val.toFixed(2) * 1.0]);
				tmin += step;
			}
		}

		return ret;
	},

	/**
	 * Builds a list out of random values
	 */
	demolog: function (count) {

		var ret = Array();
		var no;
		var levels = ['info', 'warning', 'error'];
		var messages = ['The heating ist to hot!', 'The heating ist to hot! Please switch it off!', 'The heating ist to hot! It will burn now!'];

		var tmin = new Date().getTime() - new Date().duration(count + 'i');
		var tmax = new Date().getTime();
		var step = Math.round((tmax - tmin) / count);

		while (tmin < tmax) {
			no = Math.floor((Math.random() * 3));
			ret.push({'time': Math.floor(tmin + (Math.random() * step * 0.2) - step * 0.1), 'level': levels[no], 'message': messages[no]});
			tmin += step;
		}

		return ret;
	},
	
	/**
	 * stop all subscribed series of a single plot or of all plots on the page
	 */
	stopseries: function (plotwidget) {
			if (plotwidget === undefined)
			plotWidgets = widget.plot();
		else
			plotWidgets = plotwidget;
	
		plotWidgets.each(function (idx) {
			var items = widget.explode($(this).attr('data-item'));
			for (var i = 0; i < items.length; i++) {
				if ((plotwidget == undefined) || (widget.plot(items[i]).length == 1)){
					clearTimeout(io.seriesTimer[items[i]]);
					console.log('[io_offline] cancelling series '+items[i]);
					if (plotwidget != undefined)
						delete widget.buffer[items[i]];
				}
			}
		});
	},
	
	/**
	 * start all subscribed series of a single plot or of all plots on the page
	 */
	startseries: function(plotwidget){
		var repeatSeries = function(item, tmin, tmax, ymin, ymax, cnt, step, startval) {
			var series = io.demoseries(tmin, tmax, ymin, ymax, cnt, startval);
			console.log('[io.offline] receiving series data ' + JSON.stringify(series) + ': '+ item, cnt)
			widget.update(item, series);

			if(step == null)
				step = Math.round((new Date().duration(tmin) - new Date().duration(tmax)) / cnt);
			var nextTime = -(new Date().duration(tmax).getTime() - step)/1000;
			var startval = series[series.length-1][1];
			io.seriesTimer[item] = setTimeout(function(){
				//repeatSeries(item, tmax, nextTime+"s", ymin, ymax, 1, step, startval);
				repeatSeries(item, tmax, tmax, ymin, ymax, 1, step, startval);
			}, step);
		}

		if (plotwidget === undefined)
			plotWidgets = widget.plot();
		else
			plotWidgets = plotwidget;
	
		plotWidgets.each(function (idx) {			
			var items = widget.explode($(this).attr('data-item'));
			for (var i = 0; i < items.length; i++) {
				var item = items[i].split('.');

				if ((plotwidget != undefined || widget.get(items[i]) == null) && (widget.checkseries(items[i]))) {

					var assign = ($(this).attr('data-assign') || "").explode();
					var yAxis = (assign[i] ? assign[i] - 1 : 0)

					var ymin = [];
					if ($(this).attr('data-ymin')) { ymin = $(this).attr('data-ymin').explode(); }

					var ymax = [];
					if ($(this).attr('data-ymax')) { ymax = $(this).attr('data-ymax').explode(); }

					repeatSeries(items[i], item[item.length - 3], item[item.length - 2], ymin[yAxis], ymax[yAxis], item[item.length - 1]);
				}
			}
		});
	}

};
