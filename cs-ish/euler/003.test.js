/* eslint-env mocha */
var assert = require('assert')
var solution = require('./003')

describe('Project Euler Problem 3: Largest prime factor', function () {
  it('returns the largest prime factor of the number 600851475143', function () {
    assert.strictEqual(solution(600851475143), 6857)
  })
})
