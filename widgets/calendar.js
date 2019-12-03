// ----- calendar.list --------------------------------------------------------
$.widget("sv.calendar_list", $.sv.widget, {

	initSelector: 'div[data-widget="calendar.list"]',

	options: {
		color: ''
	},

	_update: function(response) {
			var data = response[0];
			var node = this.element;
			var self = this;

			var calendars = node.attr('data-calendar').explode();
			var calcolors = {};
			$.each(String(self.options.color).explode(), function(i, color) {
				calcolors[(calendars[i]||'').toLowerCase()] = color;
			});

			var ul = node.children('ul:first').empty();

			$.each(data, function(index, entry) {
				// "pseudo clone" entry to not mute original object in widget.buffer
				entry = Object.create(entry);

				// parse start and end as Date
				if(isNaN(entry.start)) // legacy: start in format 'y-m-d H:i:s'
					entry.start = new Date(Date.parse('20' + entry.start));
				else // start as timestamp
					entry.start = new Date(entry.start*1000);

				if(isNaN(entry.end)) // legacy: end in format 'y-m-d H:i:s'
					entry.end = new Date(Date.parse('20' + entry.end));
				else // end as timestamp
					entry.end = new Date(entry.end*1000);

				// build period string to display
				var period;
				// Start and end on same day: show day only once
				if(entry.end.transUnit('date') == entry.start.transUnit('date'))
					period = entry.start.transUnit('date') + ' ' + entry.start.transUnit('time') + ' - ' + entry.end.transUnit('time');
				// Full day entrys: don't show time
				else if (entry.start.getHours()+entry.start.getMinutes()+entry.start.getSeconds() == 0
					&& entry.end.getHours()+entry.end.getMinutes()+entry.end.getSeconds() == 0) {
					entry.end.setDate(entry.end.getDate()-1); // subtract one day from end
					if(entry.end.transUnit('date') == entry.start.transUnit('date')) // One day only: Show just start date
						period = entry.start.transUnit('date');
					else // Multiple days: Show start and end date
						period = entry.start.transUnit('date') + ' - ' + entry.end.transUnit('date');
				}
				else
					period = entry.start.transUnit('date') + ' ' + entry.start.transUnit('time') + ' - ' + entry.end.transUnit('date') + ' ' + entry.end.transUnit('time');

				// handle calendar_event_format in lang.ini
				$.each(sv_lang.calendar_event_format, function(pattern, attributes) {
					if(entry.title != null && entry.title.toLowerCase().indexOf(pattern.toLowerCase()) > -1) { // event title contains pattern
						// set each defined property
						$.each(attributes, function(prop, val) {
							entry[prop] = val;
						});
					}
				});

				// handle tags in event description
				var tags = (entry.content||'').replace(/\\n/,'\n').match(/@(.+?)\W+(.*)/igm) || [];
				$.each(tags, function(i, tag) {
					// parse tag
					tag = tag.match(/@(.+?)\W+(.*)/i);
					// prepend # if color is hexadecimal number of 3 or 6 digits
					if(tag[1] == 'color' && /^([0-9a-f]{3}){1,2}\W*$/i.test(tag[2]))
						tag[2] = '#'+tag[2];
					// apply tag to events properties
					entry[tag[1]] = tag[2];
				});

				// amend icon path/filename
				if(entry.icon) {
					// add default path if icon has no path
					if(entry.icon.indexOf('/') == -1)
						entry.icon = 'icons/ws/'+entry.icon;
					// add svg suffix if icon has no suffix
					if(entry.icon.indexOf('.') == -1)
						entry.icon = entry.icon+'.svg';
				}
				
				// add entry
				var a = $('<a>').append(
					$('<img class="icon">').css('background', entry.color || 'transparent').attr('src', entry.icon || 'pages/base/pics/trans.png')
				).append(
					$('<div class="color">').css('background', calcolors[(entry.calendarname||'').toLowerCase()] || entry.calendarcolor || String(self.options.color).explode()[0] || '#666666')
				).append(
					$('<h3>').text(entry.title)
				).append(
					$('<p>').text(period)
				).appendTo(
				 $('<li data-icon="false">').appendTo(ul)
				);
				if(entry.link)
					a.attr('href', entry.link);
				if(entry.where)
					a.append($('<span class="ui-li-count">').text(entry.where));

			});

			ul.trigger('prepare').listview('refresh').trigger('redraw');
	},

	_repeat: function() {
		widget.getUrlData(this.element);
 	},

});

// ----- calendar.waste -------------------------------------------------------
$.widget("sv.calendar_waste", $.sv.widget, {

	initSelector: 'div[data-widget="calendar.waste"]',

	options: {
		count: 5
	},
	
	_update: function(response) {
			var data = response[0];
			var node = this.element;
			var self = this;

			var morgen = new Date();
			morgen.setHours(0);
			morgen.setMinutes(0);
			morgen.setSeconds(0);
			morgen.setMilliseconds(0);
			morgen.setDate(morgen.getDate() + 1);
			var uebermorgen = new Date(morgen);
			uebermorgen.setDate(uebermorgen.getDate() + 1);

			var spalte = 0;
			var muell_html = "";//<table class ='ui-btn-up-a' style='width:100%;text-align:center;overflow:hidden;'><tr>";

			$.each(data, function(index, entry) {
				// "pseudo clone" entry to not mute original object in widget.buffer
				entry = Object.create(entry);

				// parse start as Date
				if(isNaN(entry.start)) // legacy: start in format 'y-m-d H:i:s'
					entry.start = new Date(Date.parse('20' + entry.start));
				else // start as timestamp
					entry.start = new Date(entry.start*1000);

				// handle calendar_event_format in lang.ini
				$.each(sv_lang.calendar_event_format, function(pattern, attributes) {
					if(entry.title.toLowerCase().indexOf(pattern.toLowerCase()) > -1) { // event title contains pattern
						// set each defined property
						$.each(attributes, function(prop, val) {
							entry[prop] = val;
						});
					}
				});

				// handle tags in event description
				var tags = (entry.content||'').replace(/\\n/,'\n').match(/@(.+?)\W+(.*)/igm) || [];
				$.each(tags, function(i, tag) {
					// parse tag
					tag = tag.match(/@(.+?)\W+(.*)/i);
					// prepend # if color is hexadecimal number of 3 or 6 digits
					if(tag[1] == 'color' && /^([0-9a-f]{3}){1,2}\W*$/i.test(tag[2]))
						tag[2] = '#'+tag[2];
					// apply tag to events properties
					entry[tag[1]] = tag[2];
				});

				entry.icon = "icons/ws/message_garbage_2.svg";

				muell_html += '<div style="float: left; width: ' + Math.floor(100 / self.options.count) + '%;">';
				muell_html += '<div style="margin: 0 1px; ';
				if (entry.start < morgen)
					muell_html += 'border-bottom: red 8px inset; overflow: hidden;';
				else if (entry.start < uebermorgen)
					muell_html += 'border-bottom: orange 8px inset; overflow: hidden;';
				muell_html += '">'
				muell_html += '<img class="icon icon1" src="' + entry.icon + '" style="width: 100%; height: 100%; fill: ' + entry.color + '; stroke: ' + entry.color + '" />';
				muell_html += '<div style="font-size: 0.9em; text-align: center;">' + entry.start.transUnit('D') + ', ' + entry.start.transUnit('day') + '</div>'
				muell_html += '</div>';
				muell_html += '</div>';

			});

			node.find('div').html(muell_html);
			fx.init(); // load svg inline
	},

	_repeat: function() {
		widget.getUrlData(this.element);
	},

});
