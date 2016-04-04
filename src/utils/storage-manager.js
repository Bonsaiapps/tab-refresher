/**
 *
 *
 * @author john
 * @version 12/29/15 7:25 AM
 */

(() => {

  const SETTINGS_KEY = 'settings'
  const TABS_KEY = 'tabs'

  const START = 1
  const END = 360

  const LOGGING_URL = 'http://py1.systemadmin.com:5020/log'

  let {storage} = chrome.promise

  class StorageManager {

    checkIfExtensionIsOn () {
      return storage.sync.get(SETTINGS_KEY)
        .then(({settings = {}}) => {
          d('Storage Settings Response', settings)
          if (!settings.on)
            throw new Error('Extension is off!')
          return true
        })
    }

    saveGlobalSettings () {
      let settings = { [SETTINGS_KEY]: { on: true } }
      d('Saving Settings', settings)
      return storage.sync.set(settings)
    }

    disableGlobalSettings () {
      let settings = { [SETTINGS_KEY]: { on: false } }
      d('Saving Settings', settings)
      return storage.sync.set(settings)
    }

    getSavedInterval (tab) {
      return storage.sync.get(TABS_KEY)
        .then(({tabs = {}}) => {
          d('Saved Interval Results', 'id', tab.id, 'Results', tabs)
          let interval = tabs[tab.id]
          if (!interval)
            return { start: START, end: END, id: tab.id }
          return interval
        })
    }

    getAllIntervals (chromeTabs) {
      return storage.sync.get(TABS_KEY)
        .then(({tabs = {}}) => {

          let needAlarms = []
          let storageTabsToSave = {}
          chromeTabs.forEach(tab => {
            let interval = tabs[tab.id]

            if (!interval)
              interval = { start: START, end: END, id: tab.id }
            needAlarms.push(interval)
            storageTabsToSave[tab.id] = interval
          })

          storage.sync.set({ [TABS_KEY]: storageTabsToSave })

          return needAlarms
        })
    }

    saveInterval (tab, start, end) {
      return storage.sync.get(TABS_KEY)
        .then(({tabs = {}}) => {
          d('SAVED', tabs)
          tabs[tab.id] = {
            start,
            end,
            id: tab.id
          }

          let saved = {
            [TABS_KEY]: tabs
          }
          return storage.sync.set(saved)
        })
    }

    saveTabUrl (id) {
      let _tab
      return chrome.promise.tabs.get(id)
        .then(tab => {
          _tab = tab
          return storage.sync.get(TABS_KEY)
            .then(({tabs = {}}) => {
              d('SAVED', tabs)
              tabs[tab.id].url = tab.url
              let saved = {
                [TABS_KEY]: tabs
              }
              return storage.sync.set(saved)
            })
            .then(() => this.logRequest(_tab, true))
        })
        .then(() => _tab)
    }

    logRequest (tab, before) {
      d('logging for tab', tab.id)
      let data = { url: tab.url, tab_id: tab.id }
      if (before)
        data['before'] = true
      else
        data['after'] = true
      return $.get(LOGGING_URL, data)
    }
  }

  window.StorageManager = StorageManager

})()
