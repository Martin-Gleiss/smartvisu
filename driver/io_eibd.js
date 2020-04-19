/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Raik Alber and Martin Gleiss
 * @copyright   2013
 * @license     GPL [http://www.gnu.de]
 * @version        0.2
 * -----------------------------------------------------------------------------
 * @label       knxd / eibd
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
	init: function (adress, port) {
		io.adress = adress;
		io.port = port;
		io.stop();
	},

	/**
	 * Lets the driver work
	 */
	run: function (realtime) {
		// old items
		widget.refresh();

		// new items
		io.all(true);

		// run polling
		if (realtime) {
			io.start();
		}
	},


	// -----------------------------------------------------------------------------
	// C O M M U N I C A T I O N   F U N C T I O N S
	// -----------------------------------------------------------------------------
	// The function in this paragrah may be changed. They are all private and are
	// only be called from the public functions above. You may add or delete some
	// to fit your requerements and your connected system.

	timer: 0,
	timer_run: false,
	actualIndexNumber: -1,
	actualRequest: false,
	allDataReadTimer: 0,
	lastRequestStarted: 0,
	reloadAllDataTime: 1800,
	restartRequestTime: 60,

	checkRequest: function () {

		var thisTime = Math.floor($.now() / 1000);
		if (thisTime - io.restartRequestTime > io.lastRequestStarted) {
			io.actualRequest.abort();
			io.all();
		}
		if (thisTime - io.reloadAllDataTime > io.allDataReadTimer) {
			io.actualRequest.abort();
			io.all(true);
		}
		setTimeout('io.checkRequest()', 1000);
	},

	/**
	 * Start the real-time values. Can only be started once
	 */
	start: function () {
		if (!io.timer_run && widget.listeners().length) {

			io.timer_run = true;
			setTimeout('io.checkRequest()', 1000);
		}
	},

	/**
	 * Stop the real-time values
	 */
	stop: function () {
		clearTimeout(io.timer);
		io.timer_run = false;
	},

	convertData: function (inputData, dataType, direction) {

		var returnData = inputData;
		if (dataType === '9.xxx') {

			if (direction === 'from') {

				data = parseInt(inputData, 16).toString(10);
				wert = (data & 0x07ff);

				if ((data & 0x08000) != 0) {
					wert = wert | 0xfffff800;
					wert = wert * -1;
				}

				wert = wert << ((data & 0x07800) >> 11);

				if ((data & 0x08000) != 0) {
					wert = wert * -1;
				}
				returnData = wert / 100;

			}
			else {
				inputData = inputData * 100;

				var dpt9 = 0;
				var exponent = 0;

				if (inputData < 0) {
					dpt9 = 0x08000;
					inputData = -inputData;
				}
				while (inputData > 0x07ff) {
					inputData >>= 1;
					exponent++;
				}
				if (dpt9 != 0) {
					inputData = -inputData;
				}

				dpt9 |= inputData & 0x7ff;
				dpt9 |= (exponent << 11) & 0x07800;

				returnData = Number(dpt9 + 0x800000).toString(16);

				while (returnData.length < 5) {

					returnData = "0" + returnData;
				}

			}
		}
		else if (dataType === '1.001') {
			if (direction === 'to') {

				returnData = '8' + inputData;
			}
		}
		else if (dataType === '13.xxx') {

			returnData = parseInt(inputData, 16);
		}
		else if (dataType === '5.001') {

			if (direction === 'from') {

				returnData = inputData;
				//returnData = Math.round(parseInt(inputData, 10) / 2.55);


			}
			else if (direction === 'to') {

				returnData = inputData;
				returnData = Math.round(inputData * 2.55) + 0x8000;
				returnData = returnData.toString(16);
			}

		}
		return returnData;
	},

	/**
	 * Read a specific item from bus and add it to the buffer
	 */
	get: function (item) {

		$.ajax({ url: 'http://' + io.adress + ':' + io.port + '/cgi-bin/r?' + getForUrl,
			type: "GET",
			dataType: 'json',
			async: true,
			cache: false
		})
			.done(function (response) {
				widget.update(item, response[item]);
			})
			.error(notify.error('Driver: eibd', "Error reading item!"));
	},

	/**
	 * Write a value to bus
	 */
	put: function (item, val) {
		var timer_run = io.timer_run;

		io.stop();

		$.ajax({ url: 'http://' + io.adress + ':' + io.port + '/cgi-bin/w',
			data: ({a: io.getItemFromItem(item), v: io.convertData(val, io.getDataTypeFromItem(item), 'to'), ts: $.now()}),
			type: "GET",
			dataType: 'json',
			cache: false
		})
			.done(function (response) {
				widget.update(item, val);

				if (timer_run) {
					io.start();
				}
			})
			.error(notify.error('Driver: eibd', "Error writing item!"));
	},

	/**
	 * Reads all values from bus and refreshes the pages
	 */
	all: function (force) {
		var items = '';

		if (force) {
			io.actualIndexNumber = -1;
			io.allDataReadTimer = Math.floor($.now() / 1000);
		}

		io.lastRequestStarted = Math.floor($.now() / 1000);

		// only if anyone listens
		if (widget.listeners().length) {
			// prepare url
			var getForUrl = '';
			var counter = 0;

			var item = widget.listeners();
			for (var i = 0; i < item.length; i++) {
				if (counter > 0) {
					getForUrl = getForUrl + '&';
				}

				getForUrl = getForUrl + 'a=' + io.getItemFromItem(item[i]);
				counter++;
			}

			getForUrl = getForUrl + '&i=' + io.actualIndexNumber;

			io.actualRequest = $.ajax({ url: 'http://' + io.adress + ':' + io.port + '/cgi-bin/r?' + getForUrl,
				type: 'GET',
				dataType: 'json',
				async: true,
				cache: false
			})
				.done(function (response) {
					if (typeof(response) == 'object') {
						// these are the new values
						$.each(response, function (key, val) {
							if (key == 'i') {
								io.actualIndexNumber = val;
							}
							if (key == 'd') {
								$.each(val, function (id, value) {
									for (var i = 0; i < item.length; i++) {
										oneItem = item[i];
										if (io.getItemFromItem(oneItem) == id) {
											var dataType = io.getDataTypeFromItem(oneItem);
											value = io.convertData(value, dataType, 'from');
											widget.update(oneItem, value);
										}
									}

								});
							}
						})
						io.all();
					}
					else {
						notify.error('Driver: eibd', response);
					}
				})
		}
	},

	/** get Datatype from GA String
	 *
	 */
	getDataTypeFromItem: function (myItem) {

		itemArray = myItem.split('/');

		if (itemArray.length == 4) {

			dataType = itemArray[3];
		}
		else {

			dataType = '1.001';
		}
		return dataType;
		requestItem = itemArray[0] + '/' + itemArray[1] + '/' + itemArray[2];
	},

	/** get Item from GA String
	 *
	 */
	getItemFromItem: function (myItem) {

		itemArray = myItem.split('/');
		requestItem = itemArray[0] + '/' + itemArray[1] + '/' + itemArray[2];

		return requestItem;
	}

};
