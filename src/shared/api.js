import './constants'
import debug from 'debug'

/**
 * @author john
 * @version 6/29/16 8:21 PM
 */

let d = debug('app:api')

const RELOAD_WAIT = 1000
const RETRY_ERR = 'Reloading'
const COMPLETE_STATUS_KEY = 'complete'


const cTabs = chrome.promise.tabs
const cAlarms = chrome.promise.alarms
let { storage } = chrome.promise
const cWindows = chrome.promise.windows


export class Api {

  async getAllTabs (query) {
    let tabs = await cTabs.query(query)
    tabs = await tabs.filter(t => !t.url.startsWith('chrome://extensions'))

    return tabs
  }

  async getAllWindows(){
    let windows = await cWindows.getAll()
    return windows
  }


  async getPopupInfo () {

    let data = await storage.local.get({ interval: 720 })
    let data2 = await storage.local.get({ group: 2 })
    let data3 = await storage.local.get({ winWidth: 1677 })
    let data4 = await storage.local.get({ winHeight: 1055 })
    let data5 = await storage.local.get({ winTop: 0 })
    let data6 = await storage.local.get({ winLeft: 0 })
    return [data.interval, data2.group, data3.winWidth, data4.winHeight, data5.winTop, data6.winLeft]
  }

  getAlarm () {
    return cAlarms.get('alarm')
  }

  async start (interval, group) {
    d(`Starting extension with interval: ${interval}, group: ${group}`)
    interval = parseInt(interval, 10)
    group = parseInt(group, 10)
    let on = true

    await storage.local.set({ on, interval, group })
    this.createAlarm(interval)

    chrome.runtime.sendMessage({ event: 'startProcess' })

    return null
  }

  async storeSizes(winWidth, winHeight, winTop, winLeft){
    await storage.local.set({ winWidth, winHeight, winTop, winLeft })
  }

  async reloadShit (group) {

    this.reloadGroup(0, 0, group)
  }

  windowMap (tabs) {
    let map = new Map()
    for (let tab of tabs) {
      let win = tab.windowId
      if (map.has(win))
        map.get(win).push(tab)
      else
        map.set(win, [tab])
    }
    return map
  }

  reloadGroup (windowIndex, currentIndex, group) {

    let $current = currentIndex
    let $windowIndex = windowIndex


    return cTabs.query({})
      .then(allTabs => {
        // d(`Tabs count`, allTabs)
        if (!allTabs.length)
          return null

        let map = this.windowMap(allTabs)
        // d(map)

        let windows = [...map.keys()]
        let windowId = windows[windowIndex]
        let tabs = map.get(windowId)

        d(`Window ${windowId} Index: ${windowIndex}`)

        let allComplete = tabs.every(x => x.status === COMPLETE_STATUS_KEY)
        // d('All tabs are complete', allComplete)

        if (!allComplete) {
          throw new Error(RETRY_ERR)
        }

        let lowerBound = currentIndex - 1
        let upperBound = currentIndex + group

        let tabGroup = tabs.filter(({ index }) => lowerBound < index && index < upperBound)

        d(`currentIndex: ${currentIndex}`)
        // d(`lowerBound: ${lowerBound}`)
        // d(`upperBound: ${upperBound}`)
        // d('tabIndexes', tabGroup.map(x => x.index))

        if (!tabGroup.length) {
          if (windowIndex == windows.length - 1) {
            return
          } else {
            return this.reloadGroup(windowIndex + 1, 0, group)
          }
        }

        tabGroup.map(tab => {
          if (!tab.url.startsWith('chrome://extensions')) {
            if (tab.id)
              cTabs.reload(tab.id)
          }
        })

        let highestIndex = upperBound - 1
        let lastTab = tabGroup[tabGroup.length - 1]
        chrome.runtime.sendMessage({ event: events.CURRENT_GROUP, group: currentIndex })
        // d(`highestIndex: ${highestIndex}`)
        // d(`lastTabIndex: ${lastTab.index}`)

        if (highestIndex === lastTab.index) {
          $current = highestIndex + 1
          this.reloadGroup($windowIndex, $current, group)
        } else {
          this.reloadGroup(windowIndex + 1, 0, group)
        }

      })
      .catch(err => {
        if (err.message === RETRY_ERR)
          setTimeout(() => this.reloadGroup($windowIndex, $current, group), RELOAD_WAIT)
      })

  }

  getGroup () {
    return storage.local.get({ group: 2 })
  }

  stop () {
    cAlarms.clearAll()
    return storage.local.set({ on: false })
  }


  createAlarm (interval) {

    let alarmInfo = {
      periodInMinutes: interval
    }

    chrome.alarms.create('alarm', alarmInfo)
    return cAlarms.get('alarm')
  }

}
