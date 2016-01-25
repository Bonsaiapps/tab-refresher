/**
 * Class to manage chrome apis around tabs
 *
 * @author john
 * @version 12/27/15 10:19 PM
 */

(() => {

  class TabManager extends StorageManager {

    doReload (tabs) {
      return this.getLast()
        .then(lastTab => {
          d('LastTab', lastTab)
          let last = -1

          if (lastTab)
            lastTab = tabs.find(x => x.id === lastTab.id)

          if (lastTab)
            last = lastTab.index

          return this.reloadNextTwo(tabs, last)
        })
    }

    reloadNextTwo (tabs, lastIndex) {
      let len = tabs.length
      d('Reload next', 'len', len, 'lastIndex', lastIndex)
      let promises
      let save

      let nextPossIndex = lastIndex + 1

      let diff = len - nextPossIndex

      if (!diff) {
        // was last tab, start at beginning
        nextPossIndex = 0
        diff = 1
      }

      if (diff === 1) {
        save = [tabs.find(x => x.index == nextPossIndex)]

      } else if (diff > 1) {
        let one = tabs.find(x => x.index == nextPossIndex)
        let two = tabs.find(x => x.index == nextPossIndex + 1)

        save = [one, two]
      }

      promises = save.map(tab => {
        return chrome.promise.tabs.reload(tab.id)
      })

      return this.saveLast(save)
        .then(() => Promise.all(promises))

    }

    getAllTabs (windowId) {
      return chrome.promise.tabs.query({windowId: windowId})
    }

    getActiveTab (windowId) {

      let query = {
        windowId: windowId,
        status: 'complete',
        active: true
      }

      return chrome.promise.tabs.query(query)
        .then((tabs = []) => {
          if (!tabs.length)
            throw new Error('No active tab!')

          return tabs[0]
        })
    }

  }

  window.TabManager = TabManager

})()
