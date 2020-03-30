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

    var clickpreventer = $('<div style="position: absolute; width: 3px; height: 3px;">')
    .on('click', function(event) {
      if (!$(this).closest('[data-bind="' + id + '"]').data('access')) {
        codepad.popup('open');
        codepad.find('input').val('').focus();
        codepad.data('originally-clicked', $(this).parent());
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    });

    $('[data-bind="' + id + '"]')
    .on('mouseenter', function(event) {
      clickpreventer.appendTo(this)
      .css({
        left: parseInt(event.pageX - clickpreventer.offsetParent().offset().left)-1,
        top:  parseInt(event.pageY - clickpreventer.offsetParent().offset().top)-1,
        zIndex: Number($(this).css('zIndex'))+1
      });
    })
    .on('mousemove', '*', function(event) {
      clickpreventer.appendTo(this)
      .css({
        left: parseInt(event.pageX - clickpreventer.offsetParent().offset().left)-1,
        top:  parseInt(event.pageY - clickpreventer.offsetParent().offset().top)-1,
        zIndex: Number($(this).css('zIndex'))+1
      });
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


// ----- device.roofwindow ------------------------------------------------------
$.widget("sv.device_roofwindow", $.sv.widget, {

	initSelector: 'div[data-widget="device.roofwindow"]',

	options: {
		min: 0,
		max: 255,
		step: 5,
	},

	_getVal: function(event) {
		var min = this.options.min;
		var max = this.options.max;
		var step = this.options.step;

		var offset = $(event.currentTarget).offset();
		var y = event.pageY - offset.top;
		return max - Math.floor(y / $(event.currentTarget).outerHeight() * (max - min) / step) * step;
	},

	_events: {
		'click .pos': function (event) {
			this._write(this._getVal(event));
		},

		'mouseenter .pos': function (event) {
			this.element.find('.control').fadeIn(400);
		},

		'mouseleave .pos': function (event) {
			this.element.find('.control').fadeOut(400);
		},

		'mousemove .pos': function (event) {
			$(event.currentTarget).attr('title', this._getVal(event));
		}
	}

});

  // ----- device.uzsu ----------------------------------------------------------
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
  //     jQuery Mobile runtime popup
  //     16. November 2012 · 0 Comments
  //     http://johnchacko.net/?p=44
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
  //         {   "active"   : bool,
  //          "list"     :           Liste von einträgen mit schaltzeiten
  //          [  "active"  :false,      Ist der einzelne Eintrag darin aktiv ?
  //            "rrule"    :'',      Wochen / Tag Programmstring
  //            "time"    :'00:00',    Uhrzeitstring des Schaltpunktes / configuration
  //            "value"    :0,        Wert, der gesetzt wird
  //            "event":  'time',      Zeitevent (time) oder SUN (sunrise oder sunset)
  //            "timeMin"  :'',      Untere Schranke SUN
  //            "timeMax"  :'',      Oberere Schranke SUN
  //            "timeCron"  :'00:00',    Schaltzeitpunkt
  //            "timeOffset":''        Offset für Schaltzeitpunkt
  //            "timeOffsetType":'m'        'm' = Offset in Minuten, '' Offset in Höhengrad (Altitude)
  //            "condition"  :   {  Ein Struct für die Verwendung mit conditions (aktuell nur FHEM), weil dort einige Option mehr angeboten werden
  //                      "deviceString"  : text  Bezeichnung des Devices oder Auswertestring
  //                      "type"      : text  Auswertetype (logische Verknüpfung oder Auswahl String)
  //                      "value"      : text  Vergleichwert
  //                      "active"    : bool  Aktiviert ja/nein
  //                    }
  //            "delayedExec":   {  Ein Struct für die Verwendung mit delayed exec (aktuell nur FHEM), weil dort einige Option mehr angeboten werden
  //                      "deviceString"  : text  Bezeichnung des Devices oder Auswertestring
  //                      "type"      : text  Auswertetype (logische Verknüpfung oder Auswahl String)
  //                      "value"      : text  Vergleichwert
  //                      "active"    : bool  Aktiviert ja/nein
  //                    }
  //            "holiday":    {
  //                      "workday"  : bool  Aktiviert ja/nein
  //                      "weekend"   : bool  Aktiviert ja/nein
  //                    }
  //          ]
  //        }

// Base widget for devie_uzsuicon and device_uzsugraph
$.widget("sv.device_uzsu", $.sv.widget, {

  _create: function() {
    this._super();
    this.options.designtype = String(this.options.designtype);
    if(this.options.designtype === undefined || this.options.designtype === '') {
      this.options.designtype = io.uzsu_type;
    }
  },

  _update: function(response) {
    // data-item ist der sh.py item, in dem alle Attribute lagern, die für die Steuerung notwendig ist ist ja vom typ dict. das item, was tatsächlich per
    // Schaltuhr verwendet wird ist nur als attribut (child) enthalten und wird ausschliesslich vom Plugin verwendet. wird für das rückschreiben der Daten an smarthome.py benötigt

    // wenn keine Daten vorhanden, dann ist kein item mit den eigenschaften hinterlegt und es wird nichts gemacht
    if (response.length === 0){
      notify.error("UZSU widget", "No UZSU data available in item '" + this.options.item + "' for widget " + this.options.id + ".");
      return;
    }

    this._uzsudata = jQuery.extend(true, {}, response[0]);

    // Initialisierung zunächst wird festgestellt, ob Item mit Eigenschaft vorhanden. Wenn nicht: active = false
    // ansonsten ist der Status von active gleich dem gesetzten Status
    if (!(this._uzsudata.list instanceof Array)) {
      this._uzsudata = { active: false, list: [] };
    }
  },

  _uzsuBuildTableHeader: function() {
    // Kopf und überschrift des Popups
    var tt = "";
    // hier kommt der Popup Container mit der Beschreibung ein Eigenschaften
    tt +=   "<div data-role='popup' data-overlay-theme='b' data-theme='a' class='messagePopup' id='uzsuPopupContent' data-dismissible = 'false' data-history='false' data-position-to='window'>" +
          "<button data-rel='back' data-icon='delete' data-iconpos='notext' class='ui-btn-right' id='uzsuClose'></button>" +
          "<div class='uzsuClear'>" +
            "<div class='uzsuPopupHeader'>" + this.options.headline + "</div>" +
            "<div class='uzsuTableMain' id='uzsuTable'>";
    return tt;
  },

  _uzsuBuildTableRow: function(numberOfRow) {
    // default Werte setzen fuer valueParameterList
    var valueType = this.options.valuetype;
    var valueParameterList = this.options.valueparameterlist.explode();
    if(valueParameterList.length === 0){
      if(valueType === 'bool') valueParameterList = ['On','Off'];
      else if (valueType === 'num') valueParameterList = [''];
      else if (valueType === 'text') valueParameterList = [''];
      else if (valueType === 'list') valueParameterList = [''];
    }
    // Tabelleneinträge
    var tt = "";

    tt +=   "<div class='uzsuRow'>" +
          "<div class='uzsuCell'>" +
            "<div class='uzsuCellText'>" + sv_lang.uzsu.weekday + "</div>" +
              "<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true' class='uzsuWeekday'>";
              // rrule Wochentage (ist eine globale Variable von SV, Sonntag hat index 0 deshalb Modulo 7)
              var daydate = new Date(0);
              $.each([ 'MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU' ], function(index, value) {
                daydate.setDate(5 + index); // Set date to one on according weekday (05.01.1970 was a monday)
                tt += "<label title='" + daydate.transUnit('l') + "'><input type='checkbox' value='" + value + "'>" + daydate.transUnit('D') + "</label>";
              });
    tt +=      "</fieldset>" +
            "</div>";

    tt +=   "<div class='uzsuCell uzsuValueCell'>" +
          "<div class='uzsuCellText'>" + sv_lang.uzsu.value + "</div>";
    if (this.options.valuetype === 'bool') {
      // Unterscheidung Anzeige und Werte
      if (valueParameterList[0].split(':')[1] === undefined) {
        tt += "<select data-role='flipswitch'>" +
                "<option value='0'>" + valueParameterList[1] + "</option>" +
                "<option value='1'>"  + valueParameterList[0] + "</option>" +
              "</select>";
      }
      else {
        tt += "<select data-role='flipswitch'>" +
                "<option value='" + valueParameterList[1].split(':')[1]  + "'>" + valueParameterList[1].split(':')[0] + "</option>" +
                "<option value='" + valueParameterList[0].split(':')[1]  + "'>" + valueParameterList[0].split(':')[0] + "</option>" +
              "</select>";
      }
    }
    else if (this.options.valuetype === 'num') {
      var addedclass = (parseFloat(valueParameterList[0]) < 0) ? "" : " positivenumbers";
      tt +=   "<input type='number' min='" + parseFloat(valueParameterList[0]) + "' max='" + parseFloat(valueParameterList[1]) + "' step='" + parseFloat(valueParameterList[2]) + "' data-clear-btn='false' class='uzsuValueInput" + addedclass + "' pattern='[0-9]*'>";
    }
    else if (this.options.valuetype === 'text') {
      tt +=   "<input type='text' data-clear-btn='false' class='uzsuTextInput'>";
    }
    else if (this.options.valuetype === 'list') {
      // das Listenformat mit select ist sehr umfangreich nur einzubauen.
      tt +=   "<select data-mini='true'>";
              for (var numberOfListEntry = 0; numberOfListEntry < valueParameterList.length; numberOfListEntry++) {
                // Unterscheidung Anzeige und Werte
                if (valueParameterList[0].split(':')[1] === undefined) {
                  tt += "<option value='" + valueParameterList[numberOfListEntry].split(':')[0]  + "'>"+ valueParameterList[numberOfListEntry].split(':')[0]  + "</option>";
                }
                else {
                  tt += "<option value='" + valueParameterList[numberOfListEntry].split(':')[1]  + "'>"+ valueParameterList[numberOfListEntry].split(':')[0]  + "</option>";
                }
              }
      tt +=   "</select>";
    }
    tt+=  "</div>"
    tt+=  "<div class='uzsuCell'>" +
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
    tt +=   "</div>";
    // und jetzt noch die unsichtbare Expertenzeile
    tt +=   "<div class='uzsuRowExpHoli' style='display:none;'>" +
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
          if (this.options.designtype == '0'){
            tt +=   "<div class='uzsuCell'>" +
              "<div class='uzsuCellText'></div>" +
                "<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true' class='uzsuTimeOffsetTypeInput'>" +
                  "<label title='Minutes'><input type='radio' name='uzsuTimeOffsetTypeInput"+numberOfRow+"' value='m' checked='checked'>m</label>" +
                  "<label title='Degrees of elevation'><input type='radio' name='uzsuTimeOffsetTypeInput"+numberOfRow+"' value=''>°</label>" +
              "</fieldset>" +
            "</div>";
          }
            tt +=   "<div class='uzsuCell'>" +
              "<div class='uzsuCellText'>" + sv_lang.uzsu.latest + "</div>" +
              "<input type='time' data-clear-btn='false' class='uzsuTimeMaxMinInput uzsuTimeMax'>" +
            "</div>" +
            "<div class='uzsuCell'>" +
              "<div class='uzsuCellText'></div>" +
              "<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true'>" +
                "<label><input type='checkbox' class='expertActive uzsuSunActive'>" + sv_lang.uzsu.act + "</label>" +
              "</fieldset>" +
            "</div>";
            // UZSU Interpolation
            if(sv_lang.uzsu.interpolation && this.hasInterpolation){
              tt +=   "<div class='uzsuCell'>" +
                "<div class='uzsuCellText'>" + sv_lang.uzsu.calculated + "</div>" +
                "<div data-tip='" + sv_lang.uzsu.calculatedtip + "'>" +
                "<input type='time' data-clear-btn='false' class='uzsuTimeMaxMinInput uzsuCalculated' disabled>" +
                "</div>" +
              "</div>";
            }
          tt += "</div>";
      // hier die Einträge für holiday weekend oder nicht
      if (this.options.designtype == '2'){
        tt +=   "<div class='uzsuRowHoliday' style='float: left;'>" +
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
      tt+=   "</div>";

    // und jetzt noch die unsichbare Condition und delayed Exec Zeile
    if(this.options.designtype == '2'){
      tt +=   "<div class='uzsuRowCondition' style='display:none;'>" +
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
      tt +=   "<div class='uzsuRowDelayedExec' style='display:none;'>" +
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

  _uzsuFillTableRow: function(responseEntry, tableRow) {
    var self = this;
    // dann die Werte einer Tabellenzeile füllen

    uzsuCurrentRows = $(tableRow).nextUntil('.uzsuRow').addBack();

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
    if(responseEntry.calculated != null) {
      uzsuCurrentRows.find('.uzsuCalculated').val(responseEntry.calculated);
    }
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
    var uzsuCalc = uzsuRowExpHoli.find('.uzsuCalculated').val();
    if (uzsuRowExpHoli.find('.uzsuSunActive').is(':checked')){
      uzsuTimeCron.attr('type','input').val(uzsuRowExpHoli.find('.uzsuEvent select').val()).textinput('disable');
    }
    else{
      if(uzsuTimeCron.val().indexOf('sun')===0)
        uzsuTimeCron.attr('type','time').val((uzsuCalc == undefined || uzsuCalc == '') ? '00:00' : uzsuCalc);
      uzsuTimeCron.textinput('enable');
    }
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

  //Interpolationszeile
  _uzsuShowInterpolationLine: function(e) {

    // erst einmal alle verschwinden lassen
    // this._uzsuHideInterpolationLine();
    // Tabellezeile ermitteln, wo augerufen wurde
    var uzsuInterpolationButton = $(e.currentTarget);
    $('#uzsuRowInterpolation').show();
    // jetzt noch den Button in der Zeile drüber auf arrow up ändern
    uzsuInterpolationButton.buttonMarkup({ icon: "arrow-u" });
  },
  _uzsuHideInterpolationLine: function() {
    $('#uzsuRowInterpolation').hide();
    $('.uzsuCellInterpolation button').buttonMarkup({ icon: "arrow-d" });
  },

  _uzsuSaveTableRow: function(responseEntry, tableRow) {
    var self = this;

    uzsuCurrentRows = $(tableRow).nextUntil('.uzsuRow').addBack();
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
  },

  _uzsuParseAndCheckResponse: function(response) {
    var designType = this.options.designtype;
    var valueType = this.options.valuetype;

    // Fehlerbehandlung für ein nicht vorhandenes DOM Objekt. Das response Objekt ist erst da, wenn es mit update angelegt wurde. Da diese
    // Schritte asynchron erfolgen, kann es sein, dass das Icon bereits da ist, clickbar, aber nocht keine Daten angekommen. Dann darf ich nicht auf diese Daten zugreifen wollen !
    if(response.list === undefined){
      notify.error("UZSU widget", "No UZSU data available in item '" + this.options.item + "' for widget " + this.id + ".");
      return false;
    }

    // jetzt kommt noch die Liste von Prüfungen, damit hinterher keine Fehler passieren, zunächst fehlerhafter designType (unbekannt)
    if ((designType != '0') && (designType != '2')) {
      notify.error("UZSU widget", "Design type '" + designType + "' is not supported in widget " + this.id + ".");
      return false;
    }
    // fehlerhafter valueType (unbekannt)
    if ((valueType !== 'bool') && (valueType !== 'num')  && (valueType !== 'text') && (valueType !== 'list')) {
      notify.error("UZSU widget", "Value type '" + valueType + "' is not supported in widget " + this.id + ".");
      return false;
    }

    // Interpolation für SmartHomeNG setzen
    if(designType == '0') {
      if(response.interpolation === undefined){
        this.hasInterpolation = false
        console.log('UZSU interpolation not available. You have to update the plugin version');
        //response.interpolation = {type:'none',interval:0,initage:0,initialized:false,itemtype:'none'};
      }
      else if(!response.interpolation.itemtype in ['num']) {
        this.hasInterpolation = false
        notify.warn('UZSU interpolation not supported by itemtype');
      }
      else {
        this.hasInterpolation = true
        console.log('UZSU interpolation set to ' + response.interpolation.type);
      }
    }

    //
    // Umsetzung des time parameters in die Struktur, die wir hinterher nutzen wollen
    //
    $.each(response.list, function(numberOfRow, entry) {

      // bei designType '0' wird rrule nach Wochentagen umgewandelt und ein festes Format vorgegegeben hier sollte nichts versehentlich überschrieben werden
      if (designType == '0') {
        // "time" von SmartHomeNG parsen
        var timeParts = (entry.time || "").match(/^((\d{1,2}:\d{1,2})<)?(sunrise|sunset)(([+-]\d+)([m°]?))?(<(\d{1,2}:\d{1,2}))?$/);
        if(timeParts == null) { // entry.time is a plain time string
          entry.event = "time";
          entry.timeCron = entry.time;
          entry.timeMin = "";
          entry.timeMax = "";
          entry.timeOffset = "";
          entry.timeOffsetType = "m";
        }
        else { // entry.time is a sun event
          entry.event = timeParts[3];
          entry.timeCron = '00:00';
          entry.timeMin = timeParts[2];
          entry.timeMax = timeParts[8];
          entry.timeOffset = Number(timeParts[5]);
          entry.timeOffsetType = timeParts[6];
        }
        delete entry.time;

        // test, ob die RRULE fehlerhaft ist
        if (entry.rrule && (entry.rrule.length > 0) && (entry.rrule.indexOf('FREQ=WEEKLY;BYDAY=') !== 0)) {
          if (!confirm("Error: Parameter designType is '0', but saved RRULE string in UZSU '" + entry.rrule + "' does not match default format FREQ=WEEKLY;BYDAY=MO... on item " + this.options.item  + ". Should this entry be overwritten?")) {
            return false;
          }
        }

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

    return true;
  },

  _uzsuCollapseTimestring: function(response){
    var self = this;

    // Clear unused properties for FHEM
    if (self.options.designtype == '2') {
      delete response.interpolation;
    }

    $.each(response.list, function(numberOfEntry, entry) {
      // zeitstring wieder zusammenbauen, falls Event <> 'time', damit wir den richtigen Zusammenbau im zeitstring haben
      if(entry.event === 'time'){
        // wenn der eintrag time ist, dann kommt die zeit rein
        entry.time = entry.timeCron;
      }
      else{
        // ansonsten wird er aus den Bestandteilen zusammengebaut
        entry.time = '';
        if(entry.timeMin != null && entry.timeMin.length > 0){
          entry.time += entry.timeMin + '<';
        }
        entry.time += entry.event;
        if(entry.timeOffset > 0){
          entry.time += '+' + entry.timeOffset + (entry.timeOffsetType == undefined ? '' : entry.timeOffsetType);
        }
        else if(entry.timeOffset < 0){
          entry.time += entry.timeOffset + (entry.timeOffsetType == undefined ? '' : entry.timeOffsetType);
        }
        if(entry.timeMax != null && entry.timeMax.length > 0){
          entry.time += '<' + entry.timeMax;
        }
      }

      // Clear unused properties for SmartHomeNG
      if (self.options.designtype == '0') {
        delete entry.event;
        delete entry.timeCron;
        delete entry.timeMin;
        delete entry.timeMax;
        delete entry.timeOffset;
        delete entry.timeOffsetType;
        delete entry.condition;
        delete entry.delayedExec;
        delete entry.holiday;
      }
      // Clear unused properties for FHEM
      else if (self.options.designtype == '2') {
        //delete entry.time; TODO: unsure if this is used in FHEM or not. if not, the code above does not needto be executed in designType=2
      }

    });
  },

});

  // ----- device.uzsuicon ------------------------------------------------------
  // ----------------------------------------------------------------------------
$.widget("sv.device_uzsuicon", $.sv.device_uzsu, {

  initSelector: '[data-widget="device.uzsuicon"]',

  options: {
    valueparameterlist: null,
    headline: '',
    designtype: '',
    valuetype: 'bool'
  },

  _update: function(response) {
    this._super(response);

    // Das Icon wird aktiviert, falls Status auf aktiv, ansonsten deaktiviert angezeigt. Basiert auf der Implementierung von aschwith
    if(this._uzsudata.active === true) {
      this.element.find('.icon-off').hide();
      this.element.find('.icon-on').show();
    }
    else {
      this.element.find('.icon-on').hide();
      this.element.find('.icon-off').show();
    }
  },

  _events: {
    'click': function(event) {
      // hier werden die Parameter aus den Attributen herausgenommen und beim Öffnen mit .open(....) an das Popup Objekt übergeben
      // und zwar mit deep copy, damit ich bei cancel die ursprünglichen werte nicht überschrieben habe
      var response = jQuery.extend(true, {}, this._uzsudata);

      if (this._uzsuParseAndCheckResponse(response)) {
        // Öffnen des Popups bei clicken des icons und Ausführung der Eingabefunktion
        this._uzsuRuntimePopup(response);
      }
    }
  },

  //----------------------------------------------------------------------------
  // Funktionen für den Seitenaufbau
  //----------------------------------------------------------------------------
  _uzsuBuildTableFooter: function() {

    var tt = "";
    // Zeileneinträge abschliessen und damit die uzsuTableMain
    tt += "</div>";
    // Aufbau des Footers
      tt += "<div class='uzsuTableFooter'>" +
          "<div class='uzsuRowFooter'>" +
            "<span style='float:right'>";
              // UZSU Interpolation
              if(sv_lang.uzsu.interpolation && this.hasInterpolation){
                tt += "<div class='uzsuCellInterpolation' style='float:left;'>" +
                  "<div class='uzsuCellText'>" + sv_lang.uzsu.options + "</div>" +
                  "<button data-mini='true' data-icon='arrow-d' data-iconpos='notext' class='ui-icon-shadow'></button>" +
                "</div>";
              }
              tt+= "<div class='uzsuCell' style='float: left'>" +
                "<form>" +
                  "<fieldset data-mini='true'>" +
                    "<label><input type='checkbox' id='uzsuGeneralActive'>" + sv_lang.uzsu.active + "</label>" +
                  "</fieldset>" +
                "</form>" +
              "</div>" +
              "<div class='uzsuCell' style='float: left'>" +
              "<div data-role='controlgroup' data-type='horizontal' data-inline='true' data-mini='true'>" +
                "<button id='uzsuAddTableRow'>" + sv_lang.uzsu.add + "</button>" +
                "<button id='uzsuSortTime'>" + sv_lang.uzsu.sort + "</button>" +
              "</div>" +
            "</div>" +
              "<div class='uzsuCell' style='float: right'>" +
                  "<div data-role='controlgroup' data-type='horizontal' data-inline='true' data-mini='true'>" +
                    "<button id='uzsuCancel'>" + sv_lang.uzsu.cancel + "</button>" +
                    "<button id='uzsuSaveQuit'>" + sv_lang.uzsu.ok + "</button>" +
                  "</div>" +
                "</div>" +
              "</div>" +
            "</span>";
            if(sv_lang.uzsu.interpolation && this.hasInterpolation){
              tt +=
                "<div id='uzsuRowInterpolation' style='display: none; float: right; margin: 0 15px 5px 0;'>" +
                  "<span style='float:left; margin-right: 12px;'>" +
                    "<div class='uzsuRowExpertText'>" + sv_lang.uzsu.interpolation + "</div>" +
                    "<div class='uzsuCell'>" +
                      "<div class='uzsuCellText'>" + sv_lang.uzsu.interpolation + "</div>" +
                      "<select data-mini='true' data-native-menu='false' id='uzsuInterpolationType'>" +
                        "<option value='none'>" + sv_lang.uzsu.nointerpolation + "</option>" +
                        "<option value='cubic'>" + sv_lang.uzsu.cubic + "</option>" +
                        "<option value='linear'>" + sv_lang.uzsu.linear + "</option>" +
                      "</select>" +
                    "</div>" +
                    "<div class='uzsuCell'>" +
                      "<div class='uzsuCellText'>" + sv_lang.uzsu.intervaltime + "</div>" +
                      "<input type='number' data-clear-btn='false' id='uzsuInterpolationInterval' style='width:50px;' min='0' class='uzsuValueInput positivenumbers'>" +
                    "</div>" +
                  "</span>" +
                  "<span style='float:left; margin-left: 12px;'>" +
                    "<div class='uzsuRowExpertText'>" + sv_lang.uzsu.inittime + "</div>" +
                    "<div class='uzsuCell'>" +
                      "<div class='uzsuCellText'>" + sv_lang.uzsu.inittime_header + "</div>" +
                      "<input type='number' data-clear-btn='false' id='uzsuInitAge' style='width:50px;' min='0' class='uzsuValueInput positivenumbers'>" +
                      "<div class='uzsuCellText' style='visibility:hidden'><label><input type='checkbox' id='uzsuInitialized'>Init</label></div>" +
                    "</div>" +
                  "</span>" +
                "</div>";
              }
            tt +=
          "</div>";
    // und der Abschluss des uzsuClear als Rahmen für den float:left und des uzsuPopup divs
    tt += "</div></div>";
    return tt;
  },

  _uzsuFillTable: function(response) {
    var self = this;
    // Tabelle füllen. Es werden die Daten aus der Variablen response gelesen und in den Status Darstellung der Widgetblöcke zugewiesen. Der aktuelle Status in dann in der Darstellung enthalten !
    var numberOfEntries = response.list.length;
    // jetzt wird die Tabelle befüllt allgemeiner Status, bitte nicht mit attr, sondern mit prop, siehe  // https://github.com/jquery/jquery-mobile/issues/5587
    // INTERPOLATION
    if(this.hasInterpolation) {
      $('#uzsuInterpolationType').val(response.interpolation.type).selectmenu("refresh", true);
      $('#uzsuInterpolationInterval').val(response.interpolation.interval);
      $('#uzsuInitAge').val(response.interpolation.initage);
      $('#uzsuInitialized').prop('checked', response.interpolation.initialized).checkboxradio("refresh");
    }
    $('#uzsuGeneralActive').prop('checked', response.active).checkboxradio("refresh");
    // dann die Werte der Tabelle
    $('.uzsuRow').each(function(numberOfRow, tableRow) {
      var responseEntry = response.list[numberOfRow];
      self._uzsuFillTableRow(responseEntry, tableRow);
    });
    // Verhindern negativer Zahleneingabe
    $('.positivenumbers').keypress(function(evt){
        var charCode = (evt.which) ? evt.which : event.keyCode;
        return !(charCode > 31 && (charCode < 48 || charCode > 57));
    });
  },

  _uzsuSaveTable: function(response, saveSmarthome) {
    var self = this;
    // Tabelle auslesen und speichern
    var numberOfEntries = response.list.length;
    // hier werden die Daten aus der Tabelle wieder in die items im Backend zurückgespielt bitte darauf achten, dass das zurückspielen exakt dem der Anzeige enspricht. Gesamthafte Aktivierung
    response.active = $('#uzsuGeneralActive').is(':checked');
    // Interpolation
    if(this.hasInterpolation) {
      response.interpolation.type = $('#uzsuInterpolationType').val();
      response.interpolation.interval = $('#uzsuInterpolationInterval').val();
      response.interpolation.initage = $('#uzsuInitAge').val();
      response.interpolation.initialized = $('#uzsuInitialized').is(':checked');
    }
    // Einzeleinträge
    $('.uzsuRow').each(function(numberOfRow, tableRow) {
      var responseEntry = response.list[numberOfRow];
      self._uzsuSaveTableRow(responseEntry, tableRow);
    });
    // über json Interface / Treiber herausschreiben
    if (saveSmarthome) {
      this._uzsuCollapseTimestring(response);
      this._write(response);
    }
  },

  //----------------------------------------------------------------------------
  // Funktionen für das Erweitern und Löschen der Tabelleneinträge
  //----------------------------------------------------------------------------
  _uzsuAddTableRow: function(response) {
    // Tabellenzeile einfügen
    // alten Zustand mal in die Liste rein. da der aktuelle Zustand ja nur im Widget selbst enthalten ist, wird er vor dem Umbau wieder in die Variable response zurückgespeichert.
    this._uzsuSaveTable(response, false);
    // ich hänge immer an die letzte Zeile dran ! erst einmal das Array erweitern
    response.list.push({active:false,rrule:'',value:null,event:'time',timeMin:'',timeMax:'',timeCron:'00:00',timeOffset:'',timeOffsetType:'m',condition:{deviceString:'',type:'String',value:'',active:false},delayedExec:{deviceString:'',type:'String',value:'',active:false},holiday:{workday:false,weekend:false}});
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

  //----------------------------------------------------------------------------
  // Funktionen für das Sortrieren der Tabelleneinträge
  //----------------------------------------------------------------------------
  _uzsuSortTime: function(response, e) {
    // erst aus dem Widget zurücklesen, sonst kann nicht im Array sortiert werden (alte daten)
    this._uzsuSaveTable(response, false);
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
  _uzsuRuntimePopup: function(response) {
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
      self._uzsuSaveTable(response, true);
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
    // call Interpolation Mode
    uzsuPopup.delegate('.uzsuCellInterpolation button', 'click', function(e) {
      if($(this).hasClass('ui-icon-arrow-u'))
        self._uzsuHideInterpolationLine();
      else
        self._uzsuShowInterpolationLine(e);
    });

    // hier wir die aktuelle Seite danach durchsucht, wo das Popup ist und im folgenden das Popup initialisiert, geöffnet und die schliessen
    // Funktion daran gebunden. Diese entfernt wieder das Popup aus dem DOM Baum nach dem Schliessen mit remove
    uzsuPopup.popup('open');//.css({ position: 'fixed', top: '30px' });
  }

});

// ----- device.uzsugraph -----------------------------------------------------
// ----------------------------------------------------------------------------
$.widget("sv.device_uzsugraph", $.sv.device_uzsu, {

  initSelector: '[data-widget="device.uzsugraph"]',

  options: {
    valueparameterlist: null,
    headline: '',
    designtype: '',
    valuetype: 'bool',
    editable: false
  },

  rruleDays: {
    'MO': 0,
    'TU': 1,
    'WE': 2,
    'TH': 3,
    'FR': 4,
    'SA': 5,
    'SU': 6
  },

  _startTimestamp: 4*1000*60*60*24 + new Date(0).getTimezoneOffset()*1000*60,

  _create: function() {
    this._super();

    var self = this;

    // init data (used if no update follows because item does not exist yet)
    this._uzsudata = { active : true, list : [] }

    this.options.designtype = String(this.options.designtype);
    if(this.options.designtype === undefined || this.options.designtype === '') {
      this.options.designtype = io.uzsu_type;
    }

    var valueParameterList = this.options.valueparameterlist.explode();
    if(valueParameterList.length === 0){
      if(this.options.valuetype === 'bool') valueParameterList = ['1', '0', '1'];
      else if (this.options.valuetype === 'num') valueParameterList = [''];
      else if (this.options.valuetype === 'list') valueParameterList = [''];
    }

    var min = null, max = null, step = 1;
    if(this.options.valuetype === 'bool') {
      if(valueParameterList.length === 0)
        valueParameterList = ['0', '1'];
      min = parseFloat(valueParameterList[1].split(':')[1] !== undefined ? valueParameterList[1].split(':')[1] : valueParameterList[1]);
      max = parseFloat(valueParameterList[0].split(':')[1] !== undefined ? valueParameterList[0].split(':')[1] : valueParameterList[0]);
      step = 1;
    }
    if(this.options.valuetype === 'num') {
      if(valueParameterList.length === 0)
        valueParameterList = []
      min = parseFloat(valueParameterList[0]);
      max = parseFloat(valueParameterList[1]);
      step = parseFloat(valueParameterList[2]) || 1;
    }

    var timeStep = 1000*60*5; // round to 5 minutes

    // Highcharts symbols for sunrise and sunset
    Highcharts.SVGRenderer.prototype.symbols.sunrise = function (x, y, w, h) {
      var wt = w/300, ht = h/300;
      var xt = x-20*wt, yt = y-20*ht-120*ht;
      return [
        'M',xt+ 79*wt,yt+267*ht,'h',   -4*wt,      'c',-3*wt,0   ,-5*wt, 2*ht,-5*wt, 5*ht,    'c',0,3*ht,2*wt,5*ht,5*wt,5*ht,'h',  4*wt,       'c', 3*wt, 0   ,  5*wt, -2*ht,  5*wt, -5*ht,                                    'c',0,-3*ht,-2*wt,-5*ht,-5*wt,-5*ht,'z',
        'M',xt+232*wt,yt+267*ht,'h',  -48*wt,      'c',-7*wt,0   ,-7*wt,10*ht, 0   ,10*ht,                                   'h', 48*wt,       'c', 7*wt, 0   ,  7*wt,-10*ht,  0   ,-10*ht,                                    'z',
        'M',xt+ 72*wt,yt+217*ht,'l',   18*wt,19*ht,'c', 5*wt,5*ht,12*wt,-3*ht, 8*wt,-7*ht,                                   'l',-19*wt,-19*ht,'c',-5*wt,-4*ht,-12*wt,  3*ht, -7*wt,  7*ht,                                    'z',
        'M',xt+127*wt,yt+172*ht,'v',   49*ht,      'c', 0   ,6*ht,10*wt, 6*ht,10*wt, 0*ht,                                   'v',-49*ht,       'c', 0   ,-7*ht,-10*wt, -7*ht,-10*wt,  0   ,                                    'z',
        'M',xt+201*wt,yt+194*ht,'l',  -34*wt,35*ht,'c',-5*wt,4*ht, 2*wt,12*ht, 7*wt, 7*ht,                                   'l', 34*wt,-35*ht,'c', 5*wt,-4*ht, -2*wt,-11*ht, -7*wt, -7*ht,                                    'z',
        'M',xt+195*wt,yt+239*ht,'l',  -14*wt, 5*ht,'c',-2*wt,1*ht,-4*wt, 4*ht,-3*wt, 7*ht,0   , 2*ht, 3*wt, 4*ht, 6*wt, 3*ht,'l', 14*wt, -6*ht,'c', 2*wt,-1*ht,  4*wt, -3*ht,  3*wt, -6*ht, 0   ,-2*ht,-3*wt,-4*ht,-6*wt,-3*ht,'z',
        'M',xt+154*wt,yt+206*ht,'l',   -6*wt,14*ht,'c',-1*wt,3*ht, 1*wt, 6*ht, 4*wt, 6*ht,2*wt, 1*ht, 5*wt,-1*ht, 6*wt,-3*ht,'l',  5*wt,-14*ht,'c', 1*wt,-2*ht, -1*wt, -5*ht, -3*wt, -6*ht,-3*wt,-1*ht,-5*wt, 1*ht,-6*wt, 3*ht,'z',
        'M',xt+101*wt,yt+209*ht,'l',    6*wt,14*ht,'c', 1*wt,2*ht, 3*wt, 4*ht, 6*wt, 3*ht,3*wt, 0   , 5*wt,-3*ht, 4*wt,-6*ht,'l', -6*wt,-14*ht,'c',-1*wt,-2*ht, -3*wt, -4*ht, -6*wt, -3*ht,                                    's',-5*wt,4*ht,-4*wt,6*ht,'z',
        'M',xt+286*wt,yt+281*ht,'H',xt+75*wt,      'c',-7*wt,0   ,-7*wt,10*ht, 0   ,10*ht,                                   'h',211*wt,       'c', 7*wt, 0   ,  7*wt,-10*ht,  0*wt,-10*ht,                                    'z',
        'M',xt+ 74*wt,yt+252*ht,'l',    8*wt, 4*ht,'c', 2*wt,1*ht, 5*wt,-1*ht, 6*wt,-4*ht,0   ,-3*ht,-1*wt,-5*ht,-4*wt,-6*ht,'l', -8*wt, -3*ht,'c',-2*wt,-1*ht, -5*wt,  1*ht, -6*wt,  3*ht,-1*wt, 3*ht, 1*wt, 5*ht, 4*wt, 6*ht,'z',
        'M',xt+ 94*wt,yt+280*ht,'v',  -29*ht,      'c', 0   ,-11*ht,9*wt,-20*ht,20*wt,-20*ht,                                'h', 35*wt,       'c',11*wt, 0   , 20*wt,  9*ht, 20*wt, 20*ht,                                    'v',29*ht
      ];
    };
    Highcharts.SVGRenderer.prototype.symbols.sunset = function (x, y, w, h) {
      var wt = w/300, ht = h/300;
      var xt = x-20*wt+w*1.1, yt = y-20*ht-120*ht;
      return [
        'M',xt+ wt-(79*wt),yt+267*ht,'h',   wt-(-4*wt),      'c',wt-(-3*wt),0   ,wt-(-5*wt), 2*ht,wt-(-5*wt), 5*ht,    'c',0,3*ht,wt-(2*wt),5*ht,wt-(5*wt),5*ht,'h',  wt-(4*wt),       'c', wt-(3*wt), 0   ,  wt-(5*wt), -2*ht,  wt-(5*wt), -5*ht,                                    'c',0,-3*ht,wt-(-2*wt),-5*ht,wt-(-5*wt),-5*ht,'z',
        'M',xt+wt-(232*wt),yt+267*ht,'h',  wt-(-48*wt),      'c',wt-(-7*wt),0   ,wt-(-7*wt),10*ht, 0   ,10*ht,                                   'h', wt-(48*wt),       'c', wt-(7*wt), 0   ,  wt-(7*wt),-10*ht,  0   ,-10*ht,                                    'z',
        'M',xt+ wt-(72*wt),yt+217*ht,'l',   wt-(18*wt),19*ht,'c', wt-(5*wt),5*ht,wt-(12*wt),-3*ht, wt-(8*wt),-7*ht,                                   'l',wt-(-19*wt),-19*ht,'c',wt-(-5*wt),-4*ht,wt-(-12*wt),  3*ht, wt-(-7*wt),  7*ht,                                    'z',
        'M',xt+wt-(127*wt),yt+172*ht,'v',      (49*ht),      'c', 0   ,6*ht,wt-(10*wt), 6*ht,wt-(10*wt), 0*ht,                                   'v',(-49*ht),       'c', 0   ,-7*ht,wt-(-10*wt), -7*ht,wt-(-10*wt),  0   ,                                    'z',
        'M',xt+wt-(201*wt),yt+194*ht,'l',  wt-(-34*wt),35*ht,'c',wt-(-5*wt),4*ht, wt-(2*wt),12*ht, wt-(7*wt), 7*ht,                                   'l', wt-(34*wt),-35*ht,'c', wt-(5*wt),-4*ht, wt-(-2*wt),-11*ht, wt-(-7*wt), -7*ht,                                    'z',
        'M',xt+wt-(195*wt),yt+239*ht,'l',  wt-(-14*wt), 5*ht,'c',wt-(-2*wt),1*ht,wt-(-4*wt), 4*ht,wt-(-3*wt), 7*ht,0   , 2*ht, wt-(3*wt), 4*ht, wt-(6*wt), 3*ht,'l', wt-(14*wt), -6*ht,'c', wt-(2*wt),-1*ht,  wt-(4*wt), -3*ht,  wt-(3*wt), -6*ht, 0   ,-2*ht,wt-(-3*wt),-4*ht,wt-(-6*wt),-3*ht,'z',
        'M',xt+wt-(154*wt),yt+206*ht,'l',   wt-(-6*wt),14*ht,'c',wt-(-1*wt),3*ht, wt-(1*wt), 6*ht, wt-(4*wt), 6*ht,wt-(2*wt), 1*ht, wt-(5*wt),-1*ht, wt-(6*wt),-3*ht,'l',  wt-(5*wt),-14*ht,'c', wt-(1*wt),-2*ht, wt-(-1*wt), -5*ht, wt-(-3*wt), -6*ht,wt-(-3*wt),-1*ht,wt-(-5*wt), 1*ht,wt-(-6*wt), 3*ht,'z',
        'M',xt+wt-(101*wt),yt+209*ht,'l',    wt-(6*wt),14*ht,'c', wt-(1*wt),2*ht, wt-(3*wt), 4*ht, wt-(6*wt), 3*ht,wt-(3*wt), 0   , wt-(5*wt),-3*ht, wt-(4*wt),-6*ht,'l', wt-(-6*wt),-14*ht,'c',wt-(-1*wt),-2*ht, wt-(-3*wt), -4*ht, wt-(-6*wt), -3*ht,                                    's',wt-(-5*wt),4*ht,wt-(-4*wt),6*ht,'z',
        'M',xt+wt-(286*wt),yt+281*ht,'H',xt+wt-(75*wt),      'c',wt-(-7*wt),0   ,wt-(-7*wt),10*ht, 0   ,10*ht,                                   'h',wt-(211*wt),       'c', wt-(7*wt), 0   ,  wt-(7*wt),-10*ht,  wt-(0*wt),-10*ht,                                    'z',
        'M',xt+ wt-(74*wt),yt+252*ht,'l',    wt-(8*wt), 4*ht,'c', wt-(2*wt),1*ht, wt-(5*wt),-1*ht, wt-(6*wt),-4*ht,0   ,-3*ht,wt-(-1*wt),-5*ht,wt-(-4*wt),-6*ht,'l', wt-(-8*wt), -3*ht,'c',wt-(-2*wt),-1*ht, wt-(-5*wt),  1*ht, wt-(-6*wt),  3*ht,wt-(-1*wt), 3*ht, wt-(1*wt), 5*ht, wt-(4*wt), 6*ht,'z',
        'M',xt+ wt-(94*wt),yt+280*ht,'v',     (-29*ht),      'c', 0   ,-11*ht,wt-(9*wt),-20*ht,wt-(20*wt),-20*ht,                                'h', wt-(35*wt),       'c',wt-(11*wt), 0   , wt-(20*wt),  9*ht, wt-(20*wt), 20*ht,                                    'v',29*ht
      ];
    };
    if (Highcharts.VMLRenderer) {
      Highcharts.VMLRenderer.prototype.symbols.sunrise = Highcharts.SVGRenderer.prototype.symbols.sunrise;
      Highcharts.VMLRenderer.prototype.symbols.sunset = Highcharts.SVGRenderer.prototype.symbols.sunset;
    }

    // draw the plot
    var chart = this.element.highcharts({
      title: { text: this.options.headline },
      legend: false,
      series: [
        { // active
          name: 'active',
          id: 'active',
          zIndex: 9,
          className: 'uzsu-active',
        },
        { // inactive
          name: 'inactive',
          id: 'inactive',
          zIndex: 8,
          className: 'uzsu-inactive',
          lineWidth: 0,
          type: 'scatter'
        },
        { // sun min/max
          id: 'range',
          zIndex: 2,
          className: 'uzsu-minmax',
          type: 'scatter',
          lineWidth: 2,
          draggableY: false,
          tooltip: {
            headerFormat: '',
            footerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
            pointFormatter: function() { return '<span style="font-size: 10px">'+this.series.chart.time.dateFormat('%a, %H:%M', this.x)+'</span><br/>'; },
          },
          point: {
            events: {
              drop: function (e) {
                self.justDragged = true; // used to prevent click event after drop
                var time = self.element.highcharts().time.dateFormat('%H:%M', e.target.x);
                if(e.target.className == 'uzsu-min')
                  e.target.uzsuEntry.timeMin = time;
                else if(e.target.className == 'uzsu-max')
                  e.target.uzsuEntry.timeMax = time;
                self._save();
              },
              click: null
            }
          },
        },
        { // sunrise & sunset
          name: 'sun',
          id: 'sun',
          zIndex: 1,
          type: 'scatter',
          tooltip: {
            headerFormat: '',
            footerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
            pointFormatter: function() { return '<span style="font-size: 10px">'+this.series.chart.time.dateFormat('%a, %H:%M', this.x)+'</span><br/>'; },
          },
          marker: {
            radius: 16
          },
          draggableY: false,
          point: {
            events: {
              drop: function (e) {
                self.sunTimes[e.target.uzsuEvent] = self.element.highcharts().time.dateFormat('%H:%M', e.target.x);
                self._delay(function() { self.draw() }, 10); // redraw has to be deferred otherwise highcharts draggable plugin throws an exception
              },
              click: null
            }
          }
        }
      ],
      xAxis: {
        type: 'datetime',
        min: this._startTimestamp,
        max: 1000*60*60*24 + this._startTimestamp,
        showLastLabel: false,
        crosshair: { snap: false },
        dateTimeLabelFormats: {
          day: '%a'
        }
      },
      yAxis: {
        title: false,
        endOnTick: false,
        startOnTick: false,
        alignTicks: true,
        crosshair: { snap: false },
        minTickInterval: 1,
        tickInterval: this.options.valuetype === 'bool' ? 1 : null,
        min: min,
        max: max,
        type: this.options.valuetype === 'bool' ? 'category' : 'linear',
        categories: this.options.valuetype === 'bool' ? [ valueParameterList[1].split(':')[0], valueParameterList[0].split(':')[0] ] : null
      },
      tooltip: {
        xDateFormat: '%a, %H:%M',
        headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
        pointFormatter: function() {
          var value = (this.series.yAxis.categories) ? this.series.yAxis.categories[this.y] : this.y;
          return '<span class="highcharts-strong">' + value + '</span> (' + this.series.name + ')<br/>';
        }

      },
      chart: {
        events: {
          click: function(e) { // add point
            if(self.justDragged) { // prevent click event after drop
              self.justDragged = false;
              return;
            }

            // find timestamp of first point and round it to minimal time step
            var firstX = Math.round((e.xAxis[0].value - e.xAxis[0].axis.min) % (1000*60*60*24) / (timeStep)) * timeStep + e.xAxis[0].axis.min;

            // round and limit value
            var yValue = e.yAxis[0].value;
            if(yValue < min)
              yValue = min;
            else if(yValue > max)
              yValue = max;
            yValue = Math.round((yValue - min) / step) * step + min;

            var uzsuEntry = { active: true, event: 'time', timeCron: self.element.highcharts().time.dateFormat('%H:%M', firstX), value: yValue };
            self._uzsuRuntimePopup(uzsuEntry);

          }
        }
      },
      plotOptions: {
        series: {
          draggableX: this.options.editable,
          dragPrecisionX: timeStep,
          draggableY: this.options.editable,
          dragPrecisionY: step,
          dragMinY: min,
          dragMaxY: max,
          cursor: this.options.editable ? 'move' : null,
          marker: { enabled: true },
          stickyTracking: false,
          findNearestPointBy: 'xy',
          type: 'scatter',
          lineWidth: 2,
          point: {
            events: {
              click: function (e) {
                if(self.justDragged) { // prevent click event after drop
                  self.justDragged = false;
                  return;
                }
                self._uzsuRuntimePopup(e.point.uzsuEntry)
              },
              drag: function (e) {
              },
              drop: function (e) {
                self.justDragged = true; // used to prevent click event after drop
                if(e.target.uzsuEntry !== undefined) {
                  e.target.uzsuEntry.value = e.target.y;
                  if(e.target.uzsuEntry.event == 'time')
                    e.target.uzsuEntry.timeCron = self.element.highcharts().time.dateFormat('%H:%M', e.target.x);
                  else // sunrise or sunset
                    e.target.uzsuEntry.timeOffset = Math.round(((e.target.x % (1000*60*60*24)) - (self._getSunTime(e.target.uzsuEntry.event) % (1000*60*60*24)))/1000/60);
                  //uzsuEntry.active
                  self._save();
                }
              }
            }
          }
        }
      },
    },
    function (chart) {

      // crosshair tooltip
      self.element.mousemove(function (e) {
        if (!chart.lab) {
          chart.lab = chart.renderer.text('', 0, 0)
          .attr({ zIndex: 10 })
          .addClass('highcharts-axis-labels')
          .add();
        }

        e = chart.pointer.normalize(e);
        var position = {
          x: chart.xAxis[0].toValue(e.chartX),
          y: chart.yAxis[0].toValue(e.chartY)
        };


        position.x = Math.round((position.x - self._startTimestamp) % (1000*60*60*24) / (timeStep)) * timeStep + self._startTimestamp;
        if(position.y < min)
          position.y = min;
        else if(position.y > max)
          position.y = max;
        position.y = Math.round((position.y - min) / step) * step + min;
        if(chart.yAxis[0].categories)
          position.y = chart.yAxis[0].categories[position.y];

        chart.lab.attr({
          x: e.chartX + 5,
          y: e.chartY - 22,
          text: self.element.highcharts().time.dateFormat('%H:%M', position.x) + '<br>' + position.y
        });
      });

      self.element.mouseout(function () {
        if (chart && chart.lab) {
            chart.lab.destroy();
            chart.lab = null;
        }
      });

      // active/inactive button
      chart.renderer.button(String.fromCharCode(160)+String.fromCharCode(10004)+String.fromCharCode(160), chart.plotLeft, null, function(e) { self._uzsudata.active = !self._uzsudata.active; self._save(); }, null,  null,  null,  null, 'callout')
        .attr({
          align: 'right',
          title: sv_lang.uzsu.active
        })
        .addClass('highcharts-color-0 uzsu-active-toggler')
        //.css({'fill': 'transparent'})
        .add()
        //.align({
        //  align: 'right',
        //  x: -16-(buttons.length-i-1)*20,
        //  y: 10
        //}, false, null);

      // Interpolation buttons
      self.interpolationButtons = [
        { interpolationType: 'none', shape: 'square', langKey: 'nointerpolation' },
        { interpolationType: 'cubic', shape: 'circle', langKey: 'cubic' },
        { interpolationType: 'linear', shape: 'triangle', langKey: 'linear' },
      ];

      $.each(self.interpolationButtons, function(i, button) {
        button.element = chart.renderer.button('', null, null, function(e) { self._uzsudata.interpolation.type = button.interpolationType; self._save(); }, null,  null,  null,  null, button.shape)
          .attr({
            align: 'right',
            title: sv_lang.uzsu[button.langKey],
            "data-interpolation-type": button.interpolationType
          })
          .addClass('icon0 interpolation-button')
          .css({'fill': 'transparent'})
          .add()
          .align({
            align: 'right',
            x: -16-(self.interpolationButtons.length-i-1)*20,
            y: 10
          }, false, null);
      });

      chart.renderer.text(sv_lang.uzsu.interpolation+': ', null, null)
        .attr({
          align: 'right'}
        )
        .add(
          chart.renderer.createElement('g').addClass('highcharts-label').add()
        )
        .align({
          align: 'right',
          x: -16-self.interpolationButtons.length*20,
          y: 22
        }, false, null);
    });
  },

  _update: function(response) {
    this._super(response);

    if(this._uzsuParseAndCheckResponse(this._uzsudata))
      this.draw();
  },

  draw: function() {
    var self = this;
    var chart = this.element.highcharts();

    if(this._uzsudata.active)
      this.element.removeClass('uzsu-all-inactive');
    else
      this.element.addClass('uzsu-all-inactive');

    var hasDays = false;
    var hasSunrise = false;
    var hasSunset = false;
    var seriesData = { active: [], inactive: [], range: [] };
    var linetype = this._uzsudata.interpolation.type == 'cubic' ? 'spline' : 'line';
    Highcharts.seriesTypes.scatter.prototype.getPointSpline = Highcharts.seriesTypes[linetype].prototype.getPointSpline;
    $.each(this._uzsudata.list, function(responseEntryIdx, responseEntry) {
      // in der Tabelle die Werte der rrule, dabei gehe ich von dem Standardformat FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR,SA,SU aus und setze für jeden Eintrag den Button.
      var x, xMin, xMax;
      if(responseEntry.event == 'time')
        x = self._timeToTimestamp(responseEntry.timeCron);
      else {
        if(responseEntry.event == 'sunrise')
          hasSunrise = true;
        else if(responseEntry.event == 'sunset')
          hasSunset = true;
        x = self._getSunTime(responseEntry.event);
        if(responseEntry.timeOffsetType == 'm')
          x += responseEntry.timeOffset*1000*60;
        else if(responseEntry.timeOffsetType == '' && responseEntry.timeOffset != '')
          x = (responseEntry.calculated == undefined) ? x : self._timeToTimestamp(responseEntry.calculated);
          console.log('Set '+ responseEntry.event +' based entry to calculated time ' +
          responseEntry.calculated + ' for ' + responseEntry.timeCron);
        if(responseEntry.timeMin) {
          xMin = self._timeToTimestamp(responseEntry.timeMin);
          if(x < xMin)
            x = xMin;
        }
        if(responseEntry.timeMax) {
          xMax = self._timeToTimestamp(responseEntry.timeMax);
          if(x > xMax)
            x = xMax;
        }
      }

      var rrule = responseEntry.rrule;
      if (!rrule)
        rrule = 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR,SA,SU';
      var ind = rrule.indexOf('BYDAY=');
      // wenn der Standard drin ist
      if (ind > 0) {
        var days = rrule.substring(ind+6).split(',');
        if (days.length < 7)
          hasDays = true;
        $.each(days, function(dayIdx, day) {
          var rruleOffset = self.rruleDays[day]*1000*60*60*24;
          var xRecurring = x + rruleOffset;
          var yValue = Number(responseEntry.value);
          seriesData[responseEntry.active ? 'active' : 'inactive'].push({ x: xRecurring, y: yValue, className: 'uzsu-'+responseEntryIdx+' uzsu-event-'+responseEntry.event, entryIndex: responseEntryIdx, uzsuEntry: responseEntry });
          if(xMin !== undefined || xMax !== undefined) {
            if(xMin !== undefined)
              seriesData.range.push({ x: xMin+rruleOffset, y: yValue, name: sv_lang.uzsu.earliest, uzsuEntry: responseEntry, className: 'uzsu-min' });
            else
              seriesData.range.push({ x: xRecurring, y: yValue, uzsuEntry: responseEntry, className: 'uzsu-min uzsu-hidden', marker: { enabled: false } });
            if(xMax !== undefined)
              seriesData.range.push({ x: xMax+rruleOffset, y: yValue, name: sv_lang.uzsu.latest, uzsuEntry: responseEntry, className: 'uzsu-max' });
            else
              seriesData.range.push({ x: xRecurring, y: yValue, uzsuEntry: responseEntry, className: 'uzsu-max uzsu-hidden', marker: { enabled: false } });
            seriesData.range.push({ x: xMax+rruleOffset+1, y: null, uzsuEntry: responseEntry });
          }
        });
      }
    });

    var xMax = 1000*60*60*24 * (hasDays ? 7 : 1) + this._startTimestamp;

    // active points
    var data = seriesData.active;
    data.sort(function(a,b) { return a.x - b.x });
    if(data.length > 0) {
      data.unshift({ x: data[data.length-1].x-1000*60*60*24*7, y: data[data.length-1].y, className: data[data.length-1].className });
      data.push({ x: data[1].x+1000*60*60*24*7, y: data[1].y, className: data[1].className });
    }

    chart.get('active').setData(data, false, null, false);
    chart.get('active').update({
      type: 'scatter',
      step: this._uzsudata.interpolation.type != 'cubic' && this._uzsudata.interpolation.type != 'linear' ? 'left' : false,
    }, false);

    // inactive points
    data = seriesData.inactive;
    data.sort(function(a,b) { return a.x - b.x });
    chart.get('inactive').setData(data, false, null, false);

    // min/max times on sun events
    chart.get('range').setData(seriesData.range, false, null, false);

    plotLines = [];
    sunData = [];
    if(hasSunrise || hasSunset) {
      for(dayIdx = 0; dayIdx < 7; dayIdx++) {
        if(hasSunrise) {
          plotLines.push({
            value: self._getSunTime('sunrise')+dayIdx*1000*60*60*24,
            className: 'uzsu-event-sunrise',
            label: { text: sv_lang.uzsu.sunrise }
          });
          sunData.push({ x: self._getSunTime('sunrise')+dayIdx*1000*60*60*24, y: chart.yAxis[0].min, name: sv_lang.uzsu.sunrise, className: 'uzsu-event-sunrise', uzsuEvent: 'sunrise', marker: { symbol: 'sunrise' } });
        }
        if(hasSunset) {
          plotLines.push({
            value: self._getSunTime('sunset')+dayIdx*1000*60*60*24,
            className: 'uzsu-event-sunset',
            label: { text: sv_lang.uzsu.sunset }
          });
          sunData.push({ x: self._getSunTime('sunset')+dayIdx*1000*60*60*24, y: chart.yAxis[0].min, name: sv_lang.uzsu.sunset, className: 'uzsu-event-sunset', uzsuEvent: 'sunset', marker: { symbol: 'sunset' } })
        }
      }
    }
    chart.xAxis[0].update({
      max: 1000*60*60*24 * (hasDays ? 7 : 1) + this._startTimestamp,
      plotLines: plotLines
    }, false);
    chart.get('sun').setData(sunData, false);

    //set active interpolation button
    $.each(this.interpolationButtons, function(idx, button) {
      if(button.interpolationType == self._uzsudata.interpolation.type)
        button.element.addClass("icon1");
      else
        button.element.removeClass("icon1");
    });

    chart.redraw();

    self._plotNowLine();
    Highcharts.seriesTypes.scatter.prototype.getPointSpline = Highcharts.seriesTypes.line.prototype.getPointSpline;
  },

  _save: function() {
    this._uzsuCollapseTimestring(this._uzsudata);
    this._write(this._uzsudata);
    this._delay(function() { this.draw() }, 1); // has to be delayed to prevent exception in highcharts draggable points
  },

  _timeToTimestamp: function(time) {
    return new Date('1970-01-01T' + time + 'Z').getTime() + this._startTimestamp;
  },

  _getSunTime: function(event) {
    if(!this.sunTimes)
      this.sunTimes = { 'sunrise': (this._uzsudata.sunrise == undefined) ? '06:00' : this._uzsudata.sunrise, 'sunset': (this._uzsudata.sunset == undefined) ? '19:30' : this._uzsudata.sunset };
    return this._timeToTimestamp(this.sunTimes[event]);
  },

  _plotNowLine: function(id) {
    if(this._nowLinePlotDelay) {
      clearTimeout(this._nowLinePlotDelay);
      this._nowLinePlotDelay = null;
    }

    var axis = this.element.highcharts().xAxis[0];
    axis.removePlotLine('now');
    axis.addPlotLine({
      id: 'now',
      value: (this._timeToTimestamp(String(new Date().getHours()).padStart(2,'0')+':'+String(new Date().getMinutes()).padStart(2,'0')) - this._startTimestamp + 1000*60*60*24*((new Date().getDay() + 6) % 7)) % (axis.max - this._startTimestamp) + this._startTimestamp,
      className: 'uzsu-now highcharts-color-0',
      label: 'now'
    });

    this._nowLinePlotDelay = this._delay(function() {
      this._plotNowLine(this._nowLinePlotDelay);
    }, 60000);
  },

  _uzsuRuntimePopup: function(responseEntry) {
    var self = this;
    // Steuerung des Popups erst einmal wird der Leeranteil angelegt
    // erst den Header, dann die Zeilen, dann den Footer
    var tt = this._uzsuBuildTableHeader();
    tt += this._uzsuBuildTableRow(0);
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
    var responseCancel = jQuery.extend(true, {}, responseEntry);
    // dann die Werte eintragen.
    var tableRow = $('.uzsuRow').first();
    this._uzsuFillTableRow(responseEntry, tableRow);
    // Verhindern negativer Zahleneingabe
    $('.positivenumbers').keypress(function(evt){
        var charCode = (evt.which) ? evt.which : event.keyCode;
        return !(charCode > 31 && (charCode < 48 || charCode > 57));
    });
    // Popup schliessen mit close rechts oben in der Box oder mit Cancel in der Leiste
    uzsuPopup.find('#uzsuClose, #uzsuCancel').bind('click', function(e) {
      // wenn keine Änderungen gemacht werden sollen (cancel), dann auch im cache die alten Werte
      uzsuPopup.popup('close');
    });

    // speichern mit SaveQuit
    uzsuPopup.find('#uzsuSaveQuit').bind('click', function(e) {
      // jetzt wird die Kopie auf das Original kopiert und geschlossen
      self._uzsuSaveTableRow(responseEntry, tableRow);
      // add entry if it is a new one
      if(self._uzsudata.list.indexOf(responseEntry) == -1)
        self._uzsudata.list.push(responseEntry);
      self._save();
      uzsuPopup.popup('close');
    });
    // Löschen mit del als Callback eintragen
    uzsuPopup.delegate('.uzsuDelTableRow', 'click', function(e) {
      var entryIndex = self._uzsudata.list.indexOf(responseEntry);
      if(entryIndex != -1) { // don't remove if it was a new entry which is not in list yet
        self._uzsudata.list.splice(entryIndex, 1);
        self._save();
      }
      uzsuPopup.popup('close');
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
    uzsuPopup.popup('open');
  },

  _uzsuBuildTableFooter: function() {
    var tt = "";
    // Zeileneinträge abschliessen und damit die uzsuTableMain
    tt += "</div>";
    // Aufbau des Footers
      tt += "<div class='uzsuTableFooter'>" +
          "<div class='uzsuRowFooter'>" +
              "<div class='uzsuCell' style='float: right'>" +
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

});
