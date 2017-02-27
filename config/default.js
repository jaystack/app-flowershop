const winston = require('winston')
const path = require('path')
const mkdirp = require('mkdirp')

// prepare logger folder & filename
const loggerDir = "./log"
const loggerFileName = path.join(loggerDir, "all-logs.log")
// winston logger needs and existing folder
mkdirp(loggerDir, function (err) {
    if (err) return console.error(err)
    return console.log(`Log folder: '${loggerDir}' ('${loggerFileName}')`)
});

// TODO: find solution: file transport logging cause error if used (eg. logger.error(...))
// console.log(fileTransport)

// set config options
const config = {
  endpoints: {
    "systemEndpoints": "endpoints.json"
  },
  logger: {
    transportFactories: [
      () => new winston.transports.Console({
        level: "debug",
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp: true
      }),
      () => new winston.transports.File({
        level: "info",
        filename: loggerFileName
        // ,handleExceptions: true
        // ,json: true
        // ,maxsize: 5242880
        // ,maxFiles: 5
        // ,colorize: false
        // ,timestamp: true
      })
    ]
  },
  cx: { "test": "cx" }
}

module.exports = config