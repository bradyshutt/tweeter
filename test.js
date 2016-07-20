
var res = { }
var req = {

  cookies: {
    username: null
  }

}

if ((res.username = req.cookies['username']) || null) {
  console.log('tru af')
  console.log(res.username)
} else console.log('not tru')

