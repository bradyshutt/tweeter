/* global cpr */
'use strict'
/* TODO: Have parseCookies return a 'cookie-handler' object
 * with methods to set/remove/get cookies */

function parseCookies (req) {
  req.cookies = req.cookies || { }
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach((cookie) => {
      var split = cookie.split('=')
      req.cookies[split[0].trim()] = split[1].split(' ')[0].trim()
    })
  }
}

function parse (req) {
  req.cookies = req.cookies || { }
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach((cookie) => {
      var split = cookie.split('=')
      req.cookies[split[0].trim()] = split[1].split(' ')[0].trim()
    })
  }
}

function setCookie (res, cookiesObj) {
  var cookies = res.cookies || { }
  for (var name in cookiesObj) {
    cookies[name] = cookiesObj[name]
  }
  res.setHeader('Set-Cookie', toCookieArray(cookies))
}

function toCookieArray (cookiesObj) {
  var cookies = []
  for (var name in cookiesObj) {
    var cookie = name + '='
    if (typeof cookiesObj[name] === 'object') {
      cookie += cookiesObj[name].val

      if (typeof cookiesObj[name].exp === 'number') {
        cookie += '; expires=' + cookiesObj[name].exp
      } else if (typeof cookiesObj[name].life === 'number') {
        cookie += '; expires=' + new Date(
          new Date().getTime() + cookiesObj[name].life
        ).toUTCString()
      }

      if (cookiesObj[name].path) {
        cookie += '; path=' + cookiesObj[name].path
      }
    } else {
      cookie += cookiesObj[name]
    }
    cpr('b[Setting new cookie: \'' + cookie + '\']')
    cookies.push(cookie)
  }
  return cookies
}

/* TODO: combine the following functions with the generic versions above */

function removeCookie (res, name) {
  var cookies = res.cookies || { }
  cookies[name] = 'null  expires=' + new Date().toUTCString()
  res.setHeader('Set-Cookie', toCookieArray(cookies))
}

function responseSetCookie (cookiesObj) {
  var cookies = this.cookies || { }
  for (var name in cookiesObj) { cookies[name] = cookiesObj[name] }
  this.setHeader('Set-Cookie', toCookieArray(cookies))
}

function responseRemoveCookie (cookieName) {
  var cookies = this.cookies || { }
  cookies[cookieName] = 'null  expires=' + new Date().toUTCString()
  this.setHeader('Set-Cookie', toCookieArray(cookies))
}

exports.parseCookies = parseCookies
exports.parse = parse
exports.setCookies = setCookie
exports.setCookie = setCookie
exports.removeCookie = removeCookie
exports.responseSetCookie = responseSetCookie
exports.responseRemoveCookie = responseRemoveCookie

