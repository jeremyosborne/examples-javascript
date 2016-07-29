/* eslint-env mocha */
var assert = require('assert')
var numbers = require('./numbers')

describe('largeInt works', function () {
  var LargeInt = numbers.LargeInt
  it('creates numbers of the correct length', function () {
    var i = LargeInt.create(100)
    assert(i.size() === 3)
  })

  it('returns the number as a number as best as possible if asked for', function () {
    var i = LargeInt.create(1234)
    assert(i.val() === 1234)
  })

  it('can be expressed as a string', function () {
    var i = LargeInt.create(321)
    assert(i.toString() === '321')
  })

  it('can add', function () {
    var i = LargeInt.create(993)
    var out = i.add(25).val()
    assert(out === 1018)
  })

  it('can subtract', function () {
    var i = LargeInt.create(1003)
    var out = i.sub(5).val()
    assert(out === 998)
  })

  it('can multiply', function () {
    var i = LargeInt.create(99)
    var out = i.mul(99).val()
    assert(out === 9801)
  })

  it('can greater than', function () {
    var i = LargeInt.create(99)
    assert(i.gt(98))
    assert(!i.gt(99))
    assert(!i.gt(100))
  })
})
