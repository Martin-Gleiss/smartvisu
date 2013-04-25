<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 
 
    // get config-variables 
    require_once '../../config.php';
    require_once const_path_system.'functions.php';

	header('Cache-Control: public, must-revalidate');
	header('Content-Type: text/javascript');
?>

/**
 * -----------------------------------------------------------------------------
 * J A V A S C R I P T   D Y N A M I C   E X T E N T I O N S
 * ----------------------------------------------------------------------------- 
 */ 

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
