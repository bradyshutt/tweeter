/* global cpr */
var bcrypt = require('bcrypt')
var sql = require('sqlite3').verbose()
var db = new sql.Database('database.db')
var rand = require('csprng') // used to generate secure random session key

function addUser (user, cb) {
  cpr('m[Adding a new user: ' + user.username + ' ]')

  db.serialize(function () {
    db.run(
      'INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?)'
      , [
        user.username,
        user.firstName,
        user.lastName,
        user.email,
        user.gender,
        user.profilePicture,
        bcrypt.hashSync(user.password, 10)
      ])
    cb()
  })
}

function login (name, password, cb) {
  cpr('m[Authenticating login for ' + name + ']')
  db.get('SELECT password FROM users WHERE username=\'' + name + '\''
  , function (err, row) {
    if (err) { throw err }
    var hash = row.password.toString()
    bcrypt.compare(password, hash, function (err, success) {
      if (err) { throw err }
      cb(success)
    })
  })
}

function createSession (req, res, cb) {
  cpr('c[Creating a new session for ' + req.username + ']')
  var sessionKey = req.username + rand(160, 36)

  db.serialize(function () {
    db.run('DELETE FROM sessions WHERE username=\'' + req.username + '\'')

    db.run('INSERT INTO sessions VALUES (?, ?)', req.username, sessionKey)

    res.setCookie({
      'sessionkey': {
        'val': sessionKey,
        'life': 60000 * 24,
        'path': '/'
      },
      'username': {
        'val': req.username,
        'life': 60000 * 24,
        'path': '/'
      }
    })
    cb()
  })
}

function logout (res, cb) {
  var username = res.user.username || new Error('No username provided to logout: ' + username)
  cpr('m[' + username + ' is logging out. ]')
  removeSession(res, username, cb)
}

function deleteUser (username, cb) {
  cpr('m[Deleting ' + username + ' from database]')
  db.run('DELETE FROM users WHERE username=(?)', username, cb)
}

function getAllUsers (callback) {
  db.all('SELECT * FROM users', function (err, rows) {
    if (err) throw err
    callback(rows)
  })
}

function getUser (username, callback) {
  db.get('SELECT * FROM users WHERE username=\'' + username + '\'',
    function (err, row) {
      if (err) throw err
      callback(row)
    }
  )
}

function validateSession (req, cb) {
  var user = req.username || new Error('Validating session w/out a u.n.')
  cpr('m[Validating ' + user + '\'s session.]')
  var sessionKey = req.cookies.sessionkey

  if (user && sessionKey) {
    db.get(
      'SELECT * FROM sessions ' +
      'JOIN users ON users.username = sessions.username ' +
      'WHERE users.username = \'' + req.username + '\''
    , function (err, row) {
      if (err) { throw err }
      if (row === undefined || row.sessionKey !== sessionKey) {
        cpr('r[Session validation failed.]')
        cb(null, false)
      } else if (row.sessionKey === sessionKey) {
        cpr('g[Session validation success!]')
        cb(null, true)
      }
    })
  } else cb(null, false)
}

function removeSession (res, username, cb) {
  db.serialize(function () {
    db.run(
      'DELETE FROM sessions ' +
      'WHERE username=\'' + username + '\''
    )

    res.setCookie({
      'sessionkey': {
        'val': 'null',
        'life': 0,
        'path': '/'
      },
      'username': {
        'val': 'null',
        'life': 0,
        'path': '/'
      }
    })

    if (cb) cb()
  })
}

exports.addUser = addUser
exports.getAllUsers = getAllUsers
exports.getUser = getUser
exports.login = login
exports.logout = logout
exports.validateSession = validateSession
exports.deleteUser = deleteUser
exports.createSession = createSession

