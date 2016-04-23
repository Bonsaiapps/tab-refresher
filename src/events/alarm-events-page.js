import { events, TAB_LOGS_URL } from '../shared/constants'
import { SharedApi } from '../shared/shared-api'
import debug from 'debug'
import { LogQueue } from './log-queue'

/**
 * timer for alarms
 *
 * @author john
 * @version 12/21/15 3:16 AM
 */

let d = debug('app:alarm-events-page')
let cTabs = chrome.promise.tabs

const TAB_RE = /tab-(\d+)/

export class AlarmEventsPage {

  api = new SharedApi('alarm-events-page')
  logQueue = new LogQueue()

  register () {
    d('*bAlarm Events Page')
    chrome.alarms.onAlarm.addListener(alarm => this.onTabAlarmFired(alarm))
    chrome.tabs.onRemoved.addListener(id => this.onTabRemoved(id))
    chrome.tabs.onCreated.addListener(tab => this.onNewTab(tab))
    // On startup all tabs can get new ids
    // So we are clearing the storage to prevent confusion
    chrome.runtime.onStartup.addListener(() => this.api.clearDataOnStartup())
  }

  async onTabRemoved (id) {
    d(`Removing tab *b${id}`)
    await this.api.removeTab(id)
  }

  async onTabAlarmFired (alarm) {
    let { name } = alarm
    let match = TAB_RE.exec(name)

    if (!match) throw new Error(`Invalid Alarm Name: ${name}`)

    let id = match[1]

    d(`Refreshing *b%j`, alarm)

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

  async onNewTab (tab) {

    let { id, url } = tab

    if (url.startsWith('chrome://extensions') || url === TAB_LOGS_URL)
      return

    if (!await this.api.canTabProceed(id))
      return

    d(`New Tab ${id} - ${url}`)


    let { start, end } = await this.api.getGlobalInterval()
    return await this.api.startSingleTab(tab, start, end)
  }
}
