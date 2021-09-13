/**
 * -----------------------------------------------------------------------------
 * @package      smartVISU
 * @author       Patrik Germann
 * @copyright    2021
 * @license      GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

$(document).on('pagecreate', '[id$="config"]', function (event, ui) {

	$('select[name="driver_ssl"]').on('change init', function(event) {
		if( $(this).val() == 'true') {
			$(this).closest("fieldset").find('.ui-field-contain:has([name="driver_tlsport"])').show();
		} else {
			$(this).closest("fieldset").find('.ui-field-contain:has([name="driver_tlsport"])').hide();
		}
	});

	$('select[name="driver_authentication"]').on('change init', function(event) {
		if ($(this).val() == 'true') {
			$(this).closest("fieldset").find('.ui-field-contain:has([name="driver_username"])').show();
			$(this).closest("fieldset").find('.ui-field-contain:has([name="driver_password"])').show();
		} else {
			$(this).closest("fieldset").find('.ui-field-contain:has([name="driver_username"])').hide();
			$(this).closest("fieldset").find('.ui-field-contain:has([name="driver_password"])').hide();
		}
	});

});
