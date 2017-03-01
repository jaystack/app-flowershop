export default function cxConfig() {
  return {
    async start({ endpoints }) {
      const { getServiceAddress } = endpoints
      return {
        "cx": {
          "cdn": {
            "url": `http://${getServiceAddress('itemsServer')}/`
          },
          "parameters": {
            "servers": {
              "items": `http://${getServiceAddress('itemsServer')}`,
              "cart": `http://${getServiceAddress('cartServer')}`
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
              "target": `http://${getServiceAddress('cartServer')}`,
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
              "target": `http://${getServiceAddress('itemsServer')}`,
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
    }
  }
}