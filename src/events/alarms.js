/**
 * timer for alarms
 *
 * @author john
 * @version 12/21/15 3:16 AM
 */

(() => {

  const TAB_RE = /tab-(\d+)/

  class EventAlarm {

    manager = new TabManager()

    constructor () {
      this.register()
    }

    register () {
      d('EventAlarms Register')

      chrome.alarms.onAlarm.addListener(alarm => this.onTabAlarmFired(alarm))
      chrome.tabs.onCreated.addListener(tab => this.onNewTab(tab))
      chrome.runtime.onStartup.addListener(() => {
        // On startup all tabs can get new ids
        // So we are clearing the storage to prevent confusion
        return this.manager.clearTabStorage()
          .then(() => this.manager.removeAllAlarms())
      })
    }

    async onTabAlarmFired (alarm) {
      d('alarm', alarm)
      let {name} = alarm
      let match = TAB_RE.exec(name)

      if (!match) throw new Error(`Invalid Alarm Name: ${name}`)

      let id = match[1]
      let enabled = await this.manager.canTabProceed(id)
      if (!enabled)
        return this.manager.removeAllAlarms()

      return await this.manager.refreshTab(parseInt(id, 10))
    }

    onNewTab (tab) {

      let {url, status, active} = tab

      if (url === TAB_LOGS_URL && status === 'loading' && active === false)
        return

      console.log('New tab opened', tab)

      this.manager.checkIfExtensionIsOn()
        .then(() => this.manager.getSavedInterval(tab))
        .then(interval => this.manager.createAlarm(interval))
        .catch(err => console.warn(err))
    }
  }

  new EventAlarm()

})()
