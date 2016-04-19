'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * timer for alarms
 *
 * @author john
 * @version 12/21/15 3:16 AM
 */

(function () {

  var TAB_RE = /tab-(\d+)/;

  var EventAlarm = function () {
    function EventAlarm() {
      _classCallCheck(this, EventAlarm);

      this.manager = new TabManager();

      this.register();
    }

    _createClass(EventAlarm, [{
      key: 'register',
      value: function register() {
        var _this = this;

        d('EventAlarms Register');

        chrome.alarms.onAlarm.addListener(function (alarm) {
          return _this.onTabAlarmFired(alarm);
        });
        chrome.tabs.onCreated.addListener(function (tab) {
          return _this.onNewTab(tab);
        });
        chrome.runtime.onStartup.addListener(function () {
          // On startup all tabs can get new ids
          // So we are clearing the storage to prevent confusion
          return _this.manager.clearTabStorage().then(function () {
            return _this.manager.removeAllAlarms();
          });
        });
      }
    }, {
      key: 'onTabAlarmFired',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(alarm) {
          var name, match, id, enabled;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  d('alarm', alarm);
                  name = alarm.name;
                  match = TAB_RE.exec(name);

                  if (match) {
                    _context.next = 5;
                    break;
                  }

                  throw new Error('Invalid Alarm Name: ' + name);

                case 5:
                  id = match[1];
                  _context.next = 8;
                  return this.manager.canTabProceed(id);

                case 8:
                  enabled = _context.sent;

                  if (enabled) {
                    _context.next = 11;
                    break;
                  }

                  return _context.abrupt('return', this.manager.removeAllAlarms());

                case 11:
                  _context.next = 13;
                  return this.manager.refreshTab(parseInt(id, 10));

                case 13:
                  return _context.abrupt('return', _context.sent);

                case 14:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function onTabAlarmFired(_x) {
          return ref.apply(this, arguments);
        }

        return onTabAlarmFired;
      }()
    }, {
      key: 'onNewTab',
      value: function onNewTab(tab) {
        var _this2 = this;

        var url = tab.url;
        var status = tab.status;
        var active = tab.active;


        if (url === TAB_LOGS_URL && status === 'loading' && active === false) return;

        console.log('New tab opened', tab);

        this.manager.checkIfExtensionIsOn().then(function () {
          return _this2.manager.getSavedInterval(tab);
        }).then(function (interval) {
          return _this2.manager.createAlarm(interval);
        }).catch(function (err) {
          return console.warn(err);
        });
      }
    }]);

    return EventAlarm;
  }();

  new EventAlarm();
})();