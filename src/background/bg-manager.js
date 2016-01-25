/**
 * timer for alarms
 *
 * @author john
 * @version 12/21/15 3:16 AM
 */

(() => {

  const COMPLETE_STATUS_KEY = 'complete'
  const RELOAD_WAIT = 2000
  const RETRY_ERR = 'Reloading'
  const NEXT_TWO_START_DELAY = 4000

  class BackgroundManager {

    manager = new TabManager()
    timeoutId = null

    constructor () {

    }

    startIfEnabled () {
      d('Start if enabled')

      return this.manager.checkIfExtensionIsOn()
        .then(settings => this.startProcess(settings.windowId))
    }

    startProcess (windowId) {
      return this.manager.getAllTabs(windowId)
        .then(tabs => {
          d('-- All Tabs', tabs)
          if (!tabs.length)
            throw new Error('Where are the tabs?')
          let allComplete = tabs.every(x => x.status === COMPLETE_STATUS_KEY)
          d('All tabs are complete', allComplete)

          if (!allComplete) {
            throw new Error(RETRY_ERR)
          }

          return tabs
        })
        .then(tabs => this.manager.doReload(tabs))
        .then(promises => {
          d('Tab(s) reloaded - Starting status check to run next')
          this.timeoutId = setTimeout(() => this.startIfEnabled(), NEXT_TWO_START_DELAY)
        })
        .catch(err => {
          if (err.message === RETRY_ERR) {
            this.timeoutId = setTimeout(() => this.startProcess(), RELOAD_WAIT)

          } else {
            console.warn(err)
            clearTimeout(this.timeoutId)
          }
        })
    }

  }


  let bg = new BackgroundManager()
  window.bg = bg

})()
