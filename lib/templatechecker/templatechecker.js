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
	var btn_showall;
	var btn_showerrors;
	var displayAll = false;

	analyzeAll = function (e) {
		e.preventDefault();
		$('#filelist').fadeOut('fast', function () {
			$('.file').each(function (i, obj) {
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
			error: analyzeError
		});

	};

	analyzeSuccess = function (data, textStatus, xhr) {
		var fileId = 'f' + data['resultid'].substring(1);
		var result = $('#' + data['resultid'])
				.empty();
		addRecheckButton(result, fileId);

		if (data['messages'].length == 0) {
			result.append('<div class="severity_N">No messages on this file.</div>');
		} else {
			$.each(data['messages'], function (index, value) {
				var content = '<div class="severity_' + value['severity'] + '">\
								<div>' + value['test'] + ': ' + value['message'] + '</div>\
								<div class="details docu">';
				if (value['line']) {
					content += '<div class="twig"><code class="prettyprint">' + escapeHtml(value['line']) + '</code></div>';
				}

				content += '<ul><li>Line ' + value['lineNo'] + '</li>';
				$.each(value['data'], function (index, value) {
					content += '<li>' + index + ': ' + escapeHtml(value) + '</li>';
				});
				content += '</ul>';
				content += '</div></div>';
				content = $(content);
				result.append(content);
				if (!displayAll && (value['severity'] == 'N' || value['severity'] == 'I'))
					content.hide();
			});
		}
		result.parent()
				.removeClass('severity_E severity_W severity_I severity_N severity_U')
				.addClass('severity_' + data['total_severity']);
		if (!displayAll && (data['total_severity'] == 'N' || data['total_severity'] == 'I'))
			result.parent().hide();
	};

	analyzeError = function (xhr, textStatus, errorThrown) {
		$('#r' + fileObject.attr('id').substring(1)).html(xhr.responseJSON.message);
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
		$('#filelist')
				.slideUp('slow', function () {
					$('#filelist').empty();
					$.each(data, addSingleFile);
					$('div.file span.hover').click(function () {
						$('#r' + $(this).parent().attr('id').substring(1)).slideToggle('slow');
					})
				})
				.slideDown('slow');
		;
	};

	resetError = function (xhr, textStatus, errorThrown) {
		var $content = xhr.responseJSON.message;
		$('#filelist')
				.slideUp('slow', function () {
					$('#filelist').empty()
							.append('<div class="severity_E""><span class="hover">Error:</span><div>' + xhr.responseJSON.message + '</div>');
				})
				.slideDown('slow');
	};

	resetComplete = function (xhr, textStatus) {
		btn_run.show();
		btn_reset.hide();
	};

	recheck = function (e) {
		var fileObj = $(this).closest('.file');
		var resultObj = $(this).closest('.result');
		resultObj.fadeOut('fast', function () {
			analyze(fileObj);
		}).fadeIn('fast', function () {

		});
	};

	addRecheckButton = function (obj, fileId) {
		var btnRecheck = $('<input type="button" value="Recheck this file"/>')
				.click(recheck)
				.attr('data-fileid', fileId);
				
		var div = $('<div style="width:250px;"></div>').append(btnRecheck);
		obj.append(div);
		btnRecheck.button();
	};

	addSingleFile = function (index, value) {
		$('#filelist').append('<div class="file severity_U" data-file="' + value + '" id="f' + index + '"> \
							<span class="hover">File "' + value + '"</span>\
							<div class="result" id="r' + index + '" style="display:none;">\
							<input type="button" value="Check this file"/>\
							<div class="severity_U">Checks not done, yet.</div></div> \
							</div>');
	};

	showErrors = function (e) {
		setDisplayAll(false)
	};

	showAll = function (e) {
		setDisplayAll(true)
	};

	setDisplayAll = function (newDisplay) {
		if (displayAll == newDisplay)
			return;
		displayAll = newDisplay;
		if (displayAll) {
			$('.severity_N, .severity_I').slideDown('slow');
			btn_showerrors.show();
			btn_showall.hide();
		} else {
			$('.severity_N, .severity_I').slideUp('slow');
			btn_showerrors.hide();
			btn_showall.show();
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
		// on click "Run all tests"
		$('#run').click(analyzeAll);
		btn_run = $('#run').parent();

		// on click Reset result"
		$('#reset').click(reset);
		btn_reset = $('#reset').parent().hide();

		$('#show_errors').click(showErrors);
		btn_showerrors = $('#show_errors').parent().hide();

		$('#show_all').click(showAll);
		btn_showall = $('#show_all').parent().hide();

		setDisplayAll(true);
		reset();
	});

})();