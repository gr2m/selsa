module.exports = initBrowser

const webdriverio = require('webdriverio')

function initBrowser (state, callback) {
  state.browser = webdriverio.remote(state.config.webdriver)

  state.browser.on('command', function (command) {
    state.debugBrowser('%s %s', command.method, command.uri.path)

    // use named callback function for .execute /executeAsync for simpler
    // debugging, e.g.
    //     {script: 'return (function yolo() {}).apply(null, arguments)', args: []}
    // becomes
    //     { script: 'yolo', args: []}
    if (command.data.script) {
      return state.debugBrowser({
        script: getScriptName(command.data.script),
        args: command.data.args
      })
    }

    state.debugBrowser(command.data)
  })
  state.browser.on('error', function (error) {
    state.debugBrowser('ERROR: %s %s', error.body.value.class, error.body.value.message)
  })

  state.debugBrowser('starting')
  state.browser
    .init()

    .then((session) => {
      state.sessionId = session.sessionId

      // http://webdriver.io/api/protocol/timeouts.html
      return state.browser
        .timeouts('script', state.config.timeout)
        .timeouts('implicit', state.config.timeout)
        .timeouts('page load', state.config.timeout)
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
