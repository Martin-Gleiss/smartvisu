// base for all dynamic icons
$.widget("sv.dynicon", $.sv.widget, {

	options: {
		min: 0,
		max: 255
	},

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		if(response[1] !== undefined)
			this.element.attr('class', 'icon' + (response[0] && response[1] ? ' icon1' : ' icon0')) // addClass does not work in jQuery for svg

		var max = this.options.max;
		var min = this.options.min;
		var percent = Math.round(response[1] == 0 ? 0 : Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 100);
		var percent = Number.isNaN(percent) ? 0 : percent;
		this.element.attr('alt', this.options.widget.substr(5) + ' ' + percent+'%').attr('title', percent+'%').children('title').remove().end().prepend('<title>'+percent+'%</title>');
	},

	_events: {
		'click': function (event) {
			if (this.options.item) {
				var items = this.options.item.explode();

				if (items[1]) {
					io.write(items[1], (widget.get(items[1]) == 0 ? 1 : 0));
				}
			}
		}
	}

});


// ----- icon.arrow -----------------------------------------------------------
$.widget("sv.icon_arrow", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.arrow"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 2 * Math.PI;

		var pt = [];
		pt = pt.concat([50, 50], fx.rotate([25, 50], ang, [50, 50]), fx.rotate([50, 18], ang, [50, 50]), fx.rotate([75, 50], ang, [50, 50]), [50, 50]);
		this.element.find('#line0').attr('points', pt.toString());

		pt = [];
		pt = pt.concat(fx.rotate([32, 50], ang, [50, 50]), fx.rotate([32, 60], ang, [50, 50]), fx.rotate([68, 60], ang, [50, 50]), fx.rotate([68, 50], ang, [50, 50]));
		this.element.find('#line1').attr('points', pt.toString());
	}
});

	// ----- icon.battery ---------------------------------------------------------
$.widget("sv.icon_battery", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.battery"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		var val = Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 40 / 6) * 6;
		fx.grid(this.element[0], val, [39, 68], [61, 28]);
	}
});


// ----- icon.blade -----------------------------------------------------------
$.widget("sv.icon_blade", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.blade"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		// calculate angle in (0 - ~90°)
		var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 0.4 * Math.PI;
		var pt;

		for (var i = 0; i <= 3; i++) {
			pt = [];
			pt = pt.concat(fx.rotate([37, 20 + i * 20], ang, [50, 20 + i * 20]), fx.rotate([63, 20 + i * 20], ang, [50, 20 + i * 20]));
			this.element.find('#blade' + i).attr('points', pt.toString());
		}
	}
});


// ----- icon.blade2 -----------------------------------------------------------
$.widget("sv.icon_blade2", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.blade2"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		// calculate angle in (0 - ~180°)
		var val = response[1];
		var ang = -1 * (Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * -0.7 * Math.PI + 0.35 * Math.PI);
		var pt;

		for (var i = 0; i <= 3; i++) {
			pt = [];
			pt = pt.concat(fx.rotate([37, 20 + i * 20], ang, [50, 20 + i * 20]), fx.rotate([63, 20 + i * 20], ang, [50, 20 + i * 20]));
			this.element.find('#blade' + i).attr('points', pt.toString());
		}
	}
});


// ----- icon.blade_z ---------------------------------------------------------
$.widget("sv.icon_blade_z", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.blade_z"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		// calculate angle in (0 - 90°)
		var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 0.5 * Math.PI * -1;

		var pt = [];
		pt = pt.concat(fx.rotate([25, 25], ang, [50, 30]), fx.rotate([45, 25], ang, [50, 30]), fx.rotate([55, 35], ang, [50, 30]), fx.rotate([75, 35], ang, [50, 30]));
		this.element.find('#blade0').attr('points', pt.toString());

		pt = [];
		pt = pt.concat(fx.rotate([25, 65], ang, [50, 70]), fx.rotate([45, 65], ang, [50, 70]), fx.rotate([55, 75], ang, [50, 70]), fx.rotate([75, 75], ang, [50, 70]));
		this.element.find('#blade1').attr('points', pt.toString());
	}
});


// ----- icon.blade_arc -------------------------------------------------------
$.widget("sv.icon_blade_arc", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.blade_arc"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		// calculate angle in (0 - 90°)
		var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * -0.7 * Math.PI + 0.35 * Math.PI;
		var pt;

		pt = 'M ' + fx.rotate([30, 40], ang, [50, 37]) + ' Q ' + fx.rotate([50, 22], ang, [50, 30]) + ' ' + fx.rotate([70, 40], ang, [50, 37]);
		this.element.find('#blade0').attr('d', pt);

		pt = 'M ' + fx.rotate([30, 80], ang, [50, 77]) + ' Q ' + fx.rotate([50, 62], ang, [50, 70]) + ' ' + fx.rotate([70, 80], ang, [50, 77]);
		this.element.find('#blade1').attr('d', pt);
	}
});


// ----- icon.cistern ---------------------------------------------------------
$.widget("sv.icon_cistern", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.cistern"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		var val = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 100;
		this.element.find('[data-val]').hide().filter(function() { return Number($(this).attr('data-val')) <= val } ).show();
	}
});


// ----- icon.clock -----------------------------------------------------------
$.widget("sv.icon_clock", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.clock"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var ang_l = (response[0] % 60) / 60 * 2 * Math.PI;
		this.element.find('#hand_l').attr('points', '50,50 ' + fx.rotate([50, 30], ang_l, [50, 50]).toString());

		var ang_s = (Math.floor(response[0] / 60) * 5) / 60 * 2 * Math.PI;
		this.element.find('#hand_s').attr('points', '50,50 ' + fx.rotate([50, 35], ang_s, [50, 50]).toString());

		var timestring = ('0' + Math.floor(response[0] / 60)).substr(-2) + ':' + ('0' + (response[0] % 60)).substr(-2);
		this.element.attr('alt', 'clock ' + timestring).attr('title', timestring);
	}
});


// ----- icon.compass ---------------------------------------------------------
$.widget("sv.icon_compass", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.compass"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 2 * Math.PI;

		var pt = [];
		pt = pt.concat(fx.rotate([40, 50], ang, [50, 50]), fx.rotate([50, 25], ang, [50, 50]), fx.rotate([60, 50], ang, [50, 50]));
		this.element.find('#pin0').attr('points', pt.toString());

		pt = [];
		pt = pt.concat(fx.rotate([40, 50], ang, [50, 50]), fx.rotate([50, 75], ang, [50, 50]), fx.rotate([60, 50], ang, [50, 50]));
		this.element.find('#pin1').attr('points', pt.toString());
	}
});


// ----- icon.garagedoor ---------------------------------------------------------
$.widget("sv.icon_garagedoor", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.garagedoor"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		var val = Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 43);
		fx.grid(this.element[0], val, [19, 40], [80, 83]);
	}
});


// ----- icon.graph -----------------------------------------------------------
$.widget("sv.icon_graph", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.graph"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		var val = Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 70);
		var graph = this.element.find('#graph').attr('d').substr(8);
		var points = graph.split('L');

		if (points.length > 8) {
			points.shift();
		}

		graph = 'M 15,85 ';
		for (var i = 1; i < points.length; i++) {
			graph += 'L ' + (i * 10 + 5) + ',' + points[i].substr(points[i].indexOf(',') + 1).trim() + ' ';
		}

		this.element.find('#graph').attr('d', graph + 'L ' + (i * 10 + 5) + ',' + (85 - val));
	}
});


// ----- icon.heating ---------------------------------------------------------
$.widget("sv.icon_heating", $.sv.widget, {
	// nedded for click handling only
	initSelector: '[data-widget="icon.heating"]',

	_events: {
		'click': function (event) {
			if (this.options.item) {
				var items = this.options.item.explode();

				if (items[0]) {
					io.write(items[0], (widget.get(items[0]) == 0 ? 1 : 0));
				}
			}
		}
	}
});

$.widget("sv.icon_heating_gradient", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.heating.gradient"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		var val = Math.min(Math.max((response[0] - min) / (max - min), 0), 1);

		this.element.find('linearGradient stop:last-of-type').attr('offset', val);
	}
});


// ----- icon.light ---------------------------------------------------------
$.widget("sv.icon_light", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.light"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		var val = Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 10);
		// Iterate over all child elements
		var i = 1;
		this.element.find('g#light-rays line').each(function () {
			$(this).css("visibility", (val >= i ? "visible" : "hidden"));
			i++;
		});
	}
});


// ----- icon.meter -----------------------------------------------------------
$.widget("sv.icon_meter", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.meter"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 0.48 * Math.PI;
		this.element.find('#pointer').attr('points', '50,85 ' + fx.rotate([15, 48], ang, [50, 85]).toString());
	}
});


// ----- icon_roofwindow ------------------------------------------------------
$.widget("sv.icon_roofwindow", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.roofwindow"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);
		var x = Math.min(Math.max((response[0] - min) / (max - min), 0), 1);

		var a = 6.6-6.2*x;
		var b = 3.6-3.4*x;
		var c = 3.0-2.8*x;
		var d = 127.7-118.6*x;
		var e = 245-59*x;

		var casement = "M202 "+e+"c-1.7 "+b+"-6 "+a+"-9.6 "+a+"h-91c-3.6 0-5.1-"+c+"-3.4-"+a+"l59.5-"+d+"c1.7-"+b+" 6-"+a+" 9.6-"+a+"h91c3.6 0 5.1 "+c+" 3.4 "+a+"L202 "+e+"z";
		this.element.find('#casement').attr('d', casement);
	}
});


// ----- icon.shutter ---------------------------------------------------------
$.widget("sv.icon_shutter", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.shutter"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		var val = Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 38);
		fx.grid(this.element[0], val, [14, 30], [86, 68]);
	}
});


// ----- icon.ventilation -----------------------------------------------------
$.widget("sv.icon_ventilation", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.ventilation"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		var val = (1 - Math.min(Math.max((response[0] - min) / (max - min), 0), 1)) * 4.5 + 0.5;
		this.element.find('#anim').attr('dur', (response[0] > 0 ? val : 0)).attr('begin', 0);
	}
});


// ----- icon.volume ---------------------------------------------------------
$.widget("sv.icon_volume", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.volume"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		var val = Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 71);
		// fx.bar(this, val, [left, bottom], [right, top]);
		fx.bar(this.element[0], val, [18, 68], [89, 50]);
	}
});


// ----- icon.windmill --------------------------------------------------------
$.widget("sv.icon_windmill", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.windmill"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		var val = (1 - Math.min(Math.max((response[0] - min) / (max - min), 0), 1)) * 4.5 + 0.5;
		this.element.find('#anim1').attr('dur', (response[0] > 0 ? val : 0)).attr('begin', 0);
	}
});


// ----- icon.windrose --------------------------------------------------------
$.widget("sv.icon_windrose", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.windrose"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 2 * Math.PI;

		var pt = [];
		pt = pt.concat(fx.rotate([50, 60], ang, [50, 50]), fx.rotate([37, 71], ang, [50, 50]), fx.rotate([50, 29], ang, [50, 50]));
		this.element.find('#pin0').attr('points', pt.toString());

		pt = [];
		pt = pt.concat(fx.rotate([50, 60], ang, [50, 50]), fx.rotate([63, 71], ang, [50, 50]), fx.rotate([50, 29], ang, [50, 50]));
		this.element.find('#pin1').attr('points', pt.toString());
	}
});


// ----- icon.windsock --------------------------------------------------------
$.widget("sv.icon_windsock", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.windsock"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 0.45 * Math.PI;

		var pt = [];
		pt = pt.concat(fx.rotate([70, 40], ang, [80, 22]), [80, 22], fx.rotate([90, 40], ang, [80, 22]));
		this.element.find('#top').attr('points', pt.toString());

		for (var i = 0; i < 3; i++) {
			pt = [];
			pt = pt.concat(fx.rotate([71 + i * 2, 50 + i * 14], ang, [80, 22]), fx.rotate([89 - i * 2, 50 + i * 14], ang, [80, 22]),
				fx.rotate([88 - i * 2, 54 + i * 14], ang, [80, 22]), fx.rotate([72 + i * 2, 54 + i * 14], ang, [80, 22]));
			this.element.find('#part' + i).attr('points', pt.toString());
		}

		pt = [];
		pt = pt.concat(fx.rotate([70, 40], ang, [80, 22]), fx.rotate([76, 82], ang, [80, 22]), fx.rotate([84, 82], ang, [80, 22]), fx.rotate([90, 40], ang, [80, 22]));
		this.element.find('#part3').attr('points', pt.toString());
	}
});


// ----- icon.zenith ----------------------------------------------------------
$.widget("sv.icon_zenith", $.sv.dynicon, {

	initSelector: 'svg[data-widget="icon.zenith"]',

	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_switch }}
		this._super(response);

		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);

		var ang = Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * Math.PI;
		pt = fx.rotate([10, 90], ang, [50, 90]);

		this.element.find('#sun').attr('x', pt[0] - 50);
		this.element.find('#sun').attr('y', pt[1] - 50);
	}
});