var utils = require('./utils');
var fs = require('fs');
var mustache = require('mustache');

var viewHome = function(response) {
   dprint('#y[[V]];  Running view.getHome()');
   var base = fs.readFileSync('static/views/base_template.html').toString();
   var nav = fs.readFileSync('static/views/navbar_template.html').toString();
   var output = mustache.render(base, null, { 
      navbar: nav,
   });
   response.writeHead(200, { 'Content-Type' : 'text/html' });
   response.write(output);
   response.end();
};

var viewPageNotFound = function(response, path) {
   dprint('Serving 404 page.');
   var base = fs.readFileSync('static/views/base_template.html').toString();
   var nav = fs.readFileSync('static/views/navbar_template.html').toString();
   var content = '404 error\n' + path + ' not found.';
   var output = mustache.render(base, null, { 
      navbar: nav,
      main_content: content 
   });
   response.writeHead(404, { 'Content-type' : 'text/plain' });
   response.end(output);
};

var viewSignUp = function(response) {
   var base = fs.readFileSync('static/views/base_template.html').toString();
   var nav = fs.readFileSync('static/views/navbar_template.html').toString();
   var content = fs.readFileSync('static/views/signup_template.html').toString();
   var output = mustache.render(base, null, { 
      navbar: nav,
      main_content: content, 
   });
   response.writeHead(200, {'Content-Type' : 'text/html'});
   response.end(output);
};

var viewAllUsers = function(response, allUsers) {
   console.log('view all usrs');
   var base = fs.readFileSync('static/views/base_template.html').toString();
   var view = { users: allUsers };
   var nav = fs.readFileSync('static/views/navbar_template.html').toString();
   var content = fs.readFileSync('static/views/allusers_template.html').toString();
   var output = mustache.render(base, view, { 
      navbar: nav,
      main_content: content,
   });
   response.writeHead(200, {'Content-Type' : 'text/html'});
   response.end(output);
}


exports.viewHome = viewHome;
exports.viewPageNotFound = viewPageNotFound;
exports.viewSignUp = viewSignUp;
exports.viewAllUsers = viewAllUsers;


