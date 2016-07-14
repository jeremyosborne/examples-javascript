//
// A palindromic number reads the same both ways. The largest palindrome made
// from the product of two 2-digit numbers is 9009 = 91 × 99.
//
// Find the largest palindrome made from the product of two 3-digit numbers.
//

var isPalindrome = function (n) {
  n = n.toString()
  return n === Array.prototype.slice.call(n).reverse().join('')
}

// Pass in the number of digits the two number should have.
module.exports = function (digits) {
  var answer = 0
  var x = Math.pow(10, digits) - 1
  var lowerLimit = Math.pow(10, digits - 1)
  for (var i = x; i >= lowerLimit; i--) {
    for (var j = i; j >= lowerLimit; j--) {
      var candidate = i * j
      if (isPalindrome(candidate) && candidate > answer) {
        answer = candidate
      }
    }
  }
  return answer
}
