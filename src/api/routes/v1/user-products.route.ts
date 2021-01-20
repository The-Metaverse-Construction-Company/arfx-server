import express from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/user-products.controller'
import { authorize, LOGGED_USER } from '../../middlewares/auth';
import * as validations from '../../validations/purchase-history.validation'

const router = express.Router();

router.route('/')
  .post(controller.createUserProductRoute)
  .get(controller.userProductListRoute)
router.route('/:userProductId')
  .get(controller.userProductDetailsRoute)

export default router;
