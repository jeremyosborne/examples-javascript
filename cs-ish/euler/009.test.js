/* eslint-env mocha */
var assert = require('assert')
var solution = require('./009')

describe('Project Euler Problem 9: Special Pythagorean triplet', function () {
  it('returns the correct number', function () {
    assert.strictEqual(solution(1000), 31875000)
  })
})
