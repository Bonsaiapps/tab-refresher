/**
 *
 *
 * @author john
 * @version 12/29/15 7:25 AM
 */

(() => {

  const SETTINGS_KEY = 'settings'
  const LAST_TAB_KEY = 'lastTab'

  let {storage, windows} = chrome.promise

  class StorageManager {

    checkIfExtensionIsOn () {
      return storage.sync.get(SETTINGS_KEY)
        .then(({settings = {}}) => {
          d('Storage Settings Response', settings)
          if (!settings.yes)
            throw new Error('Extension is off!')
          return settings
        })
    }

    saveGlobalSettings () {
      let _win
      return windows.getCurrent()
        .then(win => {
          _win = win
          let settings = { [SETTINGS_KEY]: { yes: true, windowId: win.id} }
          return storage.sync.set(settings)
        })
        .then(() => _win)
    }

    disableGlobalSettings () {
      let settings = { [SETTINGS_KEY]: { yes: false } }
      d('Saving Settings', settings)
      return storage.sync.set(settings)
    }

    getTimestampTab (tab) {
      return storage.sync.get(tab.id + '')
        .then(tabData => {
          let data = tabData[tab.id] || {}
          d('TAB', tab)
          d('Saved tab data', data)
          return data
        })
    }

    saveLast (saveList) {
      let last = saveList[saveList.length - 1]
      d('Saving last', last)
      let obj = { [LAST_TAB_KEY]: last }
      return storage.sync.set(obj)
        .then(() => {

          let date = new Date().getTime()
          let saveObj = {}
          saveList.forEach(tab => {
            let current = {id: tab.id, url: tab.url, index: tab.index, timestamp: date}
            saveObj[current.id] = current
          })

          //let tabsObj = { [TABS_KEY]: saveObj}
          return storage.sync.set(saveObj)
        })
    }

    getLast () {
      return storage.sync.get(LAST_TAB_KEY)
        .then(obj => obj[LAST_TAB_KEY])
    }

  }

  window.StorageManager = StorageManager

})()
