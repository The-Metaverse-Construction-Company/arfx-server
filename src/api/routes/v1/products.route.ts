import express from 'express'
import * as controller from '../../controllers/product.controller'
import * as validations from '../../validations/product.validation'
import PurchaseRoute from './purchase.route'
import {v4 as uuidV4} from 'uuid'
import path from 'path'
// import uploder from '../../../config/uploader'
import multer from 'multer'
const uploadPath = path.join(__dirname, '../../../../public/uploaded');
const getFilePath = (filename: string) => path.join(uploadPath, filename)
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadPath)
  },
  filename: (req, file, callback) => {
    const f = file.originalname.split('.')
    // to get the last element of the array.
    const blobExtension = f[f.length - 1]
    callback(null, `${uuidV4()}.${blobExtension}`)
  }
})
const uploader = multer({storage})
const router = express.Router();
import {
  authorize,
  authorizeAdminAccount
} from '../../middlewares/auth'
import { ALLOWED_USER_ROLE } from '../../domain/entities/users'
import { PaginationQueryPipeline, requestValidatorMiddleware } from '../../validations'

router.use('/purchase', PurchaseRoute)
router.param('productId', controller.productDetailsMiddleware)
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
 *      - adminBearerAuth: []
 *    requestBody:
 *       $ref: '#/components/requestBody/Product/form'
 *    responses:
 *      '200':
 *        $ref: '#/components/responseBody/Product'
 */
  .post(authorize(ALLOWED_USER_ROLE.ADMIN), uploader.fields([
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
  ]),
  validations.ProductFormValidationPipeline,
  requestValidatorMiddleware,
  controller.mapProductUploadedBlobRoute,
  controller.createProductRoute)
  // .post(authorize(ALLOWED_USER_ROLE.ADMIN), uploader.single('scene'), validate(validations.CreateProductValidation), controller.createProductRoute)
/**x
 * @swagger
 * /v1/products:
 *  get:
 *    summary: "List Of the Products/Scenes"
 *    tags:
 *      - "Products"
 *    security:
 *      - userBearerAuth: []
 *      - adminBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestQuery/pageNo'
 *      - $ref: '#/components/requestQuery/limit'
 *      - $ref: '#/components/requestQuery/searchText'
 *    responses:
 *      '200':
 *        $ref: '#/components/responseBody/Products'
 */
  .get(
    authorize(),
    PaginationQueryPipeline,
    requestValidatorMiddleware,
    controller.productListRoute
  )
  // .post(authorize(ALLOWED_USER_ROLE.ADMIN), controller.uploadProductImageRoute)
/**
 * @swagger
 * /v1/products/{productId}:
 *  get:
 *    summary: "Product/Scene Details"
 *    tags:
 *      - "Products"
 *    security:
 *      - userBearerAuth: []
 *      - adminBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/Product/id'
 *    responses:
 *      '200':
 *        $ref: '#/components/responseBody/Product'
 */
router.route('/:productId')
  .get(authorize(), controller.productDetailsRoute)
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
 *      - adminBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/Product/id'
 *    requestBody:
 *       $ref: '#/components/requestBody/Product/form'
 *    responses:
 *      '200':
 *        $ref: '#/components/schemas/Product'
 */
  .patch(authorizeAdminAccount(), uploader.fields([
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
  ]), 
  validations.ProductFormValidationPipeline,
  requestValidatorMiddleware,
  controller.mapProductUploadedBlobRoute,
  controller.updateProductRoute)
  /**xx
 * @swagger
 * /v1/products/{productId}:
 *  delete:
 *    summary: "Remove selected Product/Scene."
 *    tags:
 *      - "Products"
 *    security:
 *      - adminBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/Product/id'
 *    responses:
 *      '200':
 *        $ref: '#/components/schemas/Product'
 */
  .delete(
    authorizeAdminAccount(),
    validations.RemoveProductValidation,
    requestValidatorMiddleware,
    controller.removeProductRoute
  )
/**
 * @swagger
 * /v1/products/{productId}/published:
 *  patch:
 *    summary: "Update publish status of selected product/scene."
 *    tags:
 *      - "Products"
 *    security:
 *      - adminBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/Product/id'
 *    requestBody:
 *       $ref: '#/components/requestBody/Product/published'
 *    responses:
 *      '200':
 *        $ref: '#/components/schemas/Product'
 */
router.route('/:productId/published')
  .patch(
    authorizeAdminAccount(),
    validations.UpdateProductPublishValidation,
    requestValidatorMiddleware,
    controller.updateProductPublishStatusRoute
    )
router.route('/:productId/:blobType\.:fileType')
  .get(
    authorize(),
    validations.ProductBlobTypeValidationPipeline,
    requestValidatorMiddleware,
    controller.downloadContentZipRoute
    )

export default router;
