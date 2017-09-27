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
  $winWidth = $('#win-width')
  $winHeight = $('#win-height')
  $winTop = $('#win-top')
  $winLeft = $('#win-left')
  $totalTabs = $('#total-tabs')
  $progress = $('#progress')

  bindEvents () {

    chrome.runtime.onMessage.addListener(req => {
      if (req.event == 'reloadPopup')
        this.reloadPopup()
      if (req.event == 'currentGroup')
        this.updateCounter(req.group)
    })

    $('#start').click(ev => this.onStartClick())
    $('#stop').click(ev => this.onStopClick())
    $('#reload-errors').click(ev => this.onReloadErrors())
    $('#set-size').click(ev => this.setSize())
    this.countErrors()
    this.countTabs()
    $('#current-tab').text('0')
  }

  updateCounter(group){
    let tab_count = group
    $('#current-tab').text(tab_count)
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

  async countTabs () {
    let count = 0
    let tabs = await this.api.getAllTabs({})
    for (let tab of tabs) {
      let {title} = tab
        count++
    }
    $('#total-tabs').text(count + '')
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

  async setSize(){
    let windows = await this.api.getAllWindows({})

    await this.api.storeSizes(parseInt(this.$winWidth.val()), parseInt(this.$winHeight.val()), parseInt(this.$winLeft.val()), parseInt(this.$winTop.val()))

    for (let win of windows) {
      chrome.windows.update(win.id, {
        left: parseInt(this.$winLeft.val()),
        top: parseInt(this.$winTop.val()),
        width: parseInt(this.$winWidth.val()),
        height: parseInt(this.$winHeight.val())
      })
    }

  }

  async onStopClick () {
    await this.api.stop()
    this.clearValues()
    this.$refreshVal.text('Stopped')
    this.$progress.hide()
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

    let [interval, group, winWidth, winHeight, winTop, winLeft] = await this.api.getPopupInfo()
    this.$interval.val(interval)
    this.$groupCount.val(group)

    this.$winWidth.val(winWidth)
    this.$winHeight.val(winHeight)
    this.$winTop.val(winTop)
    this.$winLeft.val(winLeft)

    let alarm = await this.api.getAlarm()

    if (alarm) {
      this.parseAlarmTime(alarm)
      this.$progress.show()
    } else {
      this.$refreshVal.text('Stopped')
      this.$progress.hide()
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
    this.$progress.show()
  }

}
