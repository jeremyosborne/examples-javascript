/* eslint-env mocha */
var assert = require('assert')
var solution = require('./015')

describe('Project Euler Problem 15: Lattice Paths', function () {
  it('returns the correct number', function () {
    assert.strictEqual(solution(2), 6)

    // assert.strictEqual(solution(20), 137846528820)
  })
})
