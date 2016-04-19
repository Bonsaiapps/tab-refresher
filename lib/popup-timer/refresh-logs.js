'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Keeper and Writer of refresh logs
 *
 * @author john
 * @version 4/15/16 2:59 PM
 */

(function () {
  var _chrome$promise = chrome.promise;
  var storage = _chrome$promise.storage;
  var tabs = _chrome$promise.tabs;

  var RefreshLogs = function () {
    function RefreshLogs() {
      _classCallCheck(this, RefreshLogs);
    }

    _createClass(RefreshLogs, [{
      key: 'writeFile',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
          var logsData, logs, logsMessage, tab;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:

                  console.groupCollapsed('Writing refresh logs');

                  _context.next = 3;
                  return storage.local.get(_defineProperty({}, REFRESH_LOGS, []));

                case 3:
                  logsData = _context.sent;
                  _context.next = 6;
                  return logsData[REFRESH_LOGS];

                case 6:
                  logs = _context.sent;


                  console.log('logs', logs);

                  _context.next = 10;
                  return JSON.stringify(logs);

                case 10:
                  logsMessage = _context.sent;
                  _context.next = 13;
                  return tabs.create({
                    active: false,
                    url: TAB_LOGS_URL
                  });

                case 13:
                  tab = _context.sent;
                  _context.next = 16;
                  return tabs.executeScript(tab.id, {
                    file: 'lib/scripts/log-script.js'
                  });

                case 16:

                  console.groupEnd();
                  tabs.sendMessage(tab.id, logsMessage);
                  return _context.abrupt('return', tab);

                case 19:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function writeFile() {
          return ref.apply(this, arguments);
        }

        return writeFile;
      }()
    }]);

    return RefreshLogs;
  }();

  window.RefreshLogs = RefreshLogs;
})();