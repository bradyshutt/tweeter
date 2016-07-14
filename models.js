
var sql = require('sqlite3').verbose();
var db = new sql.Database('database.db'); 
//var formidable = require('formidable');

var user_p = {
   firstName: null,
   lastName: null,
   email: null,
   gender: null,
   username: null,
   id: null,

};

var openDatabase = function() {
   dprint('#y[[M]];  Opening Database');
   db.serialize(function(err) {
      if (err) {
         console.log(err);
      }
      db.run('CREATE TABLE IF NOT EXISTS users (\
         id INTEGER PRIMARY KEY,\
         name TEXT,\
         username TEXT\
      )', function(err) {
      if (err) console.log('crap: ' + err);
      });
   });
}

var closeDatabase = function() {
   dprint('#y[[M]];  Closing Database');
   db.close();
}

var addUser = function(fields, eventEmitter) {
   dprint('#y[[M]];  Adding new user');
   var user = Object.create(user_p);
   user.name = fields.name;
 //  user.lastName = details.lastName;
//   user.email = details.email;
//   user.gender = details.gender;
   user.username = fields.username;
   
         //INSERT INTO user (fn, ln, e, un, id) VALUES (?,?,?,?,?,?)',
   db.serialize(function() {
      db.run('\
         INSERT INTO users VALUES (NULL,?,?) ',
         [ user.name, user.username ]
      );
      
   });
   
   dprint('#y[[M]];  - Done adding new user, calling emit');
   eventEmitter.emit('dbAddUserFinished');
};

var getAllUsers = function(callback) {
   db.serialize(function() {
      db.all('SELECT * FROM users', function(err, rows) {
         callback(rows);
      });
   });
}

exports.openDatabase = openDatabase;
exports.addUser = addUser;
exports.getAllUsers = getAllUsers;
exports.closeDatabase = closeDatabase;

