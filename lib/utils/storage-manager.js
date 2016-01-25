'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 *
 * @author john
 * @version 12/29/15 7:25 AM
 */

(function () {

  var SETTINGS_KEY = 'settings';
  var LAST_TAB_KEY = 'lastTab';

  var _chrome$promise = chrome.promise;
  var storage = _chrome$promise.storage;
  var windows = _chrome$promise.windows;

  var StorageManager = (function () {
    function StorageManager() {
      _classCallCheck(this, StorageManager);
    }

    _createClass(StorageManager, [{
      key: 'checkIfExtensionIsOn',
      value: function checkIfExtensionIsOn() {
        return storage.sync.get(SETTINGS_KEY).then(function (_ref) {
          var _ref$settings = _ref.settings;
          var settings = _ref$settings === undefined ? {} : _ref$settings;

          d('Storage Settings Response', settings);
          if (!settings.yes) throw new Error('Extension is off!');
          return settings;
        });
      }
    }, {
      key: 'saveGlobalSettings',
      value: function saveGlobalSettings() {
        var _win = undefined;
        return windows.getCurrent().then(function (win) {
          _win = win;
          var settings = _defineProperty({}, SETTINGS_KEY, { yes: true, windowId: win.id });
          return storage.sync.set(settings);
        }).then(function () {
          return _win;
        });
      }
    }, {
      key: 'disableGlobalSettings',
      value: function disableGlobalSettings() {
        var settings = _defineProperty({}, SETTINGS_KEY, { yes: false });
        d('Saving Settings', settings);
        return storage.sync.set(settings);
      }
    }, {
      key: 'getTimestampTab',
      value: function getTimestampTab(tab) {
        return storage.sync.get(tab.id + '').then(function (tabData) {
          var data = tabData[tab.id] || {};
          d('TAB', tab);
          d('Saved tab data', data);
          return data;
        });
      }
    }, {
      key: 'saveLast',
      value: function saveLast(saveList) {
        var last = saveList[saveList.length - 1];
        d('Saving last', last);
        var obj = _defineProperty({}, LAST_TAB_KEY, last);
        return storage.sync.set(obj).then(function () {

          var date = new Date().getTime();
          var saveObj = {};
          saveList.forEach(function (tab) {
            var current = { id: tab.id, url: tab.url, index: tab.index, timestamp: date };
            saveObj[current.id] = current;
          });

          //let tabsObj = { [TABS_KEY]: saveObj}
          return storage.sync.set(saveObj);
        });
      }
    }, {
      key: 'getLast',
      value: function getLast() {
        return storage.sync.get(LAST_TAB_KEY).then(function (obj) {
          return obj[LAST_TAB_KEY];
        });
      }
    }]);

    return StorageManager;
  })();

  window.StorageManager = StorageManager;
})();