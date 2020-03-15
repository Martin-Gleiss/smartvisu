
// ----- multimedia.image  ------------------------------------------------------
$.widget("sv.multimedia_image", $.sv.widget, {

  initSelector: '[data-widget="multimedia.image"]',

  options: {

  },
    _init: function() {
      this.element.attr('data-repeat-milliseconds', Number(new Date().duration(this.element.attr('data-repeat'))));
      var widget_url = this.element.attr('data-url');
      if (widget_url.includes("http")) {
        this._update();
      }

    },
    _update: function(response) {
      console.log("Response: " + response);
      var widget_url = this.element.attr('data-url');
      var resp = Array.isArray(response) ? response[0]: response;
      var img_base = widget_url.includes("http") ? this.element.attr('data-item') + '?' : resp+((resp.indexOf('?') == -1) ? '?' : '&')
			img = img_base + '_=' + new Date().getTime();
			console.log("Response: " + response + " Update Multimedia Image: " + img);
			this.element.attr('src', img);
      var delay = Number(this.element.attr('data-repeat-milliseconds'));
      var el = this;
      var timerId;
      setTimeout(function() {
        console.log("Trigger with: " + resp);
        timerId = el._update(resp);
      }, delay);
    }
});


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

// ----- multimedia.playpause ------------------------------------------------------
// An icon changing between play, pause and stop.
$.widget("sv.multimedia_playpause", $.sv.widget, {

  initSelector: '[data-widget="multimedia.playpause"]',

  options: {

  },
    _update: function(response){
        var url = this.element.children().children().attr('src').split('/').slice(0, -1).join('/')+'/';
        if (response[0] == 0 && response[1] == 0 || response[2] == 1)  {
            this.element.children().children().attr('src', url+'audio_stop.svg');
            console.log("Playpause: Stop .."+this.element.val());
            this.element.attr('data-val', 0);
            }
        else if (response[1] == 1)  {
            this.element.children().children().attr('src', url+'audio_pause.svg');
            console.log("Playpause: Pause .."+this.element.val());
            this.element.attr('data-val', 1);
            }
        else if (response[0] == 1 && response[1] == 0)  {
            this.element.children().children().attr('src', url+'audio_play.svg');
            this.element.attr('data-val', 2);
            console.log("Playpause: Play .."+this.element.val());
            }
        },
    _events: {
        'taphold': function (event) {
            event.preventDefault();
            event.stopPropagation();
            console.log("Playpause longtap .."+this.element.attr('data-val'));
            var items = this.element.attr('data-item').explode();
              io.write(items[0], 0);
              io.write(items[1], 0);
              io.write(items[2], 1);
        },
        'tap': function(event) {
          console.log("Playpause .."+this.element.attr('data-val'));
          var items = this.element.attr('data-item').explode();
          if (this.element.attr('data-val') == 2) {
            io.write(items[1], 1);
            io.write(items[0], 0);
            io.write(items[2], 0);
          }
          else if (this.element.attr('data-val') == 1) {
            io.write(items[0], 1);
            io.write(items[1], 0);
            io.write(items[2], 0);
          }
          else if (this.element.attr('data-val') == 0) {
            io.write(items[0], 1);
            io.write(items[1], 0);
            io.write(items[2], 0);
          }
        }
    }

});
