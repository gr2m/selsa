module.exports = parseClient

function parseClient (string) {
  const parts = (string || '').split(':')
  const runner = parts[0] || 'selenium'
  const webdriver = {
    desiredCapabilities: {
      name: parts[1],
      browserName: parts[1],
      version: parts[2], // defaults to latest
      platform: parts[3]
    }
  }

  return {runner, webdriver}
}
