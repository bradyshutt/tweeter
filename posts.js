/* global cpr */
'use strict'
var sql = require('sqlite3').verbose()
var db = new sql.Database('database.db')

function submitPost (req, post, cb) {
  cpr('ly[Submitting post]')
  var user = req.cookies.username || null
  if (user === null) throw new Error('User cannot be null to post')
  db.run(
    'INSERT INTO posts VALUES ' +
    '($postID, $username, $numLikes, $postDate, $postContent)',
    {
      '$postID': null,
      '$username': user.toString(),
      '$numLikes': 0,
      '$postDate': new Date().toDateString().slice(0, -4).slice(4),
      '$postContent': post.text
    }
    , (err) => {
      if (err) throw err
      cb(null)
    }
  )
}

function allPosts (cb) {
  db.all(
    'SELECT * FROM posts ' +
    'JOIN users ON users.username = posts.username ' +
    'ORDER by posts.postID DESC'
  , (err, data) => {
    if (err) throw err
    cb(null, data)
  })
}

function getPost (postID, cb) {
  db.get(
    'SELECT * FROM posts ' +
    'WHERE postID=?', postID,
    (err, row) => {
      if (err) {
        cpr.err('Post not found. ID: ' + postID)
        cb(null)
      } else {
        cb(null, row)
      }
    }
  )
}

function deletePost (postID, cb) {
  db.run(
    'DELETE FROM posts ' +
    'WHERE postID = ?',
    postID, (err) => {
      if (err) throw err
      cb(null)
    }
  )
}

exports.submitPost = submitPost
exports.allPosts = allPosts
exports.deletePost = deletePost
exports.getPost = getPost

