import express, {Request, Response} from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/sign-up.controller'
import {oAuth as oAuthLogin} from '../../middlewares/auth'

import {
  login,
  register,
  oAuth,
  refresh,
} from '../../validations/auth.validation'

const router = express.Router();

/**
 * @api {post} v1/auth/register Register
 * @apiDescription Register a new user
 * @apiVersion 1.0.0
 * @apiName Register
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}          email     User's email
 * @apiParam  {String{6..128}}  password  User's password
 *
 * @apiSuccess (Created 20x1) {String}  token.tokenType     Access Token's type
 * @apiSuccess (Created 201) {String}  token.accessToken   Authorization Token
 * @apiSuccess (Created 201) {String}  token.refreshToken  Token to get a new accessToken
 *                                                   after expiration time
 * @apiSuccess (Created 201) {Number}  token.expiresIn     Access Token's expiration time
 *                                                   in miliseconds
 * @apiSuccess (Created 201) {String}  token.timezone      The server's Timezone
 *
 * @apiSuccess (Created 201) {String}  user.id         User's id
 * @apiSuccess (Created 201) {String}  user.name       User's name
 * @apiSuccess (Created 201) {String}  user.email      User's email
 * @apiSuccess (Created 201) {String}  user.role       User's role
 * @apiSuccess (Created 201) {Date}    user.createdAt  Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
router.route('/')
  .post(validate(register), controller.signUpRoute);
router.route('/verify')
  /// ***DEVNOTE***
  /// will implement this if need a UI on frontend to do another actions.
  // .get(controller.verifyTokenMiddleware, controller.verifyTokenRoute)
  .get(controller.verifyTokenMiddleware, controller.verifyUserRoute);


export default router