/**
 * @author john
 * @version 12/27/15 10:13 PM
 */

$(() => {

  let popup = new PopupTimer()
  popup.bindEvents()
  popup.checkCurrentRefreshTimer()
    .then(() => popup.setEnabledStatus())
    .catch(err => {
      console.warn(err)
      popup.clearValues()
    })

})
