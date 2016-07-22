var controllers = require('./controllers.js')

var routes = [ ]

// ROUTE TO HOME PAGE
addRoute('GET', [ /^$/, /^\/$/ ], controllers.home)

// REQUEST ALL USERS
addRoute('GET', [ /^\/users$/, /^\/users\/all$/ ], controllers.allUsers)

// USER SIGN UP
addRoute('GET', /^\/users\/signup$/, controllers.signup)

// USER SIGN UP
addRoute('POST', /^\/users\/signup$/, controllers.signup)

// USER LOG IN
addRoute('GET', [ /^\/login$/, /^\/users\/login$/ ], controllers.login)

// USER LOG IN SUBMIT
addRoute('POST', /^\/users\/login$/, controllers.login)

// USER LOG OUT
addRoute('GET', [ /^\/logout$/, /^\/users\/logout/ ], controllers.logout)

// REQUEST A USERS PROFILE
addRoute('GET', /^\/users\/u\/([^\/]+)$/, function (req, res, args) {
  console.log('username: ' + args[0])
})

// DELETE A USER
addRoute('GET', /^\/users\/delete\/([^\/]+)$/, (req, res, un) => {
  controllers.deleteUser(req, res, un)
})

// REQUEST ALL POSTS
addRoute('GET', [ /^\/posts$/, /^\/posts\/all$/ ], controllers.allPosts)

// REQUEST STATIC FILE
addRoute('GET', /^\/static\/([^\/]+)\/([^\/]+)$/, controllers.staticFile)

// REQUEST IMAGE FILE
addRoute('GET', /^\/images\/([^\/]+)$/, controllers.image)

function addRoute (method, regexURL, func) {
  if (regexURL && regexURL.constructor === Array) {
    regexURL.forEach(function (val) {
      routes.push({
        method: method,
        pattern: val,
        cb: func
      })
    })
  } else {
    var newRoute = {
      method: method,
      pattern: regexURL,
      cb: func
    }
    routes.push(newRoute)
  }
}

function searchRoutes (req, res) {
  var matches
  var routed = false

  routes.forEach(function (route) {
    /* Saves regex matches obj to 'matches' */
    if (route.method === req.method &&
      (matches = req.url.match(route.pattern))) {
      /* Send captured groups to the route's callback */
      var captures = [ ]
      for (var idx = 1; matches[idx]; ++idx) { captures.push(matches[idx]) }
      route.cb(req, res, captures)
      routed = true
      return
    }
  })
  if (!routed) { controllers.notFound(req, res) || { } }
}

function file (req, res) {
  if (req.method !== 'GET') {
    throw new Error('Requesting static file with http method:' + req.method)
  } else {
    let matches = req.url.match(/^\/([^\/]+)\/?([^\/]+)?\/([^\/]+)$/)
    let cat = matches[1]
    let type = matches[2]
    let file = matches[3]
    controllers.file(res, cat, type, file)
  }
}

exports.route = searchRoutes
exports.file = file

