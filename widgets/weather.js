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

	_currentErrorNotification: 0,
	_humi: 0,
	_wind: 0,
	_temp: 0,
	_misc: 0,
		
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
			this._misc = 1;
			this.element.children('.misc').html(this.options.misctxt + itemmisc.transUnit(this.options.miscfmt));
		};
		var itemmisc1 = values [4];
		if (itemmisc1 !== undefined) {
			this.element.children('.misc1').html(this.options.misc1txt + itemmisc1.transUnit(this.options.misc1fmt));
			margintop = -25;
			marginbottom = 5;
		};
	},
	
	_repeat: function() {
		var element = this.element;
		var repeatMinutes = (new Date().duration(this.options.repeat) - 0) / 60000;
		
		$.ajax({
			dataType: "json",
			url: this.options['service-url'] + '?location=' + this.options.location + '&cache_duration_minutes=' + repeatMinutes,
			context: this,
			beforeSend: function(jqXHR, settings) { jqXHR.svProcess = 'Weather Widget (current)'; },
			success: function(data) {
				element.css('background-image', 'url(lib/weather/pics/' + data.current.icon + '.png)')
				element.children('.city').html(data.city);
				element.children('.cond').html(data.current.conditions);
				if (this._temp == 0) element.children('.temp').html(data.current.temp);
				if (this._humi == 0) element.children('.humi').html(data.current.more);
				if (this._wind == 0) element.children('.wind').html(data.current.wind);
				if (data.current.misc != undefined && this._misc == 0) element.children('.misc').html(data.current.misc);
			
				if (this._currentErrorNotification != 0){
					notify.remove(this._currentErrorNotification);
					this._currentErrorNotification = 0;
				}
			}
		})
		.fail(function(jqXHR, status, errorthrown){
			if (this._currentErrorNotification == 0 || !notify.exists(this._currentErrorNotification) )
				this._currentErrorNotification = notify.json(jqXHR, status, errorthrown);
		});
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
	
	_forecastErrorNotification: 0,

	_repeat: function() {
		var element = this.element;
		var day = this.options.day;
		var repeatMinutes = (new Date().duration(this.options.repeat) - 0) / 60000;
		
		$.ajax({
			dataType: "json",
			url: this.options['service-url'] + '?location=' + this.options.location + '&cache_duration_minutes=' + repeatMinutes, 
			context: this,
			beforeSend: function(jqXHR, settings) { jqXHR.svProcess = 'Weather Widget (forecast)'; },
			success: function (data) {
				element.css('background-image', 'url(lib/weather/pics/' + data.forecast[day].icon + '.png)')
				element.children('.city').html(data.city);
				element.children('.cond').html(data.forecast[day].conditions);
				element.children('.highlow').html(data.forecast[day].temp);
				element.children('.day').html(data.forecast[day].date);
				
				if (this._forecastErrorNotification != 0){
					notify.remove(this._forecastErrorNotification);
					this._forecastErrorNotification = 0;
				}
			}
		})
		.fail(function(jqXHR, status, errorthrown){
			if(this._forecastErrorNotification == 0 || !notify.exists(this._forecastErrorNotification) )
				this._forecastErrorNotification = notify.json(jqXHR, status, errorthrown);
		});
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
	
	_forecastErrorNotification: 0,

	_repeat: function() {
		var element = this.element;
		var repeatMinutes = (new Date().duration(this.options.repeat) - 0) / 60000;
		$.ajax({
			dataType: "json",
			url: this.options['service-url'] + '?location=' + this.options.location + '&cache_duration_minutes=' + repeatMinutes,
			context: this,
			beforeSend: function(jqXHR, settings) { jqXHR.svProcess = 'Weather Widget (forecastweek)'; },
			success: function (data) {
				var forecast = '';
				for (var i in data.forecast) {
					forecast += '<div class="day">'
					forecast += '<div>' + data.forecast[i].date + '</div>';
					forecast += '<img src="lib/weather/pics/' + data.forecast[i].icon + '.png" alt="' + data.forecast[i].conditions + '" title="' + data.forecast[i].conditions + '" />';
					forecast += '<div>' + data.forecast[i].temp + '</div>';
					forecast += '</div>';
				}
				element.html(forecast);
				
				if (this._forecastErrorNotification != 0){
					notify.remove(this._forecastErrorNotification);
					this._forecastErrorNotification = 0;
				}
			}
		})
		.fail(function(jqXHR, status, errorthrown){
			if(this._forecastErrorNotification == 0 || !notify.exists(this._forecastErrorNotification) )
				this._forecastErrorNotification = notify.json(jqXHR, status, errorthrown);
		});
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