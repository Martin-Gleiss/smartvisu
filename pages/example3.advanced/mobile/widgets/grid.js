// ----- basic grid layout ------------------------------------------------------------
$(document).ready(function() {
    // Hide addressbar
    if (navigator.userAgent.match(/Android/i)) {
    window.scrollTo(0,0); // reset in case prev not scrolled  
    var nPageH = $(document).height();
    var nViewH = window.outerHeight;
    if (nViewH > nPageH) {
      nViewH = nViewH / window.devicePixelRatio;
      $('BODY').css('height',nViewH + 'px');
    }
    window.scrollTo(0,1);
    }
});

$(window).resize(function () {
    var  RESIZE_END_DELAY_MSEC = 400;
             
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(function () {
    $(this).trigger('resizeend');
 }, RESIZE_END_DELAY_MSEC);
});

$(window).bind('resizeend', function () {
     //window.location.href = window.location.href;
     gridInitiate();
});

// jQuery Mobile 1.4 and up
$(document).on('pagecontainerbeforeshow', function(){
   gridInitiate();
});

// jQuery Mobile 1.3
$(document).on("pageinit", function(){
   gridInitiate();
});

// ----- footer ------------------------------------------------------------
// Go Back-Button
function goBack() {
    history.back();
}

// Disable scrolling
$(document.body).on("touchmove", function(event) {
    event.preventDefault();
    event.stopPropagation();
});

// ----- popup ------------------------------------------------------------
 $( ".popup").on({
      popupbeforeposition: function(event, ui) {
        $("body").on("touchmove", false);
      }
});

$( ".popup" ).on({
      popupafterclose: function(event, ui) {
        $("body").off("touchmove");
      }
});

// ----- grid.rgb-popup ------------------------------------------------------------
$(document).delegate('a[data-widget="grid.rgb"]', {
	'update': function (event, response) {
		// response is: {{ gad_r }}, {{ gad_g }}, {{ gad_b }}

		var max = $(this).attr('data-max');
        var svgDoc = $('#' + this.id + ' object')[0].contentDocument;
        $('g', svgDoc).css('fill', 'rgb(' + Math.round(response[0] / max * 255) + ',' + Math.round(response[1] / max * 255) + ',' + Math.round(response[2] / max * 255));
        $('g', svgDoc).css('stroke', 'rgb(' + Math.round(response[0] / max * 255) + ',' + Math.round(response[1] / max * 255) + ',' + Math.round(response[2] / max * 255));
	}
});

$(document).delegate('div[data-widget="grid.rgb-popup"] > div.rgb-popup div', {
	'click': function (event) {
		var rgb = $(this).css('background-color');
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		var max = $(this).parent().parent().attr('data-max');
		var items = $(this).parent().parent().attr('data-item').explode();
        
		io.write(items[0], Math.round(rgb[1] / 255 * max));
		io.write(items[1], Math.round(rgb[2] / 255 * max));
		io.write(items[2], Math.round(rgb[3] / 255 * max));

		$(this).parent().parent().popup('close');
	},

	'mouseenter': function (event) {
		$(this).addClass("ui-focus");
	},

	'mouseleave': function (event) {
		$(this).removeClass("ui-focus");
	}
});

// ----- grid.dual -----------------------------------------------------------
// the same as dual but this version uses svgs
$(document).delegate('a[data-widget="grid.dual"]', {
	'update': function (event, response) {
        if (response == $(this).attr('data-val-on')) {
            $('#' + this.id + ' .svg-frame.icon0').addClass( "hide" );
            $('#' + this.id + ' .svg-frame.icon1').removeClass( "hide" );
        } else {
            $('#' + this.id + ' .svg-frame.icon1').addClass( "hide" );
            $('#' + this.id + ' .svg-frame.icon0').removeClass( "hide" );
        }
	},

	'click': function (event) {
		if ($('#' + this.id + ' .svg-frame.icon0').hasClass('hide')) {
			io.write($(this).attr('data-item'), $(this).attr('data-val-off'));
		}
		else {
			io.write($(this).attr('data-item'), $(this).attr('data-val-on'));
		}
	}
});

// ----- grid.symbol ---------------------------------------------------------
$(document).delegate('[data-widget="grid.symbol"]', {
	'update': function (event, response) {

		// response will be an array, if more then one item is requested
		var bit = ($(this).attr('data-mode') == 'and');
		if (response instanceof Array) {
			for (var i = 0; i < response.length; i++) {
				if ($(this).attr('data-mode') == 'and') {
					bit = bit && (response[i] == $(this).attr('data-val'));
				}
				else {
					bit = bit || (response[i] == $(this).attr('data-val'));
				}
			}
		}
		else {
			bit = (response == $(this).attr('data-val'));
		}

		$('#' + this.id + ' img').attr('title', new Date());

		if (bit) {
			$('#' + this.id).show();
		}
		else {
			$('#' + this.id).hide();
		}
	}
});

// ----- grid.number ----------------------------------------------------------
$(document).delegate('[data-widget="grid.number"]', {
	'update': function (event, response) {
		if ($(this).attr('data-unit') != '') {
			$('#' + this.id).html(parseFloat(response).transUnit($(this).attr('data-unit')));
		}
		else {
			$('#' + this.id).html(parseFloat(response).transFloat());
		}

	}
});

$(document).delegate('[data-widget="grid.number-step"]', {
	'update': function (event, response) {
		$(this).val(response);
	},
    
    'change': function (event) {
		// DEBUG: console.log("[grid.number] change '" + this.id + "':", $(this).val());
		io.write($(this).attr('data-item'), $(this).val());
	}
    
});

// ----- grid.shutter --------------------------------------------------------
$(document).delegate('svg[data-widget="pic.shutter_window"]', {
    'update': function (event, response) {
        // response is: {{ gad_pos }}, {{ gad_window }}
        var val = Math.round(response[0] / $(this).attr('data-max') * 38);
        fx.grid(this, val, [14, 30], [86, 68]);
        // alert($(this).attr('id') + " - response[0]: " + response[0] + ", response[1]: " + response[1] + ", response[2]: " + response[2]);	
        switch (response[1]) {
             case 1:
                // window tilt
                // change visibility
                document.getElementById($(this).attr('id')+"-close").setAttributeNS(null, 'display', 'none');
                document.getElementById($(this).attr('id')+"-tilt").setAttributeNS(null, 'display', 'inline');
                document.getElementById($(this).attr('id')+"-open").setAttributeNS(null, 'display', 'none');

                // change class
                $(this).parent().removeClass( "icon0" ).addClass( "icon1" );
                this.setAttributeNS(null, 'class', 'icon icon1');
                break;

            case 2:
                // window open
                // change visibility
                document.getElementById($(this).attr('id')+"-close").setAttributeNS(null, 'display', 'none');
                document.getElementById($(this).attr('id')+"-tilt").setAttributeNS(null, 'display', 'none');
                document.getElementById($(this).attr('id')+"-open").setAttributeNS(null, 'display', 'inline');

                // change class	
                $(this).parent().removeClass( "icon0" ).addClass( "icon1" );							
                this.setAttributeNS(null, 'class', 'icon icon1');
                break;
                
            default:
                // Window close
                // change visibility
                document.getElementById($(this).attr('id')+"-close").setAttributeNS(null, 'display', 'inline');
                document.getElementById($(this).attr('id')+"-tilt").setAttributeNS(null, 'display', 'none');
                document.getElementById($(this).attr('id')+"-open").setAttributeNS(null, 'display', 'none');
                
                // change class
                $(this).parent().removeClass( "icon1" ).addClass( "icon0" );
                this.setAttributeNS(null, 'class', 'icon icon0');
                break;
            }					
    }	
});

// ----- swipe --------------------------------------------------------
// Swipe       
$(document).on('pageinit', function(event){
    $('[data-role="page"]').on("swipeleft", function () {
        var varnext = $('.ui-footer-custom .next').attr('href');
            //alert('swipe next - Nextpage: ' + varnext);
            if (varnext.length > 0) {
                $.mobile.changePage( varnext, {
                    transition: "slide",
                    reverse: false,
                    changeHash: true
                });
                
                //$.mobile.changePage(varprev, { transition: "slide", reverse: true }, true, true);
                //window.location.href=varprev;
            }
    });

    $('[data-role="page"]').on("swiperight", function () {
        var varprev = $('.ui-footer-custom .prev').attr('href');
        //alert('swipe right - Prevpage: ' + varprev);
        if (varprev.length > 0) {
            $.mobile.changePage( varprev, {
                    transition: "slide",
                    reverse: true,
                    changeHash: true
                });
            //$.mobile.changePage(varnext, { transition: "slide" }, true, true);
            //window.location.href=varnext;
        }
    });

   // Disable swipe on popups
    $('.ui-popup').on('swipeleft swiperight', function(event) {
        event.stopPropagation();
        event.preventDefault();
    });     
});
