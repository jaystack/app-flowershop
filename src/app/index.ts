import System from 'corpjs-system'
import Config, { loaders, processors } from 'corpjs-config'
import Endpoints from 'corpjs-endpoints'
import Logger from 'corpjs-logger'
import { App, Server } from 'corpjs-express'
import CxConfig from './cxConfig'
import Router from './router'
const {name} = require('../../package.json')

const inDevelopment = process.env.NODE_ENV === 'dev'
process.on('unhandledRejection', err => console.error(err))
console.log(process.env.NODE_ENV)

const sys = new System({ exitOnError: !inDevelopment })
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
  .add('server', Server()).dependsOn('endpoints', 'app', 'router', { component: 'config', source: 'server', as: 'config' })
  .on('componentStart', (componentName: string) => console.log(`Started component: ${componentName}`))
  .on('componentStop', (componentName: string) => console.log(`Stopped component: ${componentName}`))
  .on('start', () => console.log(`Started service: ${name}`))
  .on('stop', err => console.log(`Stopped service: ${name}`, err || ''))
  .start()