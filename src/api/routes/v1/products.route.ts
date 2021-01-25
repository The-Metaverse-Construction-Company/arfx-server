import express from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/product.controller'
import * as validations from '../../validations/product.validation'
import PurchaseRoute from './purchase.route'
import uploder from '../../../config/uploader'
const router = express.Router();

router.use('/purchase', PurchaseRoute)

router.route('/')
  .post(uploder.single('scene'), controller.createProductRoute)
  // .post(validate(validations.CreateProductValidation), controller.createProductRoute)
  .get(controller.productListRoute)
router.route('/:productId')
  .get(controller.productDetailsRoute)
  .patch(validate(validations.UpdateProductValidation), controller.updateProductRoute)
  .delete(validate(validations.RemoveProductValidation), controller.removeProductRoute)
router.route('/:productId/published')
  .patch(validate(validations.UpdateProductPublishValidation), controller.updateProductPublishStatusRoute)

export default router;
