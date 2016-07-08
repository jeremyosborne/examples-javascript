/* eslint-env mocha */
var assert = require('assert')
var solution = require('./5')

describe('Project Euler Problem 5: Smallest multiple', function () {
  it('returns the smallest multiple divided by all numbers 1 through 20', function () {
    assert.strictEqual(solution(20), 232792560)
  })
})
