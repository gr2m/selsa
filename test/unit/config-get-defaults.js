const simple = require('simple-mock')
const test = require('tap').test

const getConfigDefaults = require('../../lib/config/get-defaults')

// changing defaults is a breaking change.
// This test makes sure we don’t change it accidentally
test('config', (t) => {
  simple.mock(Math, 'random').returnWith(0.5)
  const config = getConfigDefaults()
  simple.restore()

  const defaults = {
    runner: 'selenium',
    timeout: 180000,
    webdriver: {

      desiredCapabilities: {
        browserName: 'chrome',
        version: undefined,
        platform: undefined
      }
    },
    selenium: {
      hub: 'http://localhost:4444/wd/hub/status',
      standalone: {

      },
      webdriver: {}
    },
    saucelabs: {
      connect: {

        username: '',
        accessKey: '',
        tunnelIdentifier: '',
        connectRetries: 10,
        connectRetryTimeout: 32500 // 0.5 * 55000 + 5000
      },
      webdriver: {
        user: undefined,
        key: undefined,
        host: 'ondemand.saucelabs.com',
        port: 80,

        desiredCapabilities: {
          name: undefined,
          'tunnel-identifier': undefined,
          'build': undefined,
          'idle-timeout': 599,
          'max-duration': 60 * 45,
          'command-timeout': 599
        }
      }
    }
  }
  t.deepEqual(config, defaults)
  t.end()
})
