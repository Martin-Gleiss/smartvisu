/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiss
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @label       JSON
 * @hide		driver_tlsport
 * @hide        driver_autoreconnect
 * @hide		reverseproxy
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
	 * Driver config parameters are globally available as from v3.2
	 */
	init: function () {
		io.address = sv.config.driver.address;
		io.port = sv.config.driver.port;
		io.stop();
	},

	/**
	 * Let the driver work
	 */
	run: function () {
		// refresh all widgets with values from the buffer
		widget.refresh();

		// get item updates from the backend
		io.all();

		// run polling
		if (sv.config.driver.realtime) {
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
			io.timer = setTimeout('io.loop(); io.all();', 1000);
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
		$.ajax({  url: "driver/io_json.php",
			data: ({item: item}),
			type: "GET",
			dataType: 'json',
			async: true,
			cache: false
		})
			.done(function (response) {
				widget.update(item, response[item]);
			})
			.fail(notify.json);
	},

	/**
	 * Write a value to bus
	 */
	put: function (item, val) {
		var timer_run = io.timer_run;

		io.stop();
		$.ajax
		({  url: "driver/io_json.php",
			data: ({item: item, val: val}),
			type: "GET",
			dataType: 'json',
			cache: false
		})
			.done(function (response) {
				widget.update(item, response[item]);

				if (timer_run) {
					io.start();
				}
			})
			.fail(notify.json);
	},

	/**
	 * Reads all values from bus and refreshes the pages
	 */
	all: function () {
		var items = '';

		// only if anyone listens
		if (widget.listeners().length) {
			// prepare url
			var item = widget.listeners();
			for (var i = 0; i < widget.listeners().length; i++) {
				items += item[i] + ',';
			}
			items = items.substr(0, items.length - 1);

			$.ajax({  url: 'driver/io_json.php',
				data: ({item: items}),
				type: 'POST',
				dataType: 'json',
				async: true,
				cache: false
			})
				.done(function (response) {
					$.each(response, function (item, val) {
						widget.update(item, val);
					})
				})
				.fail(notify.json);
		}
	},
	
	/**
	 * stop all subscribed series
	 */
	stopseries: function () {
		// TODO
		$.noop;
	}

};
