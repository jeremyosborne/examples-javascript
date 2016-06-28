//
// Given a 2d array, write a function that returns the length of the largest
// square in the array.
//

// Example data, largest square length is three.
var data = [
  [0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0]
]

// Returns an integer length of the largest square.
// Assumption: worthwhile data values are positive integers, non-candidate data
// is falsey (zero in this case).
//
// WARNING: Mutates input data array.
var largestLengthSquare = function (columns) {
  // As we iterate across y (which is human-visual horizontal in the 2d array
  // above), we count consecutive numbers.
  var largestSideLength = 0
  for (var x = 0; x < columns.length; x++) {
    var streakCount = 0
    var streakMaxValue = 0
    // Individual column.
    var c = columns[x]
    for (var y = 0; y < c.length; y++) {
      // Figure out largest length side from data in current row.
      streakCount = c[y] ? streakCount + 1 : 0
      if (!streakCount) {
        // reset if our streak is broken
        streakMaxValue = 0
      } else {
        streakMaxValue = Math.max(c[y], streakMaxValue)
        // A streak of numbers can never create a longer side than the minimum
        // streak.
        var candidateLength = Math.min(Math.min(c[y], streakCount), streakMaxValue)
        largestSideLength = candidateLength > largestSideLength ? candidateLength : largestSideLength
      }

      // Prepare next column of data.
      //
      // Going outside of bounds in JS will not throw, just return falsey.
      // If two truthy values abut, we have a potential candidate for a side.
      if (c[y] && columns[x + 1] && columns[x + 1][y]) {
        columns[x + 1][y] += columns[x][y]
      }
    }
  }
  // console.log('Final array:\n', columns)
  return largestSideLength
}

console.log(largestLengthSquare(data))
