
// ----- multimedia.image  ------------------------------------------------------
$.widget("sv.multimedia_image", $.sv.widget, {

  initSelector: '[data-widget="multimedia.image"]',

  options: {

  },
    _ticker: null,
	_currentErrorNotification: 0,
	
    _init: function() {
      if (this.element.attr('data-repeat'))
        this.element.attr('data-repeat-milliseconds', Number(new Date().duration(this.element.attr('data-repeat'))));
      this.element.attr('stopTimer', 'false');
    },
	
    _update: function(response) {
      var widget_url = this.element.attr('data-url');
      var resp = Array.isArray(response) ? response[0]: response;

      if (widget_url)
        var img_base = widget_url + ((widget_url.indexOf('?') == -1) ? '?' : '&');
      else
        var img_base = resp + ((resp.indexOf('?') == -1) ? '?' : '&');

	  img = img_base + '_=' + new Date().getTime();
	  refreshing = this.element.attr('data-repeat') ? this.element.attr('data-repeat') : 'refresh by item';
	  // console.log("Response: " + response + " Update Multimedia Image: " + img + ", repeat: " + refreshing);
	  this.element.attr('src', img);
      if (this.element.attr('data-repeat') && ! img.startsWith('_='))
      {
        var delay = Number(this.element.attr('data-repeat-milliseconds'));
        var el = this;
        this._ticker = setTimeout(function() {el._update("timer");}, delay);
        console.log("Start timer " + this._ticker);
      }
      this.element.attr('stopTimer', 'false');
    },
    
	_exit: function(){
        clearTimeout(this._ticker);
        console.log("Clear multimediaimage timer " + this._ticker);
        this._ticker = null;
    },
	
	// error handling for localized URL (called via ./lib/multimedia/camimage.php)
	// only called if widget parameter 'localized' = 'true'
	loadError: function(){
		//as long as we can't read the already echoed error message directly we try to load the source again to create a proper error message
		var self = this;
		$.get(this.element.attr('data-url'))
		   .fail(function(jqXHR, status, errorthrown){
			   if (self._currentErrorNotification == 0 || !notify.exists(self._currentErrorNotification) )
				self._currentErrorNotification = notify.json(jqXHR, status, errorthrown);
		   }
		);
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
		directory: ''
	},
	
	_currentErrorNotification: 0,

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
		var element = this.element;
		var repeatMinutes = (new Date().duration(this.options.repeat) - 0) / 60000;
		var filter = '(.%2B?).(jpg|png|svg)'; //need to escape the '+' sign with %2B
		var currentSet = [];
		var dataByFile = [];
		var setChanged = false;
		
		$.ajax({
			dataType: "json",
			url: 'lib/getdir.php' + '?directory=' + this.options.directory + '&filter=' + filter,
			context: this,
			beforeSend: function(jqXHR, settings) { jqXHR.svProcess = 'Multimedia Slideshow Widget'; },
			success: function(data) {
				dataKeys = Object.keys(data);
				var i;
				for (i = 0; i < dataKeys.length; i++) {
					dataByFile[i] = data[dataKeys[i]]['path'];
				}
				// check for deleted files and remove them from html
				i = 0;
				$.each(element.find('img'), function(index){
					currentSet[i] = $(this).attr('src'); 
					if (!dataByFile.includes(currentSet[i]))
					$(this).remove();
					setChanged = true; 	
					i++;
				});
				// check for new files and append them to html
				for (i = 0; i < dataKeys.length; i++) {
					if (!currentSet.includes(data[dataKeys[i]]['path'])){
						var newSlide = '<img src="'+data[dataKeys[i]]['path']+'" style="display: block;" title="'+data[dataKeys[i]]['label']+'" alt="'+data[dataKeys[i]]['label']+'" />';
						element.cycle('add', newSlide);
					}
				}
				
				if (setChanged){
					element.cycle('reinit');
					setChanged = false;
				}
		
				if (this._currentErrorNotification != 0){
					notify.remove(this._currentErrorNotification);
					this._currentErrorNotification = 0;
				}
			}
		})
		.fail(function(jqXHR, status, errorthrown){
			if (this._currentErrorNotification == 0 || !notify.exists(this._currentErrorNotification))
				this._currentErrorNotification = notify.json(jqXHR, status, errorthrown);
		});
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

  initSelector: '[data-widget="multimedia.timeslider"]',

  options: {

  },
  vars: {
      counting: false,
      playing: false
  },
    _update: function(response) {
        if (response[2] == true)
          this.vars.playing = true;
        else if (response[2] == false)
          this.vars.playing = false;
        this.element.attr('lock', 0);
        if (parseInt(response[1]) == 0) {
          this.element.val(0);
          this.element.slider('disable');
        } else {
          this.element.attr('max', response[1]).val(response[0]).slider('enable');
          this.element.slider('refresh');
          this.element.attr('mem', this.element.val());
          this.element.attr('value', this.element.val());
          this.element.attr('timer', '0');
        }
        if (!this.vars.counting && this.vars.playing)
          this._counter();
        else if (!this.vars.playing)
          this.vars.counting = false;
    },
    _counter: function() {
        var el = this;
        if (el.element.attr('lock') == 0 && this.vars.playing){
          el.vars.counting = true;
          el.element.val(parseInt(el.element.val()) + 1);
          el.element.attr('value', parseInt(el.element.val()) + 1);
          this.element.slider('refresh');
          setTimeout(function() {
            el._counter();
          }, 1000);
        }
    },
    _events: {
        'slidestop': function(event) {
          this.element.attr('lock', 0);
          if (this.element.val() != this.element.attr('mem')) {
              var items = this.element.attr('data-item').explode();
              io.write(items[0], this.element.val());
                }
           },
       'slidestart': function(event) {
          this.element.attr('lock', 1);
          },
        'change': function(event) {
        },
        'focusout': function(event) {
          var items = this.element.attr('data-item').explode();
          io.write(items[0], this.element.val());
        },
        'keyup': function(event) {
          if (this.element.is(":focus") && event.key === "Enter") {
            this.element.blur();
            }
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
