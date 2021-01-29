import express, {Request, Response} from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/reset-password.controller'
import {
  sendPasswordReset,
  updateResetPasswordValidation,
  verifyResetPasswordToken
} from '../../validations/auth.validation'

const router = express.Router();

router.route('/')
/**x
 * @swagger
 * paths:
 *  /v1/auth/reset-password:
 *    post:
 *      summary: Verify the newly created user/account.
 *      tags: 
 *        - "Reset Password"
 *      requestBody:
 *        $ref: '#/components/requestBody/resetPassword/send'
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/resetPassword/send'
 */
  .post(validate(sendPasswordReset), controller.sendResetPasswordRoute)
/**x
 * @swagger
 * paths:
 *  /v1/auth/reset-password:
 *    get:
 *      summary: Verify auth token for reset password.
 *      tags: 
 *        - "Reset Password"
 *      parameters:
 *        - $ref: '#/components/requestQuery/authTokenParam'
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/resetPassword/verifyToken'
 */
  .get(validate(verifyResetPasswordToken), controller.verifyResetPasswordMiddleWare, controller.verifyResetPasswordRoute)
/**x
 * @swagger
 * paths:
 *  /v1/auth/reset-password:
 *    patch:
 *      summary: set a new password.
 *      tags: 
 *        - "Reset Password"
 *      parameters:
 *        - $ref: '#/components/requestQuery/authTokenParam'
 *      requestBody:
 *         $ref: '#/components/requestBody/resetPassword/verified'
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/resetPassword/verifyToken'
 */
  .patch(validate(updateResetPasswordValidation), controller.verifyResetPasswordMiddleWare, controller.updateResetPasswordRoute);

export default router;
