import express from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/product.controller'
import * as validations from '../../validations/product.validation'
import PurchaseRoute from './purchase.route'
import path from 'path'
// import uploder from '../../../config/uploader'
import multer from 'multer'
const uploadPath = path.join(__dirname, '../../../../public/uploaded');
const getFilePath = (filename: string) => path.join(uploadPath, filename)
const upload = multer({dest: uploadPath})
const router = express.Router();
import {
  authorize
} from '../../middlewares/auth'
import { ALLOWED_USER_ROLE } from '../../domain/entities/users'
router.use('/purchase', PurchaseRoute)
router.route('/')
/**
/**
 * @swagger
 * /v1/products:
 *  post:
 *    summary: "Add new Product/Scene."
 *    tags:
 *      - "Products"
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *       $ref: '#/components/requestBody/Product/form'
 *    responses:
 *      '200':
 *        $ref: '#/components/responseBody/Product'
 */
  .post(authorize(ALLOWED_USER_ROLE.ADMIN), upload.fields([
    {
      name: 'previewImage',
      maxCount: 1,
    },
    {
      name: 'previewVideo',
      maxCount: 1,
    },
    {
      name: 'contentZip',
      maxCount: 1,
    }
  ]), validate(validations.CreateProductValidation), controller.mapProductUploadedBlobRoute, controller.createProductRoute)
  // .post(authorize(ALLOWED_USER_ROLE.ADMIN), upload.single('scene'), validate(validations.CreateProductValidation), controller.createProductRoute)
/**
 * @swagger
 * /v1/products:
 *  get:
 *    summary: "List Of the Products/Scenes"
 *    tags:
 *      - "Products"
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestQuery/pageNo'
 *      - $ref: '#/components/requestQuery/limit'
 *      - $ref: '#/components/requestQuery/searchText'
 *    responses:
 *      '200':
 *        $ref: '#/components/responseBody/Products'
 */
  .get(authorize(), controller.productListRoute)
router.route('/upload')
  .post(upload.single('scene'), controller.uploadProductImageRoute)
  // .post(authorize(ALLOWED_USER_ROLE.ADMIN), controller.uploadProductImageRoute)
/**
 * @swagger
 * /v1/products/{productId}:
 *  get:
 *    summary: "Product/Scene Details"
 *    tags:
 *      - "Products"
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/Product/id'
 *    responses:
 *      '200':
 *        $ref: '#/components/responseBody/Product'
 */
router.route('/:productId')
  .get(controller.productDetailsRoute)
  // router.use('/', authorize(ALLOWED_USER_ROLE.ADMIN))
router.route('/:productId')
/**x
 * @swagger
 * /v1/products/{productId}:
 *  patch:
 *    summary: "Update the selected product/screen."
 *    tags:
 *      - "Products"
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/Product/id'
 *    requestBody:
 *       $ref: '#/components/requestBody/Product/form'
 *    responses:
 *      '200':
 *        $ref: '#/components/schemas/Product'
 */
  .patch(authorize(ALLOWED_USER_ROLE.ADMIN), upload.fields([
    {
      name: 'previewImage',
      maxCount: 1,
    },
    {
      name: 'previewVideo',
      maxCount: 1,
    },
    {
      name: 'contentZip',
      maxCount: 1,
    }
  ]), validate(validations.CreateProductValidation), controller.mapProductUploadedBlobRoute,controller.updateProductRoute)
  /**
 * @swagger
 * /v1/products/{productId}:
 *  delete:
 *    summary: "Remove selected Product/Scene."
 *    tags:
 *      - "Products"
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/Product/id'
 *    responses:
 *      '200':
 *        $ref: '#/components/schemas/Product'
 */
  .delete(validate(validations.RemoveProductValidation), controller.removeProductRoute)
/**
 * @swagger
 * /v1/products/{productId}/published:
 *  patch:
 *    summary: "Update publish status of selected product/scene."
 *    tags:
 *      - "Products"
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/Product/id'
 *    requestBody:
 *       $ref: '#/components/requestBody/Product/published'
 *    responses:
 *      '200':
 *        $ref: '#/components/schemas/Product'
 */
router.route('/:productId/published')
  .patch(validate(validations.UpdateProductPublishValidation), controller.updateProductPublishStatusRoute)

export default router;
