import express from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/purchase.controller'
import { authorize, LOGGED_USER } from '../../middlewares/auth';
import * as validations from '../../validations/purchase-history.validation'

const router = express.Router();
router.route('/')
  .get(authorize(LOGGED_USER), controller.purchaseHistoryListRoute)
router.route('/:purchasedProductId')
  .get(authorize(LOGGED_USER), controller.purchaseHistoryDetailsRoute)
export default router;
