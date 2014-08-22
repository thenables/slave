
var Promise = require('native-or-bluebird')

require('../../slave')(function (val) {
  return Promise.reject(new Error('haha'))
})
