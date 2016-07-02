// Each new term in the Fibonacci sequence is generated by adding the previous two terms.
// By starting with 1 and 2, the first 10 terms will be:
//
// 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...
//
// By considering the terms in the Fibonacci sequence whose values do not exceed four million,
// find the sum of the even-valued terms.

module.exports = function (limit) {
  var a = 1
  var b = 2
  if (limit < 2) {
    return 0
  }
  var sum = 2
  while (b <= limit) {
    var next = a + b
    a = b
    b = next
    sum += next % 2 ? 0 : next
  }
  // console.log('sum is:', sum)
  return sum
}