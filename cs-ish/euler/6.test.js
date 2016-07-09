/* eslint-env mocha */
var assert = require('assert')
var solution = require('./6')

describe('Project Euler Problem 6: Sum square difference', function () {
  it('returns difference between the sum of the squares of the first one hundred natural numbers', function () {
    assert.strictEqual(solution(100), 25164150)
  })
})
