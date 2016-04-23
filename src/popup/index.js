import 'bootstrap-css-only'
import 'babel-polyfill'

import $ from 'jquery'
import countdown from 'countdown'
import { PopupTimer } from './popup'

import './popup.sass'


/**
 * @author john
 * @version 12/27/15 10:13 PM
 */

$(() => {

  formatCountdown()

  let popup = new PopupTimer()
  popup.bindEvents()
  popup.checkCurrentRefreshTimer()
    .catch(err => {
      console.warn(err)
      popup.clearValues()
    })

})


function formatCountdown () {
  countdown.setFormat({
    singular: '|s|m|h',
    plural: '|s|m|h',
    last: ' ',
    delim: ' '
  })
}

