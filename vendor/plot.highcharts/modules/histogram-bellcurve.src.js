// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v13.0.0 (2026-06-11)
 * @module highcharts/modules/histogram-bellcurve
 * @requires highcharts
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Sebastian Domas
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(root["_Highcharts"], root["_Highcharts"]["Series"], root["_Highcharts"]["SeriesRegistry"]);
	else if(typeof define === 'function' && define.amd)
		define("highcharts/modules/histogram-bellcurve", ["highcharts/highcharts"], function (amd1) {return factory(amd1,amd1["Series"],amd1["SeriesRegistry"]);});
	else if(typeof exports === 'object')
		exports["highcharts/modules/histogram-bellcurve"] = factory(root["_Highcharts"], root["_Highcharts"]["Series"], root["_Highcharts"]["SeriesRegistry"]);
	else
		root["Highcharts"] = factory(root["Highcharts"], root["Highcharts"]["Series"], root["Highcharts"]["SeriesRegistry"]);
})(typeof window === 'undefined' ? this : window, function(__WEBPACK_EXTERNAL_MODULE__944__, __WEBPACK_EXTERNAL_MODULE__820__, __WEBPACK_EXTERNAL_MODULE__512__) {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 512:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__512__;

/***/ }),

/***/ 820:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__820__;

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
  "default": function() { return /* binding */ histogram_bellcurve_src; }
});

// EXTERNAL MODULE: external {"amd":["highcharts/highcharts"],"commonjs":["highcharts"],"commonjs2":["highcharts"],"root":["Highcharts"]}
var highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_ = __webpack_require__(944);
var highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default = /*#__PURE__*/__webpack_require__.n(highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_);
// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","Series"],"commonjs":["highcharts","Series"],"commonjs2":["highcharts","Series"],"root":["Highcharts","Series"]}
var highcharts_Series_commonjs_highcharts_Series_commonjs2_highcharts_Series_root_Highcharts_Series_ = __webpack_require__(820);
var highcharts_Series_commonjs_highcharts_Series_commonjs2_highcharts_Series_root_Highcharts_Series_default = /*#__PURE__*/__webpack_require__.n(highcharts_Series_commonjs_highcharts_Series_commonjs2_highcharts_Series_root_Highcharts_Series_);
;// ./code/es5/es-modules/Series/DerivedComposition.js
/* *
 *
 *
 * */


var noop = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).noop;


/* *
 *
 *  Composition
 *
 * */
/**
 * Provides methods for auto setting/updating series data based on the based
 * series data.
 * @private
 */
var DerivedComposition;
(function (DerivedComposition) {
    /* *
     *
     *  Declarations
     *
     * */
    /* *
     *
     *  Constants
     *
     * */
    DerivedComposition.hasDerivedData = true;
    /**
     * Method to be implemented - inside the method the series has already
     * access to the base series via m `this.baseSeries` and the bases data is
     * initialised. It should return data in the format accepted by
     * `Series.setData()` method
     * @private
     */
    DerivedComposition.setDerivedData = noop;
    /* *
     *
     *  Functions
     *
     * */
    /**
     * @private
     */
    function compose(SeriesClass) {
        var seriesProto = SeriesClass.prototype;
        seriesProto.addBaseSeriesEvents = addBaseSeriesEvents;
        seriesProto.addEvents = addEvents;
        seriesProto.destroy = destroy;
        seriesProto.init = init;
        seriesProto.setBaseSeries = setBaseSeries;
        return SeriesClass;
    }
    DerivedComposition.compose = compose;
    /**
     * Initialise series
     * @private
     */
    function init() {
        highcharts_Series_commonjs_highcharts_Series_commonjs2_highcharts_Series_root_Highcharts_Series_default().prototype.init.apply(this, arguments);
        this.initialised = false;
        this.baseSeries = null;
        this.eventRemovers = [];
        this.addEvents();
    }
    DerivedComposition.init = init;
    /**
     * Sets base series for the series
     * @private
     */
    function setBaseSeries() {
        var chart = this.chart,
            baseSeriesOptions = this.options.baseSeries,
            baseSeries = ((0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(baseSeriesOptions) &&
                (chart.series[baseSeriesOptions] ||
                    chart.get(baseSeriesOptions)));
        this.baseSeries = baseSeries || null;
    }
    DerivedComposition.setBaseSeries = setBaseSeries;
    /**
     * Adds events for the series
     * @private
     */
    function addEvents() {
        var _this = this;
        this.eventRemovers.push((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(this.chart, 'afterLinkSeries', function () {
            _this.setBaseSeries();
            if (_this.baseSeries && !_this.initialised) {
                _this.setDerivedData();
                _this.addBaseSeriesEvents();
                _this.initialised = true;
            }
        }));
    }
    DerivedComposition.addEvents = addEvents;
    /**
     * Adds events to the base series - it required for recalculating the data
     * in the series if the base series is updated / removed / etc.
     * @private
     */
    function addBaseSeriesEvents() {
        var _this = this;
        this.eventRemovers.push((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(this.baseSeries, 'updatedData', function () {
            _this.setDerivedData();
        }), (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(this.baseSeries, 'destroy', function () {
            _this.baseSeries = null;
            _this.initialised = false;
        }));
    }
    DerivedComposition.addBaseSeriesEvents = addBaseSeriesEvents;
    /**
     * Destroys the series
     * @private
     */
    function destroy() {
        this.eventRemovers.forEach(function (remover) {
            remover();
        });
        highcharts_Series_commonjs_highcharts_Series_commonjs2_highcharts_Series_root_Highcharts_Series_default().prototype.destroy.apply(this, arguments);
    }
    DerivedComposition.destroy = destroy;
})(DerivedComposition || (DerivedComposition = {}));
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Series_DerivedComposition = (DerivedComposition);

;// ./code/es5/es-modules/Series/Histogram/HistogramSeriesDefaults.js
/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Sebastian Domas
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  API Options
 *
 * */
/**
 * A histogram is a column series which represents the distribution of the
 * data set in the base series. Histogram splits data into bins and shows
 * their frequencies.
 *
 * @sample {highcharts} highcharts/demo/histogram/
 *         Histogram
 *
 * @extends      plotOptions.column
 * @excluding    boostThreshold, dragDrop, pointInterval, pointIntervalUnit,
 *               stacking, boostBlending
 * @product      highcharts
 * @since        6.0.0
 * @requires     modules/histogram-bellcurve
 * @optionparent plotOptions.histogram
 */
var HistogramSeriesDefaults = {
    /**
     * A preferable number of bins. It is a suggestion, so a histogram may
     * have a different number of bins. By default it is set to the square
     * root of the base series' data length. Available options are:
     * `square-root`, `sturges`, `rice`. You can also define a function
     * which takes a `baseSeries` as a parameter and should return a
     * positive integer.
     *
     * @type {"square-root"|"sturges"|"rice"|number|Function}
     */
    binsNumber: 'square-root',
    /**
     * Width of each bin. By default the bin's width is calculated as
     * `(max - min) / number of bins`. This option takes precedence over
     * [binsNumber](#plotOptions.histogram.binsNumber).
     *
     * @type {number}
     */
    binWidth: void 0,
    pointPadding: 0,
    groupPadding: 0,
    grouping: false,
    pointPlacement: 'between',
    tooltip: {
        headerFormat: '',
        pointFormat: ('<span style="font-size: 0.8em">{point.x} - {point.x2}' +
            '</span><br/>' +
            '<span style="color:{point.color}">\u25CF</span>' +
            ' {series.name} <b>{point.y}</b><br/>')
    }
};
/**
 * A `histogram` series. If the [type](#series.histogram.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.histogram
 * @excluding data, dataParser, dataURL, boostThreshold, boostBlending
 * @product   highcharts
 * @since     6.0.0
 * @requires  modules/histogram-bellcurve
 * @apioption series.histogram
 */
/**
 * An integer identifying the index to use for the base series, or a string
 * representing the id of the series.
 *
 * @type      {number|string}
 * @apioption series.histogram.baseSeries
 */
''; // Keeps doclets above separate
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Histogram_HistogramSeriesDefaults = (HistogramSeriesDefaults);

// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","SeriesRegistry"],"commonjs":["highcharts","SeriesRegistry"],"commonjs2":["highcharts","SeriesRegistry"],"root":["Highcharts","SeriesRegistry"]}
var highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_ = __webpack_require__(512);
var highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default = /*#__PURE__*/__webpack_require__.n(highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_);
;// ./code/es5/es-modules/Series/Histogram/HistogramSeries.js
/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Sebastian Domas
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



var ColumnSeries = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes.column;

/* ************************************************************************** *
 *  HISTOGRAM
 * ************************************************************************** */
/**
 * A dictionary with formulas for calculating number of bins based on data
 **/
var binsNumberFormulas = {
    'square-root': function (data) {
        return Math.ceil(Math.sqrt(data.length));
    },
    'sturges': function (data) {
        return Math.ceil(Math.log(data.length) * Math.LOG2E);
    },
    'rice': function (data) {
        return Math.ceil(2 * Math.pow(data.length, 1 / 3));
    }
};
/**
 * Returns a function for mapping number to the closed (right opened) bins
 * @private
 * @param {Array<number>} bins
 * Width of the bins
 */
function fitToBinLeftClosed(bins) {
    return function (y) {
        var i = 1;
        while (bins[i] <= y) {
            i++;
        }
        return bins[--i];
    };
}
/* *
 *
 *  Class
 *
 * */
/**
 * Histogram class
 * @private
 * @class
 * @name Highcharts.seriesTypes.histogram
 * @augments Highcharts.Series
 */
var HistogramSeries = /** @class */ (function (_super) {
    __extends(HistogramSeries, _super);
    function HistogramSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Functions
     *
     * */
    HistogramSeries.prototype.binsNumber = function (data) {
        var binsNumberOption = this.options.binsNumber;
        var binsNumber = binsNumberFormulas[binsNumberOption] ||
                // #7457
                (typeof binsNumberOption === 'function' && binsNumberOption);
        return Math.ceil((binsNumber && binsNumber(data)) ||
            ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(binsNumberOption) ?
                binsNumberOption :
                binsNumberFormulas['square-root'](data)));
    };
    HistogramSeries.prototype.setData = function (data, redraw, animation, updatePoints) {
        if (redraw === void 0) { redraw = true; }
        var alteredData;
        if (typeof data !== 'undefined' && data.length > 0) {
            // Support data array of objects (#24073).
            data = data.map(function (item) {
                var _a;
                return (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(item) ? item : (_a = item === null || item === void 0 ? void 0 : item.y) !== null && _a !== void 0 ? _a : 0;
            });
            alteredData = this.derivedData(data.filter(highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber), this.binsNumber(data), this.options.binWidth);
        }
        _super.prototype.setData.call(this, alteredData, redraw, animation, updatePoints);
    };
    HistogramSeries.prototype.derivedData = function (baseData, binsNumber, binWidth) {
        var series = this,
            max = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.correctFloat)((0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.arrayMax)(baseData)), 
            // Float correction needed, because first frequency value is not
            // corrected when generating frequencies (within for loop).
            min = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.correctFloat)((0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.arrayMin)(baseData)),
            frequencies = [],
            bins = {},
            data = [];
        var x;
        binWidth = series.binWidth = ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.correctFloat)((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(binWidth) ?
            (binWidth || 1) :
            (max - min) / binsNumber));
        // #12077 negative pointRange causes wrong calculations,
        // browser hanging.
        series.options.pointRange = Math.max(binWidth, 0);
        // If binWidth is 0 then max and min are equaled,
        // increment the x with some positive value to quit the loop
        for (x = min; 
        // This condition is needed because of the margin of error while
        // operating on decimal numbers. Without that, additional bin
        // was sometimes noticeable on the graph, because of too small
        // precision of float correction.
        x < max &&
            (series.userOptions.binWidth ||
                (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.correctFloat)(max - x) >= binWidth ||
                // #13069 - Every add and subtract operation should
                // be corrected, due to general problems with
                // operations on float numbers in JS.
                (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.correctFloat)((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.correctFloat)(min + (frequencies.length * binWidth)) -
                    x) <= 0); x = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.correctFloat)(x + binWidth)) {
            frequencies.push(x);
            bins[x] = 0;
        }
        if (bins[min] !== 0) {
            frequencies.push(min);
            bins[min] = 0;
        }
        var fitToBin = fitToBinLeftClosed(frequencies.map(function (elem) { return parseFloat(elem); }));
        for (var _i = 0, baseData_1 = baseData; _i < baseData_1.length; _i++) {
            var y = baseData_1[_i];
            bins[(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.correctFloat)(fitToBin(y))]++;
        }
        for (var _a = 0, _b = Object.keys(bins); _a < _b.length; _a++) {
            var key = _b[_a];
            data.push({
                x: Number(key),
                y: bins[key],
                x2: (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.correctFloat)(Number(key) + binWidth)
            });
        }
        data.sort(function (a, b) { return (a.x - b.x); });
        data[data.length - 1].x2 = max;
        return data;
    };
    HistogramSeries.prototype.setDerivedData = function () {
        var _a;
        var yData = (_a = this.baseSeries) === null || _a === void 0 ? void 0 : _a.getColumn('y');
        if (!(yData === null || yData === void 0 ? void 0 : yData.length)) {
            this.setData([]);
            return;
        }
        this.setData(yData, false, void 0, false);
    };
    /* *
     *
     *  Static Properties
     *
     * */
    HistogramSeries.defaultOptions = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(ColumnSeries.defaultOptions, Histogram_HistogramSeriesDefaults);
    return HistogramSeries;
}(ColumnSeries));
Series_DerivedComposition.compose(HistogramSeries);
highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default().registerSeriesType('histogram', HistogramSeries);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Histogram_HistogramSeries = ((/* unused pure expression or super */ null && (HistogramSeries)));

;// ./code/es5/es-modules/Series/Bellcurve/BellcurveSeriesDefaults.js
/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Sebastian Domas
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  API Options
 *
 * */
/**
 * A bell curve is an areaspline series which represents the probability
 * density function of the normal distribution. It calculates mean and
 * standard deviation of the base series data and plots the curve according
 * to the calculated parameters.
 *
 * @sample {highcharts} highcharts/demo/bellcurve/
 *         Bell curve
 *
 * @extends      plotOptions.areaspline
 * @since        6.0.0
 * @product      highcharts
 * @excluding    boostThreshold, connectNulls, dragDrop, stacking,
 *               pointInterval, pointIntervalUnit
 * @requires     modules/histogram-bellcurve
 * @optionparent plotOptions.bellcurve
 */
var BellcurveSeriesDefaults = {
    /**
     * @see [fillColor](#plotOptions.bellcurve.fillColor)
     * @see [fillOpacity](#plotOptions.bellcurve.fillOpacity)
     *
     * @apioption plotOptions.bellcurve.color
     */
    /**
     * @see [color](#plotOptions.bellcurve.color)
     * @see [fillOpacity](#plotOptions.bellcurve.fillOpacity)
     *
     * @apioption plotOptions.bellcurve.fillColor
     */
    /**
     * @see [color](#plotOptions.bellcurve.color)
     * @see [fillColor](#plotOptions.bellcurve.fillColor)
     *
     * @default   {highcharts} 0.75
     * @default   {highstock} 0.75
     * @apioption plotOptions.bellcurve.fillOpacity
     */
    /**
     * This option allows to define the length of the bell curve. A unit of
     * the length of the bell curve is standard deviation.
     *
     * @sample highcharts/plotoptions/bellcurve-intervals-pointsininterval
     *         Intervals and points in interval
     */
    intervals: 3,
    /**
     * Defines how many points should be plotted within 1 interval. See
     * `plotOptions.bellcurve.intervals`.
     *
     * @sample highcharts/plotoptions/bellcurve-intervals-pointsininterval
     *         Intervals and points in interval
     */
    pointsInInterval: 3,
    marker: {
        enabled: false
    }
};
/**
 * A `bellcurve` series. If the [type](#series.bellcurve.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * For options that apply to multiple series, it is recommended to add
 * them to the [plotOptions.series](#plotOptions.series) options structure.
 * To apply to all series of this specific type, apply it to
 * [plotOptions.bellcurve](#plotOptions.bellcurve).
 *
 * @extends   series,plotOptions.bellcurve
 * @since     6.0.0
 * @product   highcharts
 * @excluding dataParser, dataURL, data, boostThreshold, boostBlending
 * @requires  modules/histogram-bellcurve
 * @apioption series.bellcurve
 */
/**
 * An integer identifying the index to use for the base series, or a string
 * representing the id of the series.
 *
 * @type      {number|string}
 * @apioption series.bellcurve.baseSeries
 */
/**
 * @see [fillColor](#series.bellcurve.fillColor)
 * @see [fillOpacity](#series.bellcurve.fillOpacity)
 *
 * @apioption series.bellcurve.color
 */
/**
 * @see [color](#series.bellcurve.color)
 * @see [fillOpacity](#series.bellcurve.fillOpacity)
 *
 * @apioption series.bellcurve.fillColor
 */
/**
 * @see [color](#series.bellcurve.color)
 * @see [fillColor](#series.bellcurve.fillColor)
 *
 * @default   {highcharts} 0.75
 * @default   {highstock} 0.75
 * @apioption series.bellcurve.fillOpacity
 */
''; // Keeps doclets above separate
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Bellcurve_BellcurveSeriesDefaults = (BellcurveSeriesDefaults);

;// ./code/es5/es-modules/Series/Bellcurve/BellcurveSeries.js
/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Sebastian Domas
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

var BellcurveSeries_extends = (undefined && undefined.__extends) || (function () {
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



var AreaSplineSeries = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes.areaspline;

/* *
 *
 *  Class
 *
 * */
/**
 * Bell curve class
 *
 * @internal
 * @class
 * @name Highcharts.seriesTypes.bellcurve
 *
 * @augments Highcharts.Series
 */
var BellcurveSeries = /** @class */ (function (_super) {
    BellcurveSeries_extends(BellcurveSeries, _super);
    function BellcurveSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /** @internal */
    BellcurveSeries.mean = function (data) {
        var length = data.length,
            sum = data.reduce(function (sum,
            value) {
                return (sum += value);
        }, 0);
        return length > 0 && sum / length;
    };
    /** @internal */
    BellcurveSeries.standardDeviation = function (data, average) {
        var len = data.length;
        average = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(average) ?
            average : BellcurveSeries.mean(data);
        var sum = data.reduce(function (sum,
            value) {
                var diff = value - average;
            return (sum += diff * diff);
        }, 0);
        return len > 1 && Math.sqrt(sum / (len - 1));
    };
    /** @internal */
    BellcurveSeries.normalDensity = function (x, mean, standardDeviation) {
        var translation = x - mean;
        return Math.exp(-(translation * translation) /
            (2 * standardDeviation * standardDeviation)) / (standardDeviation * Math.sqrt(2 * Math.PI));
    };
    /* *
     *
     *  Functions
     *
     * */
    BellcurveSeries.prototype.setData = function (data, redraw, animation, updatePoints) {
        if (redraw === void 0) { redraw = true; }
        var alteredData;
        if (typeof data !== 'undefined' && data.length > 0) {
            // Support data array of objects (#24073).
            data = data
                .map(function (item) {
                return (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(item) ? item : item === null || item === void 0 ? void 0 : item.y;
            })
                .filter(highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber);
            this.setMean(data);
            this.setStandardDeviation(data);
            alteredData = this.derivedData(this.mean || 0, this.standardDeviation || 0);
        }
        _super.prototype.setData.call(this, alteredData, redraw, animation, updatePoints);
    };
    BellcurveSeries.prototype.derivedData = function (mean, standardDeviation) {
        var options = this.options,
            intervals = options.intervals,
            pointsInInterval = options.pointsInInterval,
            stop = intervals * pointsInInterval * 2 + 1,
            increment = standardDeviation / pointsInInterval,
            data = [];
        var x = mean - intervals * standardDeviation;
        for (var i = 0; i < stop; i++) {
            data.push([x, BellcurveSeries.normalDensity(x, mean, standardDeviation)]);
            x += increment;
        }
        return data;
    };
    BellcurveSeries.prototype.setDerivedData = function () {
        var _a,
            _b;
        var series = this;
        if ((_a = series.baseSeries) === null || _a === void 0 ? void 0 : _a.getColumn('y').length) {
            series.setData((_b = series.baseSeries) === null || _b === void 0 ? void 0 : _b.getColumn('y'), false, void 0, false);
        }
    };
    BellcurveSeries.prototype.setMean = function (data) {
        var series = this;
        series.mean = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.correctFloat)(BellcurveSeries.mean(data || []));
    };
    BellcurveSeries.prototype.setStandardDeviation = function (data) {
        var series = this;
        series.standardDeviation = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.correctFloat)(BellcurveSeries.standardDeviation(data || [], series.mean));
    };
    /* *
     *
     *  Static Properties
     *
     * */
    BellcurveSeries.defaultOptions = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(AreaSplineSeries.defaultOptions, Bellcurve_BellcurveSeriesDefaults);
    return BellcurveSeries;
}(AreaSplineSeries));
Series_DerivedComposition.compose(BellcurveSeries);
highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default().registerSeriesType('bellcurve', BellcurveSeries);
/* *
 *
 *  Default Export
 *
 * */
/** @internal */
/* harmony default export */ var Bellcurve_BellcurveSeries = ((/* unused pure expression or super */ null && (BellcurveSeries)));

;// ./code/es5/es-modules/masters/modules/histogram-bellcurve.src.js





/* harmony default export */ var histogram_bellcurve_src = ((highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()));

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});