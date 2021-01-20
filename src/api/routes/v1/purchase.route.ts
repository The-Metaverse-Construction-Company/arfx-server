import express from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/purchase.controller'
import { authorize, LOGGED_USER } from '../../middlewares/auth';
import * as validations from '../../validations/purchase-history.validation'

const router = express.Router();

router.route('/')
  .post(authorize(LOGGED_USER), validate(validations.PurchaseValidation), controller.purchaseProductRoute)

router.route('/history')
  .post(authorize(LOGGED_USER), validate(validations.PurchaseValidation), controller.purchaseHistoryListRoute)
router.route('/history/:purchasedProductId')
  .post(authorize(LOGGED_USER), validate(validations.PurchaseValidation), controller.purchaseHistoryDetailsRoute)
export default router;
