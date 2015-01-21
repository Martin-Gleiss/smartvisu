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

	header('Cache-Control: public, must-revalidate');
	header('Content-Type: text/javascript');
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
		
		var fmt = eval("formats['" + unit.toLowerCase() + "']");
		if (fmt == undefined) {
			return this.toString() + ' ' + unit;
		}
		else
			return printf(fmt, this);
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
		<?php echo 'formats  = ' . trans('format', '', 'obj') . ';'; ?>
		
		if (unit == '') {
			return this;
		}

		var ret = formats[unit.toLowerCase()];
		if (ret == undefined) {
			return this.toString() + ' ' + unit;
		}

		ret = ret.replace('d', ('0' + this.getDate()).slice(-2));
        ret = ret.replace('m', ('0' + (this.getMonth() + 1)).slice(-2));
		ret = ret.replace('y', this.getFullYear().toString().substr(2, 2));
        ret = ret.replace('Y', this.getFullYear());

		ret = ret.replace('H', this.getHours());
        ret = ret.replace('i', ('0' + this.getMinutes()).slice(-2));
        ret = ret.replace('s', ('0' + this.getSeconds()).slice(-2));

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
