module.exports = function (n) {
  if (n <= 1) {
    return false
  } else if (n <= 3) {
    return true
  } else if (n % 2 === 0) {
    return false
  } else {
    var limit = Math.floor(Math.sqrt(n)) + 1
    for (var i = 3; i < limit; i += 2) {
      if (n % i === 0) {
        return false
      }
    }
    return true
  }
}
