//
// Number Letter Counts
//
// If the numbers 1 to 5 are written out in words: one, two, three, four, five,
// then there are 3 + 3 + 5 + 4 + 4 = 19 letters used in total.
//
// If all the numbers from 1 to 1000 (one thousand) inclusive were written out
// in words, how many letters would be used?
//

var numbers = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'twelve',
  13: 'thirteen',
  14: 'fourteen',
  15: 'fifteen',
  16: 'sixteen',
  17: 'seventeen',
  18: 'eighteen',
  19: 'nineteen',
  20: 'twenty',
  30: 'thirty',
  40: 'forty',
  50: 'fifty',
  60: 'sixty',
  70: 'seventy',
  80: 'eighty',
  90: 'ninety'
}

var numberToLetters = function (num) {
  var words = ''
  if (num % 100 && num % 100 <= 99) {
    if (num % 100 <= 20) {
      // naive first
      words += numbers[num % 100]
    } else {
      words += numbers[Math.floor(num % 100 / 10) * 10]
      if (num % 10) {
        words += numbers[num % 100 % 10]
      }
    }
  }
  if (num >= 100 && num < 1000) {
    words += numbers[Math.floor(num / 100)]
    words += 'hundred'
    if (num % 100) {
      words += 'and'
    }
  } else if (num === 1000) {
    words += 'onethousand'
  }
  return words
}

var numberToLetterSize = function (num) {
  return numberToLetters(num).length
}

module.exports = function (size) {
  var count = 0
  for (var i = 1; i <= size; i++) {
    count += numberToLetterSize(i)
  }
  return count
}
