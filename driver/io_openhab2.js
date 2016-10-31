/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
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
        // old items
        widget.refresh();

        // new items
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
        var me = this;
        var eventSource = new EventSource("http://" + io.address + ":" + io.port + "/rest/events?topics=smarthome/items/*/state");

        eventSource.addEventListener('message', function(eventPayload) {

            var event = JSON.parse(eventPayload.data);
            //console.log(event);

            if (event.type === 'ItemStateEvent') {
                var payload = JSON.parse(event.payload);

                var ohItem = event.topic.split('/')[2];
                console.log("ItemStateEvent for " + ohItem);

                var item = io.getItemFromOHItem(ohItem);

                if (item)
                    widget.update(item, io.convertFromOH(item, payload.value));
                
                // Check if this is a plot item
                me.plotItems.forEach(function(plotItem) {
                    var pt = plotItem.split('.');
                    var ptOhItem = io.getOHItemFromItem(pt[0]);
                    
                    if (ptOhItem == ohItem) {
                        console.log("Updating plot item " + plotItem);
                        var data = [[new Date().getTime(), parseFloat(io.convertFromOH(item, payload.value))]];
                        console.log(data);
                        widget.update(plotItem, data);
                    }
                });
            }
        });

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
            if (val == 1)
                ohVal = "ON";
            else
                ohVal = "OFF";
            break;
        }

        return ohVal;
    },

    convertFromOH : function(item, ohVal) {
        var type = io.getTypeFromItem(item);
        var val = ohVal;

        switch (type) {
        case "Switch":
            if (ohVal == "ON")
                val = 1;
            else
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

    getItemFromOHItem : function(ohItem) {
        // console.log("Searching for oh item: " + ohItem);

        var items = widget.listeners();
        for (var i = 0; i < items.length; i++) {
            if (ohItem == io.getOHItemFromItem(items[i])) {
                // console.log("Determined item: " + items[i]);
                return items[i];
            }
        }

        return false;
    },

    /**
     * Reads all values from bus and refreshes the pages
     */
    all : function() {
        var items = '';

        // only if anyone listens
        if (widget.listeners().length) {
            // prepare url
            var item = widget.listeners();
            for (var i = 0; i < widget.listeners().length; i++) {
                items += item[i] + ',';
            }
            items = items.substr(0, items.length - 1);

            var url = "http://" + io.address + ":" + io.port + "/rest/items";

            $.ajax({
                url : url,
                type : 'GET',
                dataType : 'json',
                async : true,
                cache : false
            }).done(function(response) {
                $.each(response, function(index, ohItem) {
                    var item = io.getItemFromOHItem(ohItem.name);

                    if (item)
                        widget.update(item, io.convertFromOH(item, ohItem.state));
                })
            }).error(notify.json);
        }
    },

    allPlots : function() {
        console.log("Updating all plots");
        
        var me = this;
        
        var unique = Array();
        
        widget.plot().each(function(idx) {
            var items = widget.explode($(this).attr('data-item'));
            for (var i = 0; i < items.length; i++) {

                var pt = items[i].split('.');

                if (!unique[items[i]] && !widget.get(items[i]) && (pt instanceof Array) && widget.checkseries(items[i])) {
                    var item = items[i];
                    console.log(item);
                    
                    var ohItem = io.getOHItemFromItem(pt[0]);
                    
                    var duration = new Date().duration(pt[2]);
                    console.log(duration);
                    
                    // For OpenHAB it seems to be required to send a date in the correct timezone
                    // as it seems to ignore the timezone offset
                    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
                    var starttime = new Date(new Date() - duration - tzoffset).toISOString().slice(0, -1);
                    console.log(starttime);

                    console.log("Updating plot for " + ohItem);

                    var url = "http://" + io.address + ":" + io.port + "/rest/persistence/" + ohItem + "?servicename=rrd4j&starttime=" + starttime;

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
                        
                        console.log(valArray);
                        widget.update(item, valArray);
                    }).error(notify.json);

                    unique[items[i]] = 1;
                    me.plotItems.push(items[i]);
                }
            }
        });
    }

};
