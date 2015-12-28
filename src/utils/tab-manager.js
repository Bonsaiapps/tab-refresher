/**
 * Class to manage chrome apis around tabs
 *
 * @author john
 * @version 12/27/15 10:19 PM
 */

(() => {

  const SETTINGS_KEY = 'settings'

  const ACTIVE_QUERY = {
    currentWindow: true,
    status: 'complete',
    active: true
  }

  class TabManager {


    getActiveTab () {

      return chrome.promise.tabs.query(ACTIVE_QUERY)
        .then((tabs = []) => {
          if (!tabs.length)
            throw new Error('No active tab!')

          return tabs[0]
        })
    }

    checkIfExtensionIsOn () {
      chrome.promise.storage.sync.get(SETTINGS_KEY)

    }




  }

})()
