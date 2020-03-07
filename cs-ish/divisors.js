// For a given num: number, return Array<number> that are proper divisors
// into the number.
// Result array is not sorted.
module.exports = function (num) {
  // 1 is always a divisor.
  const numbers = [1]
  // Iterate up through maximum number of prime factors of a number.
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      const quotient = num / i
      // Sometimes `quotient` is the same as divisor `i`...
      if (i !== quotient) {
        // ... but if not add it to the list of numbers divided.
        numbers.push(quotient)
      }
      numbers.push(i)
    }
  }
  return numbers
}
