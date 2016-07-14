var utils = require('./utils');
var fs = require('fs');
var mustache = require('mustache');


var viewHome = function(response) {
   dprint('#y[[V]];---Running view.getHome()');
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
   dprint('#r[[V]];---Serving 404 page.];');
   var base = fs.readFileSync('static/views/base_template.html').toString();
   var nav = fs.readFileSync('static/views/navbar_template.html').toString();
   var content = '404 error ' + path + ' not found.';
   var output = mustache.render(base, null, { 
      navbar: nav,
      main_content: content 
   });
   response.writeHead(404, { 'Content-type' : 'text/html' });
   response.end(output);
};


var viewSignup = function(response) {
   dprint('#y[[V]];---Serving signup page.');
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
   dprint('#y[[V]];---Serving allUsers page.');
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


var viewLogin = function(response) {
   dprint('#y[[V]];---Serving login page.');
//   var base = fs.readFileSync('static/views/base_template.html').toString();
//   var view = {};
//   var nav = fs.readFileSync('static/views/navbar_template.html').toString();
//   var content = fs.readFileSync('static/views/login_template.html');
//   var output = mustache.render(base, view, {
//      navbar: nav, 
//      main_content: content, 
//   });
//   response.writeHead(200, {'Content-Type' : 'text/html'})
//   response.end(output);

   var base = fs.readFileSync('static/views/base_template.html').toString();
   var nav = fs.readFileSync('static/views/navbar_template.html').toString();
   var content = fs.readFileSync('static/views/login_template.html').toString();
   var output = mustache.render(base, null, { 
      navbar: nav,
      main_content: content, 
   });
   response.writeHead(200, {'Content-Type' : 'text/html'});
   response.end(output);
}


exports.viewHome = viewHome;
exports.viewPageNotFound = viewPageNotFound;
exports.viewSignup = viewSignup;
exports.viewAllUsers = viewAllUsers;
exports.viewLogin = viewLogin;


