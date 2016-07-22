//
// Longest Collatz sequence
//
// The following iterative sequence is defined for the set of positive integers:
//
// n → n/2 (n is even)
// n → 3n + 1 (n is odd)
//
// Using the rule above and starting with 13, we generate the following sequence:
//
// 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1
// It can be seen that this sequence (starting at 13 and finishing at 1) contains 10 terms. Although it has not been proved yet (Collatz Problem), it is thought that all starting numbers finish at 1.
//
// Which starting number, under one million, produces the longest chain?
//
// NOTE: Once the chain starts the terms are allowed to go above one million.
//

var collatz = (function () {
  var cache = {
    1: 1
  }
  var gen = function (n) {
    var n2
    if (!cache[n]) {
      if (n % 2 === 0) {
        n2 = n / 2
      } else {
        n2 = 3 * n + 1
      }
      cache[n] = gen(n2) + 1
    }
    return cache[n]
  }
  return gen
})()

module.exports = function (limit) {
  // Which number...
  var longestNumber = 0
  // ...generates the most terms in the sequence.
  var longestLength = 0

  for (var i = 1; i < limit; i++) {
    // We assume it always ends at 1, if not oops.
    var length = collatz(i)
    if (length > longestLength) {
      longestLength = length
      longestNumber = i
    }
  }
  // We want the number that produces the most terms, not how many terms it produces.
  return longestNumber
}
