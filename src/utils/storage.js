/**
 * @author john
 * @version 12/21/15 2:38 AM
 */


((root) => {

  const START = 1
  const END = 360

  const INTERVALS = 'intervals'

  let {storage} = chrome.promise

  class ExtStorage {
    cleanInterval (val) {
      val = parseInt(val, 10)
      return -val > 0 ? -val : val
    }

    getInterval (tab = {}) {
      d('getInter', tab)
      let id = tab.id
      return storage.sync.get(id + '')
        .then(resp => {
          d('get interval', resp)
          return resp[id]
        })
        .then(({ start = START, end = END } = {}) => ({ start, end, id }))
    }

    saveCurrent (start, end, tab) {

      let id = tab.id
      let data = {
        [id + '']: { start, end, id }
      }

      return storage.sync.set(data)
    }

    saveNew (tab) {
      let id = tab.id
      let data = {
        [id + '']: { start: START, end: END, id }
      }

      return storage.sync.set(data)
    }

    setter (data) {
      return storage.sync.set(data)
    }

    getIsOff () {
      return storage.sync.get('global')
        .then((resp = {}) => {
          d('OFF', resp)
          return resp.off
        })
    }

    getGlobalInterval () {
      return storage.sync.get(INTERVALS)
    }

    saveGlobalInterval (start, end) {

      start = this.cleanInterval(start)
      end = this.cleanInterval(end)

      let data = {
        [INTERVALS]: { start, end }
      }

      return storage.sync.set(data)
    }
  }

  root.ExtStorage = ExtStorage
})(window)

