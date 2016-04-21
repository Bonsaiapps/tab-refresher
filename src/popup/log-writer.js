import { TAB_LOGS_URL, REFRESH_LOGS } from '../shared/constants'

/**
 * Keeper and Writer of refresh logs
 *
 * @author john
 * @version 4/15/16 2:59 PM
 */

let { storage, tabs } = chrome.promise

export class LogWriter {

  async writeFile () {

    console.groupCollapsed('Writing refresh logs')

    let logsData = await storage.local.get({ [REFRESH_LOGS]: [] })
    let logs = await logsData[REFRESH_LOGS]

    console.log('logs', logs)

    let logsMessage = await JSON.stringify(logs)

    let tab = await tabs.create({
      active: false,
      url: TAB_LOGS_URL
    })

    await tabs.executeScript(tab.id, {
      file: 'lib/scripts/log-script.js'
    })

    console.groupEnd()
    tabs.sendMessage(tab.id, logsMessage)
    return tab
  }

}

