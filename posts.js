/* global cpr */
var sql = require('sqlite3').verbose()
var db = new sql.Database('database.db')

function submitPost (req, post, cb) {
  cpr('ly[Submitting post]')
  var user = req.cookies.username || null
  if (user === null) throw new Error('User cannot be null to post')
  db.run(
    'INSERT INTO posts VALUES' +
    '($postID, $username, $numLikes, $postDate, $postContent)',
    {
      '$postID': null,
      '$username': user.toString(),
      '$numLikes': 0,
      '$postDate': new Date().toDateString().slice(0, -4).slice(4),
      '$postContent': post.text
    }
    , function (err) {
      if (err) throw err
      cb()
    }
  )
}

function getAllPosts (cb) {
  db.all(
    'SELECT * FROM posts' +
    'JOIN users ON users.username = posts.username' +
    'ORDER by posts.postID DESC'
  , function (err, data) {
    if (err) throw err
    cb(data)
  })
}

exports.submitPost = submitPost
exports.getAllPosts = getAllPosts
