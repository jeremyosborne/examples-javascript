/* eslint-env mocha */
var assert = require('assert')
var solution = require('./1')

describe('Project Euler Problem 1: Multiples of 3 and 5', function () {
  it('returns the correct value for 1000', function () {
    assert.strictEqual(solution(1000), 233168)
  })
})
