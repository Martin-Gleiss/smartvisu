!/**
 * Highcharts JS v13.1.1 (2026-09-20)
 * @module highcharts/modules/streamgraph
 * @requires highcharts
 *
 * Streamgraph module
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Torstein Hønsi
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(t._Highcharts.SeriesRegistry,t._Highcharts):"function"==typeof define&&define.amd?define("highcharts/modules/streamgraph",["highcharts/highcharts"],function(t){return e(t.SeriesRegistry,t)}):"object"==typeof exports?exports["highcharts/modules/streamgraph"]=e(t._Highcharts.SeriesRegistry,t._Highcharts):t.Highcharts=e(t.Highcharts.SeriesRegistry,t.Highcharts)}("u"<typeof window?this:window,function(t,e){var r={512:function(e){"use strict";e.exports=t},944:function(t){"use strict";t.exports=e}},n={};function o(t){var e=n[t];if(void 0!==e)return e.exports;var i=n[t]={exports:{}};return r[t](i,i.exports,o),i.exports}o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,{a:e}),e},o.d=function(t,e){for(var r in e)o.o(e,r)&&!o.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)};var i={};return!function(){"use strict";o.d(i,{default:function(){return f}});var t,e=o(944),r=o.n(e),n=o(512),a=o.n(n),s={fillOpacity:1,lineWidth:0,marker:{enabled:!1},stacking:"stream"},c=(t=function(e,r){return(t=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(e,r)},function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}),u=a().seriesTypes.areaspline,p=function(t){function r(){return null!==t&&t.apply(this,arguments)||this}return c(r,t),r.prototype.streamStacker=function(t,e,r){t[0]-=e.total/2,t[1]-=e.total/2,this.stackedYData&&(this.stackedYData[r]=Math.max.apply(0,t))},r.defaultOptions=(0,e.merge)(u.defaultOptions,s),r}(u);(0,e.addEvent)(p,"afterGetExtremes",function(t){t.dataExtremes.dataMin=-t.dataExtremes.dataMax}),(0,e.extend)(p.prototype,{negStacks:!1}),a().registerSeriesType("streamgraph",p);var f=r()}(),i=i.default});