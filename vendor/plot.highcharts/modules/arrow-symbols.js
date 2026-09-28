!/**
 * Highcharts JS v13.1.1 (2026-09-20)
 * @module highcharts/modules/arrow-symbols
 * @requires highcharts
 *
 * Arrow Symbols
 *
 * (c) 2017-2026 Highsoft AS
 * Author: Lars A. V. Cabrera
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */function(r,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(r._Highcharts):"function"==typeof define&&define.amd?define("highcharts/modules/arrow-symbols",["highcharts/highcharts"],function(r){return t(r)}):"object"==typeof exports?exports["highcharts/modules/arrow-symbols"]=t(r._Highcharts):r.Highcharts=t(r.Highcharts)}("u"<typeof window?this:window,function(r){var t={944:function(t){"use strict";t.exports=r}},e={};function n(r){var o=e[r];if(void 0!==o)return o.exports;var u=e[r]={exports:{}};return t[r](u,u.exports,n),u.exports}n.n=function(r){var t=r&&r.__esModule?function(){return r.default}:function(){return r};return n.d(t,{a:t}),t},n.d=function(r,t){for(var e in t)n.o(t,e)&&!n.o(r,e)&&Object.defineProperty(r,e,{enumerable:!0,get:t[e]})},n.o=function(r,t){return Object.prototype.hasOwnProperty.call(r,t)};var o={};return!function(){"use strict";n.d(o,{default:function(){return a}});var r,t=n(944),e=n.n(t);function u(r,t,e,n){return[["M",r,t+n/2],["L",r+e,t],["L",r,t+n/2],["L",r+e,t+n]]}function i(r,t,e,n){return[["M",r+e,t],["L",r,t+n/2],["L",r+e,t+n],["Z"]]}function f(r,t,e,n){return i(r,t,e/2,n)}(r=e().SVGRenderer.prototype.symbols).arrow=u,r["arrow-filled"]=i,r["arrow-filled-half"]=f,r["arrow-half"]=function(r,t,e,n){return u(r,t,e/2,n)},r["triangle-left"]=i,r["triangle-left-half"]=f;var a=e()}(),o=o.default});