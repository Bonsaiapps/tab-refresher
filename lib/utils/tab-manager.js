'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
    currentWindow: true,
    status: 'complete',
    active: true
  };

  var ALL_TABS_QUERY = {
    currentWindow: true,
    status: 'complete'
  };

  var TabManager = function (_StorageManager) {
    _inherits(TabManager, _StorageManager);

    function TabManager() {
      _classCallCheck(this, TabManager);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(TabManager).apply(this, arguments));
    }

    _createClass(TabManager, [{
      key: 'getActiveTab',
      value: function getActiveTab() {

        return chrome.promise.tabs.query(ACTIVE_QUERY).then(function () {
          var tabs = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

          if (!tabs.length) throw new Error('No active tab!');

          return tabs[0];
        });
      }
    }, {
      key: 'getAllTabs',
      value: function getAllTabs() {
        return chrome.promise.tabs.query(ALL_TABS_QUERY);
      }
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
        d('Creating Alarm', name, start, end, id, period);

        var alarmInfo = {
          delayInMinutes: period,
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
      value: function getAlarm(tab) {
        var name = 'tab-' + tab.id;
        d('Getting alarm', name);
        return chrome.promise.alarms.get(name).then(function (alarm) {
          if (!alarm) throw new Error('Invalid alarm name ' + name);
          d('Alarm Results', alarm);
          return alarm;
        });
      }
    }, {
      key: 'removeAllAlarms',
      value: function removeAllAlarms() {
        return chrome.promise.alarms.clearAll();
      }
    }, {
      key: 'refreshTab',
      value: function refreshTab(id) {
        return chrome.promise.tabs.reload(id).then(function () {
          return d('tab-' + id + ' was reloaded!');
        });
      }
    }]);

    return TabManager;
  }(StorageManager);

  window.TabManager = TabManager;
})();