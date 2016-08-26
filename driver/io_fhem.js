/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU / FHEM
 * @author      HCS with adjustments by Julian Pawlowski,
 *              original version by Martin Gleiß
 * @copyright   2016
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 *
 * This driver has enhancements for using smartVISU with FHEM
 */

var io = {
  // --- Driver configuration ----------------------------------------------------
  logLevel: 1, // 2 will show more information
  alertExceptions: false, // true will enable the global exception handler
  offline: false, // true will generate offline data 
  measureGADs: false, // set to true to get an alert with timing infos
  gadsToMeasure: 10, // number of GADs to measure
  gadFilter: "", // reg ex, to hide these GADs to FHEM
  addonDriverFile: "", // file name of an optional add-on driver
  // -----------------------------------------------------------------------------

  // -----------------------------------------------------------------------------
  // P U B L I C   F U N C T I O N S
  // -----------------------------------------------------------------------------
  driverVersion: "1.11",
  address: '',
  port: '',

  // -----------------------------------------------------------------------------
  // Does a read-request and adds the result to the buffer
  // -----------------------------------------------------------------------------
  read: function(item) {
    io.log(1, "read (item=" + item + ")");
  },

  // -----------------------------------------------------------------------------
  // Does a write-request with a value
  // -----------------------------------------------------------------------------
  write: function(gad, val) {
    if (io.offline) {

    } else {
      var isOwn = false;
      if (io.gadFilter) {
        var re = new RegExp(io.gadFilter);
        isOwn = re.test(gad);
      }

      if (isOwn) {
        if (io.addon) {
          io.addon.write(gad, val);
        }
      } else {
        io.log(2, "write (gad=" + gad + " val=" + val + ")");
        io.send({
          'cmd': 'item',
          'id': gad,
          'val': val
        });
      }
    }

    io.updateWidget(gad, val);
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
    io.log(0, "init [V" + io.driverVersion + "] (address=" + address + " port=" + port + ")");
    io.address = address;
    io.port = port;

    if (io.alertExceptions) {
      window.onerror = function(message, url, line) {
        alert("Error: " + message + "\nurl: " + url + "\nline: " + line);
        return false;
      };
    }

    if (address === "offline") {
      io.offline = true;
    }

    if (io.offline) {
      io.log(0, "DRIVER IS IN OFFLINE MODE");
    } else {
      io.open();

      if (io.addonDriverFile) {
        $.getScript("driver/" + io.addonDriverFile)
          .done(function(script, status) {
            io.addon = new addonDriver();
            io.addon.init(io);
            io.addon.run();
          })
          .fail(function(hdr, settings, exception) {
            io.addon = null;
          });
      }
    }
  },


  // -----------------------------------------------------------------------------
  // Called after each page change
  // -----------------------------------------------------------------------------
  run: function(realtime) {
    if (io.offline) {
      io.log(1, "run (OFFLINE)");
      io.monitor();
      io.simulateData();

      if (io.timer) {
        clearInterval(io.timer);
      }
      io.timer = setInterval(function() {
        io.simulateData();
      }, 5000);

    } else {
      io.log(1, "run (readyState=" + io.socket.readyState + ")");

      // ToDo: Remove after testing
      io.resetLoadTime();

      if (io.addon) {
        io.addon.run();
      }

      if (io.socket.readyState > 1) {
        io.open();
      } else {
        // new items
        io.monitor();
      }
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
  // Try to call the update handler of a widget
  // -----------------------------------------------------------------------------
  callUpdateHandler: function(item, values) {
    var widget = $(item).attr('data-widget');
    var gads = $(item).attr('data-item');
    var cachedWidget = io.action[widget];
    try {
      if (cachedWidget) {
        cachedWidget.handler.call(item, 'update', values);
      } else {
        $(item).trigger('update', values);
      }
    } catch (ex) {
      io.log(0, "Widget '" + widget + "' - " + gads + ": " + values + " Error: " + ex);
    }
  },


  // -----------------------------------------------------------------------------
  // Update a widget
  // -----------------------------------------------------------------------------
  updateWidget: function(gad, value) {
    // ToDo: Remove after testing
    io.receivedGADs++;
    var widgetType = "";
    io.logLoadTime("GAD #" + io.receivedGADs);

    // Buffer it
    if (!(widget.buffer[gad] instanceof Array) && value !== undefined) {
      widget.buffer[gad] = $.isNumeric(value) ? value * 1.0 : value;
    }

    $('[data-item*="' + gad + '"]').each(function(idx) {
      widgetType = $(this).attr('data-widget');

      var items = widget.explode($(this).attr('data-item'));
      var series = $(this).attr("data-series");

      for (var i = 0; i < items.length; i++) {
        if (items[i] == gad) {
          if (series) {
            // This is a GAD that is part of a widget that has series and values
            var data = {
              "gad": gad,
              "data": value
            };
            io.callUpdateHandler(this, data);
          } else {
            var values = widget.get(items);
            if (widget.check(values)) {
              io.callUpdateHandler(this, values);

              // for the icon.* widgets there is a second update handler
              // that we must call. It switches the icon
              if (widgetType.lastIndexOf("icon.", 0) === 0) {
                var cachedWidget = io.action["icon."];
                try {
                  if (cachedWidget) {
                    cachedWidget.handler.call(this, 'update', values);
                  } else {
                    $(this).trigger('update', values);
                  }
                } catch (ex) {
                  io.log(0, "Widget '" + widgetType + "' - " + gad + ": " + values + " Error: " + ex);
                }

              }

            }
          }
        }
      }
    });

    // ToDo: Remove after testing
    io.logLoadTime("OK (" + widgetType + ")");
    io.showLoadTime();
  },

  // -----------------------------------------------------------------------------
  // Update a chart
  // -----------------------------------------------------------------------------
  updateChart: function(item, gad, series, updatemode) {
    seriesData = {
      "gad": gad,
      "data": series,
      "updatemode": updatemode
    };

    io.callUpdateHandler(item, seriesData);
    io.log(2, "Chart updated: " + gad + " size: " + series.length);

  },

  // -----------------------------------------------------------------------------
  // Update a plot
  // -----------------------------------------------------------------------------
  updatePlot: function(item, gad, series, updatemode) {
    var items = widget.explode($(item).attr('data-item'));

    for (var i = 0; i < items.length; i++) {
      items[i] = io.splitPlotGAD(items[i]).gad;
    }

    widget.buffer[gad] = series;

    if ($(item).attr('data-widget').substr(0, 5) == 'plot.' && $('#' + item.id).highcharts()) {
      $(item).trigger('point', [series]);
    } else {
      var values = widget.get(items);
      if (widget.check(values)) {
        io.callUpdateHandler(item, values);
        ////io.log(2, "Plot updated: " + gad + " size: " + series.length);

      }
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
          io.updateWidget(data.items[i], data.items[i + 1]);
        }
        break;

      case 'series':
        // We get:
        // {
        //   "cmd": "series",
        //   "items": {
        //     "gad": "hcs.data.Heating.WaterTemperatureChart",
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
          var gad = data.items[i].gad;
          var plotData = data.items[i].plotdata;
          var updateMode = data.items[i].updatemode;

          $('[data-item*="' + gad + '"]').each(function() {
            var items = widget.explode($(this).attr('data-item'));
            for (var i = 0; i < items.length; i++) {
              // items[i]: if SV-plot: hcs.data.OilLevelPlot.avg.5y 6m.0
              //           if chart:   hcs.data.OilLevelPlot
              if (io.isPlot(this, items[i])) {
                items[i] = io.splitPlotGAD(items[i]).gad;
              }

              if (items[i] === gad) {
                if (io.isPlot(this, items[i])) {
                  io.updatePlot(this, gad, plotData, updateMode);
                } else {
                  io.updateChart(this, gad, plotData, updateMode);
                }
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
        break;
    }
  },

  // -----------------------------------------------------------------------------
  // Open the connection and listen what fronthem sends
  // -----------------------------------------------------------------------------
  open: function() {
    io.socket = new WebSocket('ws://' + io.address + ':' + io.port + '/');

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
    if (io.offline) {
      io.log(2, 'OFFLINE send() data: ' + JSON.stringify(data));
    } else {
      if (io.socket.readyState == 1) {
        io.socket.send(unescape(encodeURIComponent(JSON.stringify(data))));
        io.log(2, 'send() data: ' + JSON.stringify(data));
      }
    }
  },

  // -----------------------------------------------------------------------------
  // checks, if the passed GAD is a GAD for a series
  // -----------------------------------------------------------------------------
  isSeries: function(item, gad) {
    var result = false;
    var series = $(item).attr("data-series");
    if (series) {
      var seriesGADs = series.split(',');

      for (var i = 0; i < seriesGADs.length; i++) {
        if (seriesGADs[i].trim() === gad) {
          result = true;
          break;
        }
      }

    }
    return result;
  },

  // -----------------------------------------------------------------------------
  // checks, if the passed GAD is a GAD for a SV-Plot with a series
  // -----------------------------------------------------------------------------
  isPlot: function(item, gad) {
    var widget = $(item).attr("data-widget");
    return widget === "plot.period" || widget === "plot.rtr";
  },

  // -----------------------------------------------------------------------------
  // checks, if the passed GAD is a GAD for a log
  // -----------------------------------------------------------------------------
  isLog: function(item, gad) {
    var widget = $(item).attr("data-widget");
    return widget === "status.log";
  },

  // -----------------------------------------------------------------------------
  // checks, if the passed GAD is a GAD for a "normal" value
  // -----------------------------------------------------------------------------
  isValue: function(item, gad) {
    return !io.isSeries(item, gad) && !io.isPlot(item, gad) && !io.isLog(item, gad);
  },

  // -----------------------------------------------------------------------------
  // Split the GADs into the FHEM-part and our own part
  // -----------------------------------------------------------------------------
  splitGADs: function() {
    io.ownGADs = [];
    io.fhemGADs = [];
    var gads = Array();
    var unique = Array();

    io.allGADs.forEach(function(item) {
      var items = widget.explode($(item).attr('data-item'));
      for (var i = 0; i < items.length; i++) {
        if (io.isValue(item, items[i])) {
          unique[items[i]] = '';
        }
      }
    });

    for (var item in unique) {
      gads.push(item);
      if (io.offline) {
        io.offlineGADs.push(item);
      }
    }

    if (io.gadFilter) {
      var re = new RegExp(io.gadFilter);
      for (var i = 0; i < gads.length; i++) {
        var gad = gads[i];
        var own = re.test(gad);
        if (own) {
          io.ownGADs.push(gad);
        } else {
          io.fhemGADs.push(gad);
        }
      }
    } else {
      io.fhemGADs = gads;
    }
  },


  // -----------------------------------------------------------------------------
  // Split a plot.* GAD into GAD and params
  // -----------------------------------------------------------------------------
  splitPlotGAD: function(completeGAD) {
    var parts = completeGAD.split('.');
    // gad: hcs.data.OilLevelPlot.avg.5y 6m.0
    //                             \     \    \ end
    //                              \     \ start
    //                               \ mode
    var pos = 0;
    var gad = "";
    while (pos < parts.length - 3) {
      gad += parts[pos] + (pos == parts.length - 4 ? "" : ".");
      pos++;
    }

    return {
      "gad": gad,
      "mode": parts[parts.length - 3],
      "start": parts[parts.length - 2],
      "end": parts[parts.length - 1]
    };

  },

  // -----------------------------------------------------------------------------
  // Split the series into the FHEM-part and our own part
  // -----------------------------------------------------------------------------
  splitSeries: function() {
    io.ownSeries = [];
    io.fhemSeries = [];

    io.allGADs.forEach(function(item) {
      var gads = $(item).attr('data-item').split(',');
      for (var i = 0; i < gads.length; i++) {
        var takeThat = false;

        var gad = gads[i].trim();
        var mode = "";
        var start = "";
        var end = "";
        var interval = "";
        var minzoom = "";
        var updatemode = "complete";

        if (io.isSeries(item, gad)) {
          var dataModes = $(item).attr('data-modes');
          var modes = dataModes.split(',');
          mode = modes.length > 1 ? modes[i].trim() : dataModes;
          start = $(item).attr('data-tmin');
          end = $(item).attr('data-tmax');
          interval = $(item).attr('data-interval');
          minzoom = $(item).attr('data-zoom');
          takeThat = true;
        } else if (io.isPlot(item, gad)) {
          var plotGAD = io.splitPlotGAD(gad);
          if ($.inArray(plotGAD.mode, Array('avg', 'min', 'max', 'sum', 'diff', 'rate', 'on')) >= 0) {
            gad = plotGAD.gad;
            mode = plotGAD.mode;
            start = plotGAD.start;
            end = plotGAD.end;
            interval = "OnChange";
            minzoom = $(item).attr('data-zoom');
            updatemode = "additional";

            takeThat = true;
          }
        }

        if (takeThat) {
          var plotInfo = {
            "gad": gad,
            "mode": mode,
            "start": start,
            "end": end === "0" ? "now" : end,
            "interval": interval,
            "minzoom": minzoom,
            "updatemode": updatemode
          };

          if (io.offline) {
            io.offlineSeries.push(plotInfo);
          }

          if (io.gadFilter) {
            var re = new RegExp(io.gadFilter);
            if (re.test(plotInfo.gad)) {
              io.ownSeries.push(plotInfo);
            } else {
              io.fhemSeries.push(plotInfo);
            }
          } else {
            io.fhemSeries.push(plotInfo);
          }
        }
      }
    });

  },


  // -----------------------------------------------------------------------------
  // Split the Logs into the FHEM-part and our own part
  // -----------------------------------------------------------------------------
  splitLogs: function() {
    io.ownLogs = [];
    io.fhemLogs = [];

    io.allGADs.forEach(function(item) {
      var list = $(item).attr('data-item').split(',');

      for (var i = 0; i < list.length; i++) {
        if (io.isLog(item, list[i].trim())) {
          var logInfo = {
            "gad": list[i].trim(),
            "size": $(item).attr('data-count'),
            "interval": $(item).attr('data-interval')
          };

          if (io.offline) {
            io.offlineLogs.push(logInfo);
          }

          if (io.gadFilter) {
            var re = new RegExp(io.gadFilter);
            if (re.test(logInfo.gad)) {
              io.ownLogs.push(logInfo);
            } else {
              io.fhemLogs.push(logInfo);
            }
          } else {
            io.fhemLogs.push(logInfo);
          }
        }
      }
    });

  },

  // -----------------------------------------------------------------------------
  // Get and cache GADs
  // -----------------------------------------------------------------------------
  getAllGADs: function() {
    io.action = {};
    io.allGADs = [];

    // get all delegate handlers
    var handlers = ($._data($(document)[0], "events") || {})["update"];

    for (var i = 0; i < handlers.delegateCount; i++) {
      var raw = handlers[i].selector;
      var regEx = /.*?data-widget?.="(.+?)".*/;
      regEx.exec(raw);
      var widget = RegExp.$1;
      var handler = handlers[i].handler;
      io.action[widget] = {
        handler: handler
      };
    }

    // get all widgets at page
    if ($.mobile.activePage) {
      $('[id^="' + $.mobile.activePage.attr('id') + '-"][data-item]').each(function(idx, e) {
        io.allGADs.push(this);
      });
    }

  },


  // -----------------------------------------------------------------------------
  // Monitors the items
  // -----------------------------------------------------------------------------
  allGADs: [],
  fhemGADs: [],
  ownGADs: [],
  fhemSeries: [],
  ownSeries: [],
  fhemLogs: [],
  ownLogs: [],
  monitor: function() {
    if (io.offline || io.socket.readyState == 1) {
      // ToDo: Remove after testing
      io.logLoadTime("Monitor");

      io.getAllGADs();
      io.splitGADs();
      io.splitSeries();
      io.splitLogs();

      // ToDo: Remove after testing
      io.logLoadTime("Monitor calculated");

      io.log(1, "monitor (GADs:" + io.fhemGADs.length + ", Series:" + io.fhemSeries.length + ")");

      if (io.fhemGADs.length) {
        io.send({
          'cmd': 'monitor',
          'items': io.fhemGADs
        });
      }

      if (io.fhemSeries.length) {
        io.send({
          'cmd': 'series',
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
        io.addon.monitor(io.ownGADs, io.ownSeries, io.ownLogs);
      }

      // ToDo: Remove after testing
      io.logLoadTime("Monitor done");

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

  },

  // =============================================================================
  // H E L P E R S
  // =============================================================================

  // -----------------------------------------------------------------------------
  // Time measurement
  // -----------------------------------------------------------------------------
  loadTimeLog: "Load-Times\n",
  timeStamp: 0,
  receivedGADs: 0,

  resetLoadTime: function() {
    if (io.measureGADs) {
      io.receivedGADs = 0;
      io.loadTimeLog = "Load-Times\n";
      io.logLoadTime("Start");
    }
  },
  logLoadTime: function(text) {
    if (io.measureGADs) {
      var d = new Date();
      var diff = io.timeStamp == 0 ? 0 : (d.getTime() - io.timeStamp);
      io.loadTimeLog += d.toLocaleTimeString() + "." + ("000" + d.getMilliseconds()).slice(-3) + " (" + diff + " ms): " + text + "\n";
      io.timeStamp = d.getTime();
    }
  },
  showLoadTime: function() {
    if (io.measureGADs && io.receivedGADs == io.gadsToMeasure) {
      if (io.loadTimeLog) {
        io.logLoadTime(io.receivedGADs + " GADs");
        alert(io.loadTimeLog);
      }
    }
  },

  // -----------------------------------------------------------------------------
  // offline data
  // -----------------------------------------------------------------------------
  timer: null,
  offlineGADs: [],
  offlineSeries: [],
  offlineLogs: [],
  simulateData: function() {
    for (i = 0; i < io.offlineGADs.length; i++) {
      var data = [];
      data.push(io.offlineGADs[i]);
      data.push((Math.random() * 100).toFixed(1));
      io.handleReceivedData('{"cmd":"item", "items": ' + JSON.stringify(data) + '}');
    }

    var dt = new Date().getTime();
    for (var i = 0; i < io.offlineSeries.length; i++) {
      var widget = $('[data-item*="' + io.offlineSeries[i].gad + '"]')[0];
      var tmin = $(widget).attr('data-tmin');
      tmin = tmin ? tmin : "2d";
      var tmax = $(widget).attr('data-tmax');
      tmax = tmax ? tmax : "now";
      var steps = 100;

      var yMin = $(widget).attr('data-ymin');
      yMin = yMin ? yMin * 1 : 0;
      var yMax = $(widget).attr('data-ymax');
      yMax = yMax ? yMax * 1 : 255;

      var xMin = new Date().getTime() - new Date().duration(tmin);
      var xMax = new Date().getTime() - new Date().duration(tmax);

      var step = Math.round((xMax - xMin) / steps);
      var val = yMin + ((yMax - yMin) / 2);
      var delta = (yMax - yMin) / 20;

      var series = [];
      var security = 0;
      while (xMin <= xMax && ++security < 10000) {
        val += Math.random() * (2 * delta) - delta;
        series.push([xMin, val.toFixed(2) * 1.0]);
        xMin += step;
      }

      var dataString = '{"cmd":"series", "items": [{"gad": "' + io.offlineSeries[i].gad + '", "updatemode": "complete", "plotdata": ' + JSON.stringify(series) + ' }]}';
      io.handleReceivedData(dataString);
    }

  }


};
