'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author john
 * @version 12/29/15 6:09 AM
 */

(function () {

  var TS_FORMAT = 'M/D/YYYY h:mm:ss a';
  var runtime = chrome.promise.runtime;

  var PopupTimer = (function () {
    function PopupTimer() {
      _classCallCheck(this, PopupTimer);

      this.manager = new TabManager();
      this.$lastRefreshVal = $('#last-refresh-val');
      this.$startAll = $('#start-all');
      this.$disableAll = $('#disable-all');
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
      }
    }, {
      key: 'displayTimestamp',
      value: function displayTimestamp() {
        var _this2 = this;

        return this.manager.checkIfExtensionIsOn().then(function (settings) {
          return _this2.manager.getActiveTab(settings.windowId);
        }).then(function (tab) {
          return _this2.manager.getTimestampTab(tab);
        }).then(function (tsTab) {
          d('TS', tsTab);
          if (tsTab && tsTab.timestamp) _this2.$lastRefreshVal.text(moment(tsTab.timestamp).format(TS_FORMAT));else _this2.clearValues();
        });
      }
    }, {
      key: 'clearValues',
      value: function clearValues() {
        this.$lastRefreshVal.text('');
        return runtime.getBackgroundPage().then(function (page) {
          return clearTimeout(page.bg.timeoutId);
        });
      }
    }, {
      key: 'onStartAllClick',
      value: function onStartAllClick() {
        d('Start All Clicked!');

        var _win = undefined;
        return this.manager.saveGlobalSettings().then(function (win) {
          return _win = win;
        }).then(function () {
          return runtime.getBackgroundPage();
        }).then(function (page) {
          clearTimeout(page.bg.timeoutId);
          page.bg.startProcess(_win.id);
        });
      }
    }, {
      key: 'onDisableAllClick',
      value: function onDisableAllClick() {
        var _this3 = this;

        return this.manager.disableGlobalSettings().then(function () {
          return _this3.clearValues();
        });
      }
    }]);

    return PopupTimer;
  })();

  window.PopupTimer = PopupTimer;
})();