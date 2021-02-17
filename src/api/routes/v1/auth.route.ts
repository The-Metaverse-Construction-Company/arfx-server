import express from 'express'
import * as controller from '../../controllers/auth.controller'

import {signInValidationPipeline
} from '../../validations/auth.validation'
import { requestValidatorMiddleware } from '../../validations'

const router = express.Router();
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
 *          $ref: '#/components/responses/SignIn'
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
