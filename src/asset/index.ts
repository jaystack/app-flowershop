import System from 'corpjs-system'
import Config, { loaders, processors } from 'corpjs-config'
import Endpoints from 'corpjs-endpoints'
import Logger from 'corpjs-logger'
import { App, Server } from 'corpjs-express'
import CxConfig from './cxConfig'
import Router from './router'
const {name} = require('../../package.json')

const inProductionEnv = process.env.NODE_ENV === 'production'
process.on('unhandledRejection', err => console.error(err))

const cxSubSys = new System({ exitOnError: inProductionEnv })
cxSubSys
  .add('cxSubSys', CxConfig())
  .on('start', () => console.log('Started cxSubSys'))

const sys = new System({ exitOnError: inProductionEnv })
export function stopSystem() { sys.stop() }
export function restartSystem() { sys.restart() }
export default sys
  .add('config', new Config()
    .add(config => loaders.require({ path: './config/default.js', mandatory: true }))
    .add(config => loaders.require({ path: './config/dev.js', mandatory: false }))
    .add(config => loaders.require({ path: './config/stage.js', mandatory: false }))
    .add(config => loaders.require({ path: '../config/live.js', mandatory: false })))
  .add('endpoints', Endpoints()).dependsOn({ component: 'config', source: 'endpoints', as: 'config' })
  .add('cxSubSystem', CxConfig()).dependsOn('endpoints', { component: 'config', source: 'cx', as: 'config' })
  .add('logger', Logger()).dependsOn({ component: 'config', source: 'logger', as: 'config' })
  .add('app', App())
  .add('router', Router()).dependsOn('endpoints', 'app', 'cxSubSystem', 'logger')
  .add('server', Server('appServer')).dependsOn('endpoints', 'app', 'router')
  .on('componentStart', (componentName: string) => console.log(`Started component: ${componentName}`))
  .on('componentStop', (componentName: string) => console.log(`Stopped component: ${componentName}`))
  .on('start', () => console.log(`Started service: ${name}`))
  .on('stop', err => console.log(`Stopped service: ${name}`, err || ''))
  .start()