/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß, Martin Sinn, Wolfram v. Hülsen
 * @copyright   2012 - 2026
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @label       SmartHomeNG
 *
 * @default     driver_autoreconnect   true
 * @default     driver_port            2424
 * @default     driver_tlsport         2425
 * @hide        reverseproxy
 * @hide        driver_realtime
 * @hide        driver_consoleport
 * @hide        driver_consoleusername
 * @hide        driver_consolepassword
 * @hide        driver_ssl
 * @hide        driver_username
 * @hide        driver_password
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
     * The read method is empty since items are subscribed 
     * using the monitor method and updated by websocket events
     *
     * @param      the item
     */
    read: function (item) {
    },

    /**
     * Does a write-request with a value
     * and updates all listening widgets if driver is not configured to wait for the backends answer
     *
     * @param      the item - can be plain "myItem" (rw) or combined "myStatusItem:myControlItem" (r:w)
     * @param      the value
     */
    write: function (item, val) {
        // identify the control item to send to
        var sendItemPos = item != undefined ? item.indexOf(':') : 0;
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
     * Driver config parameters in php (config_driver_<option>) are globally available in javaScript as sv.config.driver.<option>
     * 
     * The client knows the called URL from the browser line (location.hostname)
     *   - if the hostname is an IPv4 address it's easy: just use this for the websocket connection with the configured ports
     *   - otherwise we need to distinguish beetween two possible scenarios:
     *     a) hostname is the internal hostname of the smartVISU server (config_sv_hostname) or an alternative name specified as config_driver_address2: 
     *        -> use this name for the websocket connection with the configured ports
     *     b) hostname is not registered in the configuration so we assume it is an external address used to connect a reverse proxy
     *        -> clear io.address and use the external address with ports 80 or 443 which the reverse proxy will translate into the correct internal addresses
     */
    init: function () {
        io.address = sv.config.driver.address;

        if (!$.isNumeric(location.hostname.split('.').join(''))) {  // replaceAll() does not work for old browsers
            if (sv.config.driver.address2 && sv.config.driver.address2 !='' && location.hostname == sv.config.driver.address2)
                io.address = sv.config.driver.address2;
            else if ( location.hostname != sv.config.svHostname ) 
                io.address = '';
        } 
        clearTimeout(io.pingTimer);
        io.socketState = '';
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

    /**
     * The ping method can be used to keep the connection open on devices with agressivly configured websocket timeouts. It is not active by default.
     * Manually specify the paramater "ping_interval" in config.ini with an integer number representing the time in seconds to activate it. 
     */
    pingTimer: null,
    pingInterval: null,
    socketState: '',

    ping: function(){
        io.socketState = 'pinging';
        console.log('[io.smarthomeng] starting ping');
        io.send({"cmd":"ping"});
        io.pingTimer = setTimeout(function(){
            io.socketState = 'offline';
            console.log('[io.smarthomeng] no answer on ping');
        },2000);
    },


    // -----------------------------------------------------------------------------
    // C O M M U N I C A T I O N   F U N C T I O N S
    // -----------------------------------------------------------------------------
    // The functions in this paragraph are subject to change. They are private and may
    // only be called from the public functions above. 

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
     * Properties for the websocket connection
     */
    socket: false,
    server: '', 
    opentime: null,

    /**
     * Properties for the status of transmitted data
     */
    triggerqueue: [],
    listeners: [],
    monitorComplete: null,
    openItems: [],    

    /**
     * Opens the connection and adds the event handlers for the communication
     * The websocket protocol is adapted to the current protocol (https -> wss and http -> ws)
     * unless it is forced to a certain protocol by adding this as prefix to the driver address in the config page
     * The port can be forced by specifying it in the URL.
     */
    open: function () {
        var protocol = '';
        var ports = [];
        // assign configured ports to the protocol variants
        if (io.address){
            // use configured ports if connection is internal
            ports['ws://']  = sv.config.driver.port;
            ports['wss://'] = sv.config.driver.tlsport;
        } else {
            // use forced or standard ports if connection is external
            ports['ws://']  = location.port != '' ? location.port : 80;
            ports['wss://'] = location.port != '' ? location.port : 443;

            // and use URL of current page as driver address if connection is external
            io.address = location.hostname;
        }

        // if websocket protocol is not forced 
        if (io.address.indexOf('://') < 0) {
            // adopt websocket security from URL
            protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
            io.port = ports[protocol]; 
        }
        else {
            // use forced protocol (identified in address)
            io.port = ports[io.address.substr(0, io.address.indexOf(':'))+'://'];
        }
        // DEBUG:
        console.log("[io.smarthomeng] opening websocket on "+ protocol + io.address + ':' + io.port);

        // now start the websocket
        io.socket = new WebSocket(protocol + io.address + ':' + io.port);

        // websocket event handlers
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
            // stop ping timers and reactivate interval if ping is configured
            clearTimeout(io.pingTimer);
            clearTimeout(io.pingInterval);
            io.socketState = 'running';
            if (sv.config.pingInterval > 0)
                io.pingInterval = setTimeout(io.ping, sv.config.pingInterval * 1000);

            // process the received data
            var item, val;
            var data = JSON.parse(event.data);
            // DEBUG:
            console.log("[io.smarthomeng] receiving data: ", event.data);

            switch (data.cmd) {
                case 'item':
                    for (var i = 0; i < data.items.length; i++) {
                        item = data.items[i][0];
                        val = data.items[i][1];

                        // convert binary
                        if (val === false) {
                            val = 0;
                        }
                        if (val === true) {
                            val = 1;
                        }
                        // convert datetime object
                        if (isISODate(val))
                            val = new Date(val);
                        widget.update(item, val);
                        io.openItems.removeEntry(item);
                        // update also widgets listening on combined status:control items based on the actual item
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
                        
                        // workaround for shNG bug which sends updates for all registered memlogs instead of only the ones requested by smartVISU
                        if (log == undefined) {
                            console.log('[io.smarthomeng] ignoring data for not requested log "' + data.name + '"');
                            break;
                        }

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
     * Monitors the items, series and logs:
     *   - sends subscription commands to the backend
     *   - registers subscribed items, series and logs in "io.openItems" where they are individually removed when the first update is received
     *   - starts signalling "driver busy" if configured (blinking VISU-Symbol)
     *
     *   Items can be plain "myItem" (rw) or combined "myStatusItem:myControlItem" (r:w)
     *   The monitored items are stored in an associative array "io.listeners" using the backends item as key and the smartVISU item as value.
     *   So each entry is either io.listeners['myItem'] = 'myItem' or io.listeners['myStatusItem'] = 'myStatusItem:myControlItem'
     */
    monitor: function () {
        io.monitorCompleted = false;
        // subscribe all items used on the page or cancel subscription by sending an empty array 
        var listeners = widget.listeners();
        // prepare the associative array of items we listen to as keys
        io.listeners = [];
        var listenItem;
        var listenItemEnd;
        for (var i=0; i < listeners.length; i++){
            listenItemEnd = listeners[i].indexOf(':');
            listenItem = (listenItemEnd == -1 ? listeners[i] : listeners[i].substring(0, listenItemEnd));
            if ( io.listeners[listenItem] == undefined || listenItem == io.listeners[listenItem])
                io.listeners[listenItem] = listeners[i];
        }
        // now send the item subscription command
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
