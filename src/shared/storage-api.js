import debug from 'debug'
import { REFRESH_LOGS, alarmName } from './constants'

/**
 * @author john
 * @version 12/29/15 7:25 AM
 */

let d = debug('app:storage-api')

const SETTINGS_KEY = 'settings'
const INTERVAL_KEY = 'interval'
const SNAPSHOTS_KEY = 'snapshots'

const START = 1
const END = 360

let { storage } = chrome.promise

export class StorageApi {

  /**
   * Global Methods
   */

  async saveSnap (tabs) {
    let data = await this.getSnapshots()
    data[SNAPSHOTS_KEY][new Date().getTime()] = tabs
    d('data', data)
    return storage.local.set(data)
  }

  getSnapshots () {
    return storage.local.get({ [SNAPSHOTS_KEY]: {} })
  }

  async areAllEnabled () {
    let data = await storage.local.get({ [SETTINGS_KEY]: { enabled: false } })
    return data[SETTINGS_KEY].enabled
  }

  async canTabProceed (id) {
    return await this.areAllEnabled() || await this.isTabEnabled(id)
  }

  enableAll (on = true) {
    let display = on ? 'enabled' : 'disabled'
    d(`Set global to: *b${display}`)
    return storage.local.set({ [SETTINGS_KEY]: { enabled: on } })
      .catch(err => this.clearLogs())
  }

  clearLogs () {
    return storage.local.remove(REFRESH_LOGS)
  }

  async setGlobalIntervals (start, end) {
    start = parseInt(start, 10)
    end = parseInt(end, 10)
    let data = await storage.local.get({ [SETTINGS_KEY]: {} })
    data[SETTINGS_KEY][INTERVAL_KEY] = { start, end }
    return await storage.local.set(data)
  }

  async getGlobalInterval () {
    let data = await storage.local.get({ [SETTINGS_KEY]: { [INTERVAL_KEY]: { start: START, end: END } } })
    return data[SETTINGS_KEY][INTERVAL_KEY]
  }

  getStorageTabs (ids) {
    return storage.local.get(ids)
  }

  saveStorageTabs (storageTabs) {
    return storage.local.set(storageTabs)
  }

  async removeAllStorageTabs () {
    let data = await storage.local.get(null)
    let { logs, settings = {} } = data
    settings.enabled = false
    let save = { logs, settings }
    return storage.local.clear()
      .then(() => storage.local.set(save))
  }

  /**
   * Single Tab Methods
   */

  removeTab (id) {
    return storage.local.remove(id + '')
      .then(() => chrome.promise.alarms.clear(alarmName({ id })))
  }

  getStorageTab (id) {
    return storage.local.get({ [id]: {} })
  }

  async isTabEnabled (id) {
    let data = await this.getStorageTab(id)
    return data[id].enabled
  }

  disableTab (id) {
    return this.enableTab(id, false)
  }

  async enableTab (id, on = true) {
    let data = await this.getStorageTab(id)
    data[id].enabled = on
    return storage.local.set(data)
      .catch(err => this.clearLogs())
  }

  /**
   * Single Interval Methods
   */

  async getSavedInterval (tab) {
    let data = await this.getStorageTab(tab.id)
    return await data[tab.id][INTERVAL_KEY] || this._defaultInterval(tab)
  }


  async saveInterval (tab, start, end) {
    let { id, url, windowId } = tab
    start = parseInt(start, 10)
    end = parseInt(end, 10)

    if (!start) start = 1
    if (!end) end = 1

    let data = await this.getStorageTab(id)
    let interval = { id, url, start, end }
    data[id].windowId = windowId
    data[id][INTERVAL_KEY] = interval

    try {
      await storage.local.set(data)
    } catch (e) {
      this.clearLogs()
    }

    return interval
  }

  _defaultInterval (tab) {
    let id = tab.id
    let [start, end] = [START, END]
    return { id, start, end }
  }

}
