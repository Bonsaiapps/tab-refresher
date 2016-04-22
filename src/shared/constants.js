import ChromePromise from 'chrome-promise'
import debug from 'debug'

/**
 * @author john
 * @version 4/18/16 1:45 AM
 */

window._debug = debug

debug.log = log

chrome.promise = new ChromePromise()

export const BOLD = 'font-weight: bold;'
export const NORMAL = 'font-weight: normal;'
export const TAB_LOGS_URL = 'https://google.com/'
export const REFRESH_LOGS = 'logs'

export const events = {
  RELOAD_POPUP: 'reloadPopup'
}


export function alarmName (tab) {
  let { id, url } = tab
  return `tab-${id}-${url}`
}


function cLog (str) {

  const MODS = ['%b', '%n']
  let len = str.length
  let params = []

  for (let [index, val] of str.split('').entries()) {
    if (val === '%') {
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

  MODS.forEach(mod => str = str.replace(mod, '%c'))
  return { str, params }
}

function log (...args) {
  let { str, params } = cLog(args[0])
  let len = args.length
  args.splice(len - 1, 0, ...params)
  args[0] = str
  console.log(...args)
}
