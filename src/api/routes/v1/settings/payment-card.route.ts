import express from 'express'
import validate from 'express-validation'
import * as controller from '../../../controllers/payment-card.controller'
import {
  PurchaseValidation
} from '../../../validations/purchase-history.validation'
const router = express.Router({mergeParams: true});

router.route('/set-up')
  .post(controller.createCustomerIntent)
router.route('/payment-methods')
  .get(controller.getCustomerPaymentMethods)
  // .get(validate(PurchaseValidation), controller.getCustomerPaymentMethods)

export default router;
