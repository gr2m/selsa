module.exports = installSelenium

const selenium = require('selenium-standalone')

function installSelenium (state, callback) {
  if (state.seleniumAlreadyRunning) {
    return callback()
  }

  state.debugSelenium('Installing selenium')

  selenium.install({
    // https://github.com/vvo/selenium-standalone#seleniuminstallopts-cb
    // progressCb: (totalLength, progressLength) => {
    //   console.log(progressLength, '/', totalLength)
    // }
    logger: (message) => {
      // ignore empty messages or messages containing - only
      if (/^[-]+$/.test(message.trim())) {
        return
      }
      state.debugSelenium(message)
    }
  }, (error) => {
    if (error) {
      if (error.message.indexOf('getaddrinfo')) {
        // most likely there is no internet connectivity, so we try to just run
        // tests as it might have been installed before
        state.debugSelenium('CONNECTION ERROR: could not install/update selenium. Will try to run tests either way')
        return callback()
      }
      state.debugSelenium('Could not install selenium: ' + error.message)
      return callback(error)
    }

    state.debugSelenium('Selenium installed')
    callback()
  })
}
