//
// Summation of primes
//
// The sum of the primes below 10 is 2 + 3 + 5 + 7 = 17.
//
// Find the sum of all the primes below two million.
//

var isPrime = require('./is-prime')

module.exports = function (limit) {
  var total = 0
  for (var i = 2; i < limit; i++) {
    if (isPrime(i)) {
      total += i
    }
  }
  return total
}
