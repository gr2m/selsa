const debug = require('debug')('selsa:test')
const test = require('tap').test

const selsa = require('../../index')

test('server', (t) => {
  selsa({}, (error, api) => {
    t.tearDown(() => {
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
        .getTitle()
          .then((title) => {
            t.equal(title, 'Login page')
          })
        .catch(t.error)
        .then(() => {
          t.end()
        })
    })
  })
})
