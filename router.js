
var url = require('url');
var controllers = require('./controllers.js');
var utils = require('./utils');
var conf = require('./config');
var users = require('./users');


var routes = {
   '/' : controllers.home, 
   '/signup' : controllers.signup,
   '/signup/submit' : controllers.signup,
   '/users' : controllers.allUsers,
   '/login' : controllers.login,
   '/login/submit' : controllers.login,
   '/logout' : controllers.logout,
   '/posts' : controllers.allPosts,
   '/posts/submit' : controllers.submitPost,
   '/404' : controllers.notFound,
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
      else if (file && conf.images[file]) {
         controllers.image(request, response, file);
      }
      else {
         utils.print('#r[[R]];-Failed to route ' + path);
         response.redirect('/404');
      }
   }
}


exports.router = route;


