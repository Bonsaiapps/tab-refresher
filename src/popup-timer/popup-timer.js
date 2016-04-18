/**
 * @author john
 * @version 12/29/15 6:09 AM
 */

(() => {

  const COUNTDOWN_DELAY = 1000

  class PopupTimer {

    timeoutId = null
    tab = null

    manager = new TabManager()
    refreshLogs = new RefreshLogs()

    $startRange = $('#start-range')
    $endRange = $('#end-range')
    $refreshVal = $('#refresh-val')
    $startAll = $('#start-all')
    $disableAll = $('#disable-all')
    $startReset = $('#start-reset')
    $intervalVal = $('#interval-val')
    $viewLogs = $('#view-logs')
    $clearLogs = $('#clear-logs')
    $successIcon = $('.success-icon')

    bindEvents () {
      this.$startAll.click(ev => this.onStartAllClick())
      this.$disableAll.click(ev => this.onDisableAllClick())
      this.$startReset.click(ev => this.onStartResetClick())
      this.$viewLogs.click(ev => this.onViewLogs())
      this.$clearLogs.click(ev => this.onClearLogs())
    }

    onViewLogs () {
      return this.refreshLogs.writeFile()
        .then(() => this.showSuccessIcon())
        .catch(err => console.error(err))
    }

    onClearLogs () {
      return this.manager.clearLogs()
        .then(() => this.showSuccessIcon())
        .catch(err => console.error(err))
    }

    showSuccessIcon () {
      this.$successIcon.addClass('on')
      return new Promise(resolve => {
        setTimeout(() => {
          this.$successIcon.removeClass('on')
          resolve()
        }, 2000)
      })
    }

    checkCurrentRefreshTimer () {
      this.tab = null
      this.manager.getAllTabs('Starting Tabs')
      return this.manager.getActiveTab()
        .then(tab => this.tab = tab)
        .then(tab => this.manager.getSavedInterval(tab))
        .then(interval => this.fillInRanges(interval))
        .then(() => this.manager.checkIfExtensionIsOn())
        .then(() => this.manager.getAlarm(this.tab))
        .then(alarm => this.parseAlarmTime(alarm))
    }

    fillInRanges (interval) {
      let { id, start, end } = interval

      d('%cCurrent - id:%c %d %crange:%c %d-%d', BOLD, NORMAL, id, BOLD, NORMAL, start, end)
      console.groupEnd()
      this.$startRange.val(start)
      this.$endRange.val(end)
      return interval
    }

    clearValues () {
      clearTimeout(this.timeoutId)
      this.$refreshVal.text('')
      return this.$intervalVal.text('')
    }

    parseAlarmTime (alarm) {

      let { scheduledTime, periodInMinutes, name } = alarm
      if (!this.timeoutId)
        d('%cParsing Alarm - Name%c: %s %cPeriod%c: %d', BOLD, NORMAL, name, BOLD, NORMAL, periodInMinutes)

      this.$intervalVal.text(`${periodInMinutes}m`)
      let timeSpan = countdown(scheduledTime, new Date().getTime(), countdown.HOURS | countdown.MINUTES | countdown.SECONDS)
      this.$refreshVal.text(timeSpan.toString(4))

      this.timeoutId = setTimeout(() => this.parseAlarmTime(alarm), COUNTDOWN_DELAY)
      return alarm
    }

    onStartAllClick () {
      d('Start All Clicked!')
      return this.manager.saveGlobalSettings()
        .then(() => this.manager.getAllTabs())
        .then(tabs => this.manager.getAllIntervals(tabs))
        .then(tabIntervals => this.manager.createAlarms(tabIntervals))
        .then(() => this.showSuccessIcon())

    }

    async onDisableAllClick () {
      await this.manager.disableGlobalSettings()
      await this.manager.removeAllAlarms()
      await this.clearValues()
      await this.manager.clearTabStorage()
      return await this.showSuccessIcon()
    }

    onStartResetClick () {
      this.manager.saveGlobalSettings()
      this.clearValues()
      return this.manager.saveInterval(this.tab, this.$startRange.val(), this.$endRange.val())
        .then(() => this.manager.getSavedInterval(this.tab))
        .then(interval => this.manager.createAlarm(interval))
        .then(() => this.manager.getAlarm(this.tab))
        .then(alarm => this.parseAlarmTime(alarm))
        .then(() => this.showSuccessIcon())
    }

  }

  window.PopupTimer = PopupTimer

})()
