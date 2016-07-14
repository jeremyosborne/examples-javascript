/* eslint-env mocha */
var assert = require('assert')
var solution = require('./007')

describe('Project Euler Problem 7: 10001st prime', function () {
  it('returns the correct prime for limit passed in', function () {
    assert.strictEqual(solution(10001), 104743)
  })
})
