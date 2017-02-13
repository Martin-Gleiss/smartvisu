<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
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
					return weekday[(val.getDay() + 1) % 7];
				case 'D':
					return shortday[(val.getDay() + 1) % 7];
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

  /**
    * Plots
    */
	$(function () {

		Highcharts.setOptions({
			lang: {
				months: <?php echo trans('month') ?>,
				shortMonths: <?php echo trans('shortmonth') ?>,
				weekdays: <?php echo trans('weekday') ?>,
				resetZoom: '<?php echo trans('plot', 'resetzoom') ?>',
				resetZoomTitle: '<?php echo trans('plot', 'resetzoomtip') ?>'
			},
			plotOptions: {
				series: {
					animation: <?php echo (config_animation ? 'true' : 'false') ?>
				}
			}
	    });

	});


/**
 * -----------------------------------------------------------------------------
 * L A N G U A G E  T E X T S
 * -----------------------------------------------------------------------------
 */
  var sv_lang = <?php echo json_encode(get_lang()); ?>