var sql = require('sqlite3').verbose();
var db = new sql.Database('database.db');
var rand = require('csprng');


function createSession(res, username, cb) {
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

      res.setCookie({
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
      cb();
   });
}


function validateSession(username, token, cb) {
   dprint('#y[[S]]; Validating session... ');
   if (username && token) { 
      db.get('\
         SELECT * FROM sessions \
         JOIN users ON users.username = sessions.username \
         WHERE users.username = \'' + username + '\''
      , function(err, row) {
         if (err) throw err;
         if (row === undefined) {
            dprint('#y[[S]]; Session validation failed');
            cb(false, null);
         }
         else if (row.sessionKey === token) {
            dprint('#y[[S]]; Session validation #g[Success];!');
            cb(true, row);
         }
         else {
            dprint('#y[[S]]; Session validation failed');
            cb(false, null);
         }
      });
   }
   else {
      cb(false);
   }
}


function removeSession(res, username, cb) {
   db.serialize(function() {

      db.run('\
         DELETE FROM sessions \
         WHERE username=\'' + username +'\';' 
      );

      res.setCookie({
         'sessionkey': { 
            'val': 'null',
            'life': 0,
            'path': '/',
         },
         'username': {
            'val': 'null',
            'life': 0,
            'path': '/',
         },
      });
      ( cb || (() => console.log('no cb')) )();
   });
   
}


exports.createSession = createSession;
exports.validateSession = validateSession;
exports.removeSession = removeSession;
