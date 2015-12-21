'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author john
 * @version 12/21/15 12:58 AM
 */

$(function () {

  // chrome.alarms will only deal in minutes
  // Seemed ok since default was six hours
  var STATUS_DELAY = 3000;
  var COUNTDOWN_DELAY = 1000;

  var TimerPopup = (function () {
    function TimerPopup() {
      _classCallCheck(this, TimerPopup);

      this.intervalId = null;
      this.tabManager = new TabManager();
      this.$start = $('#start');
      this.$end = $('#end');
      this.$save = $('#save');
      this.$refresh = $('#refresh');
      this.$startAll = $('#start-all');
      this.$check = $('#check');
      this.$allOff = $('#all-off');
      this.$status = $('#status');
      this.$countdownBlock = $('#countdown');
      this.$startActive = $('#start-active');
      this.$disableActive = $('#disable-active');

      this.bindEvents();
      this.setInitialInterval();
    }

    _createClass(TimerPopup, [{
      key: 'bindEvents',
      value: function bindEvents() {
        var _this = this;

        this.$save.click(function (ev) {
          return _this.onSaveClick();
        });
        this.$startAll.click(function (ev) {
          return _this.onStartAll();
        });
        this.$check.click(function (ev) {
          return _this.getActiveTabAlarmTime();
        });
        this.$allOff.click(function (ev) {
          return _this.onAllOffClick();
        });
        this.$startActive.click(function (ev) {
          return _this.onStartActive();
        });
        this.$disableActive.click(function (ev) {
          return _this.onDisableActive();
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
          _this2.$start.val(start);
          _this2.$end.val(end);
        }).then(function () {
          return _this2.startCountdown();
        });
      }
    }, {
      key: 'onStartActive',
      value: function onStartActive() {
        var _this3 = this;

        return this.tabManager.startCurrent().then(function () {
          return _this3.updateStatus('Tab Started');
        }).then(function () {
          return _this3.startCountdown();
        });
      }
    }, {
      key: 'onDisableActive',
      value: function onDisableActive() {}
    }, {
      key: 'onSaveClick',
      value: function onSaveClick() {
        var _this4 = this;

        return this.tabManager.saveRangeForCurrentTab(this.$start.val(), this.$end.val()).then(function () {
          return _this4.updateStatus('Refresh interval saved!');
        });
      }
    }, {
      key: 'onStartAll',
      value: function onStartAll() {
        var _this5 = this;

        return this.tabManager.queryAll().then(function (tabs) {
          return _this5.tabManager.createAll(tabs);
        }).then(function () {
          return _this5.updateStatus('All tabs started!');
        }).then(function () {
          return _this5.startCountdown();
        });
      }
    }, {
      key: 'updateStatus',
      value: function updateStatus(statusText) {
        var _this6 = this;

        this.$status.text(statusText);
        return setTimeout(function () {
          return _this6.$status.text('');
        }, STATUS_DELAY);
      }
    }, {
      key: 'startCountdown',
      value: function startCountdown() {
        var _this7 = this;

        chrome.alarms.getAll(function (all) {
          return d('ALL', all);
        });
        this.intervalId = setInterval(function () {
          return _this7.getActiveTabAlarmTime();
        }, COUNTDOWN_DELAY);
      }
    }, {
      key: 'getActiveTabAlarmTime',
      value: function getActiveTabAlarmTime() {
        var _this8 = this;

        this.tabManager.findActiveAlarm().then(function (display) {

          if (!display) return _this8.hideCountdownBlock();

          _this8.$countdownBlock.css('display', 'block');
          _this8.$refresh.text(display);
        });
      }
    }, {
      key: 'hideCountdownBlock',
      value: function hideCountdownBlock() {
        clearInterval(this.intervalId);
        return this.$countdownBlock.css('display', 'none');
      }
    }, {
      key: 'onAllOffClick',
      value: function onAllOffClick() {
        var _this9 = this;

        this.tabManager.removeAllAlarms().then(function (wasCleared) {
          return _this9.updateStatus('All tabs disabled');
        }).then(function () {
          return _this9.hideCountdownBlock();
        });
      }
    }]);

    return TimerPopup;
  })();

  /**
   * Constructor will bind any events
   *  and set initial interval, default or storage
   */

  var timerPopup = new TimerPopup();
});