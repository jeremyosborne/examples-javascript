//
// The prime factors of 13195 are 5, 7, 13 and 29.
// What is the largest prime factor of the number 600851475143 ?
//

// We iterate all numbers because computers are fast. This works because any
// smaller, prime divisor will return and associated composite numbers will be
// skipped.
var smallestPrimeFactor = function (n) {
  var limit = Math.floor(Math.sqrt(n))
  for (var i = 2; i < limit; i++) {
    if (n % i === 0) {
      return i
    }
  }
  return n
}

module.exports = function (val) {
  var p = 1
  do {
    val = Math.floor(val / p)
    p = smallestPrimeFactor(val)
  } while (p < val)
  return val
}
