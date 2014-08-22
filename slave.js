
var co = require('awaitable')
var isGenFun = require('is-generator').fn

module.exports = function (fn) {
  if (isGenFun(fn)) fn = co.wrap(fn)

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

    if (!isPromise(thing)) return process.send({
      id: m.id,
      value: thing,
    })

    thing.then(function (val) {
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

function isPromise(x) {
  return x && typeof x.then === 'function'
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
