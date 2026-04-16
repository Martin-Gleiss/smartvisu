// ----- phone.list -----------------------------------------------------------
$.widget("sv.phone_list", $.sv.widget, {

    initSelector: 'div[data-widget="phone.list"]',

    options: {
        count: 10,
        "service-url": ''
    },
    
    _phoneErrorNotification: 0,

    _repeat: function() {
        var count = this.options.count;
        var element = this.element;
                
        $.ajax({
            dataType: "json",
            url: this.options['service-url'],
            context: this,
            beforeSend: function(jqXHR, settings) { jqXHR.svProcess = 'Phone List Widget'; },
            success: function (data) {
                var ret;
                var line = '';
                var sum = 1;

                for (var i in data) {
                    ret = '<img class="icon" src="pics/phone/' + data[i].pic + '" alt="' + data[i].pic + '" />';
                    ret += '<img class="dir" src="lib/phone/pics/' + data[i].dirpic + '" alt="' + data[i].dirpic + '" />';
                    ret += '<h3>' + data[i].text + '&nbsp;</h3>';
                    ret += '<p>' + data[i].number + '&nbsp;</p>';
                    ret += '<span class="ui-li-count">' + data[i].date + '</span>';
                    ret = '<a ' + (data[i].number ? 'href="callto://' + data[i].number : '') + '">' + ret + '</a>';

                    line += '<li data-icon="false">' + ret + '</li>';
                    if (sum++ == count)
                        break;
                }
                element.children('ul').html(line).trigger('prepare').listview('refresh').trigger('redraw');

                if (this._phoneErrorNotification != 0){
                    notify.remove(this._phoneErrorNotification);
                    this._phoneErrorNotification = 0;
                }
            }
        })
        .fail(function(jqXHR, status, errorthrown){
            if (this._phoneErrorNotification == 0 || !notify.exists(this._phoneErrorNotification) )
                this._phoneErrorNotification = notify.json(jqXHR, status, errorthrown);
        });
    }

});


// ----- phone.missedlist -----------------------------------------------------
$.widget("sv.phone_missedlist", $.sv.widget, {

    initSelector: 'div[data-widget="phone.missedlist"]',

    options: {
        count: 3,
        "service-url": ''
    },

    _phoneErrorNotification: 0,

    _repeat: function() {
        var count = this.options.count;
        var element = this.element;
        
        $.ajax({
            dataType: "json",
            url: this.options['service-url'],
            context: this,
            beforeSend: function(jqXHR, settings) { jqXHR.svProcess = 'Phone Missedlist Widget'; },
            success: function (data) {
                var ret;
                var line = '';
                var sum = 1;

                for (var i in data) {
                    if (data[i].dir == 0) {
                        ret = '<img class="icon" src="pics/phone/' + data[i].pic + '" alt="' + data[i].pic + '" />';
                        ret += '<img class="dir" src="lib/phone/pics/' + data[i].dirpic + '" alt="' + data[i].dirpic + '" />';
                        ret += '<h3>' + data[i].text + '&nbsp;</h3>';
                        ret += '<p>' + data[i].number + '&nbsp;</p>';
                        ret += '<span class="ui-li-count">' + data[i].date + '</span>';
                        ret = '<a ' + (data[i].number ? 'href="callto://' + data[i].number : '') + '">' + ret + '</a>';

                        line += '<li data-icon="false">' + ret + '</li>';

                        if (sum++ == count)
                            break;
                    }
                }
                element.children('ul').html(line).trigger('prepare').listview('refresh').trigger('redraw');
                
                if (this._phoneErrorNotification != 0){
                        notify.remove(this._phoneErrorNotification);
                        this._phoneErrorNotification = 0;
                }
            }
        })
        .fail(function(jqXHR, status, errorthrown){
            if (this._phoneErrorNotification == 0 || !notify.exists(this._phoneErrorNotification) )
                this._phoneErrorNotification = notify.json(jqXHR, status, errorthrown);
        });
    }
});

// ----- phone.data_updateinfo -----------------------------------------------------
$.widget("sv.phone_data_updateinfo", $.sv.widget, {

    initSelector: 'div[data-widget="phone.data_updateinfo"]',

    options: {
        "service-url": ''
    },

    _phoneErrorNotification: 0,

    _repeat: function() {
        var element = this.element;
    
        $.ajax({
            dataType: "json",
            url: this.options['service-url'],
            context: this,
            beforeSend: function(jqXHR, settings) { jqXHR.svProcess = 'Get Phone System Update Data'; },
            success: function (data) {
                widget.update('@phone.update.available', data.update.updateAvailable);
                widget.update('@phone.update.version', data.update.version);
                widget.update('@phone.update.download', data.update.downloadURL);
                widget.update('@phone.update.info', data.update.infoURL);
                if (this._phoneErrorNotification != 0){
                        notify.remove(this._phoneErrorNotification);
                        this._phoneErrorNotification = 0;
                }
            }
        })
        .fail(function(jqXHR, status, errorthrown){
            if (this._phoneErrorNotification == 0 || !notify.exists(this._phoneErrorNotification) )
                this._phoneErrorNotification = notify.json(jqXHR, status, errorthrown);
        });
    }
}); 
/** values: [
        X   'updateAvailable'  => (int)$info->NewUpgradeAvailable,
            'passwordRequired' => (int)$info->NewPasswordRequired,
            'pwUserSelectable' => (int)$info->NewPasswordUserSelectable,
        X   'version'          => (string)$info->{'NewX_AVM-DE_Version'},
        X   'downloadURL'      => (string)$info->{'NewX_AVM-DE_DownloadURL'},
        X   'infoURL'          => (string)$info->{'NewX_AVM-DE_InfoURL'},
            'updateState'      => (string)$info->{'NewX_AVM-DE_UpdateState'},
            'buildType'        => (string)$info->{'NewX_AVM-DE_BuildType'},
            'setupAssiStatus'  => (int)$info->{'NewX_AVM-DE_SetupAssistantStatus'}
            ];
*/


// ----- phone.data_deviceinfo -----------------------------------------------------
$.widget("sv.phone_data_deviceinfo", $.sv.widget, {

    initSelector: 'div[data-widget="phone.data_deviceinfo"]',

   options: {
        "service-url": ''
    },

    _phoneErrorNotification: 0,

    _repeat: function() {
        var element = this.element;
    
        $.ajax({
            dataType: "json",
            url: this.options['service-url'],
            context: this,
            beforeSend: function(jqXHR, settings) { jqXHR.svProcess = 'Get Phone System Device Data'; },
            success: function (data) {
                widget.update('@phone.deviceinfo.manufacturer', data.deviceinfo.manufacturerName);
                widget.update('@phone.deviceinfo.oui', data.deviceinfo.manufacturerOUI);
                widget.update('@phone.deviceinfo.model', data.deviceinfo.modelName);
                widget.update('@phone.deviceinfo.description', data.deviceinfo.description);
                widget.update('@phone.deviceinfo.productclass', data.deviceinfo.productClass);
                widget.update('@phone.deviceinfo.serialnumber', data.deviceinfo.serialNumber);
                widget.update('@phone.deviceinfo.software', data.deviceinfo.softwareVersion);
                widget.update('@phone.deviceinfo.hardware', data.deviceinfo.hardwareVersion);
                widget.update('@phone.deviceinfo.spec', data.deviceinfo.specVersion);
                widget.update('@phone.deviceinfo.uptime', data.deviceinfo.upTime);

                var logArray = data.deviceinfo.deviceLog.split('\n');
                var deviceLog = [];
                for (i = 0; i < logArray.length; i++){
                    deviceLog[i] = {
                        time: logArray[i].substr(0,19),
                        level: 'INFO',
                        message: logArray[i].substr(20)
                    };
                }
                widget.update('@phone.deviceinfo.log', deviceLog);
                
                if (this._phoneErrorNotification != 0){
                        notify.remove(this._phoneErrorNotification);
                        this._phoneErrorNotification = 0;
                }
            }
        })
        .fail(function(jqXHR, status, errorthrown){
            if (this._phoneErrorNotification == 0 || !notify.exists(this._phoneErrorNotification) )
                this._phoneErrorNotification = notify.json(jqXHR, status, errorthrown);
        });
    }
}); 
/** values: [
        X   'manufacturerName' => (string)$info->NewManufacturerName,
        X   'manufacturerOUI'  => (string)$info->NewManufacturerOUI,
        X   'modelName'        => (string)$info->NewModelName,
        X   'description'      => (string)$info->NewDescription,
        X   'productClass'     => (string)$info->NewProductClass,
        x   'serialNumber'     => (string)$info->NewSerialNumber,
        X   'softwareVersion'  => (string)$info->NewSoftwareVersion,
        X   'hardwareVersion'  => (string)$info->NewHardwareVersion,
        X   'specVersion'      => (string)$info->NewSpecVersion,
            'provisioningCode' => (string)$info->NewProvisioningCode, (unused)
        X   'upTime'           => (int)$info->NewUpTime,
        X   'deviceLog'        => (string)$info->NewDeviceLog
            ];
*/