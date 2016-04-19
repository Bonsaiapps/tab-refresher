'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author john
 * @version 12/29/15 6:09 AM
 */

(function () {

  var COUNTDOWN_DELAY = 1000;
  var SUCCESS_ICON_FADE = 2000;

  var PopupTimer = function () {
    function PopupTimer() {
      _classCallCheck(this, PopupTimer);

      this.timeoutId = null;
      this.tab = null;
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
    }

    _createClass(PopupTimer, [{
      key: 'bindEvents',
      value: function bindEvents() {
        var _this = this;

        this.$startAll.click(function (ev) {
          return _this.onStartAllClick();
        });
        this.$disableAll.click(function (ev) {
          return _this.onDisableAllClick();
        });
        this.$startTab.click(function (ev) {
          return _this.onStartTab();
        });
        this.$disableTab.click(function (ev) {
          return _this.onDisableTab();
        });
        this.$viewLogs.click(function (ev) {
          return _this.onViewLogs();
        });
        this.$clearLogs.click(function (ev) {
          return _this.onClearLogs();
        });
      }
    }, {
      key: 'checkCurrentRefreshTimer',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
          var tab, interval, alarm;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.manager.getAllTabs('Starting Tabs');

                case 2:
                  _context.next = 4;
                  return this.manager.getActiveTab();

                case 4:
                  tab = _context.sent;
                  _context.next = 7;
                  return this.manager.getSavedInterval(tab);

                case 7:
                  interval = _context.sent;

                  this.fillInRanges(interval);

                  _context.next = 11;
                  return this.manager.canTabProceed(tab.id);

                case 11:
                  if (_context.sent) {
                    _context.next = 13;
                    break;
                  }

                  return _context.abrupt('return', console.warn('Extension is disabled'));

                case 13:
                  _context.next = 15;
                  return this.manager.getAlarm(tab);

                case 15:
                  alarm = _context.sent;

                  this.parseAlarmTime(alarm);

                  return _context.abrupt('return', alarm);

                case 18:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function checkCurrentRefreshTimer() {
          return ref.apply(this, arguments);
        }

        return checkCurrentRefreshTimer;
      }()
    }, {
      key: 'onStartTab',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
          var tab, alarm;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  this.clearValues();

                  _context2.next = 3;
                  return this.manager.getActiveTab();

                case 3:
                  tab = _context2.sent;
                  _context2.next = 6;
                  return this.startSingleTab(tab, this.$startRange.val(), this.$endRange.val());

                case 6:
                  _context2.next = 8;
                  return this.manager.getAlarm(tab);

                case 8:
                  alarm = _context2.sent;

                  this.parseAlarmTime(alarm);
                  this.showSuccessIcon();
                  return _context2.abrupt('return', alarm);

                case 12:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function onStartTab() {
          return ref.apply(this, arguments);
        }

        return onStartTab;
      }()
    }, {
      key: 'onDisableTab',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
          var tab;
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
                  return this.manager.disableTab(tab.id);

                case 6:
                  _context3.next = 8;
                  return this.manager.removeAlarm(tab);

                case 8:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function onDisableTab() {
          return ref.apply(this, arguments);
        }

        return onDisableTab;
      }()
    }, {
      key: 'startSingleTab',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(tab, start, end) {
          var interval;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return this.manager.enableTab(tab.id);

                case 2:
                  _context4.next = 4;
                  return this.manager.saveInterval(tab, start, end);

                case 4:
                  interval = _context4.sent;
                  _context4.next = 7;
                  return this.manager.createAlarm(interval);

                case 7:
                  return _context4.abrupt('return', _context4.sent);

                case 8:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function startSingleTab(_x, _x2, _x3) {
          return ref.apply(this, arguments);
        }

        return startSingleTab;
      }()
    }, {
      key: 'onStartAllClick',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
          var currentTab, tabs, currentAlarm, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, tab, interval, alarm;

          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return this.manager.enableAll();

                case 2:
                  _context5.next = 4;
                  return this.manager.getActiveTab();

                case 4:
                  currentTab = _context5.sent;
                  tabs = this.manager.getAllTabs('All Tabs Enabled');
                  currentAlarm = void 0;
                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context5.prev = 10;
                  _iterator = tabs[Symbol.iterator]();

                case 12:
                  if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    _context5.next = 24;
                    break;
                  }

                  tab = _step.value;
                  _context5.next = 16;
                  return this.manager.getSavedInterval(tab);

                case 16:
                  interval = _context5.sent;
                  _context5.next = 19;
                  return this.startSingleTab(tab, interval.start, interval.end);

                case 19:
                  alarm = _context5.sent;

                  if (tab.id === currentTab.id) currentAlarm = alarm;

                case 21:
                  _iteratorNormalCompletion = true;
                  _context5.next = 12;
                  break;

                case 24:
                  _context5.next = 30;
                  break;

                case 26:
                  _context5.prev = 26;
                  _context5.t0 = _context5['catch'](10);
                  _didIteratorError = true;
                  _iteratorError = _context5.t0;

                case 30:
                  _context5.prev = 30;
                  _context5.prev = 31;

                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }

                case 33:
                  _context5.prev = 33;

                  if (!_didIteratorError) {
                    _context5.next = 36;
                    break;
                  }

                  throw _iteratorError;

                case 36:
                  return _context5.finish(33);

                case 37:
                  return _context5.finish(30);

                case 38:

                  this.parseAlarmTime(currentAlarm);
                  _context5.next = 41;
                  return this.showSuccessIcon();

                case 41:
                  return _context5.abrupt('return', _context5.sent);

                case 42:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, this, [[10, 26, 30, 38], [31,, 33, 37]]);
        }));

        function onStartAllClick() {
          return ref.apply(this, arguments);
        }

        return onStartAllClick;
      }()
    }, {
      key: 'onDisableAllClick',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  this.clearValues();
                  _context6.next = 3;
                  return this.manager.disableAll();

                case 3:
                  _context6.next = 5;
                  return this.manager.removeAllAlarms();

                case 5:
                  _context6.next = 7;
                  return this.manager.clearTabStorage();

                case 7:
                  _context6.next = 9;
                  return this.showSuccessIcon();

                case 9:
                  return _context6.abrupt('return', _context6.sent);

                case 10:
                case 'end':
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        }));

        function onDisableAllClick() {
          return ref.apply(this, arguments);
        }

        return onDisableAllClick;
      }()
    }, {
      key: 'onViewLogs',
      value: function onViewLogs() {
        var _this2 = this;

        return this.refreshLogs.writeFile().then(function () {
          return _this2.showSuccessIcon();
        }).catch(function (err) {
          return console.error(err);
        });
      }
    }, {
      key: 'onClearLogs',
      value: function onClearLogs() {
        var _this3 = this;

        return this.manager.clearLogs().then(function () {
          return _this3.showSuccessIcon();
        }).catch(function (err) {
          return console.error(err);
        });
      }
    }, {
      key: 'showSuccessIcon',
      value: function showSuccessIcon() {
        var _this4 = this;

        this.$successIcon.addClass('on');
        return new Promise(function (resolve) {
          setTimeout(function () {
            _this4.$successIcon.removeClass('on');
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
        var _this5 = this;

        var scheduledTime = alarm.scheduledTime;
        var periodInMinutes = alarm.periodInMinutes;
        var name = alarm.name;


        this.$intervalVal.text(periodInMinutes + 'm');
        var timeSpan = countdown(null, scheduledTime, countdown.HOURS | countdown.MINUTES | countdown.SECONDS);
        if (!this.timeoutId) {
          console.log('scheduledTime', scheduledTime);

          console.log('timeSpan', timeSpan);
          d('%cParsing Alarm - Name%c: %s %cPeriod%c: %d', BOLD, NORMAL, name, BOLD, NORMAL, periodInMinutes);
        }

        this.$refreshVal.text(timeSpan.toString(4));

        this.timeoutId = setTimeout(function () {
          return _this5.parseAlarmTime(alarm);
        }, COUNTDOWN_DELAY);
        return alarm;
      }
    }, {
      key: 'setEnabledStatus',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
          var tab, all, current, str;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  str = function str(bool) {
                    return bool ? 'Enabled' : 'Disabled';
                  };

                  _context7.next = 3;
                  return this.manager.getActiveTab();

                case 3:
                  tab = _context7.sent;
                  _context7.next = 6;
                  return this.manager.areAllEnabled();

                case 6:
                  all = _context7.sent;
                  _context7.next = 9;
                  return this.manager.isTabEnabled(tab.id);

                case 9:
                  current = _context7.sent;


                  this.$allTabs.text(str(all));
                  this.$thisTab.text(str(current));

                case 12:
                case 'end':
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function setEnabledStatus() {
          return ref.apply(this, arguments);
        }

        return setEnabledStatus;
      }()
    }]);

    return PopupTimer;
  }();

  window.PopupTimer = PopupTimer;
})();