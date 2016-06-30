/*
Code will receive an array of arrays like:

    [
        [75],
        [95, 64],
        [17, 47, 82],
        [18, 35, 87, 10],
        [20, 04, 82, 47, 65],
        [19, 01, 23, 75, 03, 34],
        [88, 02, 77, 73, 07, 63, 67],
        [99, 65, 04, 28, 06, 16, 70, 92],
        [41, 41, 26, 56, 83, 40, 80, 70, 33],
        [41, 48, 72, 33, 47, 32, 37, 16, 94, 29],
        [53, 71, 44, 65, 25, 43, 91, 52, 97, 51, 14],
        [70, 11, 33, 28, 77, 73, 17, 78, 39, 68, 17, 57],
        [91, 71, 52, 38, 17, 14, 91, 43, 58, 50, 27, 29, 48],
        [63, 66, 04, 68, 89, 53, 67, 30, 73, 16, 69, 87, 40, 31],
        [04, 62, 98, 27, 23, 09, 70, 98, 73, 93, 38, 53, 60, 04, 23]
    ]

It's left-justified in code, but imagine the top number, 75, center-justified at
the top of a triangle.  Each node can either go down left or right.
(like a simple tree.)  The answer for the above triangle is 1074.
 */

var doom = function (pyramid) {
  for (var i = pyramid.length - 2; i >= 0; i--) {
    var cur = pyramid[i]
    var next = pyramid[i + 1]
    for (var j = 0; j < cur.length; j++) {
      cur[j] = Math.max(cur[j] + next[j], cur[j] + next[j + 1])
    }
  }
  return pyramid[0][0]
}

// This causes the heat death of the universe. Leaving this here as my
// badge of shame. Being nicer to myself, leaving this here to remind me
// that the arrogance of simple testing needs to be expanded sometimes (I didn't
// originally test for large scale pyramids).
//
// var doom = function(pyramid){
//     var highestValue = 0
//     var prev = [
//         {
//             val: pyramid[0][0],
//             pathingIndex: 0,
//         }
//     ]
//     for (var i = 1; i < pyramid.length; i++) {
//         var row = pyramid[i]
//         var prevLength = prev.length
//         var next = []
//         for (var j = 0; j < prevLength; j++) {
//             var item = prev[j]
//             var val = item.val + row[item.pathingIndex]
//             if (val >= highestValue) {
//                 highestValue = val
//                 next.push({val: val, pathingIndex: item.pathingIndex})
//             }
//
//             val = item.val + row[item.pathingIndex + 1]
//             if (val >= highestValue) {
//                 highestValue = val
//                 next.push({val: val, pathingIndex: item.pathingIndex + 1})
//             }
//         }
//         prev = next
//     }
//     return highestValue
// }

// console.log(doom([
//         [75],
//         [95, 64],
//         [17, 47, 82],
//         [18, 35, 87, 10],
//         [20, 04, 82, 47, 65],
//         [19, 01, 23, 75, 03, 34],
//         [88, 02, 77, 73, 07, 63, 67],
//         [99, 65, 04, 28, 06, 16, 70, 92],
//         [41, 41, 26, 56, 83, 40, 80, 70, 33],
//         [41, 48, 72, 33, 47, 32, 37, 16, 94, 29],
//         [53, 71, 44, 65, 25, 43, 91, 52, 97, 51, 14],
//         [70, 11, 33, 28, 77, 73, 17, 78, 39, 68, 17, 57],
//         [91, 71, 52, 38, 17, 14, 91, 43, 58, 50, 27, 29, 48],
//         [63, 66, 04, 68, 89, 53, 67, 30, 73, 16, 69, 87, 40, 31],
//         [04, 62, 98, 27, 23, 09, 70, 98, 73, 93, 38, 53, 60, 04, 23]
//     ]
// ))

module.exports = doom
