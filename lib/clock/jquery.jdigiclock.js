/*
 * jDigiClock plugin based on v2.1
 *
 * http://www.radoslavdimov.com/jquery-plugins/jquery-plugin-digiclock/
 *
 * Copyright (c) 2009 Radoslav Dimov
 *
 * modified for smartVISU by Wolfram v. Hülsen (c) 2020 + 2021
 * - removed date / weekday since smartVISU has its own ones
 * - implemented stop timer function via stoptimer attribute in widget call
 *   (not nice but necessary because the additional attributes in the plugins $this object are not accessible from outside)
 * - identify DOM elements with unique id's bound to each element object
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */


(function($) {
    $.fn.extend({

        digiclock: function(options) {

            var defaults = {
                clockImagesPath: 'lib/clock/pics/',
                am_pm: false,
                svrOffset: 0,
				stopTimer: false
            };
                       
            var options = $.extend(defaults, options);

            return this.each(function() {
                
                var $this = $(this);
                var o = options;

                $this.clockImagesPath = o.clockImagesPath;
                $this.am_pm = o.am_pm;
                $this.svrOffset = o.svrOffset;
				$this.stopTimer = o.stopTimer;
				$this.html('<div id="clock"></div>');
				$this.displayClock($this);
			});
        }
    });
           
    $.fn.displayClock = function(el) {
		if ($(el).attr("stoptimer") == "true")
			el.stopTimer = true;
		if (el.stopTimer == false) {
			$.fn.getTime(el);
			setTimeout(function() {$.fn.displayClock(el)}, $.fn.delay());
		}
	}

    $.fn.delay = function() {
        var now = new Date();
        var delay = (60 - now.getSeconds()) * 1000;
        
        return delay;
    }

    $.fn.getTime = function(el) {
		var id = $(el).attr("id");
        var now = new Date(Date.now() - el.svrOffset);
        var old = new Date();
        old.setTime(now.getTime() - 60000);

        var now_hours, now_minutes, old_hours, old_minutes, timeOld = '';
        now_hours =  now.getHours();
        now_minutes = now.getMinutes();
        old_hours =  old.getHours();
        old_minutes = old.getMinutes();

        if (el.am_pm) {
            var am_pm = now_hours > 11 ? 'pm' : 'am';
            now_hours = ((now_hours > 12) ? now_hours - 12 : now_hours);
            old_hours = ((old_hours > 12) ? old_hours - 12 : old_hours);
        } 

        now_hours   = ((now_hours <  10) ? "0" : "") + now_hours;
        now_minutes = ((now_minutes <  10) ? "0" : "") + now_minutes;
        old_hours   = ((old_hours <  10) ? "0" : "") + old_hours;
        old_minutes = ((old_minutes <  10) ? "0" : "") + old_minutes;

        var firstHourDigit = old_hours.substr(0,1);
        var secondHourDigit = old_hours.substr(1,1);
        var firstMinuteDigit = old_minutes.substr(0,1);
        var secondMinuteDigit = old_minutes.substr(1,1);

        timeOld += '<div id="'+id+'_hours"><div class="line"></div>';
        timeOld += '<div id="'+id+'_hours_bg"><img src="' + el.clockImagesPath + 'clockbg1.png" /></div>';
        timeOld += '<img src="' + el.clockImagesPath + firstHourDigit + '.png" id="'+id+'_fhd" class="first_digit" />';
        timeOld += '<img src="' + el.clockImagesPath + secondHourDigit + '.png" id="'+id+'_shd" class="second_digit" />';
        timeOld += '</div>';
        timeOld += '<div id="'+id+'_minutes"><div class="line"></div>';
        if (el.am_pm) {
            timeOld += '<div id="'+id+'_am_pm"><img src="' + el.clockImagesPath + am_pm + '.png" /></div>';
        }
        timeOld += '<div id="'+id+'_minutes_bg"><img src="' + el.clockImagesPath + 'clockbg1.png" /></div>';
        timeOld += '<img src="' + el.clockImagesPath + firstMinuteDigit + '.png" id="'+id+'_fmd" class="first_digit" />';
        timeOld += '<img src="' + el.clockImagesPath + secondMinuteDigit + '.png" id="'+id+'_smd" class="second_digit" />';
        timeOld += '</div>';

        el.find('#clock').html(timeOld);

        // set minutes
        if (secondMinuteDigit != '9') {
            firstMinuteDigit = firstMinuteDigit + '1';
        }

        if (old_minutes == '59') {
            firstMinuteDigit = '511';
        }

        setTimeout(function() {
            $('#'+id+'_fmd').attr('src', el.clockImagesPath + firstMinuteDigit + '-1.png');
            $('#'+id+'_minutes_bg img').attr('src', el.clockImagesPath + 'clockbg2.png');
        },200);
        setTimeout(function() { $('#'+id+'_minutes_bg img').attr('src', el.clockImagesPath + 'clockbg3.png')},250);
        setTimeout(function() {
            $('#'+id+'_fmd').attr('src', el.clockImagesPath + firstMinuteDigit + '-2.png');
            $('#'+id+'_minutes_bg img').attr('src', el.clockImagesPath + 'clockbg4.png');
        },400);
        setTimeout(function() { $('#'+id+'_minutes_bg img').attr('src', el.clockImagesPath + 'clockbg5.png')},450);
        setTimeout(function() {
            $('#'+id+'_fmd').attr('src', el.clockImagesPath + firstMinuteDigit + '-3.png');
            $('#'+id+'_minutes_bg img').attr('src', el.clockImagesPath + 'clockbg6.png');
        },600);

        setTimeout(function() {
            $('#'+id+'_smd').attr('src', el.clockImagesPath + secondMinuteDigit + '-1.png');
            $('#'+id+'_minutes_bg img').attr('src', el.clockImagesPath + 'clockbg2.png');
        },200);
        setTimeout(function() { $('#'+id+'_minutes_bg img').attr('src', el.clockImagesPath + 'clockbg3.png')},250);
        setTimeout(function() {
            $('#'+id+'_smd').attr('src', el.clockImagesPath + secondMinuteDigit + '-2.png');
            $('#'+id+'_minutes_bg img').attr('src', el.clockImagesPath + 'clockbg4.png');
        },400);
        setTimeout(function() { $('#'+id+'_minutes_bg img').attr('src', el.clockImagesPath + 'clockbg5.png')},450);
        setTimeout(function() {
            $('#'+id+'_smd').attr('src', el.clockImagesPath + secondMinuteDigit + '-3.png');
            $('#'+id+'_minutes_bg img').attr('src', el.clockImagesPath + 'clockbg6.png');
        },600);

        setTimeout(function() {$('#'+id+'_fmd').attr('src', el.clockImagesPath + now_minutes.substr(0,1) + '.png')},800);
        setTimeout(function() {$('#'+id+'_smd').attr('src', el.clockImagesPath + now_minutes.substr(1,1) + '.png')},800);
        setTimeout(function() { $('#'+id+'_minutes_bg img').attr('src', el.clockImagesPath + 'clockbg1.png')},850);

        // set hours
        if (now_minutes == '00') {
           
            if (el.am_pm) {
                if (now_hours == '00') {                   
                    firstHourDigit = firstHourDigit + '1';
                    now_hours = '12';
                } else if (now_hours == '01') {
                    firstHourDigit = '001';
                    secondHourDigit = '111';
                } else {
                    firstHourDigit = firstHourDigit + '1';
                }
            } else {
                if (now_hours != '10') {
                    firstHourDigit = firstHourDigit + '1';
                }

                if (now_hours == '20') {
                    firstHourDigit = '1';
                }

                if (now_hours == '00') {
                    firstHourDigit = firstHourDigit + '1';
                    secondHourDigit = secondHourDigit + '11';
                }
            }

            setTimeout(function() {
                $('#'+id+'_fhd').attr('src', el.clockImagesPath + firstHourDigit + '-1.png');
                $('#'+id+'_hours_bg img').attr('src', el.clockImagesPath + 'clockbg2.png');
            },200);
            setTimeout(function() { $('#'+id+'_hours_bg img').attr('src', el.clockImagesPath + 'clockbg3.png')},250);
            setTimeout(function() {
                $('#'+id+'_fhd').attr('src', el.clockImagesPath + firstHourDigit + '-2.png');
                $('#'+id+'_hours_bg img').attr('src', el.clockImagesPath + 'clockbg4.png');
            },400);
            setTimeout(function() { $('#'+id+'_hours_bg img').attr('src', el.clockImagesPath + 'clockbg5.png')},450);
            setTimeout(function() {
                $('#'+id+'_fhd').attr('src', el.clockImagesPath + firstHourDigit + '-3.png');
                $('#'+id+'_hours_bg img').attr('src', el.clockImagesPath + 'clockbg6.png');
            },600);

            setTimeout(function() {
            $('#'+id+'_shd').attr('src', el.clockImagesPath + secondHourDigit + '-1.png');
            $('#'+id+'_hours_bg img').attr('src', el.clockImagesPath + 'clockbg2.png');
            },200);
            setTimeout(function() { $('#'+id+'_hours_bg img').attr('src', el.clockImagesPath + 'clockbg3.png')},250);
            setTimeout(function() {
                $('#'+id+'_shd').attr('src', el.clockImagesPath + secondHourDigit + '-2.png');
                $('#'+id+'_hours_bg img').attr('src', el.clockImagesPath + 'clockbg4.png');
            },400);
            setTimeout(function() { $('#'+id+'_hours_bg img').attr('src', el.clockImagesPath + 'clockbg5.png')},450);
            setTimeout(function() {
                $('#'+id+'_shd').attr('src', el.clockImagesPath + secondHourDigit + '-3.png');
                $('#'+id+'_hours_bg img').attr('src', el.clockImagesPath + 'clockbg6.png');
            },600);

            setTimeout(function() {$('#'+id+'_fhd').attr('src', el.clockImagesPath + now_hours.substr(0,1) + '.png')},800);
            setTimeout(function() {$('#'+id+'_shd').attr('src', el.clockImagesPath + now_hours.substr(1,1) + '.png')},800);
            setTimeout(function() { $('#'+id+'_hours_bg img').attr('src', el.clockImagesPath + 'clockbg1.png')},850);
        }
    }

})(jQuery);
