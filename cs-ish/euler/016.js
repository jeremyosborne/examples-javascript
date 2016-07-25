//
// Power Digit Sum
//
// 2^15 = 32768 and the sum of its digits is 3 + 2 + 7 + 6 + 8 = 26.
// What is the sum of the digits of the number 2^1000?
//

var LargeInt = require('../numbers').LargeInt

module.exports = function (size) {
  var n = LargeInt.create('2')
  var i
  for (i = 1; i < size; i++) {
    n.mul(2)
  }
  var total = 0
  var digits = n.data
  for (i = 0; i < digits.length; i++) {
    total += digits[i]
  }
  return total
}
