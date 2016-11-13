module.exports = tearDown

function tearDown (state, success, callback) {
  if (!callback) {
    callback = function () {}
  }

  state.debug('tearing down')
  if (!state.selenium && !state.sauceConnect) {
    return callback()
  }

  if (state.selenium && !state.browser) {
    state.debug('killing selenium')
    state.selenium.kill()
    return callback()
  }

  if (state.sauceConnect && !state.browser) {
    state.debug('closing sauce connect tunnel')
    return state.sauceConnect.close((error) => {
      state.debug('sauce connect tunnel closed')
      callback(error)
    })
  }

  if (state.browser) {
    state.debug('stopping browser')
    state.browser.end()
      .then(() => {
        state.debug('browser stopped')

        if (state.selenium) {
          state.debug('killing selenium')
          state.selenium.kill()
          return callback()
        }

        if (state.sauceConnect) {
          state.debug(`updateing sauce job ${state.sessionId}`)
          state.sauceConnect.updateJob(state.sessionId, {
            passed: success
          }, (error) => {
            if (error) {
              state.debug(`Error: ${error}`)
            }

            state.debug('closing sauce connect tunnel')
            return state.sauceConnect.close((error) => {
              state.debug('sauce connect tunnel closed')
              callback(error)
            })
          })
        }
      })
  }
}
