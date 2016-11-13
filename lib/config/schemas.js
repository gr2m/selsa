var Joi = require('joi')

module.exports = {
  selenium: Joi.object().keys({
    runner: Joi.any().allow(['selenium']),
    timeout: Joi.number().integer().min(1000).required(),

    saucelabs: Joi.object().keys({}).unknown(),
    selenium: Joi.object().keys({
      hub: Joi.string().required(),
      standalone: Joi.object().keys({}).unknown(),
      webdriver: Joi.object().keys({}).unknown()
    }).required(),

    webdriver: Joi.object().keys({
      desiredCapabilities: Joi.object().keys({
        browserName: Joi.string().required(),
        name: Joi.string(),
        version: Joi.string(),
        platform: Joi.string(),
        'idle-timeout': Joi.number().integer().min(0),
        'max-duration': Joi.number().integer().min(0),
        'command-timeout': Joi.number().integer().min(0)
      }).required()
    })
  }),

  saucelabs: Joi.object().keys({
    runner: Joi.any().allow(['saucelabs']),
    timeout: Joi.number().integer().min(1000).required(),

    selenium: Joi.object().keys({}).unknown(),
    saucelabs: Joi.object().keys({
      connect: Joi.object().keys({
        username: Joi.string().required(),
        accessKey: Joi.string().required(),
        tunnelIdentifier: Joi.string().required(),
        connectRetries: Joi.number().integer().min(1).required(),
        connectRetryTimeout: Joi.number().integer().min(0).required()
      }).unknown(),
      webdriver: Joi.object().keys({}).unknown()
    }).required(),

    webdriver: Joi.object().keys({
      host: Joi.string().required(),
      port: Joi.number().integer().required(),
      user: Joi.string().required(),
      key: Joi.string().required(),
      build: Joi.any().required(),
      desiredCapabilities: Joi.object().keys({
        'tunnel-identifier': Joi.string().required(),
        name: Joi.string().required(),
        browserName: Joi.string().required(),
        version: Joi.string(),
        platform: Joi.string(),
        'idle-timeout': Joi.number().integer(),
        'max-duration': Joi.number().integer(),
        'command-timeout': Joi.number().integer()
      }).unknown().required()
    }).unknown()
  })
}
