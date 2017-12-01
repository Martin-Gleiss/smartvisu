// ----- clock.digiclock ------------------------------------------------------
$.widget("sv.clock_digiclock", $.sv.widget, {

	initSelector: 'div.digiclock[data-widget="clock.digiclock"]',

	_create: function() {
		this._super();
		this.element.digiclock({ svrOffset: window.servertimeoffset || 0 });		
		this.element.find('div.digiweather[data-widget="clock.digiclock"]').each(function() {
			var node = $(this);
			$.getJSON($(this).attr("data-service-url"), function (data) {
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
$.widget("sv.clock_iconclock", $.sv.widget, {

	initSelector: 'span[data-widget="clock.iconclock"]',

	_repeat: function() {
		var now = new Date(Date.now() - (window.servertimeoffset || 0));
		var minutes = Math.floor(now.getHours()*60 + now.getMinutes());
		this.element.find('svg').trigger('update', [[minutes]]);
	},

});

// ----- clock.miniclock ------------------------------------------------------
$.widget("sv.clock_miniclock", $.sv.widget, {

	initSelector: 'span[data-widget="clock.miniclock"]',

	options: {
		format: 'time'
	},

	_repeat: function() {
			var now = new Date(Date.now() - (window.servertimeoffset || 0));
			this.element.text(now.transUnit(this.options.format));
	},

});

//TODO
/*
	// init servertime offset on all clocks
	$(bevent.target).find('[data-servertime-url]:first').each(function() { // init
		if(window.servertimeoffset === undefined) {
			var localtime = Date.now();
			$.ajax({
				url: $(this).attr("data-servertime-url"),
				cache: false
			}).done(function(resp) {
				var servertime = Number(resp) * 1000;
				// use average of start and end request timestamp and make it local time
				localtime = localtime / 2 + Date.now() / 2;
				window.servertimeoffset = servertime - localtime;
				$(bevent.target).find('[data-servertime-url]').trigger('init').trigger('repeat');
			});
		}
		else {
			$(bevent.target).find('[data-servertime-url]').trigger('init');
		}
	});
*/