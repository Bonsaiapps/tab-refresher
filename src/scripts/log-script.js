/**
 *
 *
 * @author john
 * @version 4/17/16 1:51 PM
 */


(() => {

  class LogScript {

    constructor () {
      this.registerEvents()
      document.body.innerHTML = `
        <div> 
          <h1 style="text-align: center;">Tab Refresh Logs</h1>
          <br>
          <br>
          <table style="margin: auto;"> 
            <thead> 
              <tr> 
                <th>Tab ID</th>
                <th>URL</th>
                <th>Date</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody id="t-body"></tbody>
          </table>
        </div>
      `
    }

    registerEvents () {
      chrome.runtime.onMessage.addListener(message => this.onGetLogs(message))
    }

    onGetLogs (logJson) {
      let logs = JSON.parse(logJson)
      console.log('logs', logs)

      let html = logs.map(log => `
        <tr> 
          <td>${log.tab_id}</td>
          <td>${log.url}</td>
          <td>${log.date}</td>
          <td>${log.type}</td>
        </tr>
      `)

      document.getElementById('t-body').innerHTML = html.join('')

      return true
    }


  }

  new LogScript()

})()
