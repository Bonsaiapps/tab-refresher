'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
  var TABS_KEY = 'tabs';

  var START = 1;
  var END = 360;

  var storage = chrome.promise.storage;

  var StorageManager = function () {
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
          if (!settings.on) throw new Error('Extension is off!');
          return true;
        });
      }
    }, {
      key: 'saveGlobalSettings',
      value: function saveGlobalSettings() {
        var settings = _defineProperty({}, SETTINGS_KEY, { on: true });
        d('Saving Settings', settings);
        return storage.sync.set(settings);
      }
    }, {
      key: 'disableGlobalSettings',
      value: function disableGlobalSettings() {
        var settings = _defineProperty({}, SETTINGS_KEY, { on: false });
        d('Saving Settings', settings);
        return storage.sync.set(settings);
      }
    }, {
      key: 'getSavedInterval',
      value: function getSavedInterval(tab) {
        return storage.sync.get(TABS_KEY).then(function (_ref2) {
          var _ref2$tabs = _ref2.tabs;
          var tabs = _ref2$tabs === undefined ? {} : _ref2$tabs;

          d('Saved Interval Results', 'id', tab.id, 'Results', tabs);
          var interval = tabs[tab.id];
          if (!interval) return { start: START, end: END, id: tab.id };
          return interval;
        });
      }
    }, {
      key: 'getAllIntervals',
      value: function getAllIntervals(chromeTabs) {
        return storage.sync.get(TABS_KEY).then(function (_ref3) {
          var _ref3$tabs = _ref3.tabs;
          var tabs = _ref3$tabs === undefined ? {} : _ref3$tabs;


          var needAlarms = [];
          var storageTabsToSave = {};
          chromeTabs.forEach(function (tab) {
            var interval = tabs[tab.id];

            if (!interval) interval = { start: START, end: END, id: tab.id };
            needAlarms.push(interval);
            storageTabsToSave[tab.id] = interval;
          });

          storage.sync.set(_defineProperty({}, TABS_KEY, storageTabsToSave));

          return needAlarms;
        });
      }
    }, {
      key: 'saveInterval',
      value: function saveInterval(tab, start, end) {
        return storage.sync.get(TABS_KEY).then(function (_ref4) {
          var _ref4$tabs = _ref4.tabs;
          var tabs = _ref4$tabs === undefined ? {} : _ref4$tabs;

          d('SAVED', tabs);
          tabs[tab.id] = {
            start: start,
            end: end,
            id: tab.id
          };

          var saved = _defineProperty({}, TABS_KEY, tabs);
          return storage.sync.set(saved);
        });
      }
    }, {
      key: 'saveTabUrl',
      value: function saveTabUrl(id) {
        return chrome.promise.tabs.get(id).then(function (tab) {
          return storage.sync.get(TABS_KEY).then(function (_ref5) {
            var _ref5$tabs = _ref5.tabs;
            var tabs = _ref5$tabs === undefined ? {} : _ref5$tabs;

            d('SAVED', tabs);
            tabs[tab.id].url = tab.url;
            var saved = _defineProperty({}, TABS_KEY, tabs);
            return storage.sync.set(saved);
          });
        });
      }
    }]);

    return StorageManager;
  }();

  window.StorageManager = StorageManager;
})();