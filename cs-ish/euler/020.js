//
// Factorial digit sum
//
// n! means n × (n − 1) × ... × 3 × 2 × 1
//
// For example, 10! = 10 × 9 × ... × 3 × 2 × 1 = 3628800,
// and the sum of the digits in the number 10! is 3 + 6 + 2 + 8 + 8 + 0 + 0 = 27.
//
// Find the sum of the digits in the number 100!
//

var LargeInt = require('../numbers').LargeInt

module.exports = function (size) {
  var n = LargeInt.create(size)
  for (var i = 1; i < size; i++) {
    n.mul(i)
  }
  return n.data.reduce(function (l, r) {
    return l + r
  }, 0)
}
