/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß, Stefan Widmer, Wolfram v. Hülsen
 * @copyright   2012 - 2026
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

/**
 * -----------------------------------------------------------------------------
 * S C R I P T S   F O R   "Kurzanleitung" C O N F I G U R A T I O N   D O C U
 * -----------------------------------------------------------------------------
 */
function changeDisabledState(parent, disable) {
	return parent
		.find('.ui-select select').prop('disabled', disable).selectmenu(disable ? 'disable' : 'enable').end()
		.find('.ui-flipswitch select').prop('disabled', disable).flipswitch(disable ? 'disable' : 'enable').end()
		.find('.ui-input-text input').textinput(disable ? 'disable' : 'enable').end()
		//.find('input:not(label input)').textinput(disable ? 'disable' : 'enable').end()
		//.end().find('.ui-button input').button(disable ? 'disable' : 'enable').end()
		.find('button').prop('disabled', disable).end()
		.find('input[type="hidden"]').prop('disabled', disable).end();
}

function setMobileWidgetValue(field, value) {
	return field.val(value)
		.filter('select[data-native-menu="false"]').selectmenu('refresh').end()
		.filter('select[data-role="flipswitch"]').flipswitch('refresh').end();
}

// click on row enables input
$(document).on('click', '#config .ui-field-contain',function(event) {
	if(!$(event.target).closest('.ui-field-contain label.ui-btn').length && !$(event.target).closest('.ui-field-contain .ui-help-icon').length) {
		changeDisabledState($(this).closest('.ui-field-contain'), false).find('label.ui-btn').addClass('ui-btn-active');
		// fill missing meta data after activation
		if(event.target.id != undefined && event.target.id != '' ){
			$('#'+event.target.id).trigger('change');
		}
	}
});
// click on label disables input
$(document).on('click', '#config .ui-field-contain label.ui-btn',function(event) {
	if($(this).hasClass('ui-btn-active'))
		changeDisabledState($(this).closest('.ui-field-contain'), true).find('label.ui-btn').removeClass('ui-btn-active');
	else
		$(this).closest('.ui-field-contain').trigger('click');
});

$(document).on('pagecreate', function (event, ui) {
	var page = $(event.target);

	if(event.target.id == 'grundlagen_configseite')
		page.find('select, input').trigger('init');
});
