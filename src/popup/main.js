import $ from 'jquery'
import * as countdown from 'countdown'
import { PopupTimer } from './popup'

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

