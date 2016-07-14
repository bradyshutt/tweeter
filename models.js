
var sql = require('sqlite3').verbose();
var db = new sql.Database('database.db'); 
//var formidable = require('formidable');

var initDB = function() {
   dprint('#y[[M]];  Opening Database');
   db.serialize(function() {
      db.run('PRAGMA foreign_keys = ON');

      db.run('CREATE TABLE IF NOT EXISTS users (\
         id INTEGER PRIMARY KEY,\
         firstName TEXT NOT NULL,\
         lastName TEXT NOT NULL,\
         email TEXT,\
         gender TEXT,\
         username TEXT PRIMARY KEY NOT NULL,\
         password TEXT NOT NULL)'
      );

      db.all('SELECT * FROM users', [], function(err, data) {

         var len = data.length;
         for (var i = 0; i < len; ++i) {
            console.log(data[i]);
             
         } 

         
      });

   });
};

var closeDB = function() {
   dprint('#y[[M]];  Closing Database');
   db.close(function(err) { if (err) throw err });
};



exports.initDB = initDB;
exports.closeDB = closeDB;

