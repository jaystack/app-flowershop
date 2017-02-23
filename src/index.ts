import System from 'corpjs-system'
import Config, { loaders, processors } from 'corpjs-config'
import Endpoints from 'corpjs-endpoints'
import Logger from 'corpjs-logger'
import { App, Server } from 'corpjs-express'
import { static as expressStatic } from 'express'
import cookieParser = require('cookie-parser')
import cx = require('compoxure')
import morganLogger = require('morgan')
import path = require('path')

function Router() {
  return {
    async start({endpoints, app, cxConfig, logger}) {
      const {host, port} = endpoints.getServiceEndpoint('server')
      // TODO: find solution: file transport logging cause error if used
      // logger.error(`${host}:${port}`)
      // logger.warn(`${host}:${port}`)
      app.use(morganLogger('dev'))
      app.use(cookieParser())
      app.use(expressStatic(path.join('./public')));

      const pageComposer = cx(cxConfig.cx)
      app.use(pageComposer)

      app.listen(port, () => {
        logger.verbose(`app listening on ${host}:${port}`)
      })
    }
  }
}

const system = new System({ exitOnError: false })
  .add('config', new Config()
    .add(config => loaders.require({ path: './config/default.js', mandatory: true }))
    .add(config => loaders.require({ path: './config/dev.js', mandatory: false }))
    .add(config => loaders.require({ path: './config/stage.js', mandatory: false }))
    .add(config => loaders.require({ path: '../config/live.js', mandatory: false })))
  .add('endpoints', Endpoints()).dependsOn({ component: 'config', source: 'endpoints', as: 'config' })
  .add('cxConfig', new Config()
    .add(config => loaders.require({ path: './config/cxConfig.js', mandatory: true }))
  ).dependsOn({ component: 'endpoints', source: 'cx', as: 'index' })
  .add('logger', Logger()).dependsOn({ component: 'config', source: 'logger', as: 'loggerConfig' })
  .add('app', App()) //.dependsOn('config')
  .add('router', Router()).dependsOn('endpoints', 'app', 'cxConfig', 'logger')
  .add('server', Server()).dependsOn('endpoints', 'app', 'router')

system.start()
  .then(({logger}) => {
    logger.verbose("System started")
  })
  .catch(err => console.log("System start failed. " + err.toString()))

export default system;