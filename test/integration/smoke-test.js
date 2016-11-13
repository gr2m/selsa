const test = require('tap').test

const selsa = require('../../index')

test('smoke', (t) => {
  selsa({}, (error, api) => {
    t.error(error)
    if (error) {
      return t.end()
    }

    api.tearDown(t.passing(), t.end)
  })
})
