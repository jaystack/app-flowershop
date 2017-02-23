const getServiceAddress = require('system-endpoints').getServiceAddress

const config = {
  "cx": {
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
}

module.exports = config