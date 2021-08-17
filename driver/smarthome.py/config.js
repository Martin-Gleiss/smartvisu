/**
* disables input of IP address and port if reverse proxy is configured 
* macro will be called in the "addition" parameter of config_flip for the reverse proxy option only 
*
* @author: Wolfram v. Hülsen
*/
$(document).on('pagecreate', function (event, ui) {
	if(event.target.id == 'config') {

		$('select[name="driver_reverseproxy"]').on('change init', function(event) {
			var element = $(this);
			if(element.val() == "true") {
				setMobileWidgetValue(element.closest("fieldset").find('[name="driver_address"]'), "");
				setMobileWidgetValue(element.closest("fieldset").find('[name="driver_port"]'), "");
				setMobileWidgetValue(element.closest("fieldset").find('[name="driver_tlsport"]'), "");
				element.data("hidden", element.closest("fieldset").find('.ui-field-contain:has([name="driver_address"])').hide());
				element.data("hidden", element.closest("fieldset").find('.ui-field-contain:has([name="driver_port"])').hide());
				element.data("hidden", element.closest("fieldset").find('.ui-field-contain:has([name="driver_tlsport"])').hide());
			}
			else {
				element.data("hidden", element.closest("fieldset").find('.ui-field-contain:has([name="driver_address"])').show());
				element.data("hidden", element.closest("fieldset").find('.ui-field-contain:has([name="driver_port"])').show());
				element.data("hidden", element.closest("fieldset").find('.ui-field-contain:has([name="driver_tlsport"])').show());
			};
		});

	$('select[name="driver_reverseproxy"]').trigger('init');
	}
});
