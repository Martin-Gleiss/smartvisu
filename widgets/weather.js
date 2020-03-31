// ----- weather.current ------------------------------------------------------
$.widget("sv.weather_current", $.sv.widget, {

	initSelector: 'div[data-widget="weather.current"]',

	options: {
		"service-url": '',
		location: '',
		repeat: '15i'
	},

	_repeat: function() {
		var element = this.element;
		var repeatMinutes = (new Date().duration(this.options.repeat) - 0) / 60000;
		$.getJSON(this.options['service-url'] + '?location=' + this.options.location + '&cache_duration_minutes=' + repeatMinutes, function (data) {
			element.css('background-image', 'url(lib/weather/pics/' + data.current.icon + '.png)')
			element.children('.city').html(data.city);
			element.children('.cond').html(data.current.conditions);
			element.children('.temp').html(data.current.temp);
			element.children('.humi').html(data.current.more);
			element.children('.wind').html(data.current.wind);
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