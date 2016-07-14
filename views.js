var utils = require('./utils');
var fs = require('fs');
var mustache = require('mustache');

var getHome = function(c) {
   dprint('#y[[V]];  Running view.getHome()');
   var file = fs.readFileSync('static/views/index.html').toString();
   c.response.writeHead(200, { 'Content-Type' : 'text/html' });
   c.response.write(file);
   c.response.end();
};

var notFound = function(c) {
   dprint('Serving 404 page.');
   console.log('Serving 404 page.');
   c.response.writeHead(404, { 'Content-type' : 'text/plain' });
   c.response.write('404 error\n');
   c.response.end(c.path + ' not found.');
};

var getSignUp = function(c) {
   var page = fs.readFileSync('static/views/signup.html').toString();
   c.response.writeHead(200, {'Content-Type' : 'text/html'});
   c.response.write(page);
   c.response.end();
};

var postSignUp = function(c) {
   var page = fs.readFileSync('static/views/signup.html').toString();
   c.response.writeHead(200, {'Content-Type' : 'text/html'});
   c.response.write(page);
   c.response.end();
};

var viewAllUsers = function(c, allUsers) {
   var page = fs.readFileSync('static/views/allusers.html').toString();
   c.response.writeHead(200, {'Content-Type' : 'text/html'});

   console.log(allUsers);
   var view = { users: allUsers };

   var output = mustache.render(page, view);

   c.response.write(output);
   c.response.end();

   
}


exports.getHome = getHome;
exports.notFound = notFound;
exports.getSignUp = getSignUp;
exports.postSignUp = postSignUp;
exports.viewAllUsers = viewAllUsers;


