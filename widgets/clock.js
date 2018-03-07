$.widget("sv.clock", $.sv.widget, {

	options: {
		"servertime-url": ""
	},

	_init: function() {
		this._super();
		// init servertime offset on all clocks
		if(window.servertimeoffset === undefined && this.options["servertime-url"] != '') {
			if(window.servertimelisteners)
				window.servertimelisteners.push(this);
			else {
				window.servertimelisteners = [this];
				var localtime = Date.now();
				$.ajax({
					url: this.options["servertime-url"],
					cache: false
				}).done(function(resp) {
					var servertime = Number(resp) * 1000;
					// use average of start and end request timestamp and make it local time
					localtime = localtime / 2 + Date.now() / 2;
					window.servertimeoffset = servertime - localtime;
					//$(bevent.target).find('[data-servertime-url]').trigger('init').trigger('repeat');
					while(window.servertimelisteners.length > 0)
						window.servertimelisteners.shift()._init();
					window.servertimelisteners = null;
				});
			}
		}
	},

});


// ----- clock.digiclock ------------------------------------------------------
$.widget("sv.clock_digiclock", $.sv.clock, {

	initSelector: 'div.digiclock[data-widget="clock.digiclock"]',

	options: {
		"service-url": ""
	},

	_init: function() {
		this._super();
		this.element.digiclock({ svrOffset: window.servertimeoffset || 0 });
		var that = this;
		this.element.find('div.digiweather[data-widget="clock.digiclock"]').each(function() {
			var node = $(this);
			$.getJSON(that.options["service-url"], function (data) {
				node.find('img').attr('src', 'lib/weather/pics/' + data.current.icon + '.png').attr('alt', data.current.icon);
				node.find('.city').html(data.city);
				node.find('.cond').html(data.current.conditions);
				node.find('.temp').html(data.current.temp);
			});
		});
	},

	//TODO: repeat
});


// ----- clock.iconclock ------------------------------------------------------
$.widget("sv.clock_iconclock", $.sv.clock, {

	initSelector: 'span[data-widget="clock.iconclock"]',

	_repeat: function() {
		var now = new Date(Date.now() - (window.servertimeoffset || 0));
		var minutes = Math.floor(now.getHours()*60 + now.getMinutes());
		var icon = this.element.find('svg');
		if(icon.is(':sv-icon_clock'))
			icon.icon_clock('update', [minutes]);
		else
			icon.on("icon_clockcreate", function( event, ui ) { icon.icon_clock('update', [minutes]); } );
	},

});

// ----- clock.miniclock ------------------------------------------------------
$.widget("sv.clock_miniclock", $.sv.clock, {

	initSelector: 'span[data-widget="clock.miniclock"]',

	options: {
		format: 'time'
	},

	_repeat: function() {
			var now = new Date(Date.now() - (window.servertimeoffset || 0));
			this.element.text(now.transUnit(this.options.format));
	},

});
