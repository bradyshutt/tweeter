
//usage: 
//   res.cookies = cookies.parseCookies(req);
//   res.setCookie = cookies.responseSetCookie;
//   res.removeCookie = cookies.responseRemoveCookie;
//
//   res.setCookie({
//      'age' : {
//         val: 69, 
//         exp: new Date(new Date().getTime() + 5000).toUTCString(),
//      },
//      'power' : 9000,
//   });


function parseCookies(req) {
   req.cookies = req.cookies || { };
   if (req.headers.cookie) {
      req.headers.cookie.split(';').forEach(function(cookie) {
         var arr = cookie.split('=');
         var key = arr[0].trim();
         var val = arr[1].trim();
         req.cookies[key] = val; 
      });
   }
   return cookies;
};


function setCookie(res, cookiesObj) {
   var cookies = res.cookies || { };
   for (var name in cookiesObj) {
      cookies[name] = cookiesObj[name];  
   }
   res.setHeader('Set-Cookie', toCookieArray(cookies));
};


function toCookieArray(cookiesObj) {
   var cookies = [];
   for (var name in cookiesObj) {
      var cookie = name + '=';
      if (typeof cookiesObj[name] === 'object') {
         cookie += cookiesObj[name].val;

         if (typeof cookiesObj[name].exp === 'number') {
            cookie += '; expires=' + cookiesObj[name].exp;

         }
         else if (typeof cookiesObj[name].life === 'number') {
            cookie += '; expires=' + new Date(
               new Date().getTime() + cookiesObj[name].life
            ).toUTCString();
         }

         if (cookiesObj[name].path) {
            cookie += '; path=' + cookiesObj[name].path;
         }
      }
      else { 
         cookie += cookiesObj[name]
      };
      dprint('#b[[Cookies]]; Setting new cookie: \'' + cookie + '\'');
      cookies.push(cookie);
   }
   return cookies;
};


function removeCookie(res, name) {
   var cookies = res.cookies || { };
   cookies[name] = 'null ; expires=' + new Date().toUTCString();
   res.setHeader('Set-Cookie', toCookieArray(cookies));
};


function responseSetCookie(cookiesObj) {
   var cookies = this.cookies || { };
   for (var name in cookiesObj) {
      cookies[name] = cookiesObj[name];  
   }
   this.setHeader('Set-Cookie', toCookieArray(cookies));
};


function responseRemoveCookie(cookiesObj) {
   var cookies = this.cookies || { };
   for (var name in cookiesObj) {
      cookies[name] = cookiesObj[name];  
   }
   this.setHeader('Set-Cookie', toCookieArray(cookies));
};


exports.parseCookies = parseCookies;
exports.setCookies = setCookie;
exports.setCookie = setCookie;
exports.removeCookie = removeCookie;
exports.responseSetCookie = responseSetCookie;
exports.responseRemoveCookie = responseRemoveCookie;



