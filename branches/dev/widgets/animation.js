/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 
   
/**
 * Animate the widgets.
 */


  /**
    * Attach all 'prepare' and 'redraw' Triggers
    */
	$(document).on('pagebeforeshow',function(event, ui){
		// DEBUG:
		console.log("[animation.prepare]");

		$.mobile.activePage.find('[data-widget] > ul').trigger('prepare');
	});

	$(document).on('pageshow',function(event, ui){
		// DEBUG:
		console.log("[animation.redraw]");

	    $.mobile.activePage.find('[data-widget] > ul').trigger('redraw');
	});


  /**
    * Fadein the listitems form top to bottom
    */
	$(document).delegate('[data-widget] > ul', {
		'prepare': function(event) {
		   	$(this).children().hide();
		},

		'redraw': function(event) {
		   	$(this).children().each(function(index) {
                var li = $(this);
	     		setTimeout(function(){ li.fadeIn(); }, 100 * (index + 1));
			});
		}
	});


