var views = require('./views');
var utils = require('./utils');
var fs = require('fs');
var formidable = require('formidable');

var home = function(c) { views.getHome(c); }

var users = function(c) { 
   data = c.models.getAllUsers();
   views.viewAllUsers(c); 
}

var notFound = function(c) { views.notFound(c); }

var static = function(c, type, name) {
   dprint('#y[[C]];  Loading static #b[' + type + ']; file: #b[' + name + '];');
   var file = fs.readFileSync('static/' + type + '/' + name);
   c.response.writeHead(200, {'Content-Type' : 'text/' + type});
   c.response.end(file);
}

var signUp = function(c) {
   if (c.request.method === 'GET') {
      dprint('#y[[C]];  Passing to view');
      views.getSignUp(c);
   }
   else if (c.request.method === 'POST') {
      var form = new formidable.IncomingForm();
      form.parse(c.request, function(err, fields) {
         if (err) { console.log('crap');}
         c.models.addUser(fields);
         getAllUsers(c);
      });
//      c.request.addListener('data', function(chunk) {
//         console.log('Data chunk receieved: ');
//         data += chunk;
//      });
//
//      c.request.addListener('end', function() {
//
//         console.log('Data finished: Receieved: ' + data);
//         c.models.addUser(data);
//         //views.postSignUp(c);
//      });
   }
}

var getAllUsers = function(c) {
   
   var allUsers = c.models.getAllUsers(function(users) {
      c.views.viewAllUsers(c, users);
   });
}

exports.home = home;
exports.notFound = notFound;
exports.static = static;
exports.signUp = signUp;
exports.getAllUsers = getAllUsers;

