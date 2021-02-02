import express, { NextFunction, Request } from 'express'
import routes from '../api/routes/v1'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'

import passport from 'passport'
import Busboy from 'busboy'
import { logs } from './vars'
import * as strategies from './passport'
import * as error from '../api/middlewares/error'

import RedisClient from './redis'

const Fingerprint = require('express-fingerprint')
import swaggerUI from 'swagger-ui-express'
import SwaggerOptions from './swagger/index'

import path from 'path'
const helmet = require('helmet')
const compress = require('compression')
const morgan = require('morgan')
const cors = require('cors')

/**
* Express instaxnce
* @public
*/
const app = express();
// request logging. dev: console | production: file
app.use(morgan(logs));
// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '../../public')))
// initialize busboy middleware
// app.use((req: Request, _: any, next: NextFunction) => {
//   if (req.method === 'POST') {
//     req.app.set('busboy', new Busboy({ headers: req.headers }))
//     // req.busboy.on('field', (fieldname, value) => {
//     //   req.body[fieldname] = value
//     // });
//   }
//   next()
// })
// setup request fingerprint
app.use(Fingerprint({
  parameters: [
    Fingerprint.useragent,
    Fingerprint.acceptHeaders,
    Fingerprint.geoip
  ]
}))
// add middleware to map the fingerprint to res.locals.fingerprint
app.use((req, res, next) => {
  //@ts-expect-error
  const fingerprint = req.fingerprint
  res.locals.fingerprint = fingerprint?.hash
  next()
})
// // console.log('RedisClient :>> ', RedisClient);
// load redis
app.set('redisPublisher', RedisClient)

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable authentication
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);
passport.use('admin-auth', strategies.adminAuthJWT);
// passport.use('facebook', strategies.facebook);
// passport.use('google', strategies.google);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(SwaggerOptions))
/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *    description: Hello this is a simple Sign-in
 *    responses:
 *      200:
 *        Successfully get something sytsem
 */
app.use('/v1', routes);
// mount api v1 routes
// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

export default app;
