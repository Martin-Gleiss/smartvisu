/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiss
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @hide        driver_address
 * @hide        driver_port
 * @hide        driver_autoreconnect
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
		io.get(item);
	},

	/**
	 * Does a write-request with a value
	 *
	 * @param      the item
	 * @param      the value
	 */
	write: function (item, val) {
		io.put(item, val);
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
		io.stop();
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
			data: {"item": item},
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
			data: {"item": item, "val": JSON.stringify(val)},
			type: 'POST',
			dataType: 'json',
			cache: false
		})
		.done(function (response) {
			widget.update(item, JSON.parse(response[item]));

			if (timer_run) {
				io.start();
			}
		})
		.fail(notify.json)
	},

	/**
	 * Reads all values from bus and refreshes the pages
	 */
	all: function () {
		var items = widget.listeners().join(',');

		// only if anyone listens
		if (items.length) {
			$.ajax({  url: 'driver/io_offline.php',
				data: {"item": items},
				type: 'GET',
				dataType: 'json',
				async: true,
				cache: false
			})
			.done(function (response) {
				// update all items	
				$.each(response, function (item, val) {
					// try to parse as JSON. Use raw value if this fails (value was likely saved before introdution of JSON.stringify in put)
					try {
						val = JSON.parse(response[item]);
					}
					catch(e) {}
					widget.update(item, val);
				})
			})
			.fail(notify.json)
		}

		// plots
		var repeatSeries = function(item, tmin, tmax, ymin, ymax, cnt, step, startval) {
			var series = io.demoseries(tmin, tmax, ymin, ymax, cnt, startval);
			widget.update(item, series);

			if(step == null)
				step = Math.round((new Date().duration(tmin) - new Date().duration(tmax)) / cnt);
			var nextTime = -(new Date().duration(tmax).getTime() - step)/1000;
			var startval = series[series.length-1][1];

			setTimeout(function(){
				//repeatSeries(item, tmax, nextTime+"s", ymin, ymax, 1, step, startval);
				repeatSeries(item, tmax, tmax, ymin, ymax, 1, step, startval);
			}, step);
		}

		widget.plot().each(function (idx) {
			var items = widget.explode($(this).attr('data-item'));

			for (var i = 0; i < items.length; i++) {
				var item = items[i].split('.');

				if (widget.get(items[i]) == null && (widget.checkseries(items[i]))) {

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

		tmin = new Date().getTime() - new Date().duration(tmin);
		tmax = new Date().getTime() - new Date().duration(tmax);
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
				val += Math.random() * (2 * delta) - delta;
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
	}

};
