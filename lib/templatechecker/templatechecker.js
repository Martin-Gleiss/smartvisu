/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Thomas Ernst
 * @copyright   2016
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

var templatechecker = (function () {
	var btn_run;
	var btn_reset;
	var displayAll = false;

	analyzeAll = function (e) {
		e.preventDefault();
		$('.tplchk_file_list').fadeOut('fast', function () {
			$('.tplchk_file_single').each(function (i, obj) {
				analyze($(this));
			});
		}).fadeIn('fast', function () {
			btn_run.hide();
			btn_reset.show();
		});

	};

	analyze = function (fileObject) {
		$.ajax({
			type: 'POST',
			url: '/lib/templatechecker/templatechecker.php',
			data: {'cmd': 'analyze', 'file': fileObject.attr('data-file'), 'fileid': fileObject.attr('id')},
			dataType: 'json',
			success: analyzeSuccess,
			error: function (xhr, textStatus, errorThrown) {
				analyzeError(fileObject, xhr, textStatus, errorThrown);
			}
		});
	};

	addRecheckButton = function (obj, fileId) {
		var btnRecheck = $('<input type="button" value="Recheck this file" class="tplchk_recheck"/>')
				.click(recheck)
				.attr('data-fileid', fileId);

		var div = $('<div style="width:250px;"></div>').append(btnRecheck);
		obj.append(div);
		btnRecheck.button();
	};

	analyzeSuccess = function (data, textStatus, xhr) {
		var result = $('#' + data['resultid']);
		var fileId = 'f' + data['resultid'].substring(1);

		if (data['total_count'] == 0) {
			var content = '<div data-role="collapsible" data-inset="false" data-theme="a" data-content-theme="a"><input type="button" value="Recheck this file" data-fileid="' + fileId + '" class="tplchk_recheck"/><div>No messages on this file.</div></div>';
		} else {
			var content = '<div data-role="collapsible" data-inset="false" data-theme="a" data-content-theme="a"><input type="button" value="Recheck this file" data-fileid="' + fileId + '" class="tplchk_recheck"/>' +
					addMsgGroup('Errors', 'alert', 'severity_E', data['messages']['E']) +
					addMsgGroup('Warnings', 'info', 'severity_W', data['messages']['W']) +
					addMsgGroup('Infos', 'check', 'severity_I', data['messages']['I']) +
					addMsgGroup('Notifications', 'star', 'severity_N', data['messages']['N']) +
					'</div>';
		}
		content = $(content);
		result.empty().append(content);
		content.trigger('create');

		var fileDiv = $('#' + fileId);
		fileDiv.find('.tplchk_num_e').text('E: ' + data['counts']['E']);
		fileDiv.find('.tplchk_num_w').text('W: ' + data['counts']['W']);
		fileDiv.find('.tplchk_num_i').text('I: ' + data['counts']['I']);
		fileDiv.removeClass('severity_E severity_W severity_I, severity_N').addClass('severity_' + data['total_severity']);

		result.find('.tplchk_recheck').click(recheck).button();

		if (!displayAll) {
			if (data['total_severity'] != 'E' && data['total_severity'] != 'W')
				fileDiv.hide();
			else
				result.find('.severity_I, .severity_N').hide();
		}
	};

	addMsgGroup = function (title, icon, severity, messages) {
		if (messages.length == 0)
			return '';
		var content = '<div data-role="collapsible" data-inset="false" data-mini="true" data-theme="c" data-content-theme="a" class="' + severity + '" data-collapsed-icon="' + icon + '" data-expanded-icon="' + icon + '"><h2>' + title + '</h2><ul data-role="listview" data-inset="true">';
		$.each(messages, function (testIndex, testValue) {
			content += '<div data-role="collapsible" data-inset="false" data-mini="true" data-theme="a" data-content-theme="a"><h2>' + testIndex + '</h2>';
			$.each(testValue, function (msgIndex, msgValue) {
				content += '<div data-role="collapsible" data-inset="true" data-collapsed="false" data-mini="true" data-theme="a" data-content-theme="b" data-collapsed-icon="' + icon + '" data-expanded-icon="' + icon + '"><h3>' + msgValue['message'] + '</h3>';
				if (msgValue['line']) {
					content += '<div class="docu"><div class="twig"><code class="prettyprint">' + escapeHtml(msgValue['line']) + '</code></div></div>';
				}
				content += '<ul><li>Line ' + msgValue['lineNo'] + '</li>';
				$.each(msgValue['data'], function (dataIndex, dataValue) {
					content += '<li>' + dataIndex + ': ' + escapeHtml(dataValue) + '</li>';
				});
				content += '</ul></div>';
			});
			content += '</div>';
		});
		content += '</ul></div>';
		return content;
	}

	analyzeError = function (fileObject, xhr, textStatus, errorThrown) {
		var resultId = 'r' + fileObject.attr('id').substring(1);
		var result = $('#' + resultId);

		var content = '<div data-role="collapsible" data-inset="false" data-theme="a" data-content-theme="a">' + xhr.responseJSON.message + '</div>';
		content = $(content);
		result.empty().append(content);
		content.trigger('create');

		var fileId = 'f' + fileObject.attr('id').substring(1);
		var fileDiv = $('#' + fileId);
		fileDiv.find('.tplchk_num_e').text('E: fatal');
		fileDiv.find('.tplchk_num_w').text('');
		fileDiv.find('.tplchk_num_i').text('');
		fileDiv.removeClass('severity_E severity_W severity_I, severity_N').addClass('severity_E');
	};

	reset = function (e) {
		$.ajax({
			type: "POST",
			url: '/lib/templatechecker/templatechecker.php',
			data: {"cmd": "getfiles"},
			dataType: 'json',
			success: resetSuccess,
			error: resetError,
			complete: resetComplete
		});
	};

	resetSuccess = function (data, textStatus, xhr) {
		var fileList = $('.tplchk_file_list');
		fileList.slideUp('slow', function () {
			var html = '';
			$.each(data, function (index, value) {
				html += '<div data-role="collapsible" data-inset="false" data-theme="a" data-content-theme="a" class="tplchk_file_single" data-collapsed-icon="gear" data-expanded-icon="gear" data-file="' + value + '" id="f' + index + '">\
					<h2><div style="width:70%;float:left;" class="tplchk_text">' + value + '</div>\
						<div style="width:10%;float:left;" class="tplchk_num_e"></div>\
						<div style="width:10%;float:left;" class="tplchk_num_w"></div>\
						<div style="width:10%;float:left;" class="tplchk_num_i"></div></h2>\
					<div id="r' + index + '">Checks not done, yet</div>\
					</div>';

			});
			fileList.empty().append(html).trigger('create').slideDown('slow');
		})
	};

	resetError = function (xhr, textStatus, errorThrown) {
		var fileList = $('.tplchk_file_list');
		fileList.slideUp('slow', function () {
			var html = '<div class="severity_E">Fatal Error</div><div>' + xhr.responseJSON.message + '</div>';
			fileList.empty().append(html).trigger('create').slideDown('slow');
		});
	};

	resetComplete = function (xhr, textStatus) {
		btn_run.show();
		btn_reset.hide();
	};

	recheck = function (e) {
		var fileObj = $(this).closest('.tplchk_file_single');
		//var resultObj = $(this).closest('.result');
		fileObj.fadeOut('fast', function () {
			analyze(fileObj);
		}).fadeIn('fast', function () {

		});
	};

	chkErrorsOnlyClick = function (e) {
		setDisplayAll(!$(this).prop('checked'));
	};

	setDisplayAll = function (newDisplay) {
		if (displayAll == newDisplay)
			return;
		displayAll = newDisplay;
		if (displayAll) {
			$('.severity_N, .severity_I').slideDown('slow');
		} else {
			$('.severity_N, .severity_I').slideUp('slow');
		}
	}

	escapeHtml = function (unsafe) {
		if (typeof unsafe === 'string' || unsafe instanceof String) {
			return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
		} else {
			return unsafe;
		}
	};

	$(document).ready(function () {
		btn_run = $('#tplchk_btn_run').click(analyzeAll).closest('div');
		btn_reset = $('#tplchk_btn_reset').click(reset).closest('div').hide();
		$('#tplchk_chk_errors_only').change(chkErrorsOnlyClick);
		setDisplayAll(true);
		reset();
	});

})();