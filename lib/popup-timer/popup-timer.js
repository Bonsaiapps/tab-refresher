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
      this.$startReset = $('#start-reset');
      this.$intervalVal = $('#interval-val');
      this.$viewLogs = $('#view-logs');
      this.$clearLogs = $('#clear-logs');
      this.$successIcon = $('.success-icon');
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
        this.$startReset.click(function (ev) {
          return _this.onStartResetClick();
        });
        this.$viewLogs.click(function (ev) {
          return _this.onViewLogs();
        });
        this.$clearLogs.click(function (ev) {
          return _this.onClearLogs();
        });
      }
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
          }, 2000);
        });
      }
    }, {
      key: 'checkCurrentRefreshTimer',
      value: function checkCurrentRefreshTimer() {
        var _this5 = this;

        this.tab = null;
        this.manager.getAllTabs('Starting Tabs');
        return this.manager.getActiveTab().then(function (tab) {
          return _this5.tab = tab;
        }).then(function (tab) {
          return _this5.manager.getSavedInterval(tab);
        }).then(function (interval) {
          return _this5.fillInRanges(interval);
        }).then(function () {
          return _this5.manager.checkIfExtensionIsOn();
        }).then(function () {
          return _this5.manager.getAlarm(_this5.tab);
        }).then(function (alarm) {
          return _this5.parseAlarmTime(alarm);
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

        if (!this.timeoutId) d('%cParsing Alarm - Name%c: %s %cPeriod%c: %d', BOLD, NORMAL, name, BOLD, NORMAL, periodInMinutes);

        this.$intervalVal.text(periodInMinutes + 'm');
        var timeSpan = countdown(scheduledTime, new Date().getTime(), countdown.HOURS | countdown.MINUTES | countdown.SECONDS);
        this.$refreshVal.text(timeSpan.toString(4));

        this.timeoutId = setTimeout(function () {
          return _this6.parseAlarmTime(alarm);
        }, COUNTDOWN_DELAY);
        return alarm;
      }
    }, {
      key: 'onStartAllClick',
      value: function onStartAllClick() {
        var _this7 = this;

        d('Start All Clicked!');
        return this.manager.saveGlobalSettings().then(function () {
          return _this7.manager.getAllTabs();
        }).then(function (tabs) {
          return _this7.manager.getAllIntervals(tabs);
        }).then(function (tabIntervals) {
          return _this7.manager.createAlarms(tabIntervals);
        }).then(function () {
          return _this7.showSuccessIcon();
        });
      }
    }, {
      key: 'onDisableAllClick',
      value: function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.manager.disableGlobalSettings();

                case 2:
                  _context.next = 4;
                  return this.manager.removeAllAlarms();

                case 4:
                  _context.next = 6;
                  return this.clearValues();

                case 6:
                  _context.next = 8;
                  return this.manager.clearTabStorage();

                case 8:
                  _context.next = 10;
                  return this.showSuccessIcon();

                case 10:
                  return _context.abrupt('return', _context.sent);

                case 11:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function onDisableAllClick() {
          return ref.apply(this, arguments);
        }

        return onDisableAllClick;
      }()
    }, {
      key: 'onStartResetClick',
      value: function onStartResetClick() {
        var _this8 = this;

        this.manager.saveGlobalSettings();
        this.clearValues();
        return this.manager.saveInterval(this.tab, this.$startRange.val(), this.$endRange.val()).then(function () {
          return _this8.manager.getSavedInterval(_this8.tab);
        }).then(function (interval) {
          return _this8.manager.createAlarm(interval);
        }).then(function () {
          return _this8.manager.getAlarm(_this8.tab);
        }).then(function (alarm) {
          return _this8.parseAlarmTime(alarm);
        }).then(function () {
          return _this8.showSuccessIcon();
        });
      }
    }]);

    return PopupTimer;
  }();

  window.PopupTimer = PopupTimer;
})();