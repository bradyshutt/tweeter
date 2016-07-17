var utils = require('./utils');
var fs = require('fs');
var mustache = require('mustache');


var viewHome = function(response, data) {
   dprint('#y[[V]];---Running view.getHome()');
   var base = fs.readFileSync('static/views/base_template.html').toString();
   var view = { };
   var nav = '';
   if (data.loggedin) {
      nav = fs.readFileSync('static/views/navbar_loggedin_template.html').toString();
      view.user = data.user;
   }
   else
      nav = fs.readFileSync('static/views/navbar_template.html').toString();
   var content = data.body || null;
   var output = mustache.render(base, view, { 
      navbar: nav,
      main_content: fs.readFileSync('static/views/index.html').toString(),
   });
   response.writeHead(200, { 'Content-Type' : 'text/html' });
   response.write(output);
   response.end();
};


var viewPageNotFound = function(response, data) {
   dprint('#r[[V]];---Serving 404 page.];');
   var base = fs.readFileSync('static/views/base_template.html').toString();
   var nav = fs.readFileSync('static/views/navbar_template.html').toString();
   var view = { };
   if (data && data.loggedin) {
      nav = fs.readFileSync('static/views/navbar_loggedin_template.html').toString();
      view.user = data.user;
   }
   else
      nav = fs.readFileSync('static/views/navbar_template.html').toString();
   var content = '404 error ' + data.path + ' not found.';
   var output = mustache.render(base, view, { 
      navbar: nav,
      main_content: content 
   });
   response.writeHead(404, { 'Content-type' : 'text/html' });
   response.end(output);
};


var viewSignup = function(response, data) {
   dprint('#y[[V]];---Serving signup page.');
   var base = fs.readFileSync('static/views/base_template.html').toString();
   var nav = '';
   var view = {};
   if (data && data.loggedin) {
      nav = fs.readFileSync('static/views/navbar_loggedin_template.html').toString();
      view.user = data.user;
   }
   else {
      nav = fs.readFileSync('static/views/navbar_template.html').toString();
   }
   var content = fs.readFileSync('static/views/signup_template.html').toString();
   var output = mustache.render(base, view, { 
      navbar: nav,
      main_content: content, 
   });
   response.writeHead(200, {'Content-Type' : 'text/html'});
   response.end(output);
};


var viewAllUsers = function(response, data) {
   dprint('#y[[V]];---Serving allUsers page.');
   var base = fs.readFileSync('static/views/base_template.html').toString();
   var view = { users: data.allUsers };
   var nav = '';
   if (data && data.loggedin) {
      nav = fs.readFileSync('static/views/navbar_loggedin_template.html').toString();
      view.user = data.user;
   }
   else {
      nav = fs.readFileSync('static/views/navbar_template.html').toString();
   }
   var content = fs.readFileSync('static/views/allusers_template.html').toString();
   var output = mustache.render(base, view, { 
      navbar: nav,
      main_content: content,
   });
   response.writeHead(200, {'Content-Type' : 'text/html'});
   response.end(output);
}


var viewLogin = function(response, data) {
   dprint('#y[[V]];---Serving login page.');
   var base = fs.readFileSync('static/views/base_template.html').toString();
   var view = { };
   var nav = '';
   if (data && data.loggedin) {
      nav = fs.readFileSync('static/views/navbar_loggedin_template.html').toString();
      view.user = data.user;
   }
   else {
      nav = fs.readFileSync('static/views/navbar_template.html').toString();
   }
   var content = fs.readFileSync('static/views/login_template.html').toString();
   var output = mustache.render(base, view, { 
      navbar: nav,
      main_content: content, 
   });
   response.writeHead(200, {'Content-Type' : 'text/html'});
   response.end(output);
}


viewAllPosts = function(response, data) {
   dprint('#y[[V]]; Serving all posts page.');
   var base = fs.readFileSync('static/views/base_template.html').toString();
   var view = { posts: data.posts };
   var nav = '';
   if (data && data.loggedin) {
      nav = fs.readFileSync('static/views/navbar_loggedin_template.html').toString();
      view.user = data.user;
   }
   else {
      nav = fs.readFileSync('static/views/navbar_template.html').toString();
   }
   var content = fs.readFileSync('static/views/posts.html').toString();
   var output = mustache.render(base, view, { 
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
exports.viewAllPosts = viewAllPosts;


