/**
* -----------------------------------------------------------------------------
* @package     smartVISU
* @author      Massimo Saccani
* @copyright   2014
* @license     GPL [http://www.gnu.de]
* -----------------------------------------------------------------------------
*/


/**
 * Class for controlling all communication with a connected system. There are
 * simple I/O functions, and complex functions for real-time values.
 */
var io = {

    // the adress
    adress: '',

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
    },

    /**
	 * Does a write-request with a value
	 *
	 * @param      the item
	 * @param      the value
	 */
    write: function (item, val) {
        io.send(item + "=" + val + "\n");
        widget.update(item, val);
    },

    /**
	 * Trigger a logic
	 *
	 * @param      the logic
	 * @param      the value
	 */
    trigger: function (name, val) {
        io.send(name + "=" + val + "\n");

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
        io.open();
        io.CheckConnection();
    },

    /**
	 * Lets the driver work
	 */
    run: function (realtime) {
        // Aggiorno i widgets e carico i valori nuovi
        widget.refresh();
        io.ReadAll();


    },


    // -----------------------------------------------------------------------------
    // C O M M U N I C A T I O N   F U N C T I O N S
    // -----------------------------------------------------------------------------
    // The functions in this paragraph may be changed. They are all private and are
    // only be called from the public functions above. You may add or delete some
    // to fit your requirements and your connected system.

    /**
	 * This driver version
	 */
    version: 3,

    /**
	 * This driver uses a websocket
     19/07/2014 messo a true da false
	 */
    socket: true,

    tConn: 0,
    /**
    * Check the connection and automatically restore it if closed
    */
    CheckConnection: function () {
        // 19/07/2014 Messo a 3000 da 15000
        io.tConn = setTimeout('io.CheckConnection();', 3000);
        // Readystate:
        //CONNECTING 	0 	The connection is not yet open.
        //OPEN 	1 	The connection is open and ready to communicate.
        //CLOSING 	2 	The connection is in the process of closing.
        //CLOSED 	3 	The connection is closed or couldn't be opened.

        // Se il socket � chiuso, chiudo e riapro.
        if (io.socket.readyState != 0 && io.socket.readyState != 1) {
            io.close();
            io.open();
        }

    },

    /**
	 * Opens the connection and add some handlers
	 */
    open: function () {

        // Setup connection. Optional: put a password after the / (in this case, you need to handle it on the server)
        io.socket = new WebSocket('ws://' + io.address + ':' + io.port + "/somesecurity");


        //io.socket = new WebSocket('ws://echo.websocket.org'); 
        io.socket.onopen = function () {

            io.ReadAll();

        };

        io.socket.onmessage = function (event) {
            var item, val;
            var data = event.data;

            // Se i dati contengono un "|", vuol dire che il server sta trasmettendo un aggiornamento di tutti i GA
            data = data.replace(/\n$/, ""); // Tolgo l'ultimo \n
            if (data.indexOf("|") != -1) {
                // Estraggo tutti i GA=VALORE ed aggiorno i widget
                var arraydati = data.split("|");
                for (index = 0; index < arraydati.length; ++index) {
                    widget.update(arraydati[index].split("=")[0], arraydati[index].split("=")[1]);
                }
            } else {

                if (data.indexOf("=") != -1) {
                    // Ho un singolo GA=VALORE, aggiorno il widget
                    widget.update(data.split("=")[0], data.split("=")[1]);
                }
            }
        };

        io.socket.onerror = function (error) {
            notify.error('Driver: TCP', 'Could not connect to server!<br /> Retry... <br />' + error.data + '.');

        };

        io.socket.onclose = function () {
            notify.debug('Driver: TCP', 'Connection closed to server!<br /> Retry... ');

        };

    },

    /**
     * Sends data to the connected system
     */
    send: function (data) {
        if (io.socket.readyState == 1) {
            io.socket.send(data);

        }
    },

    /**
     * Recupero tutti i valori dei widgets e li aggiorno
     */
    ReadAll: function () {

        var items = "";
        if (widget.listeners().length) {
            var item = widget.listeners();
            for (var i = 0; i < widget.listeners().length; i++) {
                if (items.indexOf(item[i]) == -1) {
                    items += item[i] + '|';
                }
            }
            items = items.substr(0, items.length - 1); // Tolgo ultima virgola
            // Invio il telegramma
            if (io.socket.readyState == 1) {
                io.send(items + "=?\n");
            }
        }


    },




    /**
     * Closes the connection
     */
    close: function () {
        console.log("[io.genericTCP] close connection");

        if (io.socket.readyState > 0) {
            io.socket.close();
        }

        io.socket = null;
    }

};
