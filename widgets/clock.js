$.widget("sv.clock", $.sv.widget, {

	options: {
		"servertime-url": ""
	},

	_init: function() {
		this._super();
		// memorize servertime listeners in order to init them again when servertime has been loaded successfully
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
					window.servertimeoffset = parseInt((localtime - servertime)/1000)*1000;
					window.serverTimezoneOffset = parseInt(Number(sv.config.timezoneOffset) + new Date().getTimezoneOffset()*60)*1000;  // php: negative value west of UTC, js: positive value west of UTC
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

	_init: function() {
		this._super();
		this.element.attr("stoptimer", "false");
		if(window.servertimeoffset != undefined || this.options["servertime-url"] == '')	
			this.element.digiclock({ svrOffset: (window.servertimeoffset || 0) - (window.serverTimezoneOffset || 0) });
	},

	// needed to restart the clock if it had been stopped before
	_update: function() {
		if (this.element.attr("stoptimer") == "true"){ 
			this.element.attr("stoptimer", "false");
			this.element.digiclock({ svrOffset: (window.servertimeoffset || 0) - (window.serverTimezoneOffset || 0) });
		}
	},
	
	_exit: function() {
		this.element.attr("stoptimer", "true");
		this.element.digiclock({ svrOffset: (window.servertimeoffset || 0) - (window.serverTimezoneOffset || 0), stopClock: "true"});
	},
});

$.widget("sv.clock_digiclock_digiweather", $.sv.widget, {

	initSelector: 'div.digiweather[data-widget="clock.digiclock"]',

	options: {
		"service-url": ""
	},

	_repeat: function() {
		var element = this.element;
		$.getJSON(this.options["service-url"], function (data) {
			element.css('visibility', 'visible');
			element.find('img').attr('src', 'lib/weather/pics/' + data.current.icon + '.png').attr('alt', data.current.icon);
			element.find('.city').html(data.city);
			element.find('.cond').html(data.current.conditions);
			element.find('.temp').html(data.current.temp);
		});
	},

});


// ----- clock.iconclock ------------------------------------------------------
$.widget("sv.clock_iconclock", $.sv.clock, {

	initSelector: 'span[data-widget="clock.iconclock"]',

	_repeat: function() {
		var now = new Date(Date.now() - (window.servertimeoffset || 0) + (window.serverTimezoneOffset || 0));
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
			var now = new Date(Date.now() - (window.servertimeoffset || 0) + (window.serverTimezoneOffset || 0));
			this.element.text(now.transUnit(this.options.format));
	},

});

// ----- clock.countdown ------------------------------------------------------
$.widget("sv.clock_countdown", $.sv.widget, {

	initSelector: 'span[data-widget="clock.countdown"]',

	options: {
		interval: 0,
		stopmode: 'item',
		idletxt: '--:--:--',
		 	},

	_currentstarttime: 0,
	_currentduration: 0,
	_olditem: null,
	_timer_run: false,
	_ticker: null,

	_update: function(response) {
		var item = response[0];
		var starttime = +response[1];
		var durationitem = response[2];
		var actualtime = Date.now();
		var itemduration = +new Date().duration(durationitem);  // item duration in milliseconds
		var interval = +new Date().duration(this.options.interval); // countdown interval in milliseconds
		
		// console.log('[update] item: ', item, ' _old: ', this._olditem, ' start: ', starttime,' duration: ', itemduration, ' actual: ', actualtime, ' _current: ', this._currentstarttime);
		
		// allow change of duration during running countdown
		this._currentduration = itemduration;
		
		// count down if starttime is set and duration exeeds current time
		if (starttime > this._currentstarttime && starttime + itemduration >  actualtime && this._timer_run == false) { 
			this._currentstarttime = starttime;
			// memorize item for abort on change
			this._olditem = item;
			countdown(this);
			this._ticker = setInterval(countdown, interval, this); 
			this._timer_run = true;
			console.log('countdown timer started at ', new Date(starttime).transUnit("H:i:s"), ' for', itemduration/1000, ' seconds');
		};

		// if item is changed while starttime is unchanged, abort countdown
		if (item != this._olditem && starttime == this._currentstarttime && this._timer_run == true) {
			clearInterval(this._ticker);
			this.element.text(this.options.idletxt);
			this._timer_run = false;
			console.log('countdown timer stopped by item at ', new Date().transUnit("H:i:s"));
		};
		
		if (this._currentstarttime > 0) this._currentstarttime = starttime;
		
		function countdown(that) {
			var telapsed = Date.now() - that._currentstarttime;
			var timetogo = that._currentduration - telapsed;   // remaining time in milliseconds
			if (that.options.stopmode == "zero" && timetogo <= 0) {
				clearInterval(that._ticker);
				that.element.text(that.options.idletxt);
				that._timer_run = false;
				console.log('countdown timer stopped on zero at ', new Date().transUnit("H:i:s"));
			} else {	
				that.element.text(timedisplay(timetogo));
			};			
		};
	},

});

// ----- clock.countup ------------------------------------------------------
$.widget("sv.clock_countup", $.sv.widget, {

	initSelector: 'span[data-widget="clock.countup"]',

	options: {
		interval: 0,
		idletxt: '--:--:--',
		 	},

	_ticker: null,

	_update: function(response) {
		var item = response[0];
		var starttime = $.isNumeric(item)? item: Date.parse(item);
		var interval = +new Date().duration(this.options.interval); // countdown interval in milliseconds
		var that = this;
		
		console.log('[update] item: ', item, ' start: ', starttime);
		this.element.text(timedisplay(Date.now() - starttime)) 
		
		if (this._ticker) 
			clearInterval(this._ticker);
		
		this._ticker = setInterval(function (){
			that.element.text(timedisplay(Date.now() - starttime))
		}, interval); 
	},

});