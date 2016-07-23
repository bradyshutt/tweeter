/* global cpr */
var views = require('./views')
var users = require('./users')
var posts = require('./posts')
var fs = require('fs')
var formidable = require('formidable')

function home (req, res) {
  var username = req.cookies.username || null
  var viewContext = { }

  if (req.validated) {
    users.getUser(username, (err, user) => {
      if (err) throw err
      viewContext.user = user
      viewContext.loggedin = true
      views.viewHome(res, viewContext)
    })
  } else {
    views.viewHome(res, viewContext)
  }
}

function allUsers (req, res) {
  cpr('y[allUsers controller]')
  var viewContext = { }
  users.allUsers((err, allUsers) => {
    if (err) throw err
    viewContext.allUsers = allUsers
    if (req.validated) {
      users.getUser(req.cookies.username, (err, user) => {
        if (err) throw err
        viewContext.user = user
        viewContext.loggedin = true
        views.viewAllUsers(res, viewContext)
      })
    } else {
      viewContext.loggedin = false
      views.viewAllUsers(res, viewContext)
    }
  })
}

function deleteUser (req, res, username) {
  cpr('m[Deleting ' + username + 'from the database.]')
  users.deleteUser(username, () => res.redirect('/users/all'))
}

function notFound (req, res, path) {
  var viewContext = { 'path': path }
  users.getUser(req.cookies.username, (err, user) => {
    if (err) throw err
    viewContext.user = user
    viewContext.loggedin = true
    views.viewPageNotFound(res, viewContext)
  })
}

function file (res, cat, type, fname) {
  if (cat === 'images') {
    fs.readFile('static/images/' + fname, (err, file) => {
      if (err) {
        cpr.err('Image not found.')
        res.redirect('/images/notFound.png')
      } else {
        cpr.out(cat + ' ' + fname)
        res.writeHeader(200, {'Content-Type': 'image/' + fname.split('.')[1]})
        res.end(file)
      }
    })
  } else if (cat === 'static') {
    fs.readFile('static/' + type + '/' + fname, (err, file) => {
      if (err) throw err
      else {
        cpr.out(type + ' ' + fname)
        res.writeHeader(200, {'Content-Type': 'text/' + type})
        res.end(file)
      }
    })
  }
}

function staticFile (res, type, fname) {
  cpr.out(fname)
  var file = fs.readFileSync('static/' + type + '/' + fname)
  res.writeHead(200, {'Content-Type': 'text/' + type})
  res.end(file)
}

function image (req, res, name) {
  cpr.out(name)
  var file = fs.readFileSync('static/images/' + name)
  res.end(file)
}

function signup (req, res) {
  cpr('y[signup controller]')
  if (req.method === 'GET') views.viewSignup(res)
  else if (req.method === 'POST') {
    var form = new formidable.IncomingForm()

    form.uploadDir = 'static/images/'
    form.parse(req, (err, fields, files) => {
      if (err) throw err
      fs.renameSync(files.profilePicture.path,
        'static/images/' + files.profilePicture.name)
      fields.profilePicture = files.profilePicture.name
      users.addUser(fields, () => req.redirect('/users/all'))
    })
  }
}

function login (req, res) {
  if (req.method === 'GET') views.viewLogin(res)
  else if (req.method === 'POST') {
    var form = new formidable.IncomingForm()
    form.parse(req, (err, fields) => {
      if (err) throw err
      users.login(fields.username, fields.password, (err, resault) => {
        if (err) throw err
        if (resault) {
          cpr('g[LOGIN SUCCESS!!]')
          req.username = fields.username
          users.createSession(req, res, () => res.redirect('/'))
        } else {
          cpr('r[ #r[Login Unsuccessful]')
          notFound(req, res)
        }
      })
    })
  }
}

function logout (req, res) {
  var user = req.cookies.username || null
  users.logout(res, user, () => res.redirect('/users/all'))
}

function allPosts (req, res) {
  var username = req.cookies.username || null
  var viewContext = { }
  if (req.validated) {
    users.getUser(username, (err, user) => {
      if (err) throw err
      viewContext.user = user
      viewContext.loggedin = true
      posts.allPosts((err, posts) => {
        if (err) throw err
        viewContext.posts = posts
        views.viewAllPosts(res, viewContext)
      })
    })
  } else views.viewAllPosts(res, viewContext)
}

function submitPost (req, res) {
  cpr.notice('HELLO')
  if (req.method !== 'POST') throw new Error('Method is not POST.')
  var form = new formidable.IncomingForm()
  form.parse(req, (err, fields) => {
    if (err) throw err
    var post = {
      'text': fields.postContent,
      'username': req.cookies.username,
      'date': new Date()
    }
    posts.submitPost(req, post, () => {
      cpr('y[Redirecting to /posts/all]')
      res.redirect('/posts/all')
    })
  })
}

function deletePost (req, res, postID) {
  posts.getPost(parseInt(postID), (err, post) => {
    if (err) throw err
    console.log('post: ' + post)
    console.log(post.username)
    if (post.username === req.username) {
      console.log('delete post')
      posts.deletePost(postID, () => {
        res.redirect('/posts')
      })
    } else {
      res.end('You can\'t delete someone elses post!')
    }
  })
}

exports.home = home
exports.allUsers = allUsers
exports.notFound = notFound
exports.static = staticFile
exports.file = file
exports.image = image
exports.signup = signup
exports.login = login
exports.logout = logout
exports.allPosts = allPosts
exports.submitPost = submitPost
exports.deleteUser = deleteUser
exports.deletePost = deletePost
