/**
 * -----------------------------------------------------------------------------
 * @package     smartVisu
 * @author      Martin Gleiß <http://facebook.com/profile.php?id=100002964207907>
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 
 
// Basic I / O
function knx(gad, val)
{
    var request;
    
    if (gad != '')
    {
        if (val != null)
        {
            // Write to Bus
            request = $.ajax 
            ({  url: "knx.php", 
                data: ({gad: gad, val: val}), 
                type: "GET", 
                dataType: 'text', 
                cache: false
            });
        }
        else
        {
            // Read from Bus
            request = $.ajax 
            ({  url: "knx.php", 
                data: ({gad: gad}), 
                type: "GET",   
                dataType: 'text',                                      
                async: true,
                cache: false
            });
        }
    }
    else
        request = $.ajax ({ });
     
    return request;
}
