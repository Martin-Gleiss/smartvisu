/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU / FHEM
 * @author      HCS with adjustments by Julian Pawlowski, Stefan Widmer and raman
 *              original version by Martin Gleiß
 * @copyright   2016
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @label       FHEM
 * @hide        driver_autoreconnect
 * @default     driver_port 2121
 *
 * This driver has enhancements for using smartVISU with FHEM
 */

var io = {
  // --- Driver configuration ----------------------------------------------------
  logLevel: 1,                      // 2 will show more information
  alertExceptions: false,           // true will enable the global exception handler
  // -----------------------------------------------------------------------------
  
  // -----------------------------------------------------------------------------
  // P U B L I C   F U N C T I O N S
  // -----------------------------------------------------------------------------
  address: '',
  port: '',
  uzsu_type: '2',
  
  // -----------------------------------------------------------------------------
  // Does a read-request and adds the result to the buffer
  // -----------------------------------------------------------------------------
  read: function(item) {
    io.log(1, "read (item=" + item + ")");
  },
  
  // -----------------------------------------------------------------------------
  // Does a write-request with a value
  // -----------------------------------------------------------------------------
  write: function(item, val) {
    var isOwn = false;
    if (io.addon && io.addon.itemFilter) {
      var re = new RegExp(io.addon.itemFilter);
      isOwn = re.test(item);
    }
    
    if (isOwn) {
      if (io.addon) {
        io.addon.write(item, val);
      }
    } else {
      io.log(2, "write (item=" + item + " val=" + val + ")");
      io.send({
        'cmd': 'item',
        'id': item,
        'val': val
      });
    }
    
    widget.update(item, val);
  },
  
  
  // -----------------------------------------------------------------------------
  // Trigger a logic
  // -----------------------------------------------------------------------------
  trigger: function(name, val) {
    // fronthem does not want to get trigger, so simply send it the addon driver
    if (io.addon) {
      io.addon.trigger(name, val);
    }
  },
  
  
  // -----------------------------------------------------------------------------
  // Initialization of the driver
  // -----------------------------------------------------------------------------
  init: function(address, port) {
    io.log(0, "init (address=" + address + " port=" + port + ")");
    io.address = address;
    io.port = port;
    
    if (io.alertExceptions) {
      window.onerror = function(message, url, line) {
        alert("Error: " + message + "\nurl: " + url + "\nline: " + line);
        return false;
      };
    }
    
    if (address === "") {
      io.address = window.location.hostname;
    }
    
    if (port === "") {
      io.port = window.location.port;
    }
    
    io.open();
    
    try {
      io.addon = new addonDriver();
      io.addon.init(io);
      io.addon.run();
    }
    catch(err) {
      io.addon = null;
    }
    
  },
  
  
  // -----------------------------------------------------------------------------
  // Called after each page change
  // -----------------------------------------------------------------------------
  run: function(realtime) {
    io.log(1, "run (readyState=" + io.socket.readyState + ")");
    
    if (io.addon) {
      io.addon.run();
    }
    
    if (io.socket.readyState > 1) {
      io.open();
    } else {
      // new items
      widget.refresh();
      io.monitor();
    }
    
  },
  
  // -----------------------------------------------------------------------------
  // P R I V A T E   F U N C T I O N S
  // -----------------------------------------------------------------------------
  protocolVersion: '0.1',
  socket: null,
  rcTimer: null,
  addon: null,
  
  log: function(level, text) {
    if (io.logLevel >= level) {
      console.log("[io.fhem]: " + text);
    }
  },
  
  
  // -----------------------------------------------------------------------------
  // Start timer
  // -----------------------------------------------------------------------------
  startReconnectTimer: function() {
    if (!io.rcTimer) {
      io.log(1, "Reconnect timer started");
      io.rcTimer = setInterval(function() {
        io.log(1, "Reconnect timer fired");
        notify.add("ConnectionLost",
          "connection",
          "Driver: fhem",
          "Connection to the fhem server lost!");
        notify.display();
        if (!io.socket) {
          io.open();
        }
      }, 60000);
    }
  },
  
  
  // -----------------------------------------------------------------------------
  // Stop timer
  // -----------------------------------------------------------------------------
  stopReconnectTimer: function() {
    if (io.rcTimer) {
      clearInterval(io.rcTimer);
      io.rcTimer = null;
      io.log(1, "Reconnect timer stopped");
    }
  },
  
  
  // -----------------------------------------------------------------------------
  // Handle the received data
  // -----------------------------------------------------------------------------
  handleReceivedData: function(eventData) {
    var i = 0;
    var data = JSON.parse(eventData);
    switch (data.cmd) {
      case 'reloadPage':
        location.reload(true);
        break;
      
      case 'item':
        // We get:
        // {
        //   "cmd": "item",
        //   "items": ["Temperature_LivingRoom.temperature","21"]
        // }
        for (i = 0; i < data.items.length; i = i + 2) {
          widget.update(data.items[i], data.items[i + 1]);
        }
        break;
      
      case 'plot':
        for (i = 0; i < data.items.length; i++) {
          if(data.items[i]) {
            widget.update(data.items[i].item, data.items[i].plotdata);
          }
        }
        break;
      
      case 'series':
        // We get:
        // {
        //   "cmd": "series",
        //   "items": {
        //     "item": "hcs.data.Heating.WaterTemperatureChart",
        //     "updatemode": "complete",
        //     "plotdata": [
        //       [
        //         1426374304000,
        //         45
        //       ],
        //       [
        //         1426376105000,
        //         45
        //       ],
        //       [
        //         1426377905000,
        //         44.5
        //       ],
        //     ]
        //   }
        // }
        for (i = 0; i < data.items.length; i++) {
          var dataItem = data.items[i];
          
          // FHEM charts (chart.)
          var seriesdata = {
            "item": dataItem.item,
            "data": dataItem.plotdata,
            "updatemode": dataItem.updatemode
          };
          $.mobile.activePage.find('[data-item*="' + dataItem.item + '"][data-widget^="chart."]').trigger('update', [seriesdata]);
          
          
          // sV plots (plot.)
          /*
           * if fronthem would reflect completeItems in items (e.g. "hcs.data.OilLevelPlot.avg.5y 6m.0") the hole block could be replaced by:
           * widget.update(completeItem, plotData);
           */
          // Check if we still need this
          $('[data-widget^="plot."][data-item*="' + dataItem.item + '"]').each(function() {
            var dataItems = widget.explode($(this).attr('data-item'));
            for (var i = 0; i < dataItems.length; i++) {
              if (io.splitPlotItem(dataItems[i]).item === dataItem.item ) {
                widget.update(dataItems[i], dataItem.plotdata);
              }
            }
          });
          
        }
        break;
      
      case 'dialog':
        notify.info(data.header, data.content);
        break;
      
      case 'proto':
        var proto = data.ver;
        if (proto != io.protocolVersion) {
          notify.info('Driver: fhem',
            'Protocol mismatch<br />Driver is at version v' + io.protocolVersion + '<br />fhem is at version v' + proto);
        }
        break;
      
      case 'log':
        for (i = 0; i < data.items.length; i = i + 2) {
          widget.update(data.items[i], data.items[i + 1]);
        }
        break;
    }
  },
  
  // -----------------------------------------------------------------------------
  // Open the connection and listen what fronthem sends
  // -----------------------------------------------------------------------------
  open: function() {
    var socketproto = "ws:";
    
    if (window.location.protocol == "https:") {
      socketproto = 'wss:';
    }
    
    if (io.port == "80" || io.port == "443") {
      io.socket = new WebSocket(socketproto + '//' + io.address + '/ws/');
    } else {
      io.socket = new WebSocket(socketproto + '//' + io.address + ':' + io.port + '/ws/');
    }
    
    io.socket.onopen = function() {
      io.log(2, "socket.onopen");
      io.stopReconnectTimer();
      io.send({
        'cmd': 'proto',
        'ver': io.protocolVersion
      });
      io.monitor();
      if (notify.exists()) {
        notify.remove();
      }
    };
    
    io.socket.onmessage = function(event) {
      io.log(2, "socket.onmessage: data= " + event.data);
      io.handleReceivedData(event.data);
    };
    
    io.socket.onerror = function(error) {
      io.log(1, "socket.onerror: " + error);
    };
    
    io.socket.onclose = function() {
      io.log(1, "socket.onclose");
      io.close();
      io.startReconnectTimer();
    };
  },
  
  
  // -----------------------------------------------------------------------------
  // Sends the data to fronthem
  // -----------------------------------------------------------------------------
  send: function(data) {
    if (io.socket.readyState == 1) {
      io.socket.send(unescape(encodeURIComponent(JSON.stringify(data))));
      io.log(2, 'send() data: ' + JSON.stringify(data));
    }
  },
  
  
  // -----------------------------------------------------------------------------
  // Split the Items into the FHEM-part and our own part
  // -----------------------------------------------------------------------------
  splitItems: function() {
    io.ownItems = [];
    io.fhemItems = [];
    io.ownLogs = [];
    io.fhemLogs = [];
    io.ownSeries = [];
    io.fhemSeries = [];
    
    if($.mobile.activePage != undefined) {
      var re = io.addon && io.addon.itemFilter ? new RegExp(io.addon.itemFilter) : null;
      
      // Logs
      widget.log().each(function () {
        var logInfo = {
          "item": $(this).attr('data-item'),
          "size": $(this).attr('data-count'),
          "interval": $(this).attr('data-interval')
        };
        
        if (re && re.test(logInfo.item)) {
          io.ownLogs.push(logInfo);
        } else {
          io.fhemLogs.push(logInfo);
        }
      });
      
      // "normal" values
      var items = widget.listeners();
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (re && re.test(item)) {
          io.ownItems.push(item);
        } else {
          io.fhemItems.push(item);
        }
      }
      
      // sV Plots
      widget.plot().each(function () {
        var list = widget.explode($(this).attr('data-item'));
        for (var i = 0; i < list.length; i++) {
          if (widget.checkseries(list[i])) {
            var plotItem = io.splitPlotItem(list[i]);
            if ($.inArray(plotItem.mode, Array('raw', 'avg', 'sum', 'min', 'max', 'minmax', 'minmaxavg')) >= 0) {
              var plotInfo = {
                "item": plotItem.item,
                "mode": plotItem.mode,
                "start": plotItem.start,
                "end": plotItem.end === "0" ? "now" : plotItem.end,
                "count": plotItem.count === "0" ? "100" : plotItem.count,
                "interval": "OnChange",
                "minzoom": $(this).attr('data-zoom'),
                "updatemode": "additional"
              };
              
              if (re && re.test(plotInfo.item)) {
                io.ownSeries.push(plotInfo);
              } else {
                io.fhemSeries.push(plotInfo);
              }
            }
          }
        }
      });
      
      // FHEM charts
      $.mobile.activePage.find('[data-item][data-series]').each(function (index, chart) {
        var list = widget.explode($(chart).attr('data-item'));
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          
          var result = false;
          var series = $(chart).attr("data-series");
          if (series) {
            var seriesItems = series.split(',');
            
            for (var ci = 0; ci < seriesItems.length; ci++) {
              if (seriesItems[ci].trim() === item) {
                result = true;
                break;
              }
            }
          }
          
          if (result) {
            var dataModes = $(chart).attr('data-modes');
            var modes = dataModes.split(',');
            
            var end = $(chart).attr('data-tmax');
            
            var chartInfo = {
              "item": item,
              "mode": modes.length > 1 ? modes[i].trim() : dataModes,
              "start": $(chart).attr('data-tmin'),
              "end": end === "0" ? "now" : end,
              "interval": $(chart).attr('data-interval'),
              "minzoom": $(chart).attr('data-zoom'),
              "updatemode": "complete"
            };
            
            if (re && re.test(chartInfo.item)) {
              io.ownSeries.push(chartInfo);
            } else {
              io.fhemSeries.push(chartInfo);
            }
          }
        }
      });
    }
  },
  
  
  // -----------------------------------------------------------------------------
  // Split a plot.* item into item and params
  // -----------------------------------------------------------------------------
  splitPlotItem: function(completeItem) {
    var parts = completeItem.split('.');
    // item: hcs.data.OilLevelPlot.avg.5y 6m.0.100	-- count
    //		 												 \		 \		\ end
    //		 												 \		 \ start
    //		 									  		 \ mode
    var pos = 0;
    var item = "";
    while (pos < parts.length - 4) {
      item += parts[pos] + (pos === parts.length - 5 ? "" : ".");
      pos++;
    }
    
    return {
      "item": item,
      "mode": parts[parts.length - 4],
      "start": parts[parts.length - 3],
      "end": parts[parts.length - 2],
      "count": parts[parts.length - 1]
    };
    
  },
  
  
  // -----------------------------------------------------------------------------
  // Monitors the items
  // -----------------------------------------------------------------------------
  fhemItems: [],
  ownItems: [],
  fhemSeries: [],
  ownSeries: [],
  fhemLogs: [],
  ownLogs: [],
  monitor: function() {
    if (io.socket.readyState === 1) {
      io.splitItems();
      io.log(2, "monitor (Items:" + io.fhemItems.length + ", Series:" + io.fhemSeries.length + ")");
      
      if (io.fhemItems.length) {
        io.send({
          'cmd': 'monitor',
          'items': io.fhemItems
        });
      }
      
      if (io.fhemSeries.length) {
        io.send({
          'cmd': 'plot',
          'items': io.fhemSeries
        });
      }
      
      if (io.fhemLogs.length) {
        io.send({
          'cmd': 'log',
          'items': io.fhemLogs
        });
      }
      
      if (io.addon) {
        io.addon.monitor(io.ownItems, io.ownSeries, io.ownLogs);
      }
    }
  },
  
  
  // -----------------------------------------------------------------------------
  // Closes the connection
  // -----------------------------------------------------------------------------
  close: function() {
    if (io.socket != null) {
      io.socket.close();
      io.socket = null;
      io.log(1, "socket closed");
    }
    
  }
  
  
};
