'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author john
 * @version 12/21/15 4:28 AM
 */

(function (root) {

  var MILL_CON = 60000;

  var TAB_QUERY = {
    currentWindow: true,
    status: 'complete'
  };

  var _chrome$promise = chrome.promise;
  var tabs = _chrome$promise.tabs;
  var alarms = _chrome$promise.alarms;

  var TabManager = (function () {
    function TabManager() {
      _classCallCheck(this, TabManager);

      this.storage = new ExtStorage();
    }

    _createClass(TabManager, [{
      key: 'getFromStorage',
      value: function getFromStorage(tab) {
        return this.storage.getInterval(tab);
      }
    }, {
      key: 'saveRangeForCurrentTab',
      value: function saveRangeForCurrentTab(start, end) {
        var _this = this;

        return this.queryActiveTab().then(function (tab) {
          return _this.storage.saveCurrent(start, end, tab);
        });
      }
    }, {
      key: 'generateMinutes',
      value: function generateMinutes(start, end) {
        return Math.floor(Math.random() * (end - start) + start);
      }
    }, {
      key: 'queryAll',
      value: function queryAll() {
        return tabs.query({}).then(function (resp) {
          console.log('resp', resp);

          return resp;
        });
      }
    }, {
      key: 'startCurrent',
      value: function startCurrent() {
        var _this2 = this;

        return this.queryActiveTab().then(function (tab) {
          return _this2.storage.getInterval(tab);
        }).then(function (_ref) {
          var id = _ref.id;
          var start = _ref.start;
          var end = _ref.end;
          return _this2.createAlarm(id, start, end);
        });
      }
    }, {
      key: 'cleanBoth',
      value: function cleanBoth(start, end) {
        start = this.storage.cleanInterval(start);
        end = this.storage.cleanInterval(end);
        return { start: start, end: end };
      }
    }, {
      key: 'createAlarm',
      value: function createAlarm(id, startVal, endVal) {
        var name = 'tab-' + id;

        var _cleanBoth = this.cleanBoth(startVal, endVal);

        var start = _cleanBoth.start;
        var end = _cleanBoth.end;

        var period = this.generateMinutes(start, end);

        d('period', period, start, end);
        var alarmInfo = {
          //when: Date.now() + 10000
          delayInMinutes: period,
          periodInMinutes: period
        };

        return chrome.alarms.create(name, alarmInfo);
      }
    }, {
      key: 'createAll',
      value: function createAll(allTabs) {
        var _this3 = this;

        var promises = [];

        d('tabs', allTabs);
        allTabs.forEach(function (tab) {
          d('tab', tab);
          var p = _this3.storage.getInterval(tab).then(function (_ref2) {
            var id = _ref2.id;
            var start = _ref2.start;
            var end = _ref2.end;
            return _this3.createAlarm(tab.id, start, end);
          });

          promises.push(p);
        });

        return Promise.all(promises);
      }
    }, {
      key: 'refreshTab',
      value: function refreshTab(id) {
        return tabs.reload(id).then(function () {
          return d('tab-' + id + ' was reloaded!');
        });
      }
    }, {
      key: 'queryActiveTab',
      value: function queryActiveTab() {
        var activeQuery = TAB_QUERY;
        activeQuery.active = true;

        return tabs.query(activeQuery).then(function () {
          var all = arguments.length <= 0 || arguments[0] === undefined ? [{}] : arguments[0];

          d('query active', all[0]);
          return all[0];
        });
      }
    }, {
      key: 'findActiveAlarm',
      value: function findActiveAlarm() {
        var _this4 = this;

        var activeQuery = TAB_QUERY;
        activeQuery.active = true;

        return this.queryActiveTab().then(function (tab) {

          var name = 'tab-' + tab.id;
          d('active name', name);
          return alarms.get(name);
        }).then(function (alarm) {
          return _this4.parseAlarmTime(alarm);
        });
      }
    }, {
      key: 'parseAlarmTime',
      value: function parseAlarmTime(alarm) {
        d('active alarm', alarm);
        if (!alarm) return;

        var scheduledTime = alarm.scheduledTime;

        var timespan = countdown(scheduledTime, new Date().getTime(), countdown.HOURS | countdown.MINUTES | countdown.SECONDS);
        return timespan.toString(2);
      }
    }, {
      key: 'removeAllAlarms',
      value: function removeAllAlarms() {
        return alarms.clearAll();
      }
    }, {
      key: 'addNewTab',
      value: function addNewTab(tab) {
        var _this5 = this;

        return this.storage.getIsOff().then(function (value) {
          if (!value) return;
          return _this5.storage.saveNew(tab).then(function () {
            return _this5.createAlarm(tab.id, 1, 360);
          });
        });
      }
    }]);

    return TabManager;
  })();

  root.TabManager = TabManager;
})(window);