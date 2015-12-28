'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author john
 * @version 12/21/15 12:58 AM
 */

$(function () {

  var COUNTDOWN_DELAY = 1000;

  var TimerPopup = (function () {
    function TimerPopup() {
      _classCallCheck(this, TimerPopup);

      this.intervalId = null;
      this.tabManager = new TabManager();
      this.$startRange = $('#start-range');
      this.$endRange = $('#end-range');
      this.$refreshVal = $('#refresh-val');
      this.$startAll = $('#start-all');
      this.$disableAll = $('#disable-all');
      this.$startReset = $('#start-reset');
      this.$intervalVal = $('#interval-val');

      this.bindEvents();
      this.setInitialInterval();
    }

    _createClass(TimerPopup, [{
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
      key: 'setInitialInterval',
      value: function setInitialInterval() {
        var _this2 = this;

        this.tabManager.queryActiveTab().then(function (tab) {
          return _this2.tabManager.getFromStorage(tab);
        }).then(function (_ref) {
          var start = _ref.start;
          var end = _ref.end;

          d('start', start, end);
          _this2.$startRange.val(start);
          _this2.$endRange.val(end);
        }).then(function () {
          return _this2.startCountdown();
        });
      }
    }, {
      key: 'onStartActive',
      value: function onStartActive() {
        var _this3 = this;

        return this.tabManager.startCurrent().then(function () {
          return _this3.startCountdown();
        });
      }
    }, {
      key: 'onStartAllClick',
      value: function onStartAllClick() {
        var _this4 = this;

        return this.tabManager.queryAll().then(function (tabs) {
          return _this4.tabManager.createAll(tabs);
        }).then(function () {
          return _this4.startCountdown();
        });
      }
    }, {
      key: 'startCountdown',
      value: function startCountdown() {
        var _this5 = this;

        this.intervalId = setInterval(function () {
          return _this5.getActiveTabAlarmTime();
        }, COUNTDOWN_DELAY);
      }
    }, {
      key: 'getActiveTabAlarmTime',
      value: function getActiveTabAlarmTime() {
        var _this6 = this;

        this.tabManager.findActiveAlarm().then(function (alarm) {
          return _this6.parseAlarmTime(alarm);
        }).then(function (display) {

          if (!display) return _this6.hideCountdownBlock();

          _this6.$refreshVal.text(display);
        });
      }
    }, {
      key: 'parseAlarmTime',
      value: function parseAlarmTime(alarm) {
        d('active alarm', alarm);
        if (!alarm) return;

        var scheduledTime = alarm.scheduledTime;
        var periodInMinutes = alarm.periodInMinutes;

        this.$intervalVal.text(periodInMinutes + 'm');
        var timespan = countdown(scheduledTime, new Date().getTime(), countdown.HOURS | countdown.MINUTES | countdown.SECONDS);
        return timespan.toString(2);
      }
    }, {
      key: 'hideCountdownBlock',
      value: function hideCountdownBlock() {
        clearInterval(this.intervalId);
        this.$refreshVal.text('');
        return this.$intervalVal.text('');
      }
    }, {
      key: 'onDisableAllClick',
      value: function onDisableAllClick() {
        var _this7 = this;

        this.tabManager.storage.setter({ global: { off: true } });
        this.tabManager.removeAllAlarms().then(function () {
          return _this7.hideCountdownBlock();
        });
      }
    }, {
      key: 'onSaveClick',
      value: function onSaveClick() {
        return this.tabManager.saveRangeForCurrentTab(this.$startRange.val(), this.$endRange.val());
      }
    }, {
      key: 'onStartResetClick',
      value: function onStartResetClick() {
        var _this8 = this;

        this.onSaveClick().then(function () {
          return _this8.onStartActive();
        });
      }
    }]);

    return TimerPopup;
  })();

  /**
   * Constructor will bind any events
   *  and set initial interval, default or storage
   */

  new TimerPopup();
});