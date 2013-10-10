<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
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
    * transforms a number to int
    */
  	Number.prototype.transInt = function() {
		<?php $fmt = trans('format', 'int'); ?>
		return Math.round(this);
	};

  /**
    * transforms a number to float
    */
  	Number.prototype.transFloat = function() {
		<?php $fmt = trans('format', 'float'); ?>
		return this.toFixed(<?php echo $fmt[4] ?>).replace('.', '<?php echo $fmt[3] ?>');
	};

  /**
    * transforms a number to temp
    */
  	Number.prototype.transTemp = function() {
		<?php $fmt = trans('format', 'temp'); ?>
		var ret = this.toFixed(<?php echo $fmt[4] ?>).replace('.', '<?php echo $fmt[3] ?>');
		return ret.toString() + '<?php echo strrchr($fmt, ' ') ?>';
	};

  /**
    * transforms a number to percent
    */
  	Number.prototype.transPercent = function() {
		<?php $fmt = trans('format', 'percent'); ?>
		var ret = this.toFixed(<?php echo $fmt[4] ?>).replace('.', '<?php echo $fmt[3] ?>');
		return ret.toString() + '<?php echo strrchr($fmt, ' ') ?>';
	};

  /**
    * transforms a number to currency
    */
  	Number.prototype.transCurrency = function() {
		<?php $fmt = trans('format', 'currency'); ?>
		var ret = this.toFixed(<?php echo $fmt[4] ?>).replace('.', '<?php echo $fmt[3] ?>');
		return ret.toString() + '<?php echo strrchr($fmt, ' ') ?>';
	};

    /**
    * transforms a number to a defined unit
    */
    Number.prototype.transUnit = function(unit, round) {
        <?php echo 'allFormats  = ' . trans('format', '', true) . ';'; ?>
        var getUnit = eval('allFormats.' + unit);
        if (getUnit == '') {
            return this;
        }
        var roundTo = getUnit[4];
        var devider = getUnit[3];
        if (parseInt(round)) {
            roundTo = parseInt(round);
        }
        var ret = this.toFixed(roundTo).replace('.', devider );
        return ret.toString() + getUnit.substr(getUnit.lastIndexOf(' '));
    };

// ----- date ------------------------------------------------------------------

  /**
    * transforms a date to date
    */
  	Date.prototype.transDate = function(ret) {
		if (!ret)
			ret = '<?php echo trans('format', 'date'); ?>';

        ret = ret.replace('d', ('0' + this.getDate()).slice(-2));
        ret = ret.replace('m', ('0' + (this.getMonth()+1)).slice(-2));
		ret = ret.replace('y', this.getFullYear().toString().substr(2,2));
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
		return this.transDate('<?php echo trans('format', 'time'); ?>');
	};

  /**
    * transforms a date to short
    */
  	Date.prototype.transShort = function() {
		return this.transDate('<?php echo trans('format', 'short'); ?>');
	};

  /**
    * transforms a date to long
    */
  	Date.prototype.transLong = function() {
		return this.transDate('<?php echo trans('format', 'long'); ?>');
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
				weekdays: <?php echo trans('weekday') ?>
			},
	    });
	
	});
