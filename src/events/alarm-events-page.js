import { events, TAB_LOGS_URL } from '../shared/constants'
import { SharedApi } from '../shared/shared-api'
import * as debug from 'debug'
import { LogQueue } from './log-queue'

/**
 * timer for alarms
 *
 * @author john
 * @version 12/21/15 3:16 AM
 */

let d = debug('app:alarm-events-page')
let cTabs = chrome.promise.tabs

const TAB_RE = /tab-(\d+)-.*/

export class AlarmEventsPage {

  api = new SharedApi()
  logQueue = new LogQueue()

  register () {
    d('EventAlarms Register')

    chrome.alarms.onAlarm.addListener(alarm => this.onTabAlarmFired(alarm))
    chrome.tabs.onCreated.addListener(tab => this.onNewTab(tab))
    chrome.runtime.onStartup.addListener(() => {
      // On startup all tabs can get new ids
      // So we are clearing the storage to prevent confusion
      return this.api.clearTabStorage()
        .then(() => this.api.removeAllAlarms())
    })
  }

  async onTabAlarmFired (alarm) {
    let { name } = alarm
    let match = TAB_RE.exec(name)

    if (!match) throw new Error(`Invalid Alarm Name: ${name}`)

    let id = match[1]

    d.cLog(`%bRefreshing Tab:%n ${id} %bAlarm:%n ${name}`)

    let enabled = await this.api.isTabEnabled(id)
    if (!enabled)
      return this.api.removeAllAlarms()

    id = parseInt(id, 10)
    chrome.runtime.sendMessage({ event: events.RELOAD_POPUP, id: id })

    this.reloadTab(id)
  }

  reloadTab (id) {
    this.logQueue.addLog(id)
    return cTabs.reload(id)
      .then(() => this.logQueue.addLog(id, 'after'))
  }

  onNewTab (tab) {

    let { url, status, active } = tab

    if (url === TAB_LOGS_URL && status === 'loading' && active === false)
      return

    console.log('New tab opened', tab)

    // this.api.checkIfExtensionIsOn()
    //   .then(() => this.api.getSavedInterval(tab))
    //   .then(interval => this.api.createAlarm(interval))
    //   .catch(err => console.warn(err))
  }
}
