//
// Lattice paths
//
// Starting in the top left corner of a 2×2 grid, and only being able to move
// to the right and down, there are exactly 6 routes to the bottom right corner.
//
// How many such routes are there through a 20×20 grid?
//

// Copied from: http://www.w3resource.com/javascript-exercises/javascript-math-exercise-20.php
var binomial = function (n, k) {
  var coeff = 1
  for (var x = n - k + 1; x <= n; x++) {
    coeff *= x
  }
  for (x = 1; x <= k; x++) {
    coeff /= x
  }
  return Math.floor(coeff)
}

module.exports = function (size) {
  // choice
  return binomial(2 * size, size)
}
