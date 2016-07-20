
Array.prototype.contains = function (val) { //eslint-disable-line
  for (var x in this) {
    if (this[x] === val) return true
  }
  return false
}

function redirectURL (url) {
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

// Print logs in magenta for server actions
// Print logs in yellow for routing
// Print logs in blue for serving pages
// Print logs in cyan for serving pages
// Print logs in green for confirmations
// Print logs in red for failures

function cprint (str) {
  str = str.replace(/lG\[/g, '\x1B[37m') // light gray
  str = str.replace(/dG\[/g, '\x1B[90m') // dark gray
  str = str.replace(/r\[/g, '\x1B[91m') // light red
  str = str.replace(/lg\[/g, '\x1B[92m') // light green
  str = str.replace(/ly\[/g, '\x1B[93m') // light yellow
  str = str.replace(/lb\[/g, '\x1B[94m') // light blue
  str = str.replace(/m\[/g, '\x1B[95m') // light magenta
  str = str.replace(/c\[/g, '\x1B[96m') // light cyan
  str = str.replace(/g\[/g, '\x1B[32m') // green
  str = str.replace(/y\[/g, '\x1B[33m') // yellow
  str = str.replace(/b\[/g, '\x1B[34m') // blue
  str = str.replace(/\]/g, '\x1B[0m')
  console.log(str)
}

// var colors = {
//   'black': function (text) { return '\x1B[30m' + text + '\x1B[0m' },
//   'red': function (text) { return '\x1B[31m' + text + '\x1B[0m' },
//   'green': function (text) { return '\x1B[32m' + text + '\x1B[0m' },
//   'yellow': function (text) { return '\x1B[33m' + text + '\x1B[0m' },
//   'blue': function (text) { return '\x1B[34m' + text + '\x1B[0m' },
//   'magenta': function (text) { return '\x1B[35m' + text + '\x1B[0m' },
//   'cyan': function (text) { return '\x1B[36m' + text + '\x1B[0m' },
//   'lightGray': function (text) { return '\x1B[37m' + text + '\x1B[0m' },
//   'darkGray': function (text) { return '\x1B[90m' + text + '\x1B[0m' },
//   'lightRed': function (text) { return '\x1B[91m' + text + '\x1B[0m' },
//   'lightGreen': function (text) { return '\x1B[92m' + text + '\x1B[0m' },
//   'lightYellow': function (text) { return '\x1B[93m' + text + '\x1B[0m' },
//   'lightBlue': function (text) { return '\x1B[94m' + text + '\x1B[0m' },
//   'lightMagenta': function (text) { return '\x1B[95m' + text + '\x1B[0m' },
//   'lightCyan': function (text) { return '\x1B[96m' + text + '\x1B[0m' },
//   'white': function (text) { return '\x1B[97m' + text + '\x1B[0m' },
// }
// exports.colors = colors

exports.redirectURL = redirectURL
exports.cprint = cprint
exports.tabs = tabs
exports.atLeast = atLeast

