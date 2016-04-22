import $ from 'jquery'
import debug from 'debug'
import countdown from 'countdown'
import { BOLD, NORMAL } from '../shared/constants'
import { SharedApi } from '../shared/shared-api'
import { LogWriter } from './log-writer'


/**
 * @author john
 * @version 12/29/15 6:09 AM
 */

let d = debug('app:popup')
const SUCCESS_ICON_FADE = 2000
const UNITS = countdown.HOURS | countdown.MINUTES | countdown.SECONDS


export class PopupTimer {

  tab = null
  timeoutId = null

  api = new SharedApi('popup')
  logWriter = new LogWriter()

  $startRange = $('#start-range')
  $endRange = $('#end-range')
  $refreshVal = $('#refresh-val')
  $intervalVal = $('#interval-val')
  $successIcon = $('.success-icon')
  $thisTab = $('#this-tab')
  $allTabs = $('#all-tabs')

  bindEvents () {
    chrome.runtime.onMessage.addListener(req => this[req.event](req.id))

    $('#start-all').click(ev => this.onStartAllClick())
    $('#disable-all').click(ev => this.onDisableAllClick())
    $('#start-tab').click(ev => this.onStartTab())
    $('#disable-tab').click(ev => this.onDisableTab())
    $('#view-logs').click(ev => this.onViewLogs())
    $('#clear-logs').click(ev => this.onClearLogs())
    $('#set-all-ranges').click(ev => this.onSetAllRanges())
  }

  async checkCurrentRefreshTimer () {

    await this.api.getAllTabs('Starting Tabs')

    this.tab = await this.api.getActiveTab()

    let interval = await this.api.getSavedInterval(this.tab)
    this.fillInRanges(interval)

    $('.success-icon').removeClass('gay')

    if (!await this.api.canTabProceed(this.tab.id)) {
      this.setEnabledStatus()
      return console.warn('Extension is disabled')
    }

    let alarm = await this.api.getAlarm(this.tab)
    this.parseAlarmTime(alarm)
    this.setEnabledStatus()
    return alarm
  }

  async onSetAllRanges () {
    let start = this.$startRange.val()
    let end = this.$endRange.val()
    let tabs = await this.api.getAllTabs()
    for (let tab of tabs) {
      await this.api.saveInterval(tab, start, end)
    }

    this.showSuccessIcon()
  }

  async reloadPopup (id) {
    this.clearValues()
    this.tab = await this.api.getTab(id)
    let alarm = await this.api.getAlarm(this.tab)
    this.parseAlarmTime(alarm)
    this.setEnabledStatus(id)
  }

  async onStartTab () {
    this.clearValues()

    await this.api.startSingleTab(this.tab, this.$startRange.val(), this.$endRange.val())

    let alarm = await this.api.getAlarm(this.tab)
    this.parseAlarmTime(alarm)
    this.showSuccessIcon()
    return alarm
  }

  async onDisableTab () {
    this.clearValues()
    await this.api.disableTab(this.tab.id)
    await this.api.removeAlarm(this.tab)
    this.showSuccessIcon()
  }

  async onStartAllClick () {
    await this.api.enableAll()
    let tabs = await this.api.getAllTabs('All Tabs Enabled')

    let currentAlarm
    for (let tab of tabs) {
      let interval = await this.api.getSavedInterval(tab)
      let alarm = await this.api.startSingleTab(tab, interval.start, interval.end)
      if (tab.id === this.tab.id)
        currentAlarm = alarm
    }

    this.parseAlarmTime(currentAlarm)
    this.showSuccessIcon()
    return tabs
  }

  async onDisableAllClick () {
    this.clearValues()
    await this.api.disableAll()
    await this.api.removeAllAlarms()
    await this.api.clearTabStorage()
    return await this.showSuccessIcon()
  }

  onViewLogs () {
    return this.logWriter.writeFile()
      .then(() => this.showSuccessIcon())
      .catch(err => console.error(err))
  }

  onClearLogs () {
    return this.api.clearLogs()
      .then(() => this.showSuccessIcon())
      .catch(err => console.error(err))
  }

  showSuccessIcon () {
    this.setEnabledStatus()
    this.$successIcon.addClass('on')
    return new Promise(resolve => {
      setTimeout(() => {
        this.$successIcon.removeClass('on')
        resolve()
      }, SUCCESS_ICON_FADE)
    })
  }

  fillInRanges (interval) {
    let { id, start, end } = interval

    d('%cCurrent - id:%c %d %crange:%c %d-%d', BOLD, NORMAL, id, BOLD, NORMAL, start, end)
    this.$startRange.val(start)
    this.$endRange.val(end)
    return interval
  }

  clearValues () {
    clearTimeout(this.timeoutId)
    this.$thisTab.text('')
    this.$allTabs.text('')
    this.$refreshVal.text('')
    return this.$intervalVal.text('')
  }

  parseAlarmTime (alarm) {

    let { scheduledTime, periodInMinutes, name } = alarm

    d('%cParsing Alarm - Name%c: %s %cPeriod%c: %d', BOLD, NORMAL, name, BOLD, NORMAL, periodInMinutes)

    this.$intervalVal.text(`${periodInMinutes}m`)

    this.timeoutId = countdown(scheduledTime, timeSpan => this.setRefreshVal(timeSpan), UNITS)

    return alarm
  }

  setRefreshVal (timeSpan) {
    this.$refreshVal.text(timeSpan.toString())
  }

  async setEnabledStatus () {

    let all = await this.api.areAllEnabled()
    let current = await this.api.isTabEnabled(this.tab.id)

    this.$allTabs.text(str(all))
    this.$thisTab.text(str(current))

    function str (bool) {
      return bool ? 'Enabled' : 'Disabled'
    }
  }

}
