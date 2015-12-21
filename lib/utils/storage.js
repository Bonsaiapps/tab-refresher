'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author john
 * @version 12/21/15 2:38 AM
 */

(function (root) {

  var PERIOD = 'period';

  var storage = chrome.promise.storage;

  var ExtStorage = (function () {
    function ExtStorage() {
      _classCallCheck(this, ExtStorage);
    }

    _createClass(ExtStorage, [{
      key: 'getInterval',
      value: function getInterval() {
        return storage.sync.get(PERIOD);
      }
    }, {
      key: 'cleanInterval',
      value: function cleanInterval(val) {
        val = parseInt(val, 10);
        return -val > 0 ? -val : val;
      }
    }, {
      key: 'saveInterval',
      value: function saveInterval(period) {
        d('per', period);

        var data = _defineProperty({}, PERIOD, period);

        return storage.sync.set(data);
      }
    }]);

    return ExtStorage;
  })();

  root.ExtStorage = ExtStorage;
})(window);