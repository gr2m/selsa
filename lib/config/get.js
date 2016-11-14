module.exports = getConfig

const defaultsDeep = require('lodash').defaultsDeep
const validate = require('joi').validate

const getDefaults = require('./get-defaults')
const getEnv = require('./get-env')
const parseOptions = require('./parse-options')
const schema = require('./schemas')

function getConfig (options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  const config = defaultsDeep(parseOptions(options), getEnv(), getDefaults())

  if (config.runner !== 'selenium' && config.runner !== 'saucelabs') {
    return callback(new Error(`options.runner must be "selenium" or "saucelabs", but it is "${config.runner}"`))
  }

  // amend webdriver config based on runner
  defaultsDeep(config.webdriver, config[config.runner].webdriver)
  if (config.runner === 'saucelabs') {
    config.webdriver.desiredCapabilities.name += ` - ${config.saucelabs.connect.tunnelIdentifier}`
  }

  validate(config, schema[config.runner], (error) => {
    callback(error, config)
  })
}
