'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @author john
 * @version 4/18/16 1:45 AM
 */

var d = console.log.bind(console);
var BOLD = 'font-weight: bold;';
var NORMAL = 'font-weight: normal;';
var TAB_LOGS_URL = 'https://google.com/';

var types = {
  UNDEF: 'undefined',
  NULL: 'object',
  BOOL: 'boolean',
  NUM: 'number',
  STR: 'string',
  SYM: 'symbol'
};

function __log() {

  var params = [];
  var colors = [];
  var string = '';

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = args.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var index = _step$value[0];
      var arg = _step$value[1];


      if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === types.STR) {
        if (arg.startsWith('%b')) {
          string += arg + ' ';
          colors.push(BOLD);
        } else if (arg.startsWith('%n')) {
          string += arg + ' ';
          colors.push(NORMAL);
        }
      } else {
        params.push(arg);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  d(args);
}