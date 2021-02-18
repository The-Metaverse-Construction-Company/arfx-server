import express from 'express'
import * as controller from '../../controllers/purchase.controller'
import { authorize, LOGGED_USER } from '../../middlewares/auth';
import { requestValidatorMiddleware } from '../../validations';
import * as validations from '../../validations/purchase-history.validation'

const router = express.Router();

router.route('/')
  .post(
    authorize(LOGGED_USER),
    validations.PurchaseProductValidationPipeline,
    requestValidatorMiddleware,
    controller.purchaseProductRoute
  )

// router.route('/history')
//   .post(
//     authorize(LOGGED_USER),
//     controller.purchaseHistoryListRoute)

// router.route('/history/:purchasedProductId')
//   .post(
//     authorize(LOGGED_USER),
    // controller.purchaseHistoryDetailsRoute)
export default router;
