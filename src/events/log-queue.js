import { SharedApi } from '../shared/shared-api'
import { REFRESH_LOGS } from '../shared/constants'
/**
 * @author john
 * @version 4/21/16 4:41 PM
 */

const api = new SharedApi()
const SAVE_DELAY = 5000
let { storage } = chrome.promise

export class LogQueue {

  queue = []
  timeoutId = null

  async addLog (id, type = 'before') {

    let tab
    try {
      tab = await api.getTab(id)
    } catch (e) {
      console.warn(e)
      return Promise.resolve()
    }

    if (!tab) return

    this.queue.push({
      type,
      tab_id: tab.id,
      url: tab.url,
      date: new Date().toLocaleString()
    })

    // if first log added then start timer to save all logs
    if (this.queue.length == 1)
      this.timeoutId = setTimeout(() => this.saveLogs(), SAVE_DELAY)

    return tab
  }

  async saveLogs () {

    let data = await storage.local.get({ [REFRESH_LOGS]: [] })
    data[REFRESH_LOGS].push(...this.queue)

    this.queue.length = 0

    try {
      return storage.local.set(data)
    } catch (e) {
      console.error(e)
      api.clearLogs()
    }
  }
}
