/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiss
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @label       Drivername
 *
 * Define here neccessary configuration fields, they are available as global variable like sv.config.driver.fieldname
 * @config      address     backend    input
 * @config      port        backend    input
 * @config      realtime    backend    flip     true
 */


/**
 * Class for controlling all communication with a connected system. There are
 * simple I/O functions, and complex functions for real-time values.
 */
var io = {

	// -----------------------------------------------------------------------------
	// P U B L I C   F U N C T I O N S
	// -----------------------------------------------------------------------------

	/**
	 * Does a read-request and adds the result to the buffer
	 *
	 * @param      the item
	 */
	read: function (item) {
		// TODO
	},

	/**
	 * Does a write-request with a value
	 *
	 * @param      the item
	 * @param      the value
	 */
	write: function (item, val) {
		// TODO
	},

	/**
	 * Trigger a logic
	 *
	 * @param      the logic
	 * @param      the value
	 */
	trigger: function (name, val) {
		// TODO
	},

	/**
	 * Initializion of the driver
	 *
 	 * Driver config parameters are globally available as from v3.2
	 */
	init: function () {
		// TODO
	},

	/**
	 * Lets the driver work
	 */
	run: function () {
		// TODO   
	},


	// -----------------------------------------------------------------------------
	// C O M M U N I C A T I O N   F U N C T I O N S
	// -----------------------------------------------------------------------------
	// The functions in this paragraph may be changed. They are all private and are
	// only be called from the public functions above. You may add or delete some
	// to fit your requirements and your connected system.

	// TODO

	/**
	 * stop all subscribed series
	 */
	stopseries: function () {
		// TODO
		$.noop;
	}
}
