var views = require('./views');
var utils = require('./utils');
var users = require('./users');
var sessions = require('./sessions');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var fs = require('fs');
var formidable = require('formidable');


function home(req, res) {
   dprint('#y[[C]]; home controller');
   var sessionKey = req.cookies.sessionkey || null;
   var username = req.cookies.username || null;
   var viewContext = { };

   sessions.validateSession(username, sessionKey, 
      function (isValidated) {
         if (isValidated) {
            print('#y[[C]]; home #g[recognizes active session!];');
            users.getUser(username, function(user) {
               var content = {'body': 'LOGGED IN!!!! Welcome, ' + user.firstName};
               viewContext.user = user;
               viewContext.loggedin = true;
               views.viewHome(res, viewContext); 
            });
         }
         else {
            print('#y[[C]]; home #r[no active session found];');
            var content = {'body': 'Not logged in.'};
            views.viewHome(res, viewContext); 
         }
      }
   );
};


function allUsers(req, res) {
   dprint('#y[[C]];--allUsers controller');
   var viewContext = { };
   users.getAllUsers(function(allUsers) {
      viewContext.allUsers = allUsers;
      users.validateLogin(req, function(isValid) {
         if (isValid) {
            users.getUser(req.cookies.username, function(user) {
               viewContext.user = user;
               viewContext.loggedin = true;
               views.viewAllUsers(res, viewContext);
            });
         }
         else {
            viewContext.loggedin = false;
            views.viewAllUsers(res, viewContext);
         }
      });
   });
};


function deleteUser(req, res, username) {
   console.log(username);
   users.deleteUser(username, () => res.redirect('/users/all'));
}


function notFound(req, res, path) {
   dprint('#y[[C]];--Not found controller');
   var viewContext = { 'path' : path };
   users.getUser(req.cookies.username, function(user) {
      viewContext.user = user;
      viewContext.loggedin = true;
      views.viewPageNotFound(res, viewContext);
   });
};


function static(req, res, args) {
   var type = args[0];
   var fname = args[1];
   dprint('#y[[C]];--Loading static #b[' + type + ']; file: #b[' + fname + '];');
   var file = fs.readFileSync('static/' + type + '/' + fname);
   res.writeHead(200, {'Content-Type' : 'text/' + type});
   res.end(file);
};


function image(req, res, name) {
   dprint('#y[[C]];--Loading image: #b[' + name + '];');
   var file = fs.readFileSync('static/images/' + name);
   //res.writeHead(200, {'Content-Type' : 'bb' + type});
   res.end(file);
};


function signup(req, res) {
   dprint('#y[[C]];--signup controller');
   if (req.method === 'GET')
      views.viewSignup(res);
   else if (req.method === 'POST') {
      var form = new formidable.IncomingForm();

      eventEmitter.on('dbAddUserFinished', function() {
         allUsers(req, res);
      });

      form.uploadDir = 'static/images/';
      form.parse(req, function(err, fields, files) {
         if (err) throw err;
         console.log('profilePicture.name: ' + files.profilePicture.name);
         console.log('profilePicture.path: ' + files.profilePicture.path);
         console.log('form.uploadDir: ' + form.uploadDir);
         fs.renameSync(files.profilePicture.path,  
            'static/images/' + files.profilePicture.name);
         fields.profilePicture = files.profilePicture.name;
         users.addUser(fields, eventEmitter);
      });
   };
};


function login(req, res) {
   if (req.method === 'GET')
      views.viewLogin(res);
   else if (req.method === 'POST') {
      var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields) {
         dprint('#g[[C]];--Authenticating...');
         users.login(fields.username, fields.password, function(err, resault) {
            if (err) throw err;

            if (resault) {
               dprint('#g[[C]];--LOGIN SUCCESS!!');
               sessions.createSession(res, fields.username, 
                  () => res.redirect('/'));
            }
            else { 
               dprint('#g[[C]]; #r[Login Unsuccessful :(];');
               res.redirect('/404');
            }
         }); 
      });
   };
};


function logout(req, res) {
   var user = req.cookies.username || null;
   users.logout(res, user, () => res.redirect('/users/all'));
};


function allPosts(req, res) {
   var sessionKey = req.cookies.sessionkey || null;
   var username = req.cookies.username || null;
   var viewContext = { };

   sessions.validateSession(username, sessionKey, 
      function (isValidated) {
         if (isValidated) {
            users.getUser(username, function(user) {
               viewContext.user = user;
               viewContext.loggedin = true;
               users.getAllPosts(function(posts) {
                  viewContext.posts = posts;
                  views.viewAllPosts(res, viewContext); 
               });
            });
         }
         else {
            views.viewAllPosts(res, viewContext); 
         }
      }
   );
};


function submitPost(req, res) {
   if (req.method !== 'POST') throw new Error('Method is not POST.');
   var form = new formidable.IncomingForm();
   form.parse(req, function(err, fields) {
      if (err) throw err;
      var post = {
         'text': fields.postContent,
         'username': req.cookies.username,
         'date': new Date(),
      };
      users.submitPost(req, post, function() {
         console.log('redirectiong to /posts');

         res.redirect('/posts');
         //allPosts(req, res);
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
exports.deleteUser = deleteUser;
