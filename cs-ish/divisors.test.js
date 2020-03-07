/* eslint-env mocha */
var assert = require('assert')
var divisors = require('./divisors')

describe('divisors', function () {
  it('returns expected divisors of a number', function () {
    const total = (n) => divisors(n).reduce((total, i) => total + i, 0)
    // check totals, not the individual divisors
    assert.strictEqual(total(220), 284)
    assert.strictEqual(total(284), 220)
  })
})
