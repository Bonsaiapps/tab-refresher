'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * timer for alarms
 *
 * @author john
 * @version 12/21/15 3:16 AM
 */

(function () {

  var TAB_RE = /tab-(\d+)/;

  var EventAlarm = (function () {
    function EventAlarm() {
      _classCallCheck(this, EventAlarm);

      this.tabManager = new TabManager();

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
      }
    }, {
      key: 'onTabAlarmFired',
      value: function onTabAlarmFired(alarm) {
        d('alarm', alarm);
        var name = alarm.name;

        var match = TAB_RE.exec(name);
        if (!match) {
          return d('TAB NAME MISMATCH', name);
        }

        d('match', match);

        var _match = _slicedToArray(match, 2);

        var id = _match[1];

        this.tabManager.refreshTab(parseInt(id, 10));
      }
    }, {
      key: 'onNewTab',
      value: function onNewTab(tab) {
        console.log('NEW tab', tab);

        this.tabManager.addNewTab(tab);
      }
    }]);

    return EventAlarm;
  })();

  new EventAlarm();
})();