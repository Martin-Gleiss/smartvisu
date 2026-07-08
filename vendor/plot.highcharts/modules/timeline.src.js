// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v13.0.0 (2026-06-11)
 * @module highcharts/modules/timeline
 * @requires highcharts
 *
 * Timeline series
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Daniel Studencki
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(root["_Highcharts"], root["_Highcharts"]["SeriesRegistry"], root["_Highcharts"]["Point"]);
	else if(typeof define === 'function' && define.amd)
		define("highcharts/modules/timeline", ["highcharts/highcharts"], function (amd1) {return factory(amd1,amd1["SeriesRegistry"],amd1["Point"]);});
	else if(typeof exports === 'object')
		exports["highcharts/modules/timeline"] = factory(root["_Highcharts"], root["_Highcharts"]["SeriesRegistry"], root["_Highcharts"]["Point"]);
	else
		root["Highcharts"] = factory(root["Highcharts"], root["Highcharts"]["SeriesRegistry"], root["Highcharts"]["Point"]);
})(typeof window === 'undefined' ? this : window, function(__WEBPACK_EXTERNAL_MODULE__944__, __WEBPACK_EXTERNAL_MODULE__512__, __WEBPACK_EXTERNAL_MODULE__260__) {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 260:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__260__;

/***/ }),

/***/ 512:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__512__;

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
  "default": function() { return /* binding */ timeline_src; }
});

// EXTERNAL MODULE: external {"amd":["highcharts/highcharts"],"commonjs":["highcharts"],"commonjs2":["highcharts"],"root":["Highcharts"]}
var highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_ = __webpack_require__(944);
var highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default = /*#__PURE__*/__webpack_require__.n(highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_);
// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","SeriesRegistry"],"commonjs":["highcharts","SeriesRegistry"],"commonjs2":["highcharts","SeriesRegistry"],"root":["Highcharts","SeriesRegistry"]}
var highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_ = __webpack_require__(512);
var highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default = /*#__PURE__*/__webpack_require__.n(highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_);
// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","Point"],"commonjs":["highcharts","Point"],"commonjs2":["highcharts","Point"],"root":["Highcharts","Point"]}
var highcharts_Point_commonjs_highcharts_Point_commonjs2_highcharts_Point_root_Highcharts_Point_ = __webpack_require__(260);
var highcharts_Point_commonjs_highcharts_Point_commonjs2_highcharts_Point_root_Highcharts_Point_default = /*#__PURE__*/__webpack_require__.n(highcharts_Point_commonjs_highcharts_Point_commonjs2_highcharts_Point_root_Highcharts_Point_);
;// ./code/es5/es-modules/Series/Timeline/TimelinePoint.js
/* *
 *
 *  Timeline Series.
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Daniel Studencki
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


var _a = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes, LinePoint = _a.line.prototype.pointClass, PiePoint = _a.pie.prototype.pointClass;

/* *
 *
 *  Class
 *
 * */
var TimelinePoint = /** @class */ (function (_super) {
    __extends(TimelinePoint, _super);
    function TimelinePoint(series, options) {
        var _a;
        var _this = _super.call(this,
            series,
            options) || this;
        (_a = _this.name) !== null && _a !== void 0 ? _a : (_this.name = 
        // If options is null, we are dealing with a null point
        ((options && options.y !== null) ||
            !series.options.nullInteraction) &&
            'Event' ||
            'Null');
        _this.y = 1;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    TimelinePoint.prototype.alignConnector = function () {
        var point = this,
            series = point.series,
            dataLabel = point.dataLabel,
            connector = dataLabel.connector,
            dlOptions = (dataLabel.options || {}),
            connectorWidth = dlOptions.connectorWidth || 0,
            chart = point.series.chart,
            bBox = connector.getBBox(),
            plotPos = {
                x: bBox.x + (dataLabel.translateX || 0),
                y: bBox.y + (dataLabel.translateY || 0)
            };
        // Include a half of connector width in order to run animation,
        // when connectors are aligned to the plot area edge.
        if (chart.inverted) {
            plotPos.y -= connectorWidth / 2;
        }
        else {
            plotPos.x += connectorWidth / 2;
        }
        var isVisible = chart.isInsidePlot(plotPos.x,
            plotPos.y);
        connector[isVisible ? 'animate' : 'attr']({
            d: point.getConnectorPath()
        });
        connector.addClass('highcharts-color-' + point.colorIndex);
        if (!series.chart.styledMode) {
            connector.attr({
                stroke: dlOptions.connectorColor || point.color,
                'stroke-width': dlOptions.connectorWidth,
                opacity: dataLabel[(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(dataLabel.newOpacity) ? 'newOpacity' : 'opacity']
            });
        }
    };
    TimelinePoint.prototype.drawConnector = function () {
        var point = this,
            dataLabel = point.dataLabel,
            series = point.series;
        if (dataLabel) {
            if (!dataLabel.connector) {
                dataLabel.connector = series.chart.renderer
                    .path(point.getConnectorPath())
                    .attr({
                    zIndex: -1
                })
                    .add(dataLabel);
            }
            if (point.series.chart.isInsidePlot(// #10507
            dataLabel.x || 0, dataLabel.y || 0)) {
                point.alignConnector();
            }
        }
    };
    TimelinePoint.prototype.getConnectorPath = function () {
        var _a;
        var _b = this,
            _c = _b.plotX,
            plotX = _c === void 0 ? 0 : _c,
            _d = _b.plotY,
            plotY = _d === void 0 ? 0 : _d,
            series = _b.series,
            dataLabel = _b.dataLabel,
            chart = series.chart,
            xAxisLen = series.xAxis.len,
            inverted = chart.inverted,
            direction = inverted ? 'x2' : 'y2';
        if (dataLabel) {
            var targetDLPos = dataLabel.targetPosition,
                negativeDistance = ((dataLabel.alignAttr || dataLabel)[direction[0]] <
                    series.yAxis.len / 2);
            var coords_1 = {
                    x1: plotX,
                    y1: plotY,
                    x2: plotX,
                    y2: (0,
                highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(targetDLPos.y) ? targetDLPos.y : dataLabel.y
                };
            // Recalculate coords when the chart is inverted.
            if (inverted) {
                coords_1 = {
                    x1: plotY,
                    y1: xAxisLen - plotX,
                    x2: targetDLPos.x || dataLabel.x,
                    y2: xAxisLen - plotX
                };
            }
            // Subtract data label width or height from expected coordinate so
            // that the connector would start from the appropriate edge.
            if (negativeDistance) {
                coords_1[direction] += dataLabel[inverted ? 'width' : 'height'] || 0;
            }
            // Change coordinates so that they will be relative to data label.
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.objectEach)(coords_1, function (_coord, i) {
                coords_1[i] -= (dataLabel.alignAttr || dataLabel)[i[0]];
            });
            return chart.renderer.crispLine([
                ['M', coords_1.x1, coords_1.y1],
                ['L', coords_1.x2, coords_1.y2]
            ], ((_a = dataLabel.options) === null || _a === void 0 ? void 0 : _a.connectorWidth) || 0);
        }
        return [];
    };
    TimelinePoint.prototype.isValid = function () {
        return this.options.y !== null;
    };
    TimelinePoint.prototype.setState = function () {
        var proceed = _super.prototype.setState;
        // Prevent triggering the setState method on null points.
        if (!this.isNull || this.series.options.nullInteraction) {
            proceed.apply(this, arguments);
        }
    };
    TimelinePoint.prototype.setVisible = function (visible, redraw) {
        var point = this,
            series = point.series;
        redraw = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(redraw, series.options.ignoreHiddenPoint);
        PiePoint.prototype.setVisible.call(point, visible, false);
        // Process new data
        series.processData();
        if (redraw) {
            series.chart.redraw();
        }
    };
    TimelinePoint.prototype.applyOptions = function (options, x, isMock) {
        var series = this.series;
        if (!x && !(options === null || options === void 0 ? void 0 : options.x)) {
            if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(this.x)) {
                x = this.x;
            }
            else if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(series === null || series === void 0 ? void 0 : series.xIncrement) || NaN) {
                x = series.xIncrement || 0;
                series.autoIncrement();
            }
        }
        options = highcharts_Point_commonjs_highcharts_Point_commonjs2_highcharts_Point_root_Highcharts_Point_default().prototype.optionsToObject.call(this, options);
        var p = _super.prototype.applyOptions.call(this,
            options,
            x,
            isMock);
        if (!isMock) {
            this.userDLOptions = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(this.userDLOptions, options.dataLabels);
        }
        return p;
    };
    return TimelinePoint;
}(LinePoint));
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Timeline_TimelinePoint = (TimelinePoint);

;// ./code/es5/es-modules/Series/Timeline/TimelineSeriesDefaults.js
/* *
 *
 *  Timeline Series.
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Daniel Studencki
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
 * The timeline series presents given events along a drawn line.
 *
 * @sample highcharts/series-timeline/alternate-labels
 *         Timeline series
 * @sample highcharts/series-timeline/inverted
 *         Inverted timeline
 * @sample highcharts/series-timeline/datetime-axis
 *         With true datetime axis
 *
 * @extends      plotOptions.line
 * @excluding    animationLimit, boostThreshold, connectEnds, connectNulls,
 *               cropThreshold, dashStyle, findNearestPointBy,
 *               getExtremesFromAll, negativeColor, pointInterval,
 *               pointIntervalUnit, pointPlacement, pointStart,
 *               softThreshold, stacking, step, threshold, turboThreshold,
 *               zoneAxis, zones, dataSorting, boostBlending
 * @product      highcharts
 * @since        7.0.0
 * @requires     modules/timeline
 * @optionparent plotOptions.timeline
 */
var TimelineSeriesDefaults = {
    colorByPoint: true,
    stickyTracking: false,
    ignoreHiddenPoint: true,
    /**
     * @ignore
     */
    legendType: 'point',
    /**
     * Pixel width of the graph line.
     */
    lineWidth: 4,
    tooltip: {
        headerFormat: '<span style="color:{point.color}">\u25CF</span> ' +
            '<span style="font-size: 0.8em"> {point.key}</span><br/>',
        pointFormat: '{point.description}'
    },
    states: {
        hover: {
            lineWidthPlus: 0
        }
    },
    /**
     * @declare Highcharts.TimelineDataLabelsOptionsObject
     */
    dataLabels: {
        enabled: true,
        allowOverlap: true,
        /**
         * Whether to position data labels alternately. For example, if
         * [distance](#plotOptions.timeline.dataLabels.distance)
         * is set equal to `100`, then data labels will be positioned
         * alternately (on both sides of the point) at a distance of 100px.
         *
         * @sample {highcharts} highcharts/series-timeline/alternate-disabled
         *         Alternate disabled
         */
        alternate: true,
        backgroundColor: 'var(--highcharts-background-color)',
        borderWidth: 1,
        borderColor: 'var(--highcharts-neutral-color-40)',
        borderRadius: 3,
        color: 'var(--highcharts-neutral-color-80)',
        /**
         * The color of the line connecting the data label to the point.
         * The default color is the same as the point's color.
         *
         * In styled mode, the connector stroke is given in the
         * `.highcharts-data-label-connector` class.
         *
         * @sample {highcharts} highcharts/series-timeline/connector-styles
         *         Custom connector width and color
         *
         * @type      {Highcharts.ColorType}
         * @apioption plotOptions.timeline.dataLabels.connectorColor
         */
        /**
         * The width of the line connecting the data label to the point.
         *
         * In styled mode, the connector stroke width is given in the
         * `.highcharts-data-label-connector` class.
         *
         * @sample {highcharts} highcharts/series-timeline/connector-styles
         *         Custom connector width and color
         */
        connectorWidth: 1,
        /**
         * A pixel value defining the distance between the data label and
         * the point. Negative numbers puts the label on top of the point in a
         * non-inverted chart. Defaults to 100 for horizontal and 20 for
         * vertical timeline (`chart.inverted: true`).
         */
        distance: void 0,
        // eslint-disable-next-line jsdoc/require-description
        /**
         * @default function () {
         *   let format;
         *
         *   if (!this.series.chart.styledMode) {
         *       format = '<span style="color:' + this.point.color +
         *           '">● </span>';
         *   } else {
         *       format = '<span class="highcharts-color-' +
         *          this.point.colorIndex + '">● </span>';
         *   }
         *   format += '<span>' + (this.key || '') + '</span><br/>' +
         *       (this.point.label || '');
         *   return format;
         * }
         */
        formatter: function () {
            var format;
            if (!this.series.chart.styledMode) {
                format = '<span style="color:' + this.point.color +
                    '">● </span>';
            }
            else {
                format = '<span class="highcharts-color-' +
                    this.point.colorIndex + '">● </span>';
            }
            format += '<span class="highcharts-strong">' +
                (this.key || '') + '</span><br/>' +
                (this.label || '');
            return format;
        },
        padding: 5,
        style: {
            textOutline: 'none',
            fontWeight: 'normal',
            fontSize: '0.8em',
            textAlign: 'left'
        },
        /**
         * Shadow options for the data label.
         *
         * @type {boolean|Highcharts.CSSObject}
         */
        shadow: false,
        /**
         * @type      {number}
         * @apioption plotOptions.timeline.dataLabels.width
         */
        verticalAlign: 'middle'
    },
    marker: {
        enabledThreshold: 0,
        symbol: 'square',
        radius: 6,
        lineWidth: 2,
        height: 15
    },
    showInLegend: false,
    colorKey: 'x',
    legendSymbol: 'rectangle'
};
/**
 * The `timeline` series. If the [type](#series.timeline.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.timeline
 * @excluding animationLimit, boostThreshold, connectEnds, connectNulls,
 *            cropThreshold, dashStyle, dataParser, dataURL, findNearestPointBy,
 *            getExtremesFromAll, negativeColor, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointStart, softThreshold,
 *            stacking, stack, step, threshold, turboThreshold, zoneAxis, zones,
 *            dataSorting, boostBlending
 * @product   highcharts
 * @requires  modules/timeline
 * @apioption series.timeline
 */
/**
 * An array of data points for the series. For the `timeline` series type,
 * points can be given with three general parameters, `name`, `label`,
 * and `description`:
 *
 * Example:
 *
 * ```js
 * series: [{
 *    type: 'timeline',
 *    data: [{
 *        name: 'Jan 2018',
 *        label: 'Some event label',
 *        description: 'Description to show in tooltip'
 *    }]
 * }]
 * ```
 * If all points additionally have the `x` values, and xAxis type is set to
 * `datetime`, then events are laid out on a true time axis, where their
 * placement reflects the actual time between them.
 *
 * @sample {highcharts} highcharts/series-timeline/alternate-labels
 *         Alternate labels
 * @sample {highcharts} highcharts/series-timeline/datetime-axis
 *         Real time intervals
 *
 * @basic
 * @type      {Array<*>}
 * @extends   series.line.data
 * @excluding marker, y
 * @product   highcharts
 * @apioption series.timeline.data
 */
/**
 * The name of event.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.timeline.data.name
 */
/**
 * The label of event.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.timeline.data.label
 */
/**
 * The description of event. This description will be shown in tooltip.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.timeline.data.description
 */
''; // Adds doclets above to transpiled file
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Timeline_TimelineSeriesDefaults = (TimelineSeriesDefaults);

;// ./code/es5/es-modules/Series/Timeline/TimelineSeries.js
/* *
 *
 *  Timeline Series.
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Daniel Studencki
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

var TimelineSeries_extends = (undefined && undefined.__extends) || (function () {
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

var TimelineSeries_a = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes, ColumnSeries = TimelineSeries_a.column, LineSeries = TimelineSeries_a.line;



/* *
 *
 *  Class
 *
 * */
/**
 * The timeline series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.timeline
 *
 * @augments Highcharts.Series
 */
var TimelineSeries = /** @class */ (function (_super) {
    TimelineSeries_extends(TimelineSeries, _super);
    function TimelineSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Functions
     *
     * */
    TimelineSeries.prototype.alignDataLabel = function (point, dataLabel, _options, _alignTo) {
        var _a;
        var series = this,
            isInverted = series.chart.inverted,
            visiblePoints = series.visibilityMap.filter(function (point) { return !!point; }),
            visiblePointsCount = series.visiblePointsCount || 0,
            pointIndex = visiblePoints.indexOf(point),
            isFirstOrLast = (!pointIndex || pointIndex === visiblePointsCount - 1),
            dataLabelsOptions = series.options.dataLabels,
            userDLOptions = point.userDLOptions || {}, 
            // Define multiplier which is used to calculate data label
            // width. If data labels are alternate, they have two times more
            // space to adapt (excepting first and last ones, which has only
            // one and half), than in case of placing all data labels side
            // by side.
            multiplier = dataLabelsOptions.alternate ?
                (isFirstOrLast ? 1.5 : 2) :
                1,
            availableSpace = Math.floor(series.xAxis.len / visiblePointsCount),
            pad = dataLabel.padding;
        var distance,
            targetDLWidth,
            styles;
        // Adjust data label width to the currently available space.
        if (point.visible) {
            distance = Math.abs(userDLOptions.x || point.options.dataLabels.x);
            if (isInverted) {
                targetDLWidth = ((distance - pad) * 2 - ((point.itemHeight || 0) / 2));
                styles = {
                    width: (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)((_a = dataLabelsOptions.style) === null || _a === void 0 ? void 0 : _a.width, "" + (series.yAxis.len * 0.4) + "px"),
                    // Apply ellipsis when data label height is exceeded.
                    textOverflow: (dataLabel.width || 0) / targetDLWidth *
                        (dataLabel.height || 0) / 2 > availableSpace *
                        multiplier ?
                        'ellipsis' : 'none'
                };
            }
            else {
                styles = {
                    width: (userDLOptions.width ||
                        dataLabelsOptions.width ||
                        availableSpace * multiplier - (pad * 2)) + 'px'
                };
            }
            dataLabel.css(styles);
            if (!series.chart.styledMode) {
                dataLabel.shadow(dataLabelsOptions.shadow);
            }
        }
        _super.prototype.alignDataLabel.apply(series, arguments);
    };
    TimelineSeries.prototype.bindAxes = function () {
        var series = this;
        _super.prototype.bindAxes.call(this);
        // Initially set the linked xAxis type to category.
        if (!series.xAxis.userOptions.type) {
            series.xAxis.categories = series.xAxis.hasNames = true;
        }
    };
    TimelineSeries.prototype.distributeDL = function () {
        var _a;
        var series = this,
            dataLabelsOptions = series.options.dataLabels,
            inverted = series.chart.inverted;
        var visibilityIndex = 1;
        if (dataLabelsOptions) {
            var distance = (0,
                highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(dataLabelsOptions.distance,
                inverted ? 20 : 100);
            for (var _i = 0, _b = series.points; _i < _b.length; _i++) {
                var point = _b[_i];
                var defaults = (_a = {},
                        _a[inverted ? 'x' : 'y'] = dataLabelsOptions.alternate && visibilityIndex % 2 ?
                            -distance : distance,
                        _a);
                if (inverted) {
                    defaults.align = (dataLabelsOptions.alternate && visibilityIndex % 2) ? 'right' : 'left';
                }
                point.options.dataLabels = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(defaults, point.userDLOptions, 
                // Forced. Point level limitations.
                { zIndex: void 0 });
                // Delete so it doesn't override anything on merge.
                delete point.options.dataLabels.zIndex;
                visibilityIndex++;
            }
        }
    };
    TimelineSeries.prototype.generatePoints = function () {
        _super.prototype.generatePoints.call(this);
        var series = this,
            points = series.points,
            pointsLen = points.length,
            xData = series.getColumn('x');
        for (var i = 0, iEnd = pointsLen; i < iEnd; ++i) {
            points[i].x = xData[i];
        }
    };
    TimelineSeries.prototype.getVisibilityMap = function () {
        var series = this,
            nullInteraction = series.options.nullInteraction,
            map = ((series.data.length ? series.data : series.options.data) || []).map(function (point) { return (point &&
                point.visible !== false &&
                (!point.isNull || nullInteraction) ?
                point :
                false); });
        return map;
    };
    TimelineSeries.prototype.getXExtremes = function (xData) {
        var series = this,
            filteredData = xData.filter(function (_x,
            i) { return (series.points[i].isValid() &&
                series.points[i].visible); });
        return {
            min: (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.arrayMin)(filteredData),
            max: (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.arrayMax)(filteredData)
        };
    };
    TimelineSeries.prototype.init = function () {
        var series = this;
        _super.prototype.init.apply(series, arguments);
        series.eventsToUnbind.push((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(series, 'afterTranslate', function () {
            var lastPlotX,
                closestPointRangePx = Number.MAX_VALUE;
            for (var _i = 0, _a = series.points; _i < _a.length; _i++) {
                var point = _a[_i];
                // Set the isInside parameter basing also on the real point
                // visibility, in order to avoid showing hidden points
                // in drawPoints method.
                point.isInside = point.isInside && point.visible;
                // New way of calculating closestPointRangePx value, which
                // respects the real point visibility is needed.
                if (point.visible && (!point.isNull ||
                    series.options.nullInteraction)) {
                    if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(lastPlotX)) {
                        closestPointRangePx = Math.min(closestPointRangePx, Math.abs(point.plotX - lastPlotX));
                    }
                    lastPlotX = point.plotX;
                }
            }
            series.closestPointRangePx = closestPointRangePx;
        }));
        // Distribute data labels before rendering them. Distribution is
        // based on the 'dataLabels.distance' and 'dataLabels.alternate'
        // property.
        series.eventsToUnbind.push((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(series, 'drawDataLabels', function () {
            // Distribute data labels basing on defined algorithm.
            series.distributeDL(); // @todo use this scope for series
        }));
        series.eventsToUnbind.push((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(series, 'afterDrawDataLabels', function () {
            var dataLabel; // @todo use this scope for series
                // Draw or align connector for each point.
                for (var _i = 0,
                _a = series.points; _i < _a.length; _i++) {
                    var point = _a[_i];
                dataLabel = point.dataLabel;
                if (dataLabel) {
                    // Within this wrap method is necessary to save the
                    // current animation params, because the data label
                    // target position (after animation) is needed to align
                    // connectors.
                    dataLabel.animate = function (params) {
                        if (this.targetPosition) {
                            this.targetPosition = params;
                        }
                        return this.renderer.Element.prototype
                            .animate.apply(this, arguments);
                    };
                    // Initialize the targetPosition field within data label
                    // object. It's necessary because there is need to know
                    // expected position of specific data label, when
                    // aligning connectors. This field is overridden inside
                    // of SVGElement.animate() wrapped method.
                    if (!dataLabel.targetPosition) {
                        dataLabel.targetPosition = {};
                    }
                    point.drawConnector();
                }
            }
        }));
        series.eventsToUnbind.push((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(series.chart, 'afterHideOverlappingLabel', function () {
            for (var _i = 0, _a = series.points; _i < _a.length; _i++) {
                var p = _a[_i];
                if (p.dataLabel &&
                    p.dataLabel.connector &&
                    p.dataLabel.oldOpacity !== p.dataLabel.newOpacity) {
                    p.alignConnector();
                }
            }
        }));
    };
    TimelineSeries.prototype.markerAttribs = function (point, state) {
        var _a,
            _b;
        var series = this,
            seriesMarkerOptions = series.options.marker,
            pointMarkerOptions = point.marker || {},
            symbol = (pointMarkerOptions.symbol || (seriesMarkerOptions === null || seriesMarkerOptions === void 0 ? void 0 : seriesMarkerOptions.symbol)),
            width = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(pointMarkerOptions.width,
            seriesMarkerOptions === null || seriesMarkerOptions === void 0 ? void 0 : seriesMarkerOptions.width,
            series.closestPointRangePx),
            height = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(pointMarkerOptions.height,
            seriesMarkerOptions === null || seriesMarkerOptions === void 0 ? void 0 : seriesMarkerOptions.height);
        var seriesStateOptions,
            pointStateOptions,
            radius = 0;
        // Call default markerAttribs method, when the xAxis type
        // is set to datetime.
        if (series.xAxis.dateTime) {
            return _super.prototype.markerAttribs.call(this, point, state);
        }
        // Handle hover and select states
        if (state) {
            seriesStateOptions = (_a = seriesMarkerOptions === null || seriesMarkerOptions === void 0 ? void 0 : seriesMarkerOptions.states) === null || _a === void 0 ? void 0 : _a[state];
            pointStateOptions = (_b = pointMarkerOptions.states) === null || _b === void 0 ? void 0 : _b[state];
            radius = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(pointStateOptions === null || pointStateOptions === void 0 ? void 0 : pointStateOptions.radius, seriesStateOptions === null || seriesStateOptions === void 0 ? void 0 : seriesStateOptions.radius, radius + ((seriesStateOptions === null || seriesStateOptions === void 0 ? void 0 : seriesStateOptions.radiusPlus) || 0));
        }
        point.hasImage = !!(symbol && symbol.indexOf('url') === 0);
        var attribs = {
                x: Math.floor(point.plotX) - (width / 2) - (radius / 2),
                y: point.plotY - (height / 2) - (radius / 2),
                width: width + radius,
                height: height + radius
            };
        return (series.chart.inverted) ? {
            y: (attribs.x && attribs.width) &&
                series.xAxis.len - attribs.x - attribs.width,
            x: attribs.y && attribs.y,
            width: attribs.height,
            height: attribs.width
        } : attribs;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    TimelineSeries.defaultOptions = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(LineSeries.defaultOptions, Timeline_TimelineSeriesDefaults);
    return TimelineSeries;
}(LineSeries));
// Add series-specific properties after data is already processed, #17890
(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(TimelineSeries, 'afterProcessData', function () {
    var series = this,
        yData = series.getColumn('y');
    var visiblePoints = 0;
    series.visibilityMap = series.getVisibilityMap();
    // Calculate currently visible points.
    for (var _i = 0, _a = series.visibilityMap; _i < _a.length; _i++) {
        var point = _a[_i];
        if (point) {
            visiblePoints++;
        }
    }
    series.visiblePointsCount = visiblePoints;
    yData.length = series.dataTable.rowCount;
    for (var i = 0; i < yData.length; ++i) {
        yData[i] = yData[i] === null ? null : 1;
    }
    this.dataTable.setColumn('y', yData);
});
(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(TimelineSeries.prototype, {
    // Use a group of trackers from TrackerMixin
    drawTracker: ColumnSeries.prototype.drawTracker,
    pointClass: Timeline_TimelinePoint,
    trackerGroups: ['markerGroup', 'dataLabelsGroup']
});
highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default().registerSeriesType('timeline', TimelineSeries);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Timeline_TimelineSeries = ((/* unused pure expression or super */ null && (TimelineSeries)));

;// ./code/es5/es-modules/masters/modules/timeline.src.js




/* harmony default export */ var timeline_src = ((highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()));

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});