/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 
 
 
/**
* Class for displaying notifications and notes in smartVISU
*/
var note = {

    i: 0,
    
    // a list with all values, all communication it through the buffer
    messages: new Object(),
    
  /**
    *  Checks if there are any messages 
    */            
    exists: function() {
        var ret = false;
        
        for (var i in note.messages)
            ret = true;
        
        return ret;        
    },
    
  /**
    * Add a new note to add
    */     
    add: function(status, link, title, text){
        note.i++;
        note.messages[note.i] = Array();
        note.messages[note.i] = ({status: status, link: link, title: title, text:text});   
    },
    
  /**
    * Removes a note, or all it no id is given
    */         
    remove: function(id) {
        if (id !== undefined)
            delete io.messages[id];
        else
            io.messages = new Object(); 
        
        $('.alert img').attr('src', '');
        $('.alert a').attr('href', '');
        $('.alert').hide(); 
    },
    
    display: function() {
        var message = note.messages[1];
    
        if (message)
            {
            if (message.status == 'ok')
                $('.alert img, .alertx img').attr('src', 'pages/base/pics/alert_ok.png');
            else if (message.status == 'info')
                $('.alert img, .alertx img').attr('src', 'pages/base/pics/alert_info.png');
            else if (message.status == 'error')
                $('.alert img, .alertx img').attr('src', 'pages/base/pics/alert_error.png');
            else if (message.status == 'update')
                $('.alert img, .alertx img').attr('src', 'pages/base/pics/alert_update.png');
            else
                $('.alert img').attr('src', 'pages/base/pics/alert.png');
            
            if (message.link != '')
                $('.alert a').attr('href', message.link);
            
            if (message.title != '' || message.text != '') {
                $('.alert a').attr('href', '#alertx');
                $('.alertx h1').html(message.title);
                $('.alertx p').html(message.text);
            }   
            
            $('.alert').show();
            
            // log to console
            console.log('[note.' + message.status + '] ' + message.title + ': ' + message.text);
            }    
    }
};


   
/**
 * -----------------------------------------------------------------------------
 * S M A R T   F U N C T I O N S 
 * ----------------------------------------------------------------------------- 
 */  
var smart = {
  
  /**
    * Displays an alert message in the top-right corner
    */
    alert: function(status, link, title, text) {
    
        if (status == 'ok')
            $('.alert img, .alertx img').attr('src', 'pages/base/pics/alert_ok.png');
        else if (status == 'info')
            $('.alert img, .alertx img').attr('src', 'pages/base/pics/alert_info.png');
        else if (status == 'error')
            $('.alert img, .alertx img').attr('src', 'pages/base/pics/alert_error.png');
        else if (status == 'update')
            $('.alert img, .alertx img').attr('src', 'pages/base/pics/alert_update.png');
        else
            $('.alert img').attr('src', 'pages/base/pics/alert.png');
        
        if (link != '')
            $('.alert a').attr('href', link);
        
        if (title != '' || text != '') {
            $('.alert a').attr('href', '#alertx');
            $('.alertx h1').html(title);
            $('.alertx p').html(text);
        }   
        
        $('.alert').show();
        
        // log to console
        console.log(status + ': ' + title + ' ' + text);
    },
    
    
/**
 * -----------------------------------------------------------------------------
 * H E L P E R 
 * ----------------------------------------------------------------------------- 
 */
    
  /**
    * Converts a hsv value to rgb value
    */
    hsv2rgb: function(h, s, v) {
        var r, g, b;
        var i;
        var f, p, q, t;
         
        // test range
        h = Math.max(0, Math.min(360, h));
        s = Math.max(0, Math.min(100, s));
        v = Math.max(0, Math.min(100, v));
         
        s /= 100;
        v /= 100;
         
        if(s == 0) {
            // achromatic (grey)
            r = g = b = v;
        }
        else
        { 
            h /= 60; // sector 0 to 5
            i = Math.floor(h);
            f = h - i; // factorial part of h
            p = v * (1 - s);
            q = v * (1 - s * f);
            t = v * (1 - s * (1 - f));
             
            switch(i) {
                case 0: r = v; g = t; b = p; break;
                case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break;
                default:  r = v; g = p; b = q; 
            }
        }
         
        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);
        
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }   

};


/**
 * -----------------------------------------------------------------------------
 * Q U E R Y   E X T E N T I O N S
 * ----------------------------------------------------------------------------- 
 */  
 
  /**
    * Mini-Clock
    */
    (function($) {
        $.fn.extend({
            miniclock: function() {
                return this.each(function() {
                var $this = $(this);
                $this.displayMiniClock($this);
            });
        }});
       
        $.fn.displayMiniClock = function(el) {
            var now = new Date();
            el.html(now.getHours() + ':' + (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()));
            setTimeout(function() {$.fn.displayMiniClock(el)}, $.fn.delay());
        }
    
        $.fn.delay = function() {
            var now = new Date();
            var delay = (60 - now.getSeconds()) * 1000;
            return delay;
        }
    })(jQuery);

     
   