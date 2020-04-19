/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Thomas Ernst
 * @copyright   2016
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

/**
 * Handling of display mode (all results, only errors/warnings) 
 */
var tplchk_displayMode = (function () {
	var current = 0; // 0: Undefined, 1: All, 2:Errors/warnings only

	init = function () {
		$('#tplchk_chk_errors_only').change(function (e) {
			set($(this).prop('checked') ? 2 : 1);
		});
		set(1, false);
	}

	set = function (value, force) {
		if (current == value && force != true)
			return;
		current = value;
		switch (current) {
			default:
			case 1:
				$('.severity_N, .severity_I').slideDown('slow', function () {
					msgNoFilesRemove();
				});
				break;
			case 2 :
				$('.severity_N, .severity_I').slideUp('slow', function () {
					msgNoFilesAdd();
				});
				break;
		}
	};

	msgNoFilesAdd = function () {
		if ($('.tplchk_file_single:visible').length == 0 && $('.tplchk_file_noting').length == 0)
			fileList.append('<div data-role="collapsible" data-inset="false" data-theme="a" data-content-theme="a" class="tplchk_file_noting" data-collapsed-icon="gear" data-expanded-icon="gear"><h2>No files to display in current display mode.</h2></div>');
	};

	msgNoFilesRemove = function () {
		$('.tplchk_file_noting').slideUp('fast').remove();
	};

	setAll = function () {
		set(1, false);
	};

	setErrors = function () {
		set(2, false);
	};

	reapply = function () {
		set(current, true);
	};

	return {init: init, setAll: setAll, setErrors: setErrors, reapply: reapply, msgNoFilesRemove: msgNoFilesRemove};
})();

/**
 * Handling of buttons and loading-message
 */
var tplchk_status = (function () {
	var btn_run;
	var btn_reset;
	var select_pages;

	init = function () {
		btn_run = $('#tplchk_btn_run').click(tplchk_checker.checkAll).closest('div');
		btn_reset = $('#tplchk_btn_reset').click(tplchk_filelist.fill).closest('div');
		select_pages = $('#tplchk_pages').on('change', tplchk_filelist.fill).closest('.ui-field-contain');
		setWorking();
	}

	setWorking = function () {
		$.mobile.loading('show', {
			text: 'Processing ...',
			textVisible: true,
			theme: 'a',
			textonly: false,
		});
		btn_run.hide();
		btn_reset.hide();
		changeDisabledState(select_pages, true);
		tplchk_displayMode.msgNoFilesRemove();
	};

	setResetDone = function () {
		btn_run.show();
		btn_reset.hide();
		changeDisabledState(select_pages, false);
		$.mobile.loading('hide');
	};

	setRunDone = function () {
		btn_run.hide();
		btn_reset.show();
		changeDisabledState(select_pages, true);
		$.mobile.loading('hide');
	};

	return {init: init, setWorking: setWorking, setResetDone: setResetDone, setRunDone: setRunDone};
})();

/**
 * Handling of file list
 */
var tplchk_filelist = (function () {
	var fileList;

	init = function () {
		fileList = $('.tplchk_file_list');
		fill();
	};

	fill = function (e) {
		tplchk_status.setWorking();
		var pages = $('#tplchk_pages').val();
		fileList.slideUp('slow', function () {
			$.ajax({
				type: "GET",
				url: 'lib/templatechecker/templatechecker.php',
				data: {"cmd": "getfiles", "pages": pages},
				dataType: 'json',
				success: fillSuccess,
				error: fillError,
				complete: fillComplete
			});
		});
	};

	fillSuccess = function (data, textStatus, xhr) {
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
		fileList.html(html).trigger('create');
	};

	fillError = function (xhr, textStatus, errorThrown) {
		fileList.slideUp('slow', function () {
			var html = '<div class="severity_E">Fatal Error</div><div>' + xhr.responseJSON.message + '</div>';
			fileList.html(html).trigger('create');
		});
	};

	fillComplete = function (xhr, textStatus) {
		fileList.slideDown('slow');
		tplchk_status.setResetDone();
	};

	return{init: init, fill: fill};
})();

/**
 * Checker functions
 */
var tplchk_checker = (function () {
	var fileList;

	init = function () {
		fileList = $('.tplchk_file_list');
	};

	checkAll = function (e) {
		e.preventDefault();

		$('.check').each(function (index) {
	
			$.getJSON('lib/base/' + $(this).attr('data-check'), function (data) {
				$('.check').eq(index).children('img').attr('src', 'icons/ws/' + data.icon);
				$('.check').eq(index).children('span').html(data.text);
			})
				.error(function (jqXHR) {
					var data = jQuery.parseJSON(jqXHR.responseText);
					$('.check').eq(index).children('img').attr('src', 'icons/ws/' + data.icon);
					$('.check').eq(index).children('span').html(data.text);
				});
		});

		fileList.fadeOut('fast', function () {
			tplchk_status.setWorking();
			var deferreds = [];
			$('.tplchk_file_single').each(function (i, obj) {
				deferreds.push(check($(this)));
			});
			$.when.apply($, deferreds).always(checksComplete);
		});
	};

	check = function (fileObject) {
		return $.ajax({
			type: 'GET',
			url: 'lib/templatechecker/templatechecker.php',
			data: {'cmd': 'analyze', 'file': fileObject.attr('data-file'), 'fileid': fileObject.attr('id')},
			dataType: 'json',
			success: checkSuccess,
			error: function (xhr, textStatus, errorThrown) {
				checkError(fileObject, xhr, textStatus, errorThrown);
			}
		});
	};

	checkSuccess = function (data, textStatus, xhr) {
		var result = $('#' + data['resultid']);
		var fileId = 'f' + data['resultid'].substring(1);
		var content = '';
		if (data['total_count'] == 0) {
			content = ['<div data-role="collapsible" data-inset="false" data-theme="a" data-content-theme="a" class="tplchk_create_pending">', btnRecheckAdd(fileId), '<div>No messages on this file.</div></div>'].join('');
		} else {
			content = ['<div data-role="collapsible" data-inset="false" data-theme="a" data-content-theme="a" class="tplchk_create_pending">',
					btnRecheckAdd(fileId),
					addGroup('Errors', 'alert', 'severity_E', data['messages']['E']),
					addGroup('Warnings', 'info', 'severity_W', data['messages']['W']),
					addGroup('Infos', 'check', 'severity_I', data['messages']['I']),
					addGroup('Notifications', 'star', 'severity_N', data['messages']['N']),
					'</div>'].join('');
		}
		result.html(content);
		fileHeader(fileId, 'E: ' + data['counts']['E'], 'W: ' + data['counts']['W'], 'I: ' + data['counts']['I'], 'severity_' + data['total_severity'])
	};

	checkError = function (fileObject, xhr, textStatus, errorThrown) {
		var fileId = fileObject.attr('id');
		var result = $('#r' + fileId.substring(1));

		var message = xhr.responseJSON ? xhr.responseJSON.message : xhr.responseText;
		var content = ['<div data-role="collapsible" data-inset="false" data-theme="a" data-content-theme="a" class="tplchk_create_pending">', 	btnRecheckAdd(fileId), message, '</div>'].join('');
		result.html(content);
		fileHeader(fileId, 'E: fatal', '', '', 'severity_E')
	};

	checksComplete = function () {
		$('.tplchk_create_pending').trigger('create').removeClass('tplchk_create_pending');
		btnRecheckComplete();
		tplchk_displayMode.reapply();
		fileList.fadeIn('fast');
		tplchk_status.setRunDone();
	}

	fileHeader = function (fileId, txtE, txtW, txtI, severityClass) {
		var fileDiv = $('#' + fileId);
		fileDiv.find('.tplchk_num_e').text(txtE);
		fileDiv.find('.tplchk_num_w').text(txtW);
		fileDiv.find('.tplchk_num_i').text(txtI);
		fileDiv.removeClass('severity_E severity_W severity_I severity_N').addClass(severityClass);
	};

	addGroup = function (title, icon, severity, messages) {
		if (messages.length == 0)
			return '';
		var content = [];
		content.push('<div data-role="collapsible" data-inset="true" data-mini="true" data-theme="c" data-content-theme="a" class="');
		content.push(severity);
		content.push('"');
		if(severity == 'severity_E' || severity == 'severity_W')
			content.push(' data-collapsed="false"');
		content.push(' data-collapsed-icon="');
		content.push(icon);
		content.push('" data-expanded-icon="');
		content.push(icon);
		content.push('"><h2>');
		content.push(title);
		content.push('</h2><ul data-role="listview" data-inset="true">');
		$.each(messages, function (testIndex, testValue) {
			content.push('<div data-role="collapsible" data-inset="false" data-mini="true" data-theme="a" data-content-theme="a"');
			if(severity == 'severity_E')
				content.push(' data-collapsed="false"');
			content.push('><h2>');
			content.push(testIndex);
			content.push('</h2>');
			$.each(testValue, function (msgIndex, msgValue) {
				content.push('<div data-role="collapsible" data-inset="true" data-collapsed="false" data-mini="true" data-theme="a" data-content-theme="b" data-collapsed-icon="');
				content.push(icon);
				content.push('" data-expanded-icon="');
				content.push(icon);
				content.push('"><h3>');
				content.push(msgValue['message']);
				content.push('</h3>');
				if (msgValue['line']) {
					content.push('<div class="docu"><div class="twig"><code class="prettyprint">');
					content.push(escapeHtml(msgValue['line']));
					content.push('</code></div></div>');
				}
				content.push('<ul><li>Line ');
				content.push(msgValue['lineNo']);
				content.push('</li>');
				$.each(msgValue['data'], function (dataIndex, dataValue) {
					content.push('<li>');
					content.push(dataIndex);
					content.push(': ' );
					content.push(escapeHtml(dataValue));
					content.push('</li>');
				});
				content.push('</ul></div>');
			});
			content.push('</div>');
		});
		content.push('</ul></div>');
		return content.join('');
	};

	btnRecheckAdd = function (fileId) {
		return ['<input type="button" value="Recheck this file" data-fileid="', fileId, '" data-theme="e" class="tplchk_btn_recheck tplchk_recheck_button_pending"/>'].join('');
	};

	btnRecheckComplete = function () {
		$('.tplchk_recheck_button_pending').click(btnRecheckClick).button().removeClass('tplchk_recheck_button_pending');
	};

	btnRecheckClick = function (e) {
		var fileObj = $(this).closest('.tplchk_file_single');
		fileObj.fadeOut('fast', function () {
			$.when(check(fileObj)).always(checksComplete);
		}).fadeIn('fast', function () {

		});
	};

	escapeHtml = function (unsafe) {
		if (typeof unsafe === 'string' || unsafe instanceof String) {
			return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
		} else {
			return unsafe;
		}
	};

	return {init: init, checkAll: checkAll};
})();

$(document).on('pagecreate', function (event, ui) {
	if(event.target.id == 'templatechecker') {
		tplchk_status.init();
		tplchk_displayMode.init();
		tplchk_filelist.init();
		tplchk_checker.init();
	}
});