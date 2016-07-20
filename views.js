/* global cpr */
var fs = require('fs')
var mustache = require('mustache')

function viewHome (res, data) {
  cpr('Responding with b[view.getHome()]')
  var base = fs.readFileSync('static/views/base_template.html').toString()
  var view = { }
  var nav = ''

  if (data.loggedin) {
    nav = fs.readFileSync('static/views/navbar_loggedin_template.html').toString()
    view.user = data.user
  } else {
    nav = fs.readFileSync('static/views/navbar_template.html').toString()
  }
  var output = mustache.render(base, view, {
    navbar: nav,
    main_content: fs.readFileSync('static/views/index.html').toString()
  })
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write(output)
  res.end()
}

function viewPageNotFound (res, data) {
  cpr('b[Serving 404 page.]')
  var base = fs.readFileSync('static/views/base_template.html').toString()
  var nav = fs.readFileSync('static/views/navbar_template.html').toString()
  var view = { }

  if (data && data.loggedin) {
    nav = fs.readFileSync('static/views/navbar_loggedin_template.html').toString()
    view.user = data.user
  } else {
    nav = fs.readFileSync('static/views/navbar_template.html').toString()
  }

  var content = '404 error ' + data.path + ' not found.'
  var output = mustache.render(base, view, {
    navbar: nav,
    main_content: content
  })
  res.writeHead(404, { 'Content-type': 'text/html' })
  res.end(output)
}

function viewSignup (res, data) {
  cpr('lm[Serving signup page.]')
  var base = fs.readFileSync('static/views/base_template.html').toString()
  var nav = ''
  var view = {}
  if (data && data.loggedin) {
    nav = fs.readFileSync('static/views/navbar_loggedin_template.html').toString()
    view.user = data.user
  } else {
    nav = fs.readFileSync('static/views/navbar_template.html').toString()
  }
  var content = fs.readFileSync('static/views/signup_template.html').toString()
  var output = mustache.render(base, view, {
    navbar: nav,
    main_content: content
  })
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end(output)
}

function viewAllUsers (res, data) {
  cpr('lm[Serving allUsers page.]')
  var base = fs.readFileSync('static/views/base_template.html').toString()
  var view = { users: data.allUsers }
  var nav = ''

  if (data && data.loggedin) {
    nav = fs.readFileSync('static/views/navbar_loggedin_template.html').toString()
    view.user = data.user
  } else {
    nav = fs.readFileSync('static/views/navbar_template.html').toString()
  }

  var content = fs.readFileSync('static/views/allusers_template.html').toString()
  var output = mustache.render(base, view, {
    navbar: nav,
    main_content: content
  })
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end(output)
}

function viewLogin (res, data) {
  cpr('b[Serving login page.]')
  var base = fs.readFileSync('static/views/base_template.html').toString()
  var view = { }
  var nav = ''
  if (data && data.loggedin) {
    nav = fs.readFileSync('static/views/navbar_loggedin_template.html').toString()
    view.user = data.user
  } else {
    nav = fs.readFileSync('static/views/navbar_template.html').toString()
  }
  var content = fs.readFileSync('static/views/login_template.html').toString()
  var output = mustache.render(base, view, {
    navbar: nav,
    main_content: content
  })
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end(output)
}

function viewAllPosts (res, data) {
  cpr('b[Serving all posts page.]')
  var base = fs.readFileSync('static/views/base_template.html').toString()
  var view = { posts: data.posts }
  var nav = ''
  if (data && data.loggedin) {
    nav = fs.readFileSync('static/views/navbar_loggedin_template.html').toString()
    view.user = data.user
  } else {
    nav = fs.readFileSync('static/views/navbar_template.html').toString()
  }
  var content = fs.readFileSync('static/views/posts.html').toString()
  var output = mustache.render(base, view, {
    navbar: nav,
    main_content: content
  })
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end(output)
}

exports.viewHome = viewHome
exports.viewPageNotFound = viewPageNotFound
exports.viewSignup = viewSignup
exports.viewAllUsers = viewAllUsers
exports.viewLogin = viewLogin
exports.viewAllPosts = viewAllPosts
