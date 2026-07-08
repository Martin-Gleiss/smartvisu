// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v13.0.0 (2026-06-11)
 * @module highcharts/modules/sunburst
 * @requires highcharts
 *
 * (c) 2016-2026 Highsoft AS
 * Authors: Jon Arild Nygård
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(root["_Highcharts"], root["_Highcharts"]["Templating"], root["_Highcharts"]["Color"], root["_Highcharts"]["SeriesRegistry"], root["_Highcharts"]["SVGElement"], root["_Highcharts"]["Series"]);
	else if(typeof define === 'function' && define.amd)
		define("highcharts/modules/sunburst", ["highcharts/highcharts"], function (amd1) {return factory(amd1,amd1["Templating"],amd1["Color"],amd1["SeriesRegistry"],amd1["SVGElement"],amd1["Series"]);});
	else if(typeof exports === 'object')
		exports["highcharts/modules/sunburst"] = factory(root["_Highcharts"], root["_Highcharts"]["Templating"], root["_Highcharts"]["Color"], root["_Highcharts"]["SeriesRegistry"], root["_Highcharts"]["SVGElement"], root["_Highcharts"]["Series"]);
	else
		root["Highcharts"] = factory(root["Highcharts"], root["Highcharts"]["Templating"], root["Highcharts"]["Color"], root["Highcharts"]["SeriesRegistry"], root["Highcharts"]["SVGElement"], root["Highcharts"]["Series"]);
})(typeof window === 'undefined' ? this : window, function(__WEBPACK_EXTERNAL_MODULE__944__, __WEBPACK_EXTERNAL_MODULE__984__, __WEBPACK_EXTERNAL_MODULE__620__, __WEBPACK_EXTERNAL_MODULE__512__, __WEBPACK_EXTERNAL_MODULE__28__, __WEBPACK_EXTERNAL_MODULE__820__) {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 28:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__28__;

/***/ }),

/***/ 512:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__512__;

/***/ }),

/***/ 620:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__620__;

/***/ }),

/***/ 820:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__820__;

/***/ }),

/***/ 944:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__944__;

/***/ }),

/***/ 984:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__984__;

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
  "default": function() { return /* binding */ sunburst_src; }
});

// EXTERNAL MODULE: external {"amd":["highcharts/highcharts"],"commonjs":["highcharts"],"commonjs2":["highcharts"],"root":["Highcharts"]}
var highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_ = __webpack_require__(944);
var highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default = /*#__PURE__*/__webpack_require__.n(highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_);
;// ./code/es5/es-modules/Extensions/Breadcrumbs/BreadcrumbsDefaults.js
/* *
 *
 *  Highcharts Breadcrumbs module
 *
 *  Authors: Grzegorz Blachliński, Karol Kołodziej
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
 * @optionparent lang
 */
var lang = {
    /**
     * The text for the main breadcrumb.
     *
     * @since   10.0.0
     * @product highcharts highmaps
     */
    mainBreadcrumb: 'Main'
};
/**
 * Options for breadcrumbs. Breadcrumbs general options are defined in
 * `navigation.breadcrumbs`. Specific options for drilldown are set in
 * `drilldown.breadcrumbs` and for tree-like series traversing, in
 * `plotOptions[series].breadcrumbs`.
 *
 * @since        10.0.0
 * @product      highcharts
 * @optionparent navigation.breadcrumbs
 */
var options = {
    /**
     * The default padding for each button and separator in each direction.
     *
     * @type  {number}
     * @since 10.0.0
     */
    buttonSpacing: 5,
    /**
     * A collection of attributes for the buttons. The object takes SVG
     * attributes like `fill`, `stroke`, `stroke-width`, as well as `style`,
     * a collection of CSS properties for the text.
     *
     * The object can also be extended with states, so you can set
     * presentational options for `hover`, `select` or `disabled` button
     * states.
     *
     * @sample {highcharts} highcharts/breadcrumbs/single-button
     *         Themed, single button
     *
     * @type    {Highcharts.SVGAttributes}
     * @since   10.0.0
     * @product highcharts
     */
    buttonTheme: {
        /** @ignore */
        fill: 'none',
        /** @ignore */
        height: 18,
        /** @ignore */
        padding: 2,
        /** @ignore */
        'stroke-width': 0,
        /** @ignore */
        zIndex: 7,
        /** @ignore */
        states: {
            select: {
                fill: 'none'
            }
        },
        style: {
            color: 'var(--highcharts-highlight-color-80)'
        }
    },
    /**
     * Fires when clicking on a breadcrumb button. Two arguments are passed
     * to the function. First is the click event. Second is the breadcrumb
     * options for the clicked button.
     *
     * ```js
     * click: function (e, breadcrumb) {
     *   console.log(breadcrumb.level);
     * }
     * ```
     *
     * Return false to stop default buttons click action.
     *
     * @type      {Highcharts.BreadcrumbsClickCallbackFunction}
     * @since     10.0.0
     * @apioption navigation.breadcrumbs.events.click
     */
    /**
     * When the breadcrumbs are floating, the plot area will not move to
     * make space for it. By default, the chart will not make space for the
     * buttons. This property won't work when positioned in the middle.
     *
     * @sample highcharts/breadcrumbs/single-button
     *         Floating button
     *
     * @type  {boolean}
     * @since 10.0.0
     */
    floating: false,
    /**
     * A format string for the breadcrumbs button. Variables are enclosed by
     * curly brackets. Available values are passed in the declared point
     * options.
     *
     * @type      {string|undefined}
     * @since 10.0.0
     * @default   undefined
     * @sample {highcharts} highcharts/breadcrumbs/format Display custom
     *          values in breadcrumb button.
     */
    format: void 0,
    /**
     * Callback function to format the breadcrumb text from scratch.
     *
     * @type      {Highcharts.BreadcrumbsFormatterCallbackFunction}
     * @since     10.0.0
     * @default   undefined
     * @apioption navigation.breadcrumbs.formatter
     */
    /**
     * What box to align the button to. Can be either `plotBox` or
     * `spacingBox`.
     *
     * @type    {Highcharts.ButtonRelativeToValue}
     * @default plotBox
     * @since   10.0.0
     * @product highcharts highmaps
     */
    relativeTo: 'plotBox',
    /**
     * Whether to reverse the order of buttons. This is common in Arabic
     * and Hebrew.
     *
     * @sample {highcharts} highcharts/breadcrumbs/rtl
     *         Breadcrumbs in RTL
     *
     * @type  {boolean}
     * @since 10.2.0
     */
    rtl: false,
    /**
     * Positioning for the button row. The breadcrumbs buttons will be
     * aligned properly for the default chart layout (title,  subtitle,
     * legend, range selector) for the custom chart layout set the position
     * properties.
     *
     * @sample  {highcharts} highcharts/breadcrumbs/single-button
     *          Single, right aligned button
     *
     * @type    {Highcharts.BreadcrumbsAlignOptions}
     * @since   10.0.0
     * @product highcharts highmaps
     */
    position: {
        /**
         * Horizontal alignment of the breadcrumbs buttons.
         *
         * @type {Highcharts.AlignValue}
         */
        align: 'left',
        /**
         * Vertical alignment of the breadcrumbs buttons.
         *
         * @type {Highcharts.VerticalAlignValue}
         */
        verticalAlign: 'top',
        /**
         * The X offset of the breadcrumbs button group.
         *
         * @type {number}
         */
        x: 0,
        /**
         * The Y offset of the breadcrumbs button group. When `undefined`,
         * and `floating` is `false`, the `y` position is adapted so that
         * the breadcrumbs are rendered outside the target area.
         *
         * @type {number|undefined}
         */
        y: void 0
    },
    /**
     * Options object for Breadcrumbs separator.
     *
     * @since 10.0.0
     */
    separator: {
        /**
         * @type    {string}
         * @since   10.0.0
         * @product highcharts
         */
        text: '/',
        /**
         * CSS styles for the breadcrumbs separator.
         *
         * In styled mode, the breadcrumbs separators are styled by the
         * `.highcharts-separator` rule with its different states.
         *
         *  @type  {Highcharts.CSSObject}
         *  @since 10.0.0
         */
        style: {
            color: 'var(--highcharts-neutral-color-60)',
            fontSize: '0.8em'
        }
    },
    /**
     * Show full path or only a single button.
     *
     * @sample {highcharts} highcharts/breadcrumbs/single-button
     *         Single, styled button
     *
     * @type  {boolean}
     * @since 10.0.0
     */
    showFullPath: true,
    /**
     * CSS styles for all breadcrumbs.
     *
     * In styled mode, the breadcrumbs buttons are styled by the
     * `.highcharts-breadcrumbs-buttons .highcharts-button` rule with its
     * different states.
     *
     * @type  {Highcharts.SVGAttributes}
     * @since 10.0.0
     */
    style: {},
    /**
     * Whether to use HTML to render the breadcrumbs items texts.
     *
     * @type  {boolean}
     * @since 10.0.0
     */
    useHTML: false,
    /**
     * The z index of the breadcrumbs group.
     *
     * @type  {number}
     * @since 10.0.0
     */
    zIndex: 7
};
/* *
 *
 *  Default Export
 *
 * */
/** @internal */
var BreadcrumbsDefaults = {
    lang: lang,
    options: options
};
/** @internal */
/* harmony default export */ var Breadcrumbs_BreadcrumbsDefaults = (BreadcrumbsDefaults);

// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","Templating"],"commonjs":["highcharts","Templating"],"commonjs2":["highcharts","Templating"],"root":["Highcharts","Templating"]}
var highcharts_Templating_commonjs_highcharts_Templating_commonjs2_highcharts_Templating_root_Highcharts_Templating_ = __webpack_require__(984);
var highcharts_Templating_commonjs_highcharts_Templating_commonjs2_highcharts_Templating_root_Highcharts_Templating_default = /*#__PURE__*/__webpack_require__.n(highcharts_Templating_commonjs_highcharts_Templating_commonjs2_highcharts_Templating_root_Highcharts_Templating_);
;// ./code/es5/es-modules/Extensions/Breadcrumbs/Breadcrumbs.js
/* *
 *
 *  Highcharts Breadcrumbs module
 *
 *  Authors: Grzegorz Blachliński, Karol Kołodziej
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */



var format = (highcharts_Templating_commonjs_highcharts_Templating_commonjs2_highcharts_Templating_root_Highcharts_Templating_default()).format;

var composed = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).composed;

/* *
 *
 *  Functions
 *
 * */
/**
 * Shift the drillUpButton to make the space for resetZoomButton, #8095.
 * @internal
 */
function onChartAfterShowResetZoom() {
    var chart = this;
    if (chart.breadcrumbs) {
        var bbox = chart.resetZoomButton &&
                chart.resetZoomButton.getBBox(),
            breadcrumbsOptions = chart.breadcrumbs.options;
        if (bbox &&
            breadcrumbsOptions.position.align === 'right' &&
            breadcrumbsOptions.relativeTo === 'plotBox') {
            chart.breadcrumbs.alignBreadcrumbsGroup(-bbox.width - breadcrumbsOptions.buttonSpacing);
        }
    }
}
/**
 * Remove resize/afterSetExtremes at chart destroy.
 * @internal
 */
function onChartDestroy() {
    if (this.breadcrumbs) {
        this.breadcrumbs.destroy();
        this.breadcrumbs = void 0;
    }
}
/**
 * Logic for making space for the buttons above the plot area
 * @internal
 */
function onChartGetMargins() {
    var breadcrumbs = this.breadcrumbs;
    if (breadcrumbs &&
        !breadcrumbs.options.floating &&
        breadcrumbs.level) {
        var breadcrumbsOptions = breadcrumbs.options,
            buttonTheme = breadcrumbsOptions.buttonTheme,
            breadcrumbsHeight = ((buttonTheme.height || 0) +
                2 * (buttonTheme.padding || 0) +
                breadcrumbsOptions.buttonSpacing),
            verticalAlign = breadcrumbsOptions.position.verticalAlign;
        if (verticalAlign === 'bottom') {
            this.marginBottom = (this.marginBottom || 0) + breadcrumbsHeight;
            breadcrumbs.yOffset = breadcrumbsHeight;
        }
        else if (verticalAlign !== 'middle') {
            this.plotTop += breadcrumbsHeight;
            breadcrumbs.yOffset = -breadcrumbsHeight;
        }
        else {
            breadcrumbs.yOffset = void 0;
        }
    }
}
/** @internal */
function onChartRedraw() {
    this.breadcrumbs && this.breadcrumbs.redraw();
}
/**
 * After zooming out, shift the drillUpButton to the previous position, #8095.
 * @internal
 */
function onChartSelection(event) {
    if (event.resetSelection === true &&
        this.breadcrumbs) {
        this.breadcrumbs.alignBreadcrumbsGroup();
    }
}
/* *
 *
 *  Class
 *
 * */
/**
 * The Breadcrumbs class
 *
 * @internal
 * @class
 * @name Highcharts.Breadcrumbs
 *
 * @param {Highcharts.Chart} chart
 *        Chart object
 * @param {Highcharts.Options} userOptions
 *        User options
 */
var Breadcrumbs = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    function Breadcrumbs(chart, userOptions) {
        this.elementList = {};
        this.isDirty = true;
        this.level = 0;
        this.list = [];
        var chartOptions = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(chart.options.drilldown &&
                chart.options.drilldown.drillUpButton,
            Breadcrumbs.defaultOptions,
            chart.options.navigation && chart.options.navigation.breadcrumbs,
            userOptions);
        this.chart = chart;
        this.options = chartOptions || {};
    }
    /* *
     *
     *  Functions
     *
     * */
    Breadcrumbs.compose = function (ChartClass, highchartsDefaultOptions) {
        if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pushUnique)(composed, 'Breadcrumbs')) {
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(ChartClass, 'destroy', onChartDestroy);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(ChartClass, 'afterShowResetZoom', onChartAfterShowResetZoom);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(ChartClass, 'getMargins', onChartGetMargins);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(ChartClass, 'redraw', onChartRedraw);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(ChartClass, 'selection', onChartSelection);
            // Add language support.
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(highchartsDefaultOptions.lang, Breadcrumbs_BreadcrumbsDefaults.lang);
        }
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Update Breadcrumbs properties, like level and list.
     *
     * @function Highcharts.Breadcrumbs#updateProperties
     */
    Breadcrumbs.prototype.updateProperties = function (list) {
        this.setList(list);
        this.setLevel();
        this.isDirty = true;
    };
    /**
     * Set breadcrumbs list.
     */
    Breadcrumbs.prototype.setList = function (list) {
        this.list = list;
    };
    /**
     * Calculate level on which chart currently is.
     *
     * @function Highcharts.Breadcrumbs#setLevel
     */
    Breadcrumbs.prototype.setLevel = function () {
        this.level = this.list.length && this.list.length - 1;
    };
    /**
     * Get Breadcrumbs level
     *
     * @function Highcharts.Breadcrumbs#getLevel
     */
    Breadcrumbs.prototype.getLevel = function () {
        return this.level;
    };
    /**
     * Default button text formatter.
     *
     * @function Highcharts.Breadcrumbs#getButtonText
     * @param {Highcharts.BreadcrumbsOptions} breadcrumb
     *        Breadcrumb.
     * @return {string}
     *         Formatted text.
     */
    Breadcrumbs.prototype.getButtonText = function (breadcrumb) {
        var breadcrumbs = this,
            chart = breadcrumbs.chart,
            breadcrumbsOptions = breadcrumbs.options,
            lang = chart.options.lang,
            textFormat = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(breadcrumbsOptions.format,
            breadcrumbsOptions.showFullPath ?
                '{level.name}' : '← {level.name}'),
            defaultText = lang && (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(lang.drillUpText,
            lang.mainBreadcrumb);
        var returnText = breadcrumbsOptions.formatter &&
                breadcrumbsOptions.formatter(breadcrumb) ||
                format(textFormat, { level: breadcrumb.levelOptions },
            chart) || '';
        if ((((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isString)(returnText) &&
            !returnText.length) ||
            returnText === '← ') &&
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(defaultText)) {
            returnText = !breadcrumbsOptions.showFullPath ?
                '← ' + defaultText :
                defaultText;
        }
        return returnText;
    };
    /**
     * Redraw.
     *
     * @function Highcharts.Breadcrumbs#redraw
     */
    Breadcrumbs.prototype.redraw = function () {
        if (this.isDirty) {
            this.render();
        }
        if (this.group) {
            this.group.align();
        }
        this.isDirty = false;
    };
    /**
     * Create a group, then draw breadcrumbs together with the separators.
     *
     * @function Highcharts.Breadcrumbs#render
     */
    Breadcrumbs.prototype.render = function () {
        var breadcrumbs = this,
            chart = breadcrumbs.chart,
            breadcrumbsOptions = breadcrumbs.options;
        // A main group for the breadcrumbs.
        if (!breadcrumbs.group && breadcrumbsOptions) {
            breadcrumbs.group = chart.renderer
                .g('breadcrumbs-group')
                .addClass('highcharts-no-tooltip highcharts-breadcrumbs')
                .attr({
                zIndex: breadcrumbsOptions.zIndex
            })
                .add();
        }
        // Draw breadcrumbs.
        if (breadcrumbsOptions.showFullPath) {
            this.renderFullPathButtons();
        }
        else {
            this.renderSingleButton();
        }
        this.alignBreadcrumbsGroup();
    };
    /**
     * Draw breadcrumbs together with the separators.
     *
     * @function Highcharts.Breadcrumbs#renderFullPathButtons
     */
    Breadcrumbs.prototype.renderFullPathButtons = function () {
        // Make sure that only one type of button is visible.
        this.destroySingleButton();
        this.resetElementListState();
        this.updateListElements();
        this.destroyListElements();
    };
    /**
     * Render Single button - when showFullPath is not used. The button is
     * similar to the old drillUpButton
     *
     * @function Highcharts.Breadcrumbs#renderSingleButton
     */
    Breadcrumbs.prototype.renderSingleButton = function () {
        var breadcrumbs = this,
            chart = breadcrumbs.chart,
            list = breadcrumbs.list,
            breadcrumbsOptions = breadcrumbs.options,
            buttonSpacing = breadcrumbsOptions.buttonSpacing;
        // Make sure that only one type of button is visible.
        this.destroyListElements();
        // Draw breadcrumbs. Initial position for calculating the breadcrumbs
        // group.
        var posX = breadcrumbs.group ?
                breadcrumbs.group.getBBox().width :
                buttonSpacing,
            posY = buttonSpacing;
        var previousBreadcrumb = list[list.length - 2];
        if (!chart.drillUpButton && (this.level > 0)) {
            chart.drillUpButton = breadcrumbs.renderButton(previousBreadcrumb, posX, posY);
        }
        else if (chart.drillUpButton) {
            if (this.level > 0) {
                // Update button.
                this.updateSingleButton();
            }
            else {
                this.destroySingleButton();
            }
        }
    };
    /**
     * Update group position based on align and it's width.
     *
     * @function Highcharts.Breadcrumbs#alignBreadcrumbsGroup
     * @param {number} [xOffset]
     *        Optional horizontal offset.
     */
    Breadcrumbs.prototype.alignBreadcrumbsGroup = function (xOffset) {
        var breadcrumbs = this;
        if (breadcrumbs.group) {
            var breadcrumbsOptions = breadcrumbs.options,
                buttonTheme = breadcrumbsOptions.buttonTheme,
                positionOptions = breadcrumbsOptions.position,
                alignTo = (breadcrumbsOptions.relativeTo === 'chart' ||
                    breadcrumbsOptions.relativeTo === 'spacingBox' ?
                    void 0 :
                    'plotBox'),
                bBox = breadcrumbs.group.getBBox(),
                additionalSpace = 2 * (buttonTheme.padding || 0) +
                    breadcrumbsOptions.buttonSpacing;
            // Store positionOptions
            positionOptions.width = bBox.width + additionalSpace;
            positionOptions.height = bBox.height + additionalSpace;
            var newPositions = (0,
                highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(positionOptions);
            // Add x offset if specified.
            if (xOffset) {
                newPositions.x += xOffset;
            }
            if (breadcrumbs.options.rtl) {
                newPositions.x += positionOptions.width;
            }
            newPositions.y = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(newPositions.y, this.yOffset, 0);
            breadcrumbs.group.align(newPositions, true, alignTo);
        }
    };
    /**
     * Render a button.
     *
     * @function Highcharts.Breadcrumbs#renderButton
     * @param {Highcharts.Breadcrumbs} breadcrumb
     *        Current breadcrumb
     * @param {number} posX
     *        Initial horizontal position
     * @param {number} posY
     *        Initial vertical position
     * @return {SVGElement|void}
     *        Returns the SVG button
     */
    Breadcrumbs.prototype.renderButton = function (breadcrumb, posX, posY) {
        var breadcrumbs = this,
            chart = this.chart,
            breadcrumbsOptions = breadcrumbs.options,
            buttonTheme = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(breadcrumbsOptions.buttonTheme);
        var button = chart.renderer
                .button(breadcrumbs.getButtonText(breadcrumb), posX, posY, function (e /* @todo (Event|any) */) {
                // Extract events from button object and call
                var buttonEvents = breadcrumbsOptions.events &&
                    breadcrumbsOptions.events.click;
            var callDefaultEvent;
            if (buttonEvents) {
                callDefaultEvent = buttonEvents.call(breadcrumbs, e, breadcrumb, 
                // Keep `ctx` for callback parity with arrow functions.
                // Not documented in public API because Breadcrumbs
                // is an internal class.
                breadcrumbs);
            }
            // (difference in behavior of showFullPath and drillUp)
            if (callDefaultEvent !== false) {
                // For single button we are not going to the button
                // level, but the one level up
                if (!breadcrumbsOptions.showFullPath) {
                    e.newLevel = breadcrumbs.level - 1;
                }
                else {
                    e.newLevel = breadcrumb.level;
                }
                (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(breadcrumbs, 'up', e);
            }
        }, buttonTheme)
            .addClass('highcharts-breadcrumbs-button')
            .add(breadcrumbs.group);
        if (!chart.styledMode) {
            button.attr(breadcrumbsOptions.style);
        }
        return button;
    };
    /**
     * Render a separator.
     *
     * @function Highcharts.Breadcrumbs#renderSeparator
     * @param {number} posX
     *        Initial horizontal position
     * @param {number} posY
     *        Initial vertical position
     * @return {Highcharts.SVGElement}
     *        Returns the SVG button
     */
    Breadcrumbs.prototype.renderSeparator = function (posX, posY) {
        var breadcrumbs = this,
            chart = this.chart,
            breadcrumbsOptions = breadcrumbs.options,
            separatorOptions = breadcrumbsOptions.separator;
        var separator = chart.renderer
                .label(separatorOptions.text,
            posX,
            posY,
            void 0,
            void 0,
            void 0,
            false)
                .addClass('highcharts-breadcrumbs-separator')
                .add(breadcrumbs.group);
        if (!chart.styledMode) {
            separator.css(separatorOptions.style);
        }
        return separator;
    };
    Breadcrumbs.prototype.update = function (options) {
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(true, this.options, options);
        this.destroy();
        this.isDirty = true;
    };
    /**
     * Update button text when the showFullPath set to false.
     * @function Highcharts.Breadcrumbs#updateSingleButton
     */
    Breadcrumbs.prototype.updateSingleButton = function () {
        var chart = this.chart,
            currentBreadcrumb = this.list[this.level - 1];
        if (chart.drillUpButton) {
            chart.drillUpButton.attr({
                text: this.getButtonText(currentBreadcrumb)
            });
        }
    };
    /**
     * Destroy the chosen breadcrumbs group
     *
     * @function Highcharts.Breadcrumbs#destroy
     */
    Breadcrumbs.prototype.destroy = function () {
        this.destroySingleButton();
        // Destroy elements one by one. It's necessary because
        // g().destroy() does not remove added HTML
        this.destroyListElements(true);
        // Then, destroy the group itself.
        if (this.group) {
            this.group.destroy();
        }
        this.group = void 0;
    };
    /**
     * Destroy the elements' buttons and separators.
     *
     * @function Highcharts.Breadcrumbs#destroyListElements
     */
    Breadcrumbs.prototype.destroyListElements = function (force) {
        var elementList = this.elementList;
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.objectEach)(elementList, function (element, level) {
            if (force ||
                !elementList[level].updated) {
                element = elementList[level];
                element.button && element.button.destroy();
                element.separator && element.separator.destroy();
                delete element.button;
                delete element.separator;
                delete elementList[level];
            }
        });
        if (force) {
            this.elementList = {};
        }
    };
    /**
     * Destroy the single button if exists.
     *
     * @function Highcharts.Breadcrumbs#destroySingleButton
     */
    Breadcrumbs.prototype.destroySingleButton = function () {
        if (this.chart.drillUpButton) {
            this.chart.drillUpButton.destroy();
            this.chart.drillUpButton = void 0;
        }
    };
    /**
     * Reset state for all buttons in elementList.
     *
     * @function Highcharts.Breadcrumbs#resetElementListState
     */
    Breadcrumbs.prototype.resetElementListState = function () {
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.objectEach)(this.elementList, function (element) {
            element.updated = false;
        });
    };
    /**
     * Update rendered elements inside the elementList.
     *
     * @function Highcharts.Breadcrumbs#updateListElements
     */
    Breadcrumbs.prototype.updateListElements = function () {
        var breadcrumbs = this,
            elementList = breadcrumbs.elementList,
            buttonSpacing = breadcrumbs.options.buttonSpacing,
            posY = buttonSpacing,
            list = breadcrumbs.list,
            rtl = breadcrumbs.options.rtl,
            rtlFactor = rtl ? -1 : 1,
            updateXPosition = function (element,
            spacing) {
                return rtlFactor * element.getBBox().width +
                    rtlFactor * spacing;
        }, adjustToRTL = function (element, posX, posY) {
            element.translate(posX - element.getBBox().width, posY);
        };
        // Initial position for calculating the breadcrumbs group.
        var posX = breadcrumbs.group ?
                updateXPosition(breadcrumbs.group,
            buttonSpacing) :
                buttonSpacing,
            currentBreadcrumb,
            breadcrumb;
        for (var i = 0, iEnd = list.length; i < iEnd; ++i) {
            var isLast = i === iEnd - 1;
            var button = void 0,
                separator = void 0;
            breadcrumb = list[i];
            if (elementList[breadcrumb.level]) {
                currentBreadcrumb = elementList[breadcrumb.level];
                button = currentBreadcrumb.button;
                // Render a separator if it was not created before.
                if (!currentBreadcrumb.separator &&
                    !isLast) {
                    // Add spacing for the next separator
                    posX += rtlFactor * buttonSpacing;
                    currentBreadcrumb.separator =
                        breadcrumbs.renderSeparator(posX, posY);
                    if (rtl) {
                        adjustToRTL(currentBreadcrumb.separator, posX, posY);
                    }
                    posX += updateXPosition(currentBreadcrumb.separator, buttonSpacing);
                }
                else if (currentBreadcrumb.separator &&
                    isLast) {
                    currentBreadcrumb.separator.destroy();
                    delete currentBreadcrumb.separator;
                }
                elementList[breadcrumb.level].updated = true;
            }
            else {
                // Render a button.
                button = breadcrumbs.renderButton(breadcrumb, posX, posY);
                if (rtl) {
                    adjustToRTL(button, posX, posY);
                }
                posX += updateXPosition(button, buttonSpacing);
                // Render a separator.
                if (!isLast) {
                    separator = breadcrumbs.renderSeparator(posX, posY);
                    if (rtl) {
                        adjustToRTL(separator, posX, posY);
                    }
                    posX += updateXPosition(separator, buttonSpacing);
                }
                elementList[breadcrumb.level] = {
                    button: button,
                    separator: separator,
                    updated: true
                };
            }
            if (button) {
                button.setState(isLast ? 2 : 0);
            }
        }
    };
    /* *
     *
     *  Static Properties
     *
     * */
    Breadcrumbs.defaultOptions = Breadcrumbs_BreadcrumbsDefaults.options;
    return Breadcrumbs;
}());
/* *
 *
 *  Default Export
 *
 * */
/** @internal */
/* harmony default export */ var Breadcrumbs_Breadcrumbs = (Breadcrumbs);
/* *
 *
 *  API Declarations
 *
 * */
/**
 * Callback function to react on button clicks.
 *
 * @callback Highcharts.BreadcrumbsClickCallbackFunction
 *
 * @param {Highcharts.Event} event
 * Event.
 *
 * @param {Highcharts.BreadcrumbOptions} breadcrumb
 * Breadcrumb options.
 */
/**
 * Callback function to format the breadcrumb text from scratch.
 *
 * @callback Highcharts.BreadcrumbsFormatterCallbackFunction
 *
 * @param {Highcharts.BreadcrumbOptions} options
 * Breadcrumb options.
 *
 * @return {string}
 * Formatted text or false
 */
/**
 * Options for the one breadcrumb.
 *
 * @interface Highcharts.BreadcrumbOptions
 */
/**
 * Level connected to a specific breadcrumb.
 * @name Highcharts.BreadcrumbOptions#level
 * @type {number}
 */
/**
 * Options for series or point connected to a specific breadcrumb.
 * @name Highcharts.BreadcrumbOptions#levelOptions
 * @type {SeriesOptions|PointOptionsObject}
 */
/**
 * Options for aligning breadcrumbs group.
 *
 * @interface Highcharts.BreadcrumbsAlignOptions
 */
/**
 * Align of a Breadcrumb group.
 * @default right
 * @name Highcharts.BreadcrumbsAlignOptions#align
 * @type {AlignValue}
 */
/**
 * Vertical align of a Breadcrumb group.
 * @default top
 * @name Highcharts.BreadcrumbsAlignOptions#verticalAlign
 * @type {VerticalAlignValue}
 */
/**
 * X offset of a Breadcrumbs group.
 * @name Highcharts.BreadcrumbsAlignOptions#x
 * @type {number}
 */
/**
 * Y offset of a Breadcrumbs group.
 * @name Highcharts.BreadcrumbsAlignOptions#y
 * @type {number}
 */
(''); // Keeps doclets above in JS file

// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","Color"],"commonjs":["highcharts","Color"],"commonjs2":["highcharts","Color"],"root":["Highcharts","Color"]}
var highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_ = __webpack_require__(620);
var highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_default = /*#__PURE__*/__webpack_require__.n(highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_);
// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","SeriesRegistry"],"commonjs":["highcharts","SeriesRegistry"],"commonjs2":["highcharts","SeriesRegistry"],"root":["Highcharts","SeriesRegistry"]}
var highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_ = __webpack_require__(512);
var highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default = /*#__PURE__*/__webpack_require__.n(highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_);
// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","SVGElement"],"commonjs":["highcharts","SVGElement"],"commonjs2":["highcharts","SVGElement"],"root":["Highcharts","SVGElement"]}
var highcharts_SVGElement_commonjs_highcharts_SVGElement_commonjs2_highcharts_SVGElement_root_Highcharts_SVGElement_ = __webpack_require__(28);
var highcharts_SVGElement_commonjs_highcharts_SVGElement_commonjs2_highcharts_SVGElement_root_Highcharts_SVGElement_default = /*#__PURE__*/__webpack_require__.n(highcharts_SVGElement_commonjs_highcharts_SVGElement_commonjs2_highcharts_SVGElement_root_Highcharts_SVGElement_);
;// ./code/es5/es-modules/Series/ColorMapComposition.js
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


var columnProto = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes.column.prototype;


/* *
 *
 *  Composition
 *
 * */
var ColorMapComposition;
(function (ColorMapComposition) {
    /* *
     *
     *  Constants
     *
     * */
    ColorMapComposition.pointMembers = {
        dataLabelOnNull: true,
        moveToTopOnHover: true,
        isValid: pointIsValid
    };
    ColorMapComposition.seriesMembers = {
        colorKey: 'value',
        axisTypes: ['xAxis', 'yAxis', 'colorAxis'],
        parallelArrays: ['x', 'y', 'value'],
        pointArrayMap: ['value'],
        trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
        colorAttribs: seriesColorAttribs,
        pointAttribs: columnProto.pointAttribs
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * @private
     */
    function compose(SeriesClass) {
        var PointClass = SeriesClass.prototype.pointClass;
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(PointClass, 'afterSetState', onPointAfterSetState);
        return SeriesClass;
    }
    ColorMapComposition.compose = compose;
    /**
     * Move points to the top of the z-index order when hovered.
     * @private
     */
    function onPointAfterSetState(e) {
        var point = this,
            series = point.series,
            renderer = series.chart.renderer;
        if (point.moveToTopOnHover && point.graphic) {
            if (!series.stateMarkerGraphic) {
                // Create a `use` element and add it to the end of the group,
                // which would make it appear on top of the other elements. This
                // deals with z-index without reordering DOM elements (#13049).
                series.stateMarkerGraphic = new (highcharts_SVGElement_commonjs_highcharts_SVGElement_commonjs2_highcharts_SVGElement_root_Highcharts_SVGElement_default())(renderer, 'use')
                    .css({
                    pointerEvents: 'none'
                })
                    .add(point.graphic.parentGroup);
            }
            if ((e === null || e === void 0 ? void 0 : e.state) === 'hover') {
                // Give the graphic DOM element the same id as the Point
                // instance
                point.graphic.attr({
                    id: this.id
                });
                series.stateMarkerGraphic.attr({
                    href: "" + renderer.url + "#".concat(this.id),
                    visibility: 'visible'
                });
            }
            else {
                series.stateMarkerGraphic.attr({
                    href: ''
                });
            }
        }
    }
    /**
     * Color points have a value option that determines whether or not it is
     * a null point
     * @private
     */
    function pointIsValid() {
        return (this.value !== null &&
            this.value !== Infinity &&
            this.value !== -Infinity &&
            // Undefined is allowed, but NaN is not (#17279)
            (this.value === void 0 || !isNaN(this.value)));
    }
    /**
     * Get the color attributes to apply on the graphic
     * @private
     * @function Highcharts.colorMapSeriesMixin.colorAttribs
     * @param {Highcharts.Point} point
     * @return {Highcharts.SVGAttributes}
     *         The SVG attributes
     */
    function seriesColorAttribs(point) {
        var ret = {};
        if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(point.color) &&
            (!point.state || point.state === 'normal') // #15746
        ) {
            ret[this.colorProp || 'fill'] = point.color;
        }
        return ret;
    }
})(ColorMapComposition || (ColorMapComposition = {}));
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Series_ColorMapComposition = (ColorMapComposition);

// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","Series"],"commonjs":["highcharts","Series"],"commonjs2":["highcharts","Series"],"root":["Highcharts","Series"]}
var highcharts_Series_commonjs_highcharts_Series_commonjs2_highcharts_Series_root_Highcharts_Series_ = __webpack_require__(820);
var highcharts_Series_commonjs_highcharts_Series_commonjs2_highcharts_Series_root_Highcharts_Series_default = /*#__PURE__*/__webpack_require__.n(highcharts_Series_commonjs_highcharts_Series_commonjs2_highcharts_Series_root_Highcharts_Series_);
;// ./code/es5/es-modules/Series/Treemap/TreemapAlgorithmGroup.js
/* *
 *
 *  (c) 2014-2026 Highsoft AS
 *
 *  Authors: Jon Arild Nygård / Øystein Moseng
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Class
 *
 * */
var TreemapAlgorithmGroup = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    function TreemapAlgorithmGroup(h, w, d, p) {
        this.height = h;
        this.width = w;
        this.plot = p;
        this.direction = d;
        this.startDirection = d;
        this.total = 0;
        this.nW = 0;
        this.lW = 0;
        this.nH = 0;
        this.lH = 0;
        this.elArr = [];
        this.lP = {
            total: 0,
            lH: 0,
            nH: 0,
            lW: 0,
            nW: 0,
            nR: 0,
            lR: 0,
            aspectRatio: function (w, h) {
                return Math.max((w / h), (h / w));
            }
        };
    }
    /* *
     *
     *  Functions
     *
     * */
    TreemapAlgorithmGroup.prototype.addElement = function (el) {
        this.lP.total = this.elArr[this.elArr.length - 1];
        this.total = this.total + el;
        if (this.direction === 0) {
            // Calculate last point old aspect ratio
            this.lW = this.nW;
            this.lP.lH = this.lP.total / this.lW;
            this.lP.lR = this.lP.aspectRatio(this.lW, this.lP.lH);
            // Calculate last point new aspect ratio
            this.nW = this.total / this.height;
            this.lP.nH = this.lP.total / this.nW;
            this.lP.nR = this.lP.aspectRatio(this.nW, this.lP.nH);
        }
        else {
            // Calculate last point old aspect ratio
            this.lH = this.nH;
            this.lP.lW = this.lP.total / this.lH;
            this.lP.lR = this.lP.aspectRatio(this.lP.lW, this.lH);
            // Calculate last point new aspect ratio
            this.nH = this.total / this.width;
            this.lP.nW = this.lP.total / this.nH;
            this.lP.nR = this.lP.aspectRatio(this.lP.nW, this.nH);
        }
        this.elArr.push(el);
    };
    TreemapAlgorithmGroup.prototype.reset = function () {
        this.nW = 0;
        this.lW = 0;
        this.elArr = [];
        this.total = 0;
    };
    return TreemapAlgorithmGroup;
}());
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Treemap_TreemapAlgorithmGroup = (TreemapAlgorithmGroup);

;// ./code/es5/es-modules/Series/Treemap/TreemapNode.js
/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Paweł Lysy
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Class
 *
 * */
var TreemapNode = /** @class */ (function () {
    function TreemapNode() {
        /* *
         *
         *  Properties
         *
         * */
        this.childrenTotal = 0;
        this.visible = false;
    }
    /* *
     *
     *  Functions
     *
     * */
    TreemapNode.prototype.init = function (id, i, children, height, level, series, parent) {
        this.id = id;
        this.i = i;
        this.children = children;
        this.height = height;
        this.level = level;
        this.series = series;
        this.parent = parent;
        return this;
    };
    return TreemapNode;
}());
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Treemap_TreemapNode = (TreemapNode);

;// ./code/es5/es-modules/Series/DrawPointUtilities.js
/* *
 *
 *
 * */

var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/* *
 *
 *  Functions
 *
 * */
/**
 * Handles the drawing of a component.
 * Can be used for any type of component that reserves the graphic property,
 * and provides a shouldDraw on its context.
 *
 * @private
 *
 * @todo add type checking.
 * @todo export this function to enable usage
 */
function draw(point, params) {
    var animatableAttribs = params.animatableAttribs,
        onComplete = params.onComplete,
        css = params.css,
        renderer = params.renderer;
    var animation = (point.series && point.series.chart.hasRendered) ?
            // Chart-level animation on updates
            void 0 :
            // Series-level animation on new points
            (point.series &&
                point.series.options.animation);
    var graphic = point.graphic;
    params.attribs = __assign(__assign({}, params.attribs), { 'class': point.getClassName() });
    if ((point.shouldDraw())) {
        if (!graphic) {
            if (params.shapeType === 'text') {
                graphic = renderer.text();
            }
            else if (params.shapeType === 'image') {
                graphic = renderer.image(params.imageUrl || '')
                    .attr(params.shapeArgs || {});
            }
            else {
                graphic = renderer[params.shapeType](params.shapeArgs || {});
            }
            point.graphic = graphic;
            graphic.add(params.group);
        }
        if (css) {
            graphic.css(css);
        }
        graphic
            .attr(params.attribs)
            .animate(animatableAttribs, params.isNew ? false : animation, onComplete);
    }
    else if (graphic) {
        var destroy_1 = function () {
                point.graphic = graphic = (graphic && graphic.destroy());
            if (typeof onComplete === 'function') {
                onComplete();
            }
        };
        // Animate only runs complete callback if something was animated.
        if (Object.keys(animatableAttribs).length) {
            graphic.animate(animatableAttribs, void 0, function () { return destroy_1(); });
        }
        else {
            destroy_1();
        }
    }
}
/* *
 *
 *  Default Export
 *
 * */
var DrawPointUtilities = {
    draw: draw
};
/* harmony default export */ var Series_DrawPointUtilities = (DrawPointUtilities);

;// ./code/es5/es-modules/Series/Treemap/TreemapPoint.js
/* *
 *
 *  (c) 2014-2026 Highsoft AS
 *
 *  Authors: Jon Arild Nygård / Øystein Moseng
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


var _a = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes, PiePoint = _a.pie.prototype.pointClass, ScatterPoint = _a.scatter.prototype.pointClass;

/* *
 *
 *  Class
 *
 * */
var TreemapPoint = /** @class */ (function (_super) {
    __extends(TreemapPoint, _super);
    function TreemapPoint() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this,
            arguments) || this;
        _this.groupedPointsAmount = 0;
        _this.shapeType = 'rect';
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    TreemapPoint.prototype.draw = function (params) {
        Series_DrawPointUtilities.draw(this, params);
    };
    TreemapPoint.prototype.getClassName = function () {
        var series = this.series,
            options = series.options;
        var className = _super.prototype.getClassName.call(this);
        // Above the current level
        if (this.node.level <= series.nodeMap[series.rootNode].level &&
            this.node.children.length) {
            className += ' highcharts-above-level';
        }
        else if (!this.node.isGroup &&
            !this.node.isLeaf &&
            !series.nodeMap[series.rootNode].isGroup &&
            !(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(options.interactByLeaf, !options.allowTraversingTree)) {
            className += ' highcharts-internal-node-interactive';
        }
        else if (!this.node.isGroup &&
            !this.node.isLeaf &&
            !series.nodeMap[series.rootNode].isGroup) {
            className += ' highcharts-internal-node';
        }
        return className;
    };
    /**
     * A tree point is valid if it has han id too, assume it may be a parent
     * item.
     *
     * @private
     * @function Highcharts.Point#isValid
     */
    TreemapPoint.prototype.isValid = function () {
        return Boolean(this.id || (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(this.value));
    };
    TreemapPoint.prototype.setState = function (state) {
        _super.prototype.setState.apply(this, arguments);
        // Graphic does not exist when point is not visible.
        if (this.graphic) {
            this.graphic.attr({
                zIndex: state === 'hover' ? 1 : 0
            });
        }
    };
    TreemapPoint.prototype.shouldDraw = function () {
        return (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(this.plotY) && this.y !== null;
    };
    return TreemapPoint;
}(ScatterPoint));
(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(TreemapPoint.prototype, {
    setVisible: PiePoint.prototype.setVisible
});
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Treemap_TreemapPoint = (TreemapPoint);

;// ./code/es5/es-modules/Series/Treemap/TreemapSeriesDefaults.js
/* *
 *
 *  (c) 2014-2026 Highsoft AS
 *
 *  Authors: Jon Arild Nygård / Øystein Moseng
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
 * A treemap displays hierarchical data using nested rectangles. The data
 * can be laid out in varying ways depending on options.
 *
 * @sample highcharts/demo/treemap-large-dataset/
 *         Treemap
 *
 * @extends      plotOptions.scatter
 * @excluding    connectEnds, connectNulls, dataSorting, dragDrop, jitter, marker
 * @product      highcharts
 * @requires     modules/treemap
 * @optionparent plotOptions.treemap
 */
var TreemapSeriesDefaults = {
    /**
     * When enabled the user can click on a point which is a parent and
     * zoom in on its children. Deprecated and replaced by
     * [allowTraversingTree](#plotOptions.treemap.allowTraversingTree).
     *
     * @sample {highcharts} highcharts/plotoptions/treemap-allowdrilltonode/
     *         Enabled
     *
     * @deprecated 7.0.3
     * @type      {boolean}
     * @default   false
     * @since     4.1.0
     * @product   highcharts
     * @apioption plotOptions.treemap.allowDrillToNode
     */
    /**
     * When enabled the user can click on a point which is a parent and
     * zoom in on its children.
     *
     * @sample {highcharts} highcharts/plotoptions/treemap-allowtraversingtree/
     *         Enabled
     * @sample {highcharts} highcharts/plotoptions/treemap-grouping-traversing/
     *         Traversing to Grouped Points node
     *
     * @since     7.0.3
     * @product   highcharts
     */
    allowTraversingTree: false,
    animationLimit: 250,
    /**
     * The border radius for each treemap item.
     */
    borderRadius: 0,
    /**
     * Options for the breadcrumbs, the navigation at the top leading the
     * way up through the traversed levels.
     *
     *
     * @since 10.0.0
     * @product   highcharts
     * @extends   navigation.breadcrumbs
     * @apioption plotOptions.treemap.breadcrumbs
     */
    /**
     * When the series contains less points than the crop threshold, all
     * points are drawn, even if the points fall outside the visible plot
     * area at the current zoom. The advantage of drawing all points
     * (including markers and columns), is that animation is performed on
     * updates. On the other hand, when the series contains more points than
     * the crop threshold, the series data is cropped to only contain points
     * that fall within the plot area. The advantage of cropping away
     * invisible points is to increase performance on large series.
     *
     * @type      {number}
     * @default   300
     * @since     4.1.0
     * @product   highcharts
     * @apioption plotOptions.treemap.cropThreshold
     */
    /**
     * Fires on a request for change of root node for the tree, before the
     * update is made. An event object is passed to the function, containing
     * additional properties `newRootId`, `previousRootId`, `redraw` and
     * `trigger`.
     *
     * @sample {highcharts} highcharts/plotoptions/treemap-events-setrootnode/
     *         Alert update information on setRootNode event.
     *
     * @type {Function}
     * @default undefined
     * @since 7.0.3
     * @product highcharts
     * @apioption plotOptions.treemap.events.setRootNode
     */
    /**
     * This option decides if the user can interact with the parent nodes
     * or just the leaf nodes. When this option is undefined, it will be
     * true by default. However when allowTraversingTree is true, then it
     * will be false by default.
     *
     * @sample {highcharts} highcharts/plotoptions/treemap-interactbyleaf-false/
     *         False
     * @sample {highcharts} highcharts/plotoptions/treemap-interactbyleaf-true-and-allowtraversingtree/
     *         InteractByLeaf and allowTraversingTree is true
     *
     * @type      {boolean}
     * @since     4.1.2
     * @product   highcharts
     * @apioption plotOptions.treemap.interactByLeaf
     */
    /**
     * The sort index of the point inside the treemap level.
     *
     * @sample {highcharts} highcharts/plotoptions/treemap-sortindex/
     *         Sort by years
     *
     * @type      {number}
     * @since     4.1.10
     * @product   highcharts
     * @apioption plotOptions.treemap.sortIndex
     */
    /**
     * A series specific or series type specific color set to apply instead
     * of the global [colors](#colors) when
     * [colorByPoint](#plotOptions.treemap.colorByPoint) is true.
     *
     * @type      {Array<Highcharts.ColorType>}
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.treemap.colors
     */
    /**
     * Whether to display this series type or specific series item in the
     * legend.
     */
    showInLegend: false,
    /**
     * @ignore-option
     */
    marker: void 0,
    /**
     * When using automatic point colors pulled from the `options.colors`
     * collection, this option determines whether the chart should receive
     * one color per series or one color per point.
     *
     * @see [series colors](#plotOptions.treemap.colors)
     *
     * @since     2.0
     * @product   highcharts
     * @apioption plotOptions.treemap.colorByPoint
     */
    colorByPoint: false,
    /**
     * @since 4.1.0
     */
    dataLabels: {
        enabled: true,
        formatter: function () {
            var point = this && this.point ?
                    this.point :
                    {},
                name = (0,
                highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isString)(point.name) ? point.name : '';
            return name;
        },
        /**
         * Whether the data label should act as a group-level header. For leaf
         * nodes, headers are not supported and the data label will be rendered
         * inside.
         *
         * @sample {highcharts} highcharts/series-treemap/headers
         *         Headers for parent nodes
         *
         * @since 12.2.0
         */
        headers: false,
        inside: true,
        padding: 2,
        verticalAlign: 'middle',
        style: {
            textOverflow: 'ellipsis'
        }
    },
    tooltip: {
        headerFormat: '',
        pointFormat: '<b>{point.name}</b>: {point.value}<br/>',
        clusterFormat: '+ {point.groupedPointsAmount} more...<br/>'
    },
    /**
     * Whether to ignore hidden points when the layout algorithm runs.
     * If `false`, hidden points will leave open spaces.
     *
     * @since 5.0.8
     */
    ignoreHiddenPoint: true,
    /**
     * This option decides which algorithm is used for setting position
     * and dimensions of the points.
     *
     * @see [How to write your own algorithm](https://www.highcharts.com/docs/chart-and-series-types/treemap)
     *
     * @sample {highcharts} highcharts/plotoptions/treemap-layoutalgorithm-sliceanddice/
     *         SliceAndDice by default
     * @sample {highcharts} highcharts/plotoptions/treemap-layoutalgorithm-stripes/
     *         Stripes
     * @sample {highcharts} highcharts/plotoptions/treemap-layoutalgorithm-squarified/
     *         Squarified
     * @sample {highcharts} highcharts/plotoptions/treemap-layoutalgorithm-strip/
     *         Strip
     *
     * @since      4.1.0
     * @validvalue ["sliceAndDice", "stripes", "squarified", "strip"]
     */
    layoutAlgorithm: 'sliceAndDice',
    /**
     * Defines which direction the layout algorithm will start drawing.
     *
     * @since       4.1.0
     * @validvalue ["vertical", "horizontal"]
     */
    layoutStartingDirection: 'vertical',
    /**
     * Enabling this option will make the treemap alternate the drawing
     * direction between vertical and horizontal. The next levels starting
     * direction will always be the opposite of the previous.
     *
     * @sample {highcharts} highcharts/plotoptions/treemap-alternatestartingdirection-true/
     *         Enabled
     *
     * @since 4.1.0
     */
    alternateStartingDirection: false,
    /**
     * Used together with the levels and allowTraversingTree options. When
     * set to false the first level visible to be level one, which is
     * dynamic when traversing the tree. Otherwise the level will be the
     * same as the tree structure.
     *
     * @since 4.1.0
     */
    levelIsConstant: true,
    /**
     * Options for the button appearing when traversing down in a treemap.
     *
     * Since v9.3.3 the `traverseUpButton` is replaced by `breadcrumbs`.
     *
     * @deprecated 9.3.3
     */
    traverseUpButton: {
        /**
         * The position of the button.
         */
        position: {
            /**
             * Vertical alignment of the button.
             *
             * @type      {Highcharts.VerticalAlignValue}
             * @default   top
             * @product   highcharts
             * @apioption plotOptions.treemap.traverseUpButton.position.verticalAlign
             */
            /**
             * Horizontal alignment of the button.
             *
             * @type {Highcharts.AlignValue}
             */
            align: 'right',
            /**
             * Horizontal offset of the button.
             */
            x: -10,
            /**
             * Vertical offset of the button.
             */
            y: 10
        }
    },
    /**
     * Group padding for parent elements in terms of pixels. See also the
     * `nodeSizeBy` option that controls how the leaf nodes' size is affected by
     * the padding.
     *
     * @sample    {highcharts} highcharts/series-treemap/grouppadding/
     *            Group padding
     * @type      {number}
     * @since 12.2.0
     * @product   highcharts
     * @apioption plotOptions.treemap.groupPadding
     */
    /**
     * Set options on specific levels. Takes precedence over series options,
     * but not point options.
     *
     * @sample {highcharts} highcharts/plotoptions/treemap-levels/
     *         Styling dataLabels and borders
     * @sample {highcharts} highcharts/demo/treemap-with-levels/
     *         Different layoutAlgorithm
     *
     * @type      {Array<*>}
     * @since     4.1.0
     * @product   highcharts
     * @apioption plotOptions.treemap.levels
     */
    /**
     * Experimental. How to set the size of child nodes when a header or padding
     * is present. When `leaf`, the group is expanded to make room for headers
     * and padding in order to preserve the relative sizes between leaves. When
     * `group`, the leaves are naïvely fit into the remaining area after the
     * header and padding are subtracted.
     *
     * @sample    {highcharts} highcharts/series-treemap/nodesizeby/
     *            Node sizing
     * @since 12.2.0
     * @type      {string}
     * @validvalue ["group", "leaf"]
     * @default   group
     * @apioption plotOptions.treemap.nodeSizeBy
     */
    /**
     * Can set a `borderColor` on all points which lies on the same level.
     *
     * @type      {Highcharts.ColorString}
     * @since     4.1.0
     * @product   highcharts
     * @apioption plotOptions.treemap.levels.borderColor
     */
    /**
     * Set the dash style of the border of all the point which lies on the
     * level. See
     * [plotOptions.scatter.dashStyle](#plotoptions.scatter.dashstyle)
     * for possible options.
     *
     * @type      {Highcharts.DashStyleValue}
     * @since     4.1.0
     * @product   highcharts
     * @apioption plotOptions.treemap.levels.borderDashStyle
     */
    /**
     * Can set the borderWidth on all points which lies on the same level.
     *
     * @type      {number}
     * @since     4.1.0
     * @product   highcharts
     * @apioption plotOptions.treemap.levels.borderWidth
     */
    /**
     * Can set a color on all points which lies on the same level.
     *
     * @type      {Highcharts.ColorType}
     * @since     4.1.0
     * @product   highcharts
     * @apioption plotOptions.treemap.levels.color
     */
    /**
     * A configuration object to define how the color of a child varies from
     * the parent's color. The variation is distributed among the children
     * of node. For example when setting brightness, the brightness change
     * will range from the parent's original brightness on the first child,
     * to the amount set in the `to` setting on the last node. This allows a
     * gradient-like color scheme that sets children out from each other
     * while highlighting the grouping on treemaps and sectors on sunburst
     * charts.
     *
     * @sample highcharts/demo/sunburst/
     *         Sunburst with color variation
     *
     * @sample highcharts/series-treegraph/color-variation
     *         Treegraph nodes with color variation
     *
     * @since     6.0.0
     * @product   highcharts
     * @apioption plotOptions.treemap.levels.colorVariation
     */
    /**
     * The key of a color variation. Currently supports `brightness` only.
     *
     * @type       {string}
     * @since      6.0.0
     * @product    highcharts
     * @validvalue ["brightness"]
     * @apioption  plotOptions.treemap.levels.colorVariation.key
     */
    /**
     * The ending value of a color variation. The last sibling will receive
     * this value.
     *
     * @type      {number}
     * @since     6.0.0
     * @product   highcharts
     * @apioption plotOptions.treemap.levels.colorVariation.to
     */
    /**
     * Can set the options of dataLabels on each point which lies on the
     * level.
     * [plotOptions.treemap.dataLabels](#plotOptions.treemap.dataLabels) for
     * possible values.
     *
     * @extends   plotOptions.treemap.dataLabels
     * @since     4.1.0
     * @product   highcharts
     * @apioption plotOptions.treemap.levels.dataLabels
     */
    /**
     * Can set the layoutAlgorithm option on a specific level.
     *
     * @type       {string}
     * @since      4.1.0
     * @product    highcharts
     * @validvalue ["sliceAndDice", "stripes", "squarified", "strip"]
     * @apioption  plotOptions.treemap.levels.layoutAlgorithm
     */
    /**
     * Can set the layoutStartingDirection option on a specific level.
     *
     * @type       {string}
     * @since      4.1.0
     * @product    highcharts
     * @validvalue ["vertical", "horizontal"]
     * @apioption  plotOptions.treemap.levels.layoutStartingDirection
     */
    /**
     * Decides which level takes effect from the options set in the levels
     * object.
     *
     * @sample {highcharts} highcharts/plotoptions/treemap-levels/
     *         Styling of both levels
     *
     * @type      {number}
     * @since     4.1.0
     * @product   highcharts
     * @apioption plotOptions.treemap.levels.level
     */
    // Presentational options
    /**
     * The color of the border surrounding each tree map item.
     *
     * @type {Highcharts.ColorString}
     */
    borderColor: 'var(--highcharts-neutral-color-10)',
    /**
     * The width of the border surrounding each tree map item.
     */
    borderWidth: 1,
    colorKey: 'colorValue',
    /**
     * The opacity of grouped points in treemap. When a point has children, the
     * group point is covering the children, and is given this opacity. The
     * visibility of the children is determined by the opacity.
     *
     * @since 4.2.4
     */
    opacity: 0.15,
    /**
     * A wrapper object for all the series options in specific states.
     *
     * @extends plotOptions.heatmap.states
     */
    states: {
        /**
         * Options for the hovered series
         *
         * @extends   plotOptions.heatmap.states.hover
         * @excluding halo
         */
        hover: {
            /**
             * The border color for the hovered state.
             */
            borderColor: 'var(--highcharts-neutral-color-40)',
            /**
             * Brightness for the hovered point. Defaults to 0 if the
             * heatmap series is loaded first, otherwise 0.1.
             *
             * @type    {number}
             * @default undefined
             */
            brightness: (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes.heatmap ? 0 : 0.1,
            /**
             * @extends plotOptions.heatmap.states.hover.halo
             */
            halo: false,
            /**
             * The opacity of a point in treemap. When a point has children,
             * the visibility of the children is determined by the opacity.
             *
             * @since 4.2.4
             */
            opacity: 0.75,
            /**
             * The shadow option for hovered state.
             */
            shadow: false
        }
    },
    legendSymbol: 'rectangle',
    /**
     * This option enables automatic traversing to the last child level upon
     * node interaction. This feature simplifies navigation by immediately
     * focusing on the deepest layer of the data structure without intermediate
     * steps.
     *
     * @sample {highcharts} highcharts/plotoptions/treemap-traverse-to-leaf/
     *         Traverse to leaf enabled
     *
     * @since   11.4.4
     *
     * @product highcharts
     */
    traverseToLeaf: false,
    /**
     * An option to optimize treemap series rendering by grouping smaller leaf
     * nodes below a certain square area threshold in pixels. If the square area
     * of a point becomes smaller than the specified threshold, determined by
     * the `pixelWidth` and/or `pixelHeight` options, then this point is moved
     * into one group point per series.
     *
     * @sample {highcharts} highcharts/plotoptions/treemap-grouping-simple
     *         Simple demo of Treemap grouping
     * @sample {highcharts} highcharts/plotoptions/treemap-grouping-multiple-parents
     *         Treemap grouping with multiple parents
     * @sample {highcharts} highcharts/plotoptions/treemap-grouping-advanced
     *         Advanced demo of Treemap grouping
     *
     * @since 12.1.0
     *
     * @excluding allowOverlap, animation, dataLabels, drillToCluster, events,
     * layoutAlgorithm, marker, states, zones
     *
     * @product highcharts
     */
    cluster: {
        /**
         * An additional, individual class name for the grouped point's graphic
         * representation.
         *
         * @type      string
         * @product   highcharts
         */
        className: void 0,
        /**
         * Individual color for the grouped point. By default the color is
         * pulled from the parent color.
         *
         * @type      {Highcharts.ColorType}
         * @product   highcharts
         */
        color: void 0,
        /**
         * Enable or disable Treemap grouping.
         *
         * @type {boolean}
         * @since 12.1.0
         * @product highcharts
         */
        enabled: false,
        /**
         * The pixel threshold width of area, which is used in Treemap grouping.
         *
         * @type {number}
         * @since 12.1.0
         * @product highcharts
         */
        pixelWidth: void 0,
        /**
         * The pixel threshold height of area, which is used in Treemap
         * grouping.
         *
         * @type {number}
         * @since 12.1.0
         * @product highcharts
         */
        pixelHeight: void 0,
        /**
         * The name of the point of grouped nodes shown in the tooltip,
         * dataLabels, etc. By default it is set to '+ n', where n is number of
         * grouped points.
         *
         * @type {string}
         * @since 12.1.0
         * @product highcharts
         */
        name: void 0,
        /**
         * A configuration property that specifies the factor by which the value
         * and size of a grouped node are reduced. This can be particularly
         * useful when a grouped node occupies a disproportionately large
         * portion of the graph, ensuring better visual balance and readability.
         *
         * @type {number}
         * @since 12.1.0
         * @product highcharts
         */
        reductionFactor: void 0,
        /**
         * Defines the minimum number of child nodes required to create a group
         * of small nodes.
         *
         * @type {number}
         * @since 12.1.0
         * @product highcharts
         */
        minimumClusterSize: 5,
        layoutAlgorithm: {
            distance: 0,
            gridSize: 0,
            kmeansThreshold: 0
        },
        marker: {
            lineWidth: 0,
            radius: 0
        }
    }
};
/**
 * A `treemap` series. If the [type](#series.treemap.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.treemap
 * @excluding dataParser, dataURL, stack, dataSorting
 * @product   highcharts
 * @requires  modules/treemap
 * @apioption series.treemap
 */
/**
 * An array of data points for the series. For the `treemap` series
 * type, points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `value` options. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.treemap.turboThreshold),
 *    this option is not available.
 *    ```js
 *      data: [{
 *        value: 9,
 *        name: "Point2",
 *        color: "#00FF00"
 *      }, {
 *        value: 6,
 *        name: "Point1",
 *        color: "#FF00FF"
 *      }]
 *    ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @basic
 * @type      {Array<number|null|*>}
 * @extends   series.heatmap.data
 * @excluding x, y, pointPadding
 * @product   highcharts
 * @apioption series.treemap.data
 */
/**
 * The value of the point, resulting in a relative area of the point
 * in the treemap.
 *
 * @type      {number|null}
 * @product   highcharts
 * @apioption series.treemap.data.value
 */
/**
 * Serves a purpose only if a `colorAxis` object is defined in the chart
 * options. This value will decide which color the point gets from the
 * scale of the colorAxis.
 *
 * @type      {number}
 * @since     4.1.0
 * @product   highcharts
 * @apioption series.treemap.data.colorValue
 */
/**
 * Only for treemap. Use this option to build a tree structure. The
 * value should be the id of the point which is the parent. If no points
 * has a matching id, or this option is undefined, then the parent will
 * be set to the root.
 *
 * @sample {highcharts} highcharts/point/parent/
 *         Point parent
 * @sample {highcharts} highcharts/demo/treemap-with-levels/
 *         Example where parent id is not matching
 *
 * @type      {string}
 * @since     4.1.0
 * @product   highcharts
 * @apioption series.treemap.data.parent
 */
''; // Keeps doclets above detached
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Treemap_TreemapSeriesDefaults = (TreemapSeriesDefaults);

;// ./code/es5/es-modules/Series/Treemap/TreemapUtilities.js
/* *
 *
 *  (c) 2014-2026 Highsoft AS
 *
 *  Authors: Jon Arild Nygård / Øystein Moseng
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Namespace
 *
 * */
var TreemapUtilities;
(function (TreemapUtilities) {
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
     * @todo find correct name for this function.
     * @todo Similar to reduce, this function is likely redundant
     */
    function recursive(item, func, context) {
        var next = func.call(context || this,
            item);
        if (next !== false) {
            recursive(next, func, context);
        }
    }
    TreemapUtilities.recursive = recursive;
})(TreemapUtilities || (TreemapUtilities = {}));
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Treemap_TreemapUtilities = (TreemapUtilities);

;// ./code/es5/es-modules/Series/TreeUtilities.js
/* *
 *
 *  (c) 2014-2026 Highsoft AS
 *
 *  Authors: Jon Arild Nygård / Øystein Moseng
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */



/* *
 *
 *  Functions
 *
 * */
/**
 * @private
 */
function getColor(node, options) {
    var index = options.index,
        mapOptionsToLevel = options.mapOptionsToLevel,
        parentColor = options.parentColor,
        parentColorIndex = options.parentColorIndex,
        series = options.series,
        colors = options.colors,
        siblings = options.siblings,
        points = series.points,
        chartOptionsChart = series.chart.options.chart;
    var getColorByPoint,
        point,
        level,
        colorByPoint,
        colorIndexByPoint,
        color,
        colorIndex;
    /**
     * @private
     */
    var variateColor = function (color) {
            var colorVariation = level && level.colorVariation;
        if (colorVariation &&
            colorVariation.key === 'brightness' &&
            index &&
            siblings) {
            return highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_default().parse(color).brighten(colorVariation.to * (index / siblings)).get();
        }
        return color;
    };
    if (node) {
        point = points[node.i];
        level = mapOptionsToLevel[node.level] || {};
        getColorByPoint = point && level.colorByPoint;
        if (getColorByPoint) {
            colorIndexByPoint = point.index % (colors ?
                colors.length :
                chartOptionsChart.colorCount);
            colorByPoint = colors && colors[colorIndexByPoint];
        }
        // Select either point color, level color or inherited color.
        if (!series.chart.styledMode) {
            color = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(point && point.options.color, level && level.color, colorByPoint, parentColor && variateColor(parentColor), series.color);
        }
        colorIndex = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(point && point.options.colorIndex, level && level.colorIndex, colorIndexByPoint, parentColorIndex, options.colorIndex);
    }
    return {
        color: color,
        colorIndex: colorIndex
    };
}
/**
 * Creates a map from level number to its given options.
 *
 * @private
 *
 * @param {Object} params
 * Object containing parameters.
 * - `defaults` Object containing default options. The default options are
 *   merged with the userOptions to get the final options for a specific
 *   level.
 * - `from` The lowest level number.
 * - `levels` User options from series.levels.
 * - `to` The highest level number.
 *
 * @return {Highcharts.Dictionary<object>|null}
 * Returns a map from level number to its given options.
 */
function getLevelOptions(params) {
    var result = {};
    var defaults,
        converted,
        i,
        from,
        to,
        levels;
    if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(params)) {
        from = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(params.from) ? params.from : 1;
        levels = params.levels;
        converted = {};
        defaults = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(params.defaults) ? params.defaults : {};
        if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isArray)(levels)) {
            converted = levels.reduce(function (obj, item) {
                var level,
                    levelIsConstant,
                    options;
                if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(item) && (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(item.level)) {
                    options = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)({}, item);
                    levelIsConstant = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(options.levelIsConstant, defaults.levelIsConstant);
                    // Delete redundant properties.
                    delete options.levelIsConstant;
                    delete options.level;
                    // Calculate which level these options apply to.
                    level = item.level + (levelIsConstant ? 0 : from - 1);
                    if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(obj[level])) {
                        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(true, obj[level], options); // #16329
                    }
                    else {
                        obj[level] = options;
                    }
                }
                return obj;
            }, {});
        }
        to = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(params.to) ? params.to : 1;
        for (i = 0; i <= to; i++) {
            result[i] = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)({}, defaults, (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(converted[i]) ? converted[i] : {});
        }
    }
    return result;
}
/**
 * @private
 * @todo Combine buildTree and buildNode with setTreeValues
 * @todo Remove logic from Treemap and make it utilize this mixin.
 */
function setTreeValues(tree, options) {
    var before = options.before,
        idRoot = options.idRoot,
        mapIdToNode = options.mapIdToNode,
        nodeRoot = mapIdToNode[idRoot],
        levelIsConstant = (options.levelIsConstant !== false),
        points = options.points,
        point = points[tree.i],
        optionsPoint = point && point.options || {},
        children = [];
    var childrenTotal = 0;
    tree.levelDynamic = tree.level - (levelIsConstant ? 0 : nodeRoot.level);
    tree.name = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(point && point.name, '');
    tree.visible = (idRoot === tree.id ||
        options.visible === true);
    if (typeof before === 'function') {
        tree = before(tree, options);
    }
    // First give the children some values
    tree.children.forEach(function (child, i) {
        var newOptions = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)({},
            options);
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(newOptions, {
            index: i,
            siblings: tree.children.length,
            visible: tree.visible
        });
        child = setTreeValues(child, newOptions);
        children.push(child);
        if (child.visible) {
            childrenTotal += child.val;
        }
    });
    // Set the values
    var value = (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(optionsPoint.value,
        childrenTotal);
    tree.visible = value >= 0 && (childrenTotal > 0 || tree.visible);
    tree.children = children;
    tree.childrenTotal = childrenTotal;
    tree.isLeaf = tree.visible && !childrenTotal;
    tree.val = value;
    return tree;
}
/**
 * Update the rootId property on the series. Also makes sure that it is
 * accessible to exporting.
 *
 * @private
 *
 * @param {Object} series
 * The series to operate on.
 *
 * @return {string}
 * Returns the resulting rootId after update.
 */
function updateRootId(series) {
    var rootId,
        options;
    if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(series)) {
        // Get the series options.
        options = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(series.options) ? series.options : {};
        // Calculate the rootId.
        rootId = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(series.rootNode, options.rootId, '');
        // Set rootId on series.userOptions to pick it up in exporting.
        if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(series.userOptions)) {
            series.userOptions.rootId = rootId;
        }
        // Set rootId on series to pick it up on next update.
        series.rootNode = rootId;
    }
    return rootId;
}
/**
 * Get the node width, which relies on the plot width and the nodeDistance
 * option.
 *
 * @private
 */
function getNodeWidth(series, columnCount) {
    var chart = series.chart,
        options = series.options,
        _a = options.nodeDistance,
        nodeDistance = _a === void 0 ? 0 : _a,
        _b = options.nodeWidth,
        nodeWidth = _b === void 0 ? 0 : _b,
        _c = chart.plotSizeX,
        plotSizeX = _c === void 0 ? 1 : _c;
    // Node width auto means they are evenly distributed along the width of
    // the plot area
    if (nodeWidth === 'auto') {
        if (typeof nodeDistance === 'string' && /%$/.test(nodeDistance)) {
            var fraction = parseFloat(nodeDistance) / 100,
                total = columnCount + fraction * (columnCount - 1);
            return plotSizeX / total;
        }
        var nDistance = Number(nodeDistance);
        return ((plotSizeX + nDistance) /
            (columnCount || 1)) - nDistance;
    }
    return (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.relativeLength)(nodeWidth, plotSizeX);
}
/* *
 *
 *  Default Export
 *
 * */
var TreeUtilities = {
    getColor: getColor,
    getLevelOptions: getLevelOptions,
    getNodeWidth: getNodeWidth,
    setTreeValues: setTreeValues,
    updateRootId: updateRootId
};
/* harmony default export */ var Series_TreeUtilities = (TreeUtilities);

;// ./code/es5/es-modules/Series/Treemap/TreemapSeries.js
/* *
 *
 *  (c) 2014-2026 Highsoft AS
 *
 *  Authors: Jon Arild Nygård / Øystein Moseng
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

var TreemapSeries_extends = (undefined && undefined.__extends) || (function () {
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


var color = (highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_default()).parse;


var TreemapSeries_composed = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).composed, noop = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).noop;


var TreemapSeries_a = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes, ColumnSeries = TreemapSeries_a.column, ScatterSeries = TreemapSeries_a.scatter;






var TreemapSeries_getColor = Series_TreeUtilities.getColor, TreemapSeries_getLevelOptions = Series_TreeUtilities.getLevelOptions, TreemapSeries_updateRootId = Series_TreeUtilities.updateRootId;


highcharts_Series_commonjs_highcharts_Series_commonjs2_highcharts_Series_root_Highcharts_Series_default().keepProps.push('simulation', 'hadOutsideDataLabels');
/* *
 *
 *  Constants
 *
 * */
var axisMax = 100;
/* *
 *
 *  Variables
 *
 * */
var treemapAxisDefaultValues = false;
/* *
 *
 *  Functions
 *
 * */
/** @private */
function onSeriesAfterBindAxes() {
    var series = this,
        xAxis = series.xAxis,
        yAxis = series.yAxis;
    if (xAxis && yAxis) {
        if (series.is('treemap')) {
            // Treemap and treegraph axes are used for the layout, but are
            // hidden by default.
            var treeAxisDefaults = {
                    endOnTick: false,
                    startOnTick: false,
                    visible: false
                };
            // Treemap layout depends on specific scaling of both axes
            if (!series.is('treegraph')) {
                treeAxisDefaults.min = 0;
                treeAxisDefaults.max = axisMax;
                treeAxisDefaults.tickPositions = [];
            }
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(true, xAxis.options, treeAxisDefaults, xAxis.userOptions);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(true, yAxis.options, treeAxisDefaults, yAxis.userOptions);
            // Set the properties on the axis object
            xAxis.visible = xAxis.options.visible;
            yAxis.visible = yAxis.options.visible;
            // Set `isCartesian` conditionally. Because non-cartesian zoom won't
            // work if it is true, and the axis will not show if it is false.
            if (series.is('treegraph')) {
                this.isCartesian = xAxis.visible;
            }
            treemapAxisDefaultValues = true;
        }
        else if (treemapAxisDefaultValues) {
            yAxis.setOptions(yAxis.userOptions);
            xAxis.setOptions(xAxis.userOptions);
            treemapAxisDefaultValues = false;
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
 * @name Highcharts.seriesTypes.treemap
 *
 * @augments Highcharts.Series
 */
var TreemapSeries = /** @class */ (function (_super) {
    TreemapSeries_extends(TreemapSeries, _super);
    function TreemapSeries() {
        /* *
         *
         *  Static Properties
         *
         * */
        var _this = _super !== null && _super.apply(this,
            arguments) || this;
        _this.simulation = 0;
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    TreemapSeries.compose = function (SeriesClass) {
        if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pushUnique)(TreemapSeries_composed, 'TreemapSeries')) {
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(SeriesClass, 'afterBindAxes', onSeriesAfterBindAxes);
        }
    };
    /* *
     *
     *  Function
     *
     * */
    TreemapSeries.prototype.algorithmCalcPoints = function (directionChange, last, group, childrenArea) {
        var plot = group.plot,
            end = group.elArr.length - 1;
        var pX,
            pY,
            pW,
            pH,
            gW = group.lW,
            gH = group.lH,
            keep,
            i = 0;
        if (last) {
            gW = group.nW;
            gH = group.nH;
        }
        else {
            keep = group.elArr[end];
        }
        for (var _i = 0, _a = group.elArr; _i < _a.length; _i++) {
            var p = _a[_i];
            if (last || (i < end)) {
                if (group.direction === 0) {
                    pX = plot.x;
                    pY = plot.y;
                    pW = gW;
                    pH = p / pW;
                }
                else {
                    pX = plot.x;
                    pY = plot.y;
                    pH = gH;
                    pW = p / pH;
                }
                childrenArea.push({
                    x: pX,
                    y: pY,
                    width: pW,
                    height: (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.correctFloat)(pH)
                });
                if (group.direction === 0) {
                    plot.y = plot.y + pH;
                }
                else {
                    plot.x = plot.x + pW;
                }
            }
            i = i + 1;
        }
        // Reset variables
        group.reset();
        if (group.direction === 0) {
            group.width = group.width - gW;
        }
        else {
            group.height = group.height - gH;
        }
        plot.y = plot.parent.y + (plot.parent.height - group.height);
        plot.x = plot.parent.x + (plot.parent.width - group.width);
        if (directionChange) {
            group.direction = 1 - group.direction;
        }
        // If not last, then add uncalculated element
        if (!last) {
            group.addElement(keep);
        }
    };
    TreemapSeries.prototype.algorithmFill = function (directionChange, parent, children) {
        var childrenArea = [];
        var pTot,
            direction = parent.direction,
            x = parent.x,
            y = parent.y,
            width = parent.width,
            height = parent.height,
            pX,
            pY,
            pW,
            pH;
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            pTot =
                (parent.width * parent.height) * (child.val / parent.val);
            pX = x;
            pY = y;
            if (direction === 0) {
                pH = height;
                pW = pTot / pH;
                width = width - pW;
                x = x + pW;
            }
            else {
                pW = width;
                pH = pTot / pW;
                height = height - pH;
                y = y + pH;
            }
            childrenArea.push({
                x: pX,
                y: pY,
                width: pW,
                height: pH,
                direction: 0,
                val: 0
            });
            if (directionChange) {
                direction = 1 - direction;
            }
        }
        return childrenArea;
    };
    TreemapSeries.prototype.algorithmLowAspectRatio = function (directionChange, parent, children) {
        var series = this,
            childrenArea = [],
            plot = {
                x: parent.x,
                y: parent.y,
                parent: parent
            },
            direction = parent.direction,
            end = children.length - 1,
            group = new Treemap_TreemapAlgorithmGroup(parent.height,
            parent.width,
            direction,
            plot);
        var pTot,
            i = 0;
        // Loop through and calculate all areas
        for (var _i = 0, children_2 = children; _i < children_2.length; _i++) {
            var child = children_2[_i];
            pTot =
                (parent.width * parent.height) * (child.val / parent.val);
            group.addElement(pTot);
            if (group.lP.nR > group.lP.lR) {
                series.algorithmCalcPoints(directionChange, false, group, childrenArea, plot // @todo no supported
                );
            }
            // If last child, then calculate all remaining areas
            if (i === end) {
                series.algorithmCalcPoints(directionChange, true, group, childrenArea, plot // @todo not supported
                );
            }
            ++i;
        }
        return childrenArea;
    };
    /**
     * Over the alignment method by setting z index.
     * @private
     */
    TreemapSeries.prototype.alignDataLabel = function (point, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dataLabel, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    labelOptions) {
        ColumnSeries.prototype.alignDataLabel.apply(this, arguments);
        if (point.dataLabel) {
            // `point.node.zIndex` could be undefined (#6956)
            point.dataLabel.attr({ zIndex: (point.node.zIndex || 0) + 1 });
        }
    };
    TreemapSeries.prototype.applyTreeGrouping = function () {
        var series = this,
            parentList = series.parentList || {},
            cluster = series.options.cluster,
            minimumClusterSize = (cluster === null || cluster === void 0 ? void 0 : cluster.minimumClusterSize) || 5;
        if (cluster === null || cluster === void 0 ? void 0 : cluster.enabled) {
            var parentGroups_1 = {};
            var checkIfHide_1 = function (node) {
                    var _a;
                if ((_a = node === null || node === void 0 ? void 0 : node.point) === null || _a === void 0 ? void 0 : _a.shapeArgs) {
                    var _b = node.point.shapeArgs,
                        _c = _b.width,
                        width = _c === void 0 ? 0 : _c,
                        _d = _b.height,
                        height = _d === void 0 ? 0 : _d,
                        area = width * height;
                    var _e = cluster.pixelWidth,
                        pixelWidth = _e === void 0 ? 0 : _e,
                        _f = cluster.pixelHeight,
                        pixelHeight = _f === void 0 ? 0 : _f,
                        compareHeight = (0,
                        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(pixelHeight),
                        thresholdArea = pixelHeight ?
                            pixelWidth * pixelHeight :
                            pixelWidth * pixelWidth;
                    if (width < pixelWidth ||
                        height < (compareHeight ? pixelHeight : pixelWidth) ||
                        area < thresholdArea) {
                        if (!node.isGroup && (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(node.parent)) {
                            if (!parentGroups_1[node.parent]) {
                                parentGroups_1[node.parent] = [];
                            }
                            parentGroups_1[node.parent].push(node);
                        }
                    }
                }
                node === null || node === void 0 ? void 0 : node.children.forEach(function (child) {
                    checkIfHide_1(child);
                });
            };
            checkIfHide_1(series.tree);
            var _loop_1 = function (parent_1) {
                    if (parentGroups_1[parent_1]) {
                        if (parentGroups_1[parent_1].length > minimumClusterSize) {
                            parentGroups_1[parent_1].forEach(function (node) {
                                var index = parentList[parent_1].indexOf(node.i);
                            if (index !== -1) {
                                parentList[parent_1].splice(index, 1);
                                var id_1 = "highcharts-grouped-treemap-points-".concat(node.parent || 'root');
                                var groupPoint = series.points
                                        .find(function (p) { return p.id === id_1; });
                                if (!groupPoint) {
                                    var PointClass = series.pointClass,
                                        pointIndex = series.points.length;
                                    groupPoint = new PointClass(series, {
                                        className: cluster.className,
                                        color: cluster.color,
                                        id: id_1,
                                        index: pointIndex,
                                        isGroup: true,
                                        value: 0
                                    });
                                    (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(groupPoint, {
                                        formatPrefix: 'cluster'
                                    });
                                    series.points.push(groupPoint);
                                    parentList[parent_1].push(pointIndex);
                                    parentList[id_1] = [];
                                }
                                var amount = groupPoint.groupedPointsAmount + 1,
                                    val = series.points[groupPoint.index]
                                        .options.value || 0,
                                    name_1 = cluster.name ||
                                        "+ ".concat(amount);
                                // Update the point directly in points array to
                                // prevent wrong instance update
                                series.points[groupPoint.index]
                                    .groupedPointsAmount = amount;
                                series.points[groupPoint.index].options.value =
                                    val + (node.point.value || 0);
                                series.points[groupPoint.index].name = name_1;
                                parentList[id_1].push(node.point.index);
                            }
                        });
                    }
                }
            };
            for (var parent_1 in parentGroups_1) {
                _loop_1(parent_1);
            }
            series.nodeMap = {};
            series.nodeList = [];
            series.parentList = parentList;
            var tree = series.buildTree('', -1, 0,
                series.parentList);
            series.translate(tree);
        }
    };
    /**
     * Recursive function which calculates the area for all children of a
     * node.
     *
     * @private
     * @function Highcharts.Series#calculateChildrenAreas
     *
     * @param {Object} parent
     * The node which is parent to the children.
     *
     * @param {Object} area
     * The rectangular area of the parent.
     */
    TreemapSeries.prototype.calculateChildrenAreas = function (parent, area) {
        var _a,
            _b,
            _c,
            _d,
            _e,
            _f;
        var series = this,
            options = series.options,
            mapOptionsToLevel = series.mapOptionsToLevel,
            level = mapOptionsToLevel[parent.level + 1],
            algorithm = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(((level === null || level === void 0 ? void 0 : level.layoutAlgorithm) &&
                series[level === null || level === void 0 ? void 0 : level.layoutAlgorithm] &&
                level.layoutAlgorithm),
            options.layoutAlgorithm),
            alternate = options.alternateStartingDirection, 
            // Collect all children which should be included
            children = parent.children.filter(function (n) {
                return parent.isGroup || !n.ignore;
        }), groupPadding = (_b = (_a = level === null || level === void 0 ? void 0 : level.groupPadding) !== null && _a !== void 0 ? _a : options.groupPadding) !== null && _b !== void 0 ? _b : 0, rootNode = series.nodeMap[series.rootNode];
        if (!algorithm) {
            return;
        }
        var childrenValues = [],
            axisWidth = ((_c = rootNode.pointValues) === null || _c === void 0 ? void 0 : _c.width) || 0,
            axisHeight = ((_d = rootNode.pointValues) === null || _d === void 0 ? void 0 : _d.height) || 0;
        if (level === null || level === void 0 ? void 0 : level.layoutStartingDirection) {
            area.direction = level.layoutStartingDirection === 'vertical' ?
                0 :
                1;
        }
        childrenValues = series[algorithm](area, children);
        var i = -1;
        for (var _i = 0, children_3 = children; _i < children_3.length; _i++) {
            var child = children_3[_i];
            var values = childrenValues[++i];
            if (child === rootNode) {
                axisWidth = axisWidth || values.width;
                axisHeight = values.height;
            }
            var groupPaddingXValues = groupPadding / (series.xAxis.len / axisHeight), groupPaddingYValues = groupPadding / (series.yAxis.len / axisHeight);
            child.values = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(values, {
                val: child.childrenTotal,
                direction: (alternate ? 1 - area.direction : area.direction)
            });
            // Make room for outside data labels
            if (child.children.length &&
                ((_e = child.point.dataLabels) === null || _e === void 0 ? void 0 : _e.length)) {
                var dlHeight = (0,
                    highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.arrayMax)(child.point.dataLabels.map(function (dl) {
                        var _a;
                    return ((_a = dl.options) === null || _a === void 0 ? void 0 : _a.headers) && dl.height || 0;
                })) / (series.yAxis.len / axisHeight);
                // Make room for data label unless the group is too small
                if (dlHeight < child.values.height / 2) {
                    child.values.y += dlHeight;
                    child.values.height -= dlHeight;
                }
            }
            if (groupPadding) {
                var xPad = Math.min(groupPaddingXValues, child.values.width / 4), yPad = Math.min(groupPaddingYValues, child.values.height / 4);
                child.values.x += xPad;
                child.values.width -= 2 * xPad;
                child.values.y += yPad;
                child.values.height -= 2 * yPad;
            }
            child.pointValues = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(values, {
                x: (values.x / series.axisRatio),
                // Flip y-values to avoid visual regression with csvCoord in
                // Axis.translate at setPointValues. #12488
                y: axisMax - values.y - values.height,
                width: (values.width / series.axisRatio)
            });
            // If node has children, then call method recursively
            if (child.children.length) {
                series.calculateChildrenAreas(child, child.values);
            }
        }
        var getChildrenRecursive = function (node,
            result,
            getLeaves) {
                if (result === void 0) { result = []; }
                if (getLeaves === void 0) { getLeaves = true; }
                node.children.forEach(function (child) {
                    if (getLeaves && child.isLeaf) {
                        result.push(child.point);
                }
                else if (!getLeaves && !child.isLeaf) {
                    result.push(child.point);
                }
                if (child.children.length) {
                    getChildrenRecursive(child, result, getLeaves);
                }
            });
            return result;
        };
        // Experimental block to make space for the outside data labels
        if (options.nodeSizeBy === 'leaf' &&
            parent === rootNode &&
            this.hasOutsideDataLabels &&
            // Sizing by leaf value is not possible if any of the groups have
            // explicit values
            !getChildrenRecursive(rootNode, void 0, false)
                .some(function (point) { return (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(point.options.value); }) &&
            !(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)((_f = rootNode.point) === null || _f === void 0 ? void 0 : _f.options.value)) {
            var leaves = getChildrenRecursive(rootNode),
                values_1 = leaves.map(function (point) {
                    return point.options.value || 0;
            }), 
            // Areas in terms of axis units squared
            areas_1 = leaves.map(function (_a) {
                var pointValues = _a.node.pointValues;
                return (pointValues ?
                    pointValues.width * pointValues.height :
                    0);
            }), valueSum = values_1.reduce(function (sum, value) { return sum + value; }, 0), areaSum = areas_1.reduce(function (sum, value) { return sum + value; }, 0), expectedAreaPerValue_1 = areaSum / valueSum;
            var minMiss_1 = 0,
                maxMiss_1 = 0;
            leaves.forEach(function (point, i) {
                var areaPerValue = values_1[i] ? (areas_1[i] / values_1[i]) : 1, 
                    // Less than 1 => rendered too small, greater than 1 =>
                    // rendered too big
                    fit = (0,
                    highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.clamp)(areaPerValue / expectedAreaPerValue_1, 0.8, 1.4);
                var miss = 1 - fit;
                if (point.value) {
                    // Very small areas are more sensitive, and matter less to
                    // the visual impression. Give them less weight.
                    if (areas_1[i] < 20) {
                        miss *= areas_1[i] / 20;
                    }
                    if (miss > maxMiss_1) {
                        maxMiss_1 = miss;
                    }
                    if (miss < minMiss_1) {
                        minMiss_1 = miss;
                    }
                    point.simulatedValue = (point.simulatedValue || point.value) / fit;
                }
            });
            /* /
            console.log('--- simulation',
                this.simulation,
                'worstMiss',
                minMiss,
                maxMiss
            );
            // */
            if (
            // An area error less than 5% is acceptable, the human ability
            // to assess area size is not that accurate
            (minMiss_1 < -0.05 || maxMiss_1 > 0.05) &&
                // In case an eternal loop is brewing, pull the emergency brake
                this.simulation < 10) {
                this.simulation++;
                this.setTreeValues(parent);
                area.val = parent.val;
                this.calculateChildrenAreas(parent, area);
                // Simulation is settled, proceed to rendering. Reset the simulated
                // values and set the tree values with real data.
            }
            else {
                leaves.forEach(function (point) {
                    delete point.simulatedValue;
                });
                this.setTreeValues(parent);
                this.simulation = 0;
            }
        }
    };
    /**
     * Create level list.
     * @private
     */
    TreemapSeries.prototype.createList = function (e) {
        var chart = this.chart,
            breadcrumbs = chart.breadcrumbs,
            list = [];
        if (breadcrumbs) {
            var currentLevelNumber = 0;
            list.push({
                level: currentLevelNumber,
                levelOptions: chart.series[0]
            });
            var node = e.target.nodeMap[e.newRootId];
            var extraNodes = [];
            // When the root node is set and has parent,
            // recreate the path from the node tree.
            while (node.parent || node.parent === '') {
                extraNodes.push(node);
                node = e.target.nodeMap[node.parent];
            }
            for (var _i = 0, _a = extraNodes.reverse(); _i < _a.length; _i++) {
                var node_1 = _a[_i];
                list.push({
                    level: ++currentLevelNumber,
                    levelOptions: node_1
                });
            }
            // If the list has only first element, we should clear it
            if (list.length <= 1) {
                list.length = 0;
            }
        }
        return list;
    };
    /**
     * Extend drawDataLabels with logic to handle custom options related to
     * the treemap series:
     *
     * - Points which is not a leaf node, has dataLabels disabled by
     *   default.
     *
     * - Options set on series.levels is merged in.
     *
     * - Width of the dataLabel is set to match the width of the point
     *   shape.
     *
     * @private
     */
    TreemapSeries.prototype.drawDataLabels = function () {
        var _a,
            _b,
            _c;
        var series = this,
            mapOptionsToLevel = series.mapOptionsToLevel,
            points = series.points.filter(function (n) {
                return n.node.visible || (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(n.dataLabel);
        }), padding = (_a = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.splat)(series.options.dataLabels || {})[0]) === null || _a === void 0 ? void 0 : _a.padding, positionsAreSet = points.some(function (p) { return (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(p.plotY); });
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point = points_1[_i];
            var style = {}, 
                // Set options to new object to avoid problems with scope
                options = { style: style },
                level = mapOptionsToLevel[point.node.level];
            // If not a leaf, then label should be disabled as default
            if (!point.node.isLeaf &&
                !point.node.isGroup ||
                (point.node.isGroup &&
                    point.node.level <= series.nodeMap[series.rootNode].level)) {
                options.enabled = false;
            }
            // If options for level exists, include them as well
            if (level === null || level === void 0 ? void 0 : level.dataLabels) {
                (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(true, options, (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.splat)(level.dataLabels)[0]);
                series.hasDataLabels = function () { return true; };
            }
            // Headers are always top-aligned. Leaf nodes no not support
            // headers.
            if (point.node.isLeaf) {
                options.inside = true;
            }
            else if (options.headers) {
                options.verticalAlign = 'top';
            }
            // Set dataLabel width to the width of the point shape minus the
            // padding
            if (point.shapeArgs && positionsAreSet) {
                var _d = point.shapeArgs,
                    _e = _d.height,
                    height = _e === void 0 ? 0 : _e,
                    _f = _d.width,
                    width = _f === void 0 ? 0 : _f;
                if (width > 32 && height > 16 && point.shouldDraw()) {
                    var dataLabelWidth = width -
                            2 * ((0,
                        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.splat)(options.padding)[0] || (0,
                        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.splat)(padding)[0] || 0);
                    style.width = "" + dataLabelWidth + "px";
                    (_b = style.lineClamp) !== null && _b !== void 0 ? _b : (style.lineClamp = Math.floor(height / 16));
                    // Only set this in traversal mode, with zooming data labels
                    // should not inherit group visibility (#24220).
                    if (this.options.allowTraversingTree) {
                        style.visibility = 'inherit';
                    }
                    // Make the label box itself fill the width. Reset when
                    // no longer header (#23100).
                    (_c = point.dataLabel) === null || _c === void 0 ? void 0 : _c.attr({
                        width: options.headers ? dataLabelWidth : void 0
                    });
                    // Hide labels for shapes that are too small
                }
                else {
                    style.width = "" + width + "px";
                    style.visibility = 'hidden';
                }
            }
            // Merge custom options with point options
            point.dlOptions = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(options, point.options.dataLabels, {
                zIndex: void 0
            });
            // Delete so it doesn't override anything on merge.
            delete point.dlOptions.zIndex;
        }
        _super.prototype.drawDataLabels.call(this, points);
    };
    /**
     * Override drawPoints
     * @private
     */
    TreemapSeries.prototype.drawPoints = function (points) {
        if (points === void 0) { points = this.points; }
        var series = this,
            chart = series.chart,
            renderer = chart.renderer,
            styledMode = chart.styledMode,
            options = series.options,
            shadow = styledMode ? {} : options.shadow,
            borderRadius = options.borderRadius,
            withinAnimationLimit = chart.pointCount < options.animationLimit,
            allowTraversingTree = options.allowTraversingTree;
        for (var _i = 0, points_2 = points; _i < points_2.length; _i++) {
            var point = points_2[_i];
            var animatableAttribs = {},
                attribs = {},
                css = {},
                groupKey = 'level-group-' + point.node.level,
                hasGraphic = !!point.graphic,
                shouldAnimate = withinAnimationLimit && hasGraphic,
                shapeArgs = point.shapeArgs;
            // Don't bother with calculate styling if the point is not drawn
            if (point.shouldDraw()) {
                point.isInside = true;
                if (borderRadius) {
                    attribs.r = borderRadius;
                }
                (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(true, // Extend object
                // Which object to extend
                shouldAnimate ? animatableAttribs : attribs, 
                // Add shapeArgs to animate/attr if graphic exists
                hasGraphic ? shapeArgs : {}, 
                // Add style attribs if !styleMode
                styledMode ?
                    {} :
                    series.pointAttribs(point, point.selected ? 'select' : void 0));
                // In styled mode apply point.color. Use CSS, otherwise the
                // fill used in the style sheet will take precedence over
                // the fill attribute.
                if (series.colorAttribs && styledMode) {
                    // Heatmap is loaded
                    (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(css, series.colorAttribs(point));
                }
                if (!series[groupKey]) {
                    series[groupKey] = renderer.g(groupKey)
                        .attr({
                        // Use the static level in order to retain z-index
                        // when data is updated (#23432).
                        zIndex: -(point.node.level || 0)
                    })
                        .add(series.group);
                    series[groupKey].survive = true;
                }
            }
            // Draw the point
            point.draw({
                animatableAttribs: animatableAttribs,
                attribs: attribs,
                css: css,
                group: series[groupKey],
                imageUrl: point.imageUrl,
                renderer: renderer,
                shadow: shadow,
                shapeArgs: shapeArgs,
                shapeType: point.shapeType
            });
            // If setRootNode is allowed, set a point cursor on clickables &
            // add drillId to point
            if (allowTraversingTree && point.graphic) {
                point.drillId = options.interactByLeaf ?
                    series.drillToByLeaf(point) :
                    series.drillToByGroup(point);
            }
        }
    };
    /**
     * Finds the drill id for a parent node. Returns false if point should
     * not have a click event.
     * @private
     */
    TreemapSeries.prototype.drillToByGroup = function (point) {
        return (!point.node.isLeaf || point.node.isGroup) ?
            point.id : false;
    };
    /**
     * Finds the drill id for a leaf node. Returns false if point should not
     * have a click event
     * @private
     */
    TreemapSeries.prototype.drillToByLeaf = function (point) {
        var traverseToLeaf = point.series.options.traverseToLeaf;
        var drillId = false,
            nodeParent;
        if ((point.node.parent !== this.rootNode) &&
            point.node.isLeaf) {
            if (traverseToLeaf) {
                drillId = point.id;
            }
            else {
                nodeParent = point.node;
                while (!drillId) {
                    if (typeof nodeParent.parent !== 'undefined') {
                        nodeParent = this.nodeMap[nodeParent.parent];
                    }
                    if (nodeParent.parent === this.rootNode) {
                        drillId = nodeParent.id;
                    }
                }
            }
        }
        return drillId;
    };
    /**
     * @todo remove this function at a suitable version.
     * @private
     */
    TreemapSeries.prototype.drillToNode = function (id, redraw) {
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.error)(32, false, void 0, { 'treemap.drillToNode': 'use treemap.setRootNode' });
        this.setRootNode(id, redraw);
    };
    TreemapSeries.prototype.drillUp = function () {
        var series = this,
            node = series.nodeMap[series.rootNode];
        if (node && (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isString)(node.parent)) {
            series.setRootNode(node.parent, true, { trigger: 'traverseUpButton' });
        }
    };
    TreemapSeries.prototype.getExtremes = function () {
        // Get the extremes from the value data
        var _a = _super.prototype.getExtremes.call(this,
            this.colorValueData),
            dataMin = _a.dataMin,
            dataMax = _a.dataMax;
        this.valueMin = dataMin;
        this.valueMax = dataMax;
        // Get the extremes from the y data
        return _super.prototype.getExtremes.call(this);
    };
    /**
     * Creates an object map from parent id to children index.
     *
     * @private
     * @function Highcharts.Series#getListOfParents
     *
     * @param {Highcharts.SeriesTreemapDataOptions} [data]
     *        List of points set in options.
     *
     * @param {Array<string>} [existingIds]
     *        List of all point ids.
     *
     * @return {Object}
     *         Map from parent id to children index in data.
     */
    TreemapSeries.prototype.getListOfParents = function (data, existingIds) {
        var arr = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isArray)(data) ? data : [],
            ids = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isArray)(existingIds) ? existingIds : [],
            listOfParents = arr.reduce(function (prev,
            curr,
            i) {
                var parent = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(curr.parent, '');
            if (typeof prev[parent] === 'undefined') {
                prev[parent] = [];
            }
            prev[parent].push(i);
            return prev;
        }, {
            '': [] // Root of tree
        });
        // If parent does not exist, hoist parent to root of tree.
        for (var _i = 0, _a = Object.keys(listOfParents); _i < _a.length; _i++) {
            var parent_2 = _a[_i];
            var children = listOfParents[parent_2];
            if ((parent_2 !== '') && (ids.indexOf(parent_2) === -1)) {
                for (var _b = 0, children_4 = children; _b < children_4.length; _b++) {
                    var child = children_4[_b];
                    listOfParents[''].push(child);
                }
                delete listOfParents[parent_2];
            }
        }
        return listOfParents;
    };
    /**
     * Creates a tree structured object from the series points.
     * @private
     */
    TreemapSeries.prototype.getTree = function () {
        var series = this,
            allIds = this.data.map(function (d) {
                return d.id;
        });
        series.parentList = series.getListOfParents(this.data, allIds);
        series.nodeMap = {};
        series.nodeList = [];
        return series.buildTree('', -1, 0, series.parentList || {});
    };
    TreemapSeries.prototype.buildTree = function (id, index, level, list, parent) {
        var series = this,
            children = [],
            point = series.points[index];
        var height = 0,
            child;
        // Actions
        for (var _i = 0, _a = (list[id] || []); _i < _a.length; _i++) {
            var i = _a[_i];
            child = series.buildTree(series.points[i].id, i, level + 1, list, id);
            height = Math.max(child.height + 1, height);
            children.push(child);
            if (series.is('treegraph')) {
                child.visible = true;
            }
        }
        var node = new series.NodeClass().init(id,
            index,
            children,
            height,
            level,
            series,
            parent);
        for (var _b = 0, children_5 = children; _b < children_5.length; _b++) {
            var child_1 = children_5[_b];
            child_1.parentNode = node;
        }
        series.nodeMap[node.id] = node;
        series.nodeList.push(node);
        if (point) {
            point.node = node;
            node.point = point;
            // Handle x-axis value for treegraph
            if (!(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(point.options.x)) {
                point.x = level;
            }
        }
        return node;
    };
    /**
     * Define hasData function for non-cartesian series. Returns true if the
     * series has points at all.
     * @private
     */
    TreemapSeries.prototype.hasData = function () {
        return !!this.dataTable.rowCount;
    };
    TreemapSeries.prototype.init = function (chart, options) {
        var _this = this;
        var series = this,
            breadcrumbsOptions = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(options.drillUpButton,
            options.breadcrumbs),
            setOptionsEvent = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(series, 'setOptions',
            function (event) {
                var _a;
            var options = event.userOptions;
            // Deprecated options
            if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(options.allowDrillToNode) &&
                !(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(options.allowTraversingTree)) {
                options.allowTraversingTree = options.allowDrillToNode;
                delete options.allowDrillToNode;
            }
            if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(options.drillUpButton) &&
                !(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(options.traverseUpButton)) {
                options.traverseUpButton = options.drillUpButton;
                delete options.drillUpButton;
            }
            // Check if we need to reserve space for headers
            var dataLabels = (0,
                highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.splat)(options.dataLabels || {});
            (_a = options.levels) === null || _a === void 0 ? void 0 : _a.forEach(function (level) {
                dataLabels.push.apply(dataLabels, (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.splat)(level.dataLabels || {}));
            });
            _this.hasOutsideDataLabels = dataLabels.some(function (dl) { return dl.headers; });
        });
        _super.prototype.init.call(this, chart, options);
        // Treemap's opacity is a different option from other series
        delete series.opacity;
        // Handle deprecated options.
        series.eventsToUnbind.push(setOptionsEvent);
        if (series.options.allowTraversingTree) {
            series.eventsToUnbind.push((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(series, 'click', series.onClickDrillToNode));
            series.eventsToUnbind.push((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(series, 'setRootNode', function (e) {
                var chart = series.chart;
                if (chart.breadcrumbs) {
                    // Create a list using the event after drilldown.
                    chart.breadcrumbs.updateProperties(series.createList(e));
                }
            }));
            series.eventsToUnbind.push((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(series, 'update', 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            function (e, redraw) {
                var breadcrumbs = this.chart.breadcrumbs;
                if (breadcrumbs && e.options.breadcrumbs) {
                    breadcrumbs.update(e.options.breadcrumbs);
                }
                this.hadOutsideDataLabels = this.hasOutsideDataLabels;
            }));
            series.eventsToUnbind.push((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(series, 'destroy', function destroyEvents(e) {
                var chart = this.chart;
                if (chart.breadcrumbs && !e.keepEventsForUpdate) {
                    chart.breadcrumbs.destroy();
                    chart.breadcrumbs = void 0;
                }
            }));
        }
        if (!chart.breadcrumbs) {
            chart.breadcrumbs = new Breadcrumbs_Breadcrumbs(chart, breadcrumbsOptions);
        }
        series.eventsToUnbind.push((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(chart.breadcrumbs, 'up', function (e) {
            var drillUpsNumber = this.level - e.newLevel;
            for (var i = 0; i < drillUpsNumber; i++) {
                series.drillUp();
            }
        }));
    };
    /**
     * Add drilling on the suitable points.
     * @private
     */
    TreemapSeries.prototype.onClickDrillToNode = function (event) {
        var series = this,
            point = event.point,
            drillId = point === null || point === void 0 ? void 0 : point.drillId;
        // If a drill id is returned, add click event and cursor.
        if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isString)(drillId)) {
            point.setState(''); // Remove hover
            series.setRootNode(drillId, true, { trigger: 'click' });
        }
    };
    /**
     * Get presentational attributes
     * @private
     */
    TreemapSeries.prototype.pointAttribs = function (point, state) {
        var _a,
            _b;
        var series = this,
            mapOptionsToLevel = ((0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(series.mapOptionsToLevel) ?
                series.mapOptionsToLevel :
                {}),
            level = (point === null || point === void 0 ? void 0 : point.node) && mapOptionsToLevel[point.node.level] || {},
            options = this.options,
            stateOptions = state && options.states && options.states[state] || {},
            className = (point === null || point === void 0 ? void 0 : point.node) && point.getClassName() || '', 
            // Set attributes by precedence. Point trumps level trumps series.
            // Stroke width uses pick because it can be 0.
            attr = {
                'stroke': (point && point.borderColor) ||
                    level.borderColor ||
                    stateOptions.borderColor ||
                    options.borderColor,
                'stroke-width': (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(point && point.borderWidth,
            level.borderWidth,
            stateOptions.borderWidth,
            options.borderWidth),
                'dashstyle': (point === null || point === void 0 ? void 0 : point.borderDashStyle) ||
                    level.borderDashStyle ||
                    stateOptions.borderDashStyle ||
                    options.borderDashStyle,
                'fill': (point === null || point === void 0 ? void 0 : point.color) || this.color
            };
        // Hide levels above the current view
        if (className.indexOf('highcharts-above-level') !== -1) {
            attr.fill = 'none';
            attr['stroke-width'] = 0;
            // Nodes with children that accept interaction
        }
        else if (className.indexOf('highcharts-internal-node-interactive') !== -1) {
            attr['fill-opacity'] = (_b = (_a = stateOptions.opacity) !== null && _a !== void 0 ? _a : options.opacity) !== null && _b !== void 0 ? _b : 1;
            attr.cursor = 'pointer';
            // Hide nodes that have children
        }
        else if (className.indexOf('highcharts-internal-node') !== -1) {
            attr.fill = 'none';
        }
        else if (state && stateOptions.brightness) {
            // Brighten and hoist the hover nodes
            attr.fill = color(attr.fill)
                .brighten(stateOptions.brightness)
                .get();
        }
        return attr;
    };
    /**
     * Set the node's color recursively, from the parent down.
     * @private
     */
    TreemapSeries.prototype.setColorRecursive = function (node, parentColor, colorIndex, index, siblings) {
        var _a;
        var series = this,
            chart = series === null || series === void 0 ? void 0 : series.chart,
            colors = (_a = chart === null || chart === void 0 ? void 0 : chart.options) === null || _a === void 0 ? void 0 : _a.colors;
        if (node) {
            var colorInfo = TreemapSeries_getColor(node, {
                    colors: colors,
                    index: index,
                    mapOptionsToLevel: series.mapOptionsToLevel,
                    parentColor: parentColor,
                    parentColorIndex: colorIndex,
                    series: series,
                    siblings: siblings
                }),
                point = series.points[node.i];
            if (point) {
                point.color = colorInfo.color;
                point.colorIndex = colorInfo.colorIndex;
            }
            var i = -1;
            // Do it all again with the children
            for (var _i = 0, _b = (node.children || []); _i < _b.length; _i++) {
                var child = _b[_i];
                series.setColorRecursive(child, colorInfo.color, colorInfo.colorIndex, ++i, node.children.length);
            }
        }
    };
    TreemapSeries.prototype.setPointValues = function () {
        var series = this;
        var points = series.points,
            xAxis = series.xAxis,
            yAxis = series.yAxis;
        var styledMode = series.chart.styledMode;
        // Get the crisp correction in classic mode. For this to work in
        // styled mode, we would need to first add the shape (without x,
        // y, width and height), then read the rendered stroke width
        // using point.graphic.strokeWidth(), then modify and apply the
        // shapeArgs. This applies also to column series, but the
        // downside is performance and code complexity.
        var getStrokeWidth = function (point) { return (styledMode ?
                0 :
                (series.pointAttribs(point)['stroke-width'] || 0)); };
        for (var _i = 0, points_3 = points; _i < points_3.length; _i++) {
            var point = points_3[_i];
            var _a = point.node,
                values = _a.pointValues,
                visible = _a.visible;
            // Points which is ignored, have no values.
            if (values && visible) {
                var height = values.height,
                    width = values.width,
                    x = values.x,
                    y = values.y,
                    strokeWidth = getStrokeWidth(point),
                    xValue = xAxis.toPixels(x,
                    true),
                    x2Value = xAxis.toPixels(x + width,
                    true),
                    yValue = yAxis.toPixels(y,
                    true),
                    y2Value = yAxis.toPixels(y + height,
                    true), 
                    // If the edge of a rectangle is on the edge, make sure it
                    // stays within the plot area by adding or subtracting half
                    // of the stroke width.
                    x1 = xValue === 0 ?
                        strokeWidth / 2 :
                        (0,
                    highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.crisp)(xAxis.toPixels(x,
                    true),
                    strokeWidth,
                    true),
                    x2 = x2Value === xAxis.len ?
                        xAxis.len - strokeWidth / 2 :
                        (0,
                    highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.crisp)(xAxis.toPixels(x + width,
                    true),
                    strokeWidth,
                    true),
                    y1 = yValue === yAxis.len ?
                        yAxis.len - strokeWidth / 2 :
                        (0,
                    highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.crisp)(yAxis.toPixels(y,
                    true),
                    strokeWidth,
                    true),
                    y2 = y2Value === 0 ?
                        strokeWidth / 2 :
                        (0,
                    highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.crisp)(yAxis.toPixels(y + height,
                    true),
                    strokeWidth,
                    true);
                // Set point values
                var shapeArgs = {
                        x: Math.min(x1,
                    x2),
                        y: Math.min(y1,
                    y2),
                        width: Math.abs(x2 - x1),
                        height: Math.abs(y2 - y1)
                    };
                point.plotX = shapeArgs.x + (shapeArgs.width / 2);
                point.plotY = shapeArgs.y + (shapeArgs.height / 2);
                point.shapeArgs = shapeArgs;
            }
            else {
                // Reset visibility
                delete point.plotX;
                delete point.plotY;
            }
        }
    };
    /**
     * Sets a new root node for the series.
     *
     * @private
     * @function Highcharts.Series#setRootNode
     *
     * @param {string} id
     * The id of the new root node.
     *
     * @param {boolean} [redraw=true]
     * Whether to redraw the chart or not.
     *
     * @param {Object} [eventArguments]
     * Arguments to be accessed in event handler.
     *
     * @param {string} [eventArguments.newRootId]
     * Id of the new root.
     *
     * @param {string} [eventArguments.previousRootId]
     * Id of the previous root.
     *
     * @param {boolean} [eventArguments.redraw]
     * Whether to redraw the chart after.
     *
     * @param {Object} [eventArguments.series]
     * The series to update the root of.
     *
     * @param {string} [eventArguments.trigger]
     * The action which triggered the event. Undefined if the setRootNode is
     * called directly.
     *
     * @emits Highcharts.Series#event:setRootNode
     */
    TreemapSeries.prototype.setRootNode = function (id, redraw, eventArguments) {
        var series = this,
            eventArgs = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)({
                newRootId: id,
                previousRootId: series.rootNode,
                redraw: (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(redraw,
            true),
                series: series
            },
            eventArguments);
        /**
         * The default functionality of the setRootNode event.
         *
         * @private
         * @param {Object} args The event arguments.
         * @param {string} args.newRootId Id of the new root.
         * @param {string} args.previousRootId Id of the previous root.
         * @param {boolean} args.redraw Whether to redraw the chart after.
         * @param {Object} args.series The series to update the root of.
         * @param {string} [args.trigger=undefined] The action which
         * triggered the event. Undefined if the setRootNode is called
         * directly.
             */
        var defaultFn = function (args) {
                var series = args.series;
            // Store previous and new root ids on the series.
            series.idPreviousRoot = args.previousRootId;
            series.rootNode = args.newRootId;
            // Redraw the chart
            series.isDirty = true; // Force redraw
            if (args.redraw) {
                series.chart.redraw();
            }
        };
        // Fire setRootNode event.
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(series, 'setRootNode', eventArgs, defaultFn);
    };
    /**
     * Workaround for `inactive` state. Since `series.opacity` option is
     * already reserved, don't use that state at all by disabling
     * `inactiveOtherPoints` and not inheriting states by points.
     * @private
     */
    TreemapSeries.prototype.setState = function (state) {
        this.options.inactiveOtherPoints = true;
        _super.prototype.setState.call(this, state, false);
        this.options.inactiveOtherPoints = false;
    };
    TreemapSeries.prototype.setTreeValues = function (tree) {
        var _a,
            _b,
            _c;
        var series = this,
            options = series.options,
            idRoot = series.rootNode,
            mapIdToNode = series.nodeMap,
            nodeRoot = mapIdToNode[idRoot],
            levelIsConstant = (typeof options.levelIsConstant === 'boolean' ?
                options.levelIsConstant :
                true),
            children = [],
            point = series.points[tree.i];
        // First give the children some values
        var childrenTotal = 0;
        for (var _i = 0, _d = tree.children; _i < _d.length; _i++) {
            var child = _d[_i];
            child = series.setTreeValues(child);
            children.push(child);
            if (!child.ignore) {
                childrenTotal += child.val;
            }
        }
        // Sort the children
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.stableSort)(children, function (a, b) { return ((a.sortIndex || 0) - (b.sortIndex || 0)); });
        // Set the values
        var val = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(point === null || point === void 0 ? void 0 : point.simulatedValue,
            point === null || point === void 0 ? void 0 : point.options.value,
            childrenTotal);
        if (point) {
            point.value = val;
        }
        if ((point === null || point === void 0 ? void 0 : point.isGroup) && ((_a = options.cluster) === null || _a === void 0 ? void 0 : _a.reductionFactor)) {
            val /= options.cluster.reductionFactor;
        }
        if (((_c = (_b = tree.parentNode) === null || _b === void 0 ? void 0 : _b.point) === null || _c === void 0 ? void 0 : _c.isGroup) && series.rootNode !== tree.parent) {
            tree.visible = false;
        }
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(tree, {
            children: children,
            childrenTotal: childrenTotal,
            // Ignore this node if point is not visible
            ignore: !((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(point === null || point === void 0 ? void 0 : point.visible, true) && (val > 0)),
            isLeaf: tree.visible && !(series.type === 'treegraph' ?
                children.length > 0 :
                childrenTotal),
            isGroup: point === null || point === void 0 ? void 0 : point.isGroup,
            levelDynamic: (tree.level - (levelIsConstant ? 0 : nodeRoot.level)),
            name: (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(point === null || point === void 0 ? void 0 : point.name, ''),
            sortIndex: (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(point === null || point === void 0 ? void 0 : point.sortIndex, -val),
            val: val
        });
        return tree;
    };
    TreemapSeries.prototype.sliceAndDice = function (parent, children) {
        return this.algorithmFill(true, parent, children);
    };
    TreemapSeries.prototype.squarified = function (parent, children) {
        return this.algorithmLowAspectRatio(true, parent, children);
    };
    TreemapSeries.prototype.strip = function (parent, children) {
        return this.algorithmLowAspectRatio(false, parent, children);
    };
    TreemapSeries.prototype.stripes = function (parent, children) {
        return this.algorithmFill(false, parent, children);
    };
    TreemapSeries.prototype.translate = function (tree) {
        var _a;
        var series = this,
            options = series.options,
            applyGrouping = !tree;
        var // NOTE: updateRootId modifies series.
            rootId = TreemapSeries_updateRootId(series),
            rootNode,
            pointValues,
            seriesArea,
            val;
        if (!tree && !rootId.startsWith('highcharts-grouped-treemap-points-')) {
            // Group points are removed, but not destroyed during generatePoints
            (this.points || []).forEach(function (point) {
                if (point.isGroup) {
                    point.destroy();
                }
            });
            // Call prototype function
            _super.prototype.translate.call(this);
            // @todo Only if series.isDirtyData is true
            tree = series.getTree();
        }
        // Ensure `tree` and `series.tree` are synchronized
        series.tree = tree = tree || series.tree;
        rootNode = series.nodeMap[rootId];
        if (rootId !== '' && !rootNode) {
            series.setRootNode('', false);
            rootId = series.rootNode;
            rootNode = series.nodeMap[rootId];
        }
        if (!((_a = rootNode.point) === null || _a === void 0 ? void 0 : _a.isGroup)) {
            series.mapOptionsToLevel = TreemapSeries_getLevelOptions({
                from: rootNode.level + 1,
                levels: options.levels,
                to: tree.height,
                defaults: {
                    levelIsConstant: series.options.levelIsConstant,
                    colorByPoint: options.colorByPoint
                }
            });
        }
        // Parents of the root node is by default visible
        Treemap_TreemapUtilities.recursive(series.nodeMap[series.rootNode], function (node) {
            var p = node.parent;
            var next = false;
            node.visible = true;
            if (p || p === '') {
                next = series.nodeMap[p];
            }
            return next;
        });
        // Children of the root node is by default visible
        Treemap_TreemapUtilities.recursive(series.nodeMap[series.rootNode].children, function (children) {
            var next = false;
            for (var _i = 0, children_6 = children; _i < children_6.length; _i++) {
                var child = children_6[_i];
                child.visible = true;
                if (child.children.length) {
                    next = (next || []).concat(child.children);
                }
            }
            return next;
        });
        series.setTreeValues(tree);
        // Calculate plotting values.
        series.axisRatio = (series.xAxis.len / series.yAxis.len);
        series.nodeMap[''].pointValues = pointValues = {
            x: 0,
            y: 0,
            width: axisMax,
            height: axisMax
        };
        series.nodeMap[''].values = seriesArea = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(pointValues, {
            width: (pointValues.width * series.axisRatio),
            direction: (options.layoutStartingDirection === 'vertical' ? 0 : 1),
            val: tree.val
        });
        // We need to pre-render the data labels in order to measure the height
        // of data label group
        if (this.hasOutsideDataLabels || this.hadOutsideDataLabels) {
            this.drawDataLabels();
        }
        series.calculateChildrenAreas(tree, seriesArea);
        // Logic for point colors
        if (!series.colorAxis &&
            !options.colorByPoint) {
            series.setColorRecursive(series.tree);
        }
        // Update axis extremes according to the root node.
        if (options.allowTraversingTree && rootNode.pointValues) {
            val = rootNode.pointValues;
            series.xAxis.setExtremes(val.x, val.x + val.width, false);
            series.yAxis.setExtremes(val.y, val.y + val.height, false);
            series.xAxis.setScale();
            series.yAxis.setScale();
        }
        // Assign values to points.
        series.setPointValues();
        if (applyGrouping) {
            series.applyTreeGrouping();
        }
    };
    TreemapSeries.defaultOptions = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(ScatterSeries.defaultOptions, Treemap_TreemapSeriesDefaults);
    return TreemapSeries;
}(ScatterSeries));
(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(TreemapSeries.prototype, {
    buildKDTree: noop,
    colorAttribs: Series_ColorMapComposition.seriesMembers.colorAttribs,
    colorKey: 'colorValue', // Point color option key
    directTouch: true,
    getExtremesFromAll: true,
    getSymbol: noop,
    optionalAxis: 'colorAxis',
    parallelArrays: ['x', 'y', 'value', 'colorValue'],
    pointArrayMap: ['value', 'colorValue'],
    pointClass: Treemap_TreemapPoint,
    NodeClass: Treemap_TreemapNode,
    trackerGroups: ['group', 'dataLabelsGroup'],
    utils: Treemap_TreemapUtilities
});
Series_ColorMapComposition.compose(TreemapSeries);
highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default().registerSeriesType('treemap', TreemapSeries);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Treemap_TreemapSeries = ((/* unused pure expression or super */ null && (TreemapSeries)));

;// ./code/es5/es-modules/Series/CenteredUtilities.js
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


var deg2rad = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).deg2rad;

/**
 * @private
 */
var CenteredUtilities;
(function (CenteredUtilities) {
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
     * Get the center of the pie based on the size and center options relative
     * to the plot area. Borrowed by the polar and gauge series types.
     *
     * @private
     * @function Highcharts.CenteredSeriesMixin.getCenter
     */
    function getCenter() {
        var options = this.options,
            chart = this.chart,
            slicingRoom = 2 * (options.slicedOffset || 0),
            plotWidth = chart.plotWidth - 2 * slicingRoom,
            plotHeight = chart.plotHeight - 2 * slicingRoom,
            centerOption = options.center,
            smallestSize = Math.min(plotWidth,
            plotHeight),
            thickness = options.thickness;
        var handleSlicingRoom,
            size = options.size,
            innerSize = options.innerSize || 0,
            i,
            value;
        if (typeof size === 'string') {
            size = parseFloat(size);
        }
        if (typeof innerSize === 'string') {
            innerSize = parseFloat(innerSize);
        }
        var positions = [
                (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(centerOption === null || centerOption === void 0 ? void 0 : centerOption[0], '50%'),
                (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(centerOption === null || centerOption === void 0 ? void 0 : centerOption[1], '50%'),
                // Prevent from negative values
                (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(size && size < 0 ? void 0 : options.size, '100%'),
                (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(innerSize && innerSize < 0 ? void 0 : options.innerSize || 0, '0%')
            ];
        for (i = 0; i < 4; ++i) {
            value = positions[i];
            handleSlicingRoom = i < 2 || (i === 2 && /%$/.test(value));
            // I == 0: centerX, relative to width
            // i == 1: centerY, relative to height
            // i == 2: size, relative to smallestSize
            // i == 3: innerSize, relative to size
            positions[i] = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.relativeLength)(value, [plotWidth, plotHeight, smallestSize, positions[2]][i]) + (handleSlicingRoom ? slicingRoom : 0);
        }
        // Inner size cannot be larger than size (#3632)
        if (positions[3] > positions[2]) {
            positions[3] = positions[2];
        }
        // Thickness overrides innerSize, need to be less than pie size (#6647)
        if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(thickness) &&
            thickness * 2 < positions[2] && thickness > 0) {
            positions[3] = positions[2] - thickness * 2;
        }
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(this, 'afterGetCenter', { positions: positions });
        return positions;
    }
    CenteredUtilities.getCenter = getCenter;
    /**
     * GetStartAndEndRadians - Calculates start and end angles in radians.
     * Used in series types such as pie and sunburst.
     *
     * @private
     * @function Highcharts.CenteredSeriesMixin.getStartAndEndRadians
     *
     * @param {number} [start]
     *        Start angle in degrees.
     *
     * @param {number} [end]
     *        Start angle in degrees.
     *
     * @return {Highcharts.RadianAngles}
     *         Returns an object containing start and end angles as radians.
     */
    function getStartAndEndRadians(start, end) {
        var startAngle = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(start) ? start : 0, // Must be a number
            endAngle = (((0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(end) && // Must be a number
                end > startAngle && // Must be larger than the start angle
                // difference must be less than 360 degrees
                (end - startAngle) < 360) ?
                end :
                startAngle + 360),
            correction = -90;
        return {
            start: deg2rad * (startAngle + correction),
            end: deg2rad * (endAngle + correction)
        };
    }
    CenteredUtilities.getStartAndEndRadians = getStartAndEndRadians;
})(CenteredUtilities || (CenteredUtilities = {}));
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Series_CenteredUtilities = (CenteredUtilities);
/* *
 *
 *  API Declarations
 *
 * */
/**
 * @private
 * @interface Highcharts.RadianAngles
 */ /**
* @name Highcharts.RadianAngles#end
* @type {number}
*/ /**
* @name Highcharts.RadianAngles#start
* @type {number}
*/
''; // Keeps doclets above in JS file

;// ./code/es5/es-modules/Series/Sunburst/SunburstPoint.js
/* *
 *
 *  This module implements sunburst charts in Highcharts.
 *
 *  (c) 2016-2026 Highsoft AS
 *
 *  Authors: Jon Arild Nygård
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

var SunburstPoint_extends = (undefined && undefined.__extends) || (function () {
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

var Point = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).series.prototype.pointClass, SunburstPoint_TreemapPoint = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes.treemap.prototype.pointClass;

/* *
 *
 *  Class
 *
 * */
var SunburstPoint = /** @class */ (function (_super) {
    SunburstPoint_extends(SunburstPoint, _super);
    function SunburstPoint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Functions
     *
     * */
    SunburstPoint.prototype.getDataLabelPath = function (label) {
        var _a;
        var renderer = this.series.chart.renderer,
            shapeArgs = this.shapeExisting,
            r = shapeArgs.r + (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pInt)(((_a = label.options) === null || _a === void 0 ? void 0 : _a.distance) || 0);
        var start = shapeArgs.start,
            end = shapeArgs.end;
        var angle = start + (end - start) / 2; // Arc middle value
            var upperHalf = angle < 0 &&
                angle > -Math.PI ||
                angle > Math.PI, moreThanHalf;
        // Check if point is a full circle
        if (start === -Math.PI / 2 &&
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.correctFloat)(end) === (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.correctFloat)(Math.PI * 1.5)) {
            start = -Math.PI + Math.PI / 360;
            end = -Math.PI / 360;
            upperHalf = true;
        }
        // Check if dataLabels should be render in the upper half of the circle
        if (end - start > Math.PI) {
            upperHalf = false;
            moreThanHalf = true;
            // Close to the full circle, add some padding so that the SVG
            // renderer treats it as separate points (#18884).
            if ((end - start) > 2 * Math.PI - 0.01) {
                start += 0.01;
                end -= 0.01;
            }
        }
        if (this.dataLabelPath) {
            this.dataLabelPath = this.dataLabelPath.destroy();
        }
        // All times
        this.dataLabelPath = renderer
            .arc({
            open: true,
            longArc: moreThanHalf ? 1 : 0
        })
            .attr({
            start: (upperHalf ? start : end),
            end: (upperHalf ? end : start),
            clockwise: +upperHalf,
            x: shapeArgs.x,
            y: shapeArgs.y,
            r: (r + shapeArgs.innerR) / 2
        })
            .add(renderer.defs);
        return this.dataLabelPath;
    };
    SunburstPoint.prototype.isValid = function () {
        return true;
    };
    return SunburstPoint;
}(SunburstPoint_TreemapPoint));
(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(SunburstPoint.prototype, {
    getClassName: Point.prototype.getClassName,
    haloPath: Point.prototype.haloPath,
    setState: Point.prototype.setState
});
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Sunburst_SunburstPoint = (SunburstPoint);

;// ./code/es5/es-modules/Series/Sunburst/SunburstUtilities.js
/* *
 *
 *  This module implements sunburst charts in Highcharts.
 *
 *  (c) 2016-2026 Highsoft AS
 *
 *  Authors: Jon Arild Nygård
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */


var SunburstUtilities_TreemapSeries = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes.treemap;

/* *
 *
 *  Functions
 *
 * */
/**
 * @private
 * @function calculateLevelSizes
 *
 * @param {Object} levelOptions
 * Map of level to its options.
 *
 * @param {Highcharts.Dictionary<number>} params
 * Object containing number parameters `innerRadius` and `outerRadius`.
 *
 * @return {Highcharts.SunburstSeriesLevelsOptions|undefined}
 * Returns the modified options, or undefined.
 */
function calculateLevelSizes(levelOptions, params) {
    var p = (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(params) ? params : {};
    var result,
        totalWeight = 0,
        diffRadius,
        levels,
        levelsNotIncluded,
        remainingSize,
        from,
        to;
    if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(levelOptions)) {
        result = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)({}, levelOptions);
        from = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(p.from) ? p.from : 0;
        to = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(p.to) ? p.to : 0;
        levels = range(from, to);
        levelsNotIncluded = Object.keys(result).filter(function (key) { return (levels.indexOf(+key) === -1); });
        diffRadius = remainingSize = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(p.diffRadius) ?
            p.diffRadius : 0;
        // Convert percentage to pixels.
        // Calculate the remaining size to divide between "weight" levels.
        // Calculate total weight to use in conversion from weight to
        // pixels.
        for (var _i = 0, levels_1 = levels; _i < levels_1.length; _i++) {
            var level = levels_1[_i];
            var options = result[level],
                unit = options.levelSize.unit,
                value = options.levelSize.value;
            if (unit === 'weight') {
                totalWeight += value;
            }
            else if (unit === 'percentage') {
                options.levelSize = {
                    unit: 'pixels',
                    value: (value / 100) * diffRadius
                };
                remainingSize -= options.levelSize.value;
            }
            else if (unit === 'pixels') {
                remainingSize -= value;
            }
        }
        // Convert weight to pixels.
        for (var _a = 0, levels_2 = levels; _a < levels_2.length; _a++) {
            var level = levels_2[_a];
            var options = result[level];
            if (options.levelSize.unit === 'weight') {
                var weight = options.levelSize.value;
                result[level].levelSize = {
                    unit: 'pixels',
                    value: (weight / totalWeight) * remainingSize
                };
            }
        }
        // Set all levels not included in interval [from,to] to have 0
        // pixels.
        for (var _b = 0, levelsNotIncluded_1 = levelsNotIncluded; _b < levelsNotIncluded_1.length; _b++) {
            var level = levelsNotIncluded_1[_b];
            result[level].levelSize = {
                value: 0,
                unit: 'pixels'
            };
        }
    }
    return result;
}
/**
 * @private
 */
function getLevelFromAndTo(_a) {
    var level = _a.level,
        height = _a.height;
    //  Never displays level below 1
    var from = level > 0 ? level : 1;
    var to = level + height;
    return { from: from, to: to };
}
/**
 * TODO introduce step, which should default to 1.
 * @private
 */
function range(from, to) {
    var result = [];
    if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(from) && (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(to) && from <= to) {
        for (var i = from; i <= to; i++) {
            result.push(i);
        }
    }
    return result;
}
/* *
 *
 *  Default Export
 *
 * */
var SunburstUtilities = {
    calculateLevelSizes: calculateLevelSizes,
    getLevelFromAndTo: getLevelFromAndTo,
    range: range,
    recursive: SunburstUtilities_TreemapSeries.prototype.utils.recursive
};
/* harmony default export */ var Sunburst_SunburstUtilities = (SunburstUtilities);

;// ./code/es5/es-modules/Series/Sunburst/SunburstNode.js
/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Paweł Lysy
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

var SunburstNode_extends = (undefined && undefined.__extends) || (function () {
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

/* *
 *
 *  Class
 *
 * */
var SunburstNode = /** @class */ (function (_super) {
    SunburstNode_extends(SunburstNode, _super);
    function SunburstNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SunburstNode;
}(Treemap_TreemapNode));
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Sunburst_SunburstNode = (SunburstNode);

;// ./code/es5/es-modules/Series/Sunburst/SunburstSeriesDefaults.js
/* *
 *
 *  This module implements sunburst charts in Highcharts.
 *
 *  (c) 2016-2026 Highsoft AS
 *
 *  Authors: Jon Arild Nygård
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
 * A Sunburst displays hierarchical data, where a level in the hierarchy is
 * represented by a circle. The center represents the root node of the tree.
 * The visualization bears a resemblance to both treemap and pie charts.
 *
 * @sample highcharts/demo/sunburst
 *         Sunburst chart
 *
 * @extends      plotOptions.pie
 * @excluding    allAreas, clip, colorAxis, colorKey, compare, compareBase,
 *               dataGrouping, depth, dragDrop, endAngle, gapSize, gapUnit,
 *               ignoreHiddenPoint, innerSize, joinBy, legendType, linecap,
 *               minSize, navigatorOptions, pointRange
 * @product      highcharts
 * @requires     modules/sunburst
 * @optionparent plotOptions.sunburst
 *
 * @private
 */
var SunburstSeriesDefaults = {
    /**
     * Options for the breadcrumbs, the navigation at the top leading the
     * way up through the traversed levels.
     *
     * @since 10.0.0
     * @product   highcharts
     * @extends   navigation.breadcrumbs
     * @apioption plotOptions.sunburst.breadcrumbs
     */
    /**
     * Set options on specific levels. Takes precedence over series options,
     * but not point options.
     *
     * @sample highcharts/demo/sunburst
     *         Sunburst chart
     *
     * @type      {Array<*>}
     * @apioption plotOptions.sunburst.levels
     */
    /**
     * Can set a `borderColor` on all points which lies on the same level.
     *
     * @type      {Highcharts.ColorString}
     * @apioption plotOptions.sunburst.levels.borderColor
     */
    /**
     * Can set a `borderWidth` on all points which lies on the same level.
     *
     * @type      {number}
     * @apioption plotOptions.sunburst.levels.borderWidth
     */
    /**
     * Can set a `borderDashStyle` on all points which lies on the same
     * level.
     *
     * @type      {Highcharts.DashStyleValue}
     * @apioption plotOptions.sunburst.levels.borderDashStyle
     */
    /**
     * Can set a `color` on all points which lies on the same level.
     *
     * @type      {Highcharts.ColorType}
     * @apioption plotOptions.sunburst.levels.color
     */
    /**
     * Determines whether the chart should receive one color per point based
     * on this level.
     *
     * @type      {boolean}
     * @apioption plotOptions.sunburst.levels.colorByPoint
     */
    /**
     * Can set a `colorVariation` on all points which lies on the same
     * level.
     *
     * @apioption plotOptions.sunburst.levels.colorVariation
     */
    /**
     * The key of a color variation. Currently supports `brightness` only.
     *
     * @type      {string}
     * @apioption plotOptions.sunburst.levels.colorVariation.key
     */
    /**
     * The ending value of a color variation. The last sibling will receive
     * this value.
     *
     * @type      {number}
     * @apioption plotOptions.sunburst.levels.colorVariation.to
     */
    /**
     * Can set `dataLabels` on all points which lies on the same level.
     *
     * @extends   plotOptions.sunburst.dataLabels
     * @apioption plotOptions.sunburst.levels.dataLabels
     */
    /**
     * Decides which level takes effect from the options set in the levels
     * object.
     *
     * @sample highcharts/demo/sunburst
     *         Sunburst chart
     *
     * @type      {number}
     * @apioption plotOptions.sunburst.levels.level
     */
    /**
     * Can set a `levelSize` on all points which lies on the same level.
     *
     * @type      {Object}
     * @apioption plotOptions.sunburst.levels.levelSize
     */
    /**
     * When enabled the user can click on a point which is a parent and
     * zoom in on its children. Deprecated and replaced by
     * [allowTraversingTree](#plotOptions.sunburst.allowTraversingTree).
     *
     * @deprecated 7.0.3
     * @type      {boolean}
     * @default   false
     * @since     6.0.0
     * @product   highcharts
     * @apioption plotOptions.sunburst.allowDrillToNode
     */
    /**
     * When enabled the user can click on a point which is a parent and
     * zoom in on its children.
     *
     * @type      {boolean}
     * @default   false
     * @since     7.0.3
     * @product   highcharts
     * @apioption plotOptions.sunburst.allowTraversingTree
     */
    /**
     * The center of the sunburst chart relative to the plot area. Can be
     * percentages or pixel values.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-center/
     *         Centered at 100, 100
     *
     * @type    {Array<number|string>}
     * @default ["50%", "50%"]
     * @product highcharts
     *
     * @private
     */
    center: ['50%', '50%'],
    /**
     * @product highcharts
     *
     * @private
     */
    clip: false,
    colorByPoint: false,
    /**
     * Disable inherited opacity from Treemap series.
     *
     * @ignore-option
     *
     * @private
     */
    opacity: 1,
    /**
     * @declare Highcharts.SeriesSunburstDataLabelsOptionsObject
     *
     * @private
     */
    dataLabels: {
        allowOverlap: true,
        defer: true,
        /**
         * Decides how the data label will be rotated relative to the
         * perimeter of the sunburst. Valid values are `circular`, `auto`,
         * `parallel` and `perpendicular`. When `circular`, the best fit
         * will be computed for the point, so that the label is curved
         * around the center when there is room for it, otherwise
         * perpendicular. The legacy `auto` option works similar to
         * `circular`, but instead of curving the labels they are tangent to
         * the perimeter.
         *
         * The `rotation` option takes precedence over `rotationMode`.
         *
         * @type       {string}
         * @sample {highcharts}
         *         highcharts/plotoptions/sunburst-datalabels-rotationmode-circular/
         *         Circular rotation mode
         * @validvalue ["auto", "perpendicular", "parallel", "circular"]
         * @since      6.0.0
         */
        rotationMode: 'circular',
        style: {
            textOverflow: 'ellipsis'
        }
    },
    /**
     * Which point to use as a root in the visualization.
     *
     * @type {string}
     *
     * @private
     */
    rootId: void 0,
    /**
     * Used together with the levels and `allowDrillToNode` options. When
     * set to false the first level visible when drilling is considered
     * to be level one. Otherwise the level will be the same as the tree
     * structure.
     *
     * @private
     */
    levelIsConstant: true,
    /**
     * Determines the width of the ring per level.
     *
     * @sample {highcharts} highcharts/plotoptions/sunburst-levelsize/
     *         Sunburst with various sizes per level
     *
     * @since 6.0.5
     *
     * @private
     */
    levelSize: {
        /**
         * The value used for calculating the width of the ring. Its' affect
         * is determined by `levelSize.unit`.
         *
         * @sample {highcharts} highcharts/plotoptions/sunburst-levelsize/
         *         Sunburst with various sizes per level
         */
        value: 1,
        /**
         * How to interpret `levelSize.value`.
         *
         * - `percentage` gives a width relative to result of outer radius
         *   minus inner radius.
         *
         * - `pixels` gives the ring a fixed width in pixels.
         *
         * - `weight` takes the remaining width after percentage and pixels,
         *   and distributes it across all "weighted" levels. The value
         *   relative to the sum of all weights determines the width.
         *
         * @sample {highcharts} highcharts/plotoptions/sunburst-levelsize/
         *         Sunburst with various sizes per level
         *
         * @validvalue ["percentage", "pixels", "weight"]
         */
        unit: 'weight'
    },
    /**
     * Options for the button appearing when traversing down in a sunburst.
     * Since v9.3.3 the `traverseUpButton` is replaced by `breadcrumbs`.
     *
     * @extends   plotOptions.treemap.traverseUpButton
     * @since     6.0.0
     * @deprecated 9.3.3
     * @apioption plotOptions.sunburst.traverseUpButton
     *
     */
    /**
     * If a point is sliced, moved out from the center, how many pixels
     * should it be moved?.
     *
     * @sample highcharts/plotoptions/sunburst-sliced
     *         Sliced sunburst
     *
     * @since 6.0.4
     *
     * @private
     */
    slicedOffset: 10
};
/**
 * A `sunburst` series. If the [type](#series.sunburst.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.sunburst
 * @excluding dataParser, dataURL, stack, dataSorting, boostThreshold,
 *            boostBlending
 * @product   highcharts
 * @requires  modules/sunburst
 * @apioption series.sunburst
 */
/**
 * @basic
 * @type      {Array<number|null|*>}
 * @extends   series.treemap.data
 * @excluding x, y
 * @product   highcharts
 * @apioption series.sunburst.data
 */
/**
 * @type      {Highcharts.SeriesSunburstDataLabelsOptionsObject|Array<Highcharts.SeriesSunburstDataLabelsOptionsObject>}
 * @product   highcharts
 * @apioption series.sunburst.data.dataLabels
 */
/**
 * The value of the point, resulting in a relative area of the point
 * in the sunburst.
 *
 * @type      {number|null}
 * @since     6.0.0
 * @product   highcharts
 * @apioption series.sunburst.data.value
 */
/**
 * Use this option to build a tree structure. The value should be the id of the
 * point which is the parent. If no points has a matching id, or this option is
 * undefined, then the parent will be set to the root.
 *
 * @type      {string}
 * @since     6.0.0
 * @product   highcharts
 * @apioption series.sunburst.data.parent
 */
/**
  * Whether to display a slice offset from the center. When a sunburst point is
  * sliced, its children are also offset.
  *
  * @sample highcharts/plotoptions/sunburst-sliced
  *         Sliced sunburst
  *
  * @type      {boolean}
  * @default   false
  * @since     6.0.4
  * @product   highcharts
  * @apioption series.sunburst.data.sliced
  */
''; // Detach doclets above
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Sunburst_SunburstSeriesDefaults = (SunburstSeriesDefaults);

;// ./code/es5/es-modules/Extensions/TextPath.js
/* *
 *
 *  Highcharts module with textPath functionality.
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */




var TextPath_composed = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).composed, TextPath_deg2rad = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).deg2rad;
/* *
 *
 *  Functions
 *
 * */
/**
 * Set a text path for a `text` or `label` element, allowing the text to
 * flow along a path.
 *
 * In order to unset the path for an existing element, call `setTextPath`
 * with `{ enabled: false }` as the second argument.
 *
 * Text path support is not bundled into `highcharts.js`, and requires the
 * `modules/textpath.js` file. However, it is included in the script files of
 * those series types that use it by default.
 *
 * @sample highcharts/members/renderer-textpath/ Text path demonstrated
 *
 * @internal
 * @function Highcharts.SVGElement#setTextPath
 *
 * @param {Highcharts.SVGElement|undefined} path
 *        Path to follow. If undefined, it allows changing options for the
 *        existing path.
 *
 * @param {Highcharts.DataLabelsTextPathOptionsObject} textPathOptions
 *        Options.
 *
 * @return {Highcharts.SVGElement} Returns the SVGElement for chaining.
 */
function setTextPath(path, textPathOptions) {
    var _this = this;
    var url = this.renderer.url,
        textWrapper = this.text || this,
        textPath = textWrapper.textPath,
        _a = (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(
        // Defaults
        {
            enabled: true,
            attributes: {
                dy: -5,
                startOffset: '50%',
                textAnchor: 'middle'
            }
        },
        textPathOptions),
        attributes = _a.attributes,
        enabled = _a.enabled;
    path = path || (textPath && textPath.path);
    // Remove previously added event
    textPath === null || textPath === void 0 ? void 0 : textPath.undo();
    if (path && enabled) {
        var undo = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(textWrapper, 'afterModifyTree',
            function (e) {
                if (path && enabled) {
                    // Set ID for the path
                    var textPathId = path.attr('id');
                if (!textPathId) {
                    path.attr('id', textPathId = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.uniqueKey)());
                }
                // Set attributes for the <text>
                var textAttribs = {
                        // `dx`/`dy` options must by set on <text> (parent), the
                        // rest should be set on <textPath>
                        x: 0,
                        y: 0
                    };
                if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(attributes.dx)) {
                    textAttribs.dx = attributes.dx;
                    delete attributes.dx;
                }
                if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(attributes.dy)) {
                    textAttribs.dy = attributes.dy;
                    delete attributes.dy;
                }
                textWrapper.attr(textAttribs);
                // Handle label properties
                _this.attr({ transform: '' });
                if (_this.box) {
                    _this.box = _this.box.destroy();
                }
                // Wrap the nodes in a textPath
                var children = e.nodes.slice(0);
                e.nodes.length = 0;
                e.nodes[0] = {
                    tagName: 'textPath',
                    attributes: (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(attributes, {
                        'text-anchor': attributes.textAnchor,
                        href: "" + url + "#".concat(textPathId)
                    }),
                    children: children
                };
            }
        });
        // Set the reference
        textWrapper.textPath = { path: path, undo: undo };
    }
    else {
        textWrapper.attr({ dx: 0, dy: 0 });
        delete textWrapper.textPath;
    }
    if (this.added) {
        // Rebuild text after added
        textWrapper.textCache = '';
        this.renderer.buildText(textWrapper);
    }
    return this;
}
/**
 * Attach a polygon to a bounding box if the element contains a textPath.
 *
 * @internal
 * @function Highcharts.SVGElement#setPolygon
 *
 * @param {any} event
 *        An event containing a bounding box object
 *
 * @return {Highcharts.BBoxObject} Returns the bounding box object.
 */
function setPolygon(event) {
    var _a;
    var bBox = event.bBox,
        tp = (_a = this.element) === null || _a === void 0 ? void 0 : _a.querySelector('textPath');
    if (tp) {
        var polygon = [], _b = this.renderer.fontMetrics(this.element), b_1 = _b.b, h = _b.h, descender_1 = h - b_1, lineCleanerRegex = new RegExp('(<tspan>|' +
                '<tspan(?!\\sclass="highcharts-br")[^>]*>|' +
                '<\\/tspan>)', 'g'), lines = tp
                .innerHTML
                .replace(lineCleanerRegex, '')
                .split(/<tspan class="highcharts-br"[^>]*>/), numOfLines = lines.length;
        // Calculate top and bottom coordinates for
        // either the start or the end of a single
        // character, and append it to the polygon.
        var appendTopAndBottom = function (charIndex,
            positionOfChar) {
                var x = positionOfChar.x,
            y = positionOfChar.y,
            rotation = (tp.getRotationOfChar(charIndex) - 90) * TextPath_deg2rad,
            cosRot = Math.cos(rotation),
            sinRot = Math.sin(rotation);
            return [
                [
                    x - descender_1 * cosRot,
                    y - descender_1 * sinRot
                ],
                [
                    x + b_1 * cosRot,
                    y + b_1 * sinRot
                ]
            ];
        };
        for (var i = 0, lineIndex = 0; lineIndex < numOfLines; lineIndex++) {
            var line = lines[lineIndex],
                lineLen = line.length;
            for (var lineCharIndex = 0; lineCharIndex < lineLen; lineCharIndex += 5) {
                try {
                    var srcCharIndex = (i +
                            lineCharIndex +
                            lineIndex),
                        _c = appendTopAndBottom(srcCharIndex,
                        tp.getStartPositionOfChar(srcCharIndex)),
                        lower = _c[0],
                        upper = _c[1];
                    if (lineCharIndex === 0) {
                        polygon.push(upper);
                        polygon.push(lower);
                    }
                    else {
                        if (lineIndex === 0) {
                            polygon.unshift(upper);
                        }
                        if (lineIndex === numOfLines - 1) {
                            polygon.push(lower);
                        }
                    }
                }
                catch (_d) {
                    // Safari fails on getStartPositionOfChar even if the
                    // character is within the `textContent.length`
                    break;
                }
            }
            i += lineLen - 1;
            try {
                var srcCharIndex = i + lineIndex,
                    charPos = tp.getEndPositionOfChar(srcCharIndex),
                    _e = appendTopAndBottom(srcCharIndex,
                    charPos),
                    lower = _e[0],
                    upper = _e[1];
                polygon.unshift(upper);
                polygon.unshift(lower);
            }
            catch (_f) {
                // Safari fails on getStartPositionOfChar even if the character
                // is within the `textContent.length`
                break;
            }
        }
        // Close it
        if (polygon.length) {
            polygon.push(polygon[0].slice());
        }
        bBox.polygon = polygon;
    }
    return bBox;
}
/**
 * Draw text along a textPath for a dataLabel.
 *
 * @internal
 * @function Highcharts.SVGElement#drawTextPath
 *
 * @param {any} event
 *        An event containing label options
 *
 * @return {void}
 */
function drawTextPath(event) {
    var _a;
    var labelOptions = event.labelOptions,
        point = event.point,
        textPathOptions = (labelOptions[point.formatPrefix + 'TextPath'] ||
            labelOptions.textPath);
    if (textPathOptions && !labelOptions.useHTML) {
        this.setTextPath(((_a = point.getDataLabelPath) === null || _a === void 0 ? void 0 : _a.call(point, this)) || point.graphic, textPathOptions);
        if (point.dataLabelPath &&
            !textPathOptions.enabled) {
            // Clean the DOM
            point.dataLabelPath = point.dataLabelPath.destroy();
        }
    }
}
/** @internal */
function composeTextPath(SVGElementClass) {
    var _a;
    if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pushUnique)(TextPath_composed, 'TextPath')) {
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(SVGElementClass, 'afterGetBBox', setPolygon);
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(SVGElementClass, 'beforeAddingDataLabel', drawTextPath);
        SVGElementClass.prototype.setTextPath =
            (_a = SVGElementClass.prototype.setTextPath) !== null && _a !== void 0 ? _a : setTextPath;
    }
}
/* *
 *
 *  API Declarations
 *
 * */
/**
 * Options for a label text which should follow marker's shape.
 * Border and background are disabled for a label that follows a
 * path.
 *
 * **Note:** Only SVG-based renderer supports this option. Setting
 * `useHTML` to true will disable this option.
 *
 * Text path support is not bundled into `highcharts.js`, and requires the
 * `modules/textpath.js` file. However, it is included in the script files of
 * those series types that use it by default.
 *
 * @declare   Highcharts.DataLabelsTextPathOptionsObject
 * @since     7.1.0
 * @apioption plotOptions.series.dataLabels.textPath
 */
/**
 * Presentation attributes for the text path.
 *
 * @type      {Highcharts.SVGAttributes}
 * @since     7.1.0
 * @default   { dy:-5, startOffset:'50%', textAnchor:'middle' }
 * @apioption plotOptions.series.dataLabels.textPath.attributes
 */
/**
 * Enable or disable `textPath` option for link's or marker's data
 * labels.
 *
 * @type      {boolean}
 * @since     7.1.0
 * @default   true
 * @apioption plotOptions.series.dataLabels.textPath.enabled
 */
(''); // Keep doclets above in transpiled file

;// ./code/es5/es-modules/Series/Sunburst/SunburstSeries.js
/* *
 *
 *  This module implements sunburst charts in Highcharts.
 *
 *  (c) 2016-2026 Highsoft AS
 *
 *  Authors: Jon Arild Nygård
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

var SunburstSeries_extends = (undefined && undefined.__extends) || (function () {
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
var SunburstSeries_assign = (undefined && undefined.__assign) || function () {
    SunburstSeries_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return SunburstSeries_assign.apply(this, arguments);
};

var getCenter = Series_CenteredUtilities.getCenter, getStartAndEndRadians = Series_CenteredUtilities.getStartAndEndRadians;

var SunburstSeries_noop = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).noop;

var SunburstSeries_a = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes, SunburstSeries_ColumnSeries = SunburstSeries_a.column, SunburstSeries_TreemapSeries = SunburstSeries_a.treemap;



var SunburstSeries_getColor = Series_TreeUtilities.getColor, SunburstSeries_getLevelOptions = Series_TreeUtilities.getLevelOptions, SunburstSeries_setTreeValues = Series_TreeUtilities.setTreeValues, SunburstSeries_updateRootId = Series_TreeUtilities.updateRootId;






composeTextPath((highcharts_SVGElement_commonjs_highcharts_SVGElement_commonjs2_highcharts_SVGElement_root_Highcharts_SVGElement_default()));
/* *
 *
 *  Constants
 *
 * */
var rad2deg = 180 / Math.PI;
/* *
 *
 *  Functions
 *
 * */
/** @private */
function isBoolean(x) {
    return typeof x === 'boolean';
}
/**
 * Find a set of coordinates given a start coordinates, an angle, and a
 * distance.
 *
 * @private
 * @function getEndPoint
 *
 * @param {number} x
 *        Start coordinate x
 *
 * @param {number} y
 *        Start coordinate y
 *
 * @param {number} angle
 *        Angle in radians
 *
 * @param {number} distance
 *        Distance from start to end coordinates
 *
 * @return {Highcharts.SVGAttributes}
 *         Returns the end coordinates, x and y.
 */
var getEndPoint = function getEndPoint(x, y, angle, distance) {
    return {
        x: x + (Math.cos(angle) * distance),
        y: y + (Math.sin(angle) * distance)
    };
};
/** @private */
function getDlOptions(params) {
    var _a,
        _b,
        _c;
    // Set options to new object to avoid problems with scope
    var point = params.point,
        shape = (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(params.shapeArgs) ? params.shapeArgs : {},
        _d = shape.end,
        end = _d === void 0 ? 0 : _d,
        _e = shape.radius,
        radius = _e === void 0 ? 0 : _e,
        _f = shape.start,
        start = _f === void 0 ? 0 : _f,
        optionsPoint = ((0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(params.optionsPoint) ?
            params.optionsPoint.dataLabels :
            {}), 
        // The splat was used because levels dataLabels
        // options doesn't work as an array
        optionsLevel = (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.splat)((0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(params.level) ?
            params.level.dataLabels :
            {})[0],
        options = (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(optionsLevel,
        optionsPoint),
        style = options.style = options.style || {},
        padding = (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.splat)(options.padding || 0),
        paddingLeft = padding[3 % padding.length],
        paddingRight = padding[1 % padding.length],
        _g = point.innerArcLength,
        innerArcLength = _g === void 0 ? 0 : _g,
        _h = point.outerArcLength,
        outerArcLength = _h === void 0 ? 0 : _h;
    var rotationRad,
        rotation,
        rotationMode = options.rotationMode,
        width = (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(style.width) ?
            parseInt(style.width || '0', 10) : void 0;
    if (!(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(options.rotation)) {
        if (rotationMode === 'auto' || rotationMode === 'circular') {
            if (options.useHTML &&
                rotationMode === 'circular') {
                // Change rotationMode to 'auto' to avoid using text paths
                // for HTML labels, see #18953
                rotationMode = 'auto';
            }
            if (innerArcLength < 1 && outerArcLength > radius) {
                rotationRad = 0;
                // Trigger setTextPath function to get textOutline etc.
                if (point.dataLabelPath && rotationMode === 'circular') {
                    options.textPath = {
                        enabled: true
                    };
                }
                // If the slice is less than 180 degrees, set a reasonable width
                // for fitting into the open slice (#22532)
                if (end - start < Math.PI) {
                    width = radius * 0.7;
                }
            }
            else if (innerArcLength > 1 && outerArcLength > 1.5 * radius) {
                if (rotationMode === 'circular') {
                    options.textPath = {
                        enabled: true,
                        attributes: {
                            dy: 5
                        }
                    };
                }
                else {
                    rotationMode = 'parallel';
                }
            }
            else {
                // Trigger the destroyTextPath function
                if (((_a = point.dataLabel) === null || _a === void 0 ? void 0 : _a.textPath) &&
                    rotationMode === 'circular') {
                    options.textPath = {
                        enabled: false
                    };
                }
                rotationMode = 'perpendicular';
            }
        }
        if (rotationMode !== 'auto' && rotationMode !== 'circular') {
            if ((_b = point.dataLabel) === null || _b === void 0 ? void 0 : _b.textPath) {
                options.textPath = {
                    enabled: false
                };
            }
            rotationRad = end - (end - start) / 2;
        }
        if (rotationMode === 'parallel') {
            width = Math.min(radius * 2.5, (outerArcLength + innerArcLength) / 2);
        }
        else {
            if (!(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(width) && radius) {
                width = point.node.level === 1 ? 2 * radius : radius;
            }
        }
        if (rotationMode === 'perpendicular') {
            // 16 is the inferred line height. We don't know the real line
            // yet because the label is not rendered. A better approach for this
            // would be to hide the label from the `alignDataLabel` function
            // when the actual line height is known.
            var h = 16;
            if (outerArcLength < h) {
                width = 1;
            }
            else if (shape.radius) {
                style.lineClamp = Math.floor(innerArcLength / h) || 1;
                // When the slice is narrow (< 16px) in the inner end, compute a
                // safe margin to avoid the label overlapping the border
                // (#22532)
                var safeMargin = innerArcLength < h ?
                        radius * ((h - innerArcLength) /
                            (outerArcLength - innerArcLength)) :
                        0;
                width = radius - safeMargin;
            }
        }
        // Apply padding (#8515)
        width = Math.max((width || 0) - paddingLeft - paddingRight, 1);
        rotation = ((rotationRad || 0) * rad2deg) % 180;
        if (rotationMode === 'parallel') {
            rotation -= 90;
        }
        // Prevent text from rotating upside down
        if (rotation > 90) {
            rotation -= 180;
        }
        else if (rotation < -90) {
            rotation += 180;
        }
        options.rotation = rotation;
    }
    if (options.textPath) {
        if (point.shapeExisting.innerR === 0 &&
            options.textPath.enabled) {
            // Enable rotation to render text
            options.rotation = 0;
            // Center dataLabel - disable textPath
            options.textPath.enabled = false;
            // Setting width and padding
            width = Math.max((point.shapeExisting.r * 2) - paddingLeft - paddingRight, 1);
        }
        else if (((_c = point.dlOptions) === null || _c === void 0 ? void 0 : _c.textPath) &&
            !point.dlOptions.textPath.enabled &&
            rotationMode === 'circular') {
            // Bring dataLabel back if was a center dataLabel
            options.textPath.enabled = true;
        }
        if (options.textPath.enabled) {
            // Enable rotation to render text
            options.rotation = 0;
            // Setting width and padding
            width = Math.max((outerArcLength + innerArcLength) / 2 -
                paddingLeft - paddingRight, 1);
            style.whiteSpace = 'nowrap';
        }
    }
    style.width = width + 'px';
    return options;
}
/** @private */
function getAnimation(shape, params) {
    var point = params.point,
        radians = params.radians,
        innerR = params.innerR,
        idRoot = params.idRoot,
        idPreviousRoot = params.idPreviousRoot,
        shapeExisting = params.shapeExisting,
        shapeRoot = params.shapeRoot,
        shapePreviousRoot = params.shapePreviousRoot,
        visible = params.visible;
    var from = {},
        to = {
            end: shape.end,
            start: shape.start,
            innerR: shape.innerR,
            r: shape.r,
            x: shape.x,
            y: shape.y
        };
    if (visible) {
        // Animate points in
        if (!point.graphic && shapePreviousRoot) {
            if (idRoot === point.id) {
                from = {
                    start: radians.start,
                    end: radians.end
                };
            }
            else {
                from = (shapePreviousRoot.end <= shape.start) ? {
                    start: radians.end,
                    end: radians.end
                } : {
                    start: radians.start,
                    end: radians.start
                };
            }
            // Animate from center and outwards.
            from.innerR = from.r = innerR;
        }
    }
    else {
        // Animate points out
        if (point.graphic) {
            if (idPreviousRoot === point.id) {
                to = {
                    innerR: innerR,
                    r: innerR
                };
            }
            else if (shapeRoot) {
                to = (shapeRoot.end <= shapeExisting.start) ?
                    {
                        innerR: innerR,
                        r: innerR,
                        start: radians.end,
                        end: radians.end
                    } : {
                    innerR: innerR,
                    r: innerR,
                    start: radians.start,
                    end: radians.start
                };
            }
        }
    }
    return {
        from: from,
        to: to
    };
}
/** @private */
function getDrillId(point, idRoot, mapIdToNode) {
    var node = point.node;
    var drillId,
        nodeRoot;
    if (!node.isLeaf) {
        // When it is the root node, the drillId should be set to parent.
        if (idRoot === point.id) {
            nodeRoot = mapIdToNode[idRoot];
            drillId = nodeRoot.parent;
        }
        else {
            drillId = point.id;
        }
    }
    return drillId;
}
/** @private */
function cbSetTreeValuesBefore(node, options) {
    var mapIdToNode = options.mapIdToNode,
        parent = node.parent,
        nodeParent = parent ? mapIdToNode[parent] : void 0,
        series = options.series,
        chart = series.chart,
        points = series.points,
        point = points[node.i],
        colors = series.options.colors || chart && chart.options.colors,
        colorInfo = SunburstSeries_getColor(node, {
            colors: colors,
            colorIndex: series.colorIndex,
            index: options.index,
            mapOptionsToLevel: options.mapOptionsToLevel,
            parentColor: nodeParent && nodeParent.color,
            parentColorIndex: nodeParent && nodeParent.colorIndex,
            series: options.series,
            siblings: options.siblings
        });
    node.color = colorInfo.color;
    node.colorIndex = colorInfo.colorIndex;
    if (point) {
        point.color = node.color;
        point.colorIndex = node.colorIndex;
        // Set slicing on node, but avoid slicing the top node.
        node.sliced = (node.id !== options.idRoot) ? point.sliced : false;
    }
    return node;
}
/* *
 *
 *  Class
 *
 * */
var SunburstSeries = /** @class */ (function (_super) {
    SunburstSeries_extends(SunburstSeries, _super);
    function SunburstSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Functions
     *
     * */
    SunburstSeries.prototype.alignDataLabel = function (point, dataLabel, labelOptions) {
        if (labelOptions.textPath && labelOptions.textPath.enabled) {
            return;
        }
        // In sunburst dataLabel may be placed, but this should be reset to
        // make sure the dataLabel can be aligned to a new position (#21913)
        dataLabel.placed = false;
        return _super.prototype.alignDataLabel.apply(this, arguments);
    };
    /**
     * Animate the slices in. Similar to the animation of polar charts.
     * @private
     */
    SunburstSeries.prototype.animate = function (init) {
        var chart = this.chart,
            center = [
                chart.plotWidth / 2,
                chart.plotHeight / 2
            ],
            plotLeft = chart.plotLeft,
            plotTop = chart.plotTop,
            group = this.group;
        var attribs;
        // Initialize the animation
        if (init) {
            // Scale down the group and place it in the center
            attribs = {
                translateX: center[0] + plotLeft,
                translateY: center[1] + plotTop,
                scaleX: 0.001, // #1499
                scaleY: 0.001,
                rotation: 10,
                opacity: 0.01
            };
            group.attr(attribs);
            // Run the animation
        }
        else {
            attribs = {
                translateX: plotLeft,
                translateY: plotTop,
                scaleX: 1,
                scaleY: 1,
                rotation: 0,
                opacity: 1
            };
            group.animate(attribs, this.options.animation);
        }
    };
    SunburstSeries.prototype.drawPoints = function () {
        var series = this,
            mapOptionsToLevel = series.mapOptionsToLevel,
            shapeRoot = series.shapeRoot,
            group = series.group,
            hasRendered = series.hasRendered,
            idRoot = series.rootNode,
            idPreviousRoot = series.idPreviousRoot,
            nodeMap = series.nodeMap,
            nodePreviousRoot = nodeMap[idPreviousRoot],
            shapePreviousRoot = nodePreviousRoot && nodePreviousRoot.shapeArgs,
            points = series.points,
            radians = series.startAndEndRadians,
            chart = series.chart,
            optionsChart = chart && chart.options && chart.options.chart || {},
            animation = (isBoolean(optionsChart.animation) ?
                optionsChart.animation :
                true),
            positions = series.center,
            center = {
                x: positions[0],
                y: positions[1]
            },
            innerR = positions[3] / 2,
            renderer = series.chart.renderer,
            hackDataLabelAnimation = !!(animation &&
                hasRendered &&
                idRoot !== idPreviousRoot &&
                series.dataLabelsGroup);
        var animateLabels,
            animateLabelsCalled = false,
            addedHack = false;
        if (hackDataLabelAnimation) {
            series.dataLabelsGroup.attr({ opacity: 0 });
            animateLabels = function () {
                animateLabelsCalled = true;
                series.dataLabelsGroup.animate({
                    opacity: 1,
                    visibility: 'inherit'
                });
            };
        }
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point = points_1[_i];
            var node = point.node,
                level = mapOptionsToLevel[node.level],
                shapeExisting = (point.shapeExisting || {}),
                shape = node.shapeArgs || {},
                visible = !!(node.visible && node.shapeArgs);
            var animationInfo = void 0,
                onComplete = void 0;
            // Border radius requires the border-radius.js module. Adding it
            // here because the SunburstSeries is a mess and I can't find the
            // regular shapeArgs. Usually shapeArgs are created in the series'
            // `translate` function and then passed directly on to the renderer
            // in the `drawPoints` function.
            shape.borderRadius = series.options.borderRadius;
            if (hasRendered && animation) {
                animationInfo = getAnimation(shape, {
                    center: center,
                    point: point,
                    radians: radians,
                    innerR: innerR,
                    idRoot: idRoot,
                    idPreviousRoot: idPreviousRoot,
                    shapeExisting: shapeExisting,
                    shapeRoot: shapeRoot,
                    shapePreviousRoot: shapePreviousRoot,
                    visible: visible
                });
            }
            else {
                // When animation is disabled, attr is called from animation.
                animationInfo = {
                    to: shape,
                    from: {}
                };
            }
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(point, {
                shapeExisting: shape, // Store for use in animation
                tooltipPos: [shape.plotX, shape.plotY],
                drillId: getDrillId(point, idRoot, nodeMap),
                name: '' + (point.name || point.id || point.index),
                plotX: shape.plotX, // Used for data label position
                plotY: shape.plotY, // Used for data label position
                value: node.val,
                isInside: visible,
                isNull: !visible // Used for dataLabels & point.draw
            });
            point.dlOptions = SunburstSeries_assign(SunburstSeries_assign({}, getDlOptions({
                point: point,
                level: level,
                optionsPoint: point.options,
                shapeArgs: shape
            })), { zIndex: void 0 });
            // Delete so it doesn't override anything on merge.
            delete point.dlOptions.zIndex;
            if (!addedHack && visible) {
                addedHack = true;
                onComplete = animateLabels;
            }
            point.draw({
                animatableAttribs: animationInfo.to,
                attribs: (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(animationInfo.from, (!chart.styledMode && series.pointAttribs(point, (point.selected && 'select')))),
                onComplete: onComplete,
                group: group,
                renderer: renderer,
                shapeType: 'arc',
                shapeArgs: shape
            });
        }
        // Draw data labels after points
        // TODO draw labels one by one to avoid additional looping
        if (hackDataLabelAnimation && addedHack) {
            series.hasRendered = false;
            series.options.dataLabels.defer = true;
            SunburstSeries_ColumnSeries.prototype.drawDataLabels.call(series);
            series.hasRendered = true;
            // If animateLabels is called before labels were hidden, then call
            // it again.
            if (animateLabelsCalled) {
                animateLabels === null || animateLabels === void 0 ? void 0 : animateLabels();
            }
        }
        else {
            SunburstSeries_ColumnSeries.prototype.drawDataLabels.call(series);
        }
        series.idPreviousRoot = idRoot;
    };
    /**
     * The layout algorithm for the levels.
     * @private
     */
    SunburstSeries.prototype.layoutAlgorithm = function (parent, children, options) {
        var startAngle = parent.start;
        var range = parent.end - startAngle,
            total = parent.val,
            x = parent.x,
            y = parent.y,
            radius = ((options &&
                (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(options.levelSize) &&
                (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(options.levelSize.value)) ?
                options.levelSize.value :
                0),
            innerRadius = parent.r,
            outerRadius = innerRadius + radius,
            slicedOffset = options && (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(options.slicedOffset) ?
                options.slicedOffset :
                0;
        return (children || []).reduce(function (arr, child) {
            var percentage = (1 / total) * child.val, radians = percentage * range, radiansCenter = startAngle + (radians / 2), offsetPosition = getEndPoint(x, y, radiansCenter, slicedOffset), values = {
                    x: child.sliced ? offsetPosition.x : x,
                    y: child.sliced ? offsetPosition.y : y,
                    innerR: innerRadius,
                    r: outerRadius,
                    radius: radius,
                    start: startAngle,
                    end: startAngle + radians
                };
            arr.push(values);
            startAngle = values.end;
            return arr;
        }, []);
    };
    SunburstSeries.prototype.setRootNode = function (id, redraw, eventArguments) {
        var series = this;
        if ( // If the target node is the only one at level 1, skip it. (#18658)
        series.nodeMap[id].level === 1 &&
            series.nodeList
                .filter(function (node) { return node.level === 1; })
                .length === 1) {
            if (series.idPreviousRoot === '') {
                return;
            }
            id = '';
        }
        _super.prototype.setRootNode.call(this, id, redraw, eventArguments);
    };
    /**
     * Set the shape arguments on the nodes. Recursive from root down.
     * @private
     */
    SunburstSeries.prototype.setShapeArgs = function (parent, parentValues, mapOptionsToLevel) {
        var level = parent.level + 1,
            options = mapOptionsToLevel[level], 
            // Collect all children which should be included
            children = parent.children.filter(function (n) {
                return n.visible;
        }), twoPi = 6.28; // Two times Pi.
        var childrenValues = [];
        childrenValues = this.layoutAlgorithm(parentValues, children, options);
        var i = -1;
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            var values = childrenValues[++i], angle = values.start + ((values.end - values.start) / 2), radius = values.innerR + ((values.r - values.innerR) / 2), radians = (values.end - values.start), isCircle = (values.innerR === 0 && radians > twoPi), center = (isCircle ?
                    { x: values.x, y: values.y } :
                    getEndPoint(values.x, values.y, angle, radius)), val = (child.val ?
                    (child.childrenTotal > child.val ?
                        child.childrenTotal :
                        child.val) :
                    child.childrenTotal);
            // The inner arc length is a convenience for data label filters.
            if (this.points[child.i]) {
                this.points[child.i].innerArcLength = radians * values.innerR;
                this.points[child.i].outerArcLength = radians * values.r;
            }
            child.shapeArgs = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(values, {
                plotX: center.x,
                plotY: center.y
            });
            child.values = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(values, {
                val: val
            });
            // If node has children, then call method recursively
            if (child.children.length) {
                this.setShapeArgs(child, child.values, mapOptionsToLevel);
            }
        }
    };
    SunburstSeries.prototype.translate = function () {
        var series = this, options = series.options, positions = series.center = series.getCenter(), radians = series.startAndEndRadians = getStartAndEndRadians(options.startAngle, options.endAngle), innerRadius = positions[3] / 2, outerRadius = positions[2] / 2, diffRadius = outerRadius - innerRadius, 
            // NOTE: updateRootId modifies series.
            rootId = SunburstSeries_updateRootId(series);
        var mapIdToNode = series.nodeMap,
            mapOptionsToLevel,
            nodeRoot = mapIdToNode && mapIdToNode[rootId],
            nodeIds = {};
        series.shapeRoot = nodeRoot && nodeRoot.shapeArgs;
        series.generatePoints();
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(series, 'afterTranslate');
        // @todo Only if series.isDirtyData is true
        var tree = series.tree = series.getTree();
        // Render traverseUpButton, after series.nodeMap i calculated.
        mapIdToNode = series.nodeMap;
        nodeRoot = mapIdToNode[rootId];
        var idTop = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isString)(nodeRoot.parent) ? nodeRoot.parent : '',
            nodeTop = mapIdToNode[idTop],
            _a = Sunburst_SunburstUtilities.getLevelFromAndTo(nodeRoot),
            from = _a.from,
            to = _a.to;
        mapOptionsToLevel = SunburstSeries_getLevelOptions({
            from: from,
            levels: series.options.levels,
            to: to,
            defaults: {
                colorByPoint: options.colorByPoint,
                dataLabels: options.dataLabels,
                levelIsConstant: options.levelIsConstant,
                levelSize: options.levelSize,
                slicedOffset: options.slicedOffset
            }
        });
        // NOTE consider doing calculateLevelSizes in a callback to
        // getLevelOptions
        mapOptionsToLevel = Sunburst_SunburstUtilities.calculateLevelSizes(mapOptionsToLevel, {
            diffRadius: diffRadius,
            from: from,
            to: to
        });
        // TODO Try to combine setTreeValues & setColorRecursive to avoid
        //  unnecessary looping.
        SunburstSeries_setTreeValues(tree, {
            before: cbSetTreeValuesBefore,
            idRoot: rootId,
            levelIsConstant: options.levelIsConstant,
            mapOptionsToLevel: mapOptionsToLevel,
            mapIdToNode: mapIdToNode,
            points: series.points,
            series: series
        });
        var values = mapIdToNode[''].shapeArgs = {
                end: radians.end,
                r: innerRadius,
                start: radians.start,
                val: nodeRoot.val,
                x: positions[0],
                y: positions[1]
            };
        this.setShapeArgs(nodeTop, values, mapOptionsToLevel);
        // Set mapOptionsToLevel on series for use in drawPoints.
        series.mapOptionsToLevel = mapOptionsToLevel;
        // #10669 - verify if all nodes have unique ids
        for (var _i = 0, _b = series.points; _i < _b.length; _i++) {
            var point = _b[_i];
            if (nodeIds[point.id]) {
                (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.error)(31, false, series.chart);
            }
            // Map
            nodeIds[point.id] = true;
        }
        // Reset object
        nodeIds = {};
    };
    /* *
     *
     *  Static Properties
     *
     * */
    SunburstSeries.defaultOptions = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(SunburstSeries_TreemapSeries.defaultOptions, Sunburst_SunburstSeriesDefaults);
    return SunburstSeries;
}(SunburstSeries_TreemapSeries));
(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(SunburstSeries.prototype, {
    axisTypes: [],
    drawDataLabels: SunburstSeries_noop, // `drawDataLabels` is called in `drawPoints`
    getCenter: getCenter,
    isCartesian: false,
    // Mark that the sunburst is supported by the series on point feature.
    onPointSupported: true,
    pointAttribs: SunburstSeries_ColumnSeries.prototype.pointAttribs,
    pointClass: Sunburst_SunburstPoint,
    NodeClass: Sunburst_SunburstNode,
    utils: Sunburst_SunburstUtilities
});
highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default().registerSeriesType('sunburst', SunburstSeries);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Sunburst_SunburstSeries = ((/* unused pure expression or super */ null && (SunburstSeries)));

;// ./code/es5/es-modules/masters/modules/sunburst.src.js






var G = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default());
G.Breadcrumbs = G.Breadcrumbs || Breadcrumbs_Breadcrumbs;
G.Breadcrumbs.compose(G.Chart, G.defaultOptions);
/* harmony default export */ var sunburst_src = ((highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()));

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});