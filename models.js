
var sql = require('sqlite3').verbose();
var db = new sql.Database('database.db'); 
//var formidable = require('formidable');

var initDB = function() {
   dprint('#y[[M]];  Opening Database');
   db.serialize(function() {
      db.run('PRAGMA foreign_keys = ON');

      db.run('CREATE TABLE IF NOT EXISTS users (\
         username TEXT PRIMARY KEY NOT NULL,\
         firstName TEXT NOT NULL,\
         lastName TEXT NOT NULL,\
         email TEXT,\
         gender TEXT,\
         password TEXT NOT NULL)'
      );

      db.run('CREATE TABLE IF NOT EXISTS sessions (\
         username TEXT,\
         sessionKey TEXT NOT NULL,\
         FOREIGN KEY(username) REFERENCES users(username))'
      );

   });
};

var closeDB = function() {
   dprint('#y[[M]];  Closing Database');
   db.close(function(err) { if (err) throw err });
};



exports.initDB = initDB;
exports.closeDB = closeDB;

