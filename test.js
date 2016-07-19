
var utils = require('./utils');



var myRoutes = [ ];

var addRoute = function(method, regexURL, func) {
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


var searchRoutes = function(req, res) {
   var matches, matchFound = false;
   myRoutes.forEach(function(route) {
      if (route.method === req.method 
       && (matches = req.url.match(route.pattern))) {
         console.log('matches: ');
         console.log(matches);
         matchFound = true;
         var captures = [ ];
         for (var idx = 1; matches[idx]; ++idx)
            captures.push(matches[idx]);
         route.cb(req, res, captures);
         return;
      }
   });
   if (!matchFound)
      console.log('No results found for URL: ' + req.url);
};


var req, res;


addRoute('GET', [ /^$/ , /^\/$/], function(req, res) {
   console.log('home');
});

addRoute('GET', /^\/users$/, function(req, res) {
   console.log('here');
});

addRoute('GET', /^\/users\/all$/, function(req, res) {
   console.log('Routed to users/all');
});

addRoute('GET', /^\/users\/([^\/]+)$/, function(req, res, args) {
   console.log('username: ' + args[0]);
});

addRoute('GET', /^\/users\/([^\/]+)$/, function(req, res, args) {
   console.log('username: ' + args[0]);
});

addRoute('GET', /^\/images\/([^\/]+)$/, function(req, res, args) {
   console.log('image: ' + args[0]);
});




searchRoutes( { method: 'GET', url: '/' }, res);


