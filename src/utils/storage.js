/**
 * @author john
 * @version 12/21/15 2:38 AM
 */


((root) => {

  const PERIOD = 'period'

  let {storage} = chrome.promise

  class ExtStorage {

    getInterval () {
      return storage.sync.get(PERIOD)
    }

    cleanInterval (val) {
      val = parseInt(val, 10)
      return -val > 0 ? -val : val
    }

    saveInterval (period) {
      d('per', period)

      let data = {
        [PERIOD]: period
      }

      return storage.sync.set(data)
    }
  }

  root.ExtStorage = ExtStorage
})(window)

