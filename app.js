
var http = require('http');
var route = require('./router').router;
var utils = require('./utils');
var models = require('./models');
var views = require('./views');

global.print = utils.print;
global.dprint = utils.dprint;
dprint.debug = true;

models.initDB();

http.createServer(function(request, response) {

   route(request, response);

   
}).listen(8000);


