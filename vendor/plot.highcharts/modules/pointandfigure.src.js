// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highstock JS v13.0.0 (2026-06-11)
 * @module highcharts/modules/pointandfigure
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Point and figure series type for Highcharts Stock
 *
 * (c) 2010-2026 Highsoft AS
 *
 * Author: Kamil Musiałowski
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(root["_Highcharts"], root["_Highcharts"]["SeriesRegistry"]);
	else if(typeof define === 'function' && define.amd)
		define("highcharts/modules/pointandfigure", ["highcharts/highcharts"], function (amd1) {return factory(amd1,amd1["SeriesRegistry"]);});
	else if(typeof exports === 'object')
		exports["highcharts/modules/pointandfigure"] = factory(root["_Highcharts"], root["_Highcharts"]["SeriesRegistry"]);
	else
		root["Highcharts"] = factory(root["Highcharts"], root["Highcharts"]["SeriesRegistry"]);
})(typeof window === 'undefined' ? this : window, function(__WEBPACK_EXTERNAL_MODULE__944__, __WEBPACK_EXTERNAL_MODULE__512__) {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
  "default": function() { return /* binding */ pointandfigure_src; }
});

// EXTERNAL MODULE: external {"amd":["highcharts/highcharts"],"commonjs":["highcharts"],"commonjs2":["highcharts"],"root":["Highcharts"]}
var highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_ = __webpack_require__(944);
var highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default = /*#__PURE__*/__webpack_require__.n(highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_);
;// ./code/es5/es-modules/Data/ColumnUtils.js
/* *
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Dawid Draguła
 *
 * */
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/* *
*
* Functions
*
* */
/**
 * Sets the length of the column array.
 *
 * @param {DataTableColumn} column
 * Column to be modified.
 *
 * @param {number} length
 * New length of the column.
 *
 * @param {boolean} asSubarray
 * If column is a typed array, return a subarray instead of a new array. It
 * is faster `O(1)`, but the entire buffer will be kept in memory until all
 * views of it are destroyed. Default is `false`.
 *
 * @return {DataTableColumn}
 * Modified column.
 *
 * @private
 */
function setLength(column, length, asSubarray) {
    if (Array.isArray(column)) {
        column.length = length;
        return column;
    }
    return column[asSubarray ? 'subarray' : 'slice'](0, length);
}
/**
 * Splices a column array.
 *
 * @param {DataTableColumn} column
 * Column to be modified.
 *
 * @param {number} start
 * Index at which to start changing the array.
 *
 * @param {number} deleteCount
 * An integer indicating the number of old array elements to remove.
 *
 * @param {boolean} removedAsSubarray
 * If column is a typed array, return a subarray instead of a new array. It
 * is faster `O(1)`, but the entire buffer will be kept in memory until all
 * views to it are destroyed. Default is `true`.
 *
 * @param {Array<number>|TypedArray} items
 * The elements to add to the array, beginning at the start index. If you
 * don't specify any elements, `splice()` will only remove elements from the
 * array.
 *
 * @return {SpliceResult}
 * Object containing removed elements and the modified column.
 *
 * @private
 */
function splice(column, start, deleteCount, removedAsSubarray, items) {
    if (items === void 0) { items = []; }
    if (Array.isArray(column)) {
        if (!Array.isArray(items)) {
            items = Array.from(items);
        }
        return {
            removed: column.splice.apply(column, __spreadArray([start, deleteCount], items, false)),
            array: column
        };
    }
    var Constructor = Object.getPrototypeOf(column)
            .constructor;
    var removed = column[removedAsSubarray ? 'subarray' : 'slice'](start,
        start + deleteCount);
    var newLength = column.length - deleteCount + items.length;
    var result = new Constructor(newLength);
    result.set(column.subarray(0, start), 0);
    result.set(items, start);
    result.set(column.subarray(start + deleteCount), start + items.length);
    return {
        removed: removed,
        array: result
    };
}
/**
 * Converts a cell value to a number.
 *
 * @param {DataTableCellType} value
 * Cell value to convert to a number.
 *
 * @param {boolean} useNaN
 * If `true`, returns `NaN` for non-numeric values; if `false`,
 * returns `null` instead.
 *
 * @return {number | null}
 * Number or `null` if the value is not a number.
 *
 * @private
 */
function convertToNumber(value, useNaN) {
    switch (typeof value) {
        case 'boolean':
            return (value ? 1 : 0);
        case 'number':
            return (isNaN(value) && !useNaN ? null : value);
        default:
            value = parseFloat("".concat(value !== null && value !== void 0 ? value : ''));
            return (isNaN(value) && !useNaN ? null : value);
    }
}
/* *
 *
 *  Default Export
 *
 * */
var ColumnUtils = {
    convertToNumber: convertToNumber,
    setLength: setLength,
    splice: splice
};
/* harmony default export */ var Data_ColumnUtils = (ColumnUtils);

;// ./code/es5/es-modules/Data/DataTableCore.js
/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Gøran Slettemark
 *  - Torstein Hønsi
 *
 * */


var DataTableCore_setLength = Data_ColumnUtils.setLength, DataTableCore_splice = Data_ColumnUtils.splice;


/* *
 *
 *  Class
 *
 * */
/**
 * Class to manage columns and rows in a table structure. It provides methods
 * to add, remove, and manipulate columns and rows, as well as to retrieve data
 * from specific cells.
 *
 * Highcharts allows passing a `DataTable` or a configuration object for a data
 * table in the `dataTable` property, either chart-level
 * [dataTable](https://api.highcharts.com/highcharts/dataTable) or as
 * [series.dataTable](https://api.highcharts.com/highcharts/series.dataTable).
 * The `DataTable` is then used as a source for the series data points, mapped
 * by the `series.dataMapping` option.
 *
 * After chart instantiation, the data table can be accessed from the series as
 * `series.dataTable`. CRUD operations on the data table will be reflected in
 * the chart.
 *
 * @example
 * const dataTable = new Highcharts.DataTable({
 *   columns: {
 *     year: [2020, 2021, 2022, 2023],
 *     cost: [11, 13, 12, 14],
 *     revenue: [12, 15, 14, 18]
 *   }
 * });
 *
 * @class
 * @name Highcharts.DataTable
 *
 * @param {Highcharts.DataTableOptionsObject} [options]
 * Options to initialize the new DataTable instance.
 */
var DataTableCore = /** @class */ (function () {
    function DataTableCore(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.isDataTable = true;
        this.autoId = !options.id;
        this.columns = {};
        this.id = (options.id || (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.uniqueKey)());
        this.rowCount = 0;
        this.versionTag = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.uniqueKey)();
        var rowCount = 0;
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.objectEach)(options.columns || {}, function (column, columnId) {
            _this.columns[columnId] = column.slice();
            rowCount = Math.max(rowCount, column.length);
        });
        this.applyRowCount(rowCount);
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Applies a row count to the table by setting the `rowCount` property and
     * adjusting the length of all columns.
     *
     * @private
     * @param {number} rowCount The new row count.
     */
    DataTableCore.prototype.applyRowCount = function (rowCount) {
        var _this = this;
        this.rowCount = rowCount;
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.objectEach)(this.columns, function (column, columnId) {
            if (column.length !== rowCount) {
                _this.columns[columnId] = DataTableCore_setLength(column, rowCount);
            }
        });
    };
    /**
     * Delete rows. Simplified version of the full
     * `DataTable.deleteRows` method.
     *
     * @sample highcharts/datatable/live-chart/
     *       Add and delete rows in a live chart
     * @sample highcharts/datatable/shared-with-grid/
     *       Chart with data table CRUD operations
     *
     * @function Highcharts.DataTable#deleteRows
     *
     * @param {number} rowIndex
     * The start row index
     *
     * @param {number} [rowCount=1]
     * The number of rows to delete
     *
     * @return {void}
     *
     * @emits #afterDeleteRows
     */
    DataTableCore.prototype.deleteRows = function (rowIndex, rowCount) {
        var _this = this;
        if (rowCount === void 0) { rowCount = 1; }
        if (rowCount > 0 && rowIndex < this.rowCount) {
            var length_1 = 0;
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.objectEach)(this.columns, function (column, columnId) {
                _this.columns[columnId] =
                    DataTableCore_splice(column, rowIndex, rowCount).array;
                length_1 = column.length;
            });
            this.rowCount = length_1;
        }
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(this, 'afterDeleteRows', { rowIndex: rowIndex, rowCount: rowCount });
        this.versionTag = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.uniqueKey)();
    };
    /**
     * Fetches the given column by the canonical column ID. Simplified version
     * of the full `DataTable.getRow` method, always returning by reference.
     *
     * @function Highcharts.DataTable#setColumn
     *
     * @param {string} columnId
     * ID of the column to get.
     *
     * @return {Highcharts.DataTableColumn|undefined}
     * A copy of the column, or `undefined` if not found.
     */
    DataTableCore.prototype.getColumn = function (columnId, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asReference) {
        return this.columns[columnId];
    };
    /**
     * Retrieves all or the given columns. Simplified version of the full
     * `DataTable.getColumns` method, always returning by reference.
     *
     * @function Highcharts.DataTable#getColumns
     *
     * @param {Array<string>} [columnIds]
     * Column ids to retrieve.
     *
     * @return {Highcharts.DataTableColumnCollection}
     * Collection of columns. If a requested column was not found, it is
     * `undefined`.
     */
    DataTableCore.prototype.getColumns = function (columnIds, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asReference) {
        var _this = this;
        return (columnIds || Object.keys(this.columns)).reduce(function (columns, columnId) {
            columns[columnId] = _this.columns[columnId];
            return columns;
        }, {});
    };
    /**
     * Retrieves the row at a given index.
     *
     * @function Highcharts.DataTable#getRowObject
     *
     * @param {number} rowIndex
     * Row index to retrieve. First row has index 0.
     *
     * @param {Array<string>} [columnNames]
     * Column names to retrieve.
     *
     * @return {Record<string, number|string|undefined>|undefined}
     * Returns the row values, or `undefined` if not found.
     */
    DataTableCore.prototype.getRowObject = function (rowIndex, columnNames) {
        var _a;
        var row = {},
            columns = this.columns;
        columnNames !== null && columnNames !== void 0 ? columnNames : (columnNames = Object.keys(this.columns));
        for (var _i = 0, columnNames_1 = columnNames; _i < columnNames_1.length; _i++) {
            var columnName = columnNames_1[_i];
            row[columnName] = (_a = columns[columnName]) === null || _a === void 0 ? void 0 : _a[rowIndex];
        }
        return row;
    };
    /**
     * Sets cell values for a column. Will insert a new column, if not found.
     *
     * @function Highcharts.DataTable#setColumn
     *
     * @param {string} columnId
     * Column name to set.
     *
     * @param {Highcharts.DataTableColumn} [column]
     * Values to set in the column.
     *
     * @param {number} [rowIndex]
     * Index of the first row to change. (Default: 0)
     *
     * @param {Record<string, (boolean|number|string|null|undefined)>} [eventDetail]
     * Custom information for pending events.
     *
     * @emits #setColumns
     * @emits #afterSetColumns
     */
    DataTableCore.prototype.setColumn = function (columnId, column, rowIndex, eventDetail) {
        var _a;
        if (column === void 0) { column = []; }
        if (rowIndex === void 0) { rowIndex = 0; }
        this.setColumns((_a = {}, _a[columnId] = column, _a), rowIndex, eventDetail);
    };
    /**
     * Sets cell values for multiple columns. Will insert new columns, if not
     * found. Simplified version of the full `DataTable.setColumns`, limited
     * to full replacement of the columns (undefined `rowIndex`).
     *
     * @sample highcharts/datatable/shared-with-grid/
     *       Chart with data table CRUD operations
     *
     * @function Highcharts.DataTable#setColumns
     *
     * @param {Highcharts.DataTableColumnCollection} columns
     * Columns as a collection, where the keys are the column names.
     *
     * @param {number} [rowIndex]
     * Index of the first row to change. Ignored in the simplified `DataTable`,
     * as it always replaces the full column.
     *
     * @param {Record<string, (boolean|number|string|null|undefined)>} [eventDetail]
     * Custom information for pending events.
     *
     * @emits #setColumns
     * @emits #afterSetColumns
     */
    DataTableCore.prototype.setColumns = function (columns, rowIndex, eventDetail) {
        var _this = this;
        var rowCount = this.rowCount;
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.objectEach)(columns, function (column, columnId) {
            _this.columns[columnId] = column.slice();
            rowCount = column.length;
        });
        this.applyRowCount(rowCount);
        if (!(eventDetail === null || eventDetail === void 0 ? void 0 : eventDetail.silent)) {
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(this, 'afterSetColumns');
            this.versionTag = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.uniqueKey)();
        }
    };
    /**
     * Sets cell values of a row. Will insert a new row if no index was
     * provided, or if the index is higher than the total number of table rows.
     * A simplified version of the full `DateTable.setRow`, limited to objects.
     *
     * @sample highcharts/datatable/live-chart/
     *       Add and delete rows in a live chart
     * @sample stock/datatable/live-candlestick/
     *       Live candlestick
     * @sample highcharts/datatable/shared-with-grid/
     *       Chart with data table CRUD operations
     *
     * @function Highcharts.DataTable#setRow
     *
     * @param {Record<string, number|string|undefined>} row
     * Cell values to set.
     *
     * @param {number} [rowIndex]
     * Index of the row to set. Leave `undefined` to add as a new row.
     *
     * @param {boolean} [insert]
     * Whether to insert the row at the given index, or to overwrite the row.
     *
     * @param {Record<string, (boolean|number|string|null|undefined)>} [eventDetail]
     * Custom information for pending events.
     *
     * @emits #afterSetRows
     */
    DataTableCore.prototype.setRow = function (row, rowIndex, insert, eventDetail) {
        var _a;
        if (rowIndex === void 0) { rowIndex = this.rowCount; }
        var columns = this.columns,
            indexRowCount = insert ? this.rowCount + 1 : rowIndex + 1,
            rowKeys = Object.keys(row);
        if ((eventDetail === null || eventDetail === void 0 ? void 0 : eventDetail.addColumns) !== false) {
            for (var i = 0, iEnd = rowKeys.length; i < iEnd; i++) {
                columns[_a = rowKeys[i]] || (columns[_a] = new Array(this.rowCount));
            }
        }
        (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.objectEach)(columns, function (column, columnId) {
            if (column) {
                if (insert) {
                    column = DataTableCore_splice(column, rowIndex, 0, true, [row[columnId]]).array;
                }
                else {
                    column[rowIndex] =
                        // Preserve explicit null and undefined but fall back
                        // to existing value if the new row does not have the
                        // key
                        columnId in row ?
                            row[columnId] :
                            column[rowIndex];
                }
                columns[columnId] = column;
            }
        });
        this.applyRowCount(Math.max(indexRowCount, this.rowCount));
        if (!(eventDetail === null || eventDetail === void 0 ? void 0 : eventDetail.silent)) {
            (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.fireEvent)(this, 'afterSetRows', { rowIndex: rowIndex });
            this.versionTag = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.uniqueKey)();
        }
    };
    /**
     * Returns the modified (clone) or the original data table if the modified
     * one does not exist.
     *
     * @return {Highcharts.DataTable}
     * The modified (clone) or the original data table.
     */
    DataTableCore.prototype.getModified = function () {
        return this.modified || this;
    };
    return DataTableCore;
}());
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Data_DataTableCore = (DataTableCore);
/* *
 *
 *  API Declarations
 *
 * */
/**
 * A collection of data table columns defined by a object where the key is the
 * column ID and the value is an array of the column values. Typed arrays are
 * supported.
 *
 * @type {Highcharts.DataTableColumnCollection|undefined}
 * @apioption dataTable.columns
 */
/**
 * Custom ID to identify the new DataTable instance.
 *
 * @type {string|undefined}
 * @apioption dataTable.id
 */
/**
 * A typed array.
 * @typedef {Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} Highcharts.TypedArray
 */ /**
* A column of values in a data table.
* @typedef {Array<boolean|null|number|string|undefined>|Highcharts.TypedArray} Highcharts.DataTableColumn
*/ /**
* A collection of data table columns defined by a object where the key is the
* column ID and the value is an array of the column values. Typed arrays are
* supported.
* @typedef {Record<string, Highcharts.DataTableColumn>} Highcharts.DataTableColumnCollection
*/
/**
 * Options for the `DataTable` or `DataTableCore` classes.
 * @interface Highcharts.DataTableOptionsObject
 */ /**
* The column options for the data table. The columns are defined by an object
* where the key is the column ID and the value is an array of the column
* values.
*
* @name Highcharts.DataTableOptionsObject.columns
* @type {Highcharts.DataTableColumnCollection|undefined}
*/ /**
* Custom ID to identify the new DataTable instance.
*
* @name Highcharts.DataTableOptionsObject.id
* @type {string|undefined}
*/
(''); // Keeps doclets above in JS file

// EXTERNAL MODULE: external {"amd":["highcharts/highcharts","SeriesRegistry"],"commonjs":["highcharts","SeriesRegistry"],"commonjs2":["highcharts","SeriesRegistry"],"root":["Highcharts","SeriesRegistry"]}
var highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_ = __webpack_require__(512);
var highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default = /*#__PURE__*/__webpack_require__.n(highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_);
;// ./code/es5/es-modules/Series/PointAndFigure/PointAndFigurePoint.js
/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Kamil Musiałowski
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
/* *
*
*  Imports
*
* */

var ScatterPoint = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes.scatter.prototype.pointClass;
/* *
 *
 *  Class
 *
 * */
/**
 * @private
 * @class
 */
var PointAndFigurePoint = /** @class */ (function (_super) {
    __extends(PointAndFigurePoint, _super);
    function PointAndFigurePoint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Functions
     *
     * */
    PointAndFigurePoint.prototype.resolveMarker = function () {
        var seriesOptions = this.series.options;
        this.marker = this.options.marker =
            this.upTrend ? seriesOptions.markerUp : seriesOptions.marker;
        this.color = this.options.marker.lineColor;
    };
    PointAndFigurePoint.prototype.resolveColor = function () {
        _super.prototype.resolveColor.call(this);
        this.resolveMarker();
    };
    /**
     * Extend the parent method by adding up or down to the class name.
     * @private
     * @function Highcharts.seriesTypes.pointandfigure#getClassName
     */
    PointAndFigurePoint.prototype.getClassName = function () {
        return _super.prototype.getClassName.call(this) +
            (this.upTrend ?
                ' highcharts-point-up' :
                ' highcharts-point-down');
    };
    return PointAndFigurePoint;
}(ScatterPoint));
/* *
 *
 *  Export Default
 *
 * */
/* harmony default export */ var PointAndFigure_PointAndFigurePoint = (PointAndFigurePoint);

;// ./code/es5/es-modules/Series/PointAndFigure/PointAndFigureSeriesDefaults.js
/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Kamil Musiałowski
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
 * The Point and Figure series represents changes in stock price movements,
 * without focusing on the time and volume. Each data point is created when the
 * `boxSize` criteria is met. Opposite column of points gets created only when
 * the `reversalAmount` threshold is met.
 *
 * @sample stock/demo/pointandfigure/
 *         Point and Figure series
 *
 * @extends      plotOptions.scatter
 * @product      highstock
 * @excluding    boostBlending, boostThreshold, compare, compareBase,
 *               compareStart, cumulative, cumulativeStart, dataGrouping,
 *               dataGrouping, dragDrop
 * @requires     modules/pointandfigure
 * @optionparent plotOptions.pointandfigure
 */
var PointAndFigureSeriesDefaults = {
    boxSize: '1%',
    reversalAmount: 3,
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
            '<b> {series.name}</b><br/>' +
            'Close: {point.y:.2f}<br/>',
        headerFormat: ''
    },
    turboThreshold: 0,
    groupPadding: 0.2,
    pointPadding: 0.1,
    pointRange: null,
    dataGrouping: {
        enabled: false
    },
    markerUp: {
        symbol: 'cross',
        lineColor: '#00FF00',
        lineWidth: 2
    },
    marker: {
        symbol: 'circle',
        fillColor: 'transparent',
        lineColor: '#FF0000',
        lineWidth: 2
    },
    legendSymbol: 'lineMarker'
};
/* *
 *
 *  API Options
 *
 * */
/**
 * A `pointandfigure` series. If the [type](#series.pointandfigure.type)
 * option is not specified, it is inherited from [chart.type](
 * #chart.type).
 *
 * @type      {*}
 * @extends   series,plotOptions.pointandfigure
 * @product   highstock
 * @excluding boostBlending, boostThreshold, compare, compareBase,
 *            compareStart, cumulative, cumulativeStart, dataGrouping,
 *            dataGrouping, dragDrop
 * @requires  modules/pointandfigure
 * @apioption series.pointandfigure
 */
/**
 * An array of data points for the series. For the `pointandfigure` series
 * type, points can be given in the following way:
 *
 * 1. An array of arrays with 2 values. In this case, the values correspond
 *    to `x, y`. Y values are parsed under the hood to create
 *    point and figure format data points.
 *    ```js
 *    data: [
 *        [1665408600000, 140.42],
 *        [1665495000000, 138.98],
 *        [1665581400000, 138.34]
 *    ]
 *    ```
 * 2. An array of objects with named values `{x, y}`.
 *    ```js
 *    data: [
 *        {x: 1665408600000, y: 140.42},
 *        {x: 1665495000000, y: 138.98},
 *        {x: 1665581400000, y: 138.34}
 *    ]
 *    ```
 *
 * @basic
 * @type      {Array<Array<number,number>|*>}
 * @extends   series.scatter.data
 * @product   highstock
 * @apioption series.pointandfigure.data
 */
/**
 * Price increment that determines if a new point should be added to the column.
 *
 *
 * @type      {string|number}
 * @since 12.0.0
 * @product   highstock
 * @apioption plotOptions.pointandfigure.boxSize
 */
/**
 * Threshold that should be met to create a new column in opposite direction.
 *
 *
 * @type      {number}
 * @since 12.0.0
 * @product   highstock
 * @apioption plotOptions.pointandfigure.reversalAmount
 */
/**
 * Marker options for the up direction column, inherited from `series.marker`
 * options.
 *
 * @extends   plotOptions.series.marker
 * @product   highstock
 * @apioption plotOptions.pointandfigure.markerUp
 */
''; // Keeps doclets above detached
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var PointAndFigure_PointAndFigureSeriesDefaults = (PointAndFigureSeriesDefaults);

;// ./code/es5/es-modules/Series/CrossSymbol.js
/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Authors: Kamil Musiałowski, Markus Barstad
 *
 *  Shared cross marker symbol registration used by series modules.
 *  This keeps `cross` out of Core SVG symbols while allowing modules
 *  like PointAndFigure and Contour to compose it when needed.
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
var CrossSymbol;
(function (CrossSymbol) {
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Register the shared `cross` symbol on a renderer class.
     *
     * @private
     */
    function compose(SVGRendererClass) {
        if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pushUnique)(composed, 'Series.CrossSymbol')) {
            SVGRendererClass.prototype.symbols.cross = cross;
        }
    }
    CrossSymbol.compose = compose;
    /**
     * Cross marker path.
     * @private
     */
    function cross(x, y, w, h) {
        return [
            ['M', x, y],
            ['L', x + w, y + h],
            ['M', x + w, y],
            ['L', x, y + h],
            ['Z']
        ];
    }
})(CrossSymbol || (CrossSymbol = {}));
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var Series_CrossSymbol = (CrossSymbol);

;// ./code/es5/es-modules/Series/PointAndFigure/PointAndFigureSeries.js
/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Kamil Musiałowski
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

var PointAndFigureSeries_extends = (undefined && undefined.__extends) || (function () {
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
 *  Imports
 *
 * */







var PointAndFigureSeries_composed = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()).composed;
var _a = (highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default()).seriesTypes, ScatterSeries = _a.scatter, columnProto = _a.column.prototype;
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
/* *
 *
 *  Class
 *
 * */
/**
 * The series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pointandfigure
 *
 * @augments Highcharts.Series
 */
var PointAndFigureSeries = /** @class */ (function (_super) {
    PointAndFigureSeries_extends(PointAndFigureSeries, _super);
    function PointAndFigureSeries() {
        /* *
         *
         *  Static Properties
         *
        * */
        var _this = _super !== null && _super.apply(this,
            arguments) || this;
        _this.allowDG = false;
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    PointAndFigureSeries.compose = function (SVGRendererClass) {
        if ((0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.pushUnique)(PointAndFigureSeries_composed, 'pointandfigure')) {
            Series_CrossSymbol.compose(SVGRendererClass);
        }
    };
    /* *
     *
     *  Functions
     *
     * */
    PointAndFigureSeries.prototype.init = function () {
        _super.prototype.init.apply(this, arguments);
        this.pnfDataGroups = [];
    };
    PointAndFigureSeries.prototype.getProcessedData = function () {
        if (!this.pnfDataGroups) {
            return {
                modified: this.dataTable.getModified(),
                cropped: false,
                cropStart: 0,
                closestPointRange: 1
            };
        }
        var series = this, options = series.options, xData = series.getColumn('x', true), yData = series.getColumn('y', true), boxSize = options.boxSize, calculatedBoxSize = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.isNumber)(boxSize) ?
                boxSize : (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.relativeLength)(boxSize, yData[0]), pnfDataGroups = series.pnfDataGroups, reversal = calculatedBoxSize * options.reversalAmount, dataTable = this.dataTable.getModified(), modified = dataTable === this.dataTable ?
                dataTable :
                new Data_DataTableCore();
        series.calculatedBoxSize = calculatedBoxSize;
        var upTrend;
        /**
         * Get the Y value of last data point, from the last PNF group.
         * @private
         * @function Highcharts.seriesTypes.pointandfigure#getLastPoint
         */
        function getLastPoint(pnfDataGroups) {
            var y = pnfDataGroups[pnfDataGroups.length - 1].y;
            return y[y.length - 1];
        }
        /**
         * Push new data point to the last PNF group.
         * @private
         * @function Highcharts.seriesTypes.pointandfigure#pushNewPoint
         */
        function pushNewPoint(y, upTrend, lastPoint) {
            var currPointGroup = pnfDataGroups[pnfDataGroups.length - 1],
                flipFactor = upTrend ? 1 : -1,
                times = Math.floor(flipFactor * (y - lastPoint) / calculatedBoxSize);
            for (var i = 1; i <= times; i++) {
                var newPoint = lastPoint + flipFactor * (calculatedBoxSize * i);
                currPointGroup.y.push(newPoint);
            }
        }
        if (this.isDirtyData || pnfDataGroups.length === 0) {
            this.pnfDataGroups.length = 0;
            // Get first point and determine its symbol and trend
            for (var i = 0; i < yData.length; i++) {
                var x = xData[i],
                    close_1 = yData[i],
                    firstPoint = yData[0];
                if (close_1 - firstPoint >= calculatedBoxSize) {
                    upTrend = true;
                    pnfDataGroups.push({ x: x, y: [close_1], upTrend: upTrend });
                    break;
                }
                if (firstPoint - close_1 >= calculatedBoxSize) {
                    upTrend = false;
                    pnfDataGroups.push({ x: x, y: [close_1], upTrend: upTrend });
                    break;
                }
            }
            yData.forEach(function (close, i) {
                var x = xData[i],
                    lastPoint = getLastPoint(pnfDataGroups);
                if (upTrend) {
                    // Add point going UP
                    if (close - lastPoint >= calculatedBoxSize) {
                        pushNewPoint(close, upTrend, lastPoint);
                    }
                    if (lastPoint - close >= reversal) { // Handle reversal
                        upTrend = false;
                        pnfDataGroups.push({ x: x, y: [], upTrend: upTrend });
                        pushNewPoint(close, upTrend, lastPoint);
                    }
                }
                if (!upTrend) {
                    // Add point going DOWN
                    if (lastPoint - close >= calculatedBoxSize) {
                        pushNewPoint(close, upTrend, lastPoint);
                    }
                    if (close - lastPoint >= reversal) { // Handle reversal
                        upTrend = true;
                        pnfDataGroups.push({ x: x, y: [], upTrend: upTrend });
                        pushNewPoint(close, upTrend, lastPoint);
                    }
                }
            });
        }
        // Process the pnfDataGroups to HC series format
        var finalData = [];
        var processedXData = [];
        var processedYData = [];
        var processedUpTrendData = [];
        pnfDataGroups.forEach(function (point) {
            var x = point.x,
                upTrend = point.upTrend;
            point.y.forEach(function (y) {
                processedXData.push(x);
                processedYData.push(y);
                processedUpTrendData.push(upTrend);
                finalData.push({
                    x: x,
                    y: y,
                    upTrend: upTrend
                });
            });
        });
        modified.setColumn('x', processedXData);
        modified.setColumn('y', processedYData);
        modified.setColumn('upTrend', processedUpTrendData);
        series.pnfDataGroups = pnfDataGroups;
        series.hasProcessedDataTable = true;
        return {
            modified: modified,
            cropped: false,
            cropStart: 0,
            closestPointRange: 1
        };
    };
    PointAndFigureSeries.prototype.markerAttribs = function (point) {
        var series = this,
            options = series.options,
            attribs = {},
            pos = point.pos();
        attribs.width = series.markerWidth;
        attribs.height = series.markerHeight;
        if (pos && attribs.width && attribs.height) {
            attribs.x = pos[0] - Math.round(attribs.width) / 2;
            attribs.y = pos[1] - Math.round(attribs.height) / 2;
        }
        if (options.crisp && attribs.x) {
            // Math.floor for #1843:
            attribs.x = Math.floor(attribs.x);
        }
        return attribs;
    };
    PointAndFigureSeries.prototype.translate = function () {
        var metrics = this.getColumnMetrics(),
            calculatedBoxSize = this.calculatedBoxSize;
        this.markerWidth = metrics.width + metrics.paddedWidth + metrics.offset;
        this.markerHeight =
            this.yAxis.toPixels(0) - this.yAxis.toPixels(calculatedBoxSize);
        _super.prototype.translate.call(this);
    };
    PointAndFigureSeries.defaultOptions = (0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.merge)(ScatterSeries.defaultOptions, PointAndFigure_PointAndFigureSeriesDefaults);
    return PointAndFigureSeries;
}(ScatterSeries));
(0,highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_.extend)(PointAndFigureSeries.prototype, {
    takeOrdinalPosition: true,
    pnfDataGroups: [],
    getColumnMetrics: columnProto.getColumnMetrics,
    pointClass: PointAndFigure_PointAndFigurePoint,
    sorted: true
});
highcharts_SeriesRegistry_commonjs_highcharts_SeriesRegistry_commonjs2_highcharts_SeriesRegistry_root_Highcharts_SeriesRegistry_default().registerSeriesType('pointandfigure', PointAndFigureSeries);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ var PointAndFigure_PointAndFigureSeries = (PointAndFigureSeries);

;// ./code/es5/es-modules/masters/modules/pointandfigure.src.js




var G = (highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default());
PointAndFigure_PointAndFigureSeries.compose(G.Renderer);
/* harmony default export */ var pointandfigure_src = ((highcharts_commonjs_highcharts_commonjs2_highcharts_root_Highcharts_default()));

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});