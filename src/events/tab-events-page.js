import debug from 'debug'
import { Api } from '../shared/api'
import { events } from '../shared/constants'

/**
 * Events page listening to start refresh tab groups
 *
 * @author john
 * @version 12/21/15 3:16 AM
 */

let d = debug('app:tab-events-page')


export class TabEventsPage {

  api = new Api()

  register () {
    d('*bAlarm Events Page')

    chrome.runtime.onMessage.addListener(req => {
      if (req.event == 'startProcess')
        this.startProcess(req.id)
    })

    chrome.alarms.onAlarm.addListener(alarm => this.onAlarmFired(alarm))
  }

  async startProcess (windowId) {
    let gData = await this.api.getGroup()

    this.api.reloadShit(windowId, gData.group)
  }

  async onAlarmFired (alarm) {
    let { name } = alarm
    let windowId = parseInt(name, 10)

    this.startProcess(windowId)
    chrome.runtime.sendMessage({ event: events.RELOAD_POPUP })
  }

}
