'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author john
 * @version 12/29/15 6:09 AM
 */

(function () {

  var COUNTDOWN_DELAY = 1000;

  var PopupTimer = (function () {
    function PopupTimer() {
      _classCallCheck(this, PopupTimer);

      this.timeoutId = null;
      this.alarm = null;
      this.manager = new TabManager();
      this.$startRange = $('#start-range');
      this.$endRange = $('#end-range');
      this.$refreshVal = $('#refresh-val');
      this.$startAll = $('#start-all');
      this.$disableAll = $('#disable-all');
      this.$startReset = $('#start-reset');
      this.$intervalVal = $('#interval-val');
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
      }
    }, {
      key: 'checkCurrentRefreshTimer',
      value: function checkCurrentRefreshTimer() {
        var _this2 = this;

        d('Start checking timer for current tab');
        var _tab = undefined;
        this.alarm = null;
        return this.manager.getActiveTab().then(function (tab) {
          return _tab = tab;
        }).then(function (tab) {
          return _this2.manager.getSavedInterval(tab);
        }).then(function (interval) {
          return _this2.fillInRanges(interval);
        }).then(function () {
          return _this2.manager.checkIfExtensionIsOn();
        }).then(function () {
          return _this2.manager.getAlarm(_tab);
        }).then(function (alarm) {
          return _this2.parseAlarmTime(alarm);
        });
      }
    }, {
      key: 'fillInRanges',
      value: function fillInRanges(interval) {
        var start = interval.start;
        var end = interval.end;

        d('start', start, end);
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
        var _this3 = this;

        d('Parsing Alarm', alarm);
        var scheduledTime = alarm.scheduledTime;
        var periodInMinutes = alarm.periodInMinutes;

        this.$intervalVal.text(periodInMinutes + 'm');
        var timeSpan = countdown(scheduledTime, new Date().getTime(), countdown.HOURS | countdown.MINUTES | countdown.SECONDS);
        this.$refreshVal.text(timeSpan.toString(4));

        this.timeoutId = setTimeout(function () {
          return _this3.parseAlarmTime(alarm);
        }, COUNTDOWN_DELAY);
        return alarm;
      }
    }, {
      key: 'onStartAllClick',
      value: function onStartAllClick() {
        var _this4 = this;

        d('Start All Clicked!');
        return this.manager.saveGlobalSettings().then(function () {
          return _this4.manager.getAllTabs();
        }).then(function (tabs) {
          return _this4.manager.getAllIntervals(tabs);
        }).then(function (tabIntervals) {
          return _this4.manager.createAlarms(tabIntervals);
        });
      }
    }, {
      key: 'onDisableAllClick',
      value: function onDisableAllClick() {
        var _this5 = this;

        return this.manager.disableGlobalSettings().then(function () {
          return _this5.manager.removeAllAlarms();
        }).then(function () {
          return _this5.clearValues();
        });
      }
    }]);

    return PopupTimer;
  })();

  window.PopupTimer = PopupTimer;
})();