/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß, Patrik Germann
 * @copyright   2012 - 2020
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @label       openHAB2
 */

/**
 * Class for controlling all communication with a connected system. There are
 * simple I/O functions, and complex functions for real-time values.
 */
var io = {

	// the URL
	url: '',

    // the debug switch
    debug: false,

	// -----------------------------------------------------------------------------
	// P U B L I C   F U N C T I O N S
	// -----------------------------------------------------------------------------

	/**
	 * Does a read-request and adds the result to the buffer
	 *
	 * @param      the item
	 */
	read: function (item) {
		io.debug && console.debug("io.read(item = " + item + ")");
		
		$.ajax({
            url : io.url + 'items/' + item + '/state',
            type : "GET",
            async : true,
            cache : false
		}).done(function(state) {
			var val = io.convertState(item, state);
			io.debug && console.debug("io.read: widget.update(item = " + item + ", value = " + val + ")");
            widget.update(item, val);
			if (io.plot.listeners[item] && Date.now() - io.plot.items[io.plot.listeners[item]] > io.plot.timer * 1000) {
				io.plot.refresh(io.plot.listeners[item]);
			}
        }).error(notify.json);
	},

	/**
	 * Does a write-request with a value
	 *
	 * @param      the item
	 * @param      the value
	 */
	write: function (item, val) {
		io.debug && console.debug("io.write(item = " + item + ", val = " + val + ")");

		var transval = new Array();
		switch (io.itemType[item]) {
			case "Switch":
				transval[0] = "OFF";
				transval[1] = "ON";
			break;
			case "Contact":
				transval[0] = "CLOSED";
				transval[1] = "OPEN";
			break;
			case "Dimmer":
				transval[0] = "OFF";
				transval[1] = "ON";
				if (val > 1) {
					transval[val] = Math.round(val / 255 * 100);
				}
			break;
			case "Rollershutter":
				transval[0] = "UP";
				transval[1] = "STOP";
				transval[255] = "DOWN";
				if (val > 1 && val < 255) {
					transval[val] = Math.round(val / 255 * 100);
				}
			break;
			case "Player":
				transval[0] = "PAUSE";
				transval[1] = "PLAY";
				var elementID = false;
				if ($(event.currentTarget).attr('id')) {
					elementID = $(event.currentTarget).attr('id');
				} else if($(event.currentTarget.parentElement).find("span:first-of-type").attr('id')) {
					elementID = $(event.currentTarget.parentElement).find("span:first-of-type").attr('id');
				}
				if (elementID.slice(-4) == 'stop' || elementID.slice(-4) == 'play') {
					transval[0] = "PAUSE";
					transval[1] = "PLAY";
				} else if (elementID.slice(-4) == 'prev' || elementID.slice(-4) == 'next') {
					transval[0] = "PREVIOUS";
					transval[1] = "NEXT";
				} else if (elementID.slice(-3) == 'rew' || elementID.slice(-2) == 'ff') {
					transval[0] = "REWIND";
					transval[1] = "FASTFORWARD";
				}
			break;
		default:
		}

		var state = (val in transval) ? transval[val] : val;

		$.ajax({
            url			: io.url + 'items/' + item,
            data		: state.toString(),
            method		: "POST",
            contentType	: "text/plain",
            cache		: false
		}).success(function() {
			if (io.refreshIntervall) {
				widget.update(item, val);
			}
		}).error(notify.json);

	},

	/**
	 * Trigger a logic
	 *
	 * @param      the logic
	 * @param      the value
	 */
	trigger: function (name, val) {
		io.debug && console.debug("io.trigger(name = " + name + ", val = " + val + ")");
	},

	/**
	 * Initializion of the driver
	 *
	 * @param      the ip or url to the system (optional)
	 * @param      the port on which the connection should be made (optional)
	 */
	init: function (address, port) {
		io.debug && console.debug("io.init(address = " + address + ", port = " + port + ")");
		
		io.url = "http://" + address + (port ? ":" + port : '') + "/rest/";
	},

	/**
	 * Lets the driver work
	 */
	run: function (realtime) {
		console.info("Type 'io.debug=true;' to console to see more details.");
		io.debug && console.debug("io.run(realtime = " + realtime + ")");
		
		if (io.eventListener.readyState == 0 || io.eventListener.readyState == 1) {
			io.eventListener.close();
		}
		if (io.refreshIntervall) {
			clearTimeout(io.refreshIntervall);
			io.refreshIntervall = false;
		}

        if (widget.listeners().length) {
            var items = widget.listeners();
            for (var i = 0; i < widget.listeners().length; i++) {
				$.ajax({
					url		: io.url + 'items/' + items[i],
					type	: "GET",
					async	: true,
					cache	: false
				}).done(function(ohItem) {
					var item = ohItem.name;
					io.itemType[item] = ohItem.type;
					var val = io.convertState(item, ohItem.state);
					io.debug && console.debug("io.run: widget.update(item = " + item + ", value = " + val + ")");
					widget.update(item, val);
				}).error(notify.json);
            }
        }
		
        io.plot.init();

		if (realtime) {
			if (typeof EventSource == 'function') {
				io.eventListener = new EventSource(io.url + "events?topics=smarthome/items/*/statechanged");
				io.eventListener.onmessage = function(message) {
					var event = JSON.parse(message.data);
					if (event.type === 'ItemStateChangedEvent') {
						var item = event.topic.split('/')[2];
						if (widget.listeners().includes(item)) {
							var val = io.convertState(item, JSON.parse(event.payload).value);
							io.debug && console.debug("io.start.event: widget.update(item = " + item + ", value = " + val + ")");
							widget.update(item, val);
						}
						if (io.plot.listeners[item] && Date.now() - io.plot.items[io.plot.listeners[item]] > io.plot.timer * 1000) {
							io.plot.refresh(io.plot.listeners[item]);
						}
					}
				}
			} else {
				if (!io.refreshIntervall && widget.listeners().length) {
					io.refreshIntervall = setInterval(function() {
						var item = widget.listeners();
						for (var i = 0; i < widget.listeners().length; i++) {
							io.read(item[i]);
						}
					}, io.timer * 1000);
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

	itemType: new Array(),
	eventListener: false,
	refreshIntervall: false,
	timer: 1,

	convertState: function (item, state) {
		io.debug && console.debug("io.convertState(item = " + item + ", state = " + state + ")");
		
		var transval = {
			"NULL"	: 0,
			"OFF"	: 0, "ON"			: 1,
			"CLOSED": 0, "OPEN"			: 1,
			"PAUSE"	: 0, "PLAY"			: 1,
			"REWIND": 0, "FASTFORWARD"	: 1
		}

		switch (io.itemType[item]) {
			case "Color":
				return state == "NULL" ? "0,0,0" : state;
			case "Dimmer":
			case "Rollershutter":
				return Math.round((state in transval) ? transval[state] : state / 100 * 255);
			default:
				return (state in transval) ? transval[state] : state;
		}
	},

	plot: {
		items: new Array(),
		listeners: new Array(),
		timer: 10,
		
		init: function() {
			io.debug && console.debug("io.plot.init()");
			
			io.plot.listeners = new Array();
			widget.plot().each(function(idx) {
				var items = widget.explode($(this).attr('data-item'));
				for (var i = 0; i < items.length; i++) {
					var plotItem = items[i];
					var pt = plotItem.split('.');
					if (!io.plot.items[plotItem] && (pt instanceof Array) && widget.checkseries(plotItem)) {
						if (pt[3] == 'now') {
							io.plot.listeners[pt[0]] = plotItem;
						}
						io.plot.refresh(plotItem);
						io.plot.items[plotItem] = true;
					}
				}
			});
		},

		refresh: function(plotItem) {
			io.debug && console.debug("io.plot.refresh(plotItem = " + plotItem + ")");
			
			var pt = plotItem.split('.');
			var item = pt[0];
			var tmin = new Date().duration(pt[2]);
			var tmax = pt[3];
		
			var starttime = new Date(Date.now() - tmin);
			var url = io.url + "persistence/items/" + item + "?starttime=" + starttime.toISOString();
			
			if (tmax != 'now') {
				tmax = new Date().duration(pt[3]);
				var endtime = new Date(new Date() - tmax);
				url += "&endtime=" + endtime.toISOString();
			}

			$.ajax({
				url : url,
				type : 'GET',
				dataType : 'json',
				async : false,
				cache : false
			}).done(function(persistence) {
				var plotData = new Array();
				if (persistence.data.length > 0) {
					$.each(persistence.data, function(key, data) {
						var val = io.convertState(item, data.state);
						if (isNaN(val)) {
							val = 0;
						} else if (Number(val) == val && val % 1 !== 0) { //isFloat
							val = parseFloat(val).toFixed(2);
						}
						plotData.push([data.time, parseFloat(val)]);
					})
					plotData.sort(function(a, b) {
						return a[0] - b[0];
					});
				} else {
					plotData.push([Date.parse(starttime), 0]);
					plotData.push([endtime ? Date.parse(endtime) : Date.now(), 0])
				}
				io.plot.items[plotItem] = Date.now();
				io.debug && console.debug("io.plot.refresh: widget.update(plotItem = " + plotItem + ", plotData = " + plotData + ")");
				widget.update(plotItem, plotData);
			}).error(notify.json);
		}
	}
}
