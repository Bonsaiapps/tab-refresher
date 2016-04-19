'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author john
 * @version 12/29/15 6:09 AM
 */

(function () {

  var SUCCESS_ICON_FADE = 2000;

  var PopupTimer = function () {
    function PopupTimer() {
      var _this = this;

      _classCallCheck(this, PopupTimer);

      this.timeoutId = null;
      this.units = countdown.HOURS | countdown.MINUTES | countdown.SECONDS;
      this.manager = new TabManager();
      this.refreshLogs = new RefreshLogs();
      this.$startRange = $('#start-range');
      this.$endRange = $('#end-range');
      this.$refreshVal = $('#refresh-val');
      this.$startAll = $('#start-all');
      this.$disableAll = $('#disable-all');
      this.$startTab = $('#start-tab');
      this.$disableTab = $('#disable-tab');
      this.$intervalVal = $('#interval-val');
      this.$viewLogs = $('#view-logs');
      this.$clearLogs = $('#clear-logs');
      this.$successIcon = $('.success-icon');
      this.$thisTab = $('#this-tab');
      this.$allTabs = $('#all-tabs');

      chrome.runtime.onMessage.addListener(function (request) {
        if (request.event === events.ON_REFRESH) _this.onRefresh(request.id);
      });
    }

    _createClass(PopupTimer, [{
      key: 'onRefresh',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(id) {
          var tab, alarm;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  this.clearValues();
                  _context.next = 3;
                  return chrome.promise.tabs.get(id);

                case 3:
                  tab = _context.sent;
                  _context.next = 6;
                  return this.manager.getAlarm(tab);

                case 6:
                  alarm = _context.sent;

                  this.parseAlarmTime(alarm);
                  this.setEnabledStatus(id);

                case 9:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function onRefresh(_x) {
          return ref.apply(this, arguments);
        }

        return onRefresh;
      }()
    }, {
      key: 'bindEvents',
      value: function bindEvents() {
        var _this2 = this;

        this.$startAll.click(function (ev) {
          return _this2.onStartAllClick();
        });
        this.$disableAll.click(function (ev) {
          return _this2.onDisableAllClick();
        });
        this.$startTab.click(function (ev) {
          return _this2.onStartTab();
        });
        this.$disableTab.click(function (ev) {
          return _this2.onDisableTab();
        });
        this.$viewLogs.click(function (ev) {
          return _this2.onViewLogs();
        });
        this.$clearLogs.click(function (ev) {
          return _this2.onClearLogs();
        });
      }
    }, {
      key: 'checkCurrentRefreshTimer',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
          var tab, interval, alarm;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return this.manager.getAllTabs('Starting Tabs');

                case 2:
                  _context2.next = 4;
                  return this.manager.getActiveTab();

                case 4:
                  tab = _context2.sent;
                  _context2.next = 7;
                  return this.manager.getSavedInterval(tab);

                case 7:
                  interval = _context2.sent;

                  this.fillInRanges(interval);

                  _context2.next = 11;
                  return this.manager.canTabProceed(tab.id);

                case 11:
                  if (_context2.sent) {
                    _context2.next = 14;
                    break;
                  }

                  this.setEnabledStatus(tab.id);
                  return _context2.abrupt('return', console.warn('Extension is disabled'));

                case 14:
                  _context2.next = 16;
                  return this.manager.getAlarm(tab);

                case 16:
                  alarm = _context2.sent;

                  this.parseAlarmTime(alarm);
                  this.setEnabledStatus(tab.id);
                  return _context2.abrupt('return', alarm);

                case 20:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function checkCurrentRefreshTimer() {
          return ref.apply(this, arguments);
        }

        return checkCurrentRefreshTimer;
      }()
    }, {
      key: 'onStartTab',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
          var tab, alarm;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  this.clearValues();

                  _context3.next = 3;
                  return this.manager.getActiveTab();

                case 3:
                  tab = _context3.sent;
                  _context3.next = 6;
                  return this.startSingleTab(tab, this.$startRange.val(), this.$endRange.val());

                case 6:
                  _context3.next = 8;
                  return this.manager.getAlarm(tab);

                case 8:
                  alarm = _context3.sent;

                  this.parseAlarmTime(alarm);
                  this.showSuccessIcon();
                  this.setEnabledStatus(tab.id);
                  return _context3.abrupt('return', alarm);

                case 13:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function onStartTab() {
          return ref.apply(this, arguments);
        }

        return onStartTab;
      }()
    }, {
      key: 'onDisableTab',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
          var tab;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  this.clearValues();
                  _context4.next = 3;
                  return this.manager.getActiveTab();

                case 3:
                  tab = _context4.sent;
                  _context4.next = 6;
                  return this.manager.disableTab(tab.id);

                case 6:
                  _context4.next = 8;
                  return this.manager.removeAlarm(tab);

                case 8:
                  this.showSuccessIcon();
                  this.setEnabledStatus(tab.id);

                case 10:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function onDisableTab() {
          return ref.apply(this, arguments);
        }

        return onDisableTab;
      }()
    }, {
      key: 'startSingleTab',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(tab, start, end) {
          var interval;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return this.manager.enableTab(tab.id);

                case 2:
                  _context5.next = 4;
                  return this.manager.saveInterval(tab, start, end);

                case 4:
                  interval = _context5.sent;
                  _context5.next = 7;
                  return this.manager.createAlarm(interval);

                case 7:
                  return _context5.abrupt('return', _context5.sent);

                case 8:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function startSingleTab(_x2, _x3, _x4) {
          return ref.apply(this, arguments);
        }

        return startSingleTab;
      }()
    }, {
      key: 'onStartAllClick',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
          var currentTab, tabs, currentAlarm, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, tab, interval, alarm;

          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return this.manager.enableAll();

                case 2:
                  _context6.next = 4;
                  return this.manager.getActiveTab();

                case 4:
                  currentTab = _context6.sent;
                  tabs = this.manager.getAllTabs('All Tabs Enabled');
                  currentAlarm = void 0;
                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context6.prev = 10;
                  _iterator = tabs[Symbol.iterator]();

                case 12:
                  if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    _context6.next = 24;
                    break;
                  }

                  tab = _step.value;
                  _context6.next = 16;
                  return this.manager.getSavedInterval(tab);

                case 16:
                  interval = _context6.sent;
                  _context6.next = 19;
                  return this.startSingleTab(tab, interval.start, interval.end);

                case 19:
                  alarm = _context6.sent;

                  if (tab.id === currentTab.id) currentAlarm = alarm;

                case 21:
                  _iteratorNormalCompletion = true;
                  _context6.next = 12;
                  break;

                case 24:
                  _context6.next = 30;
                  break;

                case 26:
                  _context6.prev = 26;
                  _context6.t0 = _context6['catch'](10);
                  _didIteratorError = true;
                  _iteratorError = _context6.t0;

                case 30:
                  _context6.prev = 30;
                  _context6.prev = 31;

                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }

                case 33:
                  _context6.prev = 33;

                  if (!_didIteratorError) {
                    _context6.next = 36;
                    break;
                  }

                  throw _iteratorError;

                case 36:
                  return _context6.finish(33);

                case 37:
                  return _context6.finish(30);

                case 38:

                  this.parseAlarmTime(currentAlarm);
                  this.showSuccessIcon();
                  this.setEnabledStatus();
                  return _context6.abrupt('return', tabs);

                case 42:
                case 'end':
                  return _context6.stop();
              }
            }
          }, _callee6, this, [[10, 26, 30, 38], [31,, 33, 37]]);
        }));

        function onStartAllClick() {
          return ref.apply(this, arguments);
        }

        return onStartAllClick;
      }()
    }, {
      key: 'onDisableAllClick',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  this.clearValues();
                  _context7.next = 3;
                  return this.manager.disableAll();

                case 3:
                  _context7.next = 5;
                  return this.manager.removeAllAlarms();

                case 5:
                  _context7.next = 7;
                  return this.manager.clearTabStorage();

                case 7:
                  this.setEnabledStatus();
                  _context7.next = 10;
                  return this.showSuccessIcon();

                case 10:
                  return _context7.abrupt('return', _context7.sent);

                case 11:
                case 'end':
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function onDisableAllClick() {
          return ref.apply(this, arguments);
        }

        return onDisableAllClick;
      }()
    }, {
      key: 'onViewLogs',
      value: function onViewLogs() {
        var _this3 = this;

        return this.refreshLogs.writeFile().then(function () {
          return _this3.showSuccessIcon();
        }).catch(function (err) {
          return console.error(err);
        });
      }
    }, {
      key: 'onClearLogs',
      value: function onClearLogs() {
        var _this4 = this;

        return this.manager.clearLogs().then(function () {
          return _this4.showSuccessIcon();
        }).catch(function (err) {
          return console.error(err);
        });
      }
    }, {
      key: 'showSuccessIcon',
      value: function showSuccessIcon() {
        var _this5 = this;

        this.$successIcon.addClass('on');
        return new Promise(function (resolve) {
          setTimeout(function () {
            _this5.$successIcon.removeClass('on');
            resolve();
          }, SUCCESS_ICON_FADE);
        });
      }
    }, {
      key: 'fillInRanges',
      value: function fillInRanges(interval) {
        var id = interval.id;
        var start = interval.start;
        var end = interval.end;


        d('%cCurrent - id:%c %d %crange:%c %d-%d', BOLD, NORMAL, id, BOLD, NORMAL, start, end);
        console.groupEnd();
        this.$startRange.val(start);
        this.$endRange.val(end);
        return interval;
      }
    }, {
      key: 'clearValues',
      value: function clearValues() {
        clearTimeout(this.timeoutId);
        this.$thisTab.text('');
        this.$allTabs.text('');
        this.$refreshVal.text('');
        return this.$intervalVal.text('');
      }
    }, {
      key: 'parseAlarmTime',
      value: function parseAlarmTime(alarm) {
        var _this6 = this;

        var scheduledTime = alarm.scheduledTime;
        var periodInMinutes = alarm.periodInMinutes;
        var name = alarm.name;


        d('%cParsing Alarm - Name%c: %s %cPeriod%c: %d', BOLD, NORMAL, name, BOLD, NORMAL, periodInMinutes);

        this.$intervalVal.text(periodInMinutes + 'm');

        this.timeoutId = countdown(scheduledTime, function (timeSpan) {
          return _this6.setRefreshVal(timeSpan);
        }, this.units);

        return alarm;
      }
    }, {
      key: 'setRefreshVal',
      value: function setRefreshVal(timeSpan) {
        this.$refreshVal.text(timeSpan.toString());
      }
    }, {
      key: 'setEnabledStatus',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(id) {
          var tab, all, current, str;
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  str = function str(bool) {
                    return bool ? 'Enabled' : 'Disabled';
                  };

                  tab = void 0;

                  if (!id) {
                    _context8.next = 8;
                    break;
                  }

                  _context8.next = 5;
                  return chrome.promise.tabs.get(id);

                case 5:
                  tab = _context8.sent;
                  _context8.next = 11;
                  break;

                case 8:
                  _context8.next = 10;
                  return this.manager.getActiveTab();

                case 10:
                  tab = _context8.sent;

                case 11:
                  _context8.next = 13;
                  return this.manager.areAllEnabled();

                case 13:
                  all = _context8.sent;
                  _context8.next = 16;
                  return this.manager.isTabEnabled(tab.id);

                case 16:
                  current = _context8.sent;


                  this.$allTabs.text(str(all));
                  this.$thisTab.text(str(current));

                case 19:
                case 'end':
                  return _context8.stop();
              }
            }
          }, _callee8, this);
        }));

        function setEnabledStatus(_x5) {
          return ref.apply(this, arguments);
        }

        return setEnabledStatus;
      }()
    }, {
      key: 'formatCountdown',
      value: function formatCountdown() {
        countdown.setFormat({
          singular: '|s|m|h',
          plural: '|s|m|h',
          last: ' ',
          delim: ' '
        });
      }
    }]);

    return PopupTimer;
  }();

  window.PopupTimer = PopupTimer;
})();