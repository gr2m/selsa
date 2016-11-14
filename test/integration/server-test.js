const debug = require('debug')('selsa:test')
const test = require('tap').test

const selsa = require('../../index')

test('server', (t) => {
  selsa({}, (error, api) => {
    t.tearDown(() => {
      console.log('\n\n\nTEARDOWN\n\n')
      if (!this.server) {
        return api.tearDown(t.passing())
      }

      if (this.server) {
        debug('stopping server')
        this.server.stop(() => {
          debug('server stopped')
          api.tearDown(t.passing())
        })
      }
    })

    t.error(error)

    if (error) {
      return t.end()
    }

    this.server = require('../../server')
    this.server.on('start', () => {
      api.browser
        .url('http://localhost:8000')

        // http://webdriver.io/api/property/getTitle.html
        .getTitle()
          .then((title) => {
            t.equal(title, 'Login page')
          })

        // http://webdriver.io/api/protocol/execute.html
        .execute(function hello (name) {
          return `Hello, ${name}!`
        }, 'foo')
          .then((response) => {
            t.equal(response.value, 'Hello, foo!')
          })

        .catch(t.error)
        .then(() => {
          t.end()
        })
    })
  })
})
