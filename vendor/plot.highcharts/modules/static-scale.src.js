// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts Gantt JS v13.0.0 (2026-06-11)
 * @module highcharts/modules/static-scale
 * @requires highcharts
 *
 * StaticScale
 *
 * (c) 2016-2026 Highsoft AS
 * Author: Torstein Hønsi, Lars A. V. Cabrera
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(root["_Highcharts"]);
	else if(typeof define === 'function' && define.amd)
		define("highcharts/modules/static-scale", ["highcharts/highcharts"], function (amd1) {return factory(amd1);});
	else if(typeof exports === 'object')
		exports["highcharts/modules/static-scale"] = factory(root["_Highcharts"]);
	else
		root["Highcharts"] = factory(root["Highcharts"]);
})(typeof window === 'undefined' ? this : window, function(__WEBPACK_EXTERNAL_MODULE__944__) {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 944:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__944__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ static_scale_src; }
});

// EXTERNAL MODULE: external {"amd":["highcharts/highcharts"],"commonjs":["highcharts"],"commonjs2":["highcharts"],"root":["Highcharts"]}
var highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_ = __webpack_require__(944);
var highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default = /*#__PURE__*/__webpack_require__.n(highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_);
;// ./code/es5/es-modules/Extensions/StaticScale.js
/* *
 *
 *  (c) 2016-2026 Highsoft AS
 *  Author: Torstein Hønsi, Lars Cabrera
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */



var composed = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).composed;
/* *
 *
 *  Composition
 *
 * */
/** @internal */
function composeStaticScale(AxisClass, ChartClass) {
    if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pushUnique)(composed, 'StaticScale')) {
        var chartProto = ChartClass.prototype;
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(AxisClass, 'afterSetOptions', onAxisAfterSetOptions);
        chartProto.adjustHeight = chartAdjustHeight;
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(ChartClass, 'render', chartProto.adjustHeight);
    }
}
/** @internal */
function onAxisAfterSetOptions() {
    var _a;
    var chartOptions = this.chart.userOptions.chart;
    if (!this.horiz &&
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(this.options.staticScale) &&
        (!(chartOptions === null || chartOptions === void 0 ? void 0 : chartOptions.height) ||
            ((_a = chartOptions.scrollablePlotArea) === null || _a === void 0 ? void 0 : _a.minHeight))) {
        this.staticScale = this.options.staticScale;
    }
}
/** @internal */
function chartAdjustHeight() {
    var _a,
        _b;
    var chart = this;
    if (chart.redrawTrigger !== 'adjustHeight') {
        var _loop_1 = function (axis) {
                var chart_1 = axis.chart,
            staticScale = axis.options.staticScale;
            if (axis.staticScale &&
                staticScale &&
                (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(axis.min) &&
                (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(axis.max)) {
                var height = ((_b = (_a = axis.brokenAxis) === null || _a === void 0 ? void 0 : _a.unitLength) !== null && _b !== void 0 ? _b : (axis.max + axis.tickInterval - axis.min)) * staticScale;
                // Minimum height is 1 x staticScale.
                height = Math.max(height, staticScale);
                var diff = height - chart_1.plotHeight;
                if (!chart_1.scrollablePixelsY && Math.abs(diff) >= 1) {
                    chart_1.plotHeight = height;
                    chart_1.redrawTrigger = 'adjustHeight';
                    chart_1.setSize(void 0, chart_1.chartHeight + diff, chart_1.initiatedScale ? void 0 : false);
                }
                // Make sure clip rects have the right height before initial
                // animation.
                axis.series.forEach(function (series) {
                    var clipRect = series.sharedClipKey &&
                            chart_1.sharedClips[series.sharedClipKey];
                    if (clipRect) {
                        clipRect.attr(chart_1.inverted ? {
                            width: chart_1.plotHeight
                        } : {
                            height: chart_1.plotHeight
                        });
                    }
                });
            }
        };
        for (var _i = 0, _c = (chart.axes || []); _i < _c.length; _i++) {
            var axis = _c[_i];
            _loop_1(axis);
        }
        this.initiatedScale = true;
    }
    this.redrawTrigger = void 0;
}
/* *
 *
 *  API Options
 *
 * */
/**
 * For vertical axes only. Setting the static scale ensures that each tick unit
 * is translated into a fixed pixel height. For example, setting the static
 * scale to 24 results in each Y axis category taking up 24 pixels, and the
 * height of the chart adjusts. Adding or removing items will make the chart
 * resize.
 *
 * @sample {gantt} gantt/xrange-series/demo/
 *         X-range series with static scale
 * @sample {highcharts} highcharts/xaxis/staticscale
 *         Static scale on X axis (horizontal bar chart)
 *
 * @requires  modules/static-scale
 * @type      {number}
 * @default   50
 * @since     6.2.0
 * @product   highcharts highstock gantt
 * @apioption xAxis.staticScale
 */
''; // Keeps doclets above in JS file

;// ./code/es5/es-modules/masters/modules/static-scale.src.js




var G = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default());
composeStaticScale(G.Axis, G.Chart);
/* harmony default export */ var static_scale_src = ((highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()));

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});