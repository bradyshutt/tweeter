'use strict'

/* global cpr */
var http = require('http')
var utils = require('./utils')
var models = require('./models')
var cookies = require('./cookies')
var colorPrint = require('./cpr')
var users = require('./users')
var router = require('./router')
var route = router.route
var routeFile = router.file

global.cpr = colorPrint.cpr

http.createServer((req, res) => {
  /* If requesting a static file, skip cookie parsing,
   * db initialization, and session validation */
  if ((/^\/static\//).test(req.url) || (/^\/images\//).test(req.url)) {
    cpr.inc(req.url)
    res.redirect = utils.redirectURL
    routeFile(req, res)
  }
  else {
    cpr('')
    cpr.inc(req.url)

    Promise.all([
      examineRequest(req, res),
      models.initDB()
    ])

    .then(([userValidated, dbInitP]) => {
      cpr('User is ' + (userValidated ? 'g[' : 'r[not ') + 'logged in.]')
      route(req, res)
    })
  }
}).listen(8000)

function examineRequest (req, res) {
  cookies.parse(req)
  res.setCookie = cookies.responseSetCookie
  res.removeCookie = cookies.responseRemoveCookie
  res.redirect = utils.redirectURL

  return new Promise((resolve, reject) => {
    if ((req.username = req.cookies['username'] || null)) {
      if (req.cookies['sessionkey']) {
        users.validateSession(req, (err, isValid) => {
          if (err) throw err
          req.validated = isValid
          resolve(true)
        })
      }
    } else {
      resolve(false)
    }
    // if (req.method === 'POST') { /* TODO: SCAN FORM DATA */ }
  })

}

