# selsa

> Selenium, Saucelabs, Webdriver and lots of despair

[![Build Status](https://travis-ci.org/gr2m/selsa.svg?branch=master)](https://travis-ci.org/gr2m/selsa)
[![Coverage Status](https://coveralls.io/repos/gr2m/selsa/badge.svg?branch=master)](https://coveralls.io/github/gr2m/selsa?branch=master)
[![Dependency Status](https://david-dm.org/gr2m/selsa.svg)](https://david-dm.org/gr2m/selsa)
[![devDependency Status](https://david-dm.org/gr2m/selsa/dev-status.svg)](https://david-dm.org/gr2m/selsa#info=devDependencies)

`selsa` lets you run tests agains a local selenium or against Sauce Labs both locally or during your CI.

The objective of `selsa` is to do as little as possible. It provides
extensive debug logs and expose its underlying modules

- [selenium-standalone](https://www.npmjs.com/package/selenium-standalone),
- [sauce-connect-launcher](https://www.npmjs.com/package/sauce-connect-launcher)
- [selenium-sauce](https://www.npmjs.com/package/selenium-sauce)
- [webdriverio](https://www.npmjs.com/package/webdriverio)

Many projects aim for the best possible developer experience by hiding as much
of the underlying complexity as possible, and by combining it with test runners
and dev servers. But not `selsa`. It puts debug-ability first.

## Install

```
npm install --save selsa
```

## Usage

This example uses [tap](http://www.node-tap.org/), but `selsa` can be used
with any test framework

```js
const selsa = require('selsa')
const test = require('tap').test

const selsaOptions = {
  client: 'saucelabs:chrome'
}

test('Landing page', (t) => {
  selsa(selsaOptions, (error, api) => {
    t.tearDown(api.tearDown)

    api.browser
      .url('http://localhost:8000')
      .getTitle()
        .then((title) => {
          t.equals(title, 'My demo page')
          t.end()
        }))
  })
})
```

### Testing on Travis

`selsa` plays nicely with [Travis](http://travis-ci.org/). If you want to test
using selenium, make sure to only test in Firefox as it's the only supported
browser, and add the following lines:

```
before_install:
  - export DISPLAY=:99.0
  - sh -e /etc/init.d/xvfb start
```

You can also install a more recent firefox version. I recommend v47.0.2, as I
could not get 48 to work and 49 later only works with the latest gecko drive
and Selenium 3, which requires Java 8, and that is not available on Travis
by default. You will also need to set `SELENIUM_VERSION` to `2.53.1` on Travis
unless you have Java 8 available.

```
addons:
  firefox: "47.0.2"
```

I would also recommend to cache the saucelabs binaries for faster build

```
cache:
  directories:
  - node_modules/selenium-standalone/.selenium
```

Set `SAUCELABS_USERNAME` & `SAUCELABS_ACCESS_KEY` as env variables, and test
as many different browser configurations using the `env.matrix` setting, e.g.

```
env:
  matrix:
  - CLIENT=selenium:firefox SELENIUM_VERSION=2.53.1
  - CLIENT=saucelabs:chrome
  - CLIENT="saucelabs:internet explorer:10:Windows 8"
  - CLIENT="saucelabs:iphone:8.4:OS X 10.11"
```

## Options

```js
selsa(selsaOptions, (error, api) => {})
```

`selsa` can be configured by passing `selsaOptions` as shown above or by using
ENV variables, listed below the option name.

<table>
  <thead>
    <tr>
      <th>Setting (ENV)</th>
      <th>Default / Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <strong>client</strong><br>
        (<code>CLIENT</code>)<br><br>
        (saucelabs|selenium):browserName:browserVerion:platform,
        e.g. 'saucelabs:internet explorer:10:win10'
      </td>
      <td><code>'selenium:chrome'</code></td>
    </tr>
    <tr>
      <td>
        <strong>timeout</strong><br>
        (<code>CLIENT_TIMEOUT</code>)<br><br>
        <a href="http://webdriver.io/api/protocol/timeouts.html">webdriver timouts</a>
      </td>
      <td><code>180000</code></td>
    </tr>
    <tr>
      <td>
        <strong>selenium.hub</strong><br>
        (<code>SELENIUM_HUB</code>)<br><br>
        Url to selenium hub
      </td>
      <td><code>'http://localhost:4444/wd/hub/status'</code></td>
    </tr>
    <tr>
      <td>
        <strong>selenium.standalone.version</strong><br>
        (<code>SELENIUM_VERSION</code>)<br><br>
        Selenium version to install
      </td>
      <td>see <a href="https://github.com/vvo/selenium-standalone/blob/master/lib/default-config.js">selenium-standalone defaults</a></td>
    </tr>
    <tr>
      <td>
        <strong>saucelabs.connect.username</strong><br>
        (<code>SAUCELABS_USERNAME</code>)<br><br>
        Saucelabs username for authentication
      </td>
      <td>e.g. <code>'pat'</code></td>
    </tr>
    <tr>
      <td>
        <strong>saucelabs.connect.accessKey</strong><br>
        (<code>SAUCELABS_ACCESS_KEY</code>)<br><br>
        Saucelabs access key for authentication
      </td>
      <td>e.g. <code>'abcd5678-1234-1234-1234-abcd5678abcd'</code></td>
    </tr>
    <tr>
      <td>
        <strong>saucelabs.connect.retries</strong><br>
        (<code>SAUCELABS_CONNECT_RETRIES</code>)<br><br>
        Amount of retries if case of connection error (excl. auth error)
      </td>
      <td><code>10</code></td>
    </tr>
    <tr>
      <td>
        <strong>saucelabs.connect.retryTimeout</strong><br>
        (<code>SAUCELABS_CONNECT_RETRY_TIMEOUT</code>)<br><br>
        Timeout between connection retries in ms
      </td>
      <td>Random between <code>5000</code> and <code>60000</code></td>
    </tr>
    <tr>
      <td>
        <strong>saucelabs.webdriver.desiredCapabilities.idle-timeout</strong><br>
        (<code>SAUCELABS_IDLE_TIMEOUT</code>)<br><br>
        <a href="https://docs.saucelabs.com/reference/test-configuration/#idle-test-timeout">SauceLabs Idle Test Timeout</a>
      </td>
      <td><code>90</code>, allowed maximum is <code>1000</code></td>
    </tr>
    <tr>
      <td>
        <strong>saucelabs.webdriver.desiredCapabilities.max-duration</strong><br>
        (<code>SAUCELABS_MAX_DURATION</code>)<br><br>
        <a href="https://docs.saucelabs.com/reference/test-configuration/#maximum-test-duration">SauceLabs Maximum Test Duration</a>
      </td>
      <td><code>1800</code>, allowed maximum is <code>10800</code></td>
    </tr>
    <tr>
      <td>
        <strong>saucelabs.webdriver.desiredCapabilities.max-duration</strong><br>
        (<code>SAUCELABS_COMMAND_TIMEOUT</code>)<br><br>
        <a href="https://docs.saucelabs.com/reference/test-configuration/#command-timeout">SauceLabs Command Timeout</a>
      </td>
      <td><code>300</code>, allowed maximum is <code>600</code></td>
    </tr>
  </tbody>
</table>

## Learnings

### Timeouts

When running your tests agains Sauce Labs, make sure to give enough timeouts.
Connecting and spawning from Travis often time takes over 30s.

### Unreliable builds

No matter how much we try, Selenium tests and random timeouts and other errors
seem to occur very often. If you tried everything else to make your tests 100%
reliable on travis, try [travis-retry](https://docs.travis-ci.com/user/common-build-problems/#Timeouts-installing-dependencies)

## Credits

The abstraction of Selenium vs Sauce Labs is partly inspired by [selenium-sauce](https://github.com/alexbrombal/selenium-sauce)

## License

Apache License
