/* global cpr */
var views = require('./views')
var users = require('./users')
var fs = require('fs')
var formidable = require('formidable')

function home (req, res) {
  var username = req.cookies.username || null
  var viewContext = { }

  if (req.validated) {
    users.getUser(username, function (user) {
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
  users.getAllUsers(function (allUsers) {
    viewContext.allUsers = allUsers
    if (req.validated) {
      users.getUser(req.cookies.username, function (user) {
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
  users.getUser(req.cookies.username, function (user) {
    viewContext.user = user
    viewContext.loggedin = true
    views.viewPageNotFound(res, viewContext)
  })
}

function staticFile (req, res, args) {
  var type = args[0]
  var fname = args[1]
  cpr('y[---->] Responding with file: c[' + fname + ']')
  var file = fs.readFileSync('static/' + type + '/' + fname)
  res.writeHead(200, {'Content-Type': 'text/' + type})
  res.end(file)
}

function image (req, res, name) {
  cpr('y[---->] Responding with image: c[' + name + ']')
  var file = fs.readFileSync('static/images/' + name)
  // res.writeHead(200, {'Content-Type': 'bb' + type})
  res.end(file)
}

function signup (req, res) {
  cpr('y[signup controller]')
  if (req.method === 'GET') views.viewSignup(res)
  else if (req.method === 'POST') {
    var form = new formidable.IncomingForm()

    form.uploadDir = 'static/images/'
    form.parse(req, function (err, fields, files) {
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
    form.parse(req, function (err, fields) {
      if (err) throw err
      users.login(fields.username, fields.password, function (resault) {
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

  if (res.validated) {
    users.getUser(username, function (user) {
      viewContext.user = user
      viewContext.loggedin = true
      users.getAllPosts(function (posts) {
        viewContext.posts = posts
        views.viewAllPosts(res, viewContext)
      })
    })
  } else views.viewAllPosts(res, viewContext)
}

function submitPost (req, res) {
  if (req.method !== 'POST') throw new Error('Method is not POST.')
  var form = new formidable.IncomingForm()
  form.parse(req, function (err, fields) {
    if (err) throw err
    var post = {
      'text': fields.postContent,
      'username': req.cookies.username,
      'date': new Date()
    }
    users.submitPost(req, post, function () {
      cpr('y[Redirecting to /posts/all]')
      res.redirect('/posts/all')
    })
  })
}

exports.home = home
exports.allUsers = allUsers
exports.notFound = notFound
exports.staticFile = staticFile
exports.image = image
exports.signup = signup
exports.login = login
exports.logout = logout
exports.allPosts = allPosts
exports.submitPost = submitPost
exports.deleteUser = deleteUser
