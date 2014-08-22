
var Promise = require('native-or-bluebird')

require('../../slave')(function (val) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(val)
    }, Math.round(Math.random() * 10))
  })
})
