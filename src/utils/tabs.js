/**
 * @author john
 * @version 12/21/15 4:28 AM
 */

((root) => {

  const TAB_QUERY = {
    currentWindow: true,
    status: 'complete'
  }

  let {tabs} = chrome.promise


  class TabManager {

    getTabIds () {
      return tabs.query(TAB_QUERY)
        .then(tabs => tabs.map(tab => tab.id))
    }

    createAlarms (period, tabIds) {
      d('tabIds', tabIds)

      let alarmInfo = {
        when: Date.now() + 2000
        //delayInMinutes: period
        //periodInMinutes: period
      }

      let promises = []
      tabIds.forEach(id => {
        let name = `tab-${id}`
        let p = chrome.alarms.create(name, alarmInfo)
        promises.push(p)
      })

      return Promise.all(promises)
    }

    refreshTab (id) {
      return tabs.reload(id)
        .then(() => d(`tab-${id} was reloaded!`))
    }
  }

  root.TabManager = TabManager
})(window)
