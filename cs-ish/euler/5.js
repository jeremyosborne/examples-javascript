//
// 2520 is the smallest number that can be divided by each of the numbers from
// 1 to 10 without any remainder.
//
// What is the smallest positive number that is evenly divisible by all of the
// numbers from 1 to 20?
//

// limit is upper bounds of range, assumed test case limit = 20
module.exports = function (limit) {
  var candidate = limit
  var answer

  do {
    // Our candidates will always be divisible by the limit.
    for (var i = limit - 1; i > 0; i--) {
      if (candidate % i !== 0) {
        break
      }
      if (i === 1) {
        answer = candidate
      }
    }
    if (!answer) {
      candidate += limit
    }
  } while (!answer)

  return answer
}

console.log('and the answer is', module.exports(20))
