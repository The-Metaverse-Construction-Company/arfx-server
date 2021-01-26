import express from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/product.controller'
import * as validations from '../../validations/product.validation'
import PurchaseRoute from './purchase.route'
import uploder from '../../../config/uploader'
const router = express.Router();
import {
  authorize
} from '../../middlewares/auth'
import { ALLOWED_USER_ROLE } from '../../domain/entities/users'
router.use('/purchase', PurchaseRoute)

router.route('/')
<<<<<<< HEAD
  .post(uploder.single('scene'), controller.createProductRoute)
  // .post(validate(validations.CreateProductValidation), controller.createProductRoute)
=======
  .post(authorize(ALLOWED_USER_ROLE.ADMIN), validate(validations.CreateProductValidation), controller.createProductRoute)
>>>>>>> product
  .get(controller.productListRoute)
router.route('/:productId')
  .get(controller.productDetailsRoute)
// router.use('/', authorize(ALLOWED_USER_ROLE.ADMIN))
router.route('/:productId')
  .patch(validate(validations.UpdateProductValidation), controller.updateProductRoute)
  .delete(validate(validations.RemoveProductValidation), controller.removeProductRoute)
router.route('/:productId/published')
  .patch(validate(validations.UpdateProductPublishValidation), controller.updateProductPublishStatusRoute)

export default router;
