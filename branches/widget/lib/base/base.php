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
?>

$(function () {
	
	Highcharts.setOptions({
		lang: { 
			months: <?php echo transparam('month') ?>,
			shortMonths: <?php echo transparam('shortmonth') ?>,
			weekdays: <?php echo transparam('weekday') ?>
		},
    });

});

