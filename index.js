module.exports = selsa

const async = require('async')
const debug = require('debug')
const webdriverio = require('webdriverio')

const getConfig = require('./lib/config/get')
const sauceConnectLauncher = require('./lib/saucelabs/connect')
const seleniumCheck = require('./lib/selenium/check')
const seleniumInstall = require('./lib/selenium/install')
const seleniumStart = require('./lib/selenium/start')
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

    async.waterfall(tasks, (error) => {
      if (error) {
        return callback(error)
      }

      console.log(`\nconfig.webdriver ==============================`)
      console.log(config.webdriver)

      state.browser = webdriverio.remote(config.webdriver)

      state.browser.on('command', function (command) {
        state.debugBrowser('%s %s', command.method, command.uri.path)

        if (command.data.script) {
          command.data.script = getScriptName(command.data.script)
        }
        state.debugBrowser(command.data)
      })
      state.browser.on('erorr', function (error) {
        state.debugBrowser('ERROR: %s %s', error.body.value.class, error.body.value.message)
      })

      state.debugBrowser('starting')
      state.browser
        .init()

        .then((session) => {
          state.sessionId = session.sessionId

          if (config.runner === 'selenium') {
            // http://webdriver.io/api/protocol/timeouts.html
            // setting these timeouts does not work with saucelabs, the browser
            // just hangs, I could not find out why ~@gr2m Nov 13, 2016
            return state.browser
              .timeouts('script', config.timeout)
              .timeouts('implicit', config.timeout)
              .timeouts('page load', config.timeout)
          }
        })

        .then(function () {
          state.debugBrowser('started')
          callback(null, {
            selenium: state.selenium,
            browser: state.browser,
            tearDown: tearDown.bind(null, state)
          })
        })

        .catch((error) => {
          state.debugBrowser(`error: ${error}`)
          tearDown(state, callback)
        })
    })
  })
}

function getScriptName (script) {
  var matches = script.match(/return \(function (\w+)/)
  return matches ? matches[1] : '[function]'
}
