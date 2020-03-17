/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Patrik Germann
 * @copyright   2020
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


/**
 * Class for controlling all communication with a connected system. There are
 * simple I/O functions, and complex functions for real-time values.
 */
var io = {

	// the URL
	url: '',


	// -----------------------------------------------------------------------------
	// P U B L I C   F U N C T I O N S
	// -----------------------------------------------------------------------------

	/**
	 * Does a read-request and adds the result to the buffer
	 *
	 * @param      the item
	 */
	read: function (item) {
		$.ajax({
            url : io.url + 'items/' + item + '/state',
            type : "GET",
            async : true,
            cache : false
		}).done(function(val) {
            widget.update(item, io.transval[val] ? io.transval[val] : val);
        }).error(notify.json);
	},

	/**
	 * Does a write-request with a value
	 *
	 * @param      the item
	 * @param      the value
	 */
	write: function (item, val) {
		if (val == 0 || val == 1) {
			var transval = new Array();
			var elementID = $(event.currentTarget).attr('id');
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
					if (elementID.slice(-4) == 'plus' || elementID.slice(-5) == 'minus') {
						transval[0] = "DECREASE";
						transval[1] = "INCREASE";
					}
				break;
				case "Rollershutter":
					transval[0] = "UP";
					transval[1] = "DOWN";
					if (elementID.slice(-2) == 'up' || elementID.slice(-4) == 'down') {
						transval[0] = "UP";
						transval[1] = "DOWN";
					} else if (elementID.slice(-5) == 'start' || elementID.slice(-4) == 'stop') {
						transval[0] = "STOP";
						transval[1] = "START";
					} else if (elementID.slice(-4) == 'plus' || elementID.slice(-5) == 'minus') {
						transval[0] = "DECREASE";
						transval[1] = "INCREASE";
					}
				break;
				case "Player":
					transval[0] = "PAUSE";
					transval[1] = "PLAY";
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
			if (transval[val]) {
				val = transval[val];
			}
		}
		
		
		$.ajax({
            url			: io.url + 'items/' + item,
            data		: val.toString(),
            method		: "POST",
            contentType	: "text/plain",
            cache		: false
		}).error(notify.json);
	},

	/**
	 * Trigger a logic
	 *
	 * @param      the logic
	 * @param      the value
	 */
	trigger: function (name, val) {
		
	},

	/**
	 * Initializion of the driver
	 *
	 * @param      the ip or url to the system (optional)
	 * @param      the port on which the connection should be made (optional)
	 */
	init: function (address, port) {
		io.url = "http://" + address + (port ? ":" + port : '') + "/rest/";
	},

	/**
	 * Lets the driver work
	 */
	run: function (realtime) {
		io.stop();

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
					widget.update(item, io.transval[ohItem.state] ? io.transval[ohItem.state] : ohItem.state);
				}).error(notify.json);
            }
        }
		
        io.plot.init();

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

	transval : {
		null		: "0",
		"NULL"		: "0",
		"OFF"		: "0", "ON"			: "1",
		"CLOSED"	: "0", "OPEN"		: "1",
		"PAUSE"		: "0", "PLAY"		: "1",
		"REWIND"	: "0", "FASTFORWARD": "1"
	},
	itemType: new Array(),
	eventListener: false,

    /**
     * Start the real-time values. Can only be started once
     */
	start: function () {
		io.eventListener = new EventSource(io.url + "events?topics=smarthome/items/*/statechanged");
		io.eventListener.onmessage = function(message) {
			var event = JSON.parse(message.data);
			if (event.type === 'ItemStateChangedEvent') {
				var item = event.topic.split('/')[2];
				if (widget.listeners().includes(item)) {
					var val = JSON.parse(event.payload).value
					widget.update(item, io.transval[val] ? io.transval[val] : val);
				}
				if (io.plot.listeners[item] && Date.now() - io.plot.items[io.plot.listeners[item]] > io.plot.timer * 1000) {
					io.plot.refresh(io.plot.listeners[item]);
				}
			}
		}
	},


    /**
     * Stop the real-time values
     */
    stop : function() {
		if (io.eventListener.readyState == 0 || io.eventListener.readyState == 1) {
			io.eventListener.close();
		}
    },

	
	plot : {
		items : new Array(),
		listeners : new Array(),
		timer : 60,
		
		init : function() {
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


		refresh : function(plotItem) {
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
						var val = io.transval[data.state] ? io.transval[data.state] : data.state
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
				widget.update(plotItem, plotData);
			}).error(notify.json);
		}
	}
}
