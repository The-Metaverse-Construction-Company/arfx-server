import express, {Request, Response} from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/product-banner.controller'
import {
  sendPasswordReset,
  updateResetPasswordValidation,
  verifyResetPasswordToken
} from '../../validations/auth.validation'

const router = express.Router();

router.route('/')
/**
 * @swagger
 * paths:
 *  /v1/product-banners:
 *    post:
 *      summary: List of the banners.
 *      tags: 
 *        - "Featured Banner"
 *      requestBody:
 *         $ref: '#/components/requestBody/ProductBanner/form'
 *      responses:
 *        '200':
 *          description: "OK"
 */
  .post(validate(sendPasswordReset), controller.createProductBannerRoute)
/**
 * @swagger
 * paths:
 *  /v1/product-banners:
 *    get:
 *      summary: List of the banners.
 *      tags: 
 *        - "Featured Banner"
 *      parameters:
 *        - $ref: '#/components/requestQuery/pageNo'
 *        - $ref: '#/components/requestQuery/limit'
 *        - $ref: '#/components/requestQuery/searchText'
 *      responses:
 *        '200':
 *          description: "OK"
 */
  .get(controller.productBannerListRoute)

router.route('/:productBannerId')
/**
 * @swagger
 * paths:
 *  /v1/product-banners/{productBannerId}:
 *    patch:
 *      summary: update the Featured banner id.
 *      tags: 
 *        - "Featured Banner"
 *      parameters:
 *        - $ref: '#/components/requestParams/ProductBanner/id'
 *      requestBody:
 *         $ref: '#/components/requestBody/ProductBanner/form'
 *      responses:
 *        '201':
 *          description: "ACCEPTED"
 */
  .patch(controller.updateProductBannerRoute)
/**
 * @swagger
 * paths:
 *  /v1/product-banners/{productBannerId}:
 *    delete:
 *      summary: remove the Featured banner id
 *      tags: 
 *        - "Featured Banner"
 *      parameters:
 *        - $ref: '#/components/requestParams/ProductBanner/id'
 *      responses:
 *        '201':
 *          description: "ACCEPTED"
 */
  .delete(controller.removeProductBannerRoute);

export default router;
