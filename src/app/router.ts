import morganLogger = require('morgan')
import cookieParser = require('cookie-parser')
import { static as expressStatic } from 'express'
import path = require('path')
import cx = require('compoxure')

export default function Router() {
  return {
    async start({app, cxSubSystem, logger}) {
      app.use(morganLogger('dev'))
      app.use(cookieParser())
      app.use(expressStatic(path.join('./public')));

      const pageComposer = cx(cxSubSystem.cx)
      app.use(pageComposer)
    }
  }
}