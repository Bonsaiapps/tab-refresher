/**
 * @author john
 * @version 12/29/15 6:09 AM
 */

(() => {

  const TS_FORMAT = 'M/D/YYYY h:mm:ss a'
  let {runtime} = chrome.promise

  class PopupTimer {

    manager = new TabManager()

    $lastRefreshVal = $('#last-refresh-val')
    $startAll = $('#start-all')
    $disableAll = $('#disable-all')

    bindEvents () {
      this.$startAll.click(ev => this.onStartAllClick())
      this.$disableAll.click(ev => this.onDisableAllClick())
    }

    displayTimestamp () {
      return this.manager.checkIfExtensionIsOn()
        .then(settings => this.manager.getActiveTab(settings.windowId))
        .then(tab => this.manager.getTimestampTab(tab))
        .then(tsTab => {
          d('TS', tsTab)
          if (tsTab && tsTab.timestamp)
            this.$lastRefreshVal.text(moment(tsTab.timestamp).format(TS_FORMAT))
          else
            this.clearValues()
        })
    }

    clearValues () {
      this.$lastRefreshVal.text('')
      return runtime.getBackgroundPage()
        .then(page => clearTimeout(page.bg.timeoutId))
    }

    onStartAllClick () {
      d('Start All Clicked!')

      let _win
      return this.manager.saveGlobalSettings()
        .then(win => _win = win)
        .then(() => runtime.getBackgroundPage())
        .then(page => {
          clearTimeout(page.bg.timeoutId)
          page.bg.startProcess(_win.id)
        })
    }

    onDisableAllClick () {
      return this.manager.disableGlobalSettings()
        .then(() => this.clearValues())
    }

  }

  window.PopupTimer = PopupTimer

})()
