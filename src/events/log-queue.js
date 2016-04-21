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

  async addLog (id, type = 'before') {

    let tab = await api.getTab(id)

    this.queue.push({
      type,
      tab_id: tab.id,
      url: tab.url,
      date: new Date().toLocaleString()
    })

    // if first log added then start timer to save all logs
    setTimeout(() => this.saveLogs(), SAVE_DELAY)
  }

  async saveLogs () {

    let data = await storage.local.get({ [REFRESH_LOGS]: [] })
    data[REFRESH_LOGS].push(...this.queue)

    this.queue.length = 0

    return storage.local.set(data)
  }
}
