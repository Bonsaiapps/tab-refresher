'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

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
  var TABS_KEY = 'tabloids';
  var INTERVAL_KEY = 'intervals';

  var START = 1;
  var END = 360;

  var storage = chrome.promise.storage;

  var StorageManager = function () {
    function StorageManager() {
      _classCallCheck(this, StorageManager);
    }

    _createClass(StorageManager, [{
      key: 'areAllEnabled',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
          var data;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return storage.local.get(_defineProperty({}, SETTINGS_KEY, { enabled: false }));

                case 2:
                  data = _context.sent;
                  return _context.abrupt('return', data[SETTINGS_KEY].enabled);

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function areAllEnabled() {
          return ref.apply(this, arguments);
        }

        return areAllEnabled;
      }()
    }, {
      key: 'isTabEnabled',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(id) {
          var data;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return storage.local.get(_defineProperty({}, TABS_KEY, _defineProperty({}, id, {})));

                case 2:
                  data = _context2.sent;
                  return _context2.abrupt('return', data[TABS_KEY][id].enabled);

                case 4:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function isTabEnabled(_x) {
          return ref.apply(this, arguments);
        }

        return isTabEnabled;
      }()
    }, {
      key: 'canTabProceed',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(id) {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return this.areAllEnabled();

                case 2:
                  _context3.t0 = _context3.sent;

                  if (_context3.t0) {
                    _context3.next = 7;
                    break;
                  }

                  _context3.next = 6;
                  return this.isTabEnabled(id);

                case 6:
                  _context3.t0 = _context3.sent;

                case 7:
                  return _context3.abrupt('return', _context3.t0);

                case 8:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function canTabProceed(_x2) {
          return ref.apply(this, arguments);
        }

        return canTabProceed;
      }()
    }, {
      key: 'disableTab',
      value: function disableTab(id) {
        return this.enableTab(id, false);
      }
    }, {
      key: 'enableTab',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(id) {
          var _this = this;

          var on = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
          var data;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return storage.local.get(_defineProperty({}, TABS_KEY, _defineProperty({}, id, {})));

                case 2:
                  data = _context4.sent;

                  data[TABS_KEY][id].enabled = on;
                  return _context4.abrupt('return', storage.local.set(data).catch(function (err) {
                    return _this.clearLogs();
                  }));

                case 5:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function enableTab(_x3, _x4) {
          return ref.apply(this, arguments);
        }

        return enableTab;
      }()
    }, {
      key: 'enableAll',
      value: function enableAll() {
        var _this2 = this;

        var on = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

        d('Set global to: %c%s', BOLD, on ? 'enabled' : 'disabled');
        return storage.local.set(_defineProperty({}, SETTINGS_KEY, { enabled: on })).catch(function (err) {
          return _this2.clearLogs();
        });
      }
    }, {
      key: 'disableAll',
      value: function disableAll() {
        return this.enableAll(false);
      }
    }, {
      key: 'getSavedInterval',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(tab) {
          var data;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return storage.local.get(_defineProperty({}, INTERVAL_KEY, {}));

                case 2:
                  data = _context5.sent;
                  _context5.next = 5;
                  return data[INTERVAL_KEY][tab.id];

                case 5:
                  _context5.t0 = _context5.sent;

                  if (_context5.t0) {
                    _context5.next = 8;
                    break;
                  }

                  _context5.t0 = this._defaultInterval(tab);

                case 8:
                  return _context5.abrupt('return', _context5.t0);

                case 9:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function getSavedInterval(_x7) {
          return ref.apply(this, arguments);
        }

        return getSavedInterval;
      }()
    }, {
      key: '_defaultInterval',
      value: function _defaultInterval(tab) {
        var id = tab.id;
        var start = START;
        var end = END;

        return { id: id, start: start, end: end };
      }
    }, {
      key: 'getAllIntervals',
      value: function getAllIntervals(chromeTabs) {
        var _this3 = this;

        return storage.local.get(TABS_KEY).then(function (_ref) {
          var _ref$tabs = _ref.tabs;
          var tabs = _ref$tabs === undefined ? {} : _ref$tabs;


          var needAlarms = [];
          var storageTabsToSave = {};
          chromeTabs.forEach(function (tab) {
            var interval = tabs[tab.id];

            if (!interval) interval = { start: START, end: END, id: tab.id };
            needAlarms.push(interval);
            storageTabsToSave[tab.id] = interval;
          });

          storage.local.set(_defineProperty({}, TABS_KEY, storageTabsToSave)).catch(function (err) {
            return _this3.clearLogs();
          });

          return needAlarms;
        });
      }
    }, {
      key: 'saveInterval',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(tab, start, end) {
          var id, url, data, interval;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  id = tab.id;
                  url = tab.url;

                  start = parseInt(start, 10);
                  end = parseInt(end, 10);

                  if (!(isNaN(start) || isNaN(end))) {
                    _context6.next = 6;
                    break;
                  }

                  throw new Error('Range values must be integers');

                case 6:

                  if (!start) start = 1;
                  if (!end) end = 1;

                  _context6.next = 10;
                  return storage.local.get(_defineProperty({}, INTERVAL_KEY, {}));

                case 10:
                  data = _context6.sent;
                  interval = { id: id, url: url, start: start, end: end };

                  data[INTERVAL_KEY][tab.id] = interval;

                  _context6.prev = 13;
                  _context6.next = 16;
                  return storage.local.set(data);

                case 16:
                  _context6.next = 21;
                  break;

                case 18:
                  _context6.prev = 18;
                  _context6.t0 = _context6['catch'](13);

                  this.clearLogs();

                case 21:
                  return _context6.abrupt('return', interval);

                case 22:
                case 'end':
                  return _context6.stop();
              }
            }
          }, _callee6, this, [[13, 18]]);
        }));

        function saveInterval(_x8, _x9, _x10) {
          return ref.apply(this, arguments);
        }

        return saveInterval;
      }()
    }, {
      key: 'saveTabRefresh',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(id) {
          var type = arguments.length <= 1 || arguments[1] === undefined ? 'before' : arguments[1];
          var tab, resultObject, results;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  if (VALID_TYPES.includes(type)) {
                    _context7.next = 2;
                    break;
                  }

                  throw new Error('Type not valid. ' + type + ' given.');

                case 2:
                  _context7.next = 4;
                  return chrome.promise.tabs.get(id);

                case 4:
                  tab = _context7.sent;
                  _context7.next = 7;
                  return storage.local.get(REFRESH_LOGS);

                case 7:
                  resultObject = _context7.sent;
                  _context7.next = 10;
                  return resultObject[REFRESH_LOGS];

                case 10:
                  _context7.t0 = _context7.sent;

                  if (_context7.t0) {
                    _context7.next = 13;
                    break;
                  }

                  _context7.t0 = [];

                case 13:
                  results = _context7.t0;


                  results.push({
                    type: type,
                    tab_id: tab.id,
                    url: tab.url,
                    date: new Date().toLocaleString()
                  });

                  _context7.next = 17;
                  return storage.local.set(_defineProperty({}, REFRESH_LOGS, results));

                case 17:
                  return _context7.abrupt('return', _context7.sent);

                case 18:
                case 'end':
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function saveTabRefresh(_x11, _x12) {
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