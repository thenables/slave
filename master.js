
var Promise = require('native-or-bluebird')
var cp = require('child_process')

var slice = [].slice
var _id = 0 // global ID increment

module.exports = Master

function Master(filename, options) {
  options = options || {}
  var slaves = []

  // create a new child process
  runner.fork = function () {
    var n = cp.fork(filename)
    n.queue = 0
    slaves.push(n)
  }

  if (typeof options.forks === 'number') {
    var forks = options.forks
    while (forks--) runner.fork()
  }

  // kill all child processes
  runner.kill = function (signal) {
    var slave
    while (slave = slaves.shift()) slave.kill(signal)
  }

  // get the cp with the lowest queue
  runner.select = function () {
    var slave
    var selected
    var min = Infinity
    for (var i = 0; i < slaves.length; i++) {
      slave = slaves[i]
      if (slave.queue === 0) return slave
      if (slave.queue < min) {
        selected = slave
        min = slave.queue
      }
    }
    if (selected) return selected
    throw new Error('no child processes!')
  }

  return runner

  function runner() {
    var args = slice.call(arguments)
    var proc = runner.select()
    proc.queue++
    proc._maxListeners++
    var id = _id++

    return new Promise(function (resolve, reject) {
      proc.on('message', function onmessage(res) {
        if (res.id !== id) return
        proc.removeListener('message', onmessage)
        proc.queue--
        proc._maxListeners--
        if ('error' in res) return reject(JSONToError(res.error))
        resolve(res.value)
      })

      proc.send({
        id: id,
        args: args,
      })
    })
  }
}

function JSONToError(obj) {
  var err = new Error(obj.message)
  Object.keys(obj).forEach(function (key) {
    if (key === 'message') return
    err[key] = obj[key]
  })
  return err
}
