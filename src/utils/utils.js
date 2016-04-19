/**
 * @author john
 * @version 4/18/16 1:45 AM
 */

const d = console.log.bind(console)
const BOLD = 'font-weight: bold;'
const NORMAL = 'font-weight: normal;'
const TAB_LOGS_URL = 'https://google.com/'
const REFRESH_LOGS = 'refreshLogs'

const events = {
  ON_REFRESH: 'on-refresh'
}

const types = {
  UNDEF: 'undefined',
  NULL: 'object',
  BOOL: 'boolean',
  NUM: 'number',
  STR: 'string',
  SYM: 'symbol'
}


function __log (...args) {

  let params = []
  let colors = []
  let string = ''

  for (let [index, arg] of args.entries()) {

    if (typeof arg === types.STR) {
      if (arg.startsWith('%b')) {
        string += `${arg} `
        colors.push(BOLD)
      } else if (arg.startsWith('%n')) {
        string += `${arg} `
        colors.push(NORMAL)
      }
    } else {
      params.push(arg)
    }

  }



  d(args)
}

