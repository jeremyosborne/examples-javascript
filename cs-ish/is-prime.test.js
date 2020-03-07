/* eslint-env mocha */
var assert = require('assert')
var isPrime = require('./is-prime')

describe('isPrime', function () {
  it('works', function () {
    assert.strictEqual(isPrime(1), false)
    assert.strictEqual(isPrime(-1), false)
    assert.strictEqual(isPrime(2), true)
  })
})
