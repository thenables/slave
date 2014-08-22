
var assert = require('assert')
var Promise = require('native-or-bluebird')

var master = require('../master')

describe('Slave', function () {
  it('should support synchronous functions', function () {
    var filename = require.resolve('./fixtures/sync.js')
    var fn = master(filename)
    fn.fork()

    return fn(1).then(function (val) {
      assert.equal(1, val)
      fn.kill(0)
    })
  })

  it('should support multiple arguments', function () {
    var filename = require.resolve('./fixtures/add.js')
    var fn = master(filename)
    fn.fork()

    return fn(1, 2, 3).then(function (val) {
      assert.equal(6, val)
      fn.kill(0)
    })
  })

  it('should support errors', function () {
    var filename = require.resolve('./fixtures/error.js')
    var fn = master(filename)
    fn.fork()

    return fn().then(function () {
      throw new Error('wtf')
    }).catch(function (err) {
      assert.equal(err.message, 'boom')
      assert(err instanceof Error)
      fn.kill(0)
    })
  })

  it('should support options.forks=', function () {
    var filename = require.resolve('./fixtures/sync.js')
    var fn = master(filename, {
      forks: 1
    })

    return fn(1).then(function (val) {
      assert.equal(1, val)
      fn.kill(0)
    })
  })

  it('should support multiple jobs', function () {
    var filename = require.resolve('./fixtures/promise.js')
    var fn = master(filename, {
      forks: 3
    })

    var fns = []
    for (var i = 0; i < 10; i++) (function (i) {
      fns.push(fn(i).then(function (val) {
        assert.equal(val, i)
      }))
    })(i)

    return Promise.all(fns)
  })

  it('should throw if no child processes were created', function () {
    var fn = master('')
    assert.throws(function () {
      fn()
    })
  })

  it('should support promise errors', function () {
    var filename = require.resolve('./fixtures/reject.js')
    var fn = master(filename)
    fn.fork()

    return fn().then(function () {
      throw new Error('boom')
    }).catch(function (err) {
      assert.equal(err.message, 'haha')
      fn.kill(0)
    })
  })
})
