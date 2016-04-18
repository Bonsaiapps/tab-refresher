/**
 *
 *
 * @author john
 * @version 12/29/15 7:25 AM
 */

(() => {

  const VALID_TYPES = ['after', 'before']
  const SETTINGS_KEY = 'settings'
  const TABS_KEY = 'tabs'
  const REFRESH_LOGS = 'refresh-logs'

  const START = 1
  const END = 360

  let { storage } = chrome.promise

  class StorageManager {

    checkIfExtensionIsOn () {
      return storage.sync.get(SETTINGS_KEY)
        .then(({ settings = {} }) => {
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
        .then(({ tabs = {} }) => {
          d('Saved Interval Results', 'id', tab.id, 'Results', tabs)
          let interval = tabs[tab.id]
          if (!interval)
            return { start: START, end: END, id: tab.id }
          return interval
        })
    }

    getAllIntervals (chromeTabs) {
      return storage.sync.get(TABS_KEY)
        .then(({ tabs = {} }) => {

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
        .then(({ tabs = {} }) => {
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

    async saveTabRefresh (id, type = 'before') {

      if (!VALID_TYPES.includes(type)) throw new Error('Type not valid. ' + type + ' given.')

      let tab = await chrome.promise.tabs.get(id)

      let resultObject = await storage.local.get(REFRESH_LOGS)

      let results = await resultObject[REFRESH_LOGS] || []

      results.push({
        type,
        tab_id: tab.id,
        url: tab.url,
        date: new Date().toLocaleString()
      })

      d('results', results)
      return await storage.local.set({ [REFRESH_LOGS]: results })
    }

    clearTabStorage () {
      return storage.local.remove(TABS_KEY)
    }

    clearLogs () {
      return storage.local.remove(REFRESH_LOGS)
    }

  }

  window.StorageManager = StorageManager

})()
