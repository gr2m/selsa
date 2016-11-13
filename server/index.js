// based on https://github.com/hapijs/hapi-auth-cookie/blob/master/example/index.js
const Hapi = require('hapi')
const authCookie = require('hapi-auth-cookie')

// Use seq instead of proper unique identifiers for demo only
let uuid = 1

const users = {
  john: {
    password: 'password',
    name: 'John Doe'
  }
}

const home = function (request, reply) {
  reply(`<html>
    <head><title>Login page</title></head>
    <body>
      <h3>Welcome ${request.auth.credentials.name}!</h3>
      <form method="get" action="/logout">
        <input type="submit" value="Logout">
      </form>
    </body>
  </html>`)
}

const login = function (request, reply) {
  if (request.auth.isAuthenticated) {
    return reply.redirect('/')
  }

  let message = ''
  let account = null

  if (request.method === 'post') {
    if (!request.payload.username ||
            !request.payload.password) {
      message = 'Missing username or password'
    } else {
      account = users[request.payload.username]
      if (!account ||
                account.password !== request.payload.password) {
        message = 'Invalid username or password'
      }
    }
  }

  if (request.method === 'get' || message) {
    return reply(`<html>
      <head><title>Login page</title></head>
      <body>
        <h3>${message}</h3>
        <form method="post" action="/login">
          <p>Username: <input type="text" name="username"></p>
          <p>Password: <input type="password" name="password"></p>
          <p><input type="submit" value="Login"></p>
        </form>
      </body>
    </html>`)
  }

  const sid = String(++uuid)
  request.server.app.cache.set(sid, { account: account }, 0, (error) => {
    if (error) {
      return reply(error)
    }

    request.cookieAuth.set({ sid: sid })
    return reply.redirect('/')
  })
}

const logout = function (request, reply) {
  request.cookieAuth.clear()
  return reply.redirect('/')
}

const server = new Hapi.Server()
server.connection({ port: 8000 })

server.register(authCookie, (error) => {
  if (error) {
    throw error
  }

  const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 })
  server.app.cache = cache

  server.auth.strategy('session', 'cookie', true, {
    password: 'password-should-be-32-characters',
    cookie: 'sid-example',
    redirectTo: '/login',
    isSecure: false,
    validateFunc: function (request, session, callback) {
      cache.get(session.sid, (error, cached) => {
        if (error) {
          return callback(error, false)
        }

        if (!cached) {
          return callback(null, false)
        }

        return callback(null, true, cached.account)
      })
    }
  })

  server.route([
    { method: 'GET', path: '/', config: { handler: home } },
    { method: ['GET', 'POST'], path: '/login', config: { handler: login, auth: { mode: 'try' }, plugins: { 'hapi-auth-cookie': { redirectTo: false } } } },
    { method: 'GET', path: '/logout', config: { handler: logout } }
  ])

  server.start(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Server started at ${server.info.uri}`)
    }
  })
})

module.exports = server
