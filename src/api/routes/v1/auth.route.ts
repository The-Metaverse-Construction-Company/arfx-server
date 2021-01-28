import express, {Request, Response} from 'express'
import validate from 'express-validation'
import { authorize } from '../../middlewares/auth'
import * as controller from '../../controllers/auth.controller'
import {LOGGED_USER, oAuth as oAuthLogin} from '../../middlewares/auth'

import {
  login,
  register,
  oAuth,
  refresh,
} from '../../validations/auth.validation'

const router = express.Router();
//Routesx
/**
 * @swagger
 *  /v1/auth/login:
 *    post:
 *      tags: 
 *      - "Sign-In"
 *      summary: Authenticate the registered users.
 *      requestBody:
 *        $ref: '#/components/requestBody/SignIn'
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/SignIn'
 */
router.route('/login')
  .post(validate(login), controller.login)
/**
 * @swagger
 *  /v1/auth/sign-out:
 *    post:
 *      summary: Sign-out/logout the current logged-in user based on the access token used.
 *      tags: 
 *        - "Sign-Out"
 *      parameters:
 *        - $ref: "#/components/requestHeaders/authorizationParam"
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/SignOut'
 */
router.route('/sign-out')
  .post(controller.userSignOutRoute)


/**
 * @api {post} v1/auth/refresh-token Refresh Token
 * @apiDescription Refresh expired accessToken
 * @apiVersion 1.0.0
 * @apiName RefreshToken
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  email         User's email
 * @apiParam  {String}  refreshToken  Refresh token aquired when user logged in
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken
 */
router.route('/refresh-token')
  .post(validate(refresh), controller.refresh);

/**
 * @api {post} v1/auth/facebook Facebook Login
 * @apiDescription Login with facebook. Creates a new user if it does not exist
 * @apiVersion 1.0.0
 * @apiName FacebookLogin
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  access_token  Facebook's access_token
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized    Incorrect access_token
 */
router.route('/facebook')
  .post(validate(oAuth), oAuthLogin('facebook'), controller.oAuth);

/**
 * @api {post} v1/auth/google Google Login
 * @apiDescription Login with google. Creates a new user if it does not exist
 * @apiVersion 1.0.0
 * @apiName GoogleLogin
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  access_token  Google's access_token
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accpessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized    Incorrect access_token
 */
router.route('/google')
  .post(validate(oAuth), oAuthLogin('google'), controller.oAuth);


export default router;
