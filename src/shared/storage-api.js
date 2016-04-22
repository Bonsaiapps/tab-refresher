import debug from 'debug'
import { BOLD, REFRESH_LOGS } from './constants'

/**
 * @author john
 * @version 12/29/15 7:25 AM
 */

let d = debug('app:storage-api')

const VALID_TYPES = ['after', 'before']
const SETTINGS_KEY = 'settings'
const TABS_KEY = 'tabloids'
const INTERVAL_KEY = 'intervals'

const START = 1
const END = 360

let { storage } = chrome.promise

export class StorageApi {

  async areAllEnabled () {
    let data = await storage.local.get({ [SETTINGS_KEY]: { enabled: false } })
    return data[SETTINGS_KEY].enabled
  }

  async isTabEnabled (id) {
    let data = await storage.local.get({ [TABS_KEY]: { [id]: {} } })
    return data[TABS_KEY][id].enabled
  }

  async canTabProceed (id) {
    return await this.areAllEnabled() || await this.isTabEnabled(id)
  }

  disableTab (id) {
    return this.enableTab(id, false)
  }

  async enableTab (id, on = true) {
    let data = await storage.local.get({ [TABS_KEY]: { [id]: {} } })
    data[TABS_KEY][id].enabled = on
    return storage.local.set(data)
      .catch(err => this.clearLogs())
  }

  enableAll (on = true) {
    d('Set global to: %c%s', BOLD, on ? 'enabled' : 'disabled')
    return storage.local.set({ [SETTINGS_KEY]: { enabled: on } })
      .catch(err => this.clearLogs())
  }

  disableAll () {
    return this.enableAll(false)
  }

  async getSavedInterval (tab) {
    let data = await storage.local.get({ [INTERVAL_KEY]: {} })
    return await data[INTERVAL_KEY][tab.id] || this._defaultInterval(tab)
  }

  _defaultInterval (tab) {
    let id = tab.id
    let [start, end] = [START, END]
    return { id, start, end }
  }

  async saveInterval (tab, start, end) {
    let { id, url } = tab
    start = parseInt(start, 10)
    end = parseInt(end, 10)

    if (isNaN(start) || isNaN(end))
      throw new Error('Range values must be integers')

    if (!start) start = 1
    if (!end) end = 1

    let data = await storage.local.get({ [INTERVAL_KEY]: {} })
    let interval = { id, url, start, end }
    data[INTERVAL_KEY][tab.id] = interval

    try {
      await storage.local.set(data)
    } catch (e) {
      this.clearLogs()
    }

    return interval
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
  
  clearIntervals () {
    return storage.local.remove(INTERVAL_KEY)
  }
}
