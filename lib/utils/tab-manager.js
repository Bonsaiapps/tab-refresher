'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class to manage chrome apis around tabs
 *
 * @author john
 * @version 12/27/15 10:19 PM
 */

(function () {

  var ACTIVE_QUERY = {
    status: 'complete',
    active: true,
    currentWindow: true
  };

  var ALL_TABS_QUERY = {
    status: 'complete'
  };

  var cTabs = chrome.promise.tabs;
  var cAlarms = chrome.promise.alarms;

  var TabManager = function (_StorageManager) {
    _inherits(TabManager, _StorageManager);

    function TabManager() {
      _classCallCheck(this, TabManager);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(TabManager).apply(this, arguments));
    }

    _createClass(TabManager, [{
      key: 'getActiveTab',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
          var tabs;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return cTabs.query(ACTIVE_QUERY);

                case 2:
                  _context.t0 = _context.sent;

                  if (_context.t0) {
                    _context.next = 5;
                    break;
                  }

                  _context.t0 = [];

                case 5:
                  tabs = _context.t0;

                  if (tabs.length) {
                    _context.next = 8;
                    break;
                  }

                  throw new Error('No active tab!');

                case 8:
                  return _context.abrupt('return', tabs[0]);

                case 9:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function getActiveTab() {
          return ref.apply(this, arguments);
        }

        return getActiveTab;
      }()
    }, {
      key: 'logTabs',
      value: function logTabs(tabs, header) {
        console.groupCollapsed(header);
        tabs.forEach(function (tab) {
          var id = tab.id;
          var url = tab.url;

          d('%cid%c %d %curl%c %s', BOLD, NORMAL, id, BOLD, NORMAL, url);
        });
        d('');
      }
    }, {
      key: 'getAllTabs',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(header) {
          var tabs;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return cTabs.query(ALL_TABS_QUERY);

                case 2:
                  tabs = _context2.sent;

                  if (header) this.logTabs(tabs, header);
                  return _context2.abrupt('return', tabs);

                case 5:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function getAllTabs(_x) {
          return ref.apply(this, arguments);
        }

        return getAllTabs;
      }()
    }, {
      key: 'cleanInterval',
      value: function cleanInterval(interval) {
        interval.start = this.cleanVal(interval.start);
        interval.end = this.cleanVal(interval.end);
        return interval;
      }
    }, {
      key: 'cleanVal',
      value: function cleanVal(val) {
        val = parseInt(val, 10);
        return -val > 0 ? -val : val;
      }
    }, {
      key: 'createAlarms',
      value: function createAlarms(tabIntervals) {
        var _this2 = this;

        var promises = tabIntervals.map(function (x) {
          return _this2.createAlarm(x);
        });
        return Promise.all(promises);
      }
    }, {
      key: 'createAlarm',
      value: function createAlarm(interval) {
        this.cleanInterval(interval);
        var start = interval.start;
        var end = interval.end;
        var id = interval.id;

        var name = 'tab-' + id;
        var period = this.generateMinutes(start, end);

        d('%cNew Alarm - Name:%c %s %cRange:%c %d-%d %cPeriod:%c %d', BOLD, NORMAL, name, BOLD, NORMAL, start, end, BOLD, NORMAL, period);

        var alarmInfo = {
          // when: new Date().getTime() + 4000
          periodInMinutes: period
        };

        return chrome.alarms.create(name, alarmInfo);
      }
    }, {
      key: 'generateMinutes',
      value: function generateMinutes(start, end) {
        return Math.floor(Math.random() * (end - start) + start);
      }
    }, {
      key: 'getAlarm',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(tab) {
          var name, alarm;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  name = 'tab-' + tab.id;
                  _context3.next = 3;
                  return cAlarms.get(name);

                case 3:
                  alarm = _context3.sent;

                  if (alarm) {
                    _context3.next = 6;
                    break;
                  }

                  throw new Error('Invalid alarm name ' + name);

                case 6:
                  return _context3.abrupt('return', alarm);

                case 7:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function getAlarm(_x2) {
          return ref.apply(this, arguments);
        }

        return getAlarm;
      }()
    }, {
      key: 'removeAllAlarms',
      value: function removeAllAlarms() {
        return cAlarms.clearAll();
      }
    }, {
      key: 'removeAlarm',
      value: function removeAlarm(tab) {
        var id = tab.id;

        var name = 'tab-' + id;
        return cAlarms.clear(name);
      }
    }, {
      key: 'refreshTab',
      value: function refreshTab(id) {
        var _this3 = this;

        return this.saveTabRefresh(id).then(function () {
          return cTabs.reload(id);
        }).then(function () {
          return _this3.saveTabRefresh(id, 'after');
        }).catch(function (err) {
          return _this3.clearLogs();
        });
      }
    }]);

    return TabManager;
  }(StorageManager);

  window.TabManager = TabManager;
})();