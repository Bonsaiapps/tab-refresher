import ChromePromise from 'chrome-promise'
import debug from 'debug'

/**
 * @author john
 * @version 4/18/16 1:45 AM
 */

chrome.promise = new ChromePromise()

let d = debug('app:constants')
debug.log = log
window._debug = debug
window._clear = () => chrome.storage.local.clear()
window._local = () => chrome.storage.local.get(null, all => d(all))
window._alarms = () => chrome.alarms.getAll(alarms => d(`%j`, alarms))
window._show = () => _local() || _alarms()


function cLog (str) {

  let len = str.length
  let params = []

  for (let [index, val] of str.split('').entries()) {
    if (val === '*') {
      if (index + 1 === len) continue
      let type = str[index + 1]
      if (type === 'c') continue

      switch (type) {
        case 'b':
          params.push(BOLD)
          break
        case 'n':
          params.push(NORMAL)
          break
      }
    }
  }

  str = str.replace(/(\*b|\*n)/g, '%c')

  return { str, params }
}


function log (...args) {

  let { str, params } = cLog(args[0])
  let len = args.length

  args.splice(len - 1, 0, ...params)
  args[0] = str

  console.log(...args)
}


export const BOLD = 'font-weight: bold;'
export const NORMAL = 'font-weight: normal;'
export const TAB_LOGS_URL = 'https://google.com/'
export const REFRESH_LOGS = 'logs'
export const SNAPSHOTS_KEY = 'snapshots'
export const ALARM_NAME = 'interval-alarm'

export const events = {
  RELOAD_POPUP: 'reloadPopup',
  START_PROCESS: 'startProcess'
}


export function alarmName (tab) {
  let { id } = tab
  return `tab-${id}`
}



