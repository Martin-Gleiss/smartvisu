// ----- weather.current ------------------------------------------------------
$.widget("sv.weather_current", $.sv.widget, {

	initSelector: 'div[data-widget="weather.current"]',

	options: {
		"service-url": '',
		location: '',
		repeat: '15i',
		windfmt: 'value',
		humitxt: '',
		humifmt: '',
		misctxt: '',
		miscfmt: '',
		misc1txt: '',
		misc1fmt: ''
	},

	_humi: 0,
	_wind: 0,
	_temp: 0,
		
	_update: function(response){
		
		// make sure that items are correlated correctly even if optional items are omitted
		var items = this.options.item.explode();
		var values = new Array(this.items.length);
		var j=0;
		for (var i = 0; i < items.length; i++) {
			if (items[i] != '') {
				values[i] = response[j];
				j++;
			};
		};

		var itemtemp = values[0];
		if (itemtemp !== undefined) {
			this._temp = 1;
			this.element.children('.temp').html(itemtemp.transUnit('temp'));
		};
		var itemwind = values[1];
		if (itemwind !== undefined) {
			this._wind = 1;
			if (this.options.windfmt == 'value') 
				this.element.children('.wind').html(itemwind.transUnit('speed'));
			else
				this.element.children('.wind').html(itemwind);
		};
		var itemhumi = values [2];
		if (itemhumi !== undefined) {
			this._humi = 1;
			this.element.children('.humi').html(this.options.humitxt + itemhumi.transUnit(this.options.humifmt));
		};
		var itemmisc = values [3];
		if (itemmisc !== undefined) {
			this.element.children('.misc').html(this.options.misctxt + itemmisc.transUnit(this.options.miscfmt));
		};
		var itemmisc1 = values [4];
		if (itemmisc1 !== undefined) {
			this.element.children('.misc1').html(this.options.misc1txt + itemmisc1.transUnit(this.options.misc1fmt));
		};
	},
	
	_repeat: function() {
		var element = this.element;
		var that = this; 
		var repeatMinutes = (new Date().duration(this.options.repeat) - 0) / 60000;
		$.getJSON(this.options['service-url'] + '?location=' + this.options.location + '&cache_duration_minutes=' + repeatMinutes, function (data) {
			element.css('background-image', 'url(lib/weather/pics/' + data.current.icon + '.png)')
			element.children('.city').html(data.city);
			element.children('.cond').html(data.current.conditions);
			if (that._temp == 0) element.children('.temp').html(data.current.temp);
			if (that._humi == 0) element.children('.humi').html(data.current.more);
			if (that._wind == 0) element.children('.wind').html(data.current.wind);
		})
		.error(notify.json);
	}

});


// ----- weather.forecast -----------------------------------------------------
$.widget("sv.weather_forecast", $.sv.widget, {

	initSelector: 'div[data-widget="weather.forecast"]',

	options: {
		"service-url": '',
		location: '',
		repeat: '3h',
		day: 1
	},

	_repeat: function() {
		var element = this.element;
		var day = this.options.day;
		var repeatMinutes = (new Date().duration(this.options.repeat) - 0) / 60000;
		$.getJSON(this.options['service-url'] + '?location=' + this.options.location + '&cache_duration_minutes=' + repeatMinutes, function (data) {
			element.css('background-image', 'url(lib/weather/pics/' + data.forecast[day].icon + '.png)')
			element.children('.city').html(data.city);
			element.children('.cond').html(data.forecast[day].conditions);
			element.children('.highlow').html(data.forecast[day].temp);
			element.children('.day').html(data.forecast[day].date);

		})
		.error(notify.json);
	}

});


// ----- weather.forecastweek -------------------------------------------------
$.widget("sv.weather_forecastweek", $.sv.widget, {

	initSelector: 'div[data-widget="weather.forecastweek"]',

	options: {
		"service-url": '',
		location: '',
		repeat: '15i'
	},

	_repeat: function() {
		var element = this.element;
		var repeatMinutes = (new Date().duration(this.options.repeat) - 0) / 60000;
		$.getJSON(this.options['service-url'] + '?location=' + this.options.location + '&cache_duration_minutes=' + repeatMinutes, function (data) {
			var forecast = '';
			for (var i in data.forecast) {
				forecast += '<div class="day">'
				forecast += '<div>' + data.forecast[i].date + '</div>';
				forecast += '<img src="lib/weather/pics/' + data.forecast[i].icon + '.png" alt="' + data.forecast[i].conditions + '" title="' + data.forecast[i].conditions + '" />';
				forecast += '<div>' + data.forecast[i].temp + '</div>';
				forecast += '</div>';
			}
			element.html(forecast);
		})
		.error(notify.json);
	}

});


// ----- weather.mapslides ----------------------------------------------------
$.widget("sv.weather_mapslides", $.sv.widget, {

	initSelector: '[data-widget="weather.mapslides"]',

	_create: function() {
		this._super();
		this.element.find('[data-cycle-speed]').cycle();
	}

});