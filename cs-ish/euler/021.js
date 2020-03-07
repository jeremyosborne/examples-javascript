// Let d(n) be defined as the sum of proper divisors of n (numbers less than n
// which divide evenly into n).
// If d(a) = b and d(b) = a, where a ≠ b, then a and b are an amicable pair and
// each of a and b are called amicable numbers.
//
// For example, the proper divisors of 220 are 1, 2, 4, 5, 10, 11, 20, 22, 44,
// 55 and 110; therefore d(220) = 284.
// The proper divisors of 284 are 1, 2, 4, 71 and 142; so d(284) = 220.
//
// Evaluate the sum of all the amicable numbers under 10000.

const divisors = require('../divisors')

module.exports = function () {
  let result = 0
  const total = (n) => divisors(n).reduce((t, x) => t + x, 0)
  const alreadyCounted = {}
  // Probably some trick to limiting the amount of numbers I need to check.
  for (let i = 0; i < 10000; i++) {
    const b = total(i)
    const a = total(b)
    if (a === i && a !== b && !alreadyCounted[a] && !alreadyCounted[b]) {
      alreadyCounted[a] = true
      alreadyCounted[b] = true
      result += a + b
    }
  }
  return result
}
