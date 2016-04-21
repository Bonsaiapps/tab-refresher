import ChromePromise from 'chrome-promise'
import * as debug from 'debug'

/**
 * @author john
 * @version 4/18/16 1:45 AM
 */

window._debug = debug
debug.cLog = cLog
let d = debug('app:constants')

chrome.promise = new ChromePromise()

export const BOLD = 'font-weight: bold;'
export const NORMAL = 'font-weight: normal;'
export const TAB_LOGS_URL = 'https://google.com/'
export const REFRESH_LOGS = 'logWriter'

export const events = {
  RELOAD_POPUP: 'reloadPopup'
}


export function alarmName (tab) {
  let { id, url } = tab
  return `tab-${id}-${url}`
}

const MODS = ['%b', '%n']

function cLog (str) {

  let len = str.length
  let params = []

  for (let [index, val] of str) {
    if (val === '%') {
      if (index + 1 === len) continue

      let type = str[index + 1]
      switch (type) {
        case 'b':
          params.push(BOLD)
          break
        case 'n':
          params.push(NORMAL)
          break
        default:
          console.warn(`cLog modifier not found: ${type}`)
      }
    }
  }

  MODS.forEach(mod => str = str.replace(mod, '%c'))
  d(str, ...params)
}
