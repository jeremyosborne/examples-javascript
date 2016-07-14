/* eslint-env mocha */
var assert = require('assert')
var solution = require('./002')

describe('Project Euler Problem 2: Even Fibonacci numbers', function () {
  it('returns the correct value for values <= 4,000,000', function () {
    assert.strictEqual(solution(4000000), 4613732)
  })
})
