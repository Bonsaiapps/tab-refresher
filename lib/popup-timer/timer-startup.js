"use strict";

/**
 * @author john
 * @version 12/27/15 10:13 PM
 */

$(function () {

  var popup = new PopupTimer();
  popup.bindEvents();
  var runtime = chrome.promise.runtime;

  runtime.getBackgroundPage()
  //.then(page => page.bg.startIfEnabled())
  .then(function () {
    return popup.displayTimestamp();
  }).catch(function (err) {
    console.warn(err);
    popup.clearValues();
  });
});