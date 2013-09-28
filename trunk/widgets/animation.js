/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


/**
 * Animation of some html-elements and some widgets.
 *
 * Concept:
 * --------
 * This file may be optionally included. If it is not included, all html
 * elements will be shown with the rendering of the page. If animation is
 * switched on (config) the element will be hidden. After showing the page
 * the elements will be animated.
 *
 * Events:
 * -------
 * Some new events are introduced to control the widgets and there visual
 * appearance.
 *
 * 'prepare': function(event) { }
 * Triggered before a page is been shown.
 *
 * 'redraw': function(event, response) { }
 * Triggered after the page is visible and the animimation could be made
 *
 */

/**
 * Attach all 'prepare' and 'redraw' Triggers
 */
$(document).on('pagebeforeshow', function (event, ui) {
	// DEBUG:
	console.log("[animation.prepare]");

	$.mobile.activePage.find('[data-widget] > ul').trigger('prepare');
});

$(document).on('pageshow', function (event, ui) {
	// DEBUG:
	console.log("[animation.redraw]");

	$.mobile.activePage.find('[data-widget] > ul').trigger('redraw');
});


/**
 * Fade-In the listitems from top to bottom
 */
$(document).delegate('[data-widget] > ul', {
	'prepare': function (event) {
		$(this).children().hide();
	},

	'redraw': function (event) {
		$(this).children().each(function (index) {
			var li = $(this);
			setTimeout(function () {
				li.fadeIn();
			}, 100 * (index + 1));
		});
	}
});


