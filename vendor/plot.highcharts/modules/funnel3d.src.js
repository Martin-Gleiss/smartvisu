// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v13.0.0 (2026-06-11)
 * @module highcharts/modules/funnel3d
 * @requires highcharts
 * @requires highcharts/highcharts-3d
 * @requires highcharts/modules/cylinder
 *
 * Highcharts funnel module
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Kacper Madej
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(root["_Highcharts"], root["_Highcharts"]["SVGRenderer"], root["_Highcharts"]["Color"], root["_Highcharts"]["SVGElement"], root["_Highcharts"]["SeriesRegistry"]);
	else if(typeof define === 'function' && define.amd)
		define("highcharts/modules/funnel3d", ["highcharts/highcharts"], function (amd1) {return factory(amd1,amd1["SVGRenderer"],amd1["Color"],amd1["SVGElement"],amd1["SeriesRegistry"]);});
	else if(typeof exports === 'object')
		exports["highcharts/modules/funnel3d"] = factory(root["_Highcharts"], root["_Highcharts"]["SVGRenderer"], root["_Highcharts"]["Color"], root["_Highcharts"]["SVGElement"], root["_Highcharts"]["SeriesRegistry"]);
	else
		root["Highcharts"] = factory(root["Highcharts"], root["Highcharts"]["SVGRenderer"], root["Highcharts"]["Color"], root["Highcharts"]["SVGElement"], root["Highcharts"]["SeriesRegistry"]);
})(typeof window === 'undefined' ? this : window, function(__WEBPACK_EXTERNAL_MODULE__944__, __WEBPACK_EXTERNAL_MODULE__540__, __WEBPACK_EXTERNAL_MODULE__620__, __WEBPACK_EXTERNAL_MODULE__28__, __WEBPACK_EXTERNAL_MODULE__512__) {
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

/***/ 540:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__540__;

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
  "default": function() { return /* binding */ funnel3d_src; }
});

// EXTERNAL MODULE: external {"amd":["highcharts/highcharts"],"commonjs":["highcharts"],"commonjs2":["highcharts"],"root":["Highcharts"]}
var highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_ = __webpack_require__(944);
var highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default = /*#__PURE__*/__webpack_require__.n(highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_);
// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","SVGRenderer"],"commonjs":["highcharts","SVGRenderer"],"commonjs2":["highcharts","SVGRenderer"],"root":["Highcharts","SVGRenderer"]}
var highcharts_SVGRenderer_commonjs_highcharts_SVGRenderer_commonjs2_highcharts_SVGRenderer_root_Highcharts_SVGRenderer_ = __webpack_require__(540);
var highcharts_SVGRenderer_commonjs_highcharts_SVGRenderer_commonjs2_highcharts_SVGRenderer_root_Highcharts_SVGRenderer_default = /*#__PURE__*/__webpack_require__.n(highcharts_SVGRenderer_commonjs_highcharts_SVGRenderer_commonjs2_highcharts_SVGRenderer_root_Highcharts_SVGRenderer_);
// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","Color"],"commonjs":["highcharts","Color"],"commonjs2":["highcharts","Color"],"root":["Highcharts","Color"]}
var highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_ = __webpack_require__(620);
var highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_default = /*#__PURE__*/__webpack_require__.n(highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_);
// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","SVGElement"],"commonjs":["highcharts","SVGElement"],"commonjs2":["highcharts","SVGElement"],"root":["Highcharts","SVGElement"]}
var highcharts_SVGElement_commonjs_highcharts_SVGElement_commonjs2_highcharts_SVGElement_root_Highcharts_SVGElement_ = __webpack_require__(28);
var highcharts_SVGElement_commonjs_highcharts_SVGElement_commonjs2_highcharts_SVGElement_root_Highcharts_SVGElement_default = /*#__PURE__*/__webpack_require__.n(highcharts_SVGElement_commonjs_highcharts_SVGElement_commonjs2_highcharts_SVGElement_root_Highcharts_SVGElement_);
;// ./code/es5/es-modules/Core/Renderer/SVG/SVGElement3D.js
/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Extensions to the SVGRenderer class to enable 3D shapes
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

var color = (highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_default()).parse;


/* *
 *
 *  Class
 *
 * */
/** @internal */
var SVGElement3D = /** @class */ (function (_super) {
    __extends(SVGElement3D, _super);
    function SVGElement3D() {
        /* *
         *
         *  Static Properties
         *
         * */
        var _this = _super !== null && _super.apply(this,
            arguments) || this;
        /* *
         *
         *  Properties
         *
         * */
        _this.parts = ['front', 'top', 'side'];
        _this.pathType = 'cuboid';
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * The init is used by base - renderer.Element
     * @internal
     */
    SVGElement3D.prototype.initArgs = function (args) {
        var elem3d = this,
            renderer = elem3d.renderer,
            paths = renderer[elem3d.pathType + 'Path'](args),
            zIndexes = paths.zIndexes;
        // Build parts
        for (var _i = 0, _a = elem3d.parts; _i < _a.length; _i++) {
            var part = _a[_i];
            var attribs = {
                    'class': 'highcharts-3d-' + part,
                    zIndex: zIndexes[part] || 0
                };
            if (renderer.styledMode) {
                if (part === 'top') {
                    attribs.filter = 'url(#highcharts-brighter)';
                }
                else if (part === 'side') {
                    attribs.filter = 'url(#highcharts-darker)';
                }
            }
            elem3d[part] = renderer.path(paths[part])
                .attr(attribs)
                .add(elem3d);
        }
        elem3d.attr({
            'stroke-linejoin': 'round',
            zIndex: zIndexes.group
        });
        // Store information if any side of element was rendered by force.
        elem3d.forcedSides = paths.forcedSides;
    };
    /**
     * Single property setter that applies options to each part
     * @internal
     */
    SVGElement3D.prototype.singleSetterForParts = function (prop, val, values, verb, duration, complete) {
        var elem3d = this,
            newAttr = {},
            optionsToApply = [null,
            null, (verb || 'attr'),
            duration,
            complete],
            hasZIndexes = values === null || values === void 0 ? void 0 : values.zIndexes;
        if (!values) {
            newAttr[prop] = val;
            optionsToApply[0] = newAttr;
        }
        else {
            // It is needed to deal with the whole group zIndexing
            // in case of graph rotation
            if (hasZIndexes === null || hasZIndexes === void 0 ? void 0 : hasZIndexes.group) {
                elem3d.attr({
                    zIndex: hasZIndexes.group
                });
            }
            for (var _i = 0, _a = Object.keys(values); _i < _a.length; _i++) {
                var part = _a[_i];
                newAttr[part] = {};
                newAttr[part][prop] = values[part];
                // Include zIndexes if provided
                if (hasZIndexes) {
                    newAttr[part].zIndex = values.zIndexes[part] || 0;
                }
            }
            optionsToApply[1] = newAttr;
        }
        return this.processParts.apply(elem3d, optionsToApply);
    };
    /**
     * Calls function for each part. Used for attr, animate and destroy.
     * @internal
     */
    SVGElement3D.prototype.processParts = function (props, partsProps, verb, duration, complete) {
        var elem3d = this;
        for (var _i = 0, _a = elem3d.parts; _i < _a.length; _i++) {
            var part = _a[_i];
            // If different props for different parts
            if (partsProps) {
                props = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(partsProps[part], false);
            }
            // Only if something to set, but allow undefined
            if (props !== false) {
                elem3d[part][verb](props, duration, complete);
            }
        }
        return elem3d;
    };
    /**
     * Destroy all parts
     * @internal
     */
    SVGElement3D.prototype.destroy = function () {
        this.processParts(null, null, 'destroy');
        return _super.prototype.destroy.call(this);
    };
    // Following functions are SVGElement3DCuboid (= base)
    /** @internal */
    SVGElement3D.prototype.attr = function (args, val, complete, continueAnimation) {
        // Resolve setting attributes by string name
        if (typeof args === 'string' && typeof val !== 'undefined') {
            var key = args;
            args = {};
            args[key] = val;
        }
        if (args.shapeArgs || (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(args.x)) {
            return this.singleSetterForParts('d', null, this.renderer[this.pathType + 'Path'](args.shapeArgs || args));
        }
        return _super.prototype.attr.call(this, args, void 0, complete, continueAnimation);
    };
    /** @internal */
    SVGElement3D.prototype.animate = function (args, duration, complete) {
        if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(args.x) && (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.defined)(args.y)) {
            var paths = this.renderer[this.pathType + 'Path'](args),
                forcedSides = paths.forcedSides;
            this.singleSetterForParts('d', null, paths, 'animate', duration, complete);
            this.attr({
                zIndex: paths.zIndexes.group
            });
            // If sides that are forced to render changed, recalculate colors.
            if (forcedSides !== this.forcedSides) {
                this.forcedSides = forcedSides;
                if (!this.renderer.styledMode) {
                    this.fillSetter(this.fill);
                }
            }
        }
        else {
            _super.prototype.animate.call(this, args, duration, complete);
        }
        return this;
    };
    /** @internal */
    SVGElement3D.prototype.fillSetter = function (fill) {
        var elem3d = this;
        elem3d.forcedSides = elem3d.forcedSides || [];
        elem3d.singleSetterForParts('fill', null, {
            front: fill,
            // Do not change color if side was forced to render.
            top: color(fill).brighten(elem3d.forcedSides.indexOf('top') >= 0 ? 0 : 0.1).get(),
            side: color(fill).brighten(elem3d.forcedSides.indexOf('side') >= 0 ? 0 : -0.1).get()
        });
        // Fill for animation getter (#6776)
        elem3d.color = elem3d.fill = fill;
        return elem3d;
    };
    SVGElement3D.types = {
        base: SVGElement3D,
        cuboid: SVGElement3D
    };
    return SVGElement3D;
}((highcharts_SVGElement_commonjs_highcharts_SVGElement_commonjs2_highcharts_SVGElement_root_Highcharts_SVGElement_default())));
/* *
 *
 *  Default Export
 *
 * */
/** @internal */
/* harmony default export */ var SVG_SVGElement3D = (SVGElement3D);

;// ./code/es5/es-modules/Series/Funnel3D/SVGElement3DFunnel.js
/* *
 *
 *  Highcharts funnel3d series module
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Kacper Madej
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

var SVGElement3DFunnel_extends = (undefined && undefined.__extends) || (function () {
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

var SVGElement3DFunnel_color = (highcharts_Color_commonjs_highcharts_Color_commonjs2_highcharts_Color_root_Highcharts_Color_default()).parse;

var charts = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).charts;


/* *
 *
 *  Class
 *
 * */
var SVGElement3DFunnel = /** @class */ (function (_super) {
    SVGElement3DFunnel_extends(SVGElement3DFunnel, _super);
    function SVGElement3DFunnel() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this,
            arguments) || this;
        _this.mainParts = ['top', 'bottom'];
        _this.parts = [
            'top', 'bottom',
            'frontUpper', 'backUpper',
            'frontLower', 'backLower',
            'rightUpper', 'rightLower'
        ];
        _this.sideGroups = [
            'upperGroup', 'lowerGroup'
        ];
        _this.sideParts = {
            upperGroup: ['frontUpper', 'backUpper', 'rightUpper'],
            lowerGroup: ['frontLower', 'backLower', 'rightLower']
        };
        _this.pathType = 'funnel3d';
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    // override opacity and color setters to control opacity
    SVGElement3DFunnel.prototype.opacitySetter = function (value) {
        var funnel3d = this,
            opacity = parseFloat(value),
            parts = funnel3d.parts,
            chart = charts[funnel3d.renderer.chartIndex],
            filterId = 'group-opacity-' + opacity + '-' + chart.index;
        // Use default for top and bottom
        funnel3d.parts = funnel3d.mainParts;
        funnel3d.singleSetterForParts('opacity', opacity);
        // Restore
        funnel3d.parts = parts;
        if (!chart.renderer.filterId) {
            chart.renderer.definition({
                tagName: 'filter',
                attributes: {
                    id: filterId
                },
                children: [{
                        tagName: 'feComponentTransfer',
                        children: [{
                                tagName: 'feFuncA',
                                attributes: {
                                    type: 'table',
                                    tableValues: '0 ' + opacity
                                }
                            }]
                    }]
            });
            for (var _i = 0, _a = funnel3d.sideGroups; _i < _a.length; _i++) {
                var groupName = _a[_i];
                funnel3d[groupName].attr({
                    filter: 'url(#' + filterId + ')'
                });
            }
            // Styled mode
            if (funnel3d.renderer.styledMode) {
                chart.renderer.definition({
                    tagName: 'style',
                    textContent: '.highcharts-' + filterId +
                        ' {filter:url(#' + filterId + ')}'
                });
                for (var _b = 0, _c = funnel3d.sideGroups; _b < _c.length; _b++) {
                    var groupName = _c[_b];
                    funnel3d[groupName].addClass('highcharts-' + filterId);
                }
            }
        }
        return funnel3d;
    };
    SVGElement3DFunnel.prototype.fillSetter = function (fill) {
        var fillColor = SVGElement3DFunnel_color(fill);
        // Extract alpha channel to use the opacitySetter
        var funnel3d = this,
            alpha = fillColor.rgba[3],
            partsWithColor = {
                // Standard color for top and bottom
                top: SVGElement3DFunnel_color(fill).brighten(0.1).get(),
                bottom: SVGElement3DFunnel_color(fill).brighten(-0.2).get()
            };
        if (alpha < 1) {
            fillColor.rgba[3] = 1;
            fillColor = fillColor.get('rgb');
            // Set opacity through the opacitySetter
            funnel3d.attr({
                opacity: alpha
            });
        }
        else {
            // Use default for full opacity
            fillColor = fill;
        }
        // Add gradient for sides
        if (!fillColor.linearGradient &&
            !fillColor.radialGradient &&
            funnel3d.gradientForSides) {
            fillColor = {
                linearGradient: { x1: 0, x2: 1, y1: 1, y2: 1 },
                stops: [
                    [0, SVGElement3DFunnel_color(fill).brighten(-0.2).get()],
                    [0.5, fill],
                    [1, SVGElement3DFunnel_color(fill).brighten(-0.2).get()]
                ]
            };
        }
        // Gradient support
        if (fillColor.linearGradient) {
            // Color in steps, as each gradient will generate a key
            for (var _i = 0, _a = funnel3d.sideGroups; _i < _a.length; _i++) {
                var sideGroupName = _a[_i];
                var box = funnel3d[sideGroupName].gradientBox,
                    gradient = fillColor.linearGradient,
                    alteredGradient = (0,
                    highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(fillColor, {
                        linearGradient: {
                            x1: box.x + gradient.x1 * box.width,
                            y1: box.y + gradient.y1 * box.height,
                            x2: box.x + gradient.x2 * box.width,
                            y2: box.y + gradient.y2 * box.height
                        }
                    });
                for (var _b = 0, _c = funnel3d.sideParts[sideGroupName]; _b < _c.length; _b++) {
                    var partName = _c[_b];
                    partsWithColor[partName] = alteredGradient;
                }
            }
        }
        else {
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(true, partsWithColor, {
                frontUpper: fillColor,
                backUpper: fillColor,
                rightUpper: fillColor,
                frontLower: fillColor,
                backLower: fillColor,
                rightLower: fillColor
            });
            if (fillColor.radialGradient) {
                for (var _d = 0, _e = funnel3d.sideGroups; _d < _e.length; _d++) {
                    var sideGroupName = _e[_d];
                    var gradBox = funnel3d[sideGroupName].gradientBox, centerX = gradBox.x + gradBox.width / 2, centerY = gradBox.y + gradBox.height / 2, diameter = Math.min(gradBox.width, gradBox.height);
                    for (var _f = 0, _g = funnel3d.sideParts[sideGroupName]; _f < _g.length; _f++) {
                        var partName = _g[_f];
                        funnel3d[partName].setRadialReference([
                            centerX, centerY, diameter
                        ]);
                    }
                }
            }
        }
        funnel3d.singleSetterForParts('fill', null, partsWithColor);
        // Fill for animation getter (#6776)
        funnel3d.color = funnel3d.fill = fill;
        // Change gradientUnits to userSpaceOnUse for linearGradient
        if (fillColor.linearGradient) {
            for (var _h = 0, _j = [funnel3d.frontLower, funnel3d.frontUpper]; _h < _j.length; _h++) {
                var part = _j[_h];
                var elem = part.element,
                    grad = (elem &&
                        funnel3d.renderer.gradients[elem.gradient]);
                if (grad &&
                    grad.attr('gradientUnits') !== 'userSpaceOnUse') {
                    grad.attr({
                        gradientUnits: 'userSpaceOnUse'
                    });
                }
            }
        }
        return funnel3d;
    };
    SVGElement3DFunnel.prototype.adjustForGradient = function () {
        var funnel3d = this;
        var bbox;
        for (var _i = 0, _a = funnel3d.sideGroups; _i < _a.length; _i++) {
            var sideGroupName = _a[_i];
            // Use common extremes for groups for matching gradients
            var topLeftEdge = {
                    x: Number.MAX_VALUE,
                    y: Number.MAX_VALUE
                },
                bottomRightEdge = {
                    x: -Number.MAX_VALUE,
                    y: -Number.MAX_VALUE
                };
            // Get extremes
            for (var _b = 0, _c = funnel3d.sideParts[sideGroupName]; _b < _c.length; _b++) {
                var partName = _c[_b];
                var part = funnel3d[partName];
                bbox = part.getBBox(true);
                topLeftEdge = {
                    x: Math.min(topLeftEdge.x, bbox.x),
                    y: Math.min(topLeftEdge.y, bbox.y)
                };
                bottomRightEdge = {
                    x: Math.max(bottomRightEdge.x, bbox.x + bbox.width),
                    y: Math.max(bottomRightEdge.y, bbox.y + bbox.height)
                };
            }
            // Store for color fillSetter
            funnel3d[sideGroupName].gradientBox = {
                x: topLeftEdge.x,
                width: bottomRightEdge.x - topLeftEdge.x,
                y: topLeftEdge.y,
                height: bottomRightEdge.y - topLeftEdge.y
            };
        }
    };
    SVGElement3DFunnel.prototype.zIndexSetter = function () {
        // `this.added` won't work, because zIndex is set after the prop is set,
        // but before the graphic is really added
        if (this.finishedOnAdd) {
            this.adjustForGradient();
        }
        // Run default
        return this.renderer.Element.prototype.zIndexSetter.apply(this, arguments);
    };
    SVGElement3DFunnel.prototype.onAdd = function () {
        this.adjustForGradient();
        this.finishedOnAdd = true;
    };
    return SVGElement3DFunnel;
}(SVG_SVGElement3D));
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Funnel3D_SVGElement3DFunnel = (SVGElement3DFunnel);

;// ./code/es5/es-modules/Series/Funnel3D/Funnel3DComposition.js
/* *
 *
 *  Highcharts funnel3d series module
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Kacper Madej
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */



var Funnel3DComposition_charts = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).charts;


/* *
 *
 *  Functions
 *
 * */
/** @private */
function compose(SVGRendererClass) {
    var rendererProto = SVGRendererClass.prototype;
    if (!rendererProto.funnel3d) {
        rendererProto.Element3D.types.funnel3d = Funnel3D_SVGElement3DFunnel;
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(rendererProto, {
            funnel3d: rendererFunnel3d,
            funnel3dPath: rendererFunnel3dPath
        });
    }
}
/** @private */
function rendererFunnel3d(shapeArgs) {
    var renderer = this,
        funnel3d = renderer.element3d('funnel3d',
        shapeArgs),
        styledMode = renderer.styledMode, 
        // Hide stroke for Firefox
        strokeAttrs = {
            'stroke-width': 1,
            stroke: 'none'
        };
    // Create groups for sides for opacity setter
    funnel3d.upperGroup = renderer.g('funnel3d-upper-group').attr({
        zIndex: funnel3d.frontUpper.zIndex
    }).add(funnel3d);
    for (var _i = 0, _a = [funnel3d.frontUpper, funnel3d.backUpper, funnel3d.rightUpper]; _i < _a.length; _i++) {
        var upperElem = _a[_i];
        if (!styledMode) {
            upperElem.attr(strokeAttrs);
        }
        upperElem.add(funnel3d.upperGroup);
    }
    funnel3d.lowerGroup = renderer.g('funnel3d-lower-group').attr({
        zIndex: funnel3d.frontLower.zIndex
    }).add(funnel3d);
    for (var _b = 0, _c = [funnel3d.frontLower, funnel3d.backLower, funnel3d.rightLower]; _b < _c.length; _b++) {
        var lowerElem = _c[_b];
        if (!styledMode) {
            lowerElem.attr(strokeAttrs);
        }
        lowerElem.add(funnel3d.lowerGroup);
    }
    funnel3d.gradientForSides = shapeArgs.gradientForSides;
    return funnel3d;
}
/**
 * Generates paths and zIndexes.
 * @private
 */
function rendererFunnel3dPath(shapeArgs) {
    // Check getCylinderEnd for better error message if
    // the cylinder module is missing
    if (!this.getCylinderEnd) {
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.error)('A required Highcharts module is missing: cylinder.js', true, Funnel3DComposition_charts[this.chartIndex]);
    }
    var renderer = this,
        chart = Funnel3DComposition_charts[renderer.chartIndex], 
        // Adjust angles for visible edges
        // based on alpha, selected through visual tests
        alphaCorrection = shapeArgs.alphaCorrection = 90 - Math.abs((chart.options.chart.options3d.alpha % 180) -
            90), 
        // Set zIndexes of parts based on cuboid logic, for
        // consistency
        cuboidData = this.cuboidPath.call(renderer, (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(shapeArgs, {
            depth: shapeArgs.width,
            width: (shapeArgs.width + shapeArgs.bottom.width) / 2
        })),
        isTopFirst = cuboidData.isTop,
        isFrontFirst = !cuboidData.isFront,
        hasMiddle = !!shapeArgs.middle, 
        //
        top = renderer.getCylinderEnd(chart, (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(shapeArgs, {
            x: shapeArgs.x - shapeArgs.width / 2,
            z: shapeArgs.z - shapeArgs.width / 2,
            alphaCorrection: alphaCorrection
        })),
        bottomWidth = shapeArgs.bottom.width,
        bottomArgs = (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(shapeArgs, {
            width: bottomWidth,
            x: shapeArgs.x - bottomWidth / 2,
            z: shapeArgs.z - bottomWidth / 2,
            alphaCorrection: alphaCorrection
        }),
        bottom = renderer.getCylinderEnd(chart,
        bottomArgs,
        true);
    var middleWidth = bottomWidth,
        middleTopArgs = bottomArgs,
        middleTop = bottom,
        middleBottom = bottom, 
        // Masking for cylinders or a missing part of a side shape
        useAlphaCorrection;
    if (hasMiddle) {
        middleWidth = shapeArgs.middle.width;
        middleTopArgs = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(shapeArgs, {
            y: (shapeArgs.y +
                shapeArgs.middle.fraction * shapeArgs.height),
            width: middleWidth,
            x: shapeArgs.x - middleWidth / 2,
            z: shapeArgs.z - middleWidth / 2
        });
        middleTop = renderer.getCylinderEnd(chart, middleTopArgs, false);
        middleBottom = renderer.getCylinderEnd(chart, middleTopArgs, false);
    }
    var ret = {
            top: top,
            bottom: bottom,
            frontUpper: renderer.getCylinderFront(top,
        middleTop),
            zIndexes: {
                group: cuboidData.zIndexes.group,
                top: isTopFirst !== 0 ? 0 : 3,
                bottom: isTopFirst !== 1 ? 0 : 3,
                frontUpper: isFrontFirst ? 2 : 1,
                backUpper: isFrontFirst ? 1 : 2,
                rightUpper: isFrontFirst ? 2 : 1
            }
        };
    ret.backUpper = renderer.getCylinderBack(top, middleTop);
    useAlphaCorrection = (Math.min(middleWidth, shapeArgs.width) /
        Math.max(middleWidth, shapeArgs.width)) !== 1;
    ret.rightUpper = renderer.getCylinderFront(renderer.getCylinderEnd(chart, (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(shapeArgs, {
        x: shapeArgs.x - shapeArgs.width / 2,
        z: shapeArgs.z - shapeArgs.width / 2,
        alphaCorrection: useAlphaCorrection ?
            -alphaCorrection : 0
    }), false), renderer.getCylinderEnd(chart, (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(middleTopArgs, {
        alphaCorrection: useAlphaCorrection ?
            -alphaCorrection : 0
    }), !hasMiddle));
    if (hasMiddle) {
        useAlphaCorrection = (Math.min(middleWidth, bottomWidth) /
            Math.max(middleWidth, bottomWidth)) !== 1;
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(true, ret, {
            frontLower: renderer.getCylinderFront(middleBottom, bottom),
            backLower: renderer.getCylinderBack(middleBottom, bottom),
            rightLower: renderer.getCylinderFront(renderer.getCylinderEnd(chart, (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(bottomArgs, {
                alphaCorrection: useAlphaCorrection ?
                    -alphaCorrection : 0
            }), true), renderer.getCylinderEnd(chart, (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(middleTopArgs, {
                alphaCorrection: useAlphaCorrection ?
                    -alphaCorrection : 0
            }), false)),
            zIndexes: {
                frontLower: isFrontFirst ? 2 : 1,
                backLower: isFrontFirst ? 1 : 2,
                rightLower: isFrontFirst ? 1 : 2
            }
        });
    }
    return ret;
}
/* *
 *
 *  Default Export
 *
 * */
var Funnel3DComposition = {
    compose: compose
};
/* harmony default export */ var Funnel3D_Funnel3DComposition = (Funnel3DComposition);

;// ./code/es5/es-modules/Series/Funnel3D/Funnel3DSeriesDefaults.js
/* *
 *
 *  Imports
 *
 * */
/* *
 *
 *  API Options
 *
 * */
/**
 * A funnel3d is a 3d version of funnel series type. Funnel charts are
 * a type of chart often used to visualize stages in a sales project,
 * where the top are the initial stages with the most clients.
 *
 * It requires that the `highcharts-3d.js`, `cylinder.js` and
 * `funnel3d.js` module are loaded.
 *
 * @sample highcharts/demo/funnel3d/
 *         Funnel3d
 *
 * @extends      plotOptions.column
 * @excluding    allAreas, boostThreshold, colorAxis, compare, compareBase,
 *               dataSorting, boostBlending
 * @product      highcharts
 * @since        7.1.0
 * @requires     highcharts-3d
 * @requires     modules/cylinder
 * @requires     modules/funnel3d
 * @optionparent plotOptions.funnel3d
 */
var Funnel3DSeriesDefaults = {
    /** @ignore-option */
    center: ['50%', '50%'],
    /**
     * The max width of the series compared to the width of the plot area,
     * or the pixel width if it is a number.
     *
     * @type    {number|string}
     * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
     * @product highcharts
     */
    width: '90%',
    /**
     * The width of the neck, the lower part of the funnel. A number defines
     * pixel width, a percentage string defines a percentage of the plot
     * area width.
     *
     * @type    {number|string}
     * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
     * @product highcharts
     */
    neckWidth: '30%',
    /**
     * The height of the series. If it is a number it defines
     * the pixel height, if it is a percentage string it is the percentage
     * of the plot area height.
     *
     * @type    {number|string}
     * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
     * @product highcharts
     */
    height: '100%',
    /**
     * The height of the neck, the lower part of the funnel. A number
     * defines pixel width, a percentage string defines a percentage
     * of the plot area height.
     *
     * @type    {number|string}
     * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
     * @product highcharts
     */
    neckHeight: '25%',
    /**
     * A reversed funnel has the widest area down. A reversed funnel with
     * no neck width and neck height is a pyramid.
     *
     * @product highcharts
     */
    reversed: false,
    /**
     * By default sides fill is set to a gradient through this option being
     * set to `true`. Set to `false` to get solid color for the sides.
     *
     * @product highcharts
     */
    gradientForSides: true,
    animation: false,
    edgeWidth: 0,
    colorByPoint: true,
    showInLegend: false,
    dataLabels: {
        align: 'right',
        crop: false,
        inside: false,
        overflow: 'allow'
    }
};
/**
 * A `funnel3d` series. If the [type](#series.funnel3d.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts} highcharts/demo/funnel3d/
 *         Funnel3d demo
 *
 * @since     7.1.0
 * @extends   series,plotOptions.funnel3d
 * @excluding allAreas,boostThreshold,colorAxis,compare,compareBase
 * @product   highcharts
 * @requires  highcharts-3d
 * @requires  modules/cylinder
 * @requires  modules/funnel3d
 * @apioption series.funnel3d
 */
/**
 * An array of data points for the series. For the `funnel3d` series
 * type, points can be given in the following ways:
 *
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 *
 *  ```js
 *  data: [0, 5, 3, 5]
 *  ```
 *
 * 2.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.funnel3d.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         y: 2,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         y: 4,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @basic
 * @type      {Array<number|Array<number>|*>}
 * @extends   series.column.data
 * @product   highcharts
 * @apioption series.funnel3d.data
 */
/**
 * By default sides fill is set to a gradient through this option being
 * set to `true`. Set to `false` to get solid color for the sides.
 *
 * @type      {boolean}
 * @product   highcharts
 * @apioption series.funnel3d.data.gradientForSides
 */
''; // Keeps doclets above
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Funnel3D_Funnel3DSeriesDefaults = (Funnel3DSeriesDefaults);

// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","SeriesRegistry"],"commonjs":["highcharts","SeriesRegistry"],"commonjs2":["highcharts","SeriesRegistry"],"root":["Highcharts","SeriesRegistry"]}
var highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_ = __webpack_require__(512);
var highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default = /*#__PURE__*/__webpack_require__.n(highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_);
;// ./code/es5/es-modules/Series/Funnel3D/Funnel3DPoint.js
/* *
 *
 *  Highcharts funnel3d series module
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Kacper Madej
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

var Funnel3DPoint_extends = (undefined && undefined.__extends) || (function () {
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


var ColumnSeries = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes.column;
/* *
 *
 *  Class
 *
 * */
var Funnel3DPoint = /** @class */ (function (_super) {
    Funnel3DPoint_extends(Funnel3DPoint, _super);
    function Funnel3DPoint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Funnel3DPoint;
}(ColumnSeries.prototype.pointClass));
(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(Funnel3DPoint.prototype, {
    shapeType: 'funnel3d'
});
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Funnel3D_Funnel3DPoint = (Funnel3DPoint);

;// ./code/es5/es-modules/Core/Math3D.js
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
/* *
 *
 *  Functions
 *
 * */
/* eslint-disable max-len */
/**
 * Apply 3-D rotation
 * Euler Angles (XYZ):
 *     cosA = cos(Alfa|Roll)
 *     cosB = cos(Beta|Pitch)
 *     cosG = cos(Gamma|Yaw)
 *
 * Composite rotation:
 * |          cosB * cosG             |           cosB * sinG            |    -sinB    |
 * | sinA * sinB * cosG - cosA * sinG | sinA * sinB * sinG + cosA * cosG | sinA * cosB |
 * | cosA * sinB * cosG + sinA * sinG | cosA * sinB * sinG - sinA * cosG | cosA * cosB |
 *
 * Now, Gamma/Yaw is not used (angle=0), so we assume cosG = 1 and sinG = 0, so
 * we get:
 * |     cosB    |   0    |   - sinB    |
 * | sinA * sinB |  cosA  | sinA * cosB |
 * | cosA * sinB | - sinA | cosA * cosB |
 *
 * But in browsers, y is reversed, so we get sinA => -sinA. The general result
 * is:
 * |      cosB     |   0    |    - sinB     |     | x |     | px |
 * | - sinA * sinB |  cosA  | - sinA * cosB |  x  | y |  =  | py |
 * |  cosA * sinB  |  sinA  |  cosA * cosB  |     | z |     | pz |
 *
 * @internal
 * @function rotate3D
 */
/* eslint-enable max-len */
/**
 * Rotates the position as defined in angles.
 * @internal
 * @param {number} x
 *        X coordinate
 * @param {number} y
 *        Y coordinate
 * @param {number} z
 *        Z coordinate
 * @param {Highcharts.Rotation3DObject} angles
 *        Rotation angles
 * @return {Highcharts.Position3DObject}
 *         Rotated position
 */
function rotate3D(x, y, z, angles) {
    return {
        x: angles.cosB * x - angles.sinB * z,
        y: -angles.sinA * angles.sinB * x + angles.cosA * y -
            angles.cosB * angles.sinA * z,
        z: angles.cosA * angles.sinB * x + angles.sinA * y +
            angles.cosA * angles.cosB * z
    };
}
/**
 * Transforms a given array of points according to the angles in chart.options.
 *
 * @internal
 * @function Highcharts.perspective
 *
 * @param {Array<Highcharts.Position3DObject>} points
 * The array of points
 *
 * @param {Highcharts.Chart} chart
 * The chart
 *
 * @param {boolean} [insidePlotArea]
 * Whether to verify that the points are inside the plotArea
 *
 * @param {boolean} [useInvertedPersp]
 * Whether to use inverted perspective in calculations
 *
 * @return {Array<Highcharts.Position3DObject>}
 * An array of transformed points
 *
 * @requires highcharts-3d
 */
function perspective(points, chart, insidePlotArea, useInvertedPersp) {
    var options3d = chart.options.chart.options3d, 
        /* The useInvertedPersp argument is used for inverted charts with
         * already inverted elements,
        such as dataLabels or tooltip positions.
         */
        inverted = (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(useInvertedPersp,
        insidePlotArea ? chart.inverted : false),
        origin = {
            x: chart.plotWidth / 2,
            y: chart.plotHeight / 2,
            z: options3d.depth / 2,
            vd: (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(options3d.depth, 1) * (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(options3d.viewDistance, 0)
        },
        scale = chart.scale3d || 1,
        beta = deg2rad * options3d.beta * (inverted ? -1 : 1),
        alpha = deg2rad * options3d.alpha * (inverted ? -1 : 1),
        angles = {
            cosA: Math.cos(alpha),
            cosB: Math.cos(-beta),
            sinA: Math.sin(alpha),
            sinB: Math.sin(-beta)
        };
    if (!insidePlotArea) {
        origin.x += chart.plotLeft;
        origin.y += chart.plotTop;
    }
    // Transform each point
    return points.map(function (point) {
        var rotated = rotate3D((inverted ? point.y : point.x) - origin.x, (inverted ? point.x : point.y) - origin.y, (point.z || 0) - origin.z,
            angles), 
            // Apply perspective
            coordinate = perspective3D(rotated,
            origin,
            origin.vd);
        // Apply translation
        coordinate.x = coordinate.x * scale + origin.x;
        coordinate.y = coordinate.y * scale + origin.y;
        coordinate.z = rotated.z * scale + origin.z;
        return {
            x: (inverted ? coordinate.y : coordinate.x),
            y: (inverted ? coordinate.x : coordinate.y),
            z: coordinate.z
        };
    });
}
/**
 * Perspective3D function is available in global Highcharts scope because is
 * needed also outside of perspective() function (#8042).
 * @internal
 * @function Highcharts.perspective3D
 *
 * @param {Highcharts.Position3DObject} coordinate
 * 3D position
 *
 * @param {Highcharts.Position3DObject} origin
 * 3D root position
 *
 * @param {number} distance
 * Perspective distance
 *
 * @return {Highcharts.PositionObject}
 * Perspective 3D Position
 *
 * @requires highcharts-3d
 */
function perspective3D(coordinate, origin, distance) {
    var projection = ((distance > 0) &&
            (distance < Number.POSITIVE_INFINITY)) ?
            distance / (coordinate.z + origin.z + distance) :
            1;
    return {
        x: coordinate.x * projection,
        y: coordinate.y * projection
    };
}
/**
 * Calculate a distance from camera to points - made for calculating zIndex of
 * scatter points.
 *
 * @internal
 * @function Highcharts.pointCameraDistance
 *
 * @param {Highcharts.Dictionary<number>} coordinates
 * Coordinates of the specific point
 *
 * @param {Highcharts.Chart} chart
 * Related chart
 *
 * @return {number}
 * Distance from camera to point
 *
 * @requires highcharts-3d
 */
function pointCameraDistance(coordinates, chart) {
    var options3d = chart.options.chart.options3d,
        cameraPosition = {
            x: chart.plotWidth / 2,
            y: chart.plotHeight / 2,
            z: (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(options3d.depth, 1) * (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(options3d.viewDistance, 0) +
                options3d.depth
        }, 
        // Added support for objects with plotX or x coordinates.
        distance = Math.sqrt(Math.pow(cameraPosition.x - (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(coordinates.plotX,
        coordinates.x), 2) +
            Math.pow(cameraPosition.y - (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(coordinates.plotY,
        coordinates.y), 2) +
            Math.pow(cameraPosition.z - (0,
        highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(coordinates.plotZ,
        coordinates.z), 2));
    return distance;
}
/**
 * Calculate area of a 2D polygon using Shoelace algorithm
 * https://en.wikipedia.org/wiki/Shoelace_formula
 *
 * @internal
 * @function Highcharts.shapeArea
 *
 * @param {Array<Highcharts.PositionObject>} vertexes
 * 2D Polygon
 *
 * @return {number}
 * Calculated area
 *
 * @requires highcharts-3d
 */
function shapeArea(vertexes) {
    var area = 0,
        i,
        j;
    for (i = 0; i < vertexes.length; i++) {
        j = (i + 1) % vertexes.length;
        area += vertexes[i].x * vertexes[j].y - vertexes[j].x * vertexes[i].y;
    }
    return area / 2;
}
/**
 * Calculate area of a 3D polygon after perspective projection
 *
 * @internal
 * @function Highcharts.shapeArea3d
 *
 * @param {Array<Highcharts.Position3DObject>} vertexes
 * 3D Polygon
 *
 * @param {Highcharts.Chart} chart
 * Related chart
 *
 * @param {boolean} [insidePlotArea]
 * Whether to verify that the points are inside the plotArea
 *
 * @return {number}
 * Calculated area
 *
 * @requires highcharts-3d
 */
function shapeArea3D(vertexes, chart, insidePlotArea) {
    return shapeArea(perspective(vertexes, chart, insidePlotArea));
}
/* *
 *
 *  Default Export
 *
 * */
/** @internal */
var Math3D = {
    perspective: perspective,
    perspective3D: perspective3D,
    pointCameraDistance: pointCameraDistance,
    shapeArea: shapeArea,
    shapeArea3D: shapeArea3D
};
/** @internal */
/* harmony default export */ var Core_Math3D = (Math3D);

;// ./code/es5/es-modules/Series/Funnel3D/Funnel3DSeries.js
/* *
 *
 *  Highcharts funnel3d series module
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Kacper Madej
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

var Funnel3DSeries_extends = (undefined && undefined.__extends) || (function () {
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




var noop = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).noop;

var Funnel3DSeries_perspective = Core_Math3D.perspective;

var Series = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).series, Funnel3DSeries_ColumnSeries = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes.column;

/* *
 *
 *  Class
 *
 * */
/**
 * The funnel3d series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.funnel3d
 * @augments seriesTypes.column
 * @requires highcharts-3d
 * @requires modules/cylinder
 * @requires modules/funnel3d
 */
var Funnel3DSeries = /** @class */ (function (_super) {
    Funnel3DSeries_extends(Funnel3DSeries, _super);
    function Funnel3DSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * @private
     */
    Funnel3DSeries.prototype.alignDataLabel = function (point, _dataLabel, options) {
        var series = this,
            dlBoxRaw = point.dlBoxRaw,
            inverted = series.chart.inverted,
            below = point.plotY > (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(series.translatedThreshold,
            series.yAxis.len),
            inside = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(options.inside, !!series.options.stacking),
            dlBox = {
                x: dlBoxRaw.x,
                y: dlBoxRaw.y,
                height: 0
            };
        options.align = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(options.align, !inverted || inside ? 'center' : below ? 'right' : 'left');
        options.verticalAlign = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(options.verticalAlign, inverted || inside ? 'middle' : below ? 'top' : 'bottom');
        if (options.verticalAlign !== 'top') {
            dlBox.y += dlBoxRaw.bottom /
                (options.verticalAlign === 'bottom' ? 1 : 2);
        }
        dlBox.width = series.getWidthAt(dlBox.y);
        if (series.options.reversed) {
            dlBox.width = dlBoxRaw.fullWidth - dlBox.width;
        }
        if (inside) {
            dlBox.x -= dlBox.width / 2;
        }
        else {
            // Swap for inside
            if (options.align === 'left') {
                options.align = 'right';
                dlBox.x -= dlBox.width * 1.5;
            }
            else if (options.align === 'right') {
                options.align = 'left';
                dlBox.x += dlBox.width / 2;
            }
            else {
                dlBox.x -= dlBox.width / 2;
            }
        }
        point.dlBox = dlBox;
        Funnel3DSeries_ColumnSeries.prototype.alignDataLabel.apply(series, arguments);
    };
    /**
     * Override default axis options with series required options for axes.
     * @private
     */
    Funnel3DSeries.prototype.bindAxes = function () {
        Series.prototype.bindAxes.apply(this, arguments);
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(this.xAxis.options, {
            gridLineWidth: 0,
            lineWidth: 0,
            title: void 0,
            tickPositions: []
        });
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(true, this.yAxis.options, {
            gridLineWidth: 0,
            title: void 0,
            labels: {
                enabled: false
            }
        });
    };
    /**
     * @private
     */
    Funnel3DSeries.prototype.translate = function () {
        Series.prototype.translate.apply(this, arguments);
        var series = this,
            chart = series.chart,
            options = series.options,
            reversed = options.reversed,
            ignoreHiddenPoint = options.ignoreHiddenPoint,
            plotWidth = chart.plotWidth,
            plotHeight = chart.plotHeight,
            center = options.center,
            centerX = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.relativeLength)(center[0],
            plotWidth),
            centerY = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.relativeLength)(center[1],
            plotHeight),
            width = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.relativeLength)(options.width,
            plotWidth),
            height = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.relativeLength)(options.height,
            plotHeight),
            neckWidth = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.relativeLength)(options.neckWidth,
            plotWidth),
            neckHeight = (0,
            highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.relativeLength)(options.neckHeight,
            plotHeight),
            neckY = (centerY - height / 2) + height - neckHeight,
            points = series.points;
        var sum = 0,
            cumulative = 0, // Start at top
            tempWidth,
            getWidthAt,
            fraction,
            tooltipPos, 
            //
            y1,
            y3,
            y5, 
            //
            h,
            shapeArgs; // @todo: Type it. It's an extended SVGAttributes.
            // Return the width at a specific y coordinate
            series.getWidthAt = getWidthAt = function (y) {
                var top = (centerY - height / 2);
            return (y > neckY || height === neckHeight) ?
                neckWidth :
                neckWidth + (width - neckWidth) *
                    (1 - (y - top) / (height - neckHeight));
        };
        // Expose
        series.center = [centerX, centerY, height];
        series.centerX = centerX;
        /*
            * Individual point coordinate naming:
            *
            *  _________centerX,y1________
            *  \                         /
            *   \                       /
            *    \                     /
            *     \                   /
            *      \                 /
            *        ___centerX,y3___
            *
            * Additional for the base of the neck:
            *
            *       |               |
            *       |               |
            *       |               |
            *        ___centerX,y5___
            */
        // get the total sum
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point = points_1[_i];
            if (!ignoreHiddenPoint || point.visible !== false) {
                sum += point.y;
            }
        }
        for (var _a = 0, points_2 = points; _a < points_2.length; _a++) {
            var point = points_2[_a];
            // Set start and end positions
            y5 = null;
            fraction = sum ? point.y / sum : 0;
            y1 = centerY - height / 2 + cumulative * height;
            y3 = y1 + fraction * height;
            tempWidth = getWidthAt(y1);
            h = y3 - y1;
            shapeArgs = {
                // For fill setter
                gradientForSides: (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pick)(point.options.gradientForSides, options.gradientForSides),
                x: centerX,
                y: y1,
                height: h,
                width: tempWidth,
                z: 1,
                top: {
                    width: tempWidth
                }
            };
            tempWidth = getWidthAt(y3);
            shapeArgs.bottom = {
                fraction: fraction,
                width: tempWidth
            };
            // The entire point is within the neck
            if (y1 >= neckY) {
                shapeArgs.isCylinder = true;
            }
            else if (y3 > neckY) {
                // The base of the neck
                y5 = y3;
                tempWidth = getWidthAt(neckY);
                y3 = neckY;
                shapeArgs.bottom.width = tempWidth;
                shapeArgs.middle = {
                    fraction: h ? (neckY - y1) / h : 0,
                    width: tempWidth
                };
            }
            if (reversed) {
                shapeArgs.y = y1 = centerY + height / 2 -
                    (cumulative + fraction) * height;
                if (shapeArgs.middle) {
                    shapeArgs.middle.fraction = 1 -
                        (h ? shapeArgs.middle.fraction : 0);
                }
                tempWidth = shapeArgs.width;
                shapeArgs.width = shapeArgs.bottom.width;
                shapeArgs.bottom.width = tempWidth;
            }
            point.shapeArgs = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(point.shapeArgs, shapeArgs);
            // For tooltips and data labels context
            point.percentage = fraction * 100;
            point.plotX = centerX;
            if (reversed) {
                point.plotY = centerY + height / 2 -
                    (cumulative + fraction / 2) * height;
            }
            else {
                point.plotY = (y1 + (y5 || y3)) / 2;
            }
            // Placement of tooltips and data labels in 3D
            tooltipPos = Funnel3DSeries_perspective([{
                    x: centerX,
                    y: point.plotY,
                    z: reversed ?
                        -(width - getWidthAt(point.plotY)) / 2 :
                        -(getWidthAt(point.plotY)) / 2
                }], chart, true)[0];
            point.tooltipPos = [tooltipPos.x, tooltipPos.y];
            // Base to be used when alignment options are known
            point.dlBoxRaw = {
                x: centerX,
                width: getWidthAt(point.plotY),
                y: y1,
                bottom: shapeArgs.height || 0,
                fullWidth: width
            };
            if (!ignoreHiddenPoint || point.visible !== false) {
                cumulative += fraction;
            }
        }
    };
    /* *
     *
     *  Static Properties
     *
     * */
    Funnel3DSeries.compose = Funnel3D_Funnel3DComposition.compose;
    Funnel3DSeries.defaultOptions = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(Funnel3DSeries_ColumnSeries.defaultOptions, Funnel3D_Funnel3DSeriesDefaults);
    return Funnel3DSeries;
}(Funnel3DSeries_ColumnSeries));
(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(Funnel3DSeries.prototype, {
    pointClass: Funnel3D_Funnel3DPoint,
    translate3dShapes: noop
});
highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default().registerSeriesType('funnel3d', Funnel3DSeries);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Funnel3D_Funnel3DSeries = (Funnel3DSeries);

;// ./code/es5/es-modules/masters/modules/funnel3d.src.js





Funnel3D_Funnel3DSeries.compose((highcharts_SVGRenderer_commonjs_highcharts_SVGRenderer_commonjs2_highcharts_SVGRenderer_root_Highcharts_SVGRenderer_default()));
/* harmony default export */ var funnel3d_src = ((highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()));

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});