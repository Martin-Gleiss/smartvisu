!/**
 * Highcharts JS v13.0.0 (2026-06-11)
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
 */function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(t._Highcharts,t._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/modules/streamgraph",["highcharts/highcharts"],function(t){return e(t,t.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/modules/streamgraph"]=e(t._Highcharts,t._Highcharts.SeriesRegistry):t.Highcharts=e(t.Highcharts,t.Highcharts.SeriesRegistry)}("u"<typeof window?this:window,function(t,e){return function(){"use strict";var r,n={512:function(t){t.exports=e},944:function(e){e.exports=t}},o={};function a(t){var e=o[t];if(void 0!==e)return e.exports;var r=o[t]={exports:{}};return n[t](r,r.exports,a),r.exports}a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,{a:e}),e},a.d=function(t,e){for(var r in e)a.o(e,r)&&!a.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)};var i={};a.d(i,{default:function(){return y}});var s=a(944),c=a.n(s),u=a(512),p=a.n(u),f={fillOpacity:1,lineWidth:0,marker:{enabled:!1},stacking:"stream"},h=(r=function(t,e){return(r=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),d=p().seriesTypes.areaspline,l=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return h(e,t),e.prototype.streamStacker=function(t,e,r){t[0]-=e.total/2,t[1]-=e.total/2,this.stackedYData&&(this.stackedYData[r]=Math.max.apply(0,t))},e.defaultOptions=(0,s.merge)(d.defaultOptions,f),e}(d);(0,s.addEvent)(l,"afterGetExtremes",function(t){t.dataExtremes.dataMin=-t.dataExtremes.dataMax}),(0,s.extend)(l.prototype,{negStacks:!1}),p().registerSeriesType("streamgraph",l);var y=c();return i.default}()});