/**
 * @author john
 * @version 12/21/15 4:28 AM
 */

((root) => {

  const MILL_CON = 60000

  const TAB_QUERY = {
    currentWindow: true,
    status: 'complete'
  }

  let {tabs, alarms} = chrome.promise


  class TabManager {

    storage = new ExtStorage()

    getFromStorage (tab) {
      return this.storage.getInterval(tab)
    }

    saveRangeForCurrentTab (start, end) {

      return this.queryActiveTab()
        .then(tab => this.storage.saveCurrent(start, end, tab))
    }

    generateMinutes (start, end) {
      return Math.floor((Math.random() * (end - start)) + start)
    }

    queryAll () {
      return tabs.query({})
        .then(resp => {
          console.log('resp', resp)

          return resp
        })
    }

    startCurrent () {
      return this.queryActiveTab()
        .then(tab => this.storage.getInterval(tab))
        .then(({ id, start, end }) => this.createAlarm(id, start, end))
    }

    cleanBoth (start, end) {
      start = this.storage.cleanInterval(start)
      end = this.storage.cleanInterval(end)
      return { start, end }
    }

    createAlarm (id, startVal, endVal) {
      let name = `tab-${id}`
      let {start, end} = this.cleanBoth(startVal, endVal)
      let period = this.generateMinutes(start, end)

      d('period', period, start, end)
      let alarmInfo = {
        //when: Date.now() + 10000
        delayInMinutes: period,
        periodInMinutes: period
      }

      return chrome.alarms.create(name, alarmInfo)
    }

    createAll (allTabs) {

      let promises = []

      d('tabs', allTabs)
      allTabs.forEach(tab => {
        d('tab', tab)
        let p = this.storage.getInterval(tab)
          .then(({ id, start, end }) => this.createAlarm(tab.id, start, end))

        promises.push(p)
      })

      return Promise.all(promises)
    }

    refreshTab (id) {
      return tabs.reload(id)
        .then(() => d(`tab-${id} was reloaded!`))
    }

    queryActiveTab () {
      let activeQuery = TAB_QUERY
      activeQuery.active = true

      return tabs.query(activeQuery)
        .then((all = [{}]) => {
          d('query active', all[0])
          return all[0]
        })
    }

    findActiveAlarm () {
      let activeQuery = TAB_QUERY
      activeQuery.active = true

      return this.queryActiveTab()
        .then(tab => {

          let name = `tab-${tab.id}`
          d('active name', name)
          return alarms.get(name)
        })
        .then(alarm => this.parseAlarmTime(alarm))
    }

    parseAlarmTime (alarm) {
      d('active alarm', alarm)
      if (!alarm) return

      let {scheduledTime} = alarm
      let date = new Date(scheduledTime)
      let diffMill = Math.abs(new Date() - date)
      let mins = diffMill / MILL_CON
      return Math.round(mins * 100) / 100
    }

    removeAllAlarms () {
      return alarms.clearAll()
    }

    addNewTab (tab) {

      return this.storage.saveNew(tab)
        .then(() => this.createAlarm(tab.id, 1, 360))
    }
  }

  root.TabManager = TabManager
})(window)
