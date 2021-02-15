import express from 'express'
import * as controller from '../../controllers/purchase.controller'
import { authorize, LOGGED_USER } from '../../middlewares/auth';
import * as validations from '../../validations/purchase-history.validation'

const router = express.Router();
router.route('/')
  .get(controller.purchaseHistoryListRoute)
router.route('/:purchasedProductId')
  .get(controller.purchaseHistoryDetailsRoute)
export default router;
