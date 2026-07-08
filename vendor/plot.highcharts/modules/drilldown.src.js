// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v13.0.0 (2026-06-11)
 * @module highcharts/modules/drilldown
 * @requires highcharts
 *
 * Highcharts Drilldown module
 *
 * (c) 2009-2026 Highsoft AS
 *
 * Author: Torstein Hønsi
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 *
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(root["_Highcharts"], root["_Highcharts"]["Templating"]);
	else if(typeof define === 'function' && define.amd)
		define("highcharts/modules/drilldown", ["highcharts/highcharts"], function (amd1) {return factory(amd1,amd1["Templating"]);});
	else if(typeof exports === 'object')
		exports["highcharts/modules/drilldown"] = factory(root["_Highcharts"], root["_Highcharts"]["Templating"]);
	else
		root["Highcharts"] = factory(root["Highcharts"], root["Highcharts"]["Templating"]);
})(typeof window === 'undefined' ? this : window, function(__WEBPACK_EXTERNAL_MODULE__944__, __WEBPACK_EXTERNAL_MODULE__984__) {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
  "default": function() { return /* binding */ drilldown_src; }
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

;// ./code/es5/es-modules/Extensions/Drilldown/DrilldownDefaults.js
/* *
 *
 *  Highcharts Drilldown module
 *
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
 * Options for drill down, the concept of inspecting increasingly high
 * resolution data through clicking on chart items like columns or pie slices.
 *
 * @sample {highcharts} highcharts/series-organization/drilldown
 *         Organization chart drilldown
 *
 * @product      highcharts highmaps
 * @requires     modules/drilldown
 * @optionparent drilldown
 * @internal
 */
var DrilldownDefaults = {
    /**
     * When this option is false, clicking a single point will drill down
     * all points in the same category, equivalent to clicking the X axis
     * label.
     *
     * @sample {highcharts} highcharts/drilldown/allowpointdrilldown-false/
     *         Don't allow point drilldown
     *
     * @type      {boolean}
     * @default   true
     * @since     4.1.7
     * @product   highcharts
     * @apioption drilldown.allowPointDrilldown
     */
    /**
     * Options for the breadcrumbs, the navigation at the top leading the way
     * up through the drilldown levels.
     *
     * @since 10.0.0
     * @product   highcharts highmaps
     * @extends   navigation.breadcrumbs
     * @optionparent drilldown.breadcrumbs
     */
    /**
     * An array of series configurations for the drill down. Each series
     * configuration uses the same syntax as the [series](#series) option set.
     * These drilldown series are hidden by default. The drilldown series is
     * linked to the parent series' point by its `id`.
     *
     * @type      {Array<Highcharts.SeriesOptionsType>}
     * @since     3.0.8
     * @product   highcharts highmaps
     * @apioption drilldown.series
     */
    /**
     * Additional styles to apply to the X axis label for a point that
     * has drilldown data. By default it is underlined and blue to invite
     * to interaction.
     *
     * In styled mode, active label styles can be set with the
     * `.highcharts-drilldown-axis-label` class.
     *
     * @sample {highcharts} highcharts/drilldown/labels/
     *         Label styles
     *
     * @type    {Highcharts.CSSObject}
     * @default { "cursor": "pointer", "color": "#003399", "fontWeight": "bold", "textDecoration": "underline" }
     * @since   3.0.8
     * @product highcharts highmaps
     */
    activeAxisLabelStyle: {
        /** @ignore-option */
        cursor: 'pointer',
        /** @ignore-option */
        color: 'var(--highcharts-highlight-color-100)',
        /** @ignore-option */
        fontWeight: 'bold',
        /** @ignore-option */
        textDecoration: 'underline'
    },
    /**
     * Additional styles to apply to the data label of a point that has
     * drilldown data. By default it is underlined and blue to invite to
     * interaction.
     *
     * In styled mode, active data label styles can be applied with the
     * `.highcharts-drilldown-data-label` class.
     *
     * @sample {highcharts} highcharts/drilldown/labels/
     *         Label styles
     *
     * @type    {Highcharts.CSSObject}
     * @default { "cursor": "pointer", "color": "#003399", "fontWeight": "bold", "textDecoration": "underline" }
     * @since   3.0.8
     * @product highcharts highmaps
     */
    activeDataLabelStyle: {
        cursor: 'pointer',
        color: 'var(--highcharts-highlight-color-100)',
        fontWeight: 'bold',
        textDecoration: 'underline'
    },
    /**
     * Set the animation for all drilldown animations. Animation of a drilldown
     * occurs when drilling between a column point and a column series, or a pie
     * slice and a full pie series. Drilldown can still be used between series
     * and points of different types, but animation will not occur.
     *
     * The animation can either be set as a boolean or a configuration object.
     * If `true`, it will use a duration of 500 ms. If used as a configuration
     * object, the following properties are supported:
     *
     * - `duration`: The duration of the animation in milliseconds.
     *
     * - `easing`: A string reference to an easing function set on the `Math`
     *   object. See [the easing
     *   demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-animation-easing/).
     *
     * @type    {boolean|Highcharts.AnimationOptionsObject}
     * @since   3.0.8
     * @product highcharts highmaps
     */
    animation: {
        /** @ignore-option */
        duration: 500
    },
    /**
     * Drill up button is deprecated since Highcharts v9.3.2. Use
     * [drilldown.breadcrumbs](#drilldown.breadcrumbs) instead.
     *
     * Options for the drill up button that appears when drilling down on a
     * series. The text for the button is defined in
     * [lang.drillUpText](#lang.drillUpText).
     *
     * @sample highcharts/breadcrumbs/single-button
     *         Breadcrumbs set up like a legacy button
     * @sample {highcharts} highcharts/drilldown/drillupbutton/ Drill up button
     * @sample {highmaps} highcharts/drilldown/drillupbutton/ Drill up button
     *
     * @since   3.0.8
     * @product highcharts highmaps
     *
     * @deprecated 9.3.2
     */
    drillUpButton: {
        /**
         * What box to align the button to. Can be either `plotBox` or
         * `spacingBox`.
         *
         * @type       {Highcharts.ButtonRelativeToValue}
         * @default    plotBox
         * @since      3.0.8
         * @deprecated 9.3.2
         * @product    highcharts highmaps
         * @apioption  drilldown.drillUpButton.relativeTo
         */
        /**
         * A collection of attributes for the button. The object takes SVG
         * attributes like `fill`, `stroke`, `stroke-width` or `r`, the border
         * radius. The theme also supports `style`, a collection of CSS
         * properties for the text. Equivalent attributes for the hover state
         * are given in `theme.states.hover`.
         *
         * In styled mode, drill-up button styles can be applied with the
         * `.highcharts-drillup-button` class.
         *
         * @sample {highcharts} highcharts/drilldown/drillupbutton/
         *         Button theming
         * @sample {highmaps} highcharts/drilldown/drillupbutton/
         *         Button theming
         *
         * @type      {Object}
         * @since     3.0.8
         * @deprecated 9.3.2
         * @product   highcharts highmaps
         * @apioption drilldown.drillUpButton.theme
         */
        /**
         * Positioning options for the button within the `relativeTo` box.
         * Available properties are `x`, `y`, `align` and `verticalAlign`.
         *
         * @type    {Highcharts.AlignObject}
         * @since   3.0.8
         * @deprecated 9.3.2
         * @product highcharts highmaps
         */
        position: {
            /**
             * Vertical alignment of the button.
             *
             * @type      {Highcharts.VerticalAlignValue}
             * @deprecated 9.3.2
             * @default   top
             * @product   highcharts highmaps
             * @apioption drilldown.drillUpButton.position.verticalAlign
             */
            /**
             * Horizontal alignment.
             *
             * @type {Highcharts.AlignValue}
             * @deprecated 9.3.2
             */
            align: 'right',
            /**
             * The X offset of the button.
             *
             * @deprecated 9.3.2
             */
            x: -10,
            /**
             * The Y offset of the button.
             *
             * @deprecated 9.3.2
             */
            y: 10
        }
    },
    /**
     * Enable or disable zooming into a region of clicked map point you want to
     * drill into. If mapZooming is set to false the drilldown/drillup
     * animations only fade in/fade out without zooming to a specific map point.
     *
     * @sample    maps/demo/map-drilldown-preloaded/
     *            Map drilldown without async maps loading
     *
     * @type      {boolean}
     * @default   true
     * @since 11.0.0
     * @product   highmaps
     * @apioption drilldown.mapZooming
     */
    mapZooming: true
};
/**
 * Fires when a drilldown point is clicked, before the new series is added. This
 * event is also utilized for async drilldown, where the seriesOptions are not
 * added by option, but rather loaded async. Note that when clicking a category
 * label to trigger multiple series drilldown, one `drilldown` event is
 * triggered per point in the category.
 *
 * Event arguments:
 *
 * - `category`: If a category label was clicked, which index.
 *
 * - `originalEvent`: The original browser event (usually click) that triggered
 *   the drilldown.
 *
 * - `point`: The originating point.
 *
 * - `points`: If a category label was clicked, this array holds all points
 *   corresponding to the category.
 *
 * - `seriesOptions`: Options for the new series.
 *
 * @sample {highcharts} highcharts/drilldown/async/
 *         Async drilldown
 *
 * @type      {Highcharts.DrilldownCallbackFunction}
 * @since     3.0.8
 * @product   highcharts highmaps
 * @context   Highcharts.Chart
 * @requires  modules/drilldown
 * @apioption chart.events.drilldown
 */
/**
 * Fires when drilling up from a drilldown series.
 *
 * @type      {Highcharts.DrillupCallbackFunction}
 * @since     3.0.8
 * @product   highcharts highmaps
 * @context   Highcharts.Chart
 * @requires  modules/drilldown
 * @apioption chart.events.drillup
 */
/**
 * In a chart with multiple drilldown series, this event fires after all the
 * series have been drilled up.
 *
 * @type      {Highcharts.DrillupAllCallbackFunction}
 * @since     4.2.4
 * @product   highcharts highmaps
 * @context   Highcharts.Chart
 * @requires  modules/drilldown
 * @apioption chart.events.drillupall
 */
/**
 * The `id` of a series in the [drilldown.series](#drilldown.series) array to
 * use for a drilldown for this point.
 *
 * @sample {highcharts} highcharts/drilldown/basic/
 *         Basic drilldown
 *
 * @type      {string}
 * @since     3.0.8
 * @product   highcharts
 * @requires  modules/drilldown
 * @apioption series.line.data.drilldown
 */
/**
 * Drill up button is deprecated since Highcharts v9.3.2. Use
 * [drilldown.breadcrumbs](#drilldown.breadcrumbs) instead.
 *
 * The text for the button that appears when drilling down, linking back
 * to the parent series. The parent series' name is inserted for
 * `{series.name}`.
 *
 * @deprecated 9.3.2
 * @since    3.0.8
 * @product  highcharts highmaps
 * @requires modules/drilldown
 * @apioption lang.drillUpText
 */
''; // Keep doclets above detached in JS file
/* *
 *
 *  Default Export
 *
 * */
/** @internal */
/* harmony default export */ var Drilldown_DrilldownDefaults = (DrilldownDefaults);

;// ./code/es5/es-modules/Extensions/Drilldown/DrilldownSeries.js
/* *
 *
 *  Highcharts Drilldown module
 *
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */


var animObject = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).animObject;

/* *
 *
 *  Functions
 *
 * */
/** @internal */
function applyCursorCSS(element, cursor, addClass, styledMode) {
    element[addClass ? 'addClass' : 'removeClass']('highcharts-drilldown-point');
    if (!styledMode) {
        element.css({ cursor: cursor });
    }
}
/** @internal */
function columnAnimateDrilldown(init) {
    var _a,
        _b;
    var series = this,
        chart = series.chart,
        drilldownLevels = chart.drilldownLevels,
        styledMode = chart.styledMode,
        animationOptions = animObject((_a = chart.options.drilldown) === null || _a === void 0 ? void 0 : _a.animation),
        _c = this,
        xAxis = _c.xAxis,
        yAxis = _c.yAxis;
    if (!init) {
        var animateFrom_1;
        drilldownLevels === null || drilldownLevels === void 0 ? void 0 : drilldownLevels.forEach(function (level) {
            var _a,
                _b;
            if (series.options._ddSeriesId ===
                level.lowerSeriesOptions._ddSeriesId) {
                animateFrom_1 = level.shapeArgs;
                if (animateFrom_1) {
                    // Adjust for changing axis positions
                    animateFrom_1.x = (animateFrom_1.x || 0) +
                        ((_a = level.plotLeft) !== null && _a !== void 0 ? _a : xAxis.pos) - xAxis.pos;
                    animateFrom_1.y = (animateFrom_1.y || 0) +
                        ((_b = level.plotTop) !== null && _b !== void 0 ? _b : yAxis.pos) - yAxis.pos;
                    if (!styledMode) {
                        // Add the point colors to animate from
                        animateFrom_1.fill = level.color;
                    }
                }
            }
        });
        series.points.forEach(function (point) {
            var _a;
            (_a = point.graphic) === null || _a === void 0 ? void 0 : _a.attr(animateFrom_1).animate((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(point.shapeArgs, { fill: point.color || series.color }), animationOptions);
        });
        (_b = this.dataLabelsGroups) === null || _b === void 0 ? void 0 : _b.forEach(function (g) { var _a; return (_a = chart.drilldown) === null || _a === void 0 ? void 0 : _a.fadeInGroup(g); });
        // Reset to prototype
        delete this.animate;
    }
}
/**
 * When drilling up, pull out the individual point graphics from the lower
 * series and animate them into the origin point in the upper series.
 *
 * @internal
 * @function Highcharts.ColumnSeries#animateDrillupFrom
 * @param {Highcharts.DrilldownLevelObject} level
 *        Level container
 * @return {void}
 */
function columnAnimateDrillupFrom(level) {
    var _a;
    var series = this,
        animationOptions = animObject((series.chart.options.drilldown || {}).animation);
    // Cancel mouse events on the series group (#2787)
    (_a = series.trackerGroups) === null || _a === void 0 ? void 0 : _a.forEach(function (key) {
        var _a,
            _b;
        if (key === 'dataLabelsGroup') {
            (_a = series.dataLabelsGroups) === null || _a === void 0 ? void 0 : _a.forEach(function (g) {
                g === null || g === void 0 ? void 0 : g.on('mouseover', function () { });
            });
        }
        else {
            (_b = series[key]) === null || _b === void 0 ? void 0 : _b.on('mouseover');
        }
    });
    var group = series.group;
    // For 3d column series all columns are added to one group
    // so we should not delete the whole group. #5297
    var removeGroup = group !== series.chart.columnGroup;
    if (removeGroup) {
        delete series.group;
    }
    (this.points || this.data).forEach(function (point) {
        var graphic = point.graphic,
            animateTo = level.shapeArgs;
        if (graphic && animateTo) {
            var complete = function () {
                    graphic.destroy();
                if (group && removeGroup) {
                    group = group.destroy();
                }
            };
            delete point.graphic;
            if (!series.chart.styledMode) {
                animateTo.fill = level.color;
            }
            if (animationOptions.duration) {
                graphic.animate(animateTo, (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(animationOptions, { complete: complete }));
            }
            else {
                graphic.attr(animateTo);
                complete();
            }
        }
    });
}
/**
 * When drilling up, keep the upper series invisible until the lower series has
 * moved into place.
 *
 * @internal
 * @function Highcharts.ColumnSeries#animateDrillupTo
 * @param {boolean} [init=false]
 * Whether to initialize animation
 */
function columnAnimateDrillupTo(init) {
    var _a;
    var series = this,
        level = series.drilldownLevel,
        animation = animObject((_a = series.chart.options.drilldown) === null || _a === void 0 ? void 0 : _a.animation);
    if (!init) {
        // First hide all items before animating in again
        series.points.forEach(function (point) {
            var _a;
            var dataLabel = point.dataLabel;
            if (point.graphic) { // #3407
                point.graphic.hide();
            }
            if (dataLabel) {
                // The data label is initially hidden, make sure it is not faded
                // in (#6127)
                dataLabel.hidden = dataLabel.attr('visibility') === 'hidden';
                if (!dataLabel.hidden) {
                    dataLabel.hide();
                    (_a = dataLabel.connector) === null || _a === void 0 ? void 0 : _a.hide();
                }
            }
        });
        // Do dummy animation on first point to get to complete
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.syncTimeout)(function () {
            if (series.points) { // May be destroyed in the meantime, #3389
                // Unable to drillup with nodes, #13711
                var pointsWithNodes_1 = [];
                series.data.forEach(function (el) {
                    pointsWithNodes_1.push(el);
                });
                if (series.nodes) {
                    pointsWithNodes_1 = pointsWithNodes_1.concat(series.nodes);
                }
                pointsWithNodes_1.forEach(function (point, i) {
                    var _a;
                    // Fade in other points
                    var verb = i === (level && level.pointIndex) ? 'show' : 'fadeIn', inherit = verb === 'show' ? true : void 0, dataLabel = point.dataLabel;
                    if (point.graphic && // #3407
                        point.visible // Don't show if invisible (#18303)
                    ) {
                        point.graphic[verb](inherit);
                    }
                    if (dataLabel && !dataLabel.hidden) { // #6127
                        dataLabel.fadeIn(); // #7384
                        (_a = dataLabel.connector) === null || _a === void 0 ? void 0 : _a.fadeIn();
                    }
                });
            }
        }, Math.max(animation.duration - 50, 0));
        // Reset to prototype
        delete this.animate;
    }
}
/** @internal */
function compose(SeriesClass, seriesTypes) {
    var PointClass = SeriesClass.prototype.pointClass,
        pointProto = PointClass.prototype;
    if (!pointProto.doDrilldown) {
        var ColumnSeriesClass = seriesTypes.column,
            MapSeriesClass = seriesTypes.map,
            PieSeriesClass = seriesTypes.pie;
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(PointClass, 'afterInit', onPointAfterInit);
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(PointClass, 'afterSetState', onPointAfterSetState);
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(PointClass, 'update', onPointUpdate);
        pointProto.doDrilldown = pointDoDrilldown;
        pointProto.runDrilldown = pointRunDrilldown;
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(SeriesClass, 'afterDrawDataLabels', onSeriesAfterDrawDataLabels);
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(SeriesClass, 'afterDrawTracker', onSeriesAfterDrawTracker);
        if (ColumnSeriesClass) {
            var columnProto = ColumnSeriesClass.prototype;
            columnProto.animateDrilldown = columnAnimateDrilldown;
            columnProto.animateDrillupFrom = columnAnimateDrillupFrom;
            columnProto.animateDrillupTo = columnAnimateDrillupTo;
        }
        if (MapSeriesClass) {
            var mapProto = MapSeriesClass.prototype;
            mapProto.animateDrilldown = mapAnimateDrilldown;
            mapProto.animateDrillupFrom = mapAnimateDrillupFrom;
            mapProto.animateDrillupTo = mapAnimateDrillupTo;
        }
        if (PieSeriesClass) {
            var pieProto = PieSeriesClass.prototype;
            pieProto.animateDrilldown = pieAnimateDrilldown;
            pieProto.animateDrillupFrom = columnAnimateDrillupFrom;
            pieProto.animateDrillupTo = columnAnimateDrillupTo;
        }
    }
}
/**
 * Animate in the new series.
 * @internal
 */
function mapAnimateDrilldown(init) {
    var _a,
        _b;
    var series = this,
        chart = series.chart,
        group = series.group;
    if (chart &&
        group &&
        series.options &&
        ((_a = chart.options.drilldown) === null || _a === void 0 ? void 0 : _a.animation)) {
        // Initialize the animation
        if (init && chart.mapView) {
            group.attr({ opacity: 0.01 });
            chart.mapView.allowTransformAnimation = false;
            // Stop duplicating and overriding animations
            series.options.inactiveOtherPoints = true;
            series.options.enableMouseTracking = false;
            // Run the animation
        }
        else {
            group.animate({ opacity: 1 }, chart.options.drilldown.animation, function () {
                var _a,
                    _b;
                if (series.options) {
                    series.options.inactiveOtherPoints = false;
                    series.options.enableMouseTracking = ((_b = (_a = series.userOptions) === null || _a === void 0 ? void 0 : _a.enableMouseTracking) !== null && _b !== void 0 ? _b : true);
                }
            });
            (_b = series.dataLabelsGroups) === null || _b === void 0 ? void 0 : _b.forEach(function (g) { var _a; return (_a = chart.drilldown) === null || _a === void 0 ? void 0 : _a.fadeInGroup(g); });
        }
    }
}
/**
 * When drilling up, pull out the individual point graphics from the
 * lower series and animate them into the origin point in the upper
 * series.
 * @internal
 */
function mapAnimateDrillupFrom() {
    var series = this,
        chart = series.chart;
    if (chart === null || chart === void 0 ? void 0 : chart.mapView) {
        chart.mapView.allowTransformAnimation = false;
    }
    // Stop duplicating and overriding animations
    if (series.options) {
        series.options.inactiveOtherPoints = true;
    }
}
/**
 * When drilling up, keep the upper series invisible until the lower
 * series has moved into place.
 * @internal
 */
function mapAnimateDrillupTo(init) {
    var _a;
    var series = this,
        chart = series.chart,
        group = series.group;
    if (chart && group) {
        // Initialize the animation
        if (init) {
            group.attr({
                opacity: 0.01
            });
            // Stop duplicating and overriding animations
            if (series.options) {
                series.options.inactiveOtherPoints = true;
            }
            // Run the animation
        }
        else {
            group.animate({ opacity: 1 }, (chart.options.drilldown || {}).animation);
            (_a = series.dataLabelsGroups) === null || _a === void 0 ? void 0 : _a.forEach(function (g) { var _a; return (_a = chart.drilldown) === null || _a === void 0 ? void 0 : _a.fadeInGroup(g); });
        }
    }
}
/**
 * On initialization of each point, identify its label and make it clickable.
 * Also, provide a list of points associated to that label.
 * @internal
 */
function onPointAfterInit() {
    var point = this;
    if (point.drilldown && !point.unbindDrilldownClick) {
        // Add the click event to the point
        point.unbindDrilldownClick = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(point, 'click', onPointClick);
    }
    return point;
}
/** @internal */
function onPointAfterSetState() {
    var point = this,
        series = point.series,
        styledMode = series.chart.styledMode;
    if (point.drilldown && series.halo && point.state === 'hover') {
        applyCursorCSS(series.halo, 'pointer', true, styledMode);
    }
    else if (series.halo) {
        applyCursorCSS(series.halo, 'auto', false, styledMode);
    }
}
/** @internal */
function onPointClick(e) {
    var point = this,
        series = point.series;
    if (series.xAxis &&
        (series.chart.options.drilldown || {}).allowPointDrilldown ===
            false) {
        // #5822, x changed
        series.xAxis.drilldownCategory(point.x, e);
    }
    else {
        point.runDrilldown(void 0, void 0, e);
    }
}
/** @internal */
function onPointUpdate(e) {
    var point = this,
        options = e.options || {};
    if (options.drilldown && !point.unbindDrilldownClick) {
        // Add the click event to the point
        point.unbindDrilldownClick = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(point, 'click', onPointClick);
    }
    else if (!options.drilldown &&
        options.drilldown !== void 0 &&
        point.unbindDrilldownClick) {
        point.unbindDrilldownClick = point.unbindDrilldownClick();
    }
}
/** @internal */
function onSeriesAfterDrawDataLabels() {
    var _a;
    var series = this,
        chart = series.chart,
        css = ((_a = chart.options.drilldown) === null || _a === void 0 ? void 0 : _a.activeDataLabelStyle) || {},
        renderer = chart.renderer,
        styledMode = chart.styledMode;
    for (var _i = 0, _b = series.points; _i < _b.length; _i++) {
        var point = _b[_i];
        var dataLabelsOptions = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.splat)(point.options.dataLabels)[0] || {},
            pointCSS = (point.dlOptions ||
                dataLabelsOptions.style ||
                {});
        if (point.drilldown && point.dataLabel) {
            if (css.color === 'contrast' && !styledMode) {
                var itemColor = (((0,
                    highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isString)(point.color) && point.color) ||
                        ((0,
                    highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isString)(series.color) && series.color));
                if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isString)(itemColor)) {
                    pointCSS.color = renderer.getContrast(itemColor);
                }
            }
            if (dataLabelsOptions && dataLabelsOptions.color) {
                pointCSS.color = dataLabelsOptions.color;
            }
            point.dataLabel.addClass('highcharts-drilldown-data-label');
            if (!styledMode) {
                point.dataLabel
                    .css(css)
                    .css(pointCSS);
            }
        }
    }
}
/**
 * Mark the trackers with a pointer.
 * @internal
 */
function onSeriesAfterDrawTracker() {
    var series = this,
        styledMode = series.chart.styledMode;
    for (var _i = 0, _a = series.points; _i < _a.length; _i++) {
        var point = _a[_i];
        if (point.drilldown && point.graphic) {
            applyCursorCSS(point.graphic, 'pointer', true, styledMode);
        }
    }
}
/** @internal */
function pieAnimateDrilldown(init) {
    var _a,
        _b,
        _c,
        _d;
    var series = this,
        chart = series.chart,
        points = series.points,
        drilldownLevels = chart.drilldownLevels || [],
        level = drilldownLevels[drilldownLevels.length - 1],
        animation = animObject((_a = chart.options.drilldown) === null || _a === void 0 ? void 0 : _a.animation);
    if (series.is('item')) {
        animation.duration = 0;
    }
    // Unable to drill down in the horizontal item series #13372
    if (series.center) {
        var animateFrom = level.shapeArgs || {},
            start = animateFrom.start || 0,
            angle = (animateFrom.end || 0) - start,
            startAngle = angle / series.points.length,
            styledMode = chart.styledMode;
        // Adjust for moving plot area, typically adjusting to breadcrumbs
        animateFrom.y = (animateFrom.y || 0) +
            (((_b = level.plotTop) !== null && _b !== void 0 ? _b : chart.plotTop) - chart.plotTop) / 2;
        if (!init) {
            var animateTo = void 0,
                point = void 0;
            for (var i = 0, iEnd = points.length; i < iEnd; ++i) {
                point = points[i];
                animateTo = point.shapeArgs || {};
                if (!styledMode) {
                    animateFrom.fill = level.color;
                    animateTo.fill = point.color;
                }
                var attr = (0,
                    highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(animateFrom, {
                        start: start + i * startAngle,
                        end: start + (i + 1) * startAngle
                    });
                (_c = point.graphic) === null || _c === void 0 ? void 0 : _c.attr(attr).animate(animateTo, animation);
            }
            (_d = series.dataLabelsGroups) === null || _d === void 0 ? void 0 : _d.forEach(function (g) { var _a; return (_a = chart.drilldown) === null || _a === void 0 ? void 0 : _a.fadeInGroup(g); });
            // Reset to prototype
            delete series.animate;
        }
    }
}
/**
 * Perform drilldown on a point instance. The [drilldown](https://api.highcharts.com/highcharts/series.line.data.drilldown)
 * property must be set on the point options.
 *
 * To drill down multiple points in the same category, use
 * `Axis.drilldownCategory` instead.
 *
 * @requires  modules/drilldown
 *
 * @function Highcharts.Point#doDrilldown
 *
 * @sample highcharts/drilldown/programmatic
 *         Programmatic drilldown
 */
function pointDoDrilldown() {
    this.runDrilldown();
}
/** @internal */
function pointRunDrilldown(holdRedraw, category, originalEvent) {
    var point = this,
        series = point.series,
        chart = series.chart,
        drilldown = chart.options.drilldown || {};
    var i = (drilldown.series || []).length,
        seriesOptions;
    if (!chart.ddDupes) {
        chart.ddDupes = [];
    }
    // Reset the color and symbol counters after every drilldown. (#19134)
    chart.colorCounter = chart.symbolCounter = 0;
    while (i-- && !seriesOptions) {
        if (drilldown.series &&
            drilldown.series[i].id === point.drilldown &&
            point.drilldown &&
            chart.ddDupes.indexOf(point.drilldown) === -1) {
            seriesOptions = drilldown.series[i];
            chart.ddDupes.push(point.drilldown);
        }
    }
    // Fire the event. If seriesOptions is undefined, the implementer can check
    // for seriesOptions, and call addSeriesAsDrilldown async if necessary.
    (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(chart, 'drilldown', {
        point: point,
        seriesOptions: seriesOptions,
        category: category,
        originalEvent: originalEvent,
        points: (typeof category !== 'undefined' &&
            series.xAxis.getDDPoints(category).slice(0))
    }, function (e) {
        var _a;
        var chart = (_a = e.point.series) === null || _a === void 0 ? void 0 : _a.chart,
            seriesOptions = e.seriesOptions;
        if (chart && seriesOptions) {
            if (holdRedraw) {
                chart.addSingleSeriesAsDrilldown(e.point, seriesOptions);
            }
            else {
                chart.addSeriesAsDrilldown(e.point, seriesOptions);
            }
        }
    });
}
/* *
 *
 *  Default Export
 *
 * */
/** @internal */
var DrilldownSeries = {
    compose: compose
};
/** @internal */
/* harmony default export */ var Drilldown_DrilldownSeries = (DrilldownSeries);

;// ./code/es5/es-modules/Extensions/Drilldown/Drilldown.js
/* *
 *
 *  Highcharts Drilldown module
 *
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */


var Drilldown_animObject = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).animObject, stop = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).stop;


var noop = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).noop;



/* *
 *
 *  Variables
 *
 * */
var ddSeriesId = 1;
/* *
 *
 *  Functions
 *
 * */
/**
 * Drill down to a given category. This is the same as clicking on an axis
 * label. If multiple series with drilldown are present, all will drill down to
 * the given category.
 *
 * See also `Point.doDrilldown` for drilling down on a single point instance.
 *
 * @function Highcharts.Axis#drilldownCategory
 *
 * @sample highcharts/drilldown/programmatic
 *         Programmatic drilldown
 *
 * @param {number} x
 *        The index of the category
 * @param {global.MouseEvent} [originalEvent]
 *        The original event, used internally.
 *
 * @requires modules/drilldown
 */
function axisDrilldownCategory(x, originalEvent) {
    this.getDDPoints(x).forEach(function (point) {
        if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isObject)(point) &&
            point.series &&
            point.series.visible &&
            point.runDrilldown) { // #3197
            point.runDrilldown(true, x, originalEvent);
        }
    });
    this.chart.applyDrilldown();
}
/**
 * Return drillable points for this specific X value.
 *
 * @internal
 * @function Highcharts.Axis#getDDPoints
 * @param {number} x
 *        Tick position
 * @return {Array<(false|Highcharts.Point)>}
 *         Drillable points
 */
function axisGetDDPoints(x) {
    return this.ddPoints && this.ddPoints[x] || [];
}
/**
 * This method creates an array of arrays containing a level number
 * with the corresponding series/point.
 *
 * @internal
 * @param {Highcharts.Chart} chart
 *        Highcharts Chart object.
 * @return {Array<Breadcrumbs.BreadcrumbOptions>}
 * List for Highcharts Breadcrumbs.
 */
function createBreadcrumbsList(chart) {
    var list = [],
        drilldownLevels = chart.drilldownLevels;
    // The list is based on drilldown levels from the chart object
    if (drilldownLevels && drilldownLevels.length) {
        // Add the initial series as the first element.
        if (!list[0]) {
            list.push({
                level: 0,
                levelOptions: drilldownLevels[0].seriesOptions
            });
        }
        drilldownLevels.forEach(function (level) {
            var lastBreadcrumb = list[list.length - 1];
            // If level is already added to breadcrumbs list,
            // don't add it again- drilling categories
            // + 1 because of the wrong levels numeration
            // in drilldownLevels array.
            if (level.levelNumber + 1 > lastBreadcrumb.level) {
                list.push({
                    level: level.levelNumber + 1,
                    levelOptions: (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)({
                        name: level.lowerSeries.name
                    }, level.pointOptions)
                });
            }
        });
    }
    return list;
}
/* *
 *
 *  Class
 *
 * */
/** @internal */
var ChartAdditions = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    function ChartAdditions(chart) {
        this.chart = chart;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Add a series to the chart as drilldown from a specific point in the
     * parent series. This method is used for async drilldown, when clicking a
     * point in a series should result in loading and displaying a more
     * high-resolution series. When not async, the setup is simpler using the
     * [drilldown.series](https://api.highcharts.com/highcharts/drilldown.series)
     * options structure.
     *
     * @sample highcharts/drilldown/async/
     *         Async drilldown
     *
     * @function Highcharts.Chart#addSeriesAsDrilldown
     *
     * @param {Highcharts.Point} point
     * The point from which the drilldown will start.
     *
     * @param {Highcharts.SeriesOptionsType} options
     * The series options for the new, detailed series.
     *
     * @requires modules/drilldown
     */
    ChartAdditions.prototype.addSeriesAsDrilldown = function (point, options) {
        var chart = (this.chart ||
                this);
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(this, 'addSeriesAsDrilldown', { seriesOptions: options });
        if (chart.mapView) {
            // Stop hovering while drilling down
            point.series.isDrilling = true;
            chart.series.forEach(function (series) {
                var _a,
                    _b;
                // Stop duplicating and overriding animations
                series.options.inactiveOtherPoints = true;
                // Hide and disable dataLabels
                (_a = series.dataLabelsGroups) === null || _a === void 0 ? void 0 : _a.forEach(function (g) { return g === null || g === void 0 ? void 0 : g.destroy(); });
                series.dataLabelsGroups = [];
                // Clear point.dataLabels for drill up (#23850)
                (_b = series.points) === null || _b === void 0 ? void 0 : _b.forEach(function (p) {
                    if (p.dataLabels) {
                        p.dataLabels = [];
                    }
                });
            });
            // #18925 map zooming is not working with geoJSON maps
            if (chart.options.drilldown &&
                !chart.mapView.projection.hasGeoProjection &&
                Drilldown_DrilldownDefaults) {
                var userDrilldown = (0,
                    highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.diffObjects)(chart.options.drilldown,
                    Drilldown_DrilldownDefaults);
                // Set mapZooming to false if user didn't set any in chart
                // config
                if (!(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(userDrilldown.mapZooming)) {
                    chart.options.drilldown.mapZooming = false;
                }
            }
            if (chart.options.drilldown &&
                chart.options.drilldown.animation &&
                chart.options.drilldown.mapZooming) {
                // First zoomTo then crossfade series
                chart.mapView.allowTransformAnimation = true;
                var animOptions = Drilldown_animObject(chart.options.drilldown.animation);
                if (typeof animOptions !== 'boolean') {
                    var userComplete_1 = animOptions.complete,
                        drilldownComplete_1 = function (obj) {
                            if (obj && obj.applyDrilldown && chart.mapView) {
                                chart
                                    .addSingleSeriesAsDrilldown(point,
                        options);
                            chart.applyDrilldown();
                            chart.mapView.allowTransformAnimation = false;
                        }
                    };
                    animOptions.complete =
                        function () {
                            if (userComplete_1) {
                                userComplete_1.apply(this, arguments);
                            }
                            drilldownComplete_1.apply(this, arguments);
                        };
                }
                point.zoomTo(animOptions);
            }
            else {
                chart.addSingleSeriesAsDrilldown(point, options);
                chart.applyDrilldown();
            }
        }
        else {
            chart.addSingleSeriesAsDrilldown(point, options);
            chart.applyDrilldown();
        }
    };
    /** @internal */
    ChartAdditions.prototype.addSingleSeriesAsDrilldown = function (point, ddOptions) {
        var _a,
            _b,
            _c,
            _d;
        var chart = (this.chart ||
                this),
            oldSeries = point.series,
            xAxis = oldSeries.xAxis,
            yAxis = oldSeries.yAxis,
            horizAxis = xAxis && chart.inverted ? yAxis : xAxis,
            vertAxis = xAxis && chart.inverted ? xAxis : yAxis,
            colorProp = chart.styledMode ?
                { colorIndex: (_a = point.colorIndex) !== null && _a !== void 0 ? _a : oldSeries.colorIndex } :
                { color: point.color || oldSeries.color },
            levelNumber = (_b = oldSeries.options._levelNumber) !== null && _b !== void 0 ? _b : 0;
        if (!chart.drilldownLevels) {
            chart.drilldownLevels = [];
        }
        ddOptions = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)({
            _ddSeriesId: ddSeriesId++,
            _levelNumber: levelNumber + 1
        }, colorProp), ddOptions);
        var levelSeries = [],
            levelSeriesOptions = [],
            last;
        // See if we can reuse the registered series from last run
        last = chart.drilldownLevels[chart.drilldownLevels.length - 1];
        if (last && last.levelNumber !== levelNumber) {
            last = void 0;
        }
        // Record options for all current series
        oldSeries.chart.series.forEach(function (series) {
            var _a;
            var _b,
                _c;
            if (series.xAxis === xAxis) {
                (_b = series.options)._ddSeriesId || (_b._ddSeriesId = ddSeriesId++);
                series.options.colorIndex = series.colorIndex;
                (_a = (_c = series.options)._levelNumber) !== null && _a !== void 0 ? _a : (_c._levelNumber = levelNumber); // #3182
                if (last) {
                    levelSeries = last.levelSeries;
                    levelSeriesOptions = last.levelSeriesOptions;
                }
                else {
                    levelSeries.push(series);
                    // (#10597)
                    series.purgedOptions = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)({
                        _ddSeriesId: series.options._ddSeriesId,
                        _levelNumber: series.options._levelNumber,
                        selected: series.options.selected
                    }, series.userOptions);
                    var columns = series.dataTable.getColumns();
                    series.purgedOptions.dataTable = { columns: columns };
                    levelSeriesOptions.push(series.purgedOptions);
                }
            }
        });
        // Reset names to prevent extending (#6704)
        if (xAxis === null || xAxis === void 0 ? void 0 : xAxis.names) {
            xAxis.names.length = 0;
        }
        // Crate the new series
        var newSeries = chart.addSeries(ddOptions,
            false);
        newSeries.options._levelNumber = levelNumber + 1;
        if (xAxis) {
            xAxis.userMin = xAxis.userMax = void 0;
            yAxis.userMin = yAxis.userMax = void 0;
        }
        newSeries.isDrilling = true;
        // Add a record of properties for each drilldown level
        var level = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)({
                levelNumber: levelNumber,
                seriesOptions: oldSeries.options,
                seriesPurgedOptions: oldSeries.purgedOptions,
                levelSeriesOptions: levelSeriesOptions,
                levelSeries: levelSeries,
                shapeArgs: point.shapeArgs,
                // No graphic in line series with markers disabled
                bBox: point.graphic ? point.graphic.getBBox() : {},
                color: point.isNull ? 'rgba(0,0,0,0)' : colorProp.color,
                lowerSeries: newSeries,
                lowerSeriesOptions: ddOptions,
                plotTop: (_c = vertAxis === null || vertAxis === void 0 ? void 0 : vertAxis.pos) !== null && _c !== void 0 ? _c : chart.plotTop,
                plotLeft: (_d = horizAxis === null || horizAxis === void 0 ? void 0 : horizAxis.pos) !== null && _d !== void 0 ? _d : chart.plotLeft,
                pointOptions: point.options,
                pointIndex: point.index,
                oldExtremes: {
                    xMin: xAxis === null || xAxis === void 0 ? void 0 : xAxis.userMin,
                    xMax: xAxis === null || xAxis === void 0 ? void 0 : xAxis.userMax,
                    yMin: yAxis === null || yAxis === void 0 ? void 0 : yAxis.userMin,
                    yMax: yAxis === null || yAxis === void 0 ? void 0 : yAxis.userMax
                },
                resetZoomButton: last && last.levelNumber === levelNumber ?
                    void 0 : chart.resetZoomButton
            }, colorProp);
        // Push it to the lookup array
        chart.drilldownLevels.push(level);
        // Run fancy cross-animation on supported and equal types
        if (oldSeries.type === newSeries.type) {
            newSeries.animate = (newSeries.animateDrilldown || noop);
            newSeries.options.animation = true;
        }
    };
    ChartAdditions.prototype.applyDrilldown = function () {
        var _a;
        var chart = (this.chart ||
                this),
            drilldownOptions = chart.options.drilldown,
            drilldownLevels = chart.drilldownLevels;
        var levelToRemove;
        if (drilldownLevels && drilldownLevels.length > 0) {
            // #3352, async loading
            levelToRemove =
                drilldownLevels[drilldownLevels.length - 1].levelNumber;
            chart.hasCartesianSeries = drilldownLevels.some(function (level) { var _a; return (_a = level.lowerSeries) === null || _a === void 0 ? void 0 : _a.isCartesian; } // #19725
            );
            (chart.drilldownLevels || []).forEach(function (level) {
                if (chart.mapView &&
                    (drilldownOptions === null || drilldownOptions === void 0 ? void 0 : drilldownOptions.mapZooming)) {
                    chart.redraw();
                    level.lowerSeries.isDrilling = false;
                    chart.mapView.fitToBounds(level.lowerSeries.bounds);
                    level.lowerSeries.isDrilling = true;
                }
                if (level.levelNumber === levelToRemove) {
                    level.levelSeries.forEach(function (series) {
                        var _a,
                            _b;
                        var levelNumber = (_a = series.options) === null || _a === void 0 ? void 0 : _a._levelNumber;
                        // Not removed, not added as part of a multi-series
                        // drilldown
                        if (!chart.mapView) {
                            if (series.options &&
                                levelNumber === levelToRemove) {
                                series.remove(false);
                            }
                            // Deal with asynchronous removing of map series
                            // after zooming into
                        }
                        else if (series.options &&
                            levelNumber === levelToRemove) {
                            var animOptions = {};
                            if (drilldownOptions) {
                                animOptions = drilldownOptions.animation;
                            }
                            var drillAnimOptions = Drilldown_animObject(animOptions);
                            var hideDataLabels = function () {
                                    var _a;
                                var hideGroup = function (group) {
                                        var element = group === null || group === void 0 ? void 0 : group.element;
                                    if (group && element) {
                                        stop(group);
                                        element.setAttribute('opacity', '0');
                                        element.setAttribute('visibility', 'hidden');
                                    }
                                };
                                hideGroup(series.dataLabelsGroup);
                                (_a = series.dataLabelsGroups) === null || _a === void 0 ? void 0 : _a.forEach(hideGroup);
                            };
                            var seriesRemoved_1 = false;
                            var removeSeries = function () {
                                    var _a,
                                _b;
                                if (seriesRemoved_1) {
                                    return;
                                }
                                seriesRemoved_1 = true;
                                if (series.chart) {
                                    if (series.group) {
                                        stop(series.group);
                                    }
                                    if (series.dataLabelsGroup) {
                                        stop(series.dataLabelsGroup);
                                    }
                                    (_a = series.dataLabelsGroups) === null || _a === void 0 ? void 0 : _a.forEach(function (group) {
                                        if (group) {
                                            stop(group);
                                        }
                                    });
                                    series.remove(false);
                                }
                                // If it is the last series
                                if (!(level.levelSeries.filter(function (el) { return Object.keys(el).length; })).length) {
                                    // We have a reset zoom button. Hide it and
                                    // detach it from the chart. It is
                                    // preserved to the layer config above.
                                    if (chart.resetZoomButton) {
                                        chart.resetZoomButton.hide();
                                        delete chart.resetZoomButton;
                                    }
                                    (_b = chart.pointer) === null || _b === void 0 ? void 0 : _b.reset();
                                    (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(chart, 'afterDrilldown');
                                    if (chart.mapView) {
                                        chart.series.forEach(function (series) {
                                            series.isDirtyData = true;
                                            series.isDrilling = false;
                                        });
                                        chart.mapView
                                            .fitToBounds(void 0, void 0);
                                        chart.mapView.allowTransformAnimation =
                                            true; // #20857
                                    }
                                    (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(chart, 'afterApplyDrilldown');
                                }
                            };
                            if ((_b = series.group) === null || _b === void 0 ? void 0 : _b.element) {
                                // Hide labels immediately to avoid stale
                                // labels flashing during map transform.
                                hideDataLabels();
                                series.group.animate({
                                    opacity: 0
                                }, animOptions, removeSeries);
                                // If another redraw interrupts the animation,
                                // ensure the old series is still removed.
                                (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.syncTimeout)(removeSeries, drillAnimOptions.defer +
                                    drillAnimOptions.duration);
                            }
                            else {
                                removeSeries();
                            }
                        }
                    });
                }
            });
        }
        if (!chart.mapView) {
            // We have a reset zoom button. Hide it and detach it from the
            // chart. It is preserved to the layer config above.
            if (chart.resetZoomButton) {
                chart.resetZoomButton.hide();
                delete chart.resetZoomButton;
            }
            (_a = chart.pointer) === null || _a === void 0 ? void 0 : _a.reset();
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(chart, 'afterDrilldown');
            // Axes shouldn't be visible after drilling into non-cartesian
            // (#19725)
            if (!chart.hasCartesianSeries) {
                chart.axes.forEach(function (axis) {
                    axis.destroy(true);
                    axis.init(chart, (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(axis.userOptions, axis.options));
                });
            }
            chart.redraw(drilldownOptions === null || drilldownOptions === void 0 ? void 0 : drilldownOptions.animation);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(chart, 'afterApplyDrilldown');
        }
    };
    /**
     * When the chart is drilled down to a child series, calling
     * `chart.drillUp()` will drill up to the parent series.
     *
     * @function Highcharts.Chart#drillUp
     *
     * @sample highcharts/drilldown/programmatic
     *         Programmatic drilldown
     *
     * @requires modules/drilldown
     */
    ChartAdditions.prototype.drillUp = function (isMultipleDrillUp) {
        var _a,
            _b,
            _c;
        var chart = (this.chart ||
                this);
        if (!chart.drilldownLevels || chart.drilldownLevels.length === 0) {
            return;
        }
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(chart, 'beforeDrillUp');
        var drilldownLevels = chart.drilldownLevels,
            levelNumber = drilldownLevels[drilldownLevels.length - 1].levelNumber,
            chartSeries = chart.series,
            drilldownLevelsNumber = chart.drilldownLevels.length,
            drilldownOptions = chart.options.drilldown || {},
            addSeries = function (seriesOptions,
            oldSeries) {
                var addedSeries;
            chartSeries.forEach(function (series) {
                if (series.options._ddSeriesId ===
                    seriesOptions._ddSeriesId) {
                    addedSeries = series;
                }
            });
            addedSeries =
                addedSeries || chart.addSeries(seriesOptions, false);
            if (addedSeries.type === oldSeries.type &&
                addedSeries.animateDrillupTo) {
                addedSeries.animate = addedSeries.animateDrillupTo;
            }
            if (seriesOptions === level.seriesPurgedOptions) {
                return addedSeries;
            }
        }, removeSeries = function (oldSeries) {
            oldSeries.remove(false);
            chart.series.forEach(function (series) {
                // Ensures to redraw series to get correct colors
                if (series.colorAxis) {
                    series.isDirtyData = true;
                }
                series.options.inactiveOtherPoints = false;
                // Restore opacity for series hidden during map drilldown
                if (series.group && series.visible) {
                    series.group.attr({ opacity: 1 });
                }
            });
            chart.redraw();
        };
        var i = drilldownLevels.length,
            seriesI,
            level,
            oldExtremes;
        // Reset symbol and color counters after every drill-up. (#19134)
        chart.symbolCounter = chart.colorCounter = 0;
        var _loop_1 = function () {
                var oldSeries,
            newSeries;
            level = drilldownLevels[i];
            if (level.levelNumber === levelNumber) {
                drilldownLevels.pop();
                // Get the lower series by reference or id
                oldSeries = level.lowerSeries;
                if (!oldSeries.chart) { // #2786
                    seriesI = chartSeries.length; // #2919
                    while (seriesI--) {
                        if (chartSeries[seriesI].options.id ===
                            level.lowerSeriesOptions.id &&
                            chartSeries[seriesI].options._levelNumber ===
                                levelNumber + 1) { // #3867
                            oldSeries = chartSeries[seriesI];
                            break;
                        }
                    }
                }
                // Overcome problems with minRange (#2898)
                oldSeries.dataTable.setColumn('x', []);
                // Reset the names to start new series from the beginning.
                // Do it once to preserve names when multiple
                // series are added for the same axis, #16135.
                if (oldSeries.xAxis &&
                    oldSeries.xAxis.names &&
                    (drilldownLevelsNumber === 0 ||
                        i === drilldownLevelsNumber - 1)) {
                    oldSeries.xAxis.names.length = 0;
                }
                level.levelSeriesOptions.forEach(function (el) {
                    var addedSeries = addSeries(el,
                        oldSeries);
                    if (addedSeries) {
                        newSeries = addedSeries;
                    }
                });
                (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(chart, 'drillup', {
                    seriesOptions: level.seriesPurgedOptions ||
                        level.seriesOptions
                });
                if (newSeries) {
                    if (newSeries.type === oldSeries.type) {
                        newSeries.drilldownLevel = level;
                        newSeries.options.animation =
                            drilldownOptions.animation;
                        // #2919
                        if (oldSeries.chart) {
                            (_a = oldSeries.animateDrillupFrom) === null || _a === void 0 ? void 0 : _a.call(oldSeries, level);
                        }
                    }
                    newSeries.options._levelNumber = levelNumber;
                }
                var seriesToRemove = oldSeries;
                // Cannot access variable changed in loop
                if (!chart.mapView) {
                    seriesToRemove.remove(false);
                }
                // Reset the zoom level of the upper series
                if (newSeries === null || newSeries === void 0 ? void 0 : newSeries.xAxis) {
                    oldExtremes = level.oldExtremes;
                    newSeries.xAxis.setExtremes(oldExtremes.xMin, oldExtremes.xMax, false);
                    newSeries.yAxis.setExtremes(oldExtremes.yMin, oldExtremes.yMax, false);
                }
                // We have a resetZoomButton tucked away for this level. Attach
                // it to the chart and show it.
                if (level.resetZoomButton) {
                    chart.resetZoomButton = level.resetZoomButton;
                }
                if (!chart.mapView) {
                    (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(chart, 'afterDrillUp');
                }
                else {
                    var shouldAnimate = (level.levelNumber === levelNumber &&
                            isMultipleDrillUp),
                        zoomingDrill = drilldownOptions.animation &&
                            drilldownOptions.mapZooming;
                    if (shouldAnimate) {
                        oldSeries.remove(false);
                    }
                    else {
                        // Hide and disable dataLabels
                        (_b = oldSeries.dataLabelsGroups) === null || _b === void 0 ? void 0 : _b.forEach(function (g) {
                            g === null || g === void 0 ? void 0 : g.destroy();
                        });
                        oldSeries.dataLabelsGroups = [];
                        if (chart.mapView && newSeries) {
                            if (zoomingDrill) {
                                // Stop hovering while drilling down
                                oldSeries.isDrilling = true;
                                newSeries.isDrilling = true;
                                chart.redraw(false);
                                // Fit to previous bounds
                                chart.mapView.fitToBounds(oldSeries.bounds, void 0, true, false);
                            }
                            chart.mapView.allowTransformAnimation = true;
                            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(chart, 'afterDrillUp', {
                                seriesOptions: newSeries ? newSeries.userOptions : void 0
                            });
                            if (zoomingDrill) {
                                // Fit to natural bounds
                                chart.mapView.setView(void 0, (_c = chart.mapView.minZoom) !== null && _c !== void 0 ? _c : 1, true, {
                                    complete: function () {
                                        // Fire it only on complete in this
                                        // place (once)
                                        if (Object.prototype.hasOwnProperty
                                            .call(this, 'complete')) {
                                            removeSeries(oldSeries);
                                        }
                                    }
                                });
                                newSeries._hasTracking = false;
                            }
                            else {
                                // When user don't want to zoom into region only
                                // fade out
                                chart.mapView.allowTransformAnimation = false;
                                if (oldSeries.group) {
                                    oldSeries.group.animate({
                                        opacity: 0
                                    }, drilldownOptions.animation, function () {
                                        removeSeries(oldSeries);
                                        if (chart.mapView) {
                                            chart.mapView
                                                .allowTransformAnimation = true;
                                        }
                                    });
                                }
                                else {
                                    removeSeries(oldSeries);
                                    chart.mapView
                                        .allowTransformAnimation = true;
                                }
                            }
                            newSeries.isDrilling = false;
                        }
                    }
                }
            }
        };
        while (i--) {
            _loop_1();
        }
        if (!chart.mapView && !isMultipleDrillUp) {
            chart.redraw(drilldownOptions.animation);
        }
        // #3315, #8324
        if (chart.ddDupes) {
            chart.ddDupes.length = 0;
        }
        // Fire a once-off event after all series have been
        // drilled up (#5158)
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(chart, 'drillupall');
    };
    /**
     * A function to fade in a group. First, the element is being hidden, then,
     * using `opacity`, is faded in. Used for example by `dataLabelsGroup` where
     * simple SVGElement.fadeIn() is not enough, because of other features (e.g.
     * InactiveState) using `opacity` to fadeIn/fadeOut.
     *
     * @requires modules/drilldown
     *
     * @internal
     * @param {SVGElement} [group]
     *        The SVG element to be faded in.
     */
    ChartAdditions.prototype.fadeInGroup = function (group) {
        var _a;
        var animationOptions = Drilldown_animObject((_a = this.chart.options.drilldown) === null || _a === void 0 ? void 0 : _a.animation);
        if (group) {
            group.hide();
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.syncTimeout)(function () {
                // Make sure neither group nor chart were destroyed
                if (group === null || group === void 0 ? void 0 : group.added) {
                    group.fadeIn();
                }
            }, Math.max(animationOptions.duration - 50, 0));
        }
    };
    /**
     * Update function to be called internally from Chart.update (#7600, #12855)
     * @internal
     */
    ChartAdditions.prototype.update = function (options, redraw) {
        if (redraw === void 0) { redraw = true; }
        var chart = this.chart;
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(true, chart.options.drilldown, options);
        if (redraw) {
            chart.redraw();
        }
    };
    return ChartAdditions;
}());
/* *
 *
 *  Composition
 *
 * */
var Drilldown;
(function (Drilldown) {
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
    /** @internal */
    function compose(AxisClass, ChartClass, highchartsDefaultOptions, SeriesClass, seriesTypes, SVGRendererClass, TickClass) {
        Drilldown_DrilldownSeries.compose(SeriesClass, seriesTypes);
        var DrilldownChart = ChartClass,
            chartProto = DrilldownChart.prototype;
        if (!chartProto.drillUp) {
            var SVGElementClass = SVGRendererClass.prototype.Element,
                addonProto = ChartAdditions.prototype,
                axisProto = AxisClass.prototype,
                elementProto = SVGElementClass.prototype,
                tickProto = TickClass.prototype;
            axisProto.drilldownCategory = axisDrilldownCategory;
            axisProto.getDDPoints = axisGetDDPoints;
            Breadcrumbs_Breadcrumbs.compose(ChartClass, highchartsDefaultOptions);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(Breadcrumbs_Breadcrumbs, 'up', onBreadcrumbsUp);
            chartProto.addSeriesAsDrilldown = addonProto.addSeriesAsDrilldown;
            chartProto.addSingleSeriesAsDrilldown =
                addonProto.addSingleSeriesAsDrilldown;
            chartProto.applyDrilldown = addonProto.applyDrilldown;
            chartProto.drillUp = addonProto.drillUp;
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(DrilldownChart, 'afterDrilldown', onChartAfterDrilldown);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(DrilldownChart, 'afterDrillUp', onChartAfterDrillUp);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(DrilldownChart, 'afterInit', onChartAfterInit);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(DrilldownChart, 'drillup', onChartDrillup);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(DrilldownChart, 'drillupall', onChartDrillupall);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(DrilldownChart, 'render', onChartRender);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(DrilldownChart, 'update', onChartUpdate);
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(SeriesClass, 'update', onSeriesUpdate);
            highchartsDefaultOptions.drilldown = Drilldown_DrilldownDefaults;
            elementProto.fadeIn = svgElementFadeIn;
            tickProto.drillable = tickDrillable;
        }
    }
    Drilldown.compose = compose;
    /** @internal */
    function onBreadcrumbsUp(e) {
        var chart = this.chart,
            drillUpsNumber = this.getLevel() - e.newLevel;
        var isMultipleDrillUp = drillUpsNumber > 1;
        for (var i = 0; i < drillUpsNumber; i++) {
            if (i === drillUpsNumber - 1) {
                isMultipleDrillUp = false;
            }
            chart.drillUp(isMultipleDrillUp);
        }
    }
    /** @internal */
    function onChartAfterDrilldown() {
        var chart = this,
            drilldownOptions = chart.options.drilldown,
            breadcrumbsOptions = drilldownOptions && drilldownOptions.breadcrumbs;
        if (!chart.breadcrumbs) {
            chart.breadcrumbs = new Breadcrumbs_Breadcrumbs(chart, breadcrumbsOptions);
        }
        chart.breadcrumbs.updateProperties(createBreadcrumbsList(chart));
    }
    /** @internal */
    function onChartAfterDrillUp() {
        var chart = this;
        if (chart.breadcrumbs) {
            chart.breadcrumbs.updateProperties(createBreadcrumbsList(chart));
        }
    }
    /**
     * Add update function to be called internally from Chart.update (#7600,
     * #12855)
     * @internal
     */
    function onChartAfterInit() {
        this.drilldown = new ChartAdditions(this);
    }
    /** @internal */
    function onChartDrillup() {
        var chart = this;
        if (chart.resetZoomButton) {
            chart.resetZoomButton = chart.resetZoomButton.destroy();
        }
    }
    /** @internal */
    function onChartDrillupall() {
        var chart = this;
        if (chart.resetZoomButton) {
            chart.showResetZoom();
        }
    }
    /** @internal */
    function onChartRender() {
        (this.xAxis || []).forEach(function (axis) {
            var ddPoints = {};
            axis.ddPoints = ddPoints;
            axis.series.forEach(function (series) {
                var xData = series.getColumn('x'),
                    points = series.points;
                for (var i = 0, iEnd = xData.length, p = void 0; i < iEnd; i++) {
                    p = series.dataTable.getRowObject(i);
                    // The `drilldown` property can only be set on an array or an
                    // object
                    if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(p) && typeof p !== 'number') {
                        // Convert array to object (#8008)
                        p = series.pointClass.prototype.optionsToObject
                            .call({ series: series }, p);
                        if (p.drilldown) {
                            if (!ddPoints[xData[i]]) {
                                ddPoints[xData[i]] = [];
                            }
                            var index = i - (series.cropStart || 0);
                            ddPoints[xData[i]].push(points && index >= 0 && index < points.length ?
                                points[index] :
                                true);
                        }
                    }
                }
            });
            // Add drillability to ticks, and always keep it drillability
            // updated (#3951)
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.objectEach)(axis.ticks, function (tick) { return tick.drillable(); });
        });
    }
    /** @internal */
    function onChartUpdate(e) {
        var breadcrumbs = this.breadcrumbs,
            breadcrumbOptions = e.options.drilldown && e.options.drilldown.breadcrumbs;
        if (breadcrumbs && breadcrumbOptions) {
            breadcrumbs.update(breadcrumbOptions);
        }
    }
    /** @internal */
    function onSeriesUpdate(e) {
        var updateOptions = e.options;
        if (updateOptions &&
            updateOptions._levelNumber === void 0 &&
            this.options._levelNumber !== void 0) {
            updateOptions._levelNumber = this.options._levelNumber;
        }
    }
    /**
     * A general fadeIn method.
     *
     * @requires modules/drilldown
     *
     * @function Highcharts.SVGElement#fadeIn
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     * The animation options for the element fade.
     */
    function svgElementFadeIn(animation) {
        var _a;
        var elem = this;
        elem
            .attr({
            opacity: 0.1,
            visibility: 'inherit'
        })
            .animate({
            opacity: (_a = elem.newOpacity) !== null && _a !== void 0 ? _a : 1 // `newOpacity` used in maps
        }, animation || {
            duration: 250
        });
    }
    /**
     * Make a tick label drillable, or remove drilling on update.
     * @internal
     */
    function tickDrillable() {
        var pos = this.pos,
            label = this.label,
            axis = this.axis,
            isDrillable = axis.coll === 'xAxis' && axis.getDDPoints,
            ddPointsX = isDrillable && axis.getDDPoints(pos),
            styledMode = axis.chart.styledMode;
        if (isDrillable) {
            if (label && ddPointsX && ddPointsX.length) {
                label.drillable = true;
                if (!label.basicStyles && !styledMode) {
                    label.basicStyles = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(label.styles);
                }
                label.addClass('highcharts-drilldown-axis-label');
                // #12656 - avoid duplicate of attach event
                if (label.removeOnDrillableClick) {
                    (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.removeEvent)(label.element, 'click');
                }
                label.removeOnDrillableClick = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.addEvent)(label.element, 'click', function (e) {
                    e.preventDefault();
                    axis.drilldownCategory(pos, e);
                });
                if (!styledMode && axis.chart.options.drilldown) {
                    label.css(axis.chart.options.drilldown.activeAxisLabelStyle || {});
                }
            }
            else if (label &&
                label.drillable && label.removeOnDrillableClick) {
                if (!styledMode) {
                    label.styles = {}; // Reset for full overwrite of styles
                    label.element.removeAttribute('style'); // #17933
                    label.css(label.basicStyles);
                }
                label.removeOnDrillableClick(); // #3806
                label.removeClass('highcharts-drilldown-axis-label');
            }
        }
    }
})(Drilldown || (Drilldown = {}));
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Drilldown_Drilldown = (Drilldown);
/* *
 *
 *  API Declarations
 *
 * */
/**
 * Gets fired when a drilldown point is clicked, before the new series is added.
 * Note that when clicking a category label to trigger multiple series
 * drilldown, one `drilldown` event is triggered per point in the category.
 *
 * @callback Highcharts.DrilldownCallbackFunction
 *
 * @param {Highcharts.Chart} this
 *        The chart where the event occurs.
 *
 * @param {Highcharts.DrilldownEventObject} e
 *        The drilldown event.
 */
/**
 * The event arguments when a drilldown point is clicked.
 *
 * @interface Highcharts.DrilldownEventObject
 */ /**
* If a category label was clicked, which index.
* @name Highcharts.DrilldownEventObject#category
* @type {number|undefined}
*/ /**
* The original browser event (usually click) that triggered the drilldown.
* @name Highcharts.DrilldownEventObject#originalEvent
* @type {global.Event|undefined}
*/ /**
* Prevents the default behavior of the event.
* @name Highcharts.DrilldownEventObject#preventDefault
* @type {Function}
*/ /**
* The originating point.
* @name Highcharts.DrilldownEventObject#point
* @type {Highcharts.Point}
*/ /**
* If a category label was clicked, this array holds all points corresponding to
* the category. Otherwise it is set to false.
* @name Highcharts.DrilldownEventObject#points
* @type {boolean|Array<Highcharts.Point>|undefined}
*/ /**
* Options for the new series. If the event is utilized for async drilldown, the
* seriesOptions are not added, but rather loaded async.
* @name Highcharts.DrilldownEventObject#seriesOptions
* @type {Highcharts.SeriesOptionsType|undefined}
*/ /**
* The event target.
* @name Highcharts.DrilldownEventObject#target
* @type {Highcharts.Chart}
*/ /**
* The event type.
* @name Highcharts.DrilldownEventObject#type
* @type {"drilldown"}
*/
/**
 * This gets fired after all the series have been drilled up. This is especially
 * useful in a chart with multiple drilldown series.
 *
 * @callback Highcharts.DrillupAllCallbackFunction
 *
 * @param {Highcharts.Chart} this
 *        The chart where the event occurs.
 *
 * @param {Highcharts.DrillupAllEventObject} e
 *        The final drillup event.
 */
/**
 * The event arguments when all the series have been drilled up.
 *
 * @interface Highcharts.DrillupAllEventObject
 */ /**
* Prevents the default behavior of the event.
* @name Highcharts.DrillupAllEventObject#preventDefault
* @type {Function}
*/ /**
* The event target.
* @name Highcharts.DrillupAllEventObject#target
* @type {Highcharts.Chart}
*/ /**
* The event type.
* @name Highcharts.DrillupAllEventObject#type
* @type {"drillupall"}
*/
/**
 * Gets fired when drilling up from a drilldown series.
 *
 * @callback Highcharts.DrillupCallbackFunction
 *
 * @param {Highcharts.Chart} this
 *        The chart where the event occurs.
 *
 * @param {Highcharts.DrillupEventObject} e
 *        The drillup event.
 */
/**
 * The event arguments when drilling up from a drilldown series.
 *
 * @interface Highcharts.DrillupEventObject
 */ /**
* Prevents the default behavior of the event.
* @name Highcharts.DrillupEventObject#preventDefault
* @type {Function}
*/ /**
* Options for the new series.
* @name Highcharts.DrillupEventObject#seriesOptions
* @type {Highcharts.SeriesOptionsType|undefined}
*/ /**
* The event target.
* @name Highcharts.DrillupEventObject#target
* @type {Highcharts.Chart}
*/ /**
* The event type.
* @name Highcharts.DrillupEventObject#type
* @type {"drillup"}
*/
''; // Keeps doclets above in JS file

;// ./code/es5/es-modules/masters/modules/drilldown.src.js





var G = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default());
G.Breadcrumbs = G.Breadcrumbs || Breadcrumbs_Breadcrumbs;
Drilldown_Drilldown.compose(G.Axis, G.Chart, G.defaultOptions, G.Series, G.seriesTypes, G.SVGRenderer, G.Tick);
/* harmony default export */ var drilldown_src = ((highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()));

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});