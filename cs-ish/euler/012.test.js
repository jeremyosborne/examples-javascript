/* eslint-env mocha */
var assert = require('assert')
var solution = require('./012')

describe('Project Euler Problem 12: Highly divisible triangular number', function () {
  it('returns the correct number', function () {
    assert.strictEqual(solution(5), 28)

    assert.strictEqual(solution(500), 76576500)
  })
})
