import express from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/admin-account.controller'
import * as validations from '../../validations/purchase-history.validation'

const router = express.Router();

router.route('/')
  .post(controller.createAdminAccountRoute)
  .get(controller.adminAccountListRoute)
router.route('/:adminAccountId')
  .patch(controller.updateAdminAccountRoute)
  .get(controller.updateAdminAccountRoute)

export default router;
