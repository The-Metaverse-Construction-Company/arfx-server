import express from 'express'
import * as controller from '../../controllers/auth.controller'
import { authAzureAD, authorize } from '../../middlewares/auth'
import {signInValidationPipeline
} from '../../validations/auth.validation'
import { requestValidatorMiddleware } from '../../validations'
import httpStatus from 'http-status'
import { successReponse } from '../../helper/http-response'

const router = express.Router();
router.route('/')
/**
 * @swagger
 *  /v1/auth:
 *    get:
 *      tags: 
 *      - "Authentication"
 *      security:
 *      - userBearerAuth: []
 *      summary: Validating access token.
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/User/Detail'
 */
  .get(authorize(), (req, res, next) => {
    res.status(httpStatus.OK).send(successReponse(req.user))
  })
/**
 * @swagger
 *  /v1/auth/azure:
 *    post:
 *      tags: 
 *      - "Authentication"
 *      summary: Authenticating azure token or register new user based on the
 *      security:
 *       - userBearerAuth: []
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/User/Detail'
 */
router.route('/azure')
  .post(authAzureAD(),
  (req, res) => {
    res.status(httpStatus.OK).send(successReponse(req.user))
  })
//Routes
/**
 * @swagger
 *  /v1/auth/login:
 *    post:
 *      tags: 
 *      - "Authentication"
 *      summary: Authenticate the registered users.
 *      requestBody:
 *        $ref: '#/components/requestBody/User/signIn'
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/User/Detail'
 */
router.route('/login')
  .post(
    signInValidationPipeline,
    requestValidatorMiddleware,
    controller.userSignInRoute
  )
/**
 * @swagger
 *  /v1/auth/sign-out:
 *    post:
 *      summary: Sign-out/logout the current logged-in user based on the access token used.
 *      tags: 
 *        - "Authentication"
 *      security:
 *        - userBearerAuth: []
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/SignOut'
 */
router.route('/sign-out')
  .post(controller.userSignOutRoute)
// router.route('/refresh-token')
//   .post(validate(refresh), controller.refresh);
// router.route('/facebook')
//   .post(validate(oAuth), oAuthLogin('facebook'), controller.oAuth);
// router.route('/google')
//   .post(validate(oAuth), oAuthLogin('google'), controller.oAuth);

export default router;
