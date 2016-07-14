
var url = require('url');
var controllers = require('./controllers.js');
var utils = require('./utils');
var conf = require('./config');


var routes = {
   '/' : controllers.home, 
   '/signup' : controllers.signup,
   '/signup/submit' : controllers.signup,
   '/users' : controllers.allUsers,
   '/login' : controllers.login,
   '/login/submit' : controllers.login,
};


var route = function(request, response) {
   var path = url.parse(request.url).pathname;
   if (typeof routes[path] === 'function') {
      dprint('#y[[R]];-Routing ' + path);
      routes[path](request, response);
   }
   else {
      var file = path.toString().match(/[^\/]+$/);
      if (file && conf.staticFiles[file]) {
         var ext = file.toString().match(/[^\.]+$/);
         controllers.static(request, response, ext, file);
      }
      else {
         utils.print('#r[[R]];-Failed to route ' + path);
         controllers.notFound(request, response, path);
      }
   }
}


exports.router = route;


