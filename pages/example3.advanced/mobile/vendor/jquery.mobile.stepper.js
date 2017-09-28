/* 
 * jQuery Mobile Framework : "stepper" plugin: add incrementer decrementer buttons to quantity input
 * Copyright (c) Nora Brown
 * CC 3.0 Attribution.  May be relicensed without permission/notifcation.
 * https://github.com/nabrown/jQuery-Mobile-Stepper-Widget
 * Looks for container w/ data-role="stepper"
*/	
(function ($, undefined){
	$.widget("mobile.stepper", $.mobile.widget, {
		options: {
			direction: "horizontal",
			shadow: false,
			excludeInvisible: true,
			step: 1,
			theme: "a"
		},
		_create: function(){
			var $el = this.element,
				o = $.extend(this.options, $el.data("options")),
			 	$input = $el.find('input'),
				$incBtn = $('<a class="inc" data-role="button">+</a>'),
				$decBtn = $('<a class="dec" data-role="button">-</a>'),
				// Get min and max from input's attributes
				min = parseInt($input.attr('min')),
				max = parseInt($input.attr('max')),
				//flCorners = o.direction == "horizontal" ? [ "ui-corner-left", "ui-corner-right" ] : [ "ui-corner-top", "ui-corner-bottom" ];
                flCorners = o.direction == "horizontal" ? [ "ui-corner-all", "ui-corner-all" ] : [ "ui-corner-all", "ui-corner-all" ];
                
			// Insert button markup
			if(o.direction == "horizontal"){
				$input.before($decBtn).after($incBtn);
			}else{
				$input.before($incBtn).after($decBtn).wrap('<div class="step-input-wrap" />');
			}
			
			// Bind increment and decrement functions to click event
			$el.find('.inc, .dec').click(function(){
				var $btn = $(this),
					oldVal = parseInt($input.val());
				
				if ($btn.hasClass('inc')){
					var newVal = oldVal == max ? max : oldVal + parseInt(o.step);
				} else {
					var newVal = oldVal == min ? min : oldVal - parseInt(o.step);
				}
				$input.val(newVal);
                $input.trigger('change');
			}).buttonMarkup({theme: o.theme}); // Enhance button markup

			$el.addClass( "ui-controlgroup ui-controlgroup-" + o.direction );
				
			function flipClasses( els ) {
				els.removeClass( "ui-btn-corner-all ui-shadow" )
					.eq( 0 ).addClass( flCorners[ 0 ] )
					.end()
					.last().addClass( flCorners[ 1 ] ).addClass( "ui-controlgroup-last" );
			}
			
			flipClasses( $el.find( ".ui-btn" + ( o.excludeInvisible ? ":visible" : "" ) ) );
			flipClasses( $el.find( ".ui-btn-inner" ) );

			if ( o.shadow ) {
				$el.addClass( "ui-shadow" );
			}
		}
	});
	
	//auto self-init widgets
	$( document ).bind( "pagecreate create", function( e ){
		$( ":jqmData(role='stepper')", e.target ).stepper({ excludeInvisible: false });
	});
	

})(jQuery);

