!/**
 * Highcharts Gantt JS v13.0.0 (2026-06-11)
 * @module highcharts/modules/current-date-indicator
 * @requires highcharts
 *
 * CurrentDateIndicator
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Lars A. V. Cabrera
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(t._Highcharts):"function"==typeof define&&define.amd?define("highcharts/modules/current-date-indicator",["highcharts/highcharts"],function(t){return e(t)}):"object"==typeof exports?exports["highcharts/modules/current-date-indicator"]=e(t._Highcharts):t.Highcharts=e(t.Highcharts)}("u"<typeof window?this:window,function(t){return function(){"use strict";var e,r,n={944:function(e){e.exports=t}},o={};function i(t){var e=o[t];if(void 0!==e)return e.exports;var r=o[t]={exports:{}};return n[t](r,r.exports,i),r.exports}i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,{a:e}),e},i.d=function(t,e){for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)};var a={};i.d(a,{default:function(){return f}});var s=i(944),u=i.n(s),c=u().composed,l={color:"var(--highcharts-highlight-color-20)",width:2,label:{format:"%[abdYHM]",formatter:function(t,e){return this.axis.chart.time.dateFormat(e||"",t,!0)},rotation:0,style:{fontSize:"0.7em"}}},h=u();e=h.Axis,r=h.PlotLineOrBand,(0,s.pushUnique)(c,"CurrentDateIndication")&&((0,s.addEvent)(e,"afterSetOptions",function(){var t=this.options,e=t.currentDateIndicator;if(e){var r="object"==typeof e?(0,s.merge)(l,e):(0,s.merge)(l);r.value=Date.now(),r.className="highcharts-current-date-indicator",null!=t.plotLines||(t.plotLines=[]),t.plotLines.push(r)}}),(0,s.addEvent)(r,"render",function(){var t;null==(t=this.label)||t.attr({text:this.getLabelText(this.options.label||{})})}),(0,s.wrap)(r.prototype,"getLabelText",function(t,e){var r,n,o;if(this.options.className&&-1!==this.options.className.indexOf("highcharts-current-date-indicator")&&"function"==typeof(null==(r=this.options.label)?void 0:r.formatter)){var i=this.options;return i.value=Date.now(),(null==(o=null==(n=i.label)?void 0:n.formatter)?void 0:o.call(this,i.value,i.label.format,this))||""}return t.call(this,e)}));var f=u();return a.default}()});