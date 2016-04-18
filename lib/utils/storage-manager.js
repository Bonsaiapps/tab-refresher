'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 *
 * @author john
 * @version 12/29/15 7:25 AM
 */

(function () {

  var VALID_TYPES = ['after', 'before'];
  var SETTINGS_KEY = 'settings';
  var TABS_KEY = 'tabs';
  var REFRESH_LOGS = 'refresh-logs';

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
        return storage.local.get(SETTINGS_KEY).then(function (_ref) {
          var _ref$settings = _ref.settings;
          var settings = _ref$settings === undefined ? {} : _ref$settings;

          if (!settings.on) throw new Error('Extension is off!');
          return true;
        });
      }
    }, {
      key: 'saveGlobalSettings',
      value: function saveGlobalSettings() {
        var settings = _defineProperty({}, SETTINGS_KEY, { on: true });
        d('Saving Settings', settings);
        return storage.local.set(settings);
      }
    }, {
      key: 'disableGlobalSettings',
      value: function disableGlobalSettings() {
        var settings = _defineProperty({}, SETTINGS_KEY, { on: false });
        d('Saving Settings', settings);
        return storage.local.set(settings);
      }
    }, {
      key: 'getSavedInterval',
      value: function getSavedInterval(tab) {
        return storage.local.get(TABS_KEY).then(function (_ref2) {
          var _ref2$tabs = _ref2.tabs;
          var tabs = _ref2$tabs === undefined ? {} : _ref2$tabs;

          var interval = tabs[tab.id];
          if (!interval) return { start: START, end: END, id: tab.id };
          interval.start = parseInt(interval.start, 10);
          interval.end = parseInt(interval.end, 10);
          return interval;
        });
      }
    }, {
      key: 'getAllIntervals',
      value: function getAllIntervals(chromeTabs) {
        return storage.local.get(TABS_KEY).then(function (_ref3) {
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

          storage.local.set(_defineProperty({}, TABS_KEY, storageTabsToSave));

          return needAlarms;
        });
      }
    }, {
      key: 'saveInterval',
      value: function saveInterval(tab, start, end) {
        return storage.local.get(TABS_KEY).then(function (_ref4) {
          var _ref4$tabs = _ref4.tabs;
          var tabs = _ref4$tabs === undefined ? {} : _ref4$tabs;

          d('SAVED', tabs);
          tabs[tab.id] = {
            start: start,
            end: end,
            id: tab.id
          };

          var saved = _defineProperty({}, TABS_KEY, tabs);
          return storage.local.set(saved);
        });
      }
    }, {
      key: 'saveTabRefresh',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(id) {
          var type = arguments.length <= 1 || arguments[1] === undefined ? 'before' : arguments[1];
          var tab, resultObject, results;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (VALID_TYPES.includes(type)) {
                    _context.next = 2;
                    break;
                  }

                  throw new Error('Type not valid. ' + type + ' given.');

                case 2:
                  _context.next = 4;
                  return chrome.promise.tabs.get(id);

                case 4:
                  tab = _context.sent;
                  _context.next = 7;
                  return storage.local.get(REFRESH_LOGS);

                case 7:
                  resultObject = _context.sent;
                  _context.next = 10;
                  return resultObject[REFRESH_LOGS];

                case 10:
                  _context.t0 = _context.sent;

                  if (_context.t0) {
                    _context.next = 13;
                    break;
                  }

                  _context.t0 = [];

                case 13:
                  results = _context.t0;


                  results.push({
                    type: type,
                    tab_id: tab.id,
                    url: tab.url,
                    date: new Date().toLocaleString()
                  });

                  _context.next = 17;
                  return storage.local.set(_defineProperty({}, REFRESH_LOGS, results));

                case 17:
                  return _context.abrupt('return', _context.sent);

                case 18:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function saveTabRefresh(_x, _x2) {
          return ref.apply(this, arguments);
        }

        return saveTabRefresh;
      }()
    }, {
      key: 'clearTabStorage',
      value: function clearTabStorage() {
        return storage.local.remove(TABS_KEY);
      }
    }, {
      key: 'clearLogs',
      value: function clearLogs() {
        return storage.local.remove(REFRESH_LOGS);
      }
    }]);

    return StorageManager;
  }();

  window.StorageManager = StorageManager;
})();