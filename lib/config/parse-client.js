module.exports = parseClient

function parseClient (string) {
  const parts = (string || '').split(':')
  const runner = parts[0] || 'selenium'
  const browser = {
    desiredCapabilities: {
      name: parts[1] || 'chrome',
      browserName: parts[1] || 'chrome',
      version: parts[2], // defaults to latest
      platform: parts[3]
    }
  }

  return {runner, browser}
}
