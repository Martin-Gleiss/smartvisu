// ----- multimedia.audio --------------------------------------------------------
$.widget("sv.multimedia_audio", $.sv.widget, {

	initSelector: '[data-widget="multimedia.audio"]',

	options: {
		value: 1
	},
	
	_update: function(response) {
			if (response == this.options.value) {
				this.element[0].play();
			}
	},

	_events: {
		'ended': function() {
			// reset value in widget.buffer to allow playing again
			io.write(this.options.item, null);
		}
	}

});

// ----- multimedia.slideshow ----------------------------------------------------
$.widget("sv.multimedia_slideshow", $.sv.widget, {

	initSelector: '[data-widget="multimedia.slideshow"]',

	options: {
	},
	
	_create: function() {
		this._super();
		this.element.cycle();
	},

	_update: function(response) {
		var items = String(this.options.item).explode();
		for(var i = 0; i <= 4; i++) {
			if(items[i] == '' || (i % 2 == 1 && items[i] == items[i-1])) // continue if item is not used
				continue;
			var value = response.shift();
			if(value >= 0) {
				// if item_prev is same as item_next, treat false as prev, any other value as next (same with item_stop and item_start)
				if((i == 0 || i == 2) && items[i] == items[i+1] && value > 0)
					i++;
				this.element.cycle(['prev','next','pause','resume'][i]);
				widget.set(items[i], -1);
				break;
			}
		}
	},

	_repeat: function() {
	},

	_events: {
	}

});

$(document).on('pagecontainerchange', function (event, ui) {
	if(ui.prevPage != null)
		ui.prevPage.find('[data-widget="multimedia.slideshow"]').cycle('pause');
	if(ui.toPage != null)
		ui.toPage.find('[data-widget="multimedia.slideshow"]').cycle('resume');
});