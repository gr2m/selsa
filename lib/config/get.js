module.exports = getConfig

const defaultsDeep = require('lodash').defaultsDeep
const validate = require('joi').validate

const getDefaults = require('./get-defaults')
const getEnv = require('./get-env')
const schema = require('./schemas')

function getConfig (state, options, callback) {
  const config = defaultsDeep(options, getEnv(), getDefaults())

  // amend webdriver config based on runner
  defaultsDeep(config.webdriver, config[config.runner].webdriver)
  if (config.runner === 'saucelabs') {
    config.webdriver.desiredCapabilities.name += ` - ${config.saucelabs.connect.tunnelIdentifier}`
  }

  if (config.runner !== 'selenium' && config.runner !== 'saucelabs') {
    return callback(new Error(`options.runner must be "selenium" or "saucelabs", but it is ${config.runner}`))
  }

  validate(config, schema[config.runner], (error) => {
    callback(error, config)
  })
}
