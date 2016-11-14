module.exports = initBrowser

const webdriverio = require('webdriverio')

function initBrowser (state, callback) {
  state.browser = webdriverio.remote(state.config.webdriver)

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

      if (state.config.runner === 'selenium') {
        // http://webdriver.io/api/protocol/timeouts.html
        // setting these timeouts does not work with saucelabs, the browser
        // just hangs, I could not find out why ~@gr2m Nov 13, 2016
        return state.browser
          .timeouts('script', state.config.timeout)
          .timeouts('implicit', state.config.timeout)
          .timeouts('page load', state.config.timeout)
      }
    })

    .then(function () {
      state.debugBrowser('started')
      callback()
    })

    .catch((error) => {
      state.debugBrowser(`error: ${error}`)
      callback(error)
    })
}

function getScriptName (script) {
  var matches = script.match(/return \(function (\w+)/)
  return matches ? matches[1] : '[function]'
}
