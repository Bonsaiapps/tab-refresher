'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 *
 * @author john
 * @version 4/17/16 1:51 PM
 */

(function () {
  var LogScript = function () {
    function LogScript() {
      _classCallCheck(this, LogScript);

      this.registerEvents();
      document.body.innerHTML = '\n        <div> \n          <h1 style="text-align: center;">Tab Refresh Logs</h1>\n          <br>\n          <br>\n          <table style="margin: auto;"> \n            <thead> \n              <tr> \n                <th>Tab ID</th>\n                <th>URL</th>\n                <th>Date</th>\n                <th>Type</th>\n              </tr>\n            </thead>\n            <tbody id="t-body"></tbody>\n          </table>\n        </div>\n      ';
    }

    _createClass(LogScript, [{
      key: 'registerEvents',
      value: function registerEvents() {
        var _this = this;

        chrome.runtime.onMessage.addListener(function (message) {
          return _this.onGetLogs(message);
        });
      }
    }, {
      key: 'onGetLogs',
      value: function onGetLogs(logJson) {
        var logs = JSON.parse(logJson);
        console.log('logs', logs);

        var html = logs.map(function (log) {
          return '\n        <tr> \n          <td>' + log.tab_id + '</td>\n          <td>' + log.url + '</td>\n          <td>' + log.date + '</td>\n          <td>' + log.type + '</td>\n        </tr>\n      ';
        });

        document.getElementById('t-body').innerHTML = html.join('');

        return true;
      }
    }]);

    return LogScript;
  }();

  new LogScript();
})();