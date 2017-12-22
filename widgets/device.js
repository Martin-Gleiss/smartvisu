// ----- device.codepad -------------------------------------------------------
$.widget("sv.device_codepad", $.sv.widget, {

	initSelector: 'div[data-widget="device.codepad"]',

	options: {
		duration: '5s',
		val: '0000'
	},
	
	_create: function() {
		this._super();		
		var codepad = this.element;
		var id = this.options.id;
		$('[data-bind="' + id + '"]').find('*').on('click', function(event) {
			if (!$(this).closest('[data-bind="' + id + '"]').data('access')) {
				codepad.popup('open');
				codepad.find('input').val('').focus();
				codepad.data('originally-clicked', $(this));
				event.stopPropagation();
				event.preventDefault();
			}
		});
	},

	_events: {
		'keyup': function (event) {
			if (event.keyCode == 13) {
				this.element.find('[data-val="ok"]').click();
			}
		},
		
		'click > div > a': function (event) {
			var node = this.element; //$(event.target).parent().parent();
			var code = node.find('input');
			var key = $(event.target).data('val');

			code.focus();

			if (key == "ok") {
				if (this.options.val == code.val().md5()) {
					$('[data-bind="' + node.attr('data-id') + '"]').data('access', new Date().getTime()).removeClass('codepad');
					this._delay(function () {
						$('[data-bind="' + this.options.id + '"]').data('access', '').addClass('codepad');
					}, new Date().duration(this.options.duration).valueOf());
					node.popup("close");
					node.data("originally-clicked").trigger("click");
				}
				else {
					console.log('[device.codepad] ' + node.attr('id') + ' wrong code ' + code.val());
					code.val('');
					node.addClass('ui-focus');
					setTimeout(function () {
						node.removeClass('ui-focus');
					}, 400);
				}
			}
			else if (key == "-") {
				code.val('');
			}
			else {
				code.val(code.val() + key);
			}
		}

	}

});

	// ----- device.uzsu -----------------------------------------------------------
	// ----------------------------------------------------------------------------
	//
	// Neugestaltetes UZSU Widget zur Bedienung UZSU Plugin
	//
	// Darstellung der UZSU Einträge und Darstellung Widget in Form eine Liste mit den Einträgen
	// Umsetzung
	// (c) Michael Würtenberger 2014,2015,2016
	//
	//  APL 2.0 Lizenz
	//
	// Basis der Idee des dynamischen Popups übernommen von John Chacko
	// 		jQuery Mobile runtime popup
	// 		16. November 2012 · 0 Comments
	// 		http://johnchacko.net/?p=44
	//
	// ----------------------------------------------------------------------------
	// Basis der Architektur: document.update und document.click baut die handler in die Seite für das Popup ein.
	// document.update kopiert bei einem update die Daten aus dem Backend (per Websocket) in das DOM Element ("uzsu") ein
	// document.click übernimmt die Daten aus dem DOM Element in Variable des JS Bereichs und baut über runtimepopup
	// dynamisch header, body und footer des popup zusammen und hängt sie an die aktuelle seite an (append, pagecreate)
	// danach werden die Daten aus den Variablen in die Elemente der Seite kopiert. Die Elemente der Seite bilden immer
	// den aktuellen Stand ab und werden von dort in die Variablen zurückgespeichert, wenn notwendig (save, sort).
	// In der Struktur können Zeilen angehängt (add) oder gelöscht werden (del). Dies geschieht immer parallel in den Variablen
	// und den Elementen der Seite. Die Expertenzeilen werden immer sofort mit angelegt, sind aber zu Beginn nicht sichtbar.
	// Beim verlassen des Popups werden die dynamisch angelegten DOM Elemente wieder gelöscht (remove).
	//
	// Datenmodell: Austausch über JSON Element
	// 				{ 	"active" 	: bool,
	//					"list" 		: 					Liste von einträgen mit schaltzeiten
	//					[	"active"	:false,			Ist der einzelne Eintrag darin aktiv ?
	//						"rrule"		:'',			Wochen / Tag Programmstring
	//						"time"		:'00:00',		Uhrzeitstring des Schaltpunktes / configuration
	//						"value"		:0,				Wert, der gesetzt wird
	//						"event":	'time',			Zeitevent (time) oder SUN (sunrise oder sunset)
	//						"timeMin"	:'',			Untere Schranke SUN
	//						"timeMax"	:'',			Oberere Schranke SUN
	//						"timeCron"	:'00:00',		Schaltzeitpunkt
	//						"timeOffset":''				Offset für Schaltzeitpunkt
	//						"timeOffsetType":'m'				'm' = Offset in Minuten, 'deg' Offset in Höhengrad (Altitude)
	//						"condition"	: 	{	Ein Struct für die Verwendung mit conditions (aktuell nur FHEM), weil dort einige Option mehr angeboten werden
	//											"deviceString"	: text	Bezeichnung des Devices oder Auswertestring
	//											"type"			: text	Auswertetype (logische Verknüpfung oder Auswahl String)
	//											"value"			: text	Vergleichwert
	//											"active"		: bool	Aktiviert ja/nein
	//										}
	//						"delayedExec": 	{	Ein Struct für die Verwendung mit delayed exec (aktuell nur FHEM), weil dort einige Option mehr angeboten werden
	//											"deviceString"	: text	Bezeichnung des Devices oder Auswertestring
	//											"type"			: text	Auswertetype (logische Verknüpfung oder Auswahl String)
	//											"value"			: text	Vergleichwert
	//											"active"		: bool	Aktiviert ja/nein
	//										}
	//						"holiday":		{
	//											"workday"	: bool	Aktiviert ja/nein
	//											"weekend" 	: bool	Aktiviert ja/nein
	//										}
	//					]
	//				}
$.widget("sv.device_uzsuitem", $.sv.widget, {

	initSelector: '[data-widget="uzsu.uzsuicon"]',

	options: {
		valueparameterlist: null,
		headline: '',
		designtype: 0,
		valuetype: 'bool'
	},
	
	_uzsudata: {},
	
	_update: function(response) {
		// Initialisierung zunächst wird festgestellt, ob Item mit Eigenschaft vorhanden. Wenn nicht: active = false
		// ansonsten ist der Status von active gleich dem gesetzten Status
		var active;
		// erst einmal prüfen, ob ein Objekt tasächlich vohanden ist
		if(response.length > 0) {
			active = response[0].active;
		}
		else{
			active = false;
		}
		// Das Icon wird aktiviert, falls Status auf aktiv, ansonsten deaktiviert angezeigt. Basiert auf der Implementierung von aschwith
		if(active === true) {
			this.element.find('.icon-off').hide();
			this.element.find('.icon-on').show();
		}
		else {
			this.element.find('.icon-on').hide();
			this.element.find('.icon-off').show();
		}
		// wenn keine Daten vorhanden, dann ist kein item mit den eigenschaften hinterlegt und es wird nichts gemacht
		if (response.length === 0){
			notify.error("UZSU widget", "No UZSU data available in item '" + this.options.item + "' for widget " + this.options.id + ".");
			return;
		}
		// Wenn ein Update erfolgt, dann werden die Daten erneut in die Variable uzsu geladen damit sind die UZSU objekte auch in der click Funktion verfügbar
		if (response[0].list instanceof Array)
			this._uzsudata = response[0];
		else
			this._uzsudata = {active : true, list : []	};
	},

	_events: {
		'click': function(event) {
			// hier werden die Parameter aus den Attributen herausgenommen und beim Öffnen mit .open(....) an das Popup Objekt übergeben
			// und zwar mit deep copy, damit ich bei cancel die ursprünglichen werte nicht überschrieben habe
			var response = jQuery.extend(true, {}, this._uzsudata);
			// erst gehen wir davon aus, dass die Prüfungen positiv und ein Popup angezeigt wird
			var popupOk = true;
			// Fehlerbehandlung für ein nicht vorhandenes DOM Objekt. Das response Objekt ist erst da, wenn es mit update angelegt wurde. Da diese
			// Schritte asynchron erfolgen, kann es sein, dass das Icon bereits da ist, clickbar, aber nocht keine Daten angekommen. Dann darf ich nicht auf diese Daten zugreifen wollen !
			if(response.list === undefined){
				notify.error("UZSU widget", "No UZSU data available in item '" + this.options.item + "' for widget " + this.id + ".");
			}
			else{
			 	// Auswertung der Übergabeparameter aus dem HTML Widget
				var headline = this.options.headline;
				var designType = String(this.options.designtype);
				if(designType === undefined || designType === '') {
					designType = io.uzsu_type;
				}
				var valueType = this.options.valuetype;
				// data-item ist der sh.py item, in dem alle Attribute lagern, die für die Steuerung notwendig ist ist ja vom typ dict. das item, was tatsächlich per
				// Schaltuhr verwendet wird ist nur als attribut (child) enthalten und wird ausschliesslich vom Plugin verwendet. wird für das rückschreiben der Daten an smarthome.py benötigt
				var item = this.options.item;
				// jetzt kommt noch die Liste von Prüfungen, damit hinterher keine Fehler passieren, zunächst fehlerhafter designType (unbekannt)
				if ((designType !== '0') && (designType != '2')) {
					notify.error("UZSU widget", "Design type '" + designType + "' is not supported in widget " + this.id + ".");
					popupOk = false;
				}
				// fehlerhafter valueType (unbekannt)
				if ((valueType !== 'bool') && (valueType !== 'num')	&& (valueType !== 'text') && (valueType !== 'list')) {
					notify.error("UZSU widget", "Value type '" + valueType + "' is not supported in widget " + this.id + ".");
					popupOk = false;
				}
																
				//
				// Umsetzung des time parameters in die Struktur, die wir hinterher nutzen wollen
				//
				$.each(response.list, function(numberOfRow, entry) {
					// test, ob die einträge für holiday gesetzt sind
					if (entry.event === 'time')
						entry.timeCron = entry.time;
					else
						entry.timeCron = '00:00';

					// bei designType '0' wird rrule nach Wochentagen umgewandelt und ein festes Format vorgegegeben hier sollte nichts versehentlich überschrieben werden
					if (designType == '0') {
						// test, ob die RRULE fehlerhaft ist
						if ((entry.rrule.indexOf('FREQ=WEEKLY;BYDAY=') !== 0) && (entry.rrule.length > 0)) {
							if (!confirm("Error: Parameter designType is '0', but saved RRULE string in UZSU '" + entry.rrule + "' does not match default format FREQ=WEEKLY;BYDAY=MO... on item " + item	+ ". Should this entry be overwritten?")) {
								popupOk = false;
								// direkter Abbruch bei der Entscheidung!
								return false;
							}
						}
						if(entry.timeOffsetType === undefined)
							entry.timeOffsetType = 'm';
					}

					// wenn designType = '2' und damit fhem auslegung ist muss der JSON String auf die entsprechenden einträge erweitert werden (falls nichts vorhanden)
					if (designType == '2') {
						// test, ob die einträge für conditions vorhanden sind
						if (entry.condition === undefined){
							entry.condition = {deviceString:'',type:'String',value:'',active:false};
						}
						// test, ob die einträge für delayed exec vorhanden sind
						if (entry.delayedExec === undefined){
							entry.delayedExec = {deviceString:'',type:'String',value:'',active:false};
						}
						// test, ob die einträge für holiday gesetzt sind
						if (entry.holiday === undefined){
							entry.holiday = {workday:false, weekend:false};
						}
					}
				});

				if (popupOk) {
					// Öffnen des Popups bei clicken des icons und Ausführung der Eingabefunktion
					this._uzsuRuntimePopup(response, item);
				}
			}
		}
	},

	//----------------------------------------------------------------------------
	// Funktionen für den Seitenaufbau
	//----------------------------------------------------------------------------
	_uzsuBuildTableHeader: function() {
		// Kopf und überschrift des Popups
		var tt = "";
		// hier kommt der Popup Container mit der Beschreibung ein Eigenschaften
		tt += 	"<div data-role='popup' data-overlay-theme='b' data-theme='a' class='messagePopup' id='uzsuPopupContent' data-dismissible = 'false' data-history='false' data-position-to='window'>" +
					"<button data-rel='back' data-icon='delete' data-iconpos='notext' class='ui-btn-right' id='uzsuClose'></button>" +
					"<div class='uzsuClear'>" +
						"<div class='uzsuPopupHeader'>" + this.options.headline + "</div>" +
						"<div class='uzsuTableMain' id='uzsuTable'>";
		return tt;
	},
	
	_uzsuBuildTableRow: function(designType, numberOfRow) {
		// default Werte setzen fuer valueParameterList
		var valueType = this.options.valuetype;
		var valueParameterList = widget.explode(this.options.valueparameterlist);
		if(valueParameterList.length === 0){
			if(valueType === 'bool') valueParameterList = ['On','Off'];
			else if (valueType === 'num') valueParameterList = [''];
			else if (valueType === 'text') valueParameterList = [''];
			else if (valueType === 'list') valueParameterList = [''];
		}
		// Tabelleneinträge
		var tt = "";

		tt += 	"<div class='uzsuRow'>" +
					"<div class='uzsuCell'>" +
						"<div class='uzsuCellText'>" + sv_lang.uzsu.weekday + "</div>" +
							"<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true' class='uzsuWeekday'>";
							// rrule Wochentage (ist eine globale Variable von SV, Sonntag hat index 0 deshalb Modulo 7)
							var daydate = new Date(0);
							$.each([ 'MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU' ], function(index, value) {
								daydate.setDate(5 + index); // Set date to one on according weekday (05.01.1970 was a monday)
								tt += "<label title='" + daydate.transUnit('l') + "'><input type='checkbox' value='" + value + "'>" + daydate.transUnit('D') + "</label>";
							});
		tt +=			"</fieldset>" +
						"</div>";

		tt += 	"<div class='uzsuCell uzsuValueCell'>" +
					"<div class='uzsuCellText'>" + sv_lang.uzsu.value + "</div>";
		if (this.options.valuetype === 'bool') {
			// Unterscheidung Anzeige und Werte
			if (valueParameterList[0].split(':')[1] === undefined) {
				tt += "<select data-role='flipswitch'>" +
								"<option value='0'>" + valueParameterList[1] + "</option>" +
								"<option value='1'>"	+ valueParameterList[0] + "</option>" +
							"</select>";
			}
			else {
				tt += "<select data-role='flipswitch'>" +
								"<option value='" + valueParameterList[1].split(':')[1]	+ "'>" + valueParameterList[1].split(':')[0] + "</option>" +
								"<option value='" + valueParameterList[0].split(':')[1]	+ "'>" + valueParameterList[0].split(':')[0] + "</option>" +
							"</select>";
			}
		}
		else if (this.options.valuetype === 'num') {
			tt += 	"<input type='number' " + valueParameterList[0] + " data-clear-btn='false' class='uzsuValueInput' pattern='[0-9]*'>";
		}
		else if (this.options.valuetype === 'text') {
			tt += 	"<input type='text' data-clear-btn='false' class='uzsuTextInput'>";
		}
		else if (this.options.valuetype === 'list') {
			// das Listenformat mit select ist sehr umfangreich nur einzubauen.
			tt += 	"<select data-mini='true'>";
							for (var numberOfListEntry = 0; numberOfListEntry < valueParameterList.length; numberOfListEntry++) {
								// Unterscheidung Anzeige und Werte
								if (valueParameterList[0].split(':')[1] === undefined) {
									tt += "<option value='" + valueParameterList[numberOfListEntry].split(':')[0]	+ "'>"+ valueParameterList[numberOfListEntry].split(':')[0]	+ "</option>";
								}
								else {
									tt += "<option value='" + valueParameterList[numberOfListEntry].split(':')[1]	+ "'>"+ valueParameterList[numberOfListEntry].split(':')[0]	+ "</option>";
								}
							}
			tt += 	"</select>";
		}
		tt+=	"</div>"
		tt+=	"<div class='uzsuCell'>" +
					"<div class='uzsuCellText'>" + sv_lang.uzsu.time + "</div>" +
					"<input type='time' data-clear-btn='false' class='uzsuTimeInput uzsuTimeCron'>" +
				"</div>" +
				"<div class='uzsuCell'>" +
					"<div class='uzsuCellText'></div>" +
					"<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true'>" +
						"<label><input type='checkbox' class='uzsuActive'>" + sv_lang.uzsu.act + "</label>" +
					"</fieldset>" +
				"</div>" +
				"<div class='uzsuCellExpert'>" +
					"<div class='uzsuCellText'>" + sv_lang.uzsu.expert + "</div>" +
					"<button data-mini='true' data-icon='arrow-d' data-iconpos='notext' class='ui-icon-shadow'></button>" +
				"</div>" +
				"<div class='uzsuCell'>" +
					"<div class='uzsuCellText'></div>" +
					"<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true'>" +
						"<button class='uzsuDelTableRow' data-mini='true'>" + sv_lang.uzsu.del + "</button>" +
					"</fieldset>" +
				"</div>";
		// Tabelle Zeile abschliessen
		tt += 	"</div>";
		// und jetzt noch die unsichbare Expertenzeile
		tt += 	"<div class='uzsuRowExpHoli' style='display:none;'>" +
					"<div class='uzsuRowExpert' style='float: left;'>" +
						"<div class='uzsuRowExpertText'>" + sv_lang.uzsu.sun + "</div>" +
						"<div class='uzsuCell'>" +
							"<div class='uzsuCellText'>" + sv_lang.uzsu.earliest + "</div>" +
							"<input type='time' data-clear-btn='false' class='uzsuTimeMaxMinInput uzsuTimeMin'>" +
						"</div>" +
						"<div class='uzsuCell uzsuEvent'>" +
							"<div class='uzsuCellText'>Event</div>" +
							"<select data-mini='true' data-native-menu='false'>" +
								"<option value='sunrise'>" + sv_lang.uzsu.sunrise + "</option>" +
								"<option value='sunset'>" + sv_lang.uzsu.sunset + "</option>" +
							"</select>" +
						"</div>" +
						"<div class='uzsuCell'>" +
							"<div class='uzsuCellText'>+/-" + (this.options.designtype == '0' ? '' : ' min.') +"</div>" +
							"<input type='number' data-clear-btn='false' class='uzsuTimeMaxMinInput uzsuTimeOffsetInput'>" +
						"</div>";
					// Auswahl für Offset in Grad oder Minuten (nur für SmartHomeNG)
					if (this.options.designtype === '0'){
						tt += 	"<div class='uzsuCell'>" +
							"<div class='uzsuCellText'></div>" +
								"<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true' class='uzsuTimeOffsetTypeInput'>" +
									"<label title='Minutes'><input type='radio' name='uzsuTimeOffsetTypeInput"+numberOfRow+"' value='m' checked='checked'>m</label>" +
									"<label title='Degrees of elevation'><input type='radio' name='uzsuTimeOffsetTypeInput"+numberOfRow+"' value=''>°</label>" +
							"</fieldset>" +
						"</div>";
					}
						tt += 	"<div class='uzsuCell'>" +
							"<div class='uzsuCellText'>" + sv_lang.uzsu.latest + "</div>" +
							"<input type='time' data-clear-btn='false' class='uzsuTimeMaxMinInput uzsuTimeMax'>" +
						"</div>" +
						"<div class='uzsuCell'>" +
							"<div class='uzsuCellText'></div>" +
							"<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true'>" +
								"<label><input type='checkbox' class='expertActive uzsuSunActive'>" + sv_lang.uzsu.act + "</label>" +
							"</fieldset>" +
						"</div>" +
					"</div>";
			// hier die Einträge für holiday weekend oder nicht
			if (this.options.designtype === '2'){
				tt += 	"<div class='uzsuRowHoliday' style='float: left;'>" +
							"<div class='uzsuRowHolidayText'>Holiday</div>" +
							"<div class='uzsuCell'>" +
								"<div class='uzsuCellText'>Holiday</div>" +
								"<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true'>" +
									"<label><input type='checkbox' class='expertActive uzsuHolidayWorkday'>!WE</label>" +
				 					"<label><input type='checkbox' class='expertActive uzsuHolidayWeekend'>WE</label>" +
								"</fieldset>" +
							"</div>" +
						"</div>";
			}
			tt+= 	"</div>";
		// und jetzt noch die unsichbare Condition und delayed Exec Zeile
		if(this.options.designtype == '2'){
			tt += 	"<div class='uzsuRowCondition' style='display:none;'>" +
						"<div class='uzsuRowConditionText'>Condition</div>" +
						"<div class='uzsuCell'>" +
							"<div class='uzsuCellText'>Device / String</div>" +
							"<input type='text' data-clear-btn='false' class='uzsuConditionDeviceStringInput'>" +
						"</div>" +
						"<div class='uzsuCell'>" +
							"<div class='uzsuCellText'>Condition Type</div>" +
							"<select data-mini='true' class='uzsuConditionType'>" +
								"<option value='eq'>=</option>" +
								"<option value='<'><</option>" +
								"<option value='>'>></option>" +
								"<option value='>='>>=</option>" +
								"<option value='<='><=</option>" +
								"<option value='ne'>!=</option>" +
								"<option value='String'>String</option>" +
							"</select>" +
						"</div>" +
						"<div class='uzsuCell'>" +
							"<div class='uzsuCellText'>Value</div>" +
							"<input type='text' data-clear-btn='false' class='uzsuConditionValueInput'>" +
						"</div>" +
						"<div class='uzsuCell'>" +
							"<div class='uzsuCellText'></div>" +
							"<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true'>" +
								"<label><input type='checkbox' class='expertActive uzsuConditionActive'>Act</label>" +
							"</fieldset>" +
						"</div>" +
					"</div>";
			// delayed exec zeile
			tt += 	"<div class='uzsuRowDelayedExec' style='display:none;'>" +
						"<div class='uzsuRowDelayedExecText'>DelayedExec</div>" +
						"<div class='uzsuCell'>" +
							"<div class='uzsuCellText'>Device / String</div>" +
							"<input type='text' data-clear-btn='false' class='uzsuDelayedExecDeviceStringInput'>" +
						"</div>" +
						"<div class='uzsuCell'>" +
							"<div class='uzsuCellText'>DelayedExec Type</div>" +
							"<select data-mini='true' class='uzsuDelayedExecType'>" +
								"<option value='eq'>=</option>" +
								"<option value='<'><</option>" +
								"<option value='>'>></option>" +
								"<option value='>='>>=</option>" +
								"<option value='<='><=</option>" +
								"<option value='ne'>!=</option>" +
								"<option value='String'>String</option>" +
							"</select>" +
						"</div>" +
						"<div class='uzsuCell'>" +
							"<div class='uzsuCellText'>Value</div>" +
							"<input type='text' data-clear-btn='false' class='uzsuDelayedExecValueInput'>" +
						"</div>" +
						"<div class='uzsuCell'>" +
							"<div class='uzsuCellText'></div>" +
							"<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true'>" +
								"<label><input type='checkbox' class='expertActive uzsuDelayedExecActive'>Act</label>" +
							"</fieldset>" +
						"</div>" +
					"</div>";
		}
		return tt;
	},

	_uzsuBuildTableFooter: function() {
		var tt = "";
		// Zeileneinträge abschliessen und damit die uzsuTableMain
		tt += "</div>";
		// Aufbau des Footers
			tt += "<div class='uzsuTableFooter'>" +
					"<div class='uzsuRowFooter'>" +
						"<span style='float:right'>" +
							"<div class='uzsuCell'>" +
								"<form>" +
									"<fieldset data-mini='true'>" +
										"<label><input type='checkbox' id='uzsuGeneralActive'>" + sv_lang.uzsu.active + "</label>" +
									"</fieldset>" +
								"</form>" +
							"</div>" +
							"<div class='uzsuCell'>" +
							"<div data-role='controlgroup' data-type='horizontal' data-inline='true' data-mini='true'>" +
								"<button id='uzsuAddTableRow'>" + sv_lang.uzsu.add + "</button>" +
								"<button id='uzsuSortTime'>" + sv_lang.uzsu.sort + "</button>" +
							"</div>" +
						"</div>" +
							"<div class='uzsuCell'>" +
									"<div data-role='controlgroup' data-type='horizontal' data-inline='true' data-mini='true'>" +
										"<button id='uzsuCancel'>" + sv_lang.uzsu.cancel + "</button>" +
										"<button id='uzsuSaveQuit'>" + sv_lang.uzsu.ok + "</button>" +
									"</div>" +
								"</div>" +
							"</div>" +
						"</span>" +
					"</div>";
		// und der Abschluss des uzsuClear als Rahmen für den float:left und des uzsuPopup divs
		tt += "</div></div>";
		return tt;
	},
	
	//----------------------------------------------------------------------------
	// Funktionen für das dynamische Handling der Seiteninhalte des Popups
	//----------------------------------------------------------------------------
	// Setzt die Farbe des Expertenbuttons, je nach dem, ob eine der Optionen aktiv geschaltet wurde
	_uzsuSetExpertColor: function(changedCheckbox){
		var rows = changedCheckbox.parents('.uzsuRowExpHoli, .uzsuRowCondition, .uzsuRowDelayedExec').prevAll('.uzsuRow').first().nextUntil('.uzsuRow').addBack();
		if (rows.find('.expertActive').is(':checked'))
			rows.find('.uzsuCellExpert button').addClass('ui-btn-active');
		else
			rows.find('.uzsuCellExpert button').removeClass('ui-btn-active');
	},
	
	// Toggelt die eingabemöglichkeit für SUN Elemente in Abhängigkeit der Aktivschaltung
	_uzsuSetSunActiveState: function(element){
		// status der eingaben setzen, das brauchen wir an mehreren stellen
		var uzsuRowExpHoli = element.parents('.uzsuRowExpHoli');
		var uzsuTimeCron = uzsuRowExpHoli.prevUntil('.uzsuRowExpHoli').find('.uzsuTimeCron');
		if (uzsuRowExpHoli.find('.uzsuSunActive').is(':checked')){
			uzsuTimeCron.attr('type','input').val(uzsuRowExpHoli.find('.uzsuEvent select').val()).textinput('disable');
		}
		else{
			if(uzsuTimeCron.val().indexOf('sun')===0)
				uzsuTimeCron.attr('type','time').val('00:00');
			uzsuTimeCron.textinput('enable');
		}
	},
	
	_uzsuFillTable: function(response) {
		var self = this;
		// Tabelle füllen. Es werden die Daten aus der Variablen response gelesen und in den Status Darstellung der Widgetblöcke zugewiesen. Der aktuelle Status in dann in der Darstellung enthalten !
		var numberOfEntries = response.list.length;
		// jetzt wird die Tabelle befüllt allgemeiner Status, bitte nicht mit attr, sondern mit prop, siehe	// https://github.com/jquery/jquery-mobile/issues/5587
		$('#uzsuGeneralActive').prop('checked', response.active).checkboxradio("refresh");
		// dann die Werte der Tabelle
		$('.uzsuRow').each(function(numberOfRow) {
			var responseEntry = response.list[numberOfRow];
			uzsuCurrentRows = $(this).nextUntil('.uzsuRow').addBack();

			if(responseEntry.value != null) {
				// beim Schreiben der Daten Unterscheidung, da sonst das Element falsch genutzt wird mit Flipswitch für die bool Variante
				if (self.options.valuetype === 'bool') {
					uzsuCurrentRows.find('.uzsuValueCell select').val(responseEntry.value).flipswitch("refresh");
				}
				// mit int Value für die num Variante
				else if ((self.options.valuetype === 'num') || (self.options.valuetype === 'text')) {
					uzsuCurrentRows.find('.uzsuValueCell input').val(responseEntry.value);
				}
				else if (self.options.valuetype === 'list') {
					uzsuCurrentRows.find('.uzsuValueCell select').val(responseEntry.value).selectmenu('refresh', true);
				}
			}
			// Values in der Zeile setzen
			uzsuCurrentRows.find('.uzsuActive').prop('checked',responseEntry.active).checkboxradio("refresh");
			// hier die conditions, wenn sie im json angelegt worden sind und zwar pro zeile !
			if(self.options.designtype == '2'){
				// Condition
				uzsuCurrentRows.find('.uzsuConditionDeviceStringInput').val(responseEntry.condition.deviceString);
				uzsuCurrentRows.find('select.uzsuConditionType').val(responseEntry.condition.type).selectmenu('refresh', true);
				uzsuCurrentRows.find('.uzsuConditionValueInput').val(responseEntry.condition.value);
				uzsuCurrentRows.find('.uzsuConditionActive').prop('checked',responseEntry.condition.active).checkboxradio("refresh");
				// Delayed Exec Zeile
				uzsuCurrentRows.find('.uzsuDelayedExecDeviceStringInput').val(responseEntry.delayedExec.deviceString);
				uzsuCurrentRows.find('select.uzsuDelayedExecType').val(responseEntry.delayedExec.type).selectmenu('refresh', true);
				uzsuCurrentRows.find('.uzsuDelayedExecValueInput').val(responseEntry.delayedExec.value);
				uzsuCurrentRows.find('.uzsuDelayedExecActive').prop('checked',responseEntry.delayedExec.active).checkboxradio("refresh");
			}
			uzsuCurrentRows.find('.uzsuTimeMin').val(responseEntry.timeMin);
			uzsuCurrentRows.find('.uzsuTimeOffsetInput').val(parseInt(responseEntry.timeOffset));
			if(self.options.designtype == '0') {
				//  name='uzsuTimeOffsetTypeInput'
				uzsuCurrentRows.find('.uzsuTimeOffsetTypeInput').find(':radio').prop('checked', false).checkboxradio("refresh")
					.end().find('[value="'+responseEntry.timeOffsetType+'"]:radio').prop('checked', true).checkboxradio("refresh");
			}
			uzsuCurrentRows.find('.uzsuTimeMax').val(responseEntry.timeMax);
			uzsuCurrentRows.find('.uzsuTimeCron').val(responseEntry.timeCron);
			// und die pull down Menüs richtig, damit die Einträge wieder stimmen und auch der active state gesetzt wird
			if(responseEntry.event === 'time'){
				uzsuCurrentRows.find('.uzsuSunActive').prop('checked',false).checkboxradio("refresh");
			}
			else{
				uzsuCurrentRows.find('.uzsuSunActive').prop('checked',true).checkboxradio("refresh");
				uzsuCurrentRows.find('.uzsuRowExpert .uzsuEvent select').val(responseEntry.event).selectmenu('refresh', true);
			}
			// in der Tabelle die Werte der rrule, dabei gehe ich von dem Standardformat FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR,SA,SU aus und setze für jeden Eintrag den Button.
			var rrule = responseEntry.rrule;
			if (typeof rrule === "undefined") {
				rrule = '';
			}
			var ind = rrule.indexOf('BYDAY');
			// wenn der Standard drin ist
			if (ind > 0) {
				var days = rrule.substring(ind);
				// Setzen der Werte
				uzsuCurrentRows.find('.uzsuWeekday input[type="checkbox"]').each(function(numberOfDay) {
					$(this).prop('checked', days.indexOf($(this).val()) > 0).checkboxradio("refresh");
				});
			}
			// jetzt die holiday themem für fhem
			if(self.options.designtype == '2'){
				uzsuCurrentRows.find('.uzsuHolidayWorkday').prop('checked', responseEntry.holiday.workday).checkboxradio("refresh");
				uzsuCurrentRows.find('.uzsuHolidayWeekend').prop('checked', responseEntry.holiday.weekend).checkboxradio("refresh");
			}
			// Fallunterscheidung für den Expertenmodus
			self._uzsuSetSunActiveState(uzsuCurrentRows.find('.uzsuRowExpert .uzsuEvent select'));
			self._uzsuSetExpertColor(uzsuCurrentRows.find('.expertActive').first());
		});
	},
	
	_uzsuSaveTable: function(item, response, saveSmarthome) {
		var self = this;
		// Tabelle auslesen und speichern
		var numberOfEntries = response.list.length;
		// hier werden die Daten aus der Tabelle wieder in die items im Backend zurückgespielt bitte darauf achten, dass das zurückspielen exakt dem der Anzeige enspricht. Gesamthafte Aktivierung
		response.active = $('#uzsuGeneralActive').is(':checked');
		// Einzeleinträge
		$('.uzsuRow').each(function(numberOfRow) {
			var responseEntry = response.list[numberOfRow];
			uzsuCurrentRows = $(this).nextUntil('.uzsuRow').addBack();
			responseEntry.value = uzsuCurrentRows.find('.uzsuValueCell select, .uzsuValueCell input').val();
			responseEntry.active = uzsuCurrentRows.find('.uzsuActive').is(':checked');
			// hier die conditions, wenn im json angelegt
			if(self.options.designtype == '2'){
				// conditions
				responseEntry.condition.deviceString = uzsuCurrentRows.find('.uzsuConditionDeviceStringInput').val();
				responseEntry.condition.type = uzsuCurrentRows.find('select.uzsuConditionType').val();
				responseEntry.condition.value = uzsuCurrentRows.find('.uzsuConditionValueInput').val();
				responseEntry.condition.active = uzsuCurrentRows.find('.uzsuConditionActive').is(':checked');
				// deleayed exec
				responseEntry.delayedExec.deviceString = uzsuCurrentRows.find('.uzsuDelayedExecDeviceStringInput').val();
				responseEntry.delayedExec.type = uzsuCurrentRows.find('select.uzsuDelayedExecType').val();
				responseEntry.delayedExec.value = uzsuCurrentRows.find('.uzsuDelayedExecValueInput').val();
				responseEntry.delayedExec.active = uzsuCurrentRows.find('.uzsuDelayedExecActive').is(':checked');
			}
			responseEntry.timeMin = uzsuCurrentRows.find('.uzsuTimeMin').val();
			responseEntry.timeOffset = uzsuCurrentRows.find('.uzsuTimeOffsetInput').val();
			if(self.options.designtype == '0'){
				responseEntry.timeOffsetType = uzsuCurrentRows.find('.uzsuTimeOffsetTypeInput :radio:checked').val();
			}
			responseEntry.timeMax = uzsuCurrentRows.find('.uzsuTimeMax').val();
			responseEntry.timeCron = uzsuCurrentRows.find('.uzsuTimeCron').val();
			// event etwas komplizierter, da übergangslösung
			if(uzsuCurrentRows.find('.uzsuSunActive').is(':checked')){
				responseEntry.event = uzsuCurrentRows.find('.uzsuEvent select').val();
			}
			else{
				responseEntry.event = 'time';
			}
			// in der Tabelle die Werte der rrule, dabei gehe ich von dem Standardformat FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR,SA,SU aus und setze für jeden Eintrag den Button. Setzen der Werte.
			var first = true;
			var rrule = '';
			uzsuCurrentRows.find('.uzsuWeekday input[type="checkbox"]').each(function(numberOfDay) {
				if ($(this).is(':checked')) {
					if (first) {
						first = false;
						rrule = 'FREQ=WEEKLY;BYDAY=' + $(this).val();
					}
					else {
						rrule += ',' + $(this).val();
					}
				}
			});
			responseEntry.rrule = rrule;
			// jetzt die holiday themem für fhem
			if(self.options.designtype === '2'){
				responseEntry.holiday.workday = uzsuCurrentRows.find('.uzsuHolidayWorkday').is(':checked');
				responseEntry.holiday.weekend = uzsuCurrentRows.find('.uzsuHolidayWeekend').is(':checked');
			}
		});
		// über json Interface / Treiber herausschreiben
		if (saveSmarthome) {
			this._uzsuCollapseTimestring(response);
			io.write(item, {active : response.active,list : response.list});
		}
	},
	_uzsuCollapseTimestring: function(response){
		$.each(response.list, function(numberOfEntry, entry) {
			// zeitstring wieder zusammenbauen, falls Event <> 'time', damit wir den richtigen Zusammenbau im zeitstring haben
			if(entry.event === 'time'){
				// wenn der eintrag time ist, dann kommt die zeit rein
				entry.time = entry.timeCron;
			}
			else{
				// ansonsten wird er aus den Bestandteilen zusammengebaut
				entry.time = '';
				if(entry.timeMin.length > 0){
					entry.time += entry.timeMin + '<';
				}
				entry.time += entry.event;
				if(entry.timeOffset > 0){
					entry.time += '+' + entry.timeOffset + (entry.timeOffsetType == undefined ? '' : entry.timeOffsetType);
				}
				else if(entry.timeOffset < 0){
					entry.time += entry.timeOffset + (entry.timeOffsetType == undefined ? '' : entry.timeOffsetType);
				}
				if(entry.timeMax.length > 0){
					entry.time += '<' + entry.timeMax;
				}
			}
		});
	},		
	//----------------------------------------------------------------------------
	// Funktionen für das Erweitern und Löschen der Tabelleneinträge
	//----------------------------------------------------------------------------
	_uzsuAddTableRow: function(response) {
		// Tabellenzeile einfügen
		// alten Zustand mal in die Liste rein. da der aktuelle Zustand ja nur im Widget selbst enthalten ist, wird er vor dem Umbau wieder in die Variable response zurückgespeichert.
		this._uzsuSaveTable(1, response, false);
		// ich hänge immer an die letzte Zeile dran ! erst einmal das Array erweitern
		response.list.push({active:false,rrule:'',time:'00:00',value:null,event:'time',timeMin:'',timeMax:'',timeCron:'00:00',timeOffset:'',timeOffsetType:'m',condition:{deviceString:'',type:'String',value:'',active:false},delayedExec:{deviceString:'',type:'String',value:'',active:false},holiday:{workday:false,weekend:false}});
		// dann eine neue HTML Zeile genenrieren
		tt = this._uzsuBuildTableRow(response.list.length);
		// Zeile in die Tabelle einbauen
		$(tt).appendTo('#uzsuTable').enhanceWithin();
		// und Daten ausfüllen. hier werden die Zeile wieder mit dem Status beschrieben. Status ist dann wieder im Widget
		this._uzsuFillTable(response);
		// nach unten scrollen
		$("#uzsuTable").scrollTop(function() { return this.scrollHeight; });
	},
	
	_uzsuDelTableRow: function(response, e) {
		// Zeile und Zeilennummer heraus finden
		var row = $(e.currentTarget).closest('.uzsuRow');
		var numberOfRowToDelete = row.parent().find('.uzsuRow').index(row);
		// Daten aus der Liste löschen
		response.list.splice(numberOfRowToDelete, 1);
		// Die entsprechende Zeile inkl. den nachfolgenden Expertenzeilen aus dem DOM entfernen
		row.nextUntil('.uzsuRow').addBack().remove();
	},

	//Expertenzeile mit Eingaben auf der Hauptzeile benutzbar machen oder sperren bzw. die Statusupdates in die Zeile eintragen
	_uzsuShowExpertLine: function(e) {
		// erst einmal alle verschwinden lassen
		this._uzsuHideAllExpertLines();
		// Tabellezeile ermitteln, wo augerufen wurde
		var uzsuExpertButton = $(e.currentTarget);
		var row = uzsuExpertButton.closest('.uzsuRow');
		// Zeile anzeigen
		row.nextUntil('.uzsuRow').show();
		// jetzt noch den Button in der Zeile drüber auf arrow up ändern
		uzsuExpertButton.buttonMarkup({ icon: "arrow-u" });
	},
	_uzsuHideAllExpertLines: function() {
		$('.uzsuRowExpHoli, .uzsuRowCondition, .uzsuRowDelayedExec').hide();
		$('.uzsuCellExpert button').buttonMarkup({ icon: "arrow-d" });
	},
	
	//----------------------------------------------------------------------------
	// Funktionen für das Sortrieren der Tabelleneinträge
	//----------------------------------------------------------------------------
	_uzsuSortTime: function(response, e) {
		// erst aus dem Widget zurücklesen, sonst kann nicht im Array sortiert werden (alte daten)
		this._uzsuSaveTable(1, response, false);
		// sortieren der Listeneinträge nach zeit
		response.list.sort(function(a, b) {
			// sort Funktion, wirklich vereinfacht für den speziellen Fall
			// ergänzt um das sunrise und sunset Thema
			var A = a.timeCron.replace(':', '');
			var B = b.timeCron.replace(':', '');
			// Reihenfolge ist erst die Zeiten, dann sunrise, dann sunset
			if(A == 'sunrise') A = '2400';
			if(A == 'sunset') A = '2401';
			if(B == 'sunrise') B = '2400';
			if(B == 'sunset') B = '2401';
			return (A - B);
		});
		// dann die Einträge wieder schreiben
		this._uzsuFillTable(response);
	},
	
	//----------------------------------------------------------------------------
	// Funktionen für den Aufbau des Popups und das Einrichten der Callbacks
	//----------------------------------------------------------------------------
	_uzsuRuntimePopup: function(response, item) {
		var self = this;
		// Steuerung des Popups erst einmal wird der Leeranteil angelegt
		// erst den Header, dann die Zeilen, dann den Footer
		var tt = this._uzsuBuildTableHeader();
		for (var numberOfRow = 0; numberOfRow < response.list.length; numberOfRow++) {
			tt += this._uzsuBuildTableRow(numberOfRow);
		}
		tt += this._uzsuBuildTableFooter();
		// dann hängen wir das an die aktuelle Seite
		var uzsuPopup = $(tt).appendTo(this.element).enhanceWithin().popup().on({
			popupbeforeposition: function(ev, ui) {
				var maxHeight = $(window).height() - 230;
				$(this).find('.uzsuTableMain').css('max-height', maxHeight + 'px').css('overflow-y','auto').css('overflow-x','hidden');
			},
			popupafteropen: function(ev, ui) {
				$(this).popup('reposition', {y: 30})
			},
			popupafterclose: function(ev, ui) {
				$(this).remove();
				$(window).off('resize', self._onresize);
			}
		});
		// dann speichern wir uns für cancel die ursprünglichen im DOM gespeicherten Werte in eine Variable ab
		var responseCancel = jQuery.extend(true, {}, response);
		// dann die Werte eintragen.
		this._uzsuFillTable(response);
		// Popup schliessen mit close rechts oben in der Box oder mit Cancel in der Leiste
		uzsuPopup.find('#uzsuClose, #uzsuCancel').bind('click', function(e) {
			// wenn keine Änderungen gemacht werden sollen (cancel), dann auch im cache die alten Werte
			uzsuPopup.popup('close');
		});
		
		// speichern mit SaveQuit
		uzsuPopup.find('#uzsuSaveQuit').bind('click', function(e) {
			// jetzt wird die Kopie auf das Original kopiert und geschlossen
			self._uzsuSaveTable(item, response, true);
			uzsuPopup.popup('close');
		});
		// Eintrag hinzufügen mit add
		uzsuPopup.find('#uzsuAddTableRow').bind('click', function(e) {
			self._uzsuAddTableRow(response);
		});
		// Eintrag sortieren nach Zeit
		uzsuPopup.find('#uzsuSortTime').bind('click', function(e) {
			self._uzsuSortTime(response);
		});
		// Löschen mit del als Callback eintragen
		uzsuPopup.delegate('.uzsuDelTableRow', 'click', function(e) {
			self._uzsuDelTableRow(response, e);
		});
		// call Expert Mode
		uzsuPopup.delegate('.uzsuCellExpert button', 'click', function(e) {
			if($(this).hasClass('ui-icon-arrow-u'))
				self._uzsuHideAllExpertLines();
			else
				self._uzsuShowExpertLine(e);
		});
		// Handler, um den expert button Status zu setzen
		uzsuPopup.delegate('input.expertActive', 'change', function (){
			self._uzsuSetExpertColor($(this));
		});
		// Handler, um den Status anhand des Pulldowns SUN zu setzen
		uzsuPopup.delegate('.uzsuRowExpert .uzsuEvent select, input.uzsuSunActive', 'change', function (){
			self._uzsuSetSunActiveState($(this));
		});

		// hier wir die aktuelle Seite danach durchsucht, wo das Popup ist und im folgenden das Popup initialisiert, geöffnet und die schliessen
		// Funktion daran gebunden. Diese entfernt wieder das Popup aus dem DOM Baum nach dem Schliessen mit remove
		uzsuPopup.popup('open');//.css({ position: 'fixed', top: '30px' });
	}

});