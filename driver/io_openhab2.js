/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @label       openHAB2
 */

/**
 * Class for controlling all communication with a connected system. There are
 * simple I/O functions, and complex functions for real-time values.
 */
var io = {

    // the adress
    address : '',

    // the port
    port : '',

    // the debug switch
    debug : false,

    // -----------------------------------------------------------------------------
    // P U B L I C F U N C T I O N S
    // -----------------------------------------------------------------------------

    /**
     * Does a read-request and adds the result to the buffer
     *
     * @param the
     *            item
     */
    read : function(item) {
        io.get(item);
    },

    /**
     * Does a write-request with a value
     *
     * @param the
     *            item
     * @param the
     *            value
     */
    write : function(item, val) {
        io.put(item, val);
    },

    /**
     * Trigger a logic
     *
     * @param the
     *            logic
     * @param the
     *            value
     */
    trigger : function(name, val) {
        // not supported
    },

    /**
     * Initializion of the driver
     *
     * @param the
     *            ip or url to the system (optional)
     * @param the
     *            port on which the connection should be made (optional)
     */
    init : function(address, port) {
        io.address = address;
        io.port = port;
        io.stop();
    },

    /**
     * Lets the driver work
     */
    run : function(realtime) {
        console.info("Type 'io.debug=true;' to console to see more details.");

        // old items
        widget.refresh();

        // Get items states. In realtime mode io.all gets called
        // when the event listener is in place. So no events get lost.
        if (! realtime)
            io.all();
        io.allPlots();

        // run polling
        if (realtime) {
            io.start();
        }
    },

    // -----------------------------------------------------------------------------
    // C O M M U N I C A T I O N F U N C T I O N S
    // -----------------------------------------------------------------------------
    // The function in this paragraph may be changed. They are all private and
    // are
    // only be called from the public functions above. You may add or delete
    // some
    // to fit your requirements and your connected system.

    plotItems: Array(),

    /**
     * Start the real-time values. Can only be started once
     */
    start : function() {
        if (typeof EventSource == 'function') {
            var me = this;
            var url = "http://" + io.address + ":" + io.port + "/rest/events?topics=smarthome/items/*/state";
            var eventSource = new EventSource(url);

            eventSource.addEventListener('message', function(eventPayload) {

                var event = JSON.parse(eventPayload.data);

                if (['ItemStateEvent', 'GroupItemStateChangedEvent'].indexOf(event.type) > -1) {
                    var payload = JSON.parse(event.payload);

                    var ohItem = event.topic.split('/')[2];
                    var payloadType = payload.type;

                    var items = io.getItemsFromOHItem(ohItem, payloadType);

                    if(Array.isArray(items)) {
                        items.forEach(function(item) {

                            var valConverted = io.convertFromOH(item, payload.value);
                            io.debug && console.info("Update widget item '" + item + "' to value '" + valConverted + "' from state '" + payload.value + "' received for ohab item '" + ohItem + "'.");
                            widget.update(item, valConverted);

                            // Check if this is a plot item
                            me.plotItems.forEach(function(plotItem) {
                                var pt = plotItem.split('.');
                                if (item === pt[0]) {
                                    var data = [[new Date().getTime(), parseFloat(valConverted)]];
                                    io.debug && console.info("Update plot item '" + plotItem + "' by '" + data + "' from state '" + payload.value + "' received for ohab item '" + ohItem + "'.");
                                    widget.update(plotItem, data);
                                }
                            });
                        });

                        io.debug && items.length === 0 && console.log("Received event for unused ohab item '" + ohItem + "': " + JSON.stringify(event));
                    }

                }
            });

            eventSource.addEventListener('open', function(e) {
                var state = "in unknown (" + this.readyState + ") state";

                switch(this.readyState) {
                    case EventSource.CONNECTING:
                        state = "connecting";
                        break;
                    case EventSource.OPEN:
                        state = "open";
                        break;
                    case EventSource.CLOSED:
                        state = "closed";
                        break;
                }

                console.info("Stream " + this.url + " is now " + state  + ".");

                io.all();   // update all items to current state
            });

            eventSource.addEventListener('close', function(e) {
                console.error("Stream " + this.url + " closed.");
            });
        } else {
            var msg = "Your browser doesn't support EventSource. Cannot connect to ohab SSE API. Item states are polled only once at page load!";
            console.error(msg);
            notify.warning("No EventSource support", msg);
            io.all();
        }
    },

    /**
     * Stop the real-time values
     */
    stop : function() {
    },

    /**
     * Read a specific item from bus and add it to the buffer
     */
    get : function(item) {
        var url = "http://" + io.address + ":" + io.port + "/rest/items/" + io.getOHItemFromItem(item) + "/state";

        $.ajax({
            url : url,
            type : "GET",
            async : true,
            cache : false
        }).done(function(response) {
            widget.update(item, response);
        }).error(notify.json);
    },

    /**
     * Write a value to bus
     */
    put : function(item, val) {
        var timer_run = io.timer_run;
        var url = "http://" + io.address + ":" + io.port + "/rest/items/" + io.getOHItemFromItem(item);

        io.stop();
        $.ajax({
            url : url,
            data : io.convertToOH(item, val),
            method : "POST",
            contentType : "text/plain",
            cache : false
        }).success(function() {
            widget.update(item, val);
            if (timer_run) {
                io.start();
            }
        }).error(notify.json);
    },

    convertToOH : function(item, val) {
        var type = io.getTypeFromItem(item);
        var ohVal = val;

        switch (type) {
        case "Switch":
            if (val == 0)
                ohVal = "OFF";
            else
                ohVal = "ON";
            break;
        case "Contact":
            if (val == 1)
                ohVal = "CLOSED";
            else
                ohVal = "OPEN";
            break;
        }

        return ohVal;
    },

    convertFromOH : function(item, ohVal) {
        var type = io.getTypeFromItem(item);
        var val = ohVal;

        switch (type) {
        case "Switch":
            if (ohVal == "ON"
                || Number.parseFloat(ohVal) > 0)
                val = 1;
            else
                val = 0;
            break;
        case "Contact":
            if (ohVal == "CLOSED")
                val = 1;
            else if (ohVal == "OPEN")
                val = 0;
            break;
        }

        return val;
    },

    getTypeFromItem : function(item) {
        var itemArray = item.split(":");

        var type = "Unknown";

        if (itemArray.length == 2) {
            type = itemArray[0]
        }

        // console.log("Determined item type: " + type);

        return type;
    },

    getOHItemFromItem : function(item) {
        var itemArray = item.split(":");

        var ohItem = item;

        if (itemArray.length == 2) {
            ohItem = itemArray[1]
        }

        // console.log("Determined Openhab item: " + ohItem);

        return ohItem;
    },

    getHashOfWidgetItems : function() {
        var widgetItems = widget.listeners();

        return widgetItems.reduce(function (map, value, index, arr) { map[value] = 1; return map; }, {});
    },

    getItemsFromOHItem : function(ohItem, type, hashOfWidgetItems) {
        var posItemNames = new Array();

        switch (type) {
        case "Switch":
            posItemNames.push("Switch:" + ohItem);
            break;
        case "OnOff":
            posItemNames.push("Switch:" + ohItem);
            break;
        case "Contact":
            posItemNames.push("Contact:" + ohItem);
            break;
        case "OpenClosed":
            posItemNames.push("Contact:" + ohItem);
            break;
        case "Dimmer":
            posItemNames.push(ohItem);
            posItemNames.push("Switch:" + ohItem);
            break;
        case "Rollershutter":
            posItemNames.push(ohItem);
            posItemNames.push("Move:" + ohItem);
            break;
        case "Percent":
            posItemNames.push(ohItem);
            posItemNames.push("Switch:" + ohItem); // Send to widget items of type Switch too. A value > 0 is interpreted as ON, any other value as OFF. Usefull for dimmers.
        default:
            posItemNames.push(ohItem);
        }

        // Now check out which of the possible item names are defined in widgets
        if(hashOfWidgetItems == null)
            hashOfWidgetItems = io.getHashOfWidgetItems();

        var items = posItemNames.reduce(function (listOfItems, value, index, arr) { if(hashOfWidgetItems[value]) listOfItems.push(value); return listOfItems; }, []);

        return items;
    },

    /**
     * Reads all values from bus and refreshes the pages
     */
    all : function() {
        hashOfWidgetItems = io.getHashOfWidgetItems();

        // only if anyone listens
        if (Object.keys(hashOfWidgetItems).length > 0) {
            var url = "http://" + io.address + ":" + io.port + "/rest/items";

            $.ajax({
                url : url,
                type : 'GET',
                dataType : 'json',
                async : true,
                cache : false
            }).done(function(response) {
                $.each(response, function(index, ohItem) {
                    var type = ohItem.type;
                    if(type == "Group")
                        type = ohItem.groupType;

                    var widgetItems = io.getItemsFromOHItem(ohItem.name, type, hashOfWidgetItems);

                    if(Array.isArray(widgetItems)) {
                        widgetItems.forEach(function(item) {

                            var valConverted = io.convertFromOH(item, ohItem.state);
                            io.debug && console.info("Update widget item '" + item + "' to value '" + valConverted + "' from state '" + ohItem.state + "' queried for ohab item '" + ohItem.name + "'.");
                            widget.update(item, valConverted);
                        });

                        io.debug && widgetItems.length === 0 && console.log("Queried unused ohab item '" + ohItem.name + "': " + JSON.stringify(ohItem));
                    }
                })
            }).error(notify.json);
        }
    },

    allPlots : function() {
        io.debug && console.info("Updating all plots");

        var me = this;

        var unique = Array();

        widget.plot().each(function(idx) {
            var items = widget.explode($(this).attr('data-item'));
            for (var i = 0; i < items.length; i++) {

                var pt = items[i].split('.');

                if (!unique[items[i]] && !widget.get(items[i]) && (pt instanceof Array) && widget.checkseries(items[i])) {
                    var item = items[i];

                    var ohItem = io.getOHItemFromItem(pt[0]);

                    var duration = new Date().duration(pt[2]);

                    // For OpenHAB it seems to be required to send a date in the correct timezone
                    // as it seems to ignore the timezone offset
                    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
                    var starttime = new Date(new Date() - duration - tzoffset).toISOString().slice(0, -5);

                    var url = "http://" + io.address + ":" + io.port + "/rest/persistence/items/" + ohItem + "?starttime=" + starttime;

                    io.debug && console.info("Updating plot for ohab item '" + ohItem + "' from " + url);

                    $.ajax({
                        url : url,
                        type : 'GET',
                        dataType : 'json',
                        async : true,
                        cache : false
                    }).done(function(response) {
                        var valArray = [];

                        $.each(response.data, function(index, dataVal) {
                            valArray.push([ dataVal.time, parseFloat(dataVal.state) ]);
                        })

                        valArray.sort(function(a, b) {
                           return a[0] - b[0];
                        });

                        io.debug && console.log(valArray);

                        widget.update(item, valArray);
                    }).error(notify.json);

                    unique[items[i]] = 1;
                    me.plotItems.push(items[i]);
                }
            }
        });
    }

};
