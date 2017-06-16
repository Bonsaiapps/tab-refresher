import $ from 'jquery'
import debug from 'debug'
import countdown from 'countdown'
import { Api } from '../shared/api'


/**
 * @author john
 * @version 12/29/15 6:09 AM
 */

let d = debug('app:popup')
const UNITS = countdown.HOURS | countdown.MINUTES | countdown.SECONDS

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


export class PopupTimer {

  timeoutId = null

  api = new Api()

  $interval = $('#interval')
  $groupCount = $('#group-count')
  $refreshVal = $('#refresh-val')

  bindEvents () {

    chrome.runtime.onMessage.addListener(req => {
      if (req.event == 'reloadPopup')
        this.reloadPopup()
    })

    $('#start').click(ev => this.onStartClick())
    $('#stop').click(ev => this.onStopClick())
    $('#reload-errors').click(ev => this.onReloadErrors())
    this.countErrors()
  }

  async countErrors () {
    let count = 0
    let tabs = await this.api.getAllTabs({})
    for (let tab of tabs) {
      let {title} = tab
      if (title.includes('failed') || title.includes('not available')
        || title.includes('snap') || title.includes('502 Bad'))
        count++
    }
    $('#err-count').text(count + '')
  }

  async onReloadErrors () {
    let tabs = await this.api.getAllTabs({})
    for (let tab of tabs) {
      let { title } = tab
      d('title', title)
      if (title.includes('failed') || title.includes('not available')
        || title.includes('snap') || title.includes('502 Bad')) {
        d('reloading', tab.id)
        if (tab.id)
          chrome.tabs.reload(tab.id)
      }
    }
    setTimeout(() => this.countErrors(), 2000)
  }

  reloadPopup () {
    this.clearValues()
    this.onOpen()
  }

  async onStopClick () {
    await this.api.stop()
    this.clearValues()
    this.$refreshVal.text('Stopped')
  }

  async onStartClick () {
    await this.api.stop()
    await this.api.start(parseInt(this.$interval.val(), 10), parseInt(this.$groupCount.val(), 10))

    let alarm = await this.api.getAlarm()

    if (alarm) {
      this.parseAlarmTime(alarm)
    }
  }

  async onOpen () {

    let [interval, group] = await this.api.getPopupInfo()
    this.$interval.val(interval)
    this.$groupCount.val(group)

    let alarm = await this.api.getAlarm()

    if (alarm) {
      this.parseAlarmTime(alarm)
    } else {
      this.$refreshVal.text('Stopped')
    }
  }

  clearValues () {
    clearTimeout(this.timeoutId)
    clearInterval(this.timeoutId)
    this.$refreshVal.text('')
  }

  parseAlarmTime (alarm) {

    let { scheduledTime } = alarm

    let date = new Date(scheduledTime)
    let text = `${date.getHours()}:${pad(date.getMinutes(), 2)}:${pad(date.getSeconds(), 2)}`
    this.$refreshVal.text(text)
  }

}
