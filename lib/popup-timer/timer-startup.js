"use strict";

/**
 * @author john
 * @version 12/27/15 10:13 PM
 */

$(function () {

  var popup = new PopupTimer();
  popup.bindEvents();
  popup.checkCurrentRefreshTimer().then(function () {
    return popup.setEnabledStatus();
  }).catch(function (err) {
    console.warn(err);
    popup.clearValues();
  });
});