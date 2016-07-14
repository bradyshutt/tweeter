var bcrypt = require('bcrypt');
var sql =  require('sqlite3').verbose();
var db = new sql.Database('database.db'); 

var addUser = function(fields, eventEmitter) {
   dprint('#y[[M]];  Adding new user');
   console.log(fields);
   console.log('');
   console.log(fields.firstName);
   var user = {
      firstName : fields.firstName,
      lastName : fields.lastName,
      email : fields.email,
      gender : fields.gender,
      username : fields.username,
      password : bcrypt.hashSync(fields.password, 10),
   };

   db.serialize(function() {
      db.run('\
         INSERT INTO users VALUES (NULL,?,?,?,?,?,?)', [
            user.firstName, 
            user.lastName,
            user.email,
            user.gender,
            user.username,
            user.password,
         ]); 
   });
   
   dprint('#y[[M]];  - Done adding new user, calling emit');
   eventEmitter.emit('dbAddUserFinished');
};


var authenticate = function(name, password, cb) {
   dprint('#y[[U]];  Authenticating...');

   db.get('SELECT firstName, password FROM users WHERE username = \'' + name + '\'', 
      function(err, row) {
         if (err) { throw err };
         dprint('#y[[U]];  .firstname. = ' + row.firstName);
         var hash = row.password.toString();
         dprint('#y[[U]];  .password. = ' + hash);
         console.log('testpass: ' + password);
         bcrypt.compare(password, hash, function(err, res) {


            cb(res);

         });

      }
   );
};


var getAllUsers = function(callback) {
   db.all('SELECT * FROM users', function(err, rows) {
      callback(rows);
   });
};


exports.addUser = addUser;
exports.getAllUsers = getAllUsers;
exports.authenticate = authenticate;


