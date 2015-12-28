'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class to manage chrome apis around tabs
 *
 * @author john
 * @version 12/27/15 10:19 PM
 */

(function () {

  var SETTINGS_KEY = 'settings';

  var ACTIVE_QUERY = {
    currentWindow: true,
    status: 'complete',
    active: true
  };

  var TabManager = (function () {
    function TabManager() {
      _classCallCheck(this, TabManager);
    }

    _createClass(TabManager, [{
      key: 'getActiveTab',
      value: function getActiveTab() {

        return chrome.promise.tabs.query(ACTIVE_QUERY).then(function () {
          var tabs = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

          if (!tabs.length) throw new Error('No active tab!');

          return tabs[0];
        });
      }
    }, {
      key: 'checkIfExtensionIsOn',
      value: function checkIfExtensionIsOn() {
        chrome.promise.storage.sync.get(SETTINGS_KEY);
      }
    }]);

    return TabManager;
  })();
})();