/**
 *
 *
 * @author john
 * @version 4/17/16 1:51 PM
 */


(() => {

  class LogScript {

    registerEvents () {
      chrome.runtime.onMessage.addListener(message => this.onGetLogs(message))
    }

    createTableShell () {
      document.body.innerHTML = `
        <style> 
          * {
            box-sizing: border-box;
          }
          body {
            font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
            font-size: 14px;
            line-height: 1.42857143;
            color: #333;
          }
          table {
            border-collapse: collapse;
            border-spacing: 0;
          }
          thead tr th {
            border: 1px solid #ddd;
            border-bottom-width: 2px;
            padding: 8px;
          }
          tbody tr td {
            border: 1px solid #ddd;
            padding: 8px;
          }
        </style>
        <div> 
          <br><br>
          <h1 style="text-align: center;">Tab Refresh Logs</h1>
          <br><br>
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

    onGetLogs (logJson) {
      let logs = JSON.parse(logJson)
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

  let script = new LogScript()
  script.registerEvents()
  script.createTableShell()

})()
