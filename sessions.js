var sql = require('sqlite3').verbose();
var db = new sql.Database('database.db');
var rand = require('csprng');


var createSession = function(response, username, cb) {
   var sessionKey = username + rand(160, 36);

   db.serialize(function() {

      db.run('\
         DELETE FROM sessions \
         WHERE username=\'' + username +'\';' 
      );

      db.run('\
         INSERT INTO sessions VALUES (?,?)', [
            username,
            sessionKey,
         ]
      );

      response.setCookie({
         'sessionkey': { 
            'val': sessionKey,
            'life': 60000 * 24,
            'path': '/',
         },
         'username': {
            'val': username,
            'life': 60000 * 24,
            'path': '/',
         },
      });

      cb(username, sessionKey);
         
   });
}


var validateSession  = function(username, token, cb) {
   dprint('#y[[S]]; Validating session... ');

   if (username && token) {
      db.get('\
         SELECT * FROM sessions\
         WHERE username = \'' + username + '\'',
         function(err, row) {
            if (err) throw err;

            if (row.sessionKey === token) {
               dprint('#y[[S]]; Session validation #g[Success];!');
               cb(true);
            }
            else {
               
               dprint('#y[[S]]; Session validation failed');
               cb(false);
            }
            
         });
   }
   else {
      cb(false);
   }
   
}



exports.createSession = createSession;
exports.validateSession = validateSession;
