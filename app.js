/* TODO: all err arg to all callbacks to adhere to standards */
/* TODO: change all '//' comments to '/*' ones */

var http = require('http')
var utils = require('./utils')
var models = require('./models')
var cookies = require('./cookies')
var users = require('./users')
var route = require('./router').route

global.print = utils.print
global.dprint = utils.dprint
global.cpr = utils.cprint

http.createServer(function (req, res) {

  /* If requesting a static file, skip cookie parsing,
   * db initialization, and session validation */
  if ((/^\/static\//).test(req.url) ||  (/^\/images\//).test(req.url)) { 
    cpr('Recieved request for asset: y[' + req.url + ' ]')
    route(req, res) 
  } else {
    cpr('')
    cpr('Recieved request for URL: y[' + req.url + ' ]')
    examineRequest(req, res, () => {
      models.initDB(() => {
        cpr('User is ' + (req.validated ? 'g[' : 'r[not ') + 'logged in.]')
        route(req, res)
      })
    })
  }

}).listen(8000)

function examineRequest (req, res, cb) {
  res.cookies = cookies.parseCookies(req)
  res.setCookie = cookies.responseSetCookie
  res.removeCookie = cookies.responseRemoveCookie
  res.redirect = utils.redirectURL

  if ((req.username = req.cookies['username'] || null)) {
    if (req.cookies['sessionkey']) {
      users.validateSession(req, (err, isValid) => { 
        req.validated = isValid 
        cb();
      })
    }
  }

  if (req.method === 'POST') { /* TODO: SCAN FORM DATA */  }

}

