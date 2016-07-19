
var http = require('http');
var route = require('./router').route;
var utils = require('./utils');
var models = require('./models');
var views = require('./views');
var cookies =  require('./cookies');
var sessions = require('./sessions');


global.print = utils.print;
global.dprint = utils.dprint;
global.cpr = utils.cprint;
dprint.debug = false;




http.createServer(function(req, res) {


   models.initDB(() => {

      examineRequest(req, res);  
      prepResponse(req, res);  
      route(req, res);
   });


   
}).listen(8000);



function examineRequest(req, res) {

   res.user = { 
      name: 'guest', 
   };


   cookies.parseCookies(req);



   if (req.method === 'POST') {
      // SCAN FORM DATA
   } 


   //sessions.validateSession(req);
   res.cookies = cookies.parseCookies(req);
   res.setCookie = cookies.responseSetCookie;
   res.removeCookie = cookies.responseRemoveCookie;
   res.redirect = utils.redirectURL;

   
}

   /*   read all cookies
    *     ---> if user has a session cookie
    *     ------> validate session key
    *     ---------> give user object to res 
    *
    *
    *   if there's incoming POST data
    *     ---> read data and give to res object
    *
    **/




// TODO: Give response a context object to track things
//       such as active user and their status level (user/admin/guest/etc), 
//       session status, etc.
