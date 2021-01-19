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
  .post(validate(sendPasswordReset), controller.sendResetPasswordRoute)
  .get(validate(verifyResetPasswordToken), controller.verifyResetPasswordMiddleWare, controller.verifyResetPasswordRoute)
  .patch(validate(updateResetPasswordValidation), controller.verifyResetPasswordMiddleWare, controller.updateResetPasswordRoute);

export default router;
