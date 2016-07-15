
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

   //cookies.parseCookies(request);

   //console.log(request.cookies);

   //route(request, response);


   response.cookies = cookies.parseCookies(request);

   var myCookies = cookies.parseCookies(request);

   cookies.setCookies(response, {
      'age' : {
         val: 69, 
         exp: new Date(new Date().getTime() + 5000).toUTCString(),
      },
      'power' : 9000,
   });

   cookies.setCookie(response, {
      'house' : {
         val: 'targarian', 
         life: 5000,
      },
   });

   response.writeHead(200, {
      'Content-Type': 'text/plain'
   });
   response.end('Yo');

   
}).listen(8000);

