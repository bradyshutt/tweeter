/* global cpr */

Array.prototype.contains = function (val) { //eslint-disable-line
  for (var x in this) {
    if (this[x] === val) return true
  }
  return false
}

function redirectURL (url) {
  cpr('lG[<---- Redirecting to %s]', url)
  this.writeHead(302, {'Location': url})
  this.end()
}

function atLeast (size) {
  var newString = this.toString()
  while (newString.length < size) newString += ' '
  return newString
}

// String.tabs(<size>)
function tabs (size) {
  var idx = 0
  var x
  var newString = ''

  for (; idx < this.length; x = ++idx) {
    if (this[idx] === '\t') {
      do newString += ' '
      while (x++ % size)
    } else newString += this[idx]
  }
  return newString
}

exports.redirectURL = redirectURL
exports.tabs = tabs
exports.atLeast = atLeast

