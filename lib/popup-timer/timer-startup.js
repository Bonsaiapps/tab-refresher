"use strict";

/**
 * @author john
 * @version 12/27/15 10:13 PM
 */

$(function () {

  var popup = new PopupTimer();
  popup.formatCountdown();
  popup.bindEvents();
  popup.checkCurrentRefreshTimer().catch(function (err) {
    console.warn(err);
    popup.clearValues();
  });
});