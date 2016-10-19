import * as cx from 'compoxure'
import * as express from 'express'
import * as config from 'config';
import * as cookieParser from 'cookie-parser'
import * as logger from 'morgan'
import * as path from 'path'

(<any>config).functions = {
  'handle302': function (req, res, variables, data, options, err, responseCallback) {
    res.writeHead(302, { location: err.headers.location, 'set-cookie': err.headers['set-cookie'] });
    res.end('');
  },
}


let pageComposer = cx(config)
let app = express()
app.use(logger('dev'))
app.use(cookieParser())
app.use(express.static(path.join('./public')));
app.use(pageComposer)

app.listen(9000, () => {
  console.log('app listen on port 9000')
})

export default config