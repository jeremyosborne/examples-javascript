/* eslint-env mocha */
var assert = require('assert')
var solution = require('./020')

describe('Project Euler Problem 20: Factorial digit sum', function () {
  it('returns the correct number', function () {
    assert.strictEqual(solution(10), 27)

    assert.strictEqual(solution(100), 648)
  })
})
