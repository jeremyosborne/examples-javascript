/* eslint-env mocha */
var assert = require('assert')
var solution = require('./021')

describe('Project Euler Problem 21: Amicable numbers', function () {
  it('returns the correct number', function () {
    // solution from: https://github.com/luckytoilet/projecteuler-solutions/blob/master/Solutions.md
    assert.strictEqual(solution(10000), 31626)
  })
})
