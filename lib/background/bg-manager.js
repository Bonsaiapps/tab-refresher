'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * timer for alarms
 *
 * @author john
 * @version 12/21/15 3:16 AM
 */

(function () {

  var COMPLETE_STATUS_KEY = 'complete';
  var RELOAD_WAIT = 2000;
  var RETRY_ERR = 'Reloading';
  var NEXT_TWO_START_DELAY = 4000;

  var BackgroundManager = (function () {
    function BackgroundManager() {
      _classCallCheck(this, BackgroundManager);

      this.manager = new TabManager();
      this.timeoutId = null;
    }

    _createClass(BackgroundManager, [{
      key: 'startIfEnabled',
      value: function startIfEnabled() {
        var _this = this;

        d('Start if enabled');

        return this.manager.checkIfExtensionIsOn().then(function (settings) {
          return _this.startProcess(settings.windowId);
        });
      }
    }, {
      key: 'startProcess',
      value: function startProcess(windowId) {
        var _this2 = this;

        return this.manager.getAllTabs(windowId).then(function (tabs) {
          d('-- All Tabs', tabs);
          if (!tabs.length) throw new Error('Where are the tabs?');
          var allComplete = tabs.every(function (x) {
            return x.status === COMPLETE_STATUS_KEY;
          });
          d('All tabs are complete', allComplete);

          if (!allComplete) {
            throw new Error(RETRY_ERR);
          }

          return tabs;
        }).then(function (tabs) {
          return _this2.manager.doReload(tabs);
        }).then(function (promises) {
          d('Tab(s) reloaded - Starting status check to run next');
          _this2.timeoutId = setTimeout(function () {
            return _this2.startIfEnabled();
          }, NEXT_TWO_START_DELAY);
        }).catch(function (err) {
          if (err.message === RETRY_ERR) {
            _this2.timeoutId = setTimeout(function () {
              return _this2.startProcess();
            }, RELOAD_WAIT);
          } else {
            console.warn(err);
            clearTimeout(_this2.timeoutId);
          }
        });
      }
    }]);

    return BackgroundManager;
  })();

  var bg = new BackgroundManager();
  window.bg = bg;
})();