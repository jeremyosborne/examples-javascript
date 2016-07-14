//
// 2520 is the smallest number that can be divided by each of the numbers from
// 1 to 10 without any remainder.
//
// What is the smallest positive number that is evenly divisible by all of the
// numbers from 1 to 20?
//
// Improved answer after looking at: https://github.com/nayuki/Project-Euler-solutions/blob/master/python/p005.py

var gcd = function (a, b) {
  if (a < 0) {
    a = -a
  }
  if (b < 0) {
    b = -b
  }
  if (b > a) {
    var temp = a
    a = b
    b = temp
  }
  while (true) {
    if (b === 0) {
      return a
    }
    a %= b
    if (a === 0) {
      return b
    }
    b %= a
  }
}

// limit is upper bounds of range, assumed test case limit = 20
module.exports = function (limit) {
  var answer = 1
  for (var i = 1; i <= limit; i++) {
    answer *= i / gcd(i, answer)
  }
  return answer
}

// limit is upper bounds of range, assumed test case limit = 20
// module.exports = function (limit) {
//   var candidate = limit
//   var answer
//
//   do {
//     // Our candidates will always be divisible by the limit.
//     for (var i = limit - 1; i > 0; i--) {
//       if (candidate % i !== 0) {
//         break
//       }
//       if (i === 1) {
//         answer = candidate
//       }
//     }
//     if (!answer) {
//       candidate += limit
//     }
//   } while (!answer)
//
//   return answer
// }
