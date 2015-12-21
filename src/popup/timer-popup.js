/**
 * @author john
 * @version 12/21/15 12:58 AM
 */

$(() => {

  // chrome.alarms will only deal in minutes
  // Seemed ok since default was six hours
  const STATUS_DELAY = 3000
  const COUNTDOWN_DELAY = 1000

  class TimerPopup {

    intervalId = null

    tabManager = new TabManager()

    $start = $('#start')
    $end = $('#end')
    $save = $('#save')
    $refresh = $('#refresh')
    $startAll = $('#start-all')
    $check = $('#check')
    $allOff = $('#all-off')
    $status = $('#status')
    $countdownBlock = $('#countdown')
    $startActive = $('#start-active')
    $disableActive = $('#disable-active')
    $resetTimer = $('#reset-timer')

    constructor () {
      this.bindEvents()
      this.setInitialInterval()
    }

    bindEvents () {
      this.$save.click(ev => this.onSaveClick())
      this.$startAll.click(ev => this.onStartAll())
      this.$check.click(ev => this.getActiveTabAlarmTime())
      this.$allOff.click(ev => this.onAllOffClick())
      this.$startActive.click(ev => this.onStartActive())
      this.$disableActive.click(ev => this.onDisableActive())
      this.$resetTimer.click(ev => this.onResetTimer())
    }

    setInitialInterval () {
      this.tabManager.queryActiveTab()
        .then(tab => this.tabManager.getFromStorage(tab))
        .then(({ start, end }) => {
          d('start', start, end)
          this.$start.val(start)
          this.$end.val(end)
        })
        .then(() => this.startCountdown())
    }

    onStartActive () {
      return this.tabManager.startCurrent()
        .then(() => this.updateStatus('Tab Started'))
        .then(() => this.startCountdown())

    }

    onDisableActive () {

    }

    onSaveClick () {
      return this.tabManager.saveRangeForCurrentTab(this.$start.val(), this.$end.val())
        .then(() => this.updateStatus('Refresh interval saved!'))
    }

    onStartAll () {
      return this.tabManager.queryAll()
        .then(tabs => this.tabManager.createAll(tabs))
        .then(() => this.updateStatus('All tabs started!'))
        .then(() => this.startCountdown())
    }

    updateStatus (statusText) {
      this.$status.text(statusText)
      return setTimeout(() => this.$status.text(''), STATUS_DELAY)
    }

    startCountdown () {
      this.intervalId = setInterval(() => this.getActiveTabAlarmTime(), COUNTDOWN_DELAY)
    }

    getActiveTabAlarmTime () {
      this.tabManager.findActiveAlarm()
        .then(display => {

          if (!display) return this.hideCountdownBlock()

          this.$countdownBlock.css('display', 'block')
          this.$resetTimer.css('display', 'block')
          this.$refresh.text(display)
        })
    }

    hideCountdownBlock () {
      clearInterval(this.intervalId)
      this.$resetTimer.css('display', 'none')
      return this.$countdownBlock.css('display', 'none')
    }

    onAllOffClick () {
      this.tabManager.removeAllAlarms()
        .then(wasCleared => this.updateStatus('All tabs disabled'))
        .then(() => this.hideCountdownBlock())
    }

    onResetTimer () {
      this.onSaveClick()
        .then(() => this.onStartActive())
    }
  }

  /**
   * Constructor will bind any events
   *  and set initial interval, default or storage
   */
  let timerPopup = new TimerPopup()
})
