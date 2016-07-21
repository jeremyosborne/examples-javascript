//
// Large sum
//
// Work out the first ten digits of the sum of the following one-hundred 50-digit
// numbers (included in the test).
//

var LargeInt = require('../numbers').LargeInt

// Assumes an array of strings are being passed.
module.exports = function (numbers) {
  numbers = numbers.slice()
  var n = LargeInt.create(numbers.pop())
  while (numbers.length) {
    n.add(numbers.pop())
  }
  return n.toString().slice(0, 10)
}
