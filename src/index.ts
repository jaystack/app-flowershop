import * as cx from 'compoxure'
import * as express from 'express'
import * as config from 'config';
import * as cookieParser from 'cookie-parser'
import * as logger from 'morgan'
import * as path from 'path'
import { getServiceAddress } from 'system-endpoints'

setTimeout(function () {

  let cxConfig = {
    "cdn": {
      "url": `http://${getServiceAddress('localhost:3001')}/`
    },
    "parameters": {
      "servers": {
        "items": `http://${getServiceAddress('localhost:3001')}`,
        "cart": `http://${getServiceAddress('localhost:3000')}`
      },
      "urls": [
        {
          "pattern": "/category/(.+)",
          "names": [
            "categoryId"
          ]
        }
      ]
    },
    "backend": [
      {
        "pattern": "/cart/.*",
        "timeout": 1000,
        "target": `http://${getServiceAddress('localhost:3000')}`,
        "host": "localhost",
        "ttl": "10s",
        "quietFailure": false,
        "dontPassUrl": false,
        "passThrough": true,
        "headers": [
          "fs_cart"
        ]
      },
      {
        "pattern": "^(/|/category/.+|/checkout)$",
        "timeout": 1000,
        "target": `http://${getServiceAddress('localhost:3001')}`,
        "host": "localhost",
        "ttl": "10s",
        "quietFailure": false,
        "dontPassUrl": false
      }
    ],
    "statusCodeHandlers": {
      "302": {
        "fn": "handle302"
      }
    },
    "followRedirect": false,
    functions: {
      'handle302': function (req, res, variables, data, options, err, responseCallback) {
        res.writeHead(302, { location: err.headers.location, 'set-cookie': err.headers['set-cookie'] });
        res.end('');
      },
    }
  }


  console.log(cxConfig)

  let pageComposer = cx(cxConfig)
  let app = express()
  app.use(logger('dev'))
  app.use(cookieParser())
  app.use(express.static(path.join('./public')));
  app.use(pageComposer)

  app.listen(9000, () => {
    console.log('app listen on port 9000')
  })

}, 1000);
export default config