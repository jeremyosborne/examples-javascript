//
// Special Pythagorean triplet
//
// A Pythagorean triplet is a set of three natural numbers, a < b < c, for which,
//
// a^2 + b^2 = c^2
//
// For example, 3^2 + 4^2 = 9 + 16 = 25 = 5^2.
//
// There exists exactly one Pythagorean triplet for which a + b + c = 1000.
// Find the product abc.
//

// val is the value of a + b + c.
module.exports = function (val) {
  for (var a = 1; a <= val; a++) {
    for (var b = a + 1; b <= val; b++) {
      var c = val - a - b
      if (Math.pow(a, 2) + Math.pow(b, 2) === Math.pow(c, 2)) {
        return a * b * c
      }
    }
  }
}
