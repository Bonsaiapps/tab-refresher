/**
 * @author john
 * @version 12/27/15 10:13 PM
 */

$(() => {

  let popup = new PopupTimer()
  popup.bindEvents()
  let {runtime} = chrome.promise

  runtime.getBackgroundPage()
    //.then(page => page.bg.startIfEnabled())
    .then(() => popup.displayTimestamp())
    .catch(err => {
      console.warn(err)
      popup.clearValues()
    })

})
