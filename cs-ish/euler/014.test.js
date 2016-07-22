/* eslint-env mocha */
var assert = require('assert')
var solution = require('./014')

describe('Project Euler Problem 14: Longest Collatz sequence', function () {
  it('returns the correct number', function () {
    assert.strictEqual(solution(1000000), 837799)
  })
})
