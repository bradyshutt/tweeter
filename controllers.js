var views = require('./views');
var utils = require('./utils');
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
   var viewContext = { };

   sessions.validateSession(username, sessionKey, 
      function (isValidated) {
         if (isValidated) {
            print('#y[[C]]; home #g[recognizes active session!];');
            users.getUser(username, function(user) {
               var content = {'body': 'LOGGED IN!!!! Welcome, ' + user.firstName};
               viewContext.user = user;
               viewContext.loggedin = true;
               views.viewHome(response, viewContext); 
            });
         }
         else {
            print('#y[[C]]; home #r[no active session found];');
            var content = {'body': 'Not logged in.'};
            views.viewHome(response, viewContext); 
         }
      }
   );
};


var allUsers = function(request, response) { 
   dprint('#y[[C]];--allUsers controller');
   var viewContext = { };
   users.getAllUsers(function(allUsers) {
      viewContext.allUsers = allUsers;
      users.validateLogin(request, function(isValid) {
         if (isValid) {
            users.getUser(request.cookies.username, function(user) {
               viewContext.user = user;
               viewContext.loggedin = true;
               views.viewAllUsers(response, viewContext);
            });
         }
         else {
            viewContext.loggedin = false;
            views.viewAllUsers(response, viewContext);
         }
      });
   });
};


var notFound = function(request, response, path) { 
   dprint('#y[[C]];--Not found controller');
   var viewContext = { 'path' : path };
   users.getUser(request.cookies.username, function(user) {
      viewContext.user = user;
      viewContext.loggedin = true;
      views.viewPageNotFound(response, viewContext);
   });
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
};


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
                  () => response.redirect('/'));
            }
            else { 
               dprint('#g[[C]]; #r[Login Unsuccessful :(];');
               response.redirect('/404');

               notFound(request, response);
            }
         }); 
      });
   };
};


var logout = function(request, response) {
   var user = request.cookies.username || null;
   users.logout(response, user, (() => {
      response.redirect('/');
      //allUsers(request, response);
   }));
};


var allPosts = function(request, response) {
   var sessionKey = request.cookies.sessionkey || null;
   var username = request.cookies.username || null;
   var viewContext = { };

   sessions.validateSession(username, sessionKey, 
      function (isValidated) {
         if (isValidated) {
            users.getUser(username, function(user) {
               viewContext.user = user;
               viewContext.loggedin = true;
               users.getAllPosts(function(posts) {
                  viewContext.posts = posts;
                  views.viewAllPosts(response, viewContext); 
               });
            });
         }
         else {
            views.viewAllPosts(response, viewContext); 
         }
      }
   );
};


var submitPost = function(request, response) {
   if (request.method !== 'POST') throw new Error('Method is not POST.');
   var form = new formidable.IncomingForm();
   form.parse(request, function(err, fields) {
      if (err) throw err;
      var post = {
         'text': fields.postContent,
         'username': request.cookies.username,
         'date': new Date(),
      };
      users.submitPost(request, post, function() {
         console.log('redirectiong to /posts');

         response.redirect('/posts');
         //allPosts(request, response);
      });
   });
};


exports.home = home;
exports.allUsers = allUsers;
exports.notFound = notFound;
exports.static = static;
exports.image = image;
exports.signup = signup;
exports.login = login;
exports.logout = logout;
exports.allPosts = allPosts;
exports.submitPost = submitPost;
