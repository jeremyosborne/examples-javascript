/* eslint-env mocha */
var assert = require('assert')
var solution = require('./016')

describe('Project Euler Problem 16: Power Digit Sum', function () {
  it('returns the correct number', function () {
    assert.strictEqual(solution(15), 26)

    assert.strictEqual(solution(1000), 1366)
  })
})
