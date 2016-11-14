module.exports = selsa

const async = require('async')
const debug = require('debug')

const getConfig = require('./lib/config/get')
const sauceConnectLauncher = require('./lib/saucelabs/connect')
const seleniumCheck = require('./lib/selenium/check')
const seleniumInstall = require('./lib/selenium/install')
const seleniumStart = require('./lib/selenium/start')
const initBrowser = require('./lib/webdriver/init-browser')
const tearDown = require('./lib/tear-down')

function selsa (options, callback) {
  let state = {
    debug: debug('selsa'),
    debugSelenium: debug('selsa:selenium'),
    debugSaucelabs: debug('selsa:saucelabs'),
    debugBrowser: debug('selsa:browser')
  }

  getConfig(state, options, (error, config) => {
    if (error) {
      return callback(error)
    }

    state.config = config

    let tasks = []
    state.debug('runner: %s', config.runner)
    state.debug('browser: %j', config.webdriver)

    if (config.runner === 'selenium') {
      tasks = tasks.concat([
        seleniumCheck.bind(null, state),
        seleniumInstall.bind(null, state),
        seleniumStart.bind(null, state)
      ])
    } else {
      tasks = tasks.concat([
        sauceConnectLauncher.bind(null, state)
      ])
    }

    tasks = tasks.concat([initBrowser.bind(null, state)])

    async.waterfall(tasks, (error) => {
      if (error) {
        return tearDown(state, () => {
          callback(error)
        })
      }

      callback(null, {
        selenium: state.selenium,
        browser: state.browser,
        tearDown: tearDown.bind(null, state)
      })
    })
  })
}
