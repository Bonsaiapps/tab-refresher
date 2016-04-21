/**
 * @author john
 * @version 12/27/15 10:13 PM
 */

$(() => {

  let popup = new PopupTimer()
  popup.formatCountdown()
  popup.bindEvents()
  popup.checkCurrentRefreshTimer()
    .catch(err => {
      console.warn(err)
      popup.clearValues()
    })

})
