import { SNAPSHOTS_KEY, TAB_LOGS_URL } from '../shared/constants'

/**
 * Keeper and Writer of refresh shots
 *
 * @author john
 * @version 4/15/16 2:59 PM
 */

let { storage, tabs } = chrome.promise

export class SnapshotWriter {

  async writeFile (time) {

    console.groupCollapsed('Writing snapshots')

    let shotsData = await storage.local.get({ [SNAPSHOTS_KEY]: {} })
    let data = await shotsData[SNAPSHOTS_KEY]
    let shots = data[time]

    let shit = {
      time,
      shots
    }
    console.log('shots', shots)

    let shotsMessage = await JSON.stringify(shit)

    let tab = await tabs.create({
      active: false,
      url: TAB_LOGS_URL
    })

    await tabs.executeScript(tab.id, {
      file: 'popup/scripts/snapshots-script.js'
    })

    console.groupEnd()
    tabs.sendMessage(tab.id, shotsMessage)
    return tab
  }

}

