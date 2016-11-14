const lolex = require('lolex')
const proxyquire = require('proxyquire')
const simple = require('simple-mock')
const test = require('tap').test

const getEnvConfig = proxyquire('../../lib/config/get-env', {
  username: {
    sync () { return 'username' }
  }
})

test('ENV config', (group) => {
  group.test('CLIENT', (t) => {
    simple.mock(process.env, 'CLIENT', 'runner:browser:version:os')
    const config = getEnvConfig()
    simple.restore()

    t.equal(config.runner, 'runner', 'sets config.runner')
    t.equal(config.webdriver.desiredCapabilities.browserName, 'browser', 'sets config.webdriver.desiredCapabilities.browserName')
    t.equal(config.webdriver.desiredCapabilities.version, 'version', 'sets config.webdriver.desiredCapabilities.version')
    t.equal(config.webdriver.desiredCapabilities.platform, 'os', 'sets config.webdriver.desiredCapabilities.platform')
    t.end()
  })

  group.test('TRAVIS_JOB_NUMBER', (t) => {
    var clock = lolex.install(45678, ['Date'])
    simple.mock(process.env, 'TRAVIS_JOB_NUMBER', '123')
    const config = getEnvConfig()
    clock.uninstall()
    simple.restore()

    t.equal(config.saucelabs.connect.tunnelIdentifier, 'travis-123-45678', 'sets config.saucelabs.connect.tunnelIdentifier')
    t.equal(config.saucelabs.webdriver.build, 'travis-123-45678', 'sets config.saucelabs.webdriver.build')
    t.equal(config.saucelabs.webdriver.desiredCapabilities['tunnel-identifier'], 'travis-123-45678', 'sets config.saucelabs.webdriver.desiredCapabilities')
    t.end()
  })

  group.test('no TRAVIS_JOB_NUMBER', (t) => {
    var clock = lolex.install(45678, ['Date'])
    simple.mock(process.env, 'TRAVIS_JOB_NUMBER', '')
    const config = getEnvConfig()
    clock.uninstall()
    simple.restore()

    t.equal(config.saucelabs.connect.tunnelIdentifier, 'local-username-45678', 'sets config.saucelabs.connect.tunnelIdentifier')
    t.equal(config.saucelabs.webdriver.build, 'local-username-45678', 'sets config.saucelabs.webdriver.build')
    t.equal(config.saucelabs.webdriver.desiredCapabilities['tunnel-identifier'], 'local-username-45678', 'sets config.saucelabs.webdriver.desiredCapabilities')
    t.end()
  })

  group.test('CLIENT_TIMEOUT', (t) => {
    simple.mock(process.env, 'CLIENT_TIMEOUT', '4213')
    const config = getEnvConfig()
    simple.restore()

    t.equal(config.timeout, 4213, 'sets config.timeout')
    t.end()
  })

  group.test('SELENIUM_HUB', (t) => {
    simple.mock(process.env, 'SELENIUM_HUB', 'http://example.com:1234')
    const config = getEnvConfig()
    simple.restore()

    t.equal(config.selenium.hub, 'http://example.com:1234', 'sets config.selenium.hub')
    t.end()
  })

  group.test('SELENIUM_VERSION', (t) => {
    simple.mock(process.env, 'SELENIUM_VERSION', '1.2.3')
    const config = getEnvConfig()
    simple.restore()

    t.equal(config.selenium.standalone.version, '1.2.3', 'sets config.selenium.standalone.version')
    t.end()
  })

  group.test('SAUCELABS_USERNAME', (t) => {
    simple.mock(process.env, 'SAUCELABS_USERNAME', 'sauceuser')
    const config = getEnvConfig()
    simple.restore()

    t.equal(config.saucelabs.connect.username, 'sauceuser', 'sets config.saucelabs.connect.username')
    t.equal(config.saucelabs.webdriver.user, 'sauceuser', 'sets config.saucelabs.webdriver.user')
    t.end()
  })

  group.test('SAUCELABS_ACCESS_KEY', (t) => {
    simple.mock(process.env, 'SAUCELABS_ACCESS_KEY', 'saucesecret')
    const config = getEnvConfig()
    simple.restore()

    t.equal(config.saucelabs.connect.accessKey, 'saucesecret', 'sets config.saucelabs.connect.accessKey')
    t.equal(config.saucelabs.webdriver.key, 'saucesecret', 'sets config.saucelabs.webdriver.key')
    t.end()
  })

  group.test('SAUCELABS_CONNECT_RETRIES', (t) => {
    simple.mock(process.env, 'SAUCELABS_CONNECT_RETRIES', '123')
    const config = getEnvConfig()
    simple.restore()

    t.equal(config.saucelabs.connect.connectRetries, 123, 'sets config.saucelabs.connect.connectRetries')
    t.end()
  })

  group.test('SAUCELABS_CONNECT_RETRY_TIMEOUT', (t) => {
    simple.mock(process.env, 'SAUCELABS_CONNECT_RETRY_TIMEOUT', '5000')
    const config = getEnvConfig()
    simple.restore()

    t.equal(config.saucelabs.connect.connectRetryTimeout, 5000, 'sets config.saucelabs.connect.connectRetryTimeout')
    t.end()
  })

  group.test('SAUCELABS_IDLE_TIMEOUT', (t) => {
    simple.mock(process.env, 'SAUCELABS_IDLE_TIMEOUT', '123')
    const config = getEnvConfig()
    simple.restore()

    t.equal(config.saucelabs.webdriver.desiredCapabilities['idle-timeout'], 123, 'sets config.saucelabs.webdriver.desiredCapabilities["idle-timeout"]')
    t.end()
  })
  group.test('SAUCELABS_MAX_DURATION', (t) => {
    simple.mock(process.env, 'SAUCELABS_MAX_DURATION', '123')
    const config = getEnvConfig()
    simple.restore()

    t.equal(config.saucelabs.webdriver.desiredCapabilities['max-duration'], 123, 'sets config.saucelabs.webdriver.desiredCapabilities["max-duration"]')
    t.end()
  })
  group.test('SAUCELABS_COMMAND_TIMEOUT', (t) => {
    simple.mock(process.env, 'SAUCELABS_COMMAND_TIMEOUT', '123')
    const config = getEnvConfig()
    simple.restore()

    t.equal(config.saucelabs.webdriver.desiredCapabilities['command-timeout'], 123, 'sets config.saucelabs.webdriver.desiredCapabilities["command-timeout"]')
    t.end()
  })

  group.end()
})
