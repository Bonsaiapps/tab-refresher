/**
 * Keeper and Writer of refresh logs
 *
 * @author john
 * @version 4/15/16 2:59 PM
 */


(() => {

  const REFRESH_LOGS = 'refresh-logs'

  let {storage, tabs} = chrome.promise

  class RefreshLogs {

    async writeFile () {

      d('Writing refresh logs')

      let logsData = await storage.local.get(REFRESH_LOGS)
      let logs = await logsData[REFRESH_LOGS]

      console.log('logs', logs)

      let logsMessage = await JSON.stringify(logs) || '[]'

      let tab = await tabs.create({
        active: false,
        url: 'https://google.com'
      })

      console.log('tab', tab)

      await tabs.executeScript(tab.id, {
        file: 'lib/scripts/log-script.js'
      })

      console.log('logsMessage', logsMessage)
      return await tabs.sendMessage(tab.id, logsMessage)
    }

  }

  window.RefreshLogs = RefreshLogs

})()
