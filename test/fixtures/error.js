
require('../../slave')(function () {
  throw new Error('boom')
})
