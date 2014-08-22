
# slave

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Gittip][gittip-image]][gittip-url]

Slave is a tiny utility to allow you to create long-running slave processes
for your node process and use these functions as promises.
Create modules that run in separate processes without anyone even knowing!

## Walkthrough

Wrap your function in a slave.
The function must either:

- Be a [co](https://github.com/visionmedia/co)-based generator function
- A function that returns a promise
- A synchronous function

Now, create a separate `my-module/slave.js` file:

```js
var slave = require('slave/slave');
var fn = require('./index.js'); // my main module
slave(fn); // it's wrapped!
```

Now you can create a `my-module/master.js` file,
which runs `slave.js`:

```js
var master = require('slave/master');
module.exports = master(require.resolve('./slave.js'))
```

Now users have two ways to use this module.
Directly:

```js
var fn = require('my-module');

fn(1, 2).then(function (val) {

});
```

Using child processes:

```js
var fn = require('my-module/master');

fn(1, 2).then(function (val) {

});
```

## API

### var fn = slave.master(slavepath, [options])


Create a function from a `slavepath`,
which exports a `slave.slave()` function.

Options are:

- `forks=0` - number of child processes to initiate immediately

`fn` will __always__ return a promise,
even if the wrapped function is synchronous.

### fn.fork()

Create a new child process.

### slave.slave(fn)

Hooks a function into `process` to allow the parent process to listen.

[npm-image]: https://img.shields.io/npm/v/slave.svg?style=flat-square
[npm-url]: https://npmjs.org/package/slave
[github-tag]: http://img.shields.io/github/tag/thenables/slave.svg?style=flat-square
[github-url]: https://github.com/thenables/slave/tags
[travis-image]: https://img.shields.io/travis/thenables/slave.svg?style=flat-square
[travis-url]: https://travis-ci.org/thenables/slave
[coveralls-image]: https://img.shields.io/coveralls/thenables/slave.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/thenables/slave?branch=master
[david-image]: http://img.shields.io/david/thenables/slave.svg?style=flat-square
[david-url]: https://david-dm.org/thenables/slave
[license-image]: http://img.shields.io/npm/l/slave.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/slave.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/slave
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat-square
[gittip-url]: https://www.gittip.com/jonathanong/
