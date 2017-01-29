module.exports = startSelenium

const merge = require('lodash').merge
const selenium = require('selenium-standalone')

function startSelenium (state, callback) {
  if (state.seleniumAlreadyRunning) {
    return callback()
  }

  state.debugSelenium('starting Selenium')

  const options = merge(state.config.selenium.standalone, {})

  selenium.start(options, (error, childProcess) => {
    if (error) {
      state.debugSelenium(`Could not start selenium: ${error}`)
      return callback(error)
    }

    childProcess.stderr.on('data', (data) => {
      state.debugSelenium(data.toString().trim())
    })
    childProcess.stdout.on('data', (data) => {
      state.debugSelenium(data.toString().trim())
    })

    state.debugSelenium('Selenium started')
    state.selenium = childProcess
    callback()
  })
}
