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
      key: 'createTableShell',
      value: function createTableShell() {
        document.body.innerHTML = '\n        <style> \n          * {\n            box-sizing: border-box;\n          }\n          body {\n            font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;\n            font-size: 14px;\n            line-height: 1.42857143;\n            color: #333;\n          }\n          table {\n            border-collapse: collapse;\n            border-spacing: 0;\n          }\n          thead tr th {\n            border: 1px solid #ddd;\n            border-bottom-width: 2px;\n            padding: 8px;\n          }\n          tbody tr td {\n            border: 1px solid #ddd;\n            padding: 8px;\n          }\n        </style>\n        <div> \n          <br><br>\n          <h1 style="text-align: center;">Tab Refresh Logs</h1>\n          <br><br>\n          <table style="margin: auto;"> \n            <thead> \n              <tr> \n                <th>Tab ID</th>\n                <th>URL</th>\n                <th>Date</th>\n                <th>Type</th>\n              </tr>\n            </thead>\n            <tbody id="t-body"></tbody>\n          </table>\n        </div>\n      ';
      }
    }, {
      key: 'onGetLogs',
      value: function onGetLogs(logJson) {
        var logs = JSON.parse(logJson);
        var html = logs.map(function (log) {
          return '\n        <tr> \n          <td>' + log.tab_id + '</td>\n          <td>' + log.url + '</td>\n          <td>' + log.date + '</td>\n          <td>' + log.type + '</td>\n        </tr>\n      ';
        });

        document.getElementById('t-body').innerHTML = html.join('');

        return true;
      }
    }]);

    return LogScript;
  }();

  var script = new LogScript();
  script.registerEvents();
  script.createTableShell();
})();