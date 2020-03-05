
// ----- window.complete ---------------------------------------------------------
$.widget("sv.window_complete", $.sv.widget, {

	initSelector: 'svg[data-widget="window.complete"]',
	options: {
		min: 0,
		max: 255
	},
	
	_update: function(response) {
		// response is: {{ gad_value }}, {{ gad_window_r}}, {{ gad_window_l}}
		this._super(response);

		this.element.attr('class', 'icon' + (response[1] || response[2] ? ' icon1' : ' icon0')) // addClass does not work in jQuery for svg
		
		var max = parseFloat(this.options.max);
		var min = parseFloat(this.options.min);
		
		if(response[2] !== undefined) {
			var window_l = response[2];
		} else { 
		    window_l = 0; 
		}
		if(response[1] !== undefined) {
			var window_r = response[1];
		} else { 
			window_r = 0; 
		}

		switch (window_r) {
			case 0:
				var rightwing = "translate(0,0) skewY(0) scale(1, 1)";
				this.element.find('#wing_r').attr('transform', rightwing);
				var righthandle ="translate(0,0) skewY(0) scale(1, 1)";
				this.element.find('#handle_r').attr('transform', righthandle);
				break;
			case 1:
				var rightwing = "translate(-9.8, 14.5) skewX(12) scale(0.97, 0.8)";
				this.element.find('#wing_r').attr('transform', rightwing);
				var righthandle = "translate(-10, 14.5) skewX(12) scale(0.97, 0.8)";
				this.element.find('#handle_r').attr('transform', righthandle);
				break;
			case 2:
				var rightwing = "translate(25, 22) skewY(-20) scale(0.7, 0.975)";
				this.element.find('#wing_r').attr('transform', rightwing);
				var righthandle = "translate(25, 21.2) skewY(-20) scale(0.7, 1)";
				this.element.find('#handle_r').attr('transform', righthandle);
				break;
		}
			switch (window_l) {
			case 0:
				var leftwing = "translate(0,0) skewY(0) scale(1, 1)";
				this.element.find('#wing_l').attr('transform', leftwing);
				var lefthandle ="translate(0,0) skewY(0) scale(1, 1)";
				this.element.find('#handle_l').attr('transform', lefthandle);
				break;
			case 1:
				var leftwing = "translate(-11.5, 14.5) skewX(12) scale(0.97, 0.8)";
				this.element.find('#wing_l').attr('transform', leftwing);
				var lefthandle = "translate(-11.3, 14.5) skewX(12) scale(0.97, 0.8)";
				this.element.find('#handle_l').attr('transform', lefthandle);
				break;
			case 2:
				var leftwing = "translate(5, -3.5) skewY(20) scale(0.7, 0.975)";
				this.element.find('#wing_l').attr('transform', leftwing);
				var lefthandle = "translate(5, -4.4) skewY(20) scale(0.7, 0.975)";
				this.element.find('#handle_l').attr('transform', lefthandle);
				break;
		}

		var val = Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 38);
		
		fx.grid(this.element[0], val, [14, 30], [86, 68]);
	}
});

