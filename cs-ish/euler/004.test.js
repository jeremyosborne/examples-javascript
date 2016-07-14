/* eslint-env mocha */
var assert = require('assert')
var solution = require('./004')

describe('Project Euler Problem 4: Largest palindrome product', function () {
  it('returns the largest palindrome of two 3 digit numbers as 906609', function () {
    assert.strictEqual(solution(3), 906609)
  })
})
