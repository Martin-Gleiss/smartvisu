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
var notify = {

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
    * Add a new error-message from a ajax error request
    * @param    error object
    * @param    status
    * @param    '600 smartVISU Service Error'
    */     
    json: function(jqXHR, status, errorthrown) {
        
        var messages = jQuery.parseJSON(jqXHR.responseText)
        
        for(var i = 0; i < messages.length; i++) {
            notify.add('error', '', messages[i].title, messages[i].text);
        }

        notify.display();
    },

  /**
    * Add a new error-message
    */     
    error: function(title, text){
        notify.add('error', '', title, text);
        notify.display();
    },

  /**
    * Add a new info-message
    */     
    info: function(title, text){
        notify.add('info', '', title, text);
        notify.display();
    },

  /**
    * Add a new message
    */     
    add: function(status, link, title, text){
        notify.i++;
        notify.messages[notify.i] = Array();
        notify.messages[notify.i] = ({status: status, link: link, title: title, text:text});   
    },
    
  /**
    * Removes a note, or all if no id is given
    */         
    remove: function(id) {
        if (id !== undefined)
            delete notify.messages[id];
        else
            notify.messages = new Object(); 
        
        $('.alertx').popup('close');
        $('.alert img').attr('src', '');
        $('.alert a').attr('href', '');
        $('.alert').hide(); 
    },
    
    display: function() {
        var message = notify.messages[1];
    
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
            console.log('[notify.' + message.status + '] ' + message.title + ' - ' + message.text);
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

     
   
