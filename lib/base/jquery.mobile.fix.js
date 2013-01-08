/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 

// jquery.mobile fix: slider trogger 'start' and 'stop'
$(document).on({
    "mousedown touchstart": function () { $(this).siblings("input").trigger("start"); },
    "mouseup touchend": function () { $(this).siblings("input").trigger("stop"); }
}, ".ui-slider, .ui-slider-vertical, .ui-slider-bottomup, .ui-slider-semicircle-box");


// jquery.mobile: normalize events
// basic.flip
$(document).on("change", 'select[data-role="slider"]', function() {
    $(this).trigger('click');
}); 

// basic.slider
$(document).on("stop", 'input[data-type="range"]', function() { 
    // unlock and trigger manually to avoid twice
    if ($(this).attr('lock') == 'true' || $(this).attr('lock') === undefined)
        $(this).trigger('click');
    
    $(this).attr('lock', 'false');
});
 
$(document).on("change", 'input[data-type="range"]', function() { 
    // use a lock to fire event only every 400ms
    if ($(this).attr('lock') == 'false')
    {
        $(this).attr('lock', 'true');
        setTimeout(
            "if($('#" + this.id + "').val() != " + $(this).val() + " && $('#" + this.id + "').attr('lock') == 'true')" +
            "   $('#" + this.id + "').trigger('click');" +
            "$('#" + this.id + "').attr('lock', 'false');", 1400);
    }
    // no click on init    
    if($(this).attr('lock') === undefined)
        $(this).attr('lock', 'false');  
});