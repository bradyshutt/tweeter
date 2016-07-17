
var http = require('http');
var route = require('./router').router;
var utils = require('./utils');
var models = require('./models');
var views = require('./views');
var cookies =  require('./cookies');

global.print = utils.print;
global.dprint = utils.dprint;
dprint.debug = true;

models.initDB();


http.createServer(function(request, response) {

   //sessions.validateSession(request);

   request.cookies = cookies.parseCookies(request);
   response.cookies = cookies.parseCookies(request);
   response.setCookie = cookies.responseSetCookie;
   response.removeCookie = cookies.responseRemoveCookie;
   response.redirect = utils.redirectURL;


   route(request, response);

   
}).listen(8000);


var staticFiles = {
   'main.css': 1,
   'nav.css': 1, 
   'main.js': 1,
};


var images = {
   'user-default.png': 1,
   'athena.png': 1,
   'burritocat.jpg': 1,
   'businesscat.jpeg': 1,
   'nyancat.png': 1,
   'me.jpg': 1,
};
