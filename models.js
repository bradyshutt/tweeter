/* global cpr */
var sql = require('sqlite3').verbose()
var db = new sql.Database('database.db')

function initDB (cb) {
  cpr.db('Initializing Database')
  db.serialize(() => {
    db.run('PRAGMA foreign_keys = ON')

    db.run(
      'CREATE TABLE IF NOT EXISTS users (' +
      'username TEXT PRIMARY KEY NOT NULL, ' +
      'firstName TEXT NOT NULL, ' +
      'lastName TEXT NOT NULL, ' +
      'email TEXT, ' +
      'gender TEXT, ' +
      'profilePicture TEXT, ' +
      'password TEXT NOT NULL)'
    )

    db.run(
      'CREATE TABLE IF NOT EXISTS sessions (' +
      'username TEXT, ' +
      'sessionKey TEXT NOT NULL, ' +
      'FOREIGN KEY(username) REFERENCES users(username))'
    )

    db.run(
      'CREATE TABLE IF NOT EXISTS posts (' +
      'postID INTEGER PRIMARY KEY, ' +
      'username TEXT, ' +
      'numLikes INTEGER, ' +
      'postDate TEXT NOT NULL, ' +
      'postContent TEXT NOT NULL, ' +
      'FOREIGN KEY(username) REFERENCES users(username))',
      /*
       * Run callback after last serialized query is finished
       */
      cb()
    )
  })
}

function closeDB () {
  cpr('ly[Closing Database]')
  db.close((err) => { if (err) throw err })
}

exports.initDB = initDB
exports.closeDB = closeDB

