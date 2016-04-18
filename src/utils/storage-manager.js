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
      return storage.local.get(SETTINGS_KEY)
        .then(({ settings = {} }) => {
          if (!settings.on)
            throw new Error('Extension is off!')
          return true
        })
    }

    saveGlobalSettings () {
      let settings = { [SETTINGS_KEY]: { on: true } }
      d('Saving Settings', settings)
      return storage.local.set(settings)
    }

    disableGlobalSettings () {
      let settings = { [SETTINGS_KEY]: { on: false } }
      d('Saving Settings', settings)
      return storage.local.set(settings)
    }

    getSavedInterval (tab) {
      return storage.local.get(TABS_KEY)
        .then(({ tabs = {} }) => {
          let interval = tabs[tab.id]
          if (!interval)
            return { start: START, end: END, id: tab.id }
          interval.start = parseInt(interval.start, 10)
          interval.end = parseInt(interval.end, 10)
          return interval
        })
    }

    getAllIntervals (chromeTabs) {
      return storage.local.get(TABS_KEY)
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

          storage.local.set({ [TABS_KEY]: storageTabsToSave })

          return needAlarms
        })
    }

    saveInterval (tab, start, end) {
      return storage.local.get(TABS_KEY)
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
          return storage.local.set(saved)
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
