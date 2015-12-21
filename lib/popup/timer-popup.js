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
  var PERIOD = 360;

  var TimerPopup = (function () {
    function TimerPopup() {
      _classCallCheck(this, TimerPopup);

      this.storage = new ExtStorage();
      this.tabManager = new TabManager();
      this.$period = $('#period');
      this.$save = $('#save');

      this.bindEvents();
      this.setInitialInterval();
    }

    _createClass(TimerPopup, [{
      key: 'setInitialInterval',
      value: function setInitialInterval() {
        var _this = this;

        var savedPer = period;
        this.storage.getInterval().then(function (_ref) {
          var _ref$period = _ref.period;
          var period = _ref$period === undefined ? PERIOD : _ref$period;

          _this.$period.val(period);
          return savedPer = period;
        }).then(function () {
          return _this.tabManager.getTabIds();
        }).then(function (tabIds) {
          return _this.tabManager.createAlarms(period, tabIds);
        });
      }
    }, {
      key: 'bindEvents',
      value: function bindEvents() {
        var _this2 = this;

        this.$save.click(function (evt) {
          return _this2.onRangeChange();
        });

        chrome.promise.runtime.getBackgroundPage().then(function (window) {
          return d('window', window);
        });
      }
    }, {
      key: 'onRangeChange',
      value: function onRangeChange() {
        var _this3 = this;

        var period = this.storage.cleanInterval(this.$period.val());
        this.storage.saveInterval(period).then(function (period) {
          return _this3.tabManager.getTabIds();
        }).then(function (tabIds) {
          return _this3.tabManager.createAlarms(period, tabIds);
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