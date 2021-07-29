/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß, Stefan Widmer, Wolfram v. Hülsen
 * @copyright   2012 - 2021
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

/**
 * -----------------------------------------------------------------------------
 * S C R I P T S   F O R   C O N F I G U R A T I O N   P A G E
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

	if(event.target.id == 'config') {

		page.find('select, input').trigger('init');

		var authform = page.find('#googleauthform');

		// load google API (either in page or in iframe to work around google's restriction of private IP numbers as origins)
		var googleOrigin;
		if(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(location.hostname)) {
			googleOrigin = location.origin.replace(location.hostname, location.hostname + '.nip.io');
			authform.find('#googleauthframe').remove();
			$('<iframe id="googleauthframe" style="position: absolute; width: 100%; left: 0; right: 0; top: 0; bottom: 0; z-index: 99999; background-color: transparent; border: none;">').attr('src', googleOrigin + location.pathname + '?page=config.google' )
				.prependTo(authform.find('#calendar_googleauth_submitcontainer'))
				.on('click', function(e) {
					e.preventDefault();
					e.stopPropagation();
				});
		}
		else {
			googleOrigin = location.origin;
			$.getScript("https://apis.google.com/js/api.js")
				.done(function() {
					gapi.load('auth2', function() {
						try {
							gapi.auth2.authorize(
								// Work around a possible bug in gapi.auth2.authorize with IE11 and Edge
								{
									client_id: ' ',
									scope: 'https://www.googleapis.com/auth/calendar.readonly',
									prompt: 'none'
								},
								function() { }
							);
						}
						catch(ex) { }
					});
				})
				.fail(notify.json);
		}

		var resolveRefreshToken = function(code) {
			var client_id = authform.find('#client_id').val();
			var client_secret = authform.find('#client_secret').val();
			$.ajax({
				url: 'https://www.googleapis.com/oauth2/v4/token',
				method: 'POST',
				cache: false,
				dataType: 'json',
				data: {
					'client_id': client_id,
					'client_secret': client_secret,
					'redirect_uri': 'postmessage',
					'grant_type': 'authorization_code',
					'code': code
				}
			})
			.done(function(data) {
				var currentTarget = page.find("#config_source ul li").eq($("#config_source").tabs("option", "active")).data('source');
				page.find('#'+currentTarget+'_calendar_google_client_id').val(client_id);
				page.find('#'+currentTarget+'_calendar_google_client_secret').val(client_secret);
				page.find('#'+currentTarget+'_calendar_google_refresh_token').val(data.refresh_token);
				page.find('#calendar_googleauth_popup').popup('close');
			})
			.fail(notify.json);
		}

		$(window).on('message', function(e) {
			if(e.originalEvent.data.subject != 'googleauth')
				return;

			if(e.originalEvent.origin != googleOrigin)
				throw "Invalid origin";

			var error = e.originalEvent.data.error;
			if(error) {
				notify.message("error", "Google authentication", error.message || error.code);
				throw error.message || error.code;
			}

			var code = e.originalEvent.data.code;
			if(code == null) {
				notify.message("error", "Google authentication", "No code received");
				throw "No code received";
			}
			resolveRefreshToken(code);
		})

		authform
			.find('#script_origin').val(googleOrigin).end()

			.find('#google_json_file').on('change', function() {
				if(window.FileReader == null || this.files === undefined || this.files.length === 0 || this.files[0] == null)
					return;
				var reader = new FileReader();
				reader.onload = function(event) {
					$('#google_json_text').val(event.target.result).change();
				};
				reader.onerror = function(event) {
					notify.message('error', 'FileReader', event.target.error.code);
				};
				reader.readAsText(this.files[0]);
			}).end()

			.find('#google_json_text').on('change', function() {
				var googleData = $.parseJSON($(this).val());
				$('#client_id').val(googleData.web.client_id).change();
				$('#client_secret').val(googleData.web.client_secret);
			}).end()

			.find('#client_id').on('change', function() {
				if(googleOrigin != location.origin) {
					var clientId = $(this).val();
					authform.find('#googleauthframe')[0].contentWindow.postMessage({ subject: 'googleauth', clientId: clientId }, googleOrigin);
				}
			}).end()

			.on('submit', function() {
				var clientId = $(this).find('#client_id').val();
				gapi.auth2.authorize(
					{
						client_id: clientId,
						scope: 'https://www.googleapis.com/auth/calendar.readonly',
						prompt: 'consent',
						response_type: 'code'
					},
					function(resp) {
						if (resp.error)
							// possible errors: idpiframe_initialization_failed (with subtype), popup_closed_by_user, popup_blocked_by_browser, access_denied, immediate_failed
							notify.message("error", "Google authentication", resp.error_subtype || resp.error);
						else
							resolveRefreshToken(resp.code);
					}
				);
				return false;
			});

		page.find('form.configform').on('submit', function() {
			$.ajax({
				type: "POST",
				url: 'pages/base/configure.php?&target=' + $("#config_source ul li").eq($("#config_source").tabs("option", "active")).data('source') + '&pages='  + $('#config #current_pages').val(),
				data: $(this).serialize(),
				success: function (data) {
					location.reload(true);
					notify.message("info", data.title, data.text);
				}
			})
			.fail(notify.json);
			return false;
		});

		page.find('#clear_cache').click(function() {
			$.ajax({
				type: "GET",
				url: 'pages/base/configure.php?clear_cache=true',
				dataType: "json",
				success: function(data) {
					notify.message("info", data.title, data.text);
				}
			})
			.fail(notify.json);
			return false;
		});

	}
});
