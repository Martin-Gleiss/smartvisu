// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v13.0.0 (2026-06-11)
 * @module highcharts/modules/xrange
 * @requires highcharts
 *
 * X-range series
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Torstein Hønsi, Lars A. V. Cabrera
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(root["_Highcharts"], root["_Highcharts"]["Color"], root["_Highcharts"]["SeriesRegistry"]);
	else if(typeof define === 'function' && define.amd)
		define("highcharts/modules/xrange", ["highcharts/highcharts"], function (amd1) {return factory(amd1,amd1["Color"],amd1["SeriesRegistry"]);});
	else if(typeof exports === 'object')
		exports["highcharts/modules/xrange"] = factory(root["_Highcharts"], root["_Highcharts"]["Color"], root["_Highcharts"]["SeriesRegistry"]);
	else
		root["Highcharts"] = factory(root["Highcharts"], root["Highcharts"]["Color"], root["Highcharts"]["SeriesRegistry"]);
})(typeof window === 'undefined' ? this : window, function(__WEBPACK_EXTERNAL_MODULE__944__, __WEBPACK_EXTERNAL_MODULE__620__, __WEBPACK_EXTERNAL_MODULE__512__) {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 512:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__512__;

/***/ }),

/***/ 620:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__620__;

/***/ }),

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
  "default": function() { return /* binding */ xrange_src; }
});

// EXTERNAL MODULE: external {"amd":["highcharts/highcharts"],"commonjs":["highcharts"],"commonjs2":["highcharts"],"root":["Highcharts"]}
var highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_ = __webpack_require__(944);
var highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default = /*#__PURE__*/__webpack_require__.n(highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_);
// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","Color"],"commonjs":["highcharts","Color"],"commonjs2":["highcharts","Color"],"root":["Highcharts","Color"]}
var highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_ = __webpack_require__(620);
var highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_default = /*#__PURE__*/__webpack_require__.n(highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_);
// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","SeriesRegistry"],"commonjs":["highcharts","SeriesRegistry"],"commonjs2":["highcharts","SeriesRegistry"],"root":["Highcharts","SeriesRegistry"]}
var highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_ = __webpack_require__(512);
var highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default = /*#__PURE__*/__webpack_require__.n(highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_);
;// ./code/es5/es-modules/Series/XRange/XRangeSeriesDefaults.js
/* *
 *
 *  X-range series module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi, Lars A. V. Cabrera
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */


/* *
 *
 *  Constants
 *
 * */
/**
 * The X-range series displays ranges on the X axis, typically time
 * intervals with a start and end date.
 *
 * @sample {highcharts} highcharts/demo/x-range/
 *         X-range
 * @sample {highcharts} highcharts/css/x-range/
 *         Styled mode X-range
 * @sample {highcharts} highcharts/chart/inverted-xrange/
 *         Inverted X-range
 *
 * @extends      plotOptions.column
 * @since        6.0.0
 * @product      highcharts highstock gantt
 * @excluding    boostThreshold, crisp, cropThreshold, depth, edgeColor,
 *               edgeWidth, findNearestPointBy, getExtremesFromAll,
 *               negativeColor, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, softThreshold,
 *               stacking, threshold, data, dataSorting, boostBlending
 * @requires     modules/xrange
 * @optionparent plotOptions.xrange
 */
var XRangeSeriesDefaults = {
    /**
     * A partial fill for each point, typically used to visualize how much
     * of a task is performed. The partial fill object can be set either on
     * series or point level. When set as a number, works as
     * `{ amount: number }`.
     *
     * @sample {highcharts} highcharts/demo/x-range
     *         X-range with partial fill
     *
     * @product   highcharts highstock gantt
     * @apioption plotOptions.xrange.partialFill
     */
    /**
     * The fill color to be used for partial fills. Defaults to a darker
     * shade of the point color.
     *
     * @type      {Highcharts.ColorType}
     * @product   highcharts highstock gantt
     * @apioption plotOptions.xrange.partialFill.fill
     */
    /**
     * In an X-range series, this option makes all points of the same Y-axis
     * category the same color.
     */
    colorByPoint: true,
    dataLabels: {
        formatter: function () {
            var amount = this.partialFill;
            if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(amount)) {
                amount = amount.amount;
            }
            if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(amount) && amount > 0) {
                return (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.correctFloat)(amount * 100) + '%';
            }
        },
        inside: true,
        verticalAlign: 'middle',
        style: {
            whiteSpace: 'nowrap'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size: 0.8em">{ucfirst point.x} - {point.x2}</span><br/>',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.yCategory}</b><br/>'
    },
    borderRadius: 3,
    pointRange: 0
};
/* *
 *
 *  Export Default
 *
 * */
/* harmony default export */ var XRange_XRangeSeriesDefaults = (XRangeSeriesDefaults);
/* *
 *
 * API Options
 *
 * */
/**
 * An `xrange` series. If the [type](#series.xrange.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.xrange
 * @excluding boostThreshold, crisp, cropThreshold, depth, edgeColor, edgeWidth,
 *            findNearestPointBy, getExtremesFromAll, negativeColor,
 *            pointInterval, pointIntervalUnit, pointPlacement, pointRange,
 *            pointStart, softThreshold, stacking, threshold, dataSorting,
 *            boostBlending
 * @product   highcharts highstock gantt
 * @requires  modules/xrange
 * @apioption series.xrange
 */
/**
 * An array of data points for the series. For the `xrange` series type,
 * points can be given in the following ways:
 *
 * 1. An array of objects with named values. The objects are point configuration
 *    objects as seen below.
 *    ```js
 *    data: [{
 *        x: Date.UTC(2017, 0, 1),
 *        x2: Date.UTC(2017, 0, 3),
 *        name: "Test",
 *        y: 0,
 *        color: "#00FF00"
 *    }, {
 *        x: Date.UTC(2017, 0, 4),
 *        x2: Date.UTC(2017, 0, 5),
 *        name: "Deploy",
 *        y: 1,
 *        color: "#FF0000"
 *    }]
 *    ```
 *
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @basic
 * @declare   Highcharts.XrangePointOptionsObject
 * @type      {Array<*>}
 * @extends   series.line.data
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data
 */
/**
 * The starting X value of the range point.
 *
 * @sample {highcharts} highcharts/demo/x-range
 *         X-range
 *
 * @type      {number}
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.x
 */
/**
 * The ending X value of the range point.
 *
 * @sample {highcharts} highcharts/demo/x-range
 *         X-range
 *
 * @type      {number}
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.x2
 */
/**
 * The Y value of the range point.
 *
 * @sample {highcharts} highcharts/demo/x-range
 *         X-range
 *
 * @type      {number}
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.y
 */
/**
 * A partial fill for each point, typically used to visualize how much of
 * a task is performed. The partial fill object can be set either on series
 * or point level.
 *
 * @sample {highcharts} highcharts/demo/x-range
 *         X-range with partial fill
 *
 * @declare   Highcharts.XrangePointPartialFillOptionsObject
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.partialFill
 */
/**
 * The amount of the X-range point to be filled. Values can be 0-1 and are
 * converted to percentages in the default data label formatter.
 *
 * @type      {number}
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.partialFill.amount
 */
/**
 * The fill color to be used for partial fills. Defaults to a darker shade
 * of the point color.
 *
 * @type      {Highcharts.ColorType}
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.partialFill.fill
 */
(''); // Adds doclets above to transpiled file

;// ./code/es5/es-modules/Series/XRange/XRangePoint.js
/* *
 *
 *  X-range series module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi, Lars A. V. Cabrera
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d,
        b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d,
        b) { d.__proto__ = b; }) ||
                function (d,
        b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var ColumnPoint = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes.column.prototype.pointClass;

/* *
 *
 *  Class
 *
 * */
var XRangePoint = /** @class */ (function (_super) {
    __extends(XRangePoint, _super);
    /**
     * Extend init to have y default to 0.
     *
     * @private
     */
    function XRangePoint(series, options, x) {
        var _this = _super.call(this,
            series,
            options,
            x) || this;
        _this.y || (_this.y = 0);
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Return color of a point based on its category.
     *
     * @private
     * @function getColorByCategory
     *
     * @param {object} series
     *        The series which the point belongs to.
     *
     * @param {object} point
     *        The point to calculate its color for.
     *
     * @return {object}
     *         Returns an object containing the properties color and colorIndex.
     */
    XRangePoint.getColorByCategory = function (series, point) {
        var chart = series.chart,
            colors = series.options.colors ||
                chart.options.colors,
            colorCount = colors ?
                colors.length :
                (chart.options.chart.colorCount || 1),
            colorIndex = (point.y || 0) % colorCount,
            color = colors === null || colors === void 0 ? void 0 : colors[colorIndex];
        return {
            colorIndex: colorIndex,
            color: color
        };
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * @private
     */
    XRangePoint.prototype.resolveColor = function () {
        var series = this.series;
        if (series.options.colorByPoint && !this.options.color) {
            var colorByPoint = XRangePoint.getColorByCategory(series,
                this);
            if (!series.chart.styledMode) {
                this.color = colorByPoint.color;
            }
            if (typeof this.options.colorIndex === 'undefined' ||
                this.options.colorIndex === null) {
                this.colorIndex = colorByPoint.colorIndex;
            }
        }
        else {
            this.color = this.options.color || series.color;
        }
    };
    /**
     * Extend applyOptions to handle time strings for x2
     *
     * @private
     */
    XRangePoint.prototype.applyOptions = function (options, x) {
        var _a;
        _super.prototype.applyOptions.call(this, options, x);
        this.x2 = this.series.chart.time.parse(this.x2);
        this.isNull = !((_a = this.isValid) === null || _a === void 0 ? void 0 : _a.call(this));
        this.formatPrefix = this.isNull ? 'null' : 'point'; // #23605
        return this;
    };
    /**
     * @private
     */
    XRangePoint.prototype.setState = function () {
        _super.prototype.setState.apply(this, arguments);
        this.series.drawPoint(this, this.series.getAnimationVerb());
    };
    /**
     * @private
     */
    XRangePoint.prototype.isValid = function () {
        return typeof this.x === 'number' &&
            typeof this.x2 === 'number';
    };
    return XRangePoint;
}(ColumnPoint));
(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(XRangePoint.prototype, {
    ttBelow: false,
    tooltipDateKeys: ['x', 'x2']
});
/* *
 *
 *  Class Namespace
 *
 * */
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var XRange_XRangePoint = (XRangePoint);
/* *
 *
 *  API Declarations
 *
 * */
/**
 * The ending X value of the range point.
 * @name Highcharts.Point#x2
 * @type {number|undefined}
 * @requires modules/xrange
 */
/**
 * @interface Highcharts.PointOptionsObject in parts/Point.ts
 */ /**
* The ending X value of the range point.
* @name Highcharts.PointOptionsObject#x2
* @type {number|undefined}
* @requires modules/xrange
*/
(''); // Keeps doclets above in JS file

;// ./code/es5/es-modules/Series/XRange/XRangeSeries.js
/* *
 *
 *  X-range series module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi, Lars A. V. Cabrera
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

var XRangeSeries_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d,
        b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d,
        b) { d.__proto__ = b; }) ||
                function (d,
        b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b,
        p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var composed = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).composed, noop = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).noop;

var color = (highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_default()).parse;

var ColumnSeries = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes.column;



/* *
 *
 *  Functions
 *
 * */
/**
 * Max x2 should be considered in xAxis extremes
 * @private
 */
function onAxisAfterGetSeriesExtremes() {
    var time = this.chart.time;
    var dataMax,
        modMax;
    if (this.isXAxis) {
        dataMax = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(this.dataMax, -Number.MAX_VALUE);
        for (var _i = 0, _a = this.series; _i < _a.length; _i++) {
            var series = _a[_i];
            var column = (series.dataTable.getColumn('x2',
                true) ||
                    series.dataTable.getColumn('end',
                true) ||
                    []);
            for (var _b = 0, _c = column; _b < _c.length; _b++) {
                var val = _c[_b];
                if (typeof val === 'string') {
                    val = time.parse(val);
                }
                if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(val) && val > dataMax) {
                    dataMax = val;
                    modMax = true;
                }
            }
        }
        if (modMax) {
            this.dataMax = dataMax;
        }
    }
}
/* *
 *
 *  Class
 *
 * */
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.xrange
 *
 * @augments Highcharts.Series
 */
var XRangeSeries = /** @class */ (function (_super) {
    XRangeSeries_extends(XRangeSeries, _super);
    function XRangeSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    XRangeSeries.compose = function (AxisClass) {
        if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pushUnique)(composed, 'Series.XRange')) {
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(AxisClass, 'afterGetSeriesExtremes', onAxisAfterGetSeriesExtremes);
        }
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * @private
     */
    XRangeSeries.prototype.init = function () {
        _super.prototype.init.apply(this, arguments);
        this.options.stacking = void 0; // #13161
    };
    /**
     * Borrow the column series metrics, but with swapped axes. This gives
     * free access to features like groupPadding, grouping, pointWidth etc.
     * @private
     */
    XRangeSeries.prototype.getColumnMetrics = function () {
        var _this = this;
        var swapAxes = function () {
                for (var _i = 0,
            _a = _this.chart.series; _i < _a.length; _i++) {
                    var series = _a[_i];
                var xAxis = series.xAxis;
                series.xAxis = series.yAxis;
                series.yAxis = xAxis;
            }
        };
        swapAxes();
        var metrics = _super.prototype.getColumnMetrics.call(this);
        swapAxes();
        return metrics;
    };
    /**
     * Override cropData to show a point where x or x2 is outside visible range,
     * but one of them is inside.
     * @private
     */
    XRangeSeries.prototype.cropData = function (table, min, max) {
        // Replace xData with x2Data to find the appropriate cropStart
        var xData = table.getColumn('x') || [], x2Data = table.getColumn('x2');
        table.setColumn('x', x2Data, void 0, { silent: true });
        var croppedData = _super.prototype.cropData.call(this,
            table,
            min,
            max);
        // Re-insert the cropped xData
        table.setColumn('x', xData.slice(croppedData.start, croppedData.end), void 0, { silent: true });
        return croppedData;
    };
    /**
     * Finds the index of an existing point that matches the given point
     * options.
     *
     * @private
     *
     * @param {Highcharts.XRangePointOptions} options
     *        The options of the point.
     *
     * @return {number|undefined}
     *         Returns index of a matching point, or undefined if no match is
     *         found.
     */
    XRangeSeries.prototype.findPointIndex = function (options) {
        var _a = this,
            cropStart = _a.cropStart,
            points = _a.points;
        var id = options.id;
        var pointIndex;
        if (id) {
            var point = (0,
                highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.find)(points,
                function (point) { return point.id === id; });
            pointIndex = point ? point.index : void 0;
        }
        if (typeof pointIndex === 'undefined') {
            var point = (0,
                highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.find)(points,
                function (point) { return (point.x === options.x &&
                    point.x2 === options.x2 &&
                    !point.touched); });
            pointIndex = point ? point.index : void 0;
        }
        // Reduce pointIndex if data is cropped
        if (this.cropped &&
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(pointIndex) &&
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(cropStart) &&
            pointIndex >= cropStart) {
            pointIndex -= cropStart;
        }
        return pointIndex;
    };
    XRangeSeries.prototype.alignDataLabel = function (point) {
        var _a,
            _b;
        var oldPlotX = point.plotX;
        point.plotX = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)((_a = point.dlBox) === null || _a === void 0 ? void 0 : _a.centerX, point.plotX);
        if (point.dataLabel && ((_b = point.shapeArgs) === null || _b === void 0 ? void 0 : _b.width)) {
            point.dataLabel.css({
                width: "" + point.shapeArgs.width + "px"
            });
        }
        _super.prototype.alignDataLabel.apply(this, arguments);
        point.plotX = oldPlotX;
    };
    /**
     * @private
     */
    XRangeSeries.prototype.translatePoint = function (point) {
        var _a,
            _b,
            _c,
            _d;
        var xAxis = this.xAxis,
            yAxis = this.yAxis,
            metrics = this.columnMetrics,
            options = this.options,
            minPointLength = options.minPointLength || 0,
            oldColWidth = (((_a = point.shapeArgs) === null || _a === void 0 ? void 0 : _a.width) || 0) / 2,
            seriesXOffset = this.pointXOffset = metrics.offset,
            posX = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(point.x2,
            point.x + (point.len || 0)),
            borderRadius = options.borderRadius,
            plotTop = this.chart.plotTop,
            plotLeft = this.chart.plotLeft;
        var plotX = point.plotX,
            plotX2 = xAxis.translate(posX, 0, 0, 0, 1);
        var length = Math.abs(plotX2 - plotX),
            inverted = this.chart.inverted,
            borderWidth = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(options.borderWidth, 1);
        var widthDifference,
            partialFill,
            yOffset = metrics.offset,
            pointHeight = Math.round(metrics.width),
            dlLeft,
            dlRight,
            dlWidth,
            clipRectWidth;
        if (minPointLength) {
            widthDifference = minPointLength - length;
            if (widthDifference < 0) {
                widthDifference = 0;
            }
            plotX -= widthDifference / 2;
            plotX2 += widthDifference / 2;
        }
        plotX = Math.max(plotX, -10);
        plotX2 = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.clamp)(plotX2, -10, xAxis.len + 10);
        // Handle individual pointWidth
        if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(point.options.pointWidth)) {
            yOffset -= ((Math.ceil(point.options.pointWidth) - pointHeight) / 2);
            pointHeight = Math.ceil(point.options.pointWidth);
        }
        // Apply pointPlacement to the Y axis
        if (options.pointPlacement &&
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(point.plotY) &&
            yAxis.categories) {
            point.plotY = yAxis.translate(point.y, 0, 1, 0, 1, options.pointPlacement);
        }
        var x = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.crisp)(Math.min(plotX,
            plotX2),
            borderWidth),
            x2 = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.crisp)(Math.max(plotX,
            plotX2),
            borderWidth),
            width = x2 - x;
        var r = Math.min((0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.relativeLength)((typeof borderRadius === 'object' ?
                borderRadius.radius :
                borderRadius || 0),
            pointHeight),
            Math.min(width,
            pointHeight) / 2);
        var shapeArgs = {
                x: x,
                y: (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.crisp)((point.plotY || 0) + yOffset,
            borderWidth),
                width: width,
                height: pointHeight,
                r: r
            };
        point.shapeArgs = shapeArgs;
        // Move tooltip to default position
        if (!inverted) {
            point.tooltipPos[0] -= oldColWidth +
                seriesXOffset -
                shapeArgs.width / 2;
        }
        else {
            point.tooltipPos[1] += seriesXOffset +
                oldColWidth;
        }
        // Align data labels inside the shape and inside the plot area
        dlLeft = shapeArgs.x;
        dlRight = dlLeft + shapeArgs.width;
        if (dlLeft < 0 || dlRight > xAxis.len) {
            dlLeft = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.clamp)(dlLeft, 0, xAxis.len);
            dlRight = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.clamp)(dlRight, 0, xAxis.len);
            dlWidth = dlRight - dlLeft;
            point.dlBox = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(shapeArgs, {
                x: dlLeft,
                width: dlRight - dlLeft,
                centerX: dlWidth ? dlWidth / 2 : null
            });
        }
        else {
            point.dlBox = null;
        }
        // Tooltip position
        var tooltipPos = point.tooltipPos;
        var xIndex = !inverted ? 0 : 1;
        var yIndex = !inverted ? 1 : 0;
        var tooltipYOffset = (this.columnMetrics ?
                this.columnMetrics.offset :
                -metrics.width / 2);
        // Centering tooltip position (#14147)
        if (inverted) {
            tooltipPos[xIndex] += shapeArgs.width / 2;
        }
        else {
            tooltipPos[xIndex] = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.clamp)(tooltipPos[xIndex] +
                (xAxis.reversed ? -1 : 0) * shapeArgs.width, xAxis.left - plotLeft, xAxis.left + xAxis.len - plotLeft - 1);
        }
        tooltipPos[yIndex] = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.clamp)(tooltipPos[yIndex] + ((inverted ? -1 : 1) * tooltipYOffset), yAxis.top - plotTop, yAxis.top + yAxis.len - plotTop - 1);
        // Add a partShapeArgs to the point, based on the shapeArgs property
        partialFill = (_b = point.partialFill) !== null && _b !== void 0 ? _b : 0;
        if (partialFill) {
            // Get the partial fill amount
            if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(partialFill)) {
                partialFill = partialFill.amount || 0;
            }
            // If it was not a number, assume 0
            if (!(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(partialFill)) {
                partialFill = 0;
            }
            point.partShapeArgs = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(shapeArgs);
            clipRectWidth = Math.max(Math.round(length * partialFill + point.plotX -
                plotX), 0);
            point.clipRectArgs = {
                x: xAxis.reversed ? // #10717
                    shapeArgs.x + length - clipRectWidth :
                    shapeArgs.x,
                y: shapeArgs.y,
                width: clipRectWidth,
                height: shapeArgs.height
            };
        }
        // Add formatting keys for tooltip and data labels. Use 'category' as
        // 'key' to ensure tooltip datetime formatting. Use 'name' only when
        // 'category' is undefined.
        point.key = point.category || point.name;
        point.yCategory = (_c = yAxis.categories) === null || _c === void 0 ? void 0 : _c[(_d = point.y) !== null && _d !== void 0 ? _d : -1];
    };
    /**
     * @private
     */
    XRangeSeries.prototype.translate = function () {
        _super.prototype.translate.apply(this, arguments);
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var point = _a[_i];
            this.translatePoint(point);
        }
    };
    /**
     * Draws a single point in the series. Needed for partial fill.
     *
     * This override turns point.graphic into a group containing the
     * original graphic and an overlay displaying the partial fill.
     *
     * @private
     *
     * @param {Highcharts.Point} point
     *        An instance of Point in the series.
     *
     * @param {"animate"|"attr"} verb
     *        'animate' (animates changes) or 'attr' (sets options)
     */
    XRangeSeries.prototype.drawPoint = function (point, verb) {
        var seriesOpts = this.options,
            renderer = this.chart.renderer,
            type = point.shapeType,
            shapeArgs = point.shapeArgs,
            partShapeArgs = point.partShapeArgs,
            clipRectArgs = point.clipRectArgs,
            pointState = point.state,
            stateOpts = (seriesOpts.states[pointState || 'normal'] ||
                {}),
            pointStateVerb = typeof pointState === 'undefined' ?
                'attr' : verb,
            pointAttr = this.pointAttribs(point,
            pointState),
            animation = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(this.chart.options.chart.animation,
            stateOpts.animation);
        var graphic = point.graphic,
            pfOptions = point.partialFill;
        if (!point.isNull && point.visible !== false) {
            var className = point.getClassName();
            // Original graphic
            if (graphic) { // Update
                graphic.rect[verb](shapeArgs);
            }
            else {
                point.graphic = graphic = renderer.g('point')
                    .add(point.group || this.group);
                graphic.rect = renderer[type]((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(shapeArgs))
                    .add(graphic);
            }
            graphic.addClass(className + (pointState && pointState !== 'select' ?
                ' highcharts-point-' + pointState :
                ''), true);
            graphic.rect.addClass(className + ' highcharts-partfill-original', true);
            // Partial fill graphic
            if (partShapeArgs) {
                if (graphic.partRect) {
                    graphic.partRect[verb]((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(partShapeArgs));
                    graphic.partialClipRect[verb]((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(clipRectArgs));
                }
                else {
                    graphic.partialClipRect = renderer.clipRect(clipRectArgs.x, clipRectArgs.y, clipRectArgs.width, clipRectArgs.height);
                    graphic.partRect =
                        renderer[type](partShapeArgs)
                            .addClass('highcharts-partfill-overlay')
                            .add(graphic)
                            .clip(graphic.partialClipRect);
                }
            }
            // Presentational
            if (!this.chart.styledMode) {
                graphic
                    .rect[verb](pointAttr, animation)
                    .shadow(seriesOpts.shadow);
                if (partShapeArgs) {
                    // Ensure pfOptions is an object
                    if (!(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(pfOptions)) {
                        pfOptions = {};
                    }
                    if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(seriesOpts.partialFill)) {
                        pfOptions = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(seriesOpts.partialFill, pfOptions);
                    }
                    var fill = (pfOptions.fill ||
                            color(pointAttr.fill).brighten(-0.3).get() ||
                            color(point.color || this.color)
                                .brighten(-0.3).get());
                    pointAttr.fill = fill;
                    graphic
                        .partRect[pointStateVerb](pointAttr, animation)
                        .shadow(seriesOpts.shadow);
                }
            }
        }
        else if (graphic) {
            point.graphic = graphic.destroy(); // #1269
        }
    };
    /**
     * @private
     */
    XRangeSeries.prototype.drawPoints = function () {
        var verb = this.getAnimationVerb();
        // Draw the columns
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var point = _a[_i];
            this.drawPoint(point, verb);
        }
    };
    /**
     * Returns "animate", or "attr" if the number of points is above the
     * animation limit.
     *
     * @private
     */
    XRangeSeries.prototype.getAnimationVerb = function () {
        return (this.chart.pointCount < (this.options.animationLimit || 250) ?
            'animate' :
            'attr');
    };
    /**
     * @private
     */
    XRangeSeries.prototype.isPointInside = function (point) {
        var shapeArgs = point.shapeArgs,
            plotX = point.plotX,
            plotY = point.plotY;
        if (!shapeArgs) {
            return _super.prototype.isPointInside.apply(this, arguments);
        }
        var isInside = typeof plotX !== 'undefined' &&
                typeof plotY !== 'undefined' &&
                plotY >= 0 &&
                plotY <= this.yAxis.len &&
                (shapeArgs.x || 0) + (shapeArgs.width || 0) >= 0 &&
                plotX <= this.xAxis.len;
        return isInside;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    XRangeSeries.defaultOptions = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(ColumnSeries.defaultOptions, XRange_XRangeSeriesDefaults);
    return XRangeSeries;
}(ColumnSeries));
(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(XRangeSeries.prototype, {
    pointClass: XRange_XRangePoint,
    pointArrayMap: ['x2', 'y'],
    getExtremesFromAll: true,
    keysAffectYAxis: ['y'],
    parallelArrays: ['x', 'x2', 'y'],
    requireSorting: false,
    type: 'xrange',
    animate: (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).series.prototype.animate,
    autoIncrement: noop,
    buildKDTree: noop
});
highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default().registerSeriesType('xrange', XRangeSeries);
/* *
 *
 * Default Export
 *
 * */
/* harmony default export */ var XRange_XRangeSeries = (XRangeSeries);

;// ./code/es5/es-modules/masters/modules/xrange.src.js




var G = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default());
XRange_XRangeSeries.compose(G.Axis);
/* harmony default export */ var xrange_src = ((highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()));

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});