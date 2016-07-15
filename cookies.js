

var parseCookies = function(req) {
   var cookies = { };
   if (req.headers.cookie) {
      req.headers.cookie.split(';').forEach(function(cookie) {
         var arr = cookie.split('=');
         var key = arr[0].trim();
         var val = arr[1].trim();
         cookies[cookie.split('=')[0].trim()] = val; 
      });
   }
   return cookies;
}


var setCookie = function(response, cookiesObj) {
   var cookies = response.cookies || { };
   for (var name in cookiesObj) {
      cookies[name] = cookiesObj[name];  
   }
   response.setHeader('Set-Cookie', toCookieArray(cookies));
}


var toCookieArray = function(cookiesObj) {
   var cookies = [];
   for (var name in cookiesObj) {
      var cookie = name + '=';
      if (typeof cookiesObj[name] === 'object') {
         cookie += cookiesObj[name].val;
         if (cookiesObj[name].exp)
            cookie += '; expires=' + cookiesObj[name].exp;
         else if (cookiesObj[name].life) {
            cookie += '; expires=' + new Date(
               new Date().getTime() + cookiesObj[name].life
            ).toUTCString();
         }
      }
      else { cookie += cookiesObj[name] };
      dprint('#b[[Cookies]]; Setting new cookie: \'' + cookie + '\'');
      cookies.push(cookie);
   }
   return cookies;
}


var removeCookie = function(response, name) {
   var cookies = response.cookies || { };
   cookies[name] = 'null ; expires=' + new Date().toUTCString();
   response.setHeader('Set-Cookie', toCookieArray(cookies));
}


exports.parseCookies = parseCookies;
exports.setCookies = setCookie;
exports.setCookie = setCookie;
exports.removeCookie = removeCookie;

