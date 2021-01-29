import express from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/product.controller'
import * as validations from '../../validations/product.validation'
import PurchaseRoute from './purchase.route'
import path from 'path'
// import uploder from '../../../config/uploader'
import multer from 'multer'
const uploadPath = path.join(__dirname, '../../../../uploaded');
const getFilePath = (filename: string) => path.join(uploadPath, filename)
const upload = multer({dest: uploadPath})
const router = express.Router();
import {
  authorize
} from '../../middlewares/auth'
import { ALLOWED_USER_ROLE } from '../../domain/entities/users'
router.use('/purchase', PurchaseRoute)
router.route('/')
  .post(authorize(ALLOWED_USER_ROLE.ADMIN), upload.single('scene'), validate(validations.CreateProductValidation), controller.createProductRoute)
  .get(authorize(), controller.productListRoute)
router.route('/:productId/upload')
  // .post(controller.uploadProductImageRoute)
  // .post(multipart, controller.uploadProductImageRoute)
  .post(upload.single('scene'), controller.uploadProductImageRoute)
  // .post(authorize(ALLOWED_USER_ROLE.ADMIN), controller.uploadProductImageRoute)
router.route('/:productId')
  .get(controller.productDetailsRoute)
  // router.use('/', authorize(ALLOWED_USER_ROLE.ADMIN))
router.route('/:productId')
  .patch(validate(validations.UpdateProductValidation), controller.updateProductRoute)
  .delete(validate(validations.RemoveProductValidation), controller.removeProductRoute)
router.route('/:productId/published')
  .patch(validate(validations.UpdateProductPublishValidation), controller.updateProductPublishStatusRoute)

export default router;
