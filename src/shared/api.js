import debug from 'debug'
import { events } from './constants'

/**
 * @author john
 * @version 6/29/16 8:21 PM
 */

let d = debug('app:api')

const RELOAD_WAIT = 4000
const RETRY_ERR = 'Reloading'
const COMPLETE_STATUS_KEY = 'complete'


const cTabs = chrome.promise.tabs
const cAlarms = chrome.promise.alarms
let { storage, windows } = chrome.promise


export class Api {

  async getAllTabs (query) {
    let tabs = await cTabs.query(query)
    tabs = await tabs.filter(t => !t.url.startsWith('chrome://extensions'))

    return tabs
  }


  async getPopupInfo () {

    let data = await storage.local.get({ interval: 720 })
    let data2 = await storage.local.get({ group: 2 })
    return [data.interval, data2.group]
  }

  getAlarm () {
    return windows.getCurrent()
      .then(win => cAlarms.get(win.id + ''))
  }

  async start (interval, group) {
    d(`Starting extension with interval: ${interval}, group: ${group}`)
    interval = parseInt(interval, 10)
    group = parseInt(group, 10)
    let on = true

    await storage.local.set({ on, interval, group })
    let win = await windows.getCurrent()
    this.createAlarm(win.id, interval)


    return null
  }


  async reloadShit (windowId, group) {
    this.reloadGroup(windowId, 0, group)
  }

  reloadGroup (windowId, currentIndex, group) {

    let $current = currentIndex

    return cTabs.query({ windowId })
      .then(tabs => {

        d(`Tabs count`, tabs)
        if (!tabs.length)
          return null

        let allComplete = tabs.every(x => x.status === COMPLETE_STATUS_KEY)
        d('All tabs are complete', allComplete)

        if (!allComplete) {
          throw new Error(RETRY_ERR)
        }

        let lowerBound = currentIndex - 1
        let upperBound = currentIndex + group

        let tabGroup = tabs.filter(({ index }) => lowerBound < index && index < upperBound)

        d(`currentIndex: ${currentIndex}`)
        d(`lowerBound: ${lowerBound}`)
        d(`upperBound: ${upperBound}`)
        d('tabIndexes', tabGroup.map(x => x.index))

        if (!tabGroup.length)
          return

        tabGroup.map(tab => {
          if (!tab.url.startsWith('chrome://extensions'))
            cTabs.reload(tab.id)
        })

        let highestIndex = upperBound - 1
        let lastTab = tabGroup[tabGroup.length - 1]

        d(`highestIndex: ${highestIndex}`)
        d(`lastTabIndex: ${lastTab.index}`)

        if (highestIndex === lastTab.index) {
          $current = highestIndex + 1
          this.reloadGroup(windowId, $current, group)
        }

      })
      .catch(err => {
        if (err.message === RETRY_ERR)
          setTimeout(() => this.reloadGroup(windowId, $current, group), RELOAD_WAIT)
      })

  }

  getGroup () {
    return storage.local.get({ group: 2 })
  }

  stop () {
    cAlarms.clearAll()
    return storage.local.set({ on: false })
  }


  createAlarm (windowId, interval) {

    let alarmInfo = {
      periodInMinutes: interval
    }

    chrome.alarms.create(windowId + '', alarmInfo)
    return cAlarms.get(windowId + '')
  }

}
