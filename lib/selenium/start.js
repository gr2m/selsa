module.exports = startSelenium

const selenium = require('selenium-standalone')

function startSelenium (state, callback) {
  if (state.seleniumAlreadyRunning) {
    return callback()
  }

  state.debugSelenium('starting Selenium')

  selenium.start({
    // https://github.com/vvo/selenium-standalone#seleniumstartopts-cb
    // spawnOptions: {
    //   stdio: 'inherit'
    // }
  }, (error, childProcess) => {
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
