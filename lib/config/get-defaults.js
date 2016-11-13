module.exports = getDefaults

function getDefaults () {
  const saucelabsConnectRetryTimeout = Math.floor(Math.random() * 55000 + 5000)

  return {
    runner: 'selenium',

    // used to set browser timeouts when run against selenium
    // http://webdriver.io/api/protocol/timeouts.html
    timeout: 180000,

    // http://webdriver.io
    webdriver: {
      // https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities
      desiredCapabilities: {
        browserName: 'chrome',
        version: undefined, // defaults to latest
        platform: undefined // defaults to current or lets saucelabs decide
      }
    },

    selenium: {
      // custom selsa config, used to check if selenium is already running
      hub: 'http://localhost:4444/wd/hub/status',

      // https://github.com/vvo/selenium-standalone
      standalone: {
        // see defaults at https://github.com/vvo/selenium-standalone/blob/master/lib/default-config.js
      },

      // will be merged into webdriver if run against local selenium
      webdriver: {}
    },

    saucelabs: {
      connect: {
        // https://www.npmjs.com/package/sauce-connect-launcher#advanced-usage
        username: '',
        accessKey: '',
        tunnelIdentifier: '',
        connectRetries: 10,
        connectRetryTimeout: saucelabsConnectRetryTimeout // random retry timeout between 5 & 60s
      },

      // will be merged into webdriver if run against saucelabs
      webdriver: {
        user: undefined, // set to saucelabs.connect.username
        key: undefined, // set to saucelabs.connect.accessKey
        host: 'ondemand.saucelabs.com',
        port: 80,

        desiredCapabilities: {
          name: undefined, // shown on saucelabs jobs -> browser
          'tunnel-identifier': undefined, // required to be same as saucelabs.connect.tunnelIdentifier
          'build': undefined, // shown on saucelabs jobs
          'idle-timeout': 599,
          'max-duration': 60 * 45,
          'command-timeout': 599
        }
      }
    }
  }
}
