var views = require('./views');var utils = require('./utils');
var users = require('./users');
var sessions = require('./sessions');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var fs = require('fs');
var formidable = require('formidable');


var home = function(request, response) { 
   dprint('#y[[C]]; home controller');
   var sessionKey = request.cookies.sessionkey || null;
   var username = request.cookies.username || null;

   sessions.validateSession(username, sessionKey, 
      function (isValidated) {
         if (isValidated) {
            print('#y[[C]]; home #g[recognizes active session!];');
            users.getUser(username, function(user) {
               content = {'body': 'LOGGED IN!!!! Welcome, ' + user.firstName};
               views.viewHome(response, content); 
            });
         }
         else {
            print('#y[[C]]; home #r[no active session found];');
            content = {'body': 'Not logged in.'};
            views.viewHome(response, content); 
         }
      });
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


var image = function(request, response, name) {
   dprint('#y[[C]];--Loading image: #b[' + name + '];');
   var file = fs.readFileSync('static/images/' + name);
   //response.writeHead(200, {'Content-Type' : 'bb' + type});
   response.end(file);
   
}


var signup = function(request, response) {
   dprint('#y[[C]];--signup controller');
   if (request.method === 'GET')
      views.viewSignup(response);
   else if (request.method === 'POST') {
      var form = new formidable.IncomingForm();

      eventEmitter.on('dbAddUserFinished', function() {
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
         dprint('#g[[C]];--Authenticating...');
         users.login(fields.username, fields.password, function(res) {
            if (res) {
               dprint('#g[[C]];--LOGIN SUCCESS!!');
               sessions.createSession(response, fields.username, 
                  function(username, key) {
                     request.cookies.sessionkey = key;
                     request.cookies.username = username;
                     home(request, response);
               });
            }
            else { 
               dprint('#g[[C]]; #r[Login Unsuccessful :(];');
               notFound(request, response);
            }
         }) 
      });
   }
}


var logout = function(request, response) {

   sessions.removeSession(request.cookies.username);


   
}


exports.home = home;
exports.allUsers = allUsers;
exports.notFound = notFound;
exports.static = static;
exports.image = image;
exports.signup = signup;
exports.login = login;
