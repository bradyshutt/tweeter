'use strict'

// Print logs in magenta for server actions
// Print logs in yellow for routing
// Print logs in blue for serving pages
// Print logs in cyan for serving pages
// Print logs in green for confirmations
// Print logs in red for failures

function colorPrint (str) {
  str = str.replace(/lG\[/g, '\x1B[38;5;238m') // light gray
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
  str = str.replace(/\]/g, '\x1b[0m')

  let args = Array.prototype.slice.call(arguments, 1)
  if (args[0] && args[0].constructor === Array) { args = args[0] }
  for (let arg = 0; arg < args.length; ++arg) {
    str = str.replace(/%s/, args[arg])
  }
  console.log(str)
}

colorPrint.err = function (str) {
  let args = Array.prototype.slice.call(arguments, 1) || null
  colorPrint('r[' + str + ']', args)
}

colorPrint.notice = function (str) {
  let args = Array.prototype.slice.call(arguments, 1) || null
  colorPrint('\x1B[48;5;255m' + '\x1B[38;5;000m' + str + '\x1b[0m', args)
}

colorPrint.route = function (str) {
  let args = Array.prototype.slice.call(arguments, 1) || null
  colorPrint('\x1B[48;5;255m' + '\x1B[38;5;000m' + str + '\x1b[0m', args)
}

colorPrint.inc = function (url) {
  colorPrint(c('salt', '---->') + ' Incoming request for ' + c('lighty', url))
}

colorPrint.out = function (out) {
  colorPrint(c('tree', '<----') + ' Responding with ' + c('lighty', out))
}

colorPrint.db = function (task) {
  colorPrint(c('magenta', task))
}

function c (color, txt) {
  let str = '\x1B[38;5;' + colors[color] + 'm' + txt + '\x1B[0m'
  return str
}

var colors = {
  lighty: 228,
  tree: 48,
  salt: 81,
  magenta: 97

}

// 48;5 = start bg 256 color
// 38;5 = start fg 256 color
// ;5 = start fg color

// [48;5;95;38;5;214mhello world\\033[0m"
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

exports.cpr = colorPrint
