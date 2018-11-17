
// ---- TABS ------------------------------------------------------------------
$(document).on("pageshow", function() {
    $(".quad_tab-header").each(function(idx) {
        var height = $(this).parent().innerHeight() - $(this).outerHeight();
        // $(this).siblings(".quad_tab-content").css('height', height);
        console.log('Height '+height);
    });
});

$(document).on("pagecreate", function() {
    $(".quad_tab-header ul li").on("click",function(){
        $(this).parent().find(".ui-btn-active").removeClass("ui-btn-active");
        $(this).addClass("ui-btn-active");
        var newSelection = $(this).children("a").attr("data-tab-class");
        var prevSelection = $(this).parent().parent().attr("data-tab-selection");
        $("."+prevSelection).addClass("ui-screen-hidden");
        $("."+newSelection).removeClass("ui-screen-hidden");
        $(this).parent().parent().attr("data-tab-selection", newSelection);

        $("."+newSelection).find('[data-widget="plot.period"]').each(function(idx) {
            if ($('#' + this.id).highcharts()) {
                $('#' + this.id).highcharts().destroy();
                var values = widget.get(widget.explode($(this).attr('data-item')));
                if (widget.check(values))
                    $(this).trigger('update', [values]);
            }
        });

    });
});

$(document).on("pagecreate", function() {
	$('[id$="sorting"]').each(function() {

	var mylist = $(this);
	var listitems = mylist.children('div').get();
	listitems.sort(function(a, b) {
	   var compA = $(a).data('order');
	   var compB = $(b).data('order');
	   return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
	})

	$.each(listitems, function(idx, itm) { mylist.append(itm); });
	});
});


// idleTimer() takes an optional argument that defines the idle timeout
// timeout is in milliseconds; defaults to 30000
$(document).on('pageinit', function() {

    if (jQuery().idleTimer) {
	alert("IDLE")
    //if (jQuery().idleTimer && navigator.userAgent.match(/iPad/i) != null) {
        $.idleTimer(3 * 1000);
    }
});

$(document).bind('idle.idleTimer', function() {
    $.mobile.changePage("index.php?page=qlock");
});

$(document).bind('active.idleTimer', function() {
    parent.history.back();
});

// idle timer for the door camera
$(document).delegate("#aa_tuerkamera", "pageshow", function() {
    if (jQuery().idleTimer) {
        $('#aa_tuerkamera').idleTimer(120 * 1000);
        $('#aa_tuerkamera').bind('idle.idleTimer', function() {
            parent.history.back();
        });
    }
});
$(document).delegate("#aa_tuerkamera", "pagehide", function() {
    if (jQuery().idleTimer) {
        $('#aa_tuerkamera').idleTimer('destroy');
    }
});

$(document).on("mobileinit", function () {
        $.event.special.tap.tapholdThreshold = 400,
        $.event.special.tap.emitTapOnTaphold = false;
});

// ----- t r a n s -------------------------------------------------------------

Number.prototype.transExSecondsToHours = function() {
    return (this / (60 * 60)).toFixed(1);
};

Number.prototype.transExKwhToMwh = function() {
    return (this / (1000)).toFixed(2);
};

Number.prototype.transExSecondsToHMS = function() {
    var H = Math.floor(this / (60 * 60));
    var M = Math.floor((this / 60) % 60);
    var S = Math.floor(this % (60 * 60));
    return ('0' + H).slice(-2) + ':' + ('0' + M).slice(-2) + ':' + ('0' + S).slice(-2);
};

Number.prototype.transExByteToMegabyte = function() {
    return (this / (1024 * 1024)).toFixed(1);
};

// -----------------------------------------------------------------------------
// W I D G E T   D E L E G A T E   F U N C T I O N S
// -----------------------------------------------------------------------------



// ----- v i s u ---------------------------------------------------------------
// -----------------------------------------------------------------------------

// ----- visu.stateengineExt ------------------------------------------------------

$.widget("sv.stateengine", $.sv.widget, {

	initSelector: '[data-widget="visu.stateengine"]',

	options: {

	},
	_update: function (response) {
		// get list of values and images
		list_val = this.element.attr('data-vals').explode();
		list_img = this.element.attr('data-img').explode();

		// get the index of the value received
		idx = list_val.indexOf(response.toString());

		// update the image
		$('#' + this.element.attr("id") + ' img').attr('src', list_img[idx]);

        $('#' + this.element.attr("id")).show();
        console.log('ID '+this.element.attr('id')+' image '+list_img[idx]);
		// memorise the index for next use
		this.element.val(idx);
	},

    _events: {
    'taphold': function (event, response) {
        event.preventDefault();
        event.stopPropagation();
        console.log('Long press '+this.element.attr('rel'));

        $("#"+this.element.attr('rel')).popup( "open" );
        return false;
    },
	'tap': function (event, response) {
        if (this.element.attr('lock-item') == '' && this.element.attr('release-item') == '') {
        $("#"+this.element.attr('rel')).popup( "open" );
        }
        else if (list_val[idx] == 'Gesperrt' && this.element.attr('lock-item') != ''){
            io.write(this.element.attr('lock-item'), (this.element.val() == this.element.attr('data-val-on') ? this.element.attr('data-val-off') : this.element.attr('data-val-on')) );
            console.log('Short press lock '+this.element.attr('rel'));
        }
        //else if (list_val[idx] == 'Ausgesetzt' && this.element.attr('release-item') != ''){
        //    io.write(this.element.attr('release-item'), true );
        //    console.log('Short press release '+this.element.attr('rel'));
        //}
        else {
            io.write(this.element.attr('lock-item'), (this.element.val() == this.element.attr('data-val-on') ? this.element.attr('data-val-off') : this.element.attr('data-val-on')) );
            console.log('Short press else '+this.element.val()+', setting lock item'+ this.element.attr('lock-item'));
        }
	}
    }

});


// ----- visu.sound --------------------------------------------------------------

$.widget("sv.sound", $.sv.widget, {

	initSelector: '[data-widget="visu.sound"]',

	options: {

	},
	_update: function (response) {
		//var sound = $(this).attr('soundfile');
		var volume = this.element.attr('volume');
		if (this.element.attr('match') == response) {
			if (document.getElementById(this.element.attr('id')).getAttribute('active') != 1){
				document.getElementById(this.element.attr('id')).volume = volume/100;
				document.getElementById(this.element.attr('id')).play();
				document.getElementById(this.element.attr('id')).setAttribute('active','1');
				if (this.element.attr('title')){ notify.info(this.element.attr('title'), this.element.attr('message')); }
			}
		}else {
			document.getElementById(this.element.attr('id')).setAttribute('active','0');
		}
	}
});

// ----- visu_longbutton ------------------------------------------------------

$.widget("sv.longbutton", $.sv.widget, {

	initSelector: 'span[data-widget="visu.longbutton"]',

	options: {

	},
	_update: function (response) {
	},
    _events: {
        'taphold': function (event, response) {
            event.preventDefault();
            event.stopPropagation();
            var items = widget.explode(this.element.attr('data-item'));
            io.write(items[1], this.element.attr('data-val'));
            console.log('Long press '+items[1]);
        },
    	'tap': function (event, response) {
            var items = widget.explode(this.element.attr('data-item'));
            io.write(items[0], this.element.attr('data-val'));
            console.log('Short press '+items[0]);
        }
    }
});

// ----- visu.notifybadge -------------------------------------------------------

$.widget("sv.notifybadge", $.sv.widget, {

	initSelector: 'span[data-widget="visu.notifybadge"]',

	options: {

	},
    _update: function(response){
        this.element.attr('data-notifications', response);
        },
	_events: {
    'change': function(event){
        this.element.attr('data-notifications', response);
        }
    }
});

// ----- visu_simple_print ------------------------------------------------------

$.widget("sv.simple_print", $.sv.widget, {

	initSelector: 'span[data-widget="visu.simple_print"]',

	options: {

	},
    _update: function(response){
		this.element.text(response);
        },
	_events: {
    'update': function(event, response){
        event.stopPropagation();
        }
    }
});

// ----- visu_textinput ------------------------------------------------------

$.widget("sv.text_input", $.sv.widget, {

	initSelector: '[data-widget="visu.textinput"]',

	options: {

	},
  _update: function(response){
      this.element.val(response);
      console.log("Updating "+this.element.attr("id")+" via textinput:" + response);
    },
  _events: {
          'change': function(event) {
            console.log("Changing "+this.element.attr("id")+" via textinput:" + this.element.prop("value"));
            io.write(this.element.attr('data-item'), this.element.val() );
            }
          }
});

// ----- visu.cover ------------------------------------------------------
$.widget("sv.cover", $.sv.widget, {

	initSelector: '[data-widget="visu.cover"]',

	options: {

	},
    _update: function(response){
        var cover = response[0]+'&'+Math.floor(Math.random()*1000);
        console.log("Cover:" + cover);
        this.element.attr('src', cover);
        }
});


// ----- visu.playpause ------------------------------------------------------
$.widget("sv.playpause", $.sv.widget, {

	initSelector: '[data-widget="visu.playpause"]',

	options: {

	},
    _update: function(response){
        var url = this.element.children().children().attr('src').split('/').slice(0, -1).join('/')+'/';
        if (response[0] == 0 && response[1] == 0)  {
            this.element.children().children().attr('src', url+'audio_stop.svg');
            console.log("Playpause: Stop .."+this.element.val());
            this.element.attr('data-val', 0);
            }
        else if (response[0] == 0 && response[1] == 1)  {
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
        'click': function(event) {
          console.log("Playpause .."+this.element.val());
          var items = this.element.attr('data-item').explode();
          if (this.element.attr('data-val') == 2) {
            io.write(items[1], 1);
          }
          else {
            io.write(items[0], 1);
          }
        }
    }

});

// ----- visu.minsymbol -----------------------------------------------------------
$.widget("sv.minsymbol", $.sv.widget, {

	initSelector: 'span[data-widget="visu.minsymbol"]',

	options: {

	},
	_events: {
		'update': function (event, response) {
			event.stopPropagation();
		}
	},
	_update: function (response) {
        var bit = (this.element.attr('data-mode') == 'and');
        if (response instanceof Array) {
            for (var i = 0; i < response.length; i++) {
                if (this.element.attr('data-mode') == 'and') {
                    bit = bit && (response[i] >= this.element.attr('data-val'));
                }
                else {
                    bit = bit || (response[i] >= this.element.attr('data-val'));
                }
            }
        }
        else {
            bit = (response == this.element.attr('data-val'));
        }

        if (bit) {
            this.element.show();
        }
        else {
            this.element.hide();
        }
    }

});




// ----- visu.maprange --------------------------------------------------------------
$.widget("sv.visumap", $.sv.widget, {

	initSelector: '[data-widget="visu.maprange"]',

	options: {

	},
    _update: function(response) {
        var val = parseFloat(response).toFixed(2);

        var str_map = this.element.attr('data-map-str').explode();
        var min_map = this.element.attr('data-map-min').explode();
        var max_map = this.element.attr('data-map-max').explode();

        for (var i = 0; i < str_map.length; i++) {
            var min = parseFloat(min_map[i]).toFixed(2);
            var max = parseFloat(max_map[i]).toFixed(2);
            if (parseFloat(min) <= parseFloat(val) && parseFloat(max) >= parseFloat(val)) {
                $('#' + this.element.attr("id")).html(str_map[i]);
                return;
            }
        }

        $('#' + this.element.attr("id")).html("invalid mapping");
    }
});


// ----- visu.time_slider ----------------------------------------------------------
$.widget("sv.time_slider", $.sv.widget, {

	initSelector: 'input[data-widget="visu.time_slider"]',

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
