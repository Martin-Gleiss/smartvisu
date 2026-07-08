// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v13.0.0 (2026-06-11)
 * @module highcharts/modules/color-axis
 * @requires highcharts
 *
 * ColorAxis module
 *
 * (c) 2012-2026 Highsoft AS
 * Author: Paweł Potaczek
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(root["_Highcharts"], root["_Highcharts"]["Axis"], root["_Highcharts"]["Color"], root["_Highcharts"]["SeriesRegistry"]);
	else if(typeof define === 'function' && define.amd)
		define("highcharts/modules/coloraxis", ["highcharts/highcharts"], function (amd1) {return factory(amd1,amd1["Axis"],amd1["Color"],amd1["SeriesRegistry"]);});
	else if(typeof exports === 'object')
		exports["highcharts/modules/coloraxis"] = factory(root["_Highcharts"], root["_Highcharts"]["Axis"], root["_Highcharts"]["Color"], root["_Highcharts"]["SeriesRegistry"]);
	else
		root["Highcharts"] = factory(root["Highcharts"], root["Highcharts"]["Axis"], root["Highcharts"]["Color"], root["Highcharts"]["SeriesRegistry"]);
})(typeof window === 'undefined' ? this : window, function(__WEBPACK_EXTERNAL_MODULE__944__, __WEBPACK_EXTERNAL_MODULE__532__, __WEBPACK_EXTERNAL_MODULE__620__, __WEBPACK_EXTERNAL_MODULE__512__) {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 512:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__512__;

/***/ }),

/***/ 532:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__532__;

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
  "default": function() { return /* binding */ coloraxis_src; }
});

// EXTERNAL MODULE: external {"amd":["highcharts/highcharts"],"commonjs":["highcharts"],"commonjs2":["highcharts"],"root":["Highcharts"]}
var highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_ = __webpack_require__(944);
var highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default = /*#__PURE__*/__webpack_require__.n(highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_);
// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","Axis"],"commonjs":["highcharts","Axis"],"commonjs2":["highcharts","Axis"],"root":["Highcharts","Axis"]}
var highcharts_Axis_commonjs_highcharts_Axis_commonjs2_highcharts_Axis_root_Highcharts_Axis_ = __webpack_require__(532);
var highcharts_Axis_commonjs_highcharts_Axis_commonjs2_highcharts_Axis_root_Highcharts_Axis_default = /*#__PURE__*/__webpack_require__.n(highcharts_Axis_commonjs_highcharts_Axis_commonjs2_highcharts_Axis_root_Highcharts_Axis_);
// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","Color"],"commonjs":["highcharts","Color"],"commonjs2":["highcharts","Color"],"root":["Highcharts","Color"]}
var highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_ = __webpack_require__(620);
var highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_default = /*#__PURE__*/__webpack_require__.n(highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_);
;// ./code/es5/es-modules/Core/Axis/Color/ColorAxisBase.js
/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */



var color = (highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_default()).parse;
/* *
 *
 *  Namespace
 *
 * */
/** @internal */
var ColorAxisBase;
(function (ColorAxisBase) {
    /* *
     *
     *  Declarations
     *
     * */
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Initialize defined data classes.
     * @internal
     */
    function initDataClasses(userOptions) {
        var axis = this,
            chart = axis.chart,
            legendItem = axis.legendItem = axis.legendItem || {},
            options = axis.options,
            userDataClasses = userOptions.dataClasses || [];
        var dataClass,
            dataClasses,
            colorCount = chart.options.chart.colorCount,
            colorCounter = 0,
            colors;
        axis.dataClasses = dataClasses = [];
        legendItem.labels = [];
        for (var i = 0, iEnd = userDataClasses.length; i < iEnd; ++i) {
            dataClass = userDataClasses[i];
            dataClass = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(dataClass);
            dataClasses.push(dataClass);
            if (!chart.styledMode && dataClass.color) {
                continue;
            }
            if (options.dataClassColor === 'category') {
                if (!chart.styledMode) {
                    colors = chart.options.colors || [];
                    colorCount = colors.length;
                    dataClass.color = colors[colorCounter];
                }
                dataClass.colorIndex = colorCounter;
                // Loop back to zero
                colorCounter++;
                if (colorCounter === colorCount) {
                    colorCounter = 0;
                }
            }
            else {
                dataClass.color = color(options.minColor).tweenTo(color(options.maxColor), iEnd < 2 ? 0.5 : i / (iEnd - 1) // #3219
                );
            }
        }
    }
    ColorAxisBase.initDataClasses = initDataClasses;
    /**
     * Create initial color stops.
     * @internal
     */
    function initStops() {
        var axis = this,
            options = axis.options,
            stops = axis.stops = options.stops || [
                [0,
            options.minColor || ''],
                [1,
            options.maxColor || '']
            ];
        for (var i = 0, iEnd = stops.length; i < iEnd; ++i) {
            stops[i].color = color(stops[i][1]);
        }
    }
    ColorAxisBase.initStops = initStops;
    /**
     * Normalize logarithmic values.
     * @internal
     */
    function normalizedValue(value) {
        var axis = this,
            max = axis.max || 0,
            min = axis.min || 0;
        if (axis.logarithmic) {
            value = axis.logarithmic.log2lin(value);
        }
        return 1 - ((max - value) /
            ((max - min) || 1));
    }
    ColorAxisBase.normalizedValue = normalizedValue;
    /**
     * Translate from a value to a color.
     * @internal
     */
    function toColor(value, point) {
        var axis = this;
        var dataClasses = axis.dataClasses;
        var stops = axis.stops;
        var pos,
            from,
            to,
            color,
            dataClass,
            i;
        if (dataClasses) {
            i = dataClasses.length;
            while (i--) {
                dataClass = dataClasses[i];
                from = dataClass.from;
                to = dataClass.to;
                if ((typeof from === 'undefined' || value >= from) &&
                    (typeof to === 'undefined' || value <= to)) {
                    color = dataClass.color;
                    if (point) {
                        point.dataClass = i;
                        point.colorIndex = dataClass.colorIndex;
                    }
                    break;
                }
            }
        }
        else {
            pos = axis.normalizedValue(value);
            i = stops.length;
            while (i--) {
                if (pos > stops[i][0]) {
                    break;
                }
            }
            from = stops[i] || stops[i + 1];
            to = stops[i + 1] || from;
            // The position within the gradient
            pos = 1 - (to[0] - pos) / ((to[0] - from[0]) || 1);
            color = from.color.tweenTo(to.color, pos);
        }
        return color;
    }
    ColorAxisBase.toColor = toColor;
})(ColorAxisBase || (ColorAxisBase = {}));
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Color_ColorAxisBase = (ColorAxisBase);

;// ./code/es5/es-modules/Core/Axis/Color/ColorAxisComposition.js
/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */


var ColorAxisComposition_color = (highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_default()).parse;

/* *
 *
 *  Composition
 *
 * */
var ColorAxisComposition;
(function (ColorAxisComposition) {
    /* *
     *
     *  Declarations
     *
     * */
    /* *
     *
     *  Variables
     *
     * */
    var ColorAxisConstructor;
    /* *
     *
     *  Functions
     *
     * */
    /** @internal */
    function compose(ColorAxisClass, ChartClass, FxClass, LegendClass, SeriesClass) {
        var chartProto = ChartClass.prototype,
            fxProto = FxClass.prototype,
            seriesProto = SeriesClass.prototype;
        if (!chartProto.collectionsWithUpdate.includes('colorAxis')) {
            ColorAxisConstructor = ColorAxisClass;
            chartProto.collectionsWithUpdate.push('colorAxis');
            chartProto.collectionsWithInit.colorAxis = [
                chartProto.addColorAxis
            ];
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(ChartClass, 'afterCreateAxes', onChartAfterCreateAxes);
            wrapChartCreateAxis(ChartClass);
            fxProto.fillSetter = wrapFxFillSetter;
            fxProto.strokeSetter = wrapFxStrokeSetter;
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(LegendClass, 'afterGetAllItems', onLegendAfterGetAllItems);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(LegendClass, 'afterColorizeItem', onLegendAfterColorizeItem);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(LegendClass, 'afterUpdate', onLegendAfterUpdate);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(seriesProto, {
                optionalAxis: 'colorAxis',
                translateColors: seriesTranslateColors
            });
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(seriesProto.pointClass.prototype, {
                setVisible: pointSetVisible
            });
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(SeriesClass, 'afterTranslate', onSeriesAfterTranslate, { order: 1 });
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(SeriesClass, 'bindAxes', onSeriesBindAxes);
        }
    }
    ColorAxisComposition.compose = compose;
    /**
     * Extend the chart createAxes method to also make the color axis.
     * @internal
     */
    function onChartAfterCreateAxes() {
        var _this = this;
        var userOptions = this.userOptions;
        this.colorAxis = [];
        // If a `colorAxis` config is present in the user options (not in a
        // theme), instantiate it.
        if (userOptions.colorAxis) {
            userOptions.colorAxis = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.splat)(userOptions.colorAxis);
            userOptions.colorAxis.map(function (axisOptions) { return (new ColorAxisConstructor(_this, axisOptions)); });
        }
    }
    /**
     * Add the color axis. This also removes the axis' own series to prevent
     * them from showing up individually.
     * @internal
     */
    function onLegendAfterGetAllItems(e) {
        var _this = this;
        var colorAxes = this.chart.colorAxis || [],
            destroyItem = function (item) {
                var i = e.allItems.indexOf(item);
            if (i !== -1) {
                // #15436
                _this.destroyItem(e.allItems[i]);
                e.allItems.splice(i, 1);
            }
        };
        var colorAxisItems = [],
            options,
            i;
        colorAxes.forEach(function (colorAxis) {
            options = colorAxis.options;
            if (options === null || options === void 0 ? void 0 : options.showInLegend) {
                // Data classes
                if (options.dataClasses && options.visible) {
                    colorAxisItems = colorAxisItems.concat(colorAxis.getDataClassLegendSymbols());
                    // Gradient legend
                }
                else if (options.visible) {
                    // Add this axis on top
                    colorAxisItems.push(colorAxis);
                }
                // If dataClasses are defined or showInLegend option is not set
                // to true, do not add color axis' series to legend.
                colorAxis.series.forEach(function (series) {
                    if (!series.options.showInLegend || options.dataClasses) {
                        if (series.options.legendType === 'point') {
                            series.points.forEach(function (point) {
                                destroyItem(point);
                            });
                        }
                        else {
                            destroyItem(series);
                        }
                    }
                });
            }
        });
        i = colorAxisItems.length;
        while (i--) {
            e.allItems.unshift(colorAxisItems[i]);
        }
    }
    /** @internal */
    function onLegendAfterColorizeItem(e) {
        if (e.visible && e.item.legendColor) {
            e.item.legendItem.symbol.attr({
                fill: e.item.legendColor
            });
        }
    }
    /**
     * Updates in the legend need to be reflected in the color axis. (#6888)
     * @internal
     */
    function onLegendAfterUpdate(e) {
        var _a;
        (_a = this.chart.colorAxis) === null || _a === void 0 ? void 0 : _a.forEach(function (colorAxis) {
            colorAxis.update({}, e.redraw);
        });
    }
    /**
     * Calculate and set colors for points.
     * @internal
     */
    function onSeriesAfterTranslate() {
        var _a;
        if (((_a = this.chart.colorAxis) === null || _a === void 0 ? void 0 : _a.length) ||
            this.colorAttribs) {
            this.translateColors();
        }
    }
    /**
     * Add colorAxis to series axisTypes.
     * @internal
     */
    function onSeriesBindAxes() {
        var axisTypes = this.axisTypes;
        if (!axisTypes) {
            this.axisTypes = ['colorAxis'];
        }
        else if (axisTypes.indexOf('colorAxis') === -1) {
            axisTypes.push('colorAxis');
        }
    }
    /**
     * Set the visibility of a single point
     * @internal
     * @function Highcharts.colorPointMixin.setVisible
     * @param {boolean} visible
     */
    function pointSetVisible(visible) {
        var point = this,
            method = visible ? 'show' : 'hide';
        point.visible = point.options.visible = Boolean(visible);
        // Show and hide associated elements
        ['graphic', 'dataLabel'].forEach(function (key) {
            if (point[key]) {
                point[key][method]();
            }
        });
        this.series.buildKDTree(); // Rebuild kdtree #13195
    }
    ColorAxisComposition.pointSetVisible = pointSetVisible;
    /**
     * In choropleth maps, the color is a result of the value, so this needs
     * translation too
     * @internal
     * @function Highcharts.colorSeriesMixin.translateColors
     */
    function seriesTranslateColors() {
        var series = this,
            points = this.getPointsCollection(), // #17945
            nullColor = this.options.nullColor,
            colorAxis = this.colorAxis,
            colorKey = this.colorKey;
        points.forEach(function (point) {
            var value = point.getNestedProperty(colorKey),
                color = point.options.color || (point.isNull || point.value === null ?
                    nullColor :
                    (colorAxis && typeof value !== 'undefined') ?
                        colorAxis.toColor(value,
                point) :
                        point.color || series.color);
            if (color && point.color !== color) {
                point.color = color;
                if (series.options.legendType === 'point' &&
                    point.legendItem &&
                    point.legendItem.label) {
                    series.chart.legend.colorizeItem(point, point.visible);
                }
            }
        });
    }
    /** @internal */
    function wrapChartCreateAxis(ChartClass) {
        var superCreateAxis = ChartClass.prototype.createAxis;
        ChartClass.prototype.createAxis = function (type, options) {
            var chart = this;
            if (type !== 'colorAxis') {
                return superCreateAxis.apply(chart, arguments);
            }
            var axis = new ColorAxisConstructor(chart, (0,
                highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(options.axis, {
                    index: chart[type].length,
                    isX: false
                }));
            chart.isDirtyLegend = true;
            // Clear before 'bindAxes' (#11924)
            chart.axes.forEach(function (axis) {
                axis.series = [];
            });
            chart.series.forEach(function (series) {
                series.bindAxes();
                series.isDirtyData = true;
            });
            if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(options.redraw, true)) {
                chart.redraw(options.animation);
            }
            return axis;
        };
    }
    /**
     * Handle animation of the color attributes directly.
     * @internal
     */
    function wrapFxFillSetter() {
        this.elem.attr('fill', ColorAxisComposition_color(this.start).tweenTo(ColorAxisComposition_color(this.end), this.pos), void 0, true);
    }
    /**
     * Handle animation of the color attributes directly.
     * @internal
     */
    function wrapFxStrokeSetter() {
        this.elem.attr('stroke', ColorAxisComposition_color(this.start).tweenTo(ColorAxisComposition_color(this.end), this.pos), void 0, true);
    }
})(ColorAxisComposition || (ColorAxisComposition = {}));
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Color_ColorAxisComposition = (ColorAxisComposition);

;// ./code/es5/es-modules/Core/Axis/Color/ColorAxisDefaults.js
/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
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
 * A color axis for series. Visually, the color
 * axis will appear as a gradient or as separate items inside the
 * legend, depending on whether the axis is scalar or based on data
 * classes.
 *
 * For supported color formats, see the
 * [docs article about colors](https://www.highcharts.com/docs/chart-design-and-style/colors).
 *
 * A scalar color axis is represented by a gradient. The colors either
 * range between the [minColor](#colorAxis.minColor) and the
 * [maxColor](#colorAxis.maxColor), or for more fine grained control the
 * colors can be defined in [stops](#colorAxis.stops). Often times, the
 * color axis needs to be adjusted to get the right color spread for the
 * data. In addition to stops, consider using a logarithmic
 * [axis type](#colorAxis.type), or setting [min](#colorAxis.min) and
 * [max](#colorAxis.max) to avoid the colors being determined by
 * outliers.
 *
 * When [dataClasses](#colorAxis.dataClasses) are used, the ranges are
 * subdivided into separate classes like categories based on their
 * values. This can be used for ranges between two values, but also for
 * a true category. However, when your data is categorized, it may be as
 * convenient to add each category to a separate series.
 *
 * Color axis does not work with: `sankey`, `sunburst`, `dependencywheel`,
 * `networkgraph`, `venn`, `gauge` and `solidgauge` series
 * types.
 *
 * Since v7.2.0 `colorAxis` can also be an array of options objects.
 *
 * See [the Axis object](/class-reference/Highcharts.Axis) for
 * programmatic access to the axis.
 *
 * @sample       {highcharts} highcharts/coloraxis/custom-color-key
 *               Column chart with color axis
 * @sample       {highcharts} highcharts/coloraxis/horizontal-layout
 *               Horizontal layout
 * @sample       {highmaps} maps/coloraxis/dataclasscolor
 *               With data classes
 * @sample       {highmaps} maps/coloraxis/mincolor-maxcolor
 *               Min color and max color
 *
 * @extends      xAxis
 * @excluding    alignTicks, allowDecimals, alternateGridColor, breaks,
 *               categories, crosshair, dateTimeLabelFormats, left,
 *               lineWidth, linkedTo, maxZoom, minRange, minTickInterval,
 *               offset, opposite, pane, plotBands, plotLines,
 *               reversedStacks, scrollbar, showEmpty, top, zoomEnabled
 * @product      highcharts highstock highmaps
 * @requires     modules/coloraxis
 * @type         {*|Array<*>}
 * @optionparent colorAxis
 */
var colorAxisDefaults = {
    /**
     * Whether to allow decimals on the color axis.
     * @type      {boolean}
     * @default   true
     * @product   highcharts highstock highmaps
     * @apioption colorAxis.allowDecimals
     */
    /**
     * Determines how to set each data class' color if no individual
     * color is set. The default value, `tween`, computes intermediate
     * colors between `minColor` and `maxColor`. The other possible
     * value, `category`, pulls colors from the global or chart specific
     * [colors](#colors) array.
     *
     * @sample {highmaps} maps/coloraxis/dataclasscolor/
     *         Category colors
     *
     * @type       {string}
     * @default    tween
     * @product    highcharts highstock highmaps
     * @validvalue ["tween", "category"]
     * @apioption  colorAxis.dataClassColor
     */
    /**
     * An array of data classes or ranges for the choropleth map. If
     * none given, the color axis is scalar and values are distributed
     * as a gradient between the minimum and maximum colors.
     *
     * @sample {highmaps} maps/demo/data-class-ranges/
     *         Multiple ranges
     *
     * @sample {highmaps} maps/demo/data-class-two-ranges/
     *         Two ranges
     *
     * @type      {Array<*>}
     * @product   highcharts highstock highmaps
     * @apioption colorAxis.dataClasses
     */
    /**
     * The color of each data class. If not set, the color is pulled
     * from the global or chart-specific [colors](#colors) array. In
     * styled mode, this option is ignored. Instead, use colors defined
     * in CSS.
     *
     * @sample {highmaps} maps/demo/data-class-two-ranges/
     *         Explicit colors
     *
     * @type      {Highcharts.ColorType}
     * @product   highcharts highstock highmaps
     * @apioption colorAxis.dataClasses.color
     */
    /**
     * The start of the value range that the data class represents,
     * relating to the point value.
     *
     * The range of each `dataClass` is closed in both ends, but can be
     * overridden by the next `dataClass`.
     *
     * @type      {number}
     * @product   highcharts highstock highmaps
     * @apioption colorAxis.dataClasses.from
     */
    /**
     * The name of the data class as it appears in the legend.
     * If no name is given, it is automatically created based on the
     * `from` and `to` values. For full programmatic control,
     * [legend.labelFormatter](#legend.labelFormatter) can be used.
     * In the formatter, `this.from` and `this.to` can be accessed.
     *
     * @sample {highmaps} maps/coloraxis/dataclasses-name/
     *         Named data classes
     *
     * @sample {highmaps} maps/coloraxis/dataclasses-labelformatter/
     *         Formatted data classes
     *
     * @type      {string}
     * @product   highcharts highstock highmaps
     * @apioption colorAxis.dataClasses.name
     */
    /**
     * The end of the value range that the data class represents,
     * relating to the point value.
     *
     * The range of each `dataClass` is closed in both ends, but can be
     * overridden by the next `dataClass`.
     *
     * @type      {number}
     * @product   highcharts highstock highmaps
     * @apioption colorAxis.dataClasses.to
     */
    /**
     * The layout of the color axis. Can be `'horizontal'` or `'vertical'`.
     * If none given, the color axis has the same layout as the legend.
     *
     * @sample highcharts/coloraxis/horizontal-layout/
     *         Horizontal color axis layout with vertical legend
     *
     * @type      {string|undefined}
     * @since     7.2.0
     * @product   highcharts highstock highmaps
     * @apioption colorAxis.layout
     */
    /** @ignore-option */
    lineWidth: 0,
    /**
     * Padding of the min value relative to the length of the axis. A
     * padding of 0.05 will make a 100px axis 5px longer.
     *
     * @product highcharts highstock highmaps
     */
    minPadding: 0,
    /**
     * The maximum value of the axis in terms of map point values. If
     * `null`, the max value is automatically calculated. If the
     * `endOnTick` option is true, the max value might be rounded up.
     *
     * @sample {highmaps} maps/coloraxis/gridlines/
     *         Explicit min and max to reduce the effect of outliers
     *
     * @type      {number}
     * @product   highcharts highstock highmaps
     * @apioption colorAxis.max
     */
    /**
     * The minimum value of the axis in terms of map point values. If
     * `null`, the min value is automatically calculated. If the
     * `startOnTick` option is true, the min value might be rounded
     * down.
     *
     * @sample {highmaps} maps/coloraxis/gridlines/
     *         Explicit min and max to reduce the effect of outliers
     *
     * @type      {number}
     * @product   highcharts highstock highmaps
     * @apioption colorAxis.min
     */
    /**
     * Padding of the max value relative to the length of the axis. A
     * padding of 0.05 will make a 100px axis 5px longer.
     *
     * @product highcharts highstock highmaps
     */
    maxPadding: 0,
    /**
     * Color of the grid lines extending from the axis across the
     * gradient.
     *
     * @sample {highmaps} maps/coloraxis/gridlines/
     *         Grid lines demonstrated
     *
     * @type      {Highcharts.ColorType}
     * @product   highcharts highstock highmaps
     */
    gridLineColor: 'var(--highcharts-background-color)',
    /**
     * The width of the grid lines extending from the axis across the
     * gradient of a scalar color axis.
     *
     * @sample {highmaps} maps/coloraxis/gridlines/
     *         Grid lines demonstrated
     *
     * @product highcharts highstock highmaps
     */
    gridLineWidth: 1,
    /**
     * The interval of the tick marks in axis units. When `null`, the
     * tick interval is computed to approximately follow the
     * `tickPixelInterval`.
     *
     * @type      {number}
     * @product   highcharts highstock highmaps
     * @apioption colorAxis.tickInterval
     */
    /**
     * If [tickInterval](#colorAxis.tickInterval) is `null` this option
     * sets the approximate pixel interval of the tick marks.
     *
     * @product highcharts highstock highmaps
     */
    tickPixelInterval: 72,
    /**
     * Whether to force the axis to start on a tick. Use this option
     * with the `maxPadding` option to control the axis start.
     *
     * @product highcharts highstock highmaps
     */
    startOnTick: true,
    /**
     * Whether to force the axis to end on a tick. Use this option with
     * the [maxPadding](#colorAxis.maxPadding) option to control the
     * axis end.
     *
     * @product highcharts highstock highmaps
     */
    endOnTick: true,
    /** @ignore */
    offset: 0,
    /**
     * The triangular marker on a scalar color axis that points to the
     * value of the hovered area. To disable the marker, set
     * `marker: null`.
     *
     * @sample {highmaps} maps/coloraxis/marker/
     *         Black marker
     *
     * @declare Highcharts.PointMarkerOptionsObject
     * @product highcharts highstock highmaps
     */
    marker: {
        /**
         * The symbol of the marker. Can be one of the predefined symbols
         * ('circle', 'square', 'diamond', 'triangle', 'triangle-down') or a
         * custom symbol URL.
         *
         * @type   {string}
         * @since  13.0.0
         * @sample highcharts/coloraxis/marker
         *         Marker symbol options
         * @apioption colorAxis.marker.symbol
         */
        /**
         * Animation for the marker as it moves between values. Set to `false`
         * to disable animation.
         *
         * @type    {boolean|Partial<Highcharts.AnimationOptionsObject>}
         * @product highcharts highstock highmaps
         * @default { duration: 50 }
         */
        animation: {
            /** @internal */
            duration: 50
        },
        /**
         * The fill color of the marker.
         * @internal */
        clip: false,
        /**
         * The color of the marker's outline.
         *
         * @sample highcharts/coloraxis/marker
         *         Marker symbol options
         */
        lineColor: 'var(--highcharts-neutral-color-40)',
        /**
         * The width of the marker's outline.
         */
        lineWidth: 0,
        /**
         * The color of the marker.
         *
         * @sample  highcharts/coloraxis/marker
         *          Marker symbol options
         * @type    {Highcharts.ColorType}
         * @product highcharts highstock highmaps
         */
        color: 'var(--highcharts-neutral-color-40)',
        /**
         * Maps to stroke-width because marker options are passed as crosshair.
         * @internal
         */
        width: 0.01
    },
    /**
     * The axis labels show the number for each tick.
     *
     * For more live examples on label options, see [xAxis.labels in the
     * Highcharts API.](/highcharts#xAxis.labels)
     *
     * @extends xAxis.labels
     * @product highcharts highstock highmaps
     */
    labels: {
        distance: 8,
        /**
         * How to handle overflowing labels on horizontal color axis. If set
         * to `"allow"`, it will not be aligned at all. By default it
         * `"justify"` labels inside the chart area. If there is room to
         * move it, it will be aligned to the edge, else it will be removed.
         *
         * @validvalue ["allow", "justify"]
         * @product    highcharts highstock highmaps
         */
        overflow: 'justify',
        rotation: 0
    },
    /**
     * The color to represent the minimum of the color axis. Unless
     * [dataClasses](#colorAxis.dataClasses) or
     * [stops](#colorAxis.stops) are set, the gradient starts at this
     * value.
     *
     * If dataClasses are set, the color is based on minColor and
     * maxColor unless a color is set for each data class, or the
     * [dataClassColor](#colorAxis.dataClassColor) is set.
     *
     * @sample {highmaps} maps/coloraxis/mincolor-maxcolor/
     *         Min and max colors on scalar (gradient) axis
     * @sample {highmaps} maps/coloraxis/mincolor-maxcolor-dataclasses/
     *         On data classes
     *
     * @type    {Highcharts.ColorType}
     * @product highcharts highstock highmaps
     */
    minColor: 'var(--highcharts-highlight-color-10)',
    /**
     * The color to represent the maximum of the color axis. Unless
     * [dataClasses](#colorAxis.dataClasses) or
     * [stops](#colorAxis.stops) are set, the gradient ends at this
     * value.
     *
     * If dataClasses are set, the color is based on minColor and
     * maxColor unless a color is set for each data class, or the
     * [dataClassColor](#colorAxis.dataClassColor) is set.
     *
     * @sample {highmaps} maps/coloraxis/mincolor-maxcolor/
     *         Min and max colors on scalar (gradient) axis
     * @sample {highmaps} maps/coloraxis/mincolor-maxcolor-dataclasses/
     *         On data classes
     *
     * @type    {Highcharts.ColorType}
     * @product highcharts highstock highmaps
     */
    maxColor: 'var(--highcharts-highlight-color-100)',
    /**
     * Color stops for the gradient of a scalar color axis. Use this in
     * cases where a linear gradient between a `minColor` and `maxColor`
     * is not sufficient. The stops is an array of tuples, where the
     * first item is a float between 0 and 1 assigning the relative
     * position in the gradient, and the second item is the color.
     *
     * @sample highcharts/coloraxis/coloraxis-stops/
     *         Color axis stops
     * @sample highcharts/coloraxis/color-key-with-stops/
     *         Color axis stops with custom colorKey
     * @sample {highmaps} maps/demo/heatmap/
     *         Heatmap with three color stops
     *
     * @type      {Array<Array<number,Highcharts.ColorString>>}
     * @product   highcharts highstock highmaps
     * @apioption colorAxis.stops
     */
    /**
     * The pixel length of the main tick marks on the color axis.
     */
    tickLength: 5,
    /**
     * The color axis title. Displayed alongside the color axis. When the
     * legend is vertical the title is rotated accordingly.
     *
     * @sample highcharts/coloraxis/coloraxis-title/
     * Color axis with title
     *
     * @type      {Highcharts.AxisTitleOptions}
     * @product   highcharts highstock highmaps
     */
    title: {
        margin: 5
    },
    /**
     * The type of interpolation to use for the color axis. Can be
     * `linear` or `logarithmic`.
     *
     * @sample highcharts/coloraxis/logarithmic-with-emulate-negative-values/
     *         Logarithmic color axis with extension to emulate negative
     *         values
     *
     * @type      {Highcharts.ColorAxisTypeValue}
     * @default   linear
     * @product   highcharts highstock highmaps
     * @apioption colorAxis.type
     */
    /**
     * Whether to reverse the axis so that the highest number is closest
     * to the origin. Defaults to `false`.
     *
     * @type      {boolean}
     * @default   false
     * @product   highcharts highstock highmaps
     * @apioption colorAxis.reversed
     */
    /**
     * @product   highcharts highstock highmaps
     * @excluding afterBreaks, pointBreak, pointInBreak
     * @apioption colorAxis.events
     */
    /**
     * Fires when the legend item belonging to the colorAxis is clicked.
     * One parameter, `event`, is passed to the function.
     *
     * **Note:** This option is deprecated in favor of
     * [legend.events.itemClick](#legend.events.itemClick).
     *
     * @deprecated 11.4.4
     * @type       {Function}
     * @product    highcharts highstock highmaps
     * @apioption  colorAxis.events.legendItemClick
     */
    /**
     * The width of the color axis. If it's a number, it is interpreted as
     * pixels.
     *
     * If it's a percentage string, it is interpreted as percentages of the
     * total plot width.
     *
     * @sample    highcharts/coloraxis/width-and-height
     *            Percentage width and pixel height for color axis
     *
     * @type      {number|string}
     * @since     11.3.0
     * @product   highcharts highstock highmaps
     * @apioption colorAxis.width
     */
    /**
     * The height of the color axis. If it's a number, it is interpreted as
     * pixels.
     *
     * If it's a percentage string, it is interpreted as percentages of the
     * total plot height.
     *
     * @sample    highcharts/coloraxis/width-and-height
     *            Percentage width and pixel height for color axis
     *
     * @type      {number|string}
     * @since     11.3.0
     * @product   highcharts highstock highmaps
     * @apioption colorAxis.height
     */
    /**
     * Whether to display the colorAxis in the legend.
     *
     * @sample highcharts/coloraxis/hidden-coloraxis-with-3d-chart/
     *         Hidden color axis with 3d chart
     *
     * @see [heatmap.showInLegend](#series.heatmap.showInLegend)
     *
     * @since   4.2.7
     * @product highcharts highstock highmaps
     */
    showInLegend: true
};
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var ColorAxisDefaults = (colorAxisDefaults);

// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","SeriesRegistry"],"commonjs":["highcharts","SeriesRegistry"],"commonjs2":["highcharts","SeriesRegistry"],"root":["Highcharts","SeriesRegistry"]}
var highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_ = __webpack_require__(512);
var highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default = /*#__PURE__*/__webpack_require__.n(highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_);
;// ./code/es5/es-modules/Core/Axis/Color/ColorAxis.js
/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
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





var defaultOptions = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).defaultOptions;

var Series = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).series;

defaultOptions.colorAxis = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(defaultOptions.xAxis, ColorAxisDefaults);
/* *
 *
 *  Class
 *
 * */
/**
 * The ColorAxis object for inclusion in gradient legends.
 *
 * @class
 * @name Highcharts.ColorAxis
 * @augments Highcharts.Axis
 *
 * @param {Highcharts.Chart} chart
 * The related chart of the color axis.
 *
 * @param {Highcharts.ColorAxisOptions} userOptions
 * The color axis options for initialization.
 */
var ColorAxis = /** @class */ (function (_super) {
    __extends(ColorAxis, _super);
    /* *
     *
     *  Constructors
     *
     * */
    /** @internal */
    function ColorAxis(chart, userOptions) {
        var _this = _super.call(this,
            chart,
            userOptions) || this;
        /** @internal */
        _this.clippable = false;
        /** @internal */
        _this.coll = 'colorAxis';
        /** @internal */
        _this.visible = true;
        _this.init(chart, userOptions);
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /** @internal */
    ColorAxis.compose = function (ChartClass, FxClass, LegendClass, SeriesClass) {
        Color_ColorAxisComposition.compose(ColorAxis, ChartClass, FxClass, LegendClass, SeriesClass);
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Initializes the color axis.
     *
     * @function Highcharts.ColorAxis#init
     *
     * @param {Highcharts.Chart} chart
     * The related chart of the color axis.
     *
     * @param {Highcharts.ColorAxisOptions} userOptions
     * The color axis options for initialization.
     */
    ColorAxis.prototype.init = function (chart, userOptions) {
        var axis = this;
        var legend = chart.options.legend || {},
            horiz = userOptions.layout ?
                userOptions.layout !== 'vertical' :
                legend.layout !== 'vertical';
        axis.side = userOptions.side || horiz ? 2 : 1;
        axis.reversed = userOptions.reversed;
        axis.opposite = !horiz;
        _super.prototype.init.call(this, chart, userOptions, 'colorAxis');
        // `super.init` saves the extended user options, now replace it with the
        // originals
        this.userOptions = userOptions;
        if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isArray)(chart.userOptions.colorAxis)) {
            chart.userOptions.colorAxis[this.index] = userOptions;
        }
        // Prepare data classes
        if (userOptions.dataClasses) {
            axis.initDataClasses(userOptions);
        }
        axis.initStops();
        // Override original axis properties
        axis.horiz = horiz;
        axis.zoomEnabled = false;
    };
    /**
     * Returns true if the series has points at all.
     *
     * @function Highcharts.ColorAxis#hasData
     *
     * @return {boolean}
     * True, if the series has points, otherwise false.
     */
    ColorAxis.prototype.hasData = function () {
        return !!(this.tickPositions || []).length;
    };
    /**
     * Override so that ticks are not added in data class axes (#6914)
     * @internal
     */
    ColorAxis.prototype.setTickPositions = function () {
        if (!this.dataClasses) {
            return _super.prototype.setTickPositions.call(this);
        }
    };
    /**
     * Extend the setOptions method to process title, extreme colors and
     * color stops.
     * @internal
     */
    ColorAxis.prototype.setOptions = function (userOptions) {
        var legend = this.chart.options.legend || {},
            theme = defaultOptions.colorAxis,
            layout = userOptions.layout || legend.layout || theme.layout,
            horiz = layout !== 'vertical';
        var sideSpecific = horiz ? { title: { rotation: 0 } } :
                {
                    title: {
                        rotation: 90,
                        margin: 10
                    }
                };
        var options = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(sideSpecific,
            theme,
            userOptions, 
            // Forced options
            {
                showEmpty: false,
                visible: this.chart.options.legend.enabled &&
                    userOptions.visible !== false
            });
        _super.prototype.setOptions.call(this, options);
        this.options.crosshair = this.options.marker;
    };
    /** @internal */
    ColorAxis.prototype.setAxisSize = function () {
        var _a;
        var axis = this,
            chart = axis.chart,
            symbol = (_a = axis.legendItem) === null || _a === void 0 ? void 0 : _a.symbol;
        var _b = axis.getSize(),
            width = _b.width,
            height = _b.height;
        if (symbol) {
            this.left = +symbol.attr('x');
            this.top = +symbol.attr('y');
            this.width = width = +symbol.attr('width');
            this.height = height = +symbol.attr('height');
            this.right = chart.chartWidth - this.left - width;
            this.bottom = chart.chartHeight - this.top - height;
            this.pos = this.horiz ? this.left : this.top;
        }
        // Fake length for disabled legend to avoid tick issues
        // and such (#5205)
        this.len = (this.horiz ? width : height) ||
            ColorAxis.defaultLegendLength;
    };
    /**
     * Override the getOffset method to add the whole axis groups inside the
     * legend.
     * @internal
     */
    ColorAxis.prototype.getOffset = function () {
        var _a;
        var axis = this,
            chart = axis.chart,
            group = (_a = axis.legendItem) === null || _a === void 0 ? void 0 : _a.group,
            sideOffset = chart.axisOffset[axis.side],
            clipOffset = chart.clipOffset,
            legend = chart.legend;
        if (group) {
            // Hook for the getOffset method to add groups to this parent group
            axis.axisParent = group;
            // Call the base
            _super.prototype.getOffset.call(this);
            // Adds `maxLabelLength` needed for label padding corrections done
            // by `render()` and `getMargins()` (#15551).
            legend.allItems.forEach(function (item) {
                if (item instanceof ColorAxis) {
                    item.drawLegendSymbol(legend, item);
                }
            });
            legend.render();
            chart.getMargins(true);
            // First time only
            if (!axis.added) {
                axis.added = true;
            }
            axis.labelLeft = 0;
            axis.labelRight = axis.width;
            // Reset it to avoid color axis reserving space
            chart.axisOffset[axis.side] = sideOffset;
            chart.clipOffset = clipOffset;
        }
    };
    /**
     * Create the color gradient.
     * @internal
     */
    ColorAxis.prototype.setLegendColor = function () {
        var axis = this;
        var horiz = axis.horiz;
        var reversed = axis.reversed;
        var one = reversed ? 1 : 0;
        var zero = reversed ? 0 : 1;
        var grad = horiz ? [one, 0,
            zero, 0] : [0,
            zero, 0,
            one]; // #3190
            axis.legendColor = {
                linearGradient: {
                    x1: grad[0],
                    y1: grad[1],
                    x2: grad[2],
                    y2: grad[3]
                },
                stops: axis.stops
            };
    };
    /**
     * The color axis appears inside the legend and has its own legend symbol.
     * @internal
     */
    ColorAxis.prototype.drawLegendSymbol = function (legend, item) {
        var _a,
            _b,
            _c,
            _d,
            _e;
        var axis = this,
            legendItem = item.legendItem || {},
            padding = legend.padding,
            legendOptions = legend.options,
            labelOptions = axis.options.labels,
            itemDistance = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(legendOptions.itemDistance, 10),
            horiz = axis.horiz,
            _f = axis.getSize(),
            width = _f.width,
            height = _f.height,
            labelPadding = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(
            // @todo: This option is not documented, nor implemented when
            // vertical
            legendOptions.labelPadding,
            horiz ? 16 : 30);
        this.setLegendColor();
        var titleHeight = 0;
        var titleWidth = 0;
        if (((_a = axis.options.title) === null || _a === void 0 ? void 0 : _a.text) && !axis.axisTitle) {
            if (!axis.axisGroup) {
                axis.axisParent = legendItem.group;
                axis.createGroups();
            }
            // --- THE SVG TRANSFORM FIX ---
            // Provide mock dimensions so getTitlePosition returns valid numbers
            // on Pass 1. This ensures the rotation transform succeeds, allowing
            // getBBox() to read the true ROTATED dimensions!
            var tempLen = axis.len,
                tempTop = axis.top,
                tempLeft = axis.left,
                tempWidth = axis.width;
            axis.len = horiz ? width : height;
            axis.top = 0;
            axis.left = 0;
            axis.width = width;
            axis.addTitle(true);
            // Restore the original undefined values
            // (setAxisSize will overwrite them later)
            axis.len = tempLen;
            axis.top = tempTop;
            axis.left = tempLeft;
            axis.width = tempWidth;
            // -----------------------------
        }
        if (axis.axisTitle) {
            var titleBBox = axis.axisTitle.getBBox();
            titleHeight = titleBBox.height;
            titleWidth = titleBBox.width;
        }
        var titleOptions = axis.options.title || {};
        var titleMargin = axis.axisTitle ? ((_b = titleOptions.margin) !== null && _b !== void 0 ? _b : 0) : 0;
        var yShift = horiz ? (titleHeight + titleMargin) : 0;
        // Create the gradient
        if (!legendItem.symbol) {
            legendItem.symbol = this.chart.renderer.symbol('roundedRect')
                .attr({
                r: (_c = legendOptions.symbolRadius) !== null && _c !== void 0 ? _c : 3,
                zIndex: 1
            }).add(legendItem.group);
        }
        legendItem.symbol.attr({
            x: 0,
            y: (legend.baseline || 0) - 11 + yShift,
            width: width,
            height: height
        });
        // Set how much space this legend item takes up
        if (horiz) {
            legendItem.labelWidth = Math.max(width + padding + itemDistance, titleWidth || 0);
            legendItem.labelHeight = height + padding + labelPadding +
                titleHeight + titleMargin;
        }
        else {
            legendItem.labelWidth = width + padding +
                ((_e = (_d = labelOptions.x) !== null && _d !== void 0 ? _d : labelOptions.distance) !== null && _e !== void 0 ? _e : 0) +
                (this.maxLabelLength || 0) +
                (titleWidth || 0) + titleMargin;
            legendItem.labelHeight = Math.max(height + padding, titleHeight || 0);
        }
    };
    /**
     * Override the title position to place it above the color bar
     * for horizontal layouts, or outside the labels for vertical layouts.
     * @internal
     */
    ColorAxis.prototype.getTitlePosition = function (axisTitle) {
        var _a,
            _b,
            _c,
            _d;
        // Pass the argument down to the base class
        var pos = _super.prototype.getTitlePosition.call(this,
            axisTitle),
            titleMargin = (_b = (_a = this.options.title) === null || _a === void 0 ? void 0 : _a.margin) !== null && _b !== void 0 ? _b : 0;
        if (this.horiz && axisTitle) {
            pos.y = this.top - titleMargin;
        }
        else if (!this.horiz && axisTitle) {
            var labelOptions = this.options.labels || {},
                labelDistance = (_d = (_c = labelOptions.x) !== null && _c !== void 0 ? _c : labelOptions.distance) !== null && _d !== void 0 ? _d : 0;
            pos.x = this.left + this.width + labelDistance +
                (this.maxLabelLength || 0) + titleMargin;
        }
        return pos;
    };
    /**
     * Fool the legend.
     * @internal
     */
    ColorAxis.prototype.setState = function (state) {
        this.series.forEach(function (series) {
            series.setState(state);
        });
    };
    /** @internal */
    ColorAxis.prototype.setVisible = function () {
    };
    /** @internal */
    ColorAxis.prototype.getSeriesExtremes = function () {
        var axis = this;
        var series = axis.series;
        var colorValArray,
            colorKey,
            calculatedExtremes,
            cSeries,
            i = series.length;
        this.dataMin = Infinity;
        this.dataMax = -Infinity;
        while (i--) { // X, y, value, other
            cSeries = series[i];
            colorKey = cSeries.colorKey = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(cSeries.options.colorKey, cSeries.colorKey, cSeries.pointValKey, cSeries.zoneAxis, 'y');
            calculatedExtremes = cSeries[colorKey + 'Min'] &&
                cSeries[colorKey + 'Max'];
            // Find the first column that has values
            for (var _i = 0, _a = [colorKey, 'value', 'y']; _i < _a.length; _i++) {
                var key = _a[_i];
                colorValArray = cSeries.getColumn(key);
                if (colorValArray.length) {
                    break;
                }
            }
            // If color key extremes are already calculated, use them.
            if (calculatedExtremes) {
                cSeries.minColorValue = cSeries[colorKey + 'Min'];
                cSeries.maxColorValue = cSeries[colorKey + 'Max'];
            }
            else {
                var cExtremes = Series.prototype.getExtremes.call(cSeries,
                    colorValArray);
                cSeries.minColorValue = cExtremes.dataMin;
                cSeries.maxColorValue = cExtremes.dataMax;
            }
            if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(cSeries.minColorValue) &&
                (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(cSeries.maxColorValue)) {
                this.dataMin =
                    Math.min(this.dataMin, cSeries.minColorValue);
                this.dataMax =
                    Math.max(this.dataMax, cSeries.maxColorValue);
            }
            if (!calculatedExtremes) {
                Series.prototype.applyExtremes.call(cSeries);
            }
        }
    };
    /**
     * Internal function to draw a crosshair.
     *
     * @function Highcharts.ColorAxis#drawCrosshair
     *
     * @param {Highcharts.PointerEventObject} [e]
     *        The event arguments from the modified pointer event, extended with
     *        `chartX` and `chartY`
     *
     * @param {Highcharts.Point} [point]
     *        The Point object if the crosshair snaps to points.
     *
     * @emits Highcharts.ColorAxis#event:afterDrawCrosshair
     * @emits Highcharts.ColorAxis#event:drawCrosshair
     */
    ColorAxis.prototype.drawCrosshair = function (e, point) {
        var axis = this,
            legendItem = axis.legendItem || {},
            plotX = point === null || point === void 0 ? void 0 : point.plotX,
            plotY = point === null || point === void 0 ? void 0 : point.plotY,
            axisPos = axis.pos,
            axisLen = axis.len,
            markerOptions = axis.options.marker || {};
        var crossPos;
        if (point) {
            crossPos = axis.toPixels(point.getNestedProperty(point.series.colorKey));
            if (crossPos < axisPos) {
                crossPos = axisPos - 2;
            }
            else if (crossPos > axisPos + axisLen) {
                crossPos = axisPos + axisLen + 2;
            }
            point.plotX = crossPos;
            point.plotY = axis.len - crossPos;
            _super.prototype.drawCrosshair.call(this, e, point);
            point.plotX = plotX;
            point.plotY = plotY;
            if (axis.cross &&
                !axis.cross.addedToColorAxis &&
                legendItem.group) {
                axis.cross
                    .addClass('highcharts-coloraxis-marker')
                    .add(legendItem.group);
                axis.cross.addedToColorAxis = true;
                if (!axis.chart.styledMode &&
                    typeof axis.crosshair === 'object') {
                    axis.cross.attr({
                        fill: markerOptions.color,
                        stroke: markerOptions.lineColor,
                        'stroke-width': markerOptions.lineWidth
                    });
                }
            }
        }
    };
    /** @internal */
    ColorAxis.prototype.getPlotLinePath = function (options) {
        var axis = this,
            left = axis.left,
            pos = options.translatedValue,
            symbol = (this.options.marker || {}).symbol,
            top = axis.top;
        // Crosshairs only
        if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(pos)) {
            var x = left,
                w = axis.width,
                y = pos - w / 2,
                h = w;
            if (symbol) {
                return this.chart.renderer.symbols[symbol](x, y, w, h);
            }
            // Default to a triangle pointing to the value
            return (axis.horiz ? [
                ['M', pos - 4, top - 6],
                ['L', pos + 4, top - 6],
                ['L', pos, top],
                ['Z']
            ] : [
                ['M', left, pos],
                ['L', left - 6, pos + 6],
                ['L', left - 6, pos - 6],
                ['Z']
            ]);
        }
        return _super.prototype.getPlotLinePath.call(this, options);
    };
    /**
     * Updates a color axis instance with a new set of options. The options are
     * merged with the existing options, so only new or altered options need to
     * be specified.
     *
     * @function Highcharts.ColorAxis#update
     *
     * @param {Highcharts.ColorAxisOptions} newOptions
     * The new options that will be merged in with existing options on the color
     * axis.
     *
     * @param {boolean} [redraw]
     * Whether to redraw the chart after the color axis is altered. If doing
     * more operations on the chart, it is a good idea to set redraw to `false`
     * and call {@link Highcharts.Chart#redraw} after.
     */
    ColorAxis.prototype.update = function (newOptions, redraw) {
        var _a;
        var axis = this,
            chart = axis.chart,
            legend = chart.legend;
        this.series.forEach(function (series) {
            // Needed for Axis.update when choropleth colors change
            series.isDirtyData = true;
        });
        // When updating data classes, destroy old items and make sure new
        // ones are created (#3207)
        if (newOptions.dataClasses && legend.allItems || axis.dataClasses) {
            axis.destroyItems();
        }
        _super.prototype.update.call(this, newOptions, redraw);
        if ((_a = axis.legendItem) === null || _a === void 0 ? void 0 : _a.label) {
            axis.setLegendColor();
            legend.colorizeItem(this, true);
        }
    };
    /**
     * Destroy color axis legend items.
     * @internal
     */
    ColorAxis.prototype.destroyItems = function () {
        var axis = this,
            chart = axis.chart,
            legendItem = axis.legendItem || {};
        if (legendItem.label) {
            chart.legend.destroyItem(axis);
        }
        else if (legendItem.labels) {
            for (var _i = 0, _a = legendItem.labels; _i < _a.length; _i++) {
                var item = _a[_i];
                chart.legend.destroyItem(item);
            }
        }
        chart.isDirtyLegend = true;
    };
    /**
     * Removing the whole axis (#14283)
     * @internal
     */
    ColorAxis.prototype.destroy = function () {
        this.chart.isDirtyLegend = true;
        this.destroyItems();
        _super.prototype.destroy.apply(this, [].slice.call(arguments));
    };
    /**
     * Removes the color axis and the related legend item.
     *
     * @function Highcharts.ColorAxis#remove
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart following the remove.
     */
    ColorAxis.prototype.remove = function (redraw) {
        this.destroyItems();
        _super.prototype.remove.call(this, redraw);
    };
    /**
     * Get the legend item symbols for data classes.
     * @internal
     */
    ColorAxis.prototype.getDataClassLegendSymbols = function () {
        var axis = this,
            chart = axis.chart,
            legendItems = (axis.legendItem &&
                axis.legendItem.labels ||
                []),
            legendOptions = chart.options.legend,
            valueDecimals = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(legendOptions.valueDecimals, -1),
            valueSuffix = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(legendOptions.valueSuffix, '');
        var getPointsInDataClass = function (i) {
                return axis.series.reduce(function (points,
            s) {
                    points.push.apply(points,
            s.points.filter(function (point) {
                        return point.dataClass === i;
                }));
                return points;
            }, []);
        };
        var name;
        if (!legendItems.length) {
            axis.dataClasses.forEach(function (dataClass, i) {
                var from = dataClass.from,
                    to = dataClass.to,
                    numberFormatter = chart.numberFormatter;
                var vis = true;
                // Assemble the default name. This can be overridden
                // by legend.options.labelFormatter
                name = '';
                if (typeof from === 'undefined') {
                    name = '< ';
                }
                else if (typeof to === 'undefined') {
                    name = '> ';
                }
                if (typeof from !== 'undefined') {
                    name += numberFormatter(from, valueDecimals) + valueSuffix;
                }
                if (typeof from !== 'undefined' && typeof to !== 'undefined') {
                    name += ' - ';
                }
                if (typeof to !== 'undefined') {
                    name += numberFormatter(to, valueDecimals) + valueSuffix;
                }
                // Add a mock object to the legend items
                legendItems.push((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)({
                    chart: chart,
                    name: name,
                    options: {},
                    drawLegendSymbol: Series.prototype.drawLegendSymbol,
                    visible: true,
                    isDataClass: true,
                    // Override setState to set either normal or inactive
                    // state to all points in this data class
                    setState: function (state) {
                        for (var _i = 0, _a = getPointsInDataClass(i); _i < _a.length; _i++) {
                            var point = _a[_i];
                            point.setState(state);
                        }
                    },
                    // Override setState to show or hide all points in this
                    // data class
                    setVisible: function () {
                        this.visible = vis = axis.visible = !vis;
                        var affectedSeries = [];
                        for (var _i = 0, _a = getPointsInDataClass(i); _i < _a.length; _i++) {
                            var point = _a[_i];
                            point.setVisible(vis);
                            point.hiddenInDataClass = !vis; // #20441
                            if (affectedSeries.indexOf(point.series) === -1) {
                                affectedSeries.push(point.series);
                            }
                        }
                        chart.legend.colorizeItem(this, vis);
                        affectedSeries.forEach(function (series) {
                            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(series, 'afterDataClassLegendClick');
                        });
                    }
                }, dataClass));
            });
        }
        return legendItems;
    };
    /**
     * Get size of color axis symbol.
     * @internal
     */
    ColorAxis.prototype.getSize = function () {
        var axis = this,
            chart = axis.chart,
            horiz = axis.horiz,
            _a = axis.options,
            colorAxisHeight = _a.height,
            colorAxisWidth = _a.width,
            legendOptions = chart.options.legend,
            width = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)((0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(colorAxisWidth) ?
                (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.relativeLength)(colorAxisWidth,
            chart.chartWidth) : void 0,
            legendOptions === null || legendOptions === void 0 ? void 0 : legendOptions.symbolWidth,
            horiz ? ColorAxis.defaultLegendLength : 12),
            height = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)((0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(colorAxisHeight) ?
                (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.relativeLength)(colorAxisHeight,
            chart.chartHeight) : void 0,
            legendOptions === null || legendOptions === void 0 ? void 0 : legendOptions.symbolHeight,
            horiz ? 12 : ColorAxis.defaultLegendLength);
        return {
            width: width,
            height: height
        };
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /** @internal */
    ColorAxis.defaultLegendLength = 200;
    /** @internal */
    ColorAxis.keepProps = [
        'legendItem'
    ];
    return ColorAxis;
}((highcharts_Axis_commonjs_highcharts_Axis_commonjs2_highcharts_Axis_root_Highcharts_Axis_default())));
(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(ColorAxis.prototype, Color_ColorAxisBase);
/* *
 *
 *  Registry
 *
 * */
// Properties to preserve after destroy, for Axis.update (#5881, #6025).
Array.prototype.push.apply((highcharts_Axis_commonjs_highcharts_Axis_commonjs2_highcharts_Axis_root_Highcharts_Axis_default()).keepProps, ColorAxis.keepProps);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Color_ColorAxis = (ColorAxis);
/* *
 *
 *  API Declarations
 *
 * */
/**
 * Color axis types
 *
 * @typedef {"linear"|"logarithmic"} Highcharts.ColorAxisTypeValue
 */
''; // Detach doclet above

;// ./code/es5/es-modules/masters/modules/coloraxis.src.js




var G = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default());
G.ColorAxis = G.ColorAxis || Color_ColorAxis;
G.ColorAxis.compose(G.Chart, G.Fx, G.Legend, G.Series);
/* harmony default export */ var coloraxis_src = ((highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()));

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});