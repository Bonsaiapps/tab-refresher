/**
 * Class to manage chrome apis around tabs
 *
 * @author john
 * @version 12/27/15 10:19 PM
 */

(() => {


  const ACTIVE_QUERY = {
    status: 'complete',
    active: true,
    currentWindow: true
  }

  const ALL_TABS_QUERY = {
    status: 'complete'
  }

  const cTabs = chrome.promise.tabs
  const cAlarms = chrome.promise.alarms

  class TabManager extends StorageManager {


    async getActiveTab () {

      let tabs = await cTabs.query(ACTIVE_QUERY) || []
      if (!tabs.length)
        throw new Error('No active tab!')

      return tabs[0]
    }

    logTabs (tabs, header) {
      console.groupCollapsed(header)
      tabs.forEach(tab => {
        let { id, url } = tab
        d('%cid%c %d %curl%c %s', BOLD, NORMAL, id, BOLD, NORMAL, url)
      })
      d('')
    }

    async getAllTabs (header) {
      let tabs = await cTabs.query(ALL_TABS_QUERY)
      if (header) this.logTabs(tabs, header)
      return tabs
    }

    cleanInterval (interval) {
      interval.start = this.cleanVal(interval.start)
      interval.end = this.cleanVal(interval.end)
      return interval
    }

    cleanVal (val) {
      val = parseInt(val, 10)
      return -val > 0 ? -val : val
    }

    createAlarms (tabIntervals) {
      let promises = tabIntervals.map(x => this.createAlarm(x))
      return Promise.all(promises)
    }

    createAlarm (interval) {
      this.cleanInterval(interval)
      let { start, end, id } = interval
      let name = `tab-${id}`
      let period = this.generateMinutes(start, end)

      d('%cNew Alarm - Name:%c %s %cRange:%c %d-%d %cPeriod:%c %d',
        BOLD, NORMAL, name, BOLD, NORMAL, start, end, BOLD, NORMAL, period)

      let alarmInfo = {
        // when: new Date().getTime() + 4000
        periodInMinutes: period
      }

      return chrome.alarms.create(name, alarmInfo)
    }

    generateMinutes (start, end) {
      return Math.floor((Math.random() * (end - start)) + start)
    }

    async getAlarm (tab) {
      let name = `tab-${tab.id}`
      let alarm = await cAlarms.get(name)
      if (!alarm) throw new Error('Invalid alarm name ' + name)
      return alarm
    }

    removeAllAlarms () {
      return cAlarms.clearAll()
    }

    removeAlarm (tab) {
      let {id} = tab
      let name = `tab-${id}`
      return cAlarms.clear(name)
    }

    refreshTab (id) {

      return this.saveTabRefresh(id)
        .then(() => cTabs.reload(id))
        .then(() => this.saveTabRefresh(id, 'after'))
        .catch(err => this.clearLogs())
    }
  }

  window.TabManager = TabManager

})()
