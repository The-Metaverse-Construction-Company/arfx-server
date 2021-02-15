import express, {Request, Response} from 'express'
import * as controller from '../../controllers/sign-up.controller'
import { requestValidatorMiddleware } from '../../validations';
import { 
  signUpValidationPipeline,
} from '../../validations/auth.validation'

const router = express.Router();
/**
 * @swagger
 *  /v1/auth/sign-up:
 *    post:
 *      summary: Sign-up/Register an account.
 *      tags: 
 *        - "Sign-Up"
 *      requestBody:
 *        $ref: '#/components/requestBody/User/createForm'
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/signUp'
 */
router.route('/')
  .post(
    signUpValidationPipeline,
    requestValidatorMiddleware,
    controller.signUpRoute);
/**
 * @swagger
 *  /v1/auth/sign-up/verify:
 *    get:
 *      summary: Verify the newly created user/account.
 *      tags: 
 *        - "Sign-Up"
 *      parameters:
 *        - $ref: '#/components/requestQuery/AuthOTPParam'
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/signUp'
 */
router.route('/verify')
  /// ***DEVNOTE***
  /// will implement this if need a UI on frontend to do another actions.
  .get(controller.verifyTokenMiddleware, controller.verifyUserRoute)
  // ** implement this if the account verifiction link have a UI to insert/create pwd.
  // .get(controller.verifyTokenMiddleware, controller.verifyTokenRoute)
  // .patch(controller.verifyTokenMiddleware, controller.verifyUserRoute);


export default router