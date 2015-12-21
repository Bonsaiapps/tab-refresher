'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var d = console.log.bind(console);(function (root) {
  function ChromePromise(chrome, Promise) {
    chrome = chrome || root.chrome;
    Promise = Promise || root.Promise;

    var setPromiseFunction = function setPromiseFunction(fn, self) {

      return function () {
        var args = arguments;

        return new Promise(function (resolve, reject) {
          function callback() {
            var err = chrome.runtime.lastError;
            if (err) {
              reject(err);
            } else {
              resolve.apply(null, arguments);
            }
          }

          args[args.length] = callback;
          args.length++;

          fn.apply(self, args);
        });
      };
    };

    var fillProperties = function fillProperties(from, to) {
      for (var key in from) {
        if (Object.prototype.hasOwnProperty.call(from, key)) {
          var val = from[key];
          var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);

          if (type === 'object' && !(val instanceof ChromePromise)) {
            to[key] = {};
            fillProperties(val, to[key]);
          } else if (type === 'function') {
            to[key] = setPromiseFunction(val, from);
          } else {
            to[key] = val;
          }
        }
      }
    };

    fillProperties(chrome, this);
  }

  root.ChromePromise = ChromePromise;
})(window);

chrome.promise = new ChromePromise();