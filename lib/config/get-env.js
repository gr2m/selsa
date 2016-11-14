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
    timeout: process.env.CLIENT_TIMEOUT ? parseInt(process.env.CLIENT_TIMEOUT, 10) : undefined,

    webdriver: client.webdriver,

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
        connectRetries: process.env.SAUCELABS_CONNECT_RETRIES ? parseInt(process.env.SAUCELABS_CONNECT_RETRIES, 10) : undefined,
        connectRetryTimeout: process.env.SAUCELABS_CONNECT_RETRY_TIMEOUT ? parseInt(process.env.SAUCELABS_CONNECT_RETRY_TIMEOUT, 10) : undefined,
        tunnelIdentifier: tunnelIdentifier
      },

      webdriver: {
        user: process.env.SAUCELABS_USERNAME,
        key: process.env.SAUCELABS_ACCESS_KEY,
        build: tunnelIdentifier,
        desiredCapabilities: {
          'tunnel-identifier': tunnelIdentifier,
          'idle-timeout': process.env.SAUCELABS_IDLE_TIMEOUT ? parseInt(process.env.SAUCELABS_IDLE_TIMEOUT, 10) : undefined,
          'max-duration': process.env.SAUCELABS_MAX_DURATION ? parseInt(process.env.SAUCELABS_MAX_DURATION, 10) : undefined,
          'command-timeout': process.env.SAUCELABS_COMMAND_TIMEOUT ? parseInt(process.env.SAUCELABS_COMMAND_TIMEOUT, 10) : undefined
        }
      }
    }
  }
}
