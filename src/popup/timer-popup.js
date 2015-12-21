/**
 * @author john
 * @version 12/21/15 12:58 AM
 */

$(() => {

  // chrome.alarms will only deal in minutes
  // Seemed ok since default was six hours
  const PERIOD = 360

  class TimerPopup {

    storage = new ExtStorage()
    tabManager = new TabManager()

    $period = $('#period')
    $save = $('#save')

    constructor () {
      this.bindEvents()
      this.setInitialInterval()
    }

    setInitialInterval () {
      let savedPer = period
      this.storage.getInterval()
        .then(({period = PERIOD}) => {
          this.$period.val(period)
          return savedPer = period
        })
        .then(() => this.tabManager.getTabIds())
        .then(tabIds => this.tabManager.createAlarms(period, tabIds))
    }

    bindEvents () {
      this.$save.click(evt => this.onRangeChange())

      chrome.promise.runtime.getBackgroundPage()
        .then(window => d('window', window))
    }

    onRangeChange () {
      let period = this.storage.cleanInterval(this.$period.val())
      this.storage.saveInterval(period)
        .then(period => this.tabManager.getTabIds())
        .then(tabIds => this.tabManager.createAlarms(period, tabIds))
    }

  }

  /**
   * Constructor will bind any events
   *  and set initial interval, default or storage
   */
  let timerPopup = new TimerPopup()
})
