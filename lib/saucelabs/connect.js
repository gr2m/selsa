module.exports = saucelabsConnect

var sauceConnectLauncher = require('sauce-connect-launcher')
var SauceLabs = require('saucelabs')

function saucelabsConnect (state, callback) {
  state.debugSaucelabs('Connecting')

  const connectOptions = state.config.saucelabs.connect
  connectOptions.logger = state.debugSaucelabs

  sauceConnectLauncher(connectOptions, function (error, sauceConnect) {
    if (error) {
      state.debugSaucelabs('Failed to connect')
      return callback(error)
    }

    const sauceLabs = new SauceLabs({
      username: connectOptions.username,
      password: connectOptions.accessKey
    })

    state.sauceConnect = sauceConnect
    state.sauceConnect.updateJob = sauceLabs.updateJob.bind(sauceLabs)
    state.debugSaucelabs(`Connected to Sauce Labs (PID: ${sauceConnect.pid})`)
    return callback()
  })
}
