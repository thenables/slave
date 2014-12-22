
var Promise = require('native-or-bluebird')
var isGenerator = require('is-generator')
var co = require('co')

module.exports = function (fn) {
  process.on('message', function (m) {
    var thing
    try {
      thing = fn.apply(null, m.args)
    } catch (err) {
      process.send({
        id: m.id,
        error: errorToJSON(err),
      })
      return
    }

    Promise.resolve(isGenerator(thing) ? co(thing) : thing).then(function (val) {
      process.send({
        id: m.id,
        value: val
      })
    }, function (err) {
      process.send({
        id: m.id,
        error: errorToJSON(err),
      })
    })
  })
}

function errorToJSON(err) {
  var obj = {}
  Object.keys(err).forEach(function (key) {
    obj[key] = err[key]
  })
  obj.message = err.message
  obj.stack = err.stack
  return obj
}
