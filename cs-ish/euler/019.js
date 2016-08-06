//
// Counting Sundays
//
// You are given the following information, but you may prefer to do some
// research for yourself.
//
// 1 Jan 1900 was a Monday.
// Thirty days has September,
// April, June and November.
// All the rest have thirty-one,
// Saving February alone,
// Which has twenty-eight, rain or shine.
// And on leap years, twenty-nine.
//
// A leap year occurs on any year evenly divisible by 4, but not on a century
// unless it is divisible by 400.
//
// How many Sundays fell on the first of the month during the twentieth century
// (1 Jan 1901 to 31 Dec 2000)?
//

module.exports = function () {
  var sundays = 0
  var day = 1000 * 60 * 60 * 24
  var d = new Date()
  d.setYear(1901)
  d.setMonth(0)
  d.setDate(1)
  d.setHours(12)
  while (d.getDate() <= 31 && d.getMonth() <= 11 && d.getFullYear() <= 2000) {
    d.setTime(d.getTime() + day)
    if (d.getDate() === 1 && d.getDay() === 6) {
      sundays += 1
    }
  }
  return sundays
}
