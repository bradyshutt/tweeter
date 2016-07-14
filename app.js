
var http = require('http');
var route = require('./router').router;
var utils = require('./utils');
var models = require('./models');
var views = require('./views');

global.print = utils.print;
global.dprint = utils.dprint;
dprint.debug = false;

http.createServer(function(request, response) {


   print('#r[hey]; what is #g[up]; dog');




   models.openDatabase();

   route(request, response);
   
}).listen(8000);


