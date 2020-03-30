// ----- plot.comfortchart ----------------------------------------------------
$.widget("sv.plot_comfortchart", $.sv.widget, {

	initSelector: 'div[data-widget="plot.comfortchart"]',

	options: {
		label: '',
		axis: ''
	},

	_create: function() {
		this._super();

		var label = String(this.options.label).explode();
		var axis = String(this.options.axis).explode();
		var plots = Array();

		plots[0] = {
			type: 'area', name: label[0], lineWidth: 0,
			data: [
				[17, 35],
				[16, 75],
				[17, 85],
				[21, 80],
				[25, 60],
				[27, 35],
				[25, 19],
				[20, 20],
				[17, 35]
			]
		};
		plots[1] = {
			type: 'area', name: label[1], lineWidth: 0,
			data: [
				[17, 75],
				[22.5, 65],
				[25, 33],
				[18.5, 35],
				[17, 75]
			]
		};

		plots[2] = {
			name: 'point',
			marker: { enabled: true, lineWidth: 2, radius: 6, symbol: 'circle' },
			showInLegend: false
		};

		this.element.highcharts({
			series: plots,
			title: { text: null },
			xAxis: { min: 10, max: 35, title: { text: axis[0], align: 'high', margin: -2 } },
			yAxis: { min: 0, max: 100, title: { text: axis[1], margin: 7, minTickInterval: 1 } },
			legend: {
				align: 'center',
				verticalAlign: 'top',
				floating: true,
			},
			plotOptions: {
				area: { enableMouseTracking: false },
			},
			tooltip: {
				formatter: function () {
					return this.x.transUnit('temp') + ' / ' + this.y.transUnit('%');
				}
			}
		});
	},

	_update: function(response) {
		var chart = this.element.highcharts();
		var point = chart.series[2].data[0];
		if (!response[0] && point) {
			response[0] = point.x;
		}
		if (!response[1] && point) {
			response[1] = point.y;
		}

		if(point)
			point.update([response[0] * 1.0, response[1] * 1.0], true);
		else
			chart.series[2].addPoint([response[0] * 1.0, response[1] * 1.0], true);
	}

});


// ----- plot.period ----------------------------------------------------------
$.widget("sv.plot_period", $.sv.widget, {

	initSelector: 'div[data-widget="plot.period"]',

	options: {
		ymin: '',
		ymax: '',
		tmin: '',
		tmax: '',
		label: '',
		color: '',
		exposure: '',
		axis: '',
		zoom: '',
		mode: '',
		unit: '',
		assign: '',
		opposite: '',
		ycolor: '',
		ytype: '',
		chartOptions: null
	},

	allowPartialUpdate: true,

	_create: function() {
		this._super();

		var ymin = [];
		if (this.options.ymin != undefined) {
			ymin = String(this.options.ymin).explode();
		}

		var ymax = [];
		if (this.options.ymax != undefined) {
			ymax = String(this.options.ymax).explode();
		}

		var label = String(this.options.label).explode();
		var color = String(this.options.color).explode();
		var exposure = String(this.options.exposure).explode();
		var axis = String(this.options.axis).explode();
		var zoom = this.options.zoom;
		var modes = String(this.options.mode).explode();
		var units = String(this.options.unit).explode();
		var assign = [];
		if (this.options.assign) {
			assign = String(this.options.assign).explode();
		}
		var opposite = [];
		if (this.options.opposite) {
			opposite = String(this.options.opposite).explode();
		}
		var ycolor = [];
		if (this.options.ycolor) {
			ycolor = String(this.options.ycolor).explode();
		}
		var ytype = String(this.options.ytype).explode();

		var styles = [];

		// series
		var series = [];
		var seriesCount = modes.length;

		for (var i = 0; i < seriesCount; i++) {
			var mode = modes[i];
			if(mode == 'minmax' || mode == 'minmaxavg') {
				series.push({
					type: 'columnrange',
					name: (label[i] == null ? 'Item ' + (i+1) : label[i]) + (mode == 'minmaxavg' && label[i] !== '' ? ' (min/max)' : ''),
					data: [],
					yAxis: (assign[i] ? assign[i] - 1 : 0),
					showInNavigator: mode == 'minmax',
					linkedTo: mode == 'minmaxavg' ? ':previous' : null,
					colorIndex: i*2
				});
			}
			if(mode != 'minmax') {
				series.push({
					type: (exposure[i] != null && exposure[i].toLowerCase().endsWith('stair') ? exposure[i].substr(0, exposure[i].length-5) : exposure[i]),
					step: (exposure[i] != null && exposure[i].toLowerCase().endsWith('stair') ? 'left' : false),
					name: (label[i] == null ? 'Item ' + (i+1) : label[i]),
					data: [], // clone
					yAxis: (assign[i] ? assign[i] - 1 : 0),
					showInNavigator: true,
					colorIndex: mode == 'minmaxavg' ? i*2+1 : null
				});
			}
		}

		// y-axis
		var numAxis = 1;
		if(assign.length > 0)
			numAxis = Math.max.apply(null, assign); // find highest y-axis index on assignments

		var yaxis = [];
		for (var i = 0; i < numAxis; i++) {
			yaxis[i] = {
				min: (ymin[i] ? (isNaN(ymin[i]) ? 0 : Number(ymin[i])) : null),
				max: (ymax[i] ? (isNaN(ymax[i]) ? 1 : Number(ymax[i])) : null),
				title: {text: axis[i + 1]},
				opposite: (opposite[i] > 0),
				endOnTick: false,
				startOnTick: false,
				type: ytype[i] || 'linear',
				svUnit: units[i] || 'float',
				minTickInterval: 1,
				showLastLabel: true
			};
			styles.push(Array(i+1).join(".highcharts-yaxis ~ ") + ".highcharts-yaxis .highcharts-axis-line { stroke: " + ycolor[i] + "; }");
			if(ytype[i] == 'boolean') {
				yaxis[i].categories = [ymin[i] || 0, ymax[i] || 1];
				yaxis[i].type = 'category';
			}
		}

		// range selector buttons for highstock (advanced zoom) according to time range in chart
		var possibleRangeSelectorButtons = [
			{ count: 1, type: 'year', text: '1y', svDuration: '1y' },
			{ count: 6, type: 'month', text: '6m', svDuration: '6m' },
			{ count: 3, type: 'month', text: '3m', svDuration: '3m' },
			{ count: 1, type: 'month', text: '1m', svDuration: '1m' },
			{ count: 2, type: 'week', text: '2w', svDuration: '14d' },
			{ count: 1, type: 'week', text: '1w', svDuration: '7d' },
			{ count: 3, type: 'day', text: '3d', svDuration: '3d' },
			{ count: 1, type: 'day', text: '1d', svDuration: '1d' },
			{ count: 12, type: 'hour', text: '12h', svDuration: '12h' },
			{ count: 6, type: 'hour', text: '6h', svDuration: '6h' },
			{ count: 3, type: 'hour', text: '3h', svDuration: '3h' },
			{ count: 1, type: 'hour', text: '1h', svDuration: '1h' },
			{ count: 30, type: 'minute', text: '30min', svDuration: '30i' },
			{ count: 15, type: 'minute', text: '15min', svDuration: '15i' },
			{ count: 5, type: 'minute', text: '5min', svDuration: '5i' },
			{ count: 1, type: 'minute', text: '1min', svDuration: '1i' },
			{ count: 30, type: 'second', text: '30s', svDuration: '30s' },
			{ count: 15, type: 'second', text: '15s', svDuration: '15s' },
			{ count: 5, type: 'second', text: '5s', svDuration: '5s' },
			{ count: 1, type: 'second', text: '1s', svDuration: '1s' },
		];
		var plotRangeDuration = new Date().duration(this.options.tmin) - new Date().duration(this.options.tmax);
		var rangeSelectorButtons = [{ type: 'all', text: 'All' }];
		$.each(possibleRangeSelectorButtons, function(idx, rangeSelectorButton) {
			if(plotRangeDuration >= new Date().duration(rangeSelectorButton.svDuration) * 1.2)
				rangeSelectorButtons.push({ count: rangeSelectorButton.count, type: rangeSelectorButton.type, text: rangeSelectorButton.count + Highcharts.getOptions().lang.shortDurations[rangeSelectorButton.type] });
			if(rangeSelectorButtons.length > 5)
				return false;
		});
		rangeSelectorButtons.reverse();

		var xMin = new Date() - new Date().duration(this.options.tmin);
		var xMax = new Date() - new Date().duration(this.options.tmax);

		var that = this;
		// draw the plot
		var chartOptions = {
			chart: {}, // used in code below
			title: { text: null },
			series: series,
			xAxis: {
				type: 'datetime',
				min: xMin,
				max: xMax,
				ordinal: false,
				title: { text: axis[0], align: 'high' }
			},
			navigator: {
				xAxis: {
					min: xMin,
					max: xMax,
				}
			},
			yAxis: yaxis,
			legend: {
				enabled: label.length > 0,
				align: 'center',
				verticalAlign: 'top',
				floating: true,
			},
			tooltip: {
				shared: true,
				split: false,
				pointFormatter: function() {
					var unit = this.series.yAxis.userOptions.svUnit;
					var value = (this.series.yAxis.categories) ? this.series.yAxis.categories[this.y] : parseFloat(this.y).transUnit(unit);
					return '<span class="highcharts-color-' + this.colorIndex + '">\u25CF</span> ' + this.series.name + ': <b>' + value + '</b><br/>';
				}
			},
			rangeSelector: { buttons: rangeSelectorButtons },
			plotOptions: {
				columnrange: {
					dataLabels: {
						enabled: true,
						//inside: false,
						formatter: function () {
							return parseFloat(this.y).transUnit(this.series.yAxis.userOptions.svUnit);
						}
					},
					tooltip: {
						pointFormatter: function() {
							var unit = this.series.yAxis.userOptions.svUnit;
							var minValue = parseFloat(this.low).transUnit(unit);
							var maxValue = parseFloat(this.high).transUnit(unit);
							return '<span style="visibility: hidden">\u25CF</span> min: <b>' + minValue + '</b> max: <b>' + maxValue + '</b><br/>';
						}
					}
				}
			},
		};

		if(zoom == 'advanced') { // use highstock
			chartOptions.chart.zoomType = 'x';
			// move legend according to space in rangeSelector
			chartOptions.responsive = {
				rules: [
					{
						condition: {
							callback: function() {
								var chart = this;
								return chart.rangeSelector.group.getBBox().width <= chart.rangeSelector.buttonGroup.getBBox().width + chart.rangeSelector.inputGroup.getBBox().width + 20 + chart.legend.legendWidth;
							}
						},
						chartOptions: {
							legend: {
									y: 33.5,
							}
						}
					},
					{
						condition: {
							callback: function() {
								var chart = this;
								return chart.rangeSelector.group.getBBox().width <= chart.rangeSelector.buttonGroup.getBBox().width + chart.rangeSelector.inputGroup.getBBox().width + 20;
							}
						},
						chartOptions: {
							legend: {
									y: 65,
							}
						}
					},
				]
			};

			$.extend(true, chartOptions, this.options.chartOptions);

			Highcharts.stockChart(this.element[0], chartOptions);
		}
		else {
			if(zoom) {
				chartOptions.chart.zoomType = 'x';
				chartOptions.xAxis.minRange = new Date().duration(zoom).valueOf();
			}

			$.extend(true, chartOptions, this.options.chartOptions);

			Highcharts.chart(this.element[0], chartOptions);
		}

		// set series and y-axis colors
		if (color && color.length > 0) {
			for (var i = 0; i < color.length; i++) {
				styles.push(".highcharts-color-" + i + " { fill: " + color[i] + "; stroke: " + color[i] + "; color: " + color[i] + "; }");
			}
		}
		if(styles.length > 0) {
			var containerId = this.element.find('.highcharts-container')[0].id;
			styles.unshift('<style type="text/css">');
			$(styles.join("\n#" + containerId + " ") + "\n</style>").appendTo(this.element.find('.highcharts-container'));
		}
	},

	_update: function(response) {
		// response is: [ [ [t1, y1], [t2, y2] ... ], [ [t1, y1], [t2, y2] ... ], ... ]

		var chart = this.element.highcharts();

		var xMin = new Date() - new Date().duration(this.options.tmin);
		var xMax = new Date() - new Date().duration(this.options.tmax);
		chart.xAxis[0].update({ min: xMin, max: xMax }, false);
		if(chart.navigator) {
			chart.navigator.xAxis.update({ min: xMin, max: xMax }, false);
		}

		var modes = String(this.options.mode).explode();
		var itemCount = response.length;

		var seriesIndex = -1;
		for (var i = 0; i < itemCount; i++) {
			var mode = modes.shift();
			seriesIndex++;

			if(mode == 'minmaxavg') {
				mode = 'minmax';
				modes.unshift('avg');
			}
			if(mode == 'minmax') {

				var minValues = response[i];
				var maxValues = response[i+1];
				i++;

				if(!this._memorized_response)
					this._memorized_response = {};

				if(!this._memorized_response[seriesIndex])
					this._memorized_response[seriesIndex] = { minValues: undefined, maxValues: undefined };

				if(minValues === undefined)
					minValues = this._memorized_response[seriesIndex].minValues;
				else
					this._memorized_response[seriesIndex].minValues = minValues;

				if(maxValues === undefined)
					maxValues = this._memorized_response[seriesIndex].maxValues;
				else
					this._memorized_response[seriesIndex].maxValues = maxValues;

				if(minValues === undefined || maxValues === undefined)
					continue;

				this._memorized_response[seriesIndex] = undefined;
				var values = $.map(minValues, function(value, idx) {
					var minValue = value[1], maxValue = maxValues[idx][1];
					if(minValue <= maxValue)
						return [[ value[0], minValue, maxValue ]];
					else  // swap values if min > max
						return [[ value[0], maxValue, minValue ]];
				});

				chart.series[seriesIndex].setData(values, false);
			}
			else if (response[i]) {
				chart.series[seriesIndex].setData(response[i], false);
			}
		}

		chart.redraw();
	},

});


// ----- plot.gauge solid ------------------------------------------------------
$.widget("sv.plot_gauge_", $.sv.widget, {

	initSelector: 'div[data-widget="plot.gauge"][data-mode^="solid"]',

	options: {
		stop: '',
		color: '',
		unit: '',
		label: '',
		axis: '',
		min: '',
		max: '',
		mode: '',
	},

	_create: function() {
		this._super();

		var stop = [];
		if (this.options.stop && this.options.color) {
			var datastop = String(this.options.stop).explode();
			var color = String(this.options.color).explode();

			if (datastop.length == color.length)
			{
				for (var i = 0; i < datastop.length; i++) {
					stop[i] = [ parseFloat(datastop[i])/100, color[i]]
				}
			}
		}

		var unit = this.options.unit;
		var headline = this.options.label ? this.options.label : null;

		var diff = parseFloat(this.options.min);
		var range = parseFloat(this.options.max) - parseFloat(this.options.min);

		var axis = String(this.options.axis).explode();

		var options = {
			chart: {
				type: 'solidgauge',
				spacing: [0, 0, 5, 0],
				className: 'solidgauge'
			},

			title: {
				text: headline,
				verticalAlign: 'middle'
			},

			pane: {
				background: [{
					outerRadius: '100%',
					innerRadius: '60%',
					shape: 'arc'
				}]
			},

			tooltip: {
				enabled: false
			},

			// the value axis
			yAxis: {
				min: 0,
				max: 100,
				stops: stop.length > 0 ? stop : null,
				lineWidth: 0,
				minorTickInterval: null,
				minTickInterval: 1,
				tickAmount: 2,
				labels: {
					distance: -15,
					step: 1,
					enabled: true,
					formatter: function () { return (((this.value * range) / 100) + diff); }
				}
			},

			plotOptions: {
				solidgauge: {
					dataLabels: {
						useHTML: true
					},
					stickyTracking: false
				},
			},

			series: [{
				name: headline,
				dataLabels: {
					formatter: function () { return (((this.y * range) / 100) + diff).transUnit(unit); }
				},
				colorIndex: 99, colorByPoint: false // Workaround for dynamic coloring in styled mode
			}]
		}

		var marginBottom;
		if (this.options.mode == 'solid-half')
		{
			options.chart.margin = [-30, 15, 30, 15];
			options.chart.height = '53%';
			options.pane.startAngle = -90;
			options.pane.endAngle = 90;
			options.pane.size = '140%';
			options.pane.center = ['50%', '100%'];
			options.title.verticalAlign = 'bottom';
			options.yAxis.labels.y = 16;
			options.yAxis.labels.distance = -8;
			options.plotOptions.solidgauge.dataLabels.y = -25;
		}
		else if (this.options.mode == 'solid-cshape')
		{
			options.chart.margin = [25, 15, -25, 15];
			options.chart.height = '75%';
			options.pane.startAngle = -130;
			options.pane.endAngle = 130;
			options.pane.size = '100%';
			options.pane.center = ['50%', '50%'];
			options.yAxis.labels.y = 20;
			options.plotOptions.solidgauge.dataLabels.y = -15;
		}
		else if (this.options.mode == 'solid-circle')
		{
			options.chart.margin = [0, 15, 0, 15],
			options.chart.height = '88%';
			options.pane.startAngle = 0;
			options.pane.endAngle = 360;
			options.pane.center = ['50%', '50%'];
			options.pane.background.shape = 'circle';
			options.yAxis.labels.y = -20;
			options.yAxis.labels.step = 2;
			options.plotOptions.solidgauge.dataLabels.y = -10;
		}
		options.title.y = options.plotOptions.solidgauge.dataLabels.y + options.chart.margin[0];

		this.element.highcharts(options);
	},

	_update: function(response) {
		if (response) {
			var diff = parseFloat(this.options.min);
			var range = parseFloat(this.options.max) - parseFloat(this.options.min);
			var percent = (((response - diff) * 100) / range);
			var chart = this.element.highcharts();
			if(chart.series[0].points[0])
				chart.series[0].points[0].update(percent, true);
			else
				chart.series[0].addPoint(percent, true);
		}
	},

});


// ----- plot.gauge angular ----------------------------------------------------
$.widget("sv.plot_gauge_angular", $.sv.widget, {

	initSelector: 'div[data-widget="plot.gauge"][data-mode="speedometer"], div[data-widget="plot.gauge"][data-mode="scale"]',

	options: {
		stop: '',
		color: '',
		unit: '',
		label: '',
		axis: '',
		min: '',
		max: '',
		mode: '',
	},

	_create: function() {
		this._super();

		var headline = this.options.label ? this.options.label : null;
		var unit = this.options.unit;
		var axis = String(this.options.axis).explode();
		var mode = this.options.mode;
		var datastop = String(this.options.stop).explode();
		var color = String(this.options.color).explode();

		var diff = parseFloat(this.options.min);
		var range = parseFloat(this.options.max - this.options.min);
//		var percent = (((response - diff) * 100) / range);
		var percent = 0;

		var styles = [];

		var yaxis = [];
		var gauge = [];
		var pane = [];
		var series = [];


		for (var i = 0; i < this.items.length; i++) {
			if (mode == 'scale') { // type = scale
				var bands = [{
						outerRadius: '99%',
						thickness: 15,
						from: percent,
						to: 100
					}];

				if (datastop.length > 0 && color.length > 1)
				{
					for (var j = 0; j < datastop.length; j++) {
						bands.push({
							outerRadius: '99%',
							thickness: 15,
							from: j == 0 ? 0 : parseFloat(datastop[j-1]),
							to: Math.min(parseFloat(datastop[j]), percent)
						});
						if(parseFloat(datastop[j]) >= percent)
							break;
					}
					for (var j = 0; j < color.length; j++) {
						if(color[j] != '')
							styles.push(".highcharts-plot-band:nth-of-type(" + (j + 2) + ") { fill: " + color[j] + "; fill-opacity: 1; }");
					}

				}
				else {
					bands.push({
						outerRadius: '99%',
						thickness: 15,
						from: 0,
						to: percent,
					});
					if(color.length > 0)
						styles.push(".highcharts-plot-band { fill: " + color[0] + "; fill-opacity: 1; }");
				}


				yaxis[i] = {
					min: 0,
					max: 100,
					minorTickInterval: 1.5,
					minorTickLength: 17,
					minorTickPosition: 'inside',
					minTickInterval: 1,
					labels: {
						enabled: true,
						distance: -25,
						formatter: function () {return (((this.value * range) / 100) + diff)}
					},
					plotBands: bands,
					title: {
						text: axis[i],
						y: 14
					}
				}
				gauge[i] = {
					dial: {
						radius: '100%',
						baseWidth: 3,
						topWidth: 3,
						baseLength: '90%', // of radius
						rearLength: '-70%'
					},
					pivot: {
						radius: 0
					}
				}
				pane[i] = {
					startAngle: -130,
					endAngle: 130,
					background: [{
						outerRadius: '108%'
					}]
				}
				series[i] = {
					name: headline,
					yAxis: i,
					dataLabels: {
						formatter: function () {return (((this.y * range) / 100) + diff).transUnit(unit)},
						y: -20
					},
					tooltip: {
						enabled: false
					}
				}
			}
			else // type = speedometer
			{
				var bands = [];
				if (this.options.stop && this.options.color) {
					for (var j = 0; j < datastop.length; j++) {
						bands.push({
							from: j == 0 ? 0 : parseFloat(datastop[j-1]),
							to: parseFloat(datastop[j])
						});
					}
					for (var j = 0; j < color.length; j++) {
						if(color[j] != '')
							styles.push(".highcharts-plot-band:nth-of-type(" + (j + 1) + ") { fill: " + color[j] + "; fill-opacity: 1; }");
					}
				}

				yaxis[i] = {
					min: 0,
					max: 100,
					minorTickInterval: 'auto',
					minorTickLength: 10,
					minorTickPosition: 'inside',
					minTickInterval: 1,
					tickPixelInterval: 30,
					tickPosition: 'inside',
					tickLength: 10,
					labels: {
						step: 2,
						rotation: 'auto',
						formatter: function () {return (((this.value * range) / 100) + diff)}
					},
					title: {
						text: axis[i]
					},
					plotBands: bands.length > 0 ? bands : null
				}
				gauge[i] = {
				}
				pane[i] = {
					startAngle: -150,
					endAngle: 150,
					size: "95%",
					background: [{
						className: 'outer-pane',
						outerRadius: '109%'
					}, {
						className: 'middle-pane',
						outerRadius: '107%'
					}, {
					}, {
						className: 'inner-pane',
						outerRadius: '105%',
						innerRadius: '103%'
					}]
				}

				series[i] = {
					name: headline,
					yAxis: i,
					dataLabels: {
						formatter: function () {return (((this.y * range) / 100) + diff).transUnit(unit)}
					}
				}
			}
		}

		this.element.highcharts({
			chart: {
				type: 'gauge',
				plotShadow: false,
				height: '100%'
			},
			title: {
				text: headline
			},
			plotOptions: {
				 gauge: gauge[0],
			},
			pane: pane,
			tooltip: {
				enabled: false
			},
			defs: {
				speedometerOuterPaneGradient: {
					id: 'speedometerOuterPaneGradient',
					tagName: 'linearGradient',
					x1: 0, y1: 0, x2: 0, y2: 1,
					children: [
						{ tagName: 'stop', offset: 0 },
						{ tagName: 'stop', offset: 1 },
					]
				},
				speedometerMiddlePaneGradient: {
					id: 'speedometerMiddlePaneGradient',
					tagName: 'linearGradient',
					x1: 0, y1: 0, x2: 0, y2: 1,
					children: [
						{ tagName: 'stop', offset: 0 },
						{ tagName: 'stop', offset: 1 },
					]
				}
			},
			// the value axis
			yAxis: yaxis,
			series: series
		});

		styles.push('.outer-pane { fill: url(' + location.pathname + location.search + '#speedometerOuterPaneGradient) }');
		styles.push('.middle-pane { fill: url(' + location.pathname + location.search + '#speedometerMiddlePaneGradient) }');

		if(styles.length > 0) {
			var containerId = this.element.find('.highcharts-container')[0].id;
			styles.unshift('<style type="text/css">');
			$(styles.join("\n#" + containerId + " ") + "\n</style>").appendTo(this.element.find('.highcharts-container'));
		}
	},

	_update: function(response) {
		//debug: console.log("[plot.gauge-speedometer] '" + this.id + "' point: " + response);

		var diff = (this.options.max - (this.options.max - this.options.min));
		var range = this.options.max - this.options.min;
		var datastop = String(this.options.stop).explode();
		var color = String(this.options.color).explode();

		var data = [];
		var items = this.items;
		for (i = 0; i < items.length; i++) {
			if (response[i]) {
				data[i] = (((+response[i] - diff) * 100) / range);
			}
			else
			{
				data[i] = (((+widget.get(items[i]) - diff) * 100) / range);
			}
		}

		var chart = this.element.highcharts();

		for (i = 0; i < data.length; i++) {
			var percent = data[i];
			if(this.options.mode == 'scale')
			{
				chart.yAxis[i].removePlotBand();
				chart.yAxis[i].addPlotBand({
						outerRadius: '99%',
						thickness: 15,
						from: percent,
						to: 100
					});
				if (datastop.length > 0 && color.length > 1)
				{
					for (var j = 0; j < datastop.length; j++) {
						chart.yAxis[i].addPlotBand({
							outerRadius: '99%',
							thickness: 15,
							from: j == 0 ? 0 : parseFloat(datastop[j-1]),
							to: Math.min(parseFloat(datastop[j]), percent)
						});
						if(parseFloat(datastop[j]) >= percent)
							break;
					}
				}
				else {
					chart.yAxis[i].addPlotBand({
						outerRadius: '99%',
						thickness: 15,
						from: 0,
						to: percent
					});
				}
				chart.series[i].setData([percent], false);
			}
			else {
				if(chart.series[0].points[0])
					chart.series[0].points[0].update(percent, false);
				else
					chart.series[0].addPoint(percent, false);
			}
		}
		chart.redraw();
	},

});


// ----- plot.gauge-vumeter ----------------------------------------------------------
$.widget("sv.plot_gauge_vumeter", $.sv.widget, {

	initSelector: 'div[data-widget="plot.gauge"][data-mode="vumeter"]',

	options: {
		stop: '',
		color: '',
		unit: '',
		label: '',
		axis: '',
		min: '',
		max: '',
		mode: '',
	},

	_create: function() {
		this._super();

		var headline = this.options.label ? this.options.label : null;
		var chartHeight = this.options.label == '' ? 150 : 200;

		var diff = parseFloat(this.options.min);
		var range = parseFloat(this.options.max) - parseFloat(this.options.min);

		var styles = [];

		var bands = [];
		if (this.options.stop && this.options.color) {
			var datastop = String(this.options.stop).explode();
			var color = String(this.options.color).explode();

			for (var j = 0; j < datastop.length; j++) {
				bands.push({
					from: j == 0 ? 0 : parseFloat(datastop[j-1]),
					to: parseFloat(datastop[j]),
					innerRadius: '100%',
					outerRadius: '105%'
				});
			}
			for (var j = 0; j < color.length; j++) {
				styles.push(".highcharts-plot-band:nth-of-type(" + (j + 1) + ") { fill: " + (color[j] != '' ? color[j] : 'transparent') + "; fill-opacity: 1; }");
			}
		}

		var axis = [];
		var pane = [];
		var series = [];

		var seriesCount = this.items.length;

		for (i = 0; i < seriesCount; i++) {
			axis[i] = {
				min: 0,
				max: 100,
				minorTickPosition: 'outside',
				tickPosition: 'outside',
				labels: {
					rotation: 'auto',
					distance: 20,
					formatter: function () {return (((this.value * range) / 100) + diff)}
				},
				plotBands: bands,
				pane: i,
				title: {
					text: 'VU<br/><span style="font-size:8px">Channel ' + (i+1) + '</span>',
					y: -40
				}
			}
			pane[i] = {
				startAngle: -45,
				endAngle: 45,
				background: null,
				center: [(100/seriesCount/2*(2*i+1))+'%', '145%'],
				size: 280
			}
			series[i] = {
				name: 'Channel ' + i,
				yAxis: i
			}
		}

		this.element.highcharts({
			chart: {
				type: 'gauge',
				height: chartHeight
			},

			title: {
				text: headline,
			},

			pane: pane,

			tooltip: {
				enabled: false,
			},

			// the value axis
			yAxis: axis,

			plotOptions: {
				gauge: {
					dataLabels: {
						enabled: false
					},
					dial: {
						radius: '100%'
					}
				}
			},
			defs: {
				vumeterGradient: {
					id: 'vumeterGradient',
					tagName: 'linearGradient',
					x1: 0, y1: 0, x2: 0, y2: 1,
					children: [
						{ tagName: 'stop', offset: 0 },
						{ tagName: 'stop', offset: 0.3 },
						{ tagName: 'stop', offset: 1 },
					]
				}
			},
			series: series,
		});

		styles.push('.highcharts-plot-background { fill: url(' + location.pathname + location.search + '#vumeterGradient) }');

		if(styles.length > 0) {
			var containerId = this.element.find('.highcharts-container')[0].id;
			styles.unshift('<style type="text/css">');
			$(styles.join("\n#" + containerId + " ") + "\n</style>").appendTo(this.element.find('.highcharts-container'));
		}
	},

	_update: function(response) {
		//debug: console.log("[plot.gauge-vumeter] '" + this.id + "' point: " + response);

		var diff = (this.options.max - (this.options.max - this.options.min));
		var range = this.options.max - this.options.min;

		var data = [];
		var items = this.items;
		for (i = 0; i < items.length; i++) {
			if (response[i]) {
				data[i] = (((+response[i] - diff) * 100) / range);
			}
			else
			{
				data[i] = (((+widget.get(items[i]) - diff) * 100) / range);
			}
		}

		var chart = this.element.highcharts();
		for (i = 0; i < data.length; i++) {
			if(chart.series[i].points[0])
				chart.series[i].points[0].update(data[i], false);
			else
				chart.series[i].addPoint(data[i], false);
		}
		chart.redraw();
	},

});


// ----- plot.pie --------------------------------------------------------------
$.widget("sv.plot_pie", $.sv.widget, {

	initSelector: 'div[data-widget="plot.pie"]',

	options: {
		label: '',
		mode: '',
		color: '',
		text: '',
	},

	_create: function() {
		this._super();

		var isLabel = false;
		var isLegend = false;
		var labels = [];
		if (this.options.label) {
			labels = String(this.options.label).explode();
			isLabel = true;
		}
		if (this.options.mode == 'legend') {
			isLegend = true;
			isLabel = false;
		}
		else if (this.options.mode == 'none') {
			isLabel = false;
		}
		var color = [];
		if (this.options.color) {
			color = String(this.options.color).explode();
		}

		// design
		var headline = this.options.text;
		var position = 'top';
		if (this.options.text == '') {
			position = 'bottom';
		}

		// draw the plot
		this.element.highcharts({
			chart: {
				type: 'pie'
			},
			legend: {
				align: 'center',
				verticalAlign: position,
				x: 0,
				y: 20
			},
			title: {
				text: headline
			},
			tooltip: {
				formatter: function() {
					return this.point.name + ' <b>' + this.y.transUnit('%') + '</b>';
				},
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: isLabel,
						formatter: function() {
							return this.point.name + ' <b>' + this.y.transUnit('%') + '</b>';
						}
					},
					showInLegend: isLegend
				}
			},
			series: [{
				name: headline,
				colorByPoint: true,
			}],
		});

		//set custom colors
		styles = [];
		if (color && color.length > 0) {
			for (var i = 0; i < color.length; i++) {
				styles.push(".highcharts-color-" + i + " { fill: " + color[i] + "; stroke: " + color[i] + "; color: " + color[i] + "; }");
			}
		}
		if(styles.length > 0) {
			var containerId = this.element.find('.highcharts-container')[0].id;
			styles.unshift('<style type="text/css">');
			$(styles.join("\n#" + containerId + " ") + "\n</style>").appendTo(this.element.find('.highcharts-container'));
		}
	},

	_update: function(response) {
		var val = 0;
		var data = [];
		var items = this.items;
		for (i = 0; i < items.length; i++) {
			if (response[i]) {
				val = val +  +response[i];
			}
			else
			{
				val = val +  +widget.get(items[i]);
			}
		}
		for (i = 0; i < items.length; i++) {
			if (response[i]) {
				data[i] = +response[i] * 100 / val;
			}
			else
			{
				data[i] = +widget.get(items[i]) * 100 / val;
			}
		}

		var chart = this.element.highcharts();
		for (i = 0; i < data.length; i++) {
			if(chart.series[0].data[i])
				chart.series[0].data[i].update(data[i], false);
			else
				chart.series[0].addPoint(data[i], false);
		}
		chart.redraw();
	},

});


// ----- plot.rtr -------------------------------------------------------------
$.widget("sv.plot_rtr", $.sv.widget, {

	initSelector: 'div[data-widget="plot.rtr"]',

	options: {
		label: '',
		axis: '',
		min: null,
		max: null,
		tmin: '',
		tmax: '',
		count: 100,
		stateMax: null
	},

	allowPartialUpdate: true,

	_create: function() {
		this._super();

		var label = String(this.options.label).explode();
		var axis = String(this.options.axis).explode();

		// draw the plot
		this.element.highcharts({
			chart: {type: 'line'},
			title: { text: null },
			legend: {
				align: 'center',
				verticalAlign: 'top',
				floating: true
			},
			series: [
				{
					name: label[0], type: 'spline'
				},
				{
					name: label[1], className: 'shortdot', step: 'left'
				},
				{
					type: 'pie',
					data: [
						{
							name: 'On'//, y: percent
						},
						{
							name: 'Off', color: null//, y: (100 - percent)
						}
					],
					center: ['95%', '90%'],
					size: 35,
					showInLegend: false,
					dataLabels: {enabled: false},
					tooltip: {
						headerFormat: '',
						pointFormatter: function () {
							return '∑ '+this.name+': <b>'+this.percentage.transUnit('%')+'</b>';
						}
					},
				}
			],
			xAxis: {
				type: 'datetime',
				min: new Date() - new Date().duration(this.options.tmin),
				max: new Date() - new Date().duration(this.options.tmax),
			},
			yAxis: {min: this.options.min, max: this.options.max, title: {text: axis[1]}},
			tooltip: {
				pointFormatter: function () {
					return this.series.name + ' <b>' + this.y.transUnit('temp') + '</b><br>';
				},
				shared: true
			}
		});
	},

	_update: function(response) {
		// response is: {{ gad_actual }}, {{ gad_set }}, {{ gat_state }}

		var count = this.options.count;
		if (count < 1) {
			count = 100;
		}

		var chart = this.element.highcharts();

		chart.xAxis[0].setExtremes(new Date() - new Date().duration(this.options.tmin), new Date() - new Date().duration(this.options.tmax), false);

		for (var i = 0; i < response.length; i++) {
			if (response[i] && (i == 0 || i == 1)) {
				chart.series[i].setData(response[i], false);
			}
			else if (response[i] && (i == 2)) {
				var state = response[i];
				var percent = 0, stateMax = 1;
				if(state.length == 1)
					percent = state[0][1];
				else {
					// calculate state: diff between timestamps in relation to duration
					for (var j = 1; j < state.length; j++) {
						var value = state[j - 1][1];
						percent += value * (state[j][0] - state[j - 1][0]);
						if(value > 100) // any value is > 100
							stateMax = 255;
						if(stateMax == 1 && value > 1) // any value is > 1 and none is > 100
							stateMax = 100;
					}
					percent = percent / (state[state.length-1][0] - state[0][0]);
				}

				if (!isNaN(this.options.stateMax) && Number(this.options.stateMax) != 0)
					stateMax = Number(this.options.stateMax);

				percent = percent * 100 / stateMax;

				chart.series[i].setData([percent,100-percent], false, undefined, true);
			}
		}
		chart.redraw();
	},

});


// ----- plot.temprose --------------------------------------------------------
$.widget("sv.plot_temprose", $.sv.widget, {

	initSelector: 'div[data-widget="plot.temprose"]',

	options: {
		label: '',
		axis: '',
		count: '',
		unit: '',
	},

	allowPartialUpdate: true,

	_create: function() {
		this._super();

		var label = String(this.options.label).explode();
		var axis = String(this.options.axis).explode();
		var count = parseInt(this.options.count);
		var unit = this.options.unit;

		var plots = [];
		plots[0] = {
			name: label[0], pointPlacement: 'on'
		};

		if (this.items.length > count) {
			plots[1] = {
				name: label[1], pointPlacement: 'on',
				className: 'shortdot'
			}
		}

		this.element.highcharts({
			chart: {polar: true, type: 'line', marginLeft: 10, className: 'polarChart' },
			title: { text: null },
			series: plots,
			xAxis: { categories: axis, tickmarkPlacement: 'on', lineWidth: 0 },
			yAxis: { gridLineInterpolation: 'polygon', lineWidth: 0, minTickInterval: 1 },
			tooltip: {
				formatter: function () {
					return this.x + ' - ' + this.series.name + ': <b>' + this.y.transUnit(unit) + '</b>';
				}
			},
			legend: {
				x: 10,
				layout: 'vertical',
				align: 'center',
				floating: true,
			}
		});
	},

	_update: function(response) {
		// response is: {{ gad_actual_1, gad_actual_2, gad_actual_3, gad_set_1, gad_set_2, gad_set_3 }}

		var chart = this.element.highcharts();
		var count = parseInt(this.options.count);
		var itemCount = this.items.length;

		for(var i = 0; i < itemCount; i++) {
			if(response[i] === undefined)
				continue;

			var point = chart.series[i < count ? 0 : 1].data[i % count];

			if(point)
					point.update(response[i] * 1.0, false);
			else
				chart.series[i < count ? 0 : 1].addPoint(response[i] * 1.0, false);
		}
		chart.redraw();
	},

});
