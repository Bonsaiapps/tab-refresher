/**
 * @author john
 * @version 12/29/15 6:09 AM
 */

(() => {

  const SUCCESS_ICON_FADE = 2000

  class PopupTimer {

    timeoutId = null
    units = countdown.HOURS | countdown.MINUTES | countdown.SECONDS

    manager = new TabManager()
    refreshLogs = new RefreshLogs()

    $startRange = $('#start-range')
    $endRange = $('#end-range')
    $refreshVal = $('#refresh-val')
    $startAll = $('#start-all')
    $disableAll = $('#disable-all')
    $startTab = $('#start-tab')
    $disableTab = $('#disable-tab')
    $intervalVal = $('#interval-val')
    $viewLogs = $('#view-logs')
    $clearLogs = $('#clear-logs')
    $successIcon = $('.success-icon')
    $thisTab = $('#this-tab')
    $allTabs = $('#all-tabs')

    constructor () {
      chrome.runtime.onMessage.addListener(request => {
        if (request.event === events.ON_REFRESH) this.onRefresh(request.id)
      })
    }

    async onRefresh (id) {
      this.clearValues()
      let tab = await chrome.promise.tabs.get(id)
      let alarm = await this.manager.getAlarm(tab)
      this.parseAlarmTime(alarm)
      this.setEnabledStatus(id)
    }

    bindEvents () {
      this.$startAll.click(ev => this.onStartAllClick())
      this.$disableAll.click(ev => this.onDisableAllClick())
      this.$startTab.click(ev => this.onStartTab())
      this.$disableTab.click(ev => this.onDisableTab())
      this.$viewLogs.click(ev => this.onViewLogs())
      this.$clearLogs.click(ev => this.onClearLogs())
    }

    async checkCurrentRefreshTimer () {

      await this.manager.getAllTabs('Starting Tabs')

      let tab = await this.manager.getActiveTab()

      let interval = await this.manager.getSavedInterval(tab)
      this.fillInRanges(interval)

      if (!await this.manager.canTabProceed(tab.id)) {
        this.setEnabledStatus(tab.id)
        return console.warn('Extension is disabled')
      }

      let alarm = await this.manager.getAlarm(tab)
      this.parseAlarmTime(alarm)
      this.setEnabledStatus(tab.id)
      return alarm
    }

    async onStartTab () {
      this.clearValues()

      let tab = await this.manager.getActiveTab()

      await this.startSingleTab(tab, this.$startRange.val(), this.$endRange.val())

      let alarm = await this.manager.getAlarm(tab)
      this.parseAlarmTime(alarm)
      this.showSuccessIcon()
      this.setEnabledStatus(tab.id)
      return alarm
    }

    async onDisableTab () {
      this.clearValues()
      let tab = await this.manager.getActiveTab()
      await this.manager.disableTab(tab.id)
      await this.manager.removeAlarm(tab)
      this.showSuccessIcon()
      this.setEnabledStatus(tab.id)
    }

    async startSingleTab (tab, start, end) {
      await this.manager.enableTab(tab.id)

      let interval = await this.manager.saveInterval(tab, start, end)
      return await this.manager.createAlarm(interval)
    }

    async onStartAllClick () {
      await this.manager.enableAll()
      let currentTab = await this.manager.getActiveTab()
      let tabs = this.manager.getAllTabs('All Tabs Enabled')

      let currentAlarm
      for (let tab of tabs) {
        let interval = await this.manager.getSavedInterval(tab)
        let alarm = await this.startSingleTab(tab, interval.start, interval.end)
        if (tab.id === currentTab.id)
          currentAlarm = alarm
      }

      this.parseAlarmTime(currentAlarm)
      this.showSuccessIcon()
      this.setEnabledStatus()
      return tabs
    }

    async onDisableAllClick () {
      this.clearValues()
      await this.manager.disableAll()
      await this.manager.removeAllAlarms()
      await this.manager.clearTabStorage()
      this.setEnabledStatus()
      return await this.showSuccessIcon()
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
        }, SUCCESS_ICON_FADE)
      })
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
      this.$thisTab.text('')
      this.$allTabs.text('')
      this.$refreshVal.text('')
      return this.$intervalVal.text('')
    }

    parseAlarmTime (alarm) {

      let { scheduledTime, periodInMinutes, name } = alarm

      d('%cParsing Alarm - Name%c: %s %cPeriod%c: %d', BOLD, NORMAL, name, BOLD, NORMAL, periodInMinutes)

      this.$intervalVal.text(`${periodInMinutes}m`)

      this.timeoutId = countdown(scheduledTime, timeSpan => this.setRefreshVal(timeSpan), this.units)

      return alarm
    }

    setRefreshVal (timeSpan) {
      this.$refreshVal.text(timeSpan.toString())
    }

    async setEnabledStatus (id) {
      let tab
      if (id)
        tab = await chrome.promise.tabs.get(id)
      else
        tab = await this.manager.getActiveTab()

      let all = await this.manager.areAllEnabled()
      let current = await this.manager.isTabEnabled(tab.id)

      this.$allTabs.text(str(all))
      this.$thisTab.text(str(current))

      function str (bool) {
        return bool ? 'Enabled' : 'Disabled'
      }
    }

    formatCountdown () {
      countdown.setFormat({
        singular: '|s|m|h',
        plural: '|s|m|h',
        last: ' ',
        delim: ' '
      })
    }
  }

  window.PopupTimer = PopupTimer

})()
