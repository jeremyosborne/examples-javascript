/* eslint-env mocha */
var assert = require('assert')
var solution = require('./010')

describe('Project Euler Problem 10: Summation of primes', function () {
  it('returns the correct number', function () {
    assert.strictEqual(solution(10), 17)

    assert.strictEqual(solution(2000000), 142913828922)
  })
})
