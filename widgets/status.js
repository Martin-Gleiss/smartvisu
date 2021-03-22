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
		val: ''
	},
	
	_update: function(response) {
		// response is: {{ item_trigger }}
		var target = $('[data-bind="' + this.options.id + '"]');
		var comp = String(this.options.val).explode(); 

		if (comp.indexOf(String(response[0])) == -1) {
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
				ret += '<p>' + list[i].message.htmlescape() + '</p>';
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

// ----- status.toast -------------------------------------------------------
$.widget("sv.status_toast", $.sv.widget, {

	initSelector: 'span[data-widget="status.toast"]',

	options: {
		template: null,
		hideAfter:null,
		showHide: null, 
		style: '',
		buttonopts: '',
		textopts: '',
	},

	_create: function() {
		this._super();
	},
	
	_update: function(response) {
		var id = this.element.attr('id');
		var date = new Date;
		var timestamp = Date.now();
		var heute = date.getHours() +":" + date.getMinutes()+":" + date.getSeconds()+" " +date.getDate()+ "."+ (date.getMonth()+ 1)+"." + date.getFullYear()+" <br>";
		var random = timestamp + getRandomInt(1,25);
		
		function getRandomInt(min, max) {
		  min = Math.ceil(min);
		  max = Math.floor(max);
		  return Math.floor(Math.random() * (max - min)) + min;
		}

		//Style values
		var params = this.options.style.explode();
		var bgColor = params[0];
		var color = params[1];
		var loaderBg = params[2];
		var textAlign = params[3];
		var showPosition = params[4];
		var stack = params[5];
		var showLoader = (params[6] == 'true' ? true : false);
		var hideAfter = params[7];
		var allowClose = (params[8] == 'true' ? true : false);
		var showHide = params[9];
		
		//Button
		var buttonOpts = this.options.buttonopts.explode();
		var sendButton = buttonOpts[0];
		var sendItem = buttonOpts[1];
		var sendVal = buttonOpts[2];
				
		//Title, Text, Icon check if text or item
		var itemsStr = this.options.item.explode();
		var items = [];
		var textOpts = this.options.textopts.explode();
		
		var i2 =0;
		items.push(response[0]);
		for (var i = 1; i < itemsStr.length; i++) {
			if(itemsStr[i]!= ''){
				items.push(response[i-i2]);
				i2= 0;
			}else{
				if(textOpts[i-1]){
					items.push(textOpts[i-1]);
					i2++;
				}else{
					items.push('');
				}
			}
		}
		
		var showTrigger = items[0];//items[0];
		var showTitle = items[1];
		var showText = items[2];
		var showIcon = items[3];
		
		//Template 
		if(this.options.template == 'info'){
			showIcon = 'info';
			hideAfter = 5000;
			bgColor = '#81BEF7';
			allowClose = true;
			color = '#eee';
		}else if(this.options.template == 'success'){
			showIcon = 'success';
			hideAfter = 5000;
			bgColor = '#1ad600';
			allowClose = true;
			color = '#000';
		}else if (this.options.template == 'warning'){
			showIcon = 'warning';
			bgColor = '#ff6609';
			allowClose = true;
			hideAfter= false;
			color = '#000000';
		}else if (this.options.template == 'error'){
			showIcon = 'error';
			hideAfter= false;
			bgColor = '#e03d3d';
			allowClose = false;
			color = '#FFF';
			if (sendButton =='') sendButton ='OK';
			showText+='<br/><input class ="button ui-btn ui-mini ui-corner-all ui-btn-inline" id ="#'+id+'" type="button" value="'+sendButton+'" data-senditem="'+sendItem+'" data-sendvalue="'+sendVal+'" />';
		}else{
			this.options.template = "free";
			showIcon = response[3] || textOpts[2];
			if (sendButton != '') showText+='<br/><input class ="button ui-btn ui-mini ui-corner-all ui-btn-inline" id ="#'+id+'" type="button" value="'+sendButton+'" data-senditem="'+sendItem+'" data-sendvalue="'+sendVal+'" />';
		};
		
		if (response[0]){
			
			var toast = $.toast({
				text: showText, // Text that is to be shown in the toast
				heading: showTitle, // Optional heading to be shown on the toast
				icon: showIcon, // Type of toast icon
				showHideTransition: showHide, // fade, slide or plain
				allowToastClose: allowClose, // Boolean value true or false
				hideAfter: hideAfter, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
				stack: 99, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
				position: showPosition, // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
				textAlign: textAlign,  // Text alignment i.e. left, right or center
				loader: showLoader,  // Whether to show loader or not. True by default
				loaderBg: loaderBg,  // Background color of the toast loader
				bgColor: bgColor,
				textColor: color
				
			});
			
			$('#' + id).append(toast);//add toast to widget
		
		
			//use smartVISU icon
			if (textOpts[2]){ 
				var pic = textOpts[2];

				// add default path if icon has no path
				if(pic.indexOf('.') == -1){
					pic = pic+'.svg';
				};
				if(pic.indexOf('/') == -1){
					pic = 'icons/ws/'+pic;
				}else{
					pic = pic;	
				};
				
				$("div.jq-toast-single").last().addClass('jq-has-icon');
				$("div.jq-has-icon").last().css({'background-position-x': '5px','background-size': '3.5em' }); //fetch button id
				$("div.jq-toast-single").last().css({'background-image':'url('+pic+')'}); //fetch button id
			};

		}else{ 
			if (allowClose = true){
				$("div.jq-toast-single").last().remove();
			};
		}
		
		//Close by button click
		$(".button").click(function() {
			var button_id = $(this).attr('id'); 
			var sendItem = $(this).attr('data-senditem');
			var sendVal= $(this).attr('data-sendvalue'); 
			if (sendItem == undefined || sendItem == '') {
                console.log("INFO: TOAST Button pressed, but NO item given ");
            }else{
               // console.log("INFO-Button: ", button_id, ' ', sendItem, ' ', sendVal);
                io.write(sendItem, sendVal);
            };
            $(this).closest('div').remove();
        });
	},
	
	_events: {
	}
});

