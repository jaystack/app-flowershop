import System from 'corpjs-system'
import Config, { loaders, processors } from 'corpjs-config'
import Endpoints from 'corpjs-endpoints'
import Logger from 'corpjs-logger'
import { App, Server } from 'corpjs-express'
import CxConfig from './cxConfig'
import Router from './router'
const { name } = require('../../package.json')

export default new System({ name })
  .add('config', new Config()
    .add(config => loaders.require({ path: './config/default.js', mandatory: true }))
    .add(config => loaders.require({ path: './config/dev.js', mandatory: false }))
    .add(config => loaders.require({ path: './config/stage.js', mandatory: false }))
    .add(config => loaders.require({ path: './config/live.js', mandatory: false })))
  .add('endpoints', Endpoints()).dependsOn({ component: 'config', source: 'endpoints', as: 'config' })
  .add('cxSubSystem', CxConfig()).dependsOn('endpoints', { component: 'config', source: 'cx', as: 'config' })
  .add('logger', Logger()).dependsOn({ component: 'config', source: 'logger', as: 'config' })
  .add('app', App())
  .add('router', Router()).dependsOn('endpoints', 'app', 'cxSubSystem', 'logger')
  .add('server', Server()).dependsOn('endpoints', 'app', 'router', { component: 'config', source: 'server', as: 'config' })
  .logAllEvents()