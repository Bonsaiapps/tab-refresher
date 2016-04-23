import debug from 'debug'
import { StorageApi } from './storage-api'
import { BOLD, NORMAL, alarmName } from './constants'

/**
 * Class to manage chrome apis around tabs
 *
 * @author john
 * @version 12/27/15 10:19 PM
 */

let d

const ACTIVE_QUERY = {
  status: 'complete',
  active: true,
  currentWindow: true
}

const ALL_TABS_QUERY = {
  status: 'complete'
}

const cTabs = chrome.promise.tabs
const cAlarms = chrome.promise.alarms

export class SharedApi extends StorageApi {

  constructor (logKey) {
    d = debug(`app:${logKey}`)
    super()
  }

  getTab (id) {
    return cTabs.get(id)
  }

  async getActiveTab () {

    let tabs = await cTabs.query(ACTIVE_QUERY) || []
    if (!tabs.length)
      throw new Error('No active tab!')

    return tabs[0]
  }

  logTabs (tabs) {
    tabs.forEach(tab => {
      let { id, url } = tab
      d(`*bid*n ${id} *burl*n ${url}`)
    })
    d('')
  }

  async getAllTabs (header) {
    let tabs = await cTabs.query(ALL_TABS_QUERY)
    tabs = await tabs.filter(t => !t.url.startsWith('chrome://extensions'))

    if (header) this.logTabs(tabs)
    return tabs
  }

  async disableAll () {
    this.enableAll(false)
    let tabs = await this.getAllTabs()
    let storageTabs = await this.getStorageTabs(tabs.map(x => x.id + ''))

    for (let key in storageTabs)
      if (storageTabs.hasOwnProperty(key)) storageTabs[key].enabled = false

    return this.saveStorageTabs(storageTabs)
  }

  cleanInterval (interval) {
    interval.start = this.cleanVal(interval.start)
    interval.end = this.cleanVal(interval.end)
    return interval
  }

  cleanVal (val) {
    val = parseInt(val, 10)
    return -val > 0 ? -val : val
  }

  createAlarm (interval) {
    this.cleanInterval(interval)
    let { start, end } = interval
    let name = alarmName(interval)
    let period = this.generateMinutes(start, end)

    d('%cNew Alarm - Name:%c %s %cRange:%c %d-%d %cPeriod:%c %d',
      BOLD, NORMAL, name, BOLD, NORMAL, start, end, BOLD, NORMAL, period)

    let alarmInfo = {
      when: new Date().getTime() + 2000,
      periodInMinutes: period
    }

    chrome.alarms.create(name, alarmInfo)
    return cAlarms.get(name)
  }

  generateMinutes (start, end) {
    return Math.floor((Math.random() * (end - start)) + start)
  }

  async getAlarm (tab) {
    let name = alarmName(tab)
    let alarm = await cAlarms.get(name)
    if (!alarm) throw new Error('Invalid alarm name ' + name)
    return alarm
  }

  removeAllAlarms () {
    return cAlarms.clearAll()
  }

  removeAlarm (tab) {
    let name = alarmName(tab)
    return cAlarms.clear(name)
  }

  clearDataOnStartup () {
    this.removeAllAlarms()
  }

  async startSingleTab (tab, start, end) {
    if (tab.url.startsWith('chrome://extensions'))
      return Promise.resolve()

    await this.enableTab(tab.id)

    let interval = await this.saveInterval(tab, start, end)
    return await this.createAlarm(interval)
  }

}
