
var url = require('url');
var controllers = require('./controllers.js');
var utils = require('./utils');
var conf = require('./config');
var fs = require('fs');
var users = require('./users');


var staticFilesDir = '/static/';
var imgDir = 'static/images/';
var profilePicDir = 'static/images/profilepictures/';


var myRoutes = [ ];



// ROUTE TO HOME PAGE
addRoute('GET', [ /^$/, /^\/$/ ], controllers.home);

// REQUEST ALL USERS
addRoute('GET', [ /^\/users$/, /^\/users\/all$/ ], controllers.allUsers);

// USER SIGN UP 
addRoute('GET', /^\/users\/signup$/, controllers.signup);

// USER SIGN UP 
addRoute('POST', /^\/users\/signup$/, controllers.signup);

// USER LOG IN
addRoute('GET', [ /^\/login$/, /^\/users\/login$/ ], controllers.login);


// USER LOG IN SUBMIT
addRoute('POST', /^\/users\/login$/, controllers.login);

// USER LOG OUT
addRoute('GET', [ /^\/logout/, /^\/users\/logout/ ], controllers.logout);

// REQUEST A USERS PROFILE
addRoute('GET', /^\/users\/u\/([^\/]+)$/, function(req, res, args) {
   console.log('username: ' + args[0]);
});

// DELETE A USER
addRoute('GET', /^\/users\/delete\/([^\/]+)$/, (req, res, un) => {
   controllers.deleteUser(req, res, un);  
})

// REQUEST ALL POSTS
addRoute('GET', [ /^\/posts/, /^\/posts\/all$/ ], controllers.allPosts);

// REQUEST STATIC FILE
addRoute('GET', /^\/static\/([^\/]+)\/([^\/]+)$/, controllers.static);

// REQUEST IMAGE FILE
addRoute('GET', /^\/images\/([^\/]+)$/, controllers.image);




function addRoute(method, regexURL, func) {
   if (regexURL && regexURL.constructor === Array)
      regexURL.forEach(function(val) {
         myRoutes.push({
            method: method,
            pattern: val,
            cb: func,
         });
      });
   var newRoute = {
      method: method,
      pattern: regexURL,
      cb: func
   };
   myRoutes.push(newRoute);
};


function searchRoutes(req, res) {
   var matches, matchFound = false;
   myRoutes.forEach(function(route) {
      if (route.method === req.method 
       && (matches = req.url.match(route.pattern))) {
         //console.log('matches: ');
         //console.log(matches);
         matchFound = true;
         var captures = [ ];
         for (var idx = 1; matches[idx]; ++idx)
            captures.push(matches[idx]);
         route.cb(req, res, captures);
         return;
      }
   });
   if (!matchFound)
      cpr('r[No results found for URL: ' + req.url + ']');
};



exports.route = searchRoutes;


