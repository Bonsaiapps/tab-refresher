'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author john
 * @version 12/21/15 4:28 AM
 */

(function (root) {

  var TAB_QUERY = {
    currentWindow: true,
    status: 'complete'
  };

  var tabs = chrome.promise.tabs;

  var TabManager = (function () {
    function TabManager() {
      _classCallCheck(this, TabManager);
    }

    _createClass(TabManager, [{
      key: 'getTabIds',
      value: function getTabIds() {
        return tabs.query(TAB_QUERY).then(function (tabs) {
          return tabs.map(function (tab) {
            return tab.id;
          });
        });
      }
    }, {
      key: 'createAlarms',
      value: function createAlarms(period, tabIds) {
        d('tabIds', tabIds);

        var alarmInfo = {
          when: Date.now() + 2000
          //delayInMinutes: period
          //periodInMinutes: period
        };

        var promises = [];
        tabIds.forEach(function (id) {
          var name = 'tab-' + id;
          var p = chrome.alarms.create(name, alarmInfo);
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
    }]);

    return TabManager;
  })();

  root.TabManager = TabManager;
})(window);