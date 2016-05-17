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
            width: 80%;
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
          .id {
            width: 70px;
          }
          .window {
            width: 107px
          }
        </style>
        <div> 
          <br><br>
          <h1 style="text-align: center;">Snapshot <span id="time"></span></h1>
          <br><br>
          <div id="tables"></div>
        </div>
      `
    }

    buildTable (windowId) {
      let table = `
          <table style="margin: auto;"> 
            <thead> 
              <tr> 
                <th class="id">Tab ID</th>
                <th class="window">Window ID</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody id="t-body-${windowId}"></tbody>
          </table>
          <br>
          <br>
      `
      document.getElementById('tables').innerHTML += table
    }

    onGetLogs (json) {

      let data = JSON.parse(json)
      let { time, shots } = data

      let group = new Map()

      for (let shot of shots) {
        let { windowId } = shot
        if (!group.has(windowId))
          group.set(windowId, [])

        let list = group.get(windowId)
        list.push(shot)
        group.set(windowId, list)
      }

      console.log('group', group)

      document.getElementById('time').innerHTML = new Date(parseInt(time, 10)).toLocaleString()

      let windows = [...group.keys()]

      console.log('keys', windows)


      windows.forEach(x => this.buildTable(x))

      for (let [key, value] of group.entries()) {
        this.buildBody(key, value)
      }

      return true
    }

    buildBody (windowId, shots) {
      let html = shots.map(log => `
        <tr> 
          <td class="id">${log.id}</td>
          <td class="window">${log.windowId}</td>
          <td>${log.url}</td>
        </tr>
      `)

      document.getElementById(`t-body-${windowId}`).innerHTML = html.join('')

    }

  }

  let script = new LogScript()
  script.registerEvents()
  script.createTableShell()

})()
