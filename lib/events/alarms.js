'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * timer for alarms
 *
 * @author john
 * @version 12/21/15 3:16 AM
 */

(function () {

  var TAB_RE = /tab-(\d+)/;

  var EventAlarm = function () {
    function EventAlarm() {
      _classCallCheck(this, EventAlarm);

      this.manager = new TabManager();

      this.register();
    }

    _createClass(EventAlarm, [{
      key: 'register',
      value: function register() {
        var _this = this;

        d('EventAlarms Register');

        chrome.alarms.onAlarm.addListener(function (alarm) {
          return _this.onTabAlarmFired(alarm);
        });
        chrome.tabs.onCreated.addListener(function (tab) {
          return _this.onNewTab(tab);
        });
        chrome.runtime.onStartup.addListener(function () {
          // On startup all tabs can get new ids
          // So we are clearing the storage to prevent confusion
          return _this.manager.clearTabStorage().then(function () {
            return _this.manager.removeAllAlarms();
          });
        });
      }
    }, {
      key: 'onTabAlarmFired',
      value: function onTabAlarmFired(alarm) {
        var _this2 = this;

        d('alarm', alarm);
        var name = alarm.name;

        var match = TAB_RE.exec(name);

        if (!match) throw new Error('Invalid Alarm Name: ' + name);

        var id = match[1];
        this.manager.checkIfExtensionIsOn().then(function () {
          return _this2.manager.refreshTab(parseInt(id, 10));
        }).catch(function (err) {
          if (err.message === 'Extension is off!') _this2.manager.removeAllAlarms();
        });
      }
    }, {
      key: 'onNewTab',
      value: function onNewTab(tab) {
        var _this3 = this;

        var url = tab.url;
        var status = tab.status;
        var active = tab.active;


        if (url === TAB_LOGS_URL && status === 'loading' && active === false) return;

        console.log('New tab opened', tab);

        this.manager.checkIfExtensionIsOn().then(function () {
          return _this3.manager.getSavedInterval(tab);
        }).then(function (interval) {
          return _this3.manager.createAlarm(interval);
        }).catch(function (err) {
          return console.warn(err);
        });
      }
    }]);

    return EventAlarm;
  }();

  new EventAlarm();
})();