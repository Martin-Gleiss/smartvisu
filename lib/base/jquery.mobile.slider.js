/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      jQuery Foundation, Stefan Widmer
 * @copyright   2012 - 2016
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

$.widget( "mobile.slider", $.mobile.slider, {

	_create: function() {
		this._super();

		this.handleinfo = this.element.attr("handleinfo");
		this.noInput = this.element.hasClass('ui-slider-no-input');
				
		var orientation = this.orientation = this.element.attr("orientation"); // orientation (horizontal, vertical, bottomup, semicircle)
		
		if (orientation == 'semicircle') {
			var trackTheme = this.options.trackTheme || $.mobile.getAttribute( this.element[ 0 ], "theme" ) || 'inherit';

			var domSliderBox = document.createElement('div');
			domSliderBox.className = 'ui-slider-semicircle-box';
			domSliderBox = this.slider.wrapAll(domSliderBox).parent();

			var domSliderRight = document.createElement('div');
			domSliderRight.className = 'ui-bar-inherit ui-slider-semicircle-bottom';
			domSliderRight.style.right = '0';
			this.slider.append(domSliderRight);

			var domSliderLeft = document.createElement('div');
			domSliderLeft.className = 'ui-bar-inherit ui-slider-semicircle-bottom';
			this.slider.append(domSliderLeft);
			
			var domSliderLeftBg = document.createElement('div');
			domSliderLeftBg.className = 'ui-slider-bg ui-btn-active';
			domSliderLeft.appendChild(domSliderLeftBg);

			var domSliderInner = document.createElement('div');
			domSliderInner.className = 'ui-slider-semicircle-inner ui-body-' + trackTheme;
			this.slider.prepend(domSliderInner);

		}

		this.refresh(undefined, undefined, true);
		this._handleFormReset();

	},

	refresh: function( val, isfromControl, preventInputUpdate ) {
		// NOTE: we don't return here because we want to support programmatic
		//       alteration of the input value, which should still update the slider

		var self = this,
			parentTheme = $.mobile.getAttribute( this.element[ 0 ], "theme" ),
			theme = this.options.theme || parentTheme,
			themeClass =  theme ? " ui-btn-" + theme : "",
			trackTheme = this.options.trackTheme || parentTheme,
			trackThemeClass = trackTheme ? " ui-bar-" + trackTheme : " ui-bar-inherit",
			cornerClass = this.options.corners ? " ui-corner-all" : "",
			miniClass = this.options.mini ? " ui-mini" : "",
			left, width, data, tol,
			pxStep, percent,
			control, isInput, optionElements, min, max, step,
			newval, valModStep, alignValue, percentPerStep,
			handlePercent, aPercent, bPercent,
			valueChanged,
			orientation = this.orientation,
			handleinfo = this.handleinfo, noInput = this.noInput;
		
		// return on first call after creation, because the orientation handling has not taken place then
    if (orientation === undefined)
			return;

		self.slider[0].className = [ this.isToggleSwitch ? "ui-slider ui-slider-switch ui-slider-track ui-shadow-inset" : "ui-slider-track ui-slider-track-" + orientation + " ui-shadow-inset", trackThemeClass, cornerClass, miniClass, handleinfo ? " ui-slider-handle-info" : "", noInput ? " ui-slider-no-input" : "" ].join( "" );
		
		if ( this.options.disabled || this.element.prop( "disabled" ) ) {
			this.disable();
		}

		// Set the stored value for comparison later
		this.value = this._value();
		if ( this.options.highlight && !this.isToggleSwitch && this.slider.find( ".ui-slider-bg" ).length === 0 ) {
			this.valuebg = (function() {
				var bg = document.createElement( "div" );
				bg.className = "ui-slider-bg " + $.mobile.activeBtnClass;
				return $( bg ).prependTo( self.slider );
			})();
		}
		
		this.handle.addClass( "ui-btn" + themeClass + " ui-shadow ui-slider-handle-" + orientation );

		control = this.element;
		isInput = !this.isToggleSwitch;
		optionElements = isInput ? [] : control.find( "option" );
		min =  isInput ? parseFloat( control.attr( "min" ) ) : 0;
		max = isInput ? parseFloat( control.attr( "max" ) ) : optionElements.length - 1;
		step = ( isInput && parseFloat( control.attr( "step" ) ) > 0 ) ? parseFloat( control.attr( "step" ) ) : 1;

		if ( typeof val === "object" ) {
			data = val;
			// A slight tolerance helped get to the ends of the slider
			tol = 8;

			left = this.slider.offset().left;
			width = this.slider.width();
			pxStep = width / ( ( max - min ) / step );
			if ( !this.dragging ||
					data.pageX < left - tol ||
					data.pageX > left + width + tol ) {
				return;
			}
			if (orientation == "vertical") {
				percent = Math.round(( ( val.pageY - this.slider.offset().top ) / this.slider.height() ) * 100);
			}
			else if (orientation == "bottomup") {
				percent = 100 - Math.round(( ( val.pageY - this.slider.offset().top ) / this.slider.height() ) * 100);
			}
			else if (orientation == "semicircle") {
				var x = ( val.pageX - this.slider.offset().left ) - this.slider.width() / 2 - 2;
				var y = -(( val.pageY - this.slider.offset().top ) - this.slider.height() + 8);
				percent = Math.round(((Math.atan2(x, y) / Math.PI) * 180 + 90) / 180 * 100);
				if (percent < 0) {
					percent = 0;
				}
				if (percent > 100) {
					percent = 100;
				}
			}
			else {
				if ( pxStep > 1 ) {
					percent = ( ( data.pageX - left ) / width ) * 100;
				} else {
					percent = Math.round( ( ( data.pageX - left ) / width ) * 100 );
				}
			}

		} else {
			if ( val == null ) {
				val = isInput ? parseFloat( control.val() || 0 ) : control[0].selectedIndex;
			}
			percent = ( parseFloat( val ) - min ) / ( max - min ) * 100;
		}

		if ( isNaN( percent ) ) {
			return;
		}

		newval = ( percent / 100 ) * ( max - min ) + min;

		//From jQuery UI slider, the following source will round to the nearest step
		valModStep = ( newval - min ) % step;
		alignValue = newval - valModStep;

		if ( Math.abs( valModStep ) * 2 >= step ) {
			alignValue += ( valModStep > 0 ) ? step : ( -step );
		}

		percentPerStep = 100 / ( ( max - min ) / step );
		// Since JavaScript has problems with large floats, round
		// the final value to 5 digits after the decimal point (see jQueryUI: #4124)
		newval = parseFloat( alignValue.toFixed( 5 ) );

		if ( typeof pxStep === "undefined" ) {
			pxStep = width / ( ( max - min ) / step );
		}
		if ( pxStep > 1 && isInput ) {
			percent = ( newval - min ) * percentPerStep * ( 1 / step );
		}
		if ( percent < 0 ) {
			percent = 0;
		}

		if ( percent > 100 ) {
			percent = 100;
		}

		if ( newval < min ) {
			newval = min;
		}

		if ( newval > max ) {
			newval = max;
		}

		if (orientation == "vertical") {
			this.handle.css("top", percent + "%");
			this.valuebg.css("height", percent + "%");
		}
		else if (orientation == "bottomup") {
			this.handle.css("top", 100 - percent + "%");
			this.valuebg.css("margin-top", (this.slider.height() * (100 - percent) / 100).toFixed(0) + 'px');
			this.valuebg.css("height", percent + "%");
		}
		else if (orientation == "semicircle") {
			var angle = (percent / 100 - 0.5) * Math.PI;
			var trackWidth = 16;
			var arcWidth = this.slider.width() - trackWidth;
			var arcHeight = this.slider.height() == 0 ? arcWidth/2 : this.slider.height() - trackWidth/2;

			this.handle.css("top", Math.round((1 - Math.cos(angle)) * arcHeight) + 'px');
			this.handle.css("left", Math.round((1 + Math.sin(angle)) / 2 * arcWidth) + 'px');

			var width = Math.round(percent * (1 + trackWidth/100) - trackWidth/2);
			this.valuebg && this.valuebg.css("width", (width < 1 ? 1 : width) + "%");
		}
		else {
			this.handle.css( "left", percent + "%" );
			this.valuebg.css( "width", percent + "%" );
		}

		this.handle[0].setAttribute( "aria-valuenow", isInput ? newval : optionElements.eq( newval ).attr( "value" ) );

		this.handle[0].setAttribute( "aria-valuetext", isInput ? newval : optionElements.eq( newval ).getEncodedText() );

		this.handle[0].setAttribute( "title", isInput ? newval : optionElements.eq( newval ).getEncodedText() );

		if ( handleinfo == true)
		    this.handle.text(isInput ? newval : optionElements.eq( newval ).getEncodedText());

/*
		if ( this.valuebg ) {
			this.valuebg.css( "width", percent + "%" );
		}
*/
		// Drag the label widths
		if ( this._labels ) {
			handlePercent = this.handle.width() / this.slider.width() * 100;
			aPercent = percent && handlePercent + ( 100 - handlePercent ) * percent / 100;
			bPercent = percent === 100 ? 0 : Math.min( handlePercent + 100 - aPercent, 100 );

			this._labels.each( function() {
				var ab = $( this ).hasClass( "ui-slider-label-a" );
				$( this ).width( ( ab ? aPercent : bPercent ) + "%" );
			} );
		}
		
		
		if ( !preventInputUpdate ) {
			valueChanged = false;

			// Update control"s value
			if ( isInput ) {
				valueChanged = parseFloat( control.val() ) !== newval;
				control.val( newval );
			} else {
				valueChanged = control[ 0 ].selectedIndex !== newval;
				control[ 0 ].selectedIndex = newval;
			}
			if ( this._trigger( "beforechange", val ) === false ) {
				return false;
			}
			if ( !isfromControl && valueChanged ) {
				control.trigger( "change" );
			}
		}
	}

}, $.mobile.behaviors.formReset );
