
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

   request.cookies = cookies.parseCookies(request);
   response.cookies = cookies.parseCookies(request);
   response.setCookie = cookies.responseSetCookie;
   response.removeCookie = cookies.responseRemoveCookie;

   route(request, response);

   
}).listen(8000);

