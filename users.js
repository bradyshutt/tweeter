var bcrypt = require('bcrypt');
var sql =  require('sqlite3').verbose();
var db = new sql.Database('database.db'); 
var sessions = require('./sessions');

var addUser = function(fields, eventEmitter) {
   dprint('#y[[M]];  Adding new user');
   var user = {
      username : fields.username,
      firstName : fields.firstName,
      lastName : fields.lastName,
      email : fields.email,
      gender : fields.gender,
      profilePicture : fields.profilePicture,
      password : bcrypt.hashSync(fields.password, 10),
   };

   db.serialize(function() {
      db.run('\
         INSERT INTO users VALUES (?,?,?,?,?,?,?)', [
            user.username,
            user.firstName, 
            user.lastName,
            user.email,
            user.gender,
            user.profilePicture,
            user.password,
         ]); 
   });
   
   dprint('#y[[M]];  - Done adding new user, calling emit');
   eventEmitter.emit('dbAddUserFinished');
};


var login = function(name, password, cb) {
   dprint('#y[[U]];  Authenticating...');
   db.get('SELECT firstName, password FROM users WHERE username = \'' + 
      name + '\'', 
      function(err, row) {
         if (err) { throw err };
         dprint('#y[[U]];  .firstname. = ' + row.firstName);
         var hash = row.password.toString();
         dprint('#y[[U]];  .password. = ' + hash);
         bcrypt.compare(password, hash, function(err, res) {
            cb(res);
         });
      }
   );
};


var logout = function(response, username, cb) {
   if (username === null) {
      dprint('#r[[err]];  No username provied to logout');
      return
   }
   dprint('#y[[U]];  Logging out...');
   sessions.removeSession(response, username, cb);
};


var getAllUsers = function(callback) {
   db.all('SELECT * FROM users', function(err, rows) {
      callback(rows);
   });
};


var getUser = function(username, callback) {
   db.get('SELECT * FROM users WHERE username=\'' + username + '\'', 
      function(err, row) {
         callback(row);
      }
   );
};


var validateLogin = function(request, cb) {
   var user = request.cookies.username || null; 
   var sessionKey = request.cookies.sessionkey || null;
   if (user && sessionKey) {
      sessions.validateSession(user, sessionKey, function(isValid) {
         cb(isValid);
      });
   }
   else
      cb(false);
};

var submitPost = function(request, post, cb) {
   dprint('#y[[U]]; Submitting post');
   var user = request.cookies.username || null;
   if (user === null) throw new Error('User cannot be null to post');

   db.run('\
      INSERT INTO posts VALUES (\
         $postID, $username, $numLikes, $postDate, $postContent)', 
            {
               '$postID' : null,
               '$username' : user.toString(),
               '$numLikes' : 0,
               '$postDate' : new Date().toDateString().slice(0, -4).slice(4),
               '$postContent' : post.text
            } 
   , function(err) {
      if (err) throw err;

      cb();
   });



};

var getAllPosts = function(cb) {
   db.all('\
      SELECT * FROM posts \
      JOIN users ON users.username = posts.username;'
   , function(err, data) {
         cb(data);
      
   });

   
}




exports.addUser = addUser;
exports.getAllUsers = getAllUsers;
exports.getUser = getUser;
exports.login = login;
exports.logout = logout;
exports.validateLogin = validateLogin;
exports.submitPost = submitPost;
exports.getAllPosts = getAllPosts;


