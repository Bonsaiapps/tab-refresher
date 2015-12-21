/**
 * timer for alarms
 *
 * @author john
 * @version 12/21/15 3:16 AM
 */

(() => {

  const TAB_RE = /tab-(\d+)/

  class EventAlarm {

    tabManager = new TabManager()

    constructor () {
      this.register()
    }

    register () {
      d('EventAlarms Register')

      chrome.alarms.onAlarm.addListener(alarm => this.onTabAlarmFired(alarm))
      chrome.tabs.onCreated.addListener(tab => this.onNewTab(tab))
    }

    onTabAlarmFired (alarm) {
      d('alarm', alarm)
      let {name} = alarm
      let match = TAB_RE.exec(name)
      if (!match) {
        return d('TAB NAME MISMATCH', name)
      }

      d('match', match)
      let [, id] = match
      this.tabManager.refreshTab(parseInt(id, 10))
    }

    onNewTab (tab) {
      console.log('NEW tab', tab)

      this.tabManager.addNewTab(tab)

    }
  }

  new EventAlarm()

})()
