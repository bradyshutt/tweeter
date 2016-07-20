/* global cpr */
var sql = require('sqlite3').verbose()
var db = new sql.Database('database.db')
// var formidable = require('formidable')

function initDB (cb) {
  cpr('m[Initializing Database]')
  db.serialize(function () {
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
      'FOREIGN KEY(username) REFERENCES users(username))'
    )

    cb()
  })
}

function closeDB () {
  cpr('ly[Closing Database]')
  db.close(function (err) { if (err) throw err })
}

exports.initDB = initDB
exports.closeDB = closeDB

