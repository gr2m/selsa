const defaultsDeep = require('lodash').defaultsDeep
const proxyquire = require('proxyquire').noCallThru().noPreserveCache()
const simple = require('simple-mock')
const test = require('tap').test

const envStub = {
  saucelabs: {
    connect: {
      tunnelIdentifier: 'tunnelIdentifier'
    },

    webdriver: {
      build: 'tunnelIdentifier',
      desiredCapabilities: {
        'tunnel-identifier': 'tunnelIdentifier'
      }
    }
  }
}

test('config', (group) => {
  group.test('no options', (t) => {
    const getConfig = proxyquire('../../lib/config/get', {
      './get-env': simple.stub().returnWith(envStub)
    })

    getConfig((error, config) => {
      t.error(error)
      t.end()
    })
  })

  group.test('defaults', (t) => {
    const getConfig = proxyquire('../../lib/config/get', {
      './get-env': simple.stub().returnWith(envStub)
    })

    getConfig(undefined, (error, config) => {
      t.error(error)
      t.equal(config.runner, 'selenium')
      t.equal(config.webdriver.desiredCapabilities.browserName, 'chrome')
      t.end()
    })
  })

  group.test('options.client & saucelabs.{username|accessKey}', (t) => {
    const getConfig = proxyquire('../../lib/config/get', {
      './get-env': simple.stub().returnWith(envStub)
    })

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

  group.test('CLIENT=selenium:phantomjs', (t) => {
    const getConfig = proxyquire('../../lib/config/get', {
      './get-env': simple.stub().returnWith(defaultsDeep({
        runner: 'selenium',
        webdriver: {
          desiredCapabilities: {
            browserName: 'phantomjs'
          }
        }
      }, envStub))
    })

    getConfig((error, config) => {
      simple.restore()
      t.error(error)
      t.equal(config.runner, 'selenium')
      t.equal(config.webdriver.desiredCapabilities.browserName, 'phantomjs')
      t.end()
    })
  })

  group.test('invalid runner', (t) => {
    const getConfig = proxyquire('../../lib/config/get', {
      './get-env': simple.stub().returnWith(envStub)
    })

    getConfig({
      runner: 'invalid'
    }, (error) => {
      t.equal(error.message, 'options.runner must be "selenium" or "saucelabs", but it is "invalid"')
      t.end()
    })
  })

  group.end()
})
