
var url = require('url');
var controllers = require('./controllers.js');
var utils = require('./utils');


var route = function(c) {
   var path = url.parse(c.request.url).pathname;
   if (typeof c.routes[path] === 'function') {
      dprint('#y[[R]];  Routing ' + path);
      c.routes[path](c);
   }
   else {
      var file = path.toString().match(/[^\/]+$/);
      if (file && c.staticFiles[file]) {
         var ext = file.toString().match(/[^\.]+$/);
         controllers.static(c, ext, file);
      }
      else {
         utils.print('#y[[R]];  Failed to route ' + path);
         controllers.notFound(c);
      }
   }
}


exports.router = route;


