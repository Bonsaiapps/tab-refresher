/**
 * Class to manage chrome apis around tabs
 *
 * @author john
 * @version 12/27/15 10:19 PM
 */

(() => {


  const ACTIVE_QUERY = {
    currentWindow: true,
    status: 'complete',
    active: true
  }

  const ALL_TABS_QUERY = {
    status: 'complete'
  }

  class TabManager extends StorageManager {


    getActiveTab () {

      return chrome.promise.tabs.query(ACTIVE_QUERY)
        .then((tabs = []) => {
          if (!tabs.length)
            throw new Error('No active tab!')

          return tabs[0]
        })
    }

    getAllTabs () {
      return chrome.promise.tabs.query(ALL_TABS_QUERY)
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
      let {start, end, id} = interval
      let name = `tab-${id}`
      let period = this.generateMinutes(start, end)
      d('Creating Alarm', name, start, end, id, period)

      let alarmInfo = {
        delayInMinutes: period,
        periodInMinutes: period
      }

      return chrome.alarms.create(name, alarmInfo)
    }

    generateMinutes (start, end) {
      return Math.floor((Math.random() * (end - start)) + start)
    }

    getAlarm (tab) {
      let name = `tab-${tab.id}`
      d('Getting alarm', name)
      return chrome.promise.alarms.get(name)
        .then(alarm => {
          if (!alarm) throw new Error('Invalid alarm name ' + name)
          d('Alarm Results', alarm)
          return alarm
        })
    }

    removeAllAlarms () {
      return chrome.promise.alarms.clearAll()
    }

    refreshTab (id) {
      let _tab
      return this.saveTabUrl(id)
        .then(tab => _tab = tab)
        .then(() => chrome.promise.tabs.reload(id))
        .then(() => {
          d(`tab-${id} was reloaded!`)
          return this.logRequest(_tab)

        })
    }
  }

  window.TabManager = TabManager

})()
