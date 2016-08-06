/* eslint-env mocha */
var assert = require('assert')
var solution = require('./019')

describe('Project Euler Problem 19: Counting Sundays', function () {
  it('returns the correct number', function () {
    assert.strictEqual(solution(), 171)
  })
})
