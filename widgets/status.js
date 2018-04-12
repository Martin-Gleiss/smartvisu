// ----- status.badge -------------------------------------------------------
$.widget("sv.status_badge", $.sv.widget, {

	initSelector: 'span[data-widget="status.badge"]',

	options: {
		 thresholds: '',
		 colors: ''
	},
	
	_update: function(response) {
		this.element.children('span').text(response[0]);

		// coloring
		var currentIndex = 0;
		$.each(String(this.options.thresholds).explode(), function(index, threshold) {
			if((isNaN(response[0]) || isNaN(threshold)) ? (threshold > response[0]) : (parseFloat(threshold) > parseFloat(response[0])))
				return false;
			currentIndex++;
		});
		var color = String(this.options.colors).explode()[currentIndex];

		if(color == 'hidden') {
			this.element.children('span').hide().css('background-color', null);
		}
		else {
			this.element.children('span').show().css('background-color', color);
		}
	},

});


// ----- status.collapse -------------------------------------------------------
$.widget("sv.status_collapse", $.sv.widget, {

	initSelector: 'span[data-widget="status.collapse"]',

	options: {
		id: null,
		'val-collapsed': 0
	},
	
	_update: function(response) {
		// response is: {{ gad_trigger }}
		var target = $('[data-bind="' + this.options.id + '"]');
		if (response[0] != this.options['val-collapsed']) {
			target.not('.ui-collapsible').not('.ui-popup').show();
			target.filter('.ui-collapsible').collapsible("expand");
			target.filter('.ui-popup').popup("open");
		}
		else {
			target.not('.ui-collapsible').not('.ui-popup').hide();
			target.filter('.ui-collapsible').collapsible("collapse");
			target.filter('.ui-popup').popup("close");
		}
	},

});


// ----- status.log -----------------------------------------------------------
$.widget("sv.status_log", $.sv.widget, {

	initSelector: 'span[data-widget="status.log"]',

	options: {
		count: 10
	},
	
	_update: function(response) {
		var ret;
		var line = '';
		if (response[0] instanceof Array) {
			// only the last entries
			var list = response[0].slice(0, this.options.count);
			for (var i = 0; i < list.length; i++) {
				ret = '<div class="color ' + list[i].level.toLowerCase() + '"></div>';
				ret += '<h3>' + new Date(list[i].time).transLong() + '</h3>';
				ret += '<p>' + list[i].message + '</p>';
				line += '<li data-icon="false">' + ret + '</li>';
			}
			this.element.find('ul').html(line).trigger('prepare').listview('refresh').trigger('redraw');
	}
},
});


// ----- status.notify ----------------------------------------------------------
$.widget("sv.status_notify", $.sv.widget, {

	initSelector: 'span[data-widget="status.notify"]',

	options: {
		level: 'info',
		signal: 'INFO',
		itemAck: null,
		ackValue: 1,
		itemSignal: null,
		itemTitle: null,
		itemLevel: null
	},

	_update: function(response) {

		var level = this.options.level, signal = this.options.signal, title = this.element.find('h1').text();

		if (response[0] != 0) {
			if (response.length > 2) {
				if(this.options.itemSignal)
					signal = response[2];
				else if (this.options.itemTitle)
					title = response[2];
				else if(notify.messagesPerLevel.hasOwnProperty(response[2]))
					level = response[2];

				if (response.length > 3) {
					if (this.options.itemTitle)
						title = response[3];
					else if(notify.messagesPerLevel.hasOwnProperty(response[3]))
						level = response[3];

					if(response[4] && notify.messagesPerLevel.hasOwnProperty(response[4]))
						level = response[4];
				}
			}

			notify.add(level, signal, title, '<b>' + response[1] + '</b><br  />' + this.element.find('p').html(), this.options.itemAck, this.options.ackValue);
			notify.display();
		}

	},

});


// ----- status.message -------------------------------------------------------
$.widget("sv.status_message", $.sv.widget, {

	initSelector: 'span[data-widget="status.message"]',

	_update: function(response) {
		// response is: {{ gad_trigger }}, {{ gad_message }}
		var id = this.element.attr('id');
		if (response[0] != 0) {
			$('#' + id + '-message p span').html(response[1] ? '<b>' + response[1] + '</b><br />' : '');
			$('#' + id + '-message .stamp').html(response[2] ? new Date(response[2]).transShort() : new Date().transShort());
			$('#' + id + '-message').popup('open');
			console.log(id + ' open ' + response[0]);
		}
		else {
			$('#' + id + '-message').popup('close');
			console.log(id + ' ' + response[0]);
		}
	},

});
