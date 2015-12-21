'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author john
 * @version 12/21/15 2:38 AM
 */

(function (root) {

  var START = 1;
  var END = 360;

  var INTERVALS = 'intervals';

  var storage = chrome.promise.storage;

  var ExtStorage = (function () {
    function ExtStorage() {
      _classCallCheck(this, ExtStorage);
    }

    _createClass(ExtStorage, [{
      key: 'cleanInterval',
      value: function cleanInterval(val) {
        val = parseInt(val, 10);
        return -val > 0 ? -val : val;
      }
    }, {
      key: 'getInterval',
      value: function getInterval() {
        var tab = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        d('getInter', tab);
        var id = tab.id;
        return storage.sync.get(id + '').then(function (resp) {
          d('get interval', resp);
          return resp[id];
        }).then(function () {
          var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var _ref$start = _ref.start;
          var start = _ref$start === undefined ? START : _ref$start;
          var _ref$end = _ref.end;
          var end = _ref$end === undefined ? END : _ref$end;
          return { start: start, end: end, id: id };
        });
      }
    }, {
      key: 'saveCurrent',
      value: function saveCurrent(start, end, tab) {

        var id = tab.id;
        var data = _defineProperty({}, id + '', { start: start, end: end, id: id });

        return storage.sync.set(data);
      }
    }, {
      key: 'saveNew',
      value: function saveNew(tab) {
        var id = tab.id;
        var data = _defineProperty({}, id + '', { start: START, end: END, id: id });

        return storage.sync.set(data);
      }
    }, {
      key: 'setter',
      value: function setter(data) {
        return storage.sync.set(data);
      }
    }, {
      key: 'getIsOff',
      value: function getIsOff() {
        return storage.sync.get('global').then(function () {
          var resp = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          d('OFF', resp);
          return resp.off;
        });
      }
    }, {
      key: 'getGlobalInterval',
      value: function getGlobalInterval() {
        return storage.sync.get(INTERVALS);
      }
    }, {
      key: 'saveGlobalInterval',
      value: function saveGlobalInterval(start, end) {

        start = this.cleanInterval(start);
        end = this.cleanInterval(end);

        var data = _defineProperty({}, INTERVALS, { start: start, end: end });

        return storage.sync.set(data);
      }
    }]);

    return ExtStorage;
  })();

  root.ExtStorage = ExtStorage;
})(window);