'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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
  var TabManager = (function (_StorageManager) {
    _inherits(TabManager, _StorageManager);

    function TabManager() {
      _classCallCheck(this, TabManager);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(TabManager).apply(this, arguments));
    }

    _createClass(TabManager, [{
      key: 'doReload',
      value: function doReload(tabs) {
        var _this2 = this;

        return this.getLast().then(function (lastTab) {
          d('LastTab', lastTab);
          var last = -1;

          if (lastTab) lastTab = tabs.find(function (x) {
            return x.id === lastTab.id;
          });

          if (lastTab) last = lastTab.index;

          return _this2.reloadNextTwo(tabs, last);
        });
      }
    }, {
      key: 'reloadNextTwo',
      value: function reloadNextTwo(tabs, lastIndex) {
        var len = tabs.length;
        d('Reload next', 'len', len, 'lastIndex', lastIndex);
        var promises = undefined;
        var save = undefined;

        var nextPossIndex = lastIndex + 1;

        var diff = len - nextPossIndex;

        if (!diff) {
          // was last tab, start at beginning
          nextPossIndex = 0;
          diff = 1;
        }

        if (diff === 1) {
          save = [tabs.find(function (x) {
            return x.index == nextPossIndex;
          })];
        } else if (diff > 1) {
          var one = tabs.find(function (x) {
            return x.index == nextPossIndex;
          });
          var two = tabs.find(function (x) {
            return x.index == nextPossIndex + 1;
          });

          save = [one, two];
        }

        promises = save.map(function (tab) {
          return chrome.promise.tabs.reload(tab.id);
        });

        return this.saveLast(save).then(function () {
          return Promise.all(promises);
        });
      }
    }, {
      key: 'getAllTabs',
      value: function getAllTabs(windowId) {
        return chrome.promise.tabs.query({ windowId: windowId });
      }
    }, {
      key: 'getActiveTab',
      value: function getActiveTab(windowId) {

        var query = {
          windowId: windowId,
          status: 'complete',
          active: true
        };

        return chrome.promise.tabs.query(query).then(function () {
          var tabs = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

          if (!tabs.length) throw new Error('No active tab!');

          return tabs[0];
        });
      }
    }]);

    return TabManager;
  })(StorageManager);

  window.TabManager = TabManager;
})();