module.exports = getEnv

const getUsername = require('username')

const parseClient = require('./parse-client')

function getEnv () {
  const client = parseClient(process.env.CLIENT)

  // if run on travis, use the build number as identifier for saucelabs,
  // otherwise use the current user’s username
  const tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER
    ? `travis-${process.env.TRAVIS_JOB_NUMBER}-${Date.now()}`
    : `local-${getUsername.sync()}-${Date.now()}`

  return {
    runner: client.runner,
    timeout: process.env.CLIENT_TIMEOUT,

    webdriver: client.browser,

    selenium: {
      hub: process.env.SELENIUM_HUB,
      standalone: {
        version: process.env.SELENIUM_VERSION
      }
    },

    saucelabs: {
      connect: {
        username: process.env.SAUCELABS_USERNAME,
        accessKey: process.env.SAUCELABS_ACCESS_KEY,
        connectRetries: process.env.SAUCELABS_CONNECT_RETRIES,
        connectRetryTimeout: process.env.SAUCELABS_CONNECT_RETRY_TIMEOUT,
        tunnelIdentifier: tunnelIdentifier
      },

      webdriver: {
        user: process.env.SAUCELABS_USERNAME,
        key: process.env.SAUCELABS_ACCESS_KEY,
        build: tunnelIdentifier,
        desiredCapabilities: {
          'tunnel-identifier': tunnelIdentifier,
          'idle-timeout': process.env.SAUCELABS_IDLE_TIMEOUT,
          'max-duration': process.env.SAUCELABS_MAX_DURATION,
          'command-timeout': process.env.SAUCELABS_COMMAND_TIMEOUT
        }
      }
    }
  }
}
