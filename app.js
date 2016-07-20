var http = require('http')
var utils = require('./utils')
var models = require('./models')
var cookies = require('./cookies')
var users = require('./users')
var route = require('./router').route

global.print = utils.print
global.dprint = utils.dprint
global.cpr = utils.cprint

// var foo = new Promise((resolve, reject) => {
//   resolve()
// })
// 
// foo.then((resolve) => console.log(resolve))

http.createServer(function (req, res) {
  cpr('')
  cpr('Recieved request for: y[' + req.url + ' ]')


  /* If requesting a static file, skip db initialization
   * and request examination. Just serve the static file. */
  if (req.url.match(/^\/static\//)) route(req, res)
  else {
    models.initDB(() => {
      examineRequest(req, res)
      cpr('User is ' + (req.validated ? 'g[' : 'r[not ') + 'logged in.]')
      route(req, res)
    })
  }
}).listen(8000)

function examineRequest (req, res) {
  res.cookies = cookies.parseCookies(req)
  res.setCookie = cookies.responseSetCookie
  res.removeCookie = cookies.responseRemoveCookie
  res.redirect = utils.redirectURL
  req.validated = false

  if ((req.username = req.cookies['username']) || null) {
    if (req.cookies['sessionkey']) {
      users.validateSession(req, function (isValid) {
        if (isValid) req.validated = true
        else req.validated = false
        console.log(req.validated)
      })
    }
  }

  if (req.method === 'POST') {
    // SCAN FORM DATA
  }
}

/*   read all cookies
 *     ---> if user has a session cookie
 *     ------> validate session key
 *     ---------> give user object to res
 *
 *
 *   if there's incoming POST data
 *     ---> read data and give to res object
 *
 **/

// TODO: Give response a context object to track things
//       such as active user and their status level (user/admin/guest/etc),
//       session status, etc.
