var views = require('./views');
var utils = require('./utils');
var users = require('./users');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var fs = require('fs');
var formidable = require('formidable');


var home = function(request, response) { 
   dprint('#y[[C]];--home controller');
   views.viewHome(response); 
};


var allUsers = function(request, response) { 
   dprint('#y[[C]];--allUsers controller');

   users.getAllUsers(function(users) {
      views.viewAllUsers(response, users);
   });
};


var notFound = function(request, response) { 
   dprint('#y[[C]];--Not found controller');
   views.viewPageNotFound(response); 
};


var static = function(request, response, type, name) {
   dprint('#y[[C]];--Loading static #b[' + type + ']; file: #b[' + name + '];');
   var file = fs.readFileSync('static/' + type + '/' + name);
   response.writeHead(200, {'Content-Type' : 'text/' + type});
   response.end(file);
};


var signup = function(request, response) {
   dprint('#y[[C]];--signup controller');
   if (request.method === 'GET')
      views.viewSignup(response);
   else if (request.method === 'POST') {
      var form = new formidable.IncomingForm();

      eventEmitter.on('dbAddUserFinished', function() {
         console.log('calling allUsers now?');
         allUsers(request, response);
      });

      form.parse(request, function(err, fields) {
         users.addUser(fields, eventEmitter);
      });
   };
};


var login = function(request, response) {
   if (request.method === 'GET') {
      views.viewLogin(response);
   }
   else if (request.method === 'POST') {
      var form = new formidable.IncomingForm();

      form.parse(request, function(err, fields) {
         users.authenticate(fields.username, fields.password, function(res) {
            if (res) {
               console.log('password correct'); 
               dprint('#g[[C]];--LOGIN SUCCESS!!');
               allUsers(request, response);
            }
            else { 
               console.log('password incorrect'); 
               notFound(request, response);
            }
         }) 
      });
   }
}


exports.home = home;
exports.allUsers = allUsers;
exports.notFound = notFound;
exports.static = static;
exports.signup = signup;
exports.login = login;
