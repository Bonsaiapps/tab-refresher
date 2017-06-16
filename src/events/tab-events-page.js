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
      d(`Event ${req.event}`)
      if (req.event == 'startProcess')
        this.startProcess()
    })

    chrome.alarms.onAlarm.addListener(alarm => this.onAlarmFired(alarm))
  }

  async startProcess () {
    let gData = await this.api.getGroup()

    this.api.reloadShit(gData.group)
  }

  async onAlarmFired (alarm) {
    this.startProcess()
    chrome.runtime.sendMessage({ event: events.RELOAD_POPUP })
  }

}
