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

// ----- multimedia.time_slider ----------------------------------------------------------
// shows and controls the time code of a multimedia file
$.widget("sv.multimedia_timeslider", $.sv.widget, {

  initSelector: 'input[data-widget="multimedia.timeslider"]',

  options: {

  },
    _update: function(response) {
        this.element.attr('lock', 1);
        if (response[1] == 0) {
          $('#' + this.element.attr("id")).val(0).slider('disable');
        } else {
          $('#' + this.element.attr("id")).attr('max',response[1]).val(response[0]).slider('enable');
        }
        $('#' + this.element.attr("id")).slider('refresh');
        $('#' + this.element.attr("id")).attr('mem', this.element.val());
    },
    _events: {
        'slidestop': function(event) {
          if (this.element.val() != this.element.attr('mem')) {
              var items = this.element.attr('data-item').explode();
              io.write(items[0], this.element.val());
                }
           },
        'change': function(event) {
            if( (this.element.attr('timer') === undefined || this.element.attr('timer') == 0 && this.element.attr('lock') == 0 )
                && (this.element.val() != this.element.attr('mem')) ) {

                if (this.element.attr('timer') !== undefined)
                    this.element.trigger('click');

                this.element.attr('timer', 1);
                setTimeout("$('#" + this.element.attr("id") + "').attr('timer', 0);", 400);
            }

            this.element.attr('lock', 0);
        },
        'click': function(event) {
          var items = this.element.attr('data-item').explode();
          io.write(items[0], this.element.val());
        }
    }
});
