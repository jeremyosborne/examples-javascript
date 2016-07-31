/* eslint-env mocha */
var assert = require('assert')
var solution = require('./017')

describe('Project Euler Problem 17: Number Letter Counts', function () {
  it('returns the correct number', function () {
    assert.strictEqual(solution(5), 19)

    assert.strictEqual(solution(1000), 21124)
  })
})
