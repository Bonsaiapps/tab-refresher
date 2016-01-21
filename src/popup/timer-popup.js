/**
 * @author john
 * @version 12/21/15 12:58 AM
 */

$(() => {

  const COUNTDOWN_DELAY = 1000

  class TimerPopup {

    intervalId = null

    tabManager = new TabManager()

    $startRange = $('#start-range')
    $endRange = $('#end-range')
    $refreshVal = $('#refresh-val')
    $startAll = $('#start-all')
    $disableAll = $('#disable-all')
    $startReset = $('#start-reset')
    $intervalVal = $('#interval-val')

    constructor () {
      this.bindEvents()
      this.setInitialInterval()
    }

    bindEvents () {
      this.$startAll.click(ev => this.onStartAllClick())
      this.$disableAll.click(ev => this.onDisableAllClick())
      this.$startReset.click(ev => this.onStartResetClick())
    }

    setInitialInterval () {
      this.tabManager.queryActiveTab()
        .then(tab => this.tabManager.getFromStorage(tab))
        .then(({ start, end }) => {
          d('start', start, end)
          this.$startRange.val(start)
          this.$endRange.val(end)
        })
        .then(() => this.startCountdown())
    }

    onStartActive () {
      return this.tabManager.startCurrent()
        .then(() => this.startCountdown())

    }

    onStartAllClick () {
      return this.tabManager.queryAll()
        .then(tabs => this.tabManager.createAll(tabs))
        .then(() => this.startCountdown())
    }

    startCountdown () {
      this.intervalId = setInterval(() => this.getActiveTabAlarmTime(), COUNTDOWN_DELAY)
    }

    getActiveTabAlarmTime () {
      this.tabManager.findActiveAlarm()
        .then(alarm => this.parseAlarmTime(alarm))
        .then(display => {

          if (!display) return this.hideCountdownBlock()

          this.$refreshVal.text(display)
        })
    }

    parseAlarmTime (alarm) {
      d('active alarm', alarm)
      if (!alarm) return

      let {scheduledTime, periodInMinutes} = alarm
      this.$intervalVal.text(`${periodInMinutes}m`)
      let timespan = countdown(scheduledTime, new Date().getTime(), countdown.HOURS | countdown.MINUTES | countdown.SECONDS)
      return timespan.toString(2)
    }


    hideCountdownBlock () {
      clearInterval(this.intervalId)
      this.$refreshVal.text('')
      return this.$intervalVal.text('')
    }

    onDisableAllClick () {
      this.tabManager.storage.setter({global: {off: true}})
      this.tabManager.removeAllAlarms()
        .then(() => this.hideCountdownBlock())
    }

    onSaveClick () {
      return this.tabManager.saveRangeForCurrentTab(this.$startRange.val(), this.$endRange.val())
    }

    onStartResetClick () {
      this.onSaveClick()
        .then(() => this.onStartActive())
    }
  }

  /**
   * Constructor will bind any events
   *  and set initial interval, default or storage
   */
  new TimerPopup()
})
