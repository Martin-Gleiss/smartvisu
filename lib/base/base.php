<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß, Stefan Widmer
 * @copyright   2012 - 2017
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


    // get config-variables
    require_once '../../lib/includes.php';

	@header('Cache-Control: public, must-revalidate');
	@header('Content-Type: text/javascript');
?>


/**
 * -----------------------------------------------------------------------------
 * J A V A S C R I P T   D Y N A M I C   E X T E N T I O N S
 * -----------------------------------------------------------------------------
 */


// ----- number ----------------------------------------------------------------

  /**
	* transforms a number to a defined unit
	*/
	Number.prototype.transUnit = function(unit) {
		<?php echo 'formats  = ' . trans('format', '', 'obj') . ';'; ?>

		if (unit == '') {
			return this;
		}

		var fmt = formats[unit.toLowerCase()];
		if (fmt !== undefined)
			return printf(fmt, this);
		else if (unit.search(/(^|[^%])%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(([\.,])(\*\d+\$|\*|\d+))?([sScboxXuideEfFgG])/) >= 0)
			return printf(unit, this);
		else
			return this.toString() + ' ' + unit;
	};

  /**
	* transforms a number to int
	*/
	Number.prototype.transInt = function() {
		return this.transUnit('int');
	};

  /**
	* transforms a number to float
	*/
	Number.prototype.transFloat = function() {
		return this.transUnit('float');
	};


// ----- date ------------------------------------------------------------------

  /**
    * transforms a date to date
    */
	Date.prototype.transUnit = function(unit) {
		<?php echo 'formats = ' . trans('format', '', 'obj') . ';'; ?>
		<?php echo 'month = ' . trans('month', '', '') . ';'; ?>
		<?php echo 'shortmonth = ' . trans('shortmonth', '', '') . ';'; ?>
		<?php echo 'weekday = ' . trans('weekday', '', '') . ';'; ?>
		<?php echo 'shortday = ' . trans('shortday', '', '') . ';'; ?>

		if (unit == '') {
			return this;
		}

		var ret = formats[unit.toLowerCase()];
		if (ret == undefined)
			ret = unit;
// 259200000

		var val = this;

		// iterate over each character
		ret = ret.replace(/./g, function(char) {
			switch (char) {
				case 'l':
					return weekday[val.getDay()];
				case 'D':
					return shortday[val.getDay()];
				case 'd':
					return ('0' + val.getDate()).slice(-2);
				case 'j':
					return val.getDate();
				case 'F':
					return month[val.getMonth()];
				case 'M':
					return shortmonth[val.getMonth()];
				case 'm':
					return ('0' + (val.getMonth() + 1)).slice(-2);
				case 'n':
					return val.getMonth();
				case 'y':
					return val.getFullYear().toString().substr(2, 2);
				case 'Y':
					return val.getFullYear();
				case 'H':
					return ('0' + val.getHours()).slice(-2);
				case 'G':
					return val.getHours();
				case 'i':
					return ('0' + val.getMinutes()).slice(-2);
				case 's':
					return ('0' + val.getSeconds()).slice(-2);
				default:
					return char;
			};
		});

		return ret;
	};

  /**
    * transforms a date to time
    */
  	Date.prototype.transTime = function() {
		return this.transUnit('time');
	};

  /**
    * transforms a date to short
    */
  	Date.prototype.transShort = function() {
		return this.transUnit('short');
	};

  /**
    * transforms a date to long
    */
  	Date.prototype.transLong = function() {
		return this.transUnit('long');
    };

/**
 * -----------------------------------------------------------------------------
 * P L O T   D Y N A M I C   E X T E N T I O N S
 * -----------------------------------------------------------------------------
 */

	Highcharts.setOptions({
		lang: {
			months: <?php echo trans('month') ?>,
			shortMonths: <?php echo trans('shortmonth') ?>,
			weekdays: <?php echo trans('weekday') ?>,
			shortWeekdays: <?php echo trans('shortday') ?>,
			resetZoom: '<?php echo trans('plot', 'resetzoom') ?>',
			resetZoomTitle: '<?php echo trans('plot', 'resetzoomtip') ?>',
			rangeSelectorFrom: '<?php echo trans('plot', 'rangeSelectorFrom') ?>',
			rangeSelectorTo: '<?php echo trans('plot', 'rangeSelectorTo') ?>',
			rangeSelectorZoom: '<?php echo trans('plot', 'rangeSelectorZoom') ?>',
			durations: <?php echo trans('durations', '', 'obj') ?>, // custom implementation in plots
			shortDurations: <?php echo trans('shortdurations', '', 'obj') ?> // custom implementation in plots
		},
		plotOptions: {
			series: {
				shadow: true,
				marker: { enabled: false },
				animation: <?php echo (config_animation ? '{ duration: 1500 }' : 'false') ?>
			}
		},
		chart: {
			animation: <?php echo (config_animation ? 'true' : 'false') ?>,
		},
		rangeSelector: {
			inputDateFormat: '<?php echo preg_replace('/%i/','%M',preg_replace('/[a-zA-Z]/','%$0',trans('format','short'))) ?>'
		},
		global: {
			useUTC: false,
			//canvasToolsURL: 'vendor/plot.highcharts/modules/canvas-tools.js', // not shure if used with Highcharts 5
		},
		credits: {
			enabled: false
		}
	});


/**
 * -----------------------------------------------------------------------------
 * L A N G U A G E  T E X T S
 * -----------------------------------------------------------------------------
 */
  var sv_lang = <?php echo json_encode(get_lang()); ?>


/**
 * -----------------------------------------------------------------------------
 * S M A R T  V I S U  I N F O  &  C O N F I G
 * -----------------------------------------------------------------------------
 */
	var sv = {
		config: {
			version: <?php echo config_version ?>
		}
	};
