var sql = require('sqlite3').verbose();
var db = new sql.Database('database.db');
var rand = require('csprng');

var createSession = function(username) {
   var sessionKey = rand(160, 36);
   db.run('\
      INSERT INTO sessions VALUES (NULL,?,?)', [
         username,
         sessionKey,
      ]);
}

var session = {

   cookies: { }, 


   setCookie: function(key, val) {
      // Create a new cookie, append to cookies array
   },

   removeCookie: function() {
      // Remove a cookie
   }, 

   getCookies: function() {
      // return object of cookies 
   },



};


var Token = function(username) {
   this.username = username;
   this.loggedin = true;
   this.lastAuthentication = Date.now();
}

var activeSessions = { 
   username: [ { lastAuthentication: null, } ],
};


var startSession = function(request, username) {
   var tokenObject = new Token(username);
   var token = JSON.stringify(tokenObject);
   
   activeSessions[username].push(token);
   var cookies = request.headers.cookie
   request.setHeader('Set-Cookie', ['token']);

}


var validateSession  = function(username, token) {

   activeSessions[username].forEach(function(tkn) {
      if (tkn === token) {
         
      }
      
   });

   
}


var updateSession = function(user) {

}
