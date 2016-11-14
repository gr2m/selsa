const simple = require('simple-mock')
const test = require('tap').test

const tearDown = require('../../lib/tear-down')

test('.tearDown', (group) => {
  group.test('runner: selenium, but using existing', (t) => {
    const state = {
      debug: simple.stub(),
      browser: {
        end: simple.stub().resolveWith()
      }
    }
    tearDown(state, true, (error) => {
      t.equal(state.browser.end.callCount, 1, 'browser.end() called once')
      t.error(error)
      t.end()
    })
  })
  group.end()
})
