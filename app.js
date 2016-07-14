
var http = require('http');
var route = require('./router').router;
var controllers = require('./controllers');
var utils = require('./utils');
var models = require('./models');
var views = require('./views');

global.print = utils.print;
global.dprint = utils.dprint;

dprint.debug = true;

var staticFiles = {
   'main.css' : 1,
   'nav.css' : 1, 
};

var routes = {
   '/' : controllers.home, 
   '/signup' : controllers.signUp,
   '/signup/submit' : controllers.signUp,
   '/users' : controllers.getAllUsers,
};

var components = {
   'routes' : routes,
   'staticFiles' : staticFiles,
   'models' : models,
   'views' : views,
};


http.createServer(function(request, response) {

   models.init();
   components.request = request;
   components.response = response;

   route(components);
   
}).listen(8000);


