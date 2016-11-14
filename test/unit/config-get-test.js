const test = require('tap').test

const getConfig = require('../../lib/config/get')

test('config', (group) => {
  group.test('no options', (t) => {
    getConfig((error, config) => {
      t.error(error)
      t.end()
    })
  })

  group.test('defaults', (t) => {
    getConfig({}, (error, config) => {
      t.error(error)
      t.equal(config.runner, 'selenium')
      t.equal(config.webdriver.desiredCapabilities.browserName, 'chrome')
      t.end()
    })
  })

  group.test('options.client & saucelabs.{username|accessKey}', (t) => {
    getConfig({
      client: 'saucelabs:opera:12:linux',
      saucelabs: {
        username: 'sauceuser',
        accessKey: 'saucekey'
      }
    }, (error, config) => {
      t.error(error)
      t.equal(config.runner, 'saucelabs')
      t.equal(config.webdriver.desiredCapabilities.browserName, 'opera')
      t.equal(config.webdriver.desiredCapabilities.version, '12')
      t.equal(config.webdriver.desiredCapabilities.platform, 'linux')
      t.end()
    })
  })
  group.end()
})
