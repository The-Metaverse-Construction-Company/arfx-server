import express from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/admin-account/index.controller'
import * as authCrontroller from '../../controllers/admin-account/auth.controller'
import * as validations from '../../validations/purchase-history.validation'
import {
  authorize, authorizeAdminAccount
} from '../../middlewares/auth'
import { ALLOWED_USER_ROLE } from '../../domain/entities/users'
const router = express.Router();
router.get('/auth', authorizeAdminAccount(), authCrontroller.validateAuthTokenRoute)
router.route('/auth/sign-in')
  .post(authCrontroller.signInAdminAccountRoute)
router.use('/', authorizeAdminAccount())
router.route('/')
  .post(controller.createAdminAccountRoute)
  .get(controller.adminAccountListRoute)
router.route('/:adminAccountId')
  .patch(controller.updateAdminAccountRoute)
  .get(controller.adminAccountDetailsRoute)

export default router;
