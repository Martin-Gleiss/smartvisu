/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */
 

 /**
 * Converts a hsv value to rgb value
 */
function hsv2rgb(h, s, v) {
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
     
    r = Math.round(r * 255).toString(16);
    g = Math.round(g * 255).toString(16);
    b = Math.round(b * 255).toString(16);
    
    return '#' + (r <=9 ? '0' + r : r) + (g <=9 ? '0' + g : g) + (b <=9 ? '0' + b : b);
}