// ----- calendar.list --------------------------------------------------------
$.widget("sv.calendar_list", $.sv.widget, {

	initSelector: 'div[data-widget="calendar.list"]',

	options: {
		color: '',
		weekday: '',
		info: '',
		private: 'show',
		daycount: 0
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

			var dl = node.children('dl:first').empty();
			$.each(data, function(index, entry) {
				// "pseudo clone" entry to not mute original object in widget.buffer
				entry = Object.create(entry);
				var startDay ='', endDay = '';

				// parse start and end as Date
				if(isNaN(entry.start)) // legacy: start in format 'y-m-d H:i:s'
					entry.start = new Date(Date.parse('20' + entry.start));
				else // start as timestamp
					entry.start = new Date(entry.start*1000);
					
				//skip entry if start is not in the configured time span
				if (self.options.daycount > 0 && entry.start.valueOf() > new Date().valueOf() + parseInt((self.options.daycount - 1) * 86400000 )) 
					return true;
				
				if(isNaN(entry.end)) // legacy: end in format 'y-m-d H:i:s'
					entry.end = new Date(Date.parse('20' + entry.end));
				else // end as timestamp
					entry.end = new Date(entry.end*1000);

				if (self.options.weekday != '') {
					startDay = entry.start.transUnit(self.options.weekday)+', ';
					endDay = entry.end.transUnit(self.options.weekday)+', ';
				}
				// build period string to display
				var period;
				// Start and end on same day: show day only once
				if(entry.end.transUnit('date') == entry.start.transUnit('date'))
					period = startDay + entry.start.transUnit('date') + ' ' + entry.start.transUnit('time') + ' - ' + entry.end.transUnit('time');
				// Full day entrys: don't show time
				else if (entry.start.getHours()+entry.start.getMinutes()+entry.start.getSeconds() == 0
					&& entry.end.getHours()+entry.end.getMinutes()+entry.end.getSeconds() == 0) {
					entry.end.setDate(entry.end.getDate()-1); // subtract one day from end
					if(entry.end.transUnit('date') == entry.start.transUnit('date')) // One day only: Show just start date
						period = startDay + entry.start.transUnit('date');
					else // Multiple days: Show start and end date
						period = startDay + entry.start.transUnit('date') + ' - ' + endDay + entry.end.transUnit('date');
				}
				else
					period = startDay + entry.start.transUnit('date') + ' ' + entry.start.transUnit('time') + ' - ' + endDay + entry.end.transUnit('date') + ' ' + entry.end.transUnit('time');

				// handle calendar_event_format in lang.ini
				$.each(sv_lang.calendar_event_format, function(pattern, attributes) {
					if(entry.title != null && entry.title.toLowerCase().indexOf(pattern.toLowerCase()) > -1) { // event title contains pattern
						// set each defined property
						$.each(attributes, function(prop, val) {
							entry[prop] = val;
						});
					}
				});
				
				if (entry.class != undefined && entry.class.toLowerCase() == 'private' && self.options.private == 'hide'){
					entry.title = sv_lang.calendar.private;
				}
				
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
				
				//fals kein icon angegeben
				if(!entry.icon){
					//falls kein default angegeben
					if (typeof(sv_lang.calendar_event_format.default_img_list) === undefined || sv_lang.calendar_event_format.default_img_list.icon == "" ){
						entry.icon = "pages/base/pics/trans.png";
						entry.color = 'transparent';
					}else{
						entry.icon = sv_lang.calendar_event_format.default_img_list.icon;
						entry.color = sv_lang.calendar_event_format.default_img_list.color;
					}
				}

				// amend icon path/filename
				if(entry.icon) {
					// add default path if icon has no path
					if(entry.icon.indexOf('/') == -1)
						entry.icon = sv.config.icon0 + entry.icon;
					// add svg suffix if icon has no suffix
					if(entry.icon.indexOf('.') == -1)
						entry.icon = entry.icon+'.svg';
				}

				// add entry
				var a = $('<a>');
				if (entry.icon.indexOf('.svg') == -1)
					a.append( $('<img class="icon">').css('background', entry.color ).attr('src', entry.icon));
				else
					fx.load(entry.icon,'icon icon0', 'background:'+entry.color+';', a, 'prepend');	
				$(a).append(
					$('<div class="color">').css('background', calcolors[(entry.calendarname||'').toLowerCase()] || entry.calendarcolor || String(self.options.color).explode()[0] || '#666666')
				).append(
					$('<h3>').text(entry.title)
				).append(
					$('<p>').text(period)
				).appendTo(
				 $('<li data-icon="false">').appendTo(dl)
				);

				if (self.options.info != 'active') {
					if(entry.link)
						a.attr('href', entry.link);
					if(entry.where)
						a.append($('<span class="ui-li-count">').text(entry.where));		
				} else {
					if(entry.link || entry.where) {
						a.append($('<span class="ui-li-count">').text('Info'));
						var infoField = '<div class="content" style=" display: none; margin-left:1em; margin-bottom:2em; height:100%; text-align:left;">';
						if(entry.link)
							infoField += '<a href="' + entry.link + '" style="padding-left: 0px !important;">Link</a>';
						if (entry.where) 
							infoField += (entry.link ? '<br>':'') + entry.where;
						infoField += '</div>';
						self.element.find('dl').append(infoField);
					}
				}
			});

			dl.trigger('prepare').listview('refresh').trigger('redraw');
			
			//toggle display of description text
			$(this.element, ".activelist-container").find('li').click(function() {
				event.preventDefault();
				$(this).toggleClass('open');
				accordionContent = $(this).next('.content');
				$(this, '.content').not(accordionContent).prev(this,'.content-title').removeClass('open');
				accordionContent.stop(true, true).slideToggle('slow');
			});

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
			node.find('div').html('');			
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
					if(entry.title.toLowerCase().trim().indexOf(pattern.toLowerCase().trim()) == 0) { // event title starts with pattern 
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
				//console.log(entry)
				
				//get only the garbage icon, when no or the garbage keyword is used
				if (entry.icon === "message_garbage"){
					entry.icon = "message_garbage_2";
				}else if(!entry.icon){
					if (typeof(sv_lang.calendar_event_format.default_img_waste) !== undefined || sv_lang.calendar_event_format.default_img_waste.icon ==""){
						entry.icon = "pages/base/pics/trans.png";
						entry.color = 'transparent';
					}else{
						entry.icon = sv_lang.calendar_event_format.default_img_waste.icon;
						entry.color = sv_lang.calendar_event_format.default_img_waste.color;
					}
				}
				
				if(entry.icon) {
					// add default path if icon has no path
					if(entry.icon.indexOf('/') == -1)
						entry.icon = 'icons/ws/'+entry.icon;
					// add svg suffix if icon has no suffix
					if(entry.icon.indexOf('.') == -1)
						entry.icon = entry.icon+'.svg';
				}
				
				var a = $('<div style="float: left; width: ' + Math.floor(100 / self.options.count) + '%;">').append(
					$('<div style="margin: 0 1px; overflow: hidden;">').css('border-bottom', (entry.start < morgen) ? 'red 8px inset' : (entry.start < uebermorgen) ? 'orange 8px inset' : '').append(
					$('<div style="font-size: 0.9em;text-align: center;">').text( entry.start.transUnit('D') + ', ' + entry.start.transUnit('day') ))
					);
		
				if (entry.icon.indexOf('.svg') == -1)
					a.find('div').last().before( $('<img class="icon icon1" src="' + entry.icon + '" style="width: 100%; height: 120%; fill: ' + entry.color + '; stroke: ' + entry.color + ';" />'));
				else
					fx.load(entry.icon,'icon icon1', 'width: 100%; height: 120%; fill: ' + entry.color + '; stroke: ' + entry.color + ';', a.find('div').last(), 'before');			

				node.find('div:first').append(a);
			});
	},

	_repeat: function() {
		widget.getUrlData(this.element);
	},

});
