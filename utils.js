
Array.prototype.contains = function(val) {
   for (var x in this) {
      if (this[x] === val)
         return true;
   }
   return false;
}


function redirectURL(url) {
   this.writeHead(302, {'Location': url});
   this.end();
}

function atLeast(size) {
   var newString = this.toString();
   while (newString.length < size)
      newString += ' ';
   return newString;
}


//String.tabs(<size>);
function tabs(size) {
   var idx = 0, x;
   var newString = '';
   for (; idx < this.length; x = ++idx) 
      if (this[idx] === '\t')
         do newString += ' ';
         while (x++ % size);
      else
         newString += this[idx];
   return newString;
}

function cprint(str) {
   str = str.replace(/r\[/g, '\x1B[31m');
   str = str.replace(/g\[/g, '\x1B[32m');
   str = str.replace(/y\[/g, '\x1B[33m');
   str = str.replace(/b\[/g, '\x1B[34m');
   str = str.replace(/c\[/g, '\x1B[36m');
   str = str.replace(/m\[/g, '\x1B[35m');
   str = str.replace(/\]/g, '\x1B[0m');
   console.log(str);
}

function print(str) {
   str = str.replace(/\#r\[/g, '\x1B[31m');
   str = str.replace(/\#g\[/g, '\x1B[32m');
   str = str.replace(/\#y\[/g, '\x1B[33m');
   str = str.replace(/\#b\[/g, '\x1B[34m');
   str = str.replace(/\#c\[/g, '\x1B[36m');
   str = str.replace(/\#m\[/g, '\x1B[35m');
   str = str.replace(/\]\;/g, '\x1B[0m');
   console.log(str);
}

function dprint(str) {
   if (dprint.debug) {
      str = str.replace(/\#r\[/g, '\x1B[31m');
      str = str.replace(/\#g\[/g, '\x1B[32m');
      str = str.replace(/\#y\[/g, '\x1B[33m');
      str = str.replace(/\#b\[/g, '\x1B[34m');
      str = str.replace(/\#c\[/g, '\x1B[36m');
      str = str.replace(/\#m\[/g, '\x1B[35m');
      str = str.replace(/\]\;/g, '\x1B[0m');
      console.log(str);
   }
}
dprint.debug = false;


//var colors = {
//   'black' : function(text) { return '\x1B[30m' + text + '\x1B[0m' }, 
//   'red' : function(text) { return '\x1B[31m' + text + '\x1B[0m' }, 
//   'green' : function(text) { return '\x1B[32m' + text + '\x1B[0m' }, 
//   'yellow' : function(text) { return '\x1B[33m' + text + '\x1B[0m' }, 
//   'blue' : function(text) { return '\x1B[34m' + text + '\x1B[0m' }, 
//   'magenta' : function(text) { return '\x1B[35m' + text + '\x1B[0m' }, 
//   'cyan' : function(text) { return '\x1B[36m' + text + '\x1B[0m' }, 
//   'lightGray' : function(text) { return '\x1B[37m' + text + '\x1B[0m' }, 
//   'darkGray' : function(text) { return '\x1B[90m' + text + '\x1B[0m' }, 
//   'lightRed' : function(text) { return '\x1B[91m' + text + '\x1B[0m' }, 
//   'lightGreen' : function(text) { return '\x1B[92m' + text + '\x1B[0m' }, 
//   'lightYellow' : function(text) { return '\x1B[93m' + text + '\x1B[0m' }, 
//   'lightBlue' : function(text) { return '\x1B[94m' + text + '\x1B[0m' }, 
//   'lightMagenta' : function(text) { return '\x1B[95m' + text + '\x1B[0m' }, 
//   'lightCyan' : function(text) { return '\x1B[96m' + text + '\x1B[0m' }, 
//   'white' : function(text) { return '\x1B[97m' + text + '\x1B[0m' }, 
//}
//
//exports.colors = colors;

exports.print = print;
exports.dprint = dprint;
exports.redirectURL = redirectURL;
exports.cprint = cprint;
exports.tabs = tabs;
exports.atLeast = atLeast;


