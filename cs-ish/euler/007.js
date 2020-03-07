//
// By listing the first six prime numbers: 2, 3, 5, 7, 11, and 13,
// we can see that the 6th prime is 13.
//
// What is the 10,001st prime number?
//

var isPrime = require('../is-prime')

module.exports = function (limit) {
  var counter = 2
  var candidate = 3
  if (limit === 1) {
    // Special case.
    return 2
  }
  if (limit === 2) {
    // Special case, here just simplifies the while loop below.
    return candidate
  }
  while (counter < limit) {
    candidate += 2
    while (!isPrime(candidate)) {
      candidate += 2
    }
    counter += 1
  }
  return candidate
}
