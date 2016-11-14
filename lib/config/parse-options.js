module.exports = parseOptions

const _ = require('lodash')
const parseClient = require('./parse-client')

function parseOptions (options) {
  if (!options) {
    options = {}
  }

  // turn 'saucelabs:chrome' into
  // {runner: 'saucelabs', webdriver: {desiredCapabilities: {browserName: 'chrome'}}}
  const clientOptions = parseClient(options.client)
  delete options.client
  _.defaultsDeep(options, clientOptions)

  // move saucelabs.username & saucelabs.username int
  // saucelabs.connect.{username|accessKey} and
  // saucelabs.webdriver.{user|key}
  if (options.saucelabs) {
    const username = options.saucelabs.username
    const accessKey = options.saucelabs.accessKey
    delete options.saucelabs.username
    delete options.saucelabs.accessKey
    _.defaultsDeep(options, {
      saucelabs: {
        connect: {
          username: username,
          accessKey: accessKey
        }
      },
      webdriver: {
        user: username,
        key: accessKey
      }
    })
  }

  return options
}
