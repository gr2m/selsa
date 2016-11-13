module.exports = checkSelenium

const request = require('request').defaults({json: true})

function checkSelenium (state, callback) {
  const config = state.config.selenium
  state.debugSelenium('checking if selenium already running')
  request.get(config.hub, (error, response, body) => {
    if (error) {
      state.debugSelenium('Selenium not running')
      return callback()
    }

    try {
      state.debugSelenium(`Selenium already running: ${body.value.build.version}`)
      state.debugSelenium('If you did not start it intentionally, it most likely was not ended correctly before.')
      state.debugSelenium('Try "pkill -f selenium-standalone" to force selenium to stop')
      state.seleniumAlreadyRunning = true

      callback()
    } catch (error) {
      state.debugSelenium(`Something went wrong while check if selenium is running at ${config.hub}`)
      callback(error)
    }
  })
}
