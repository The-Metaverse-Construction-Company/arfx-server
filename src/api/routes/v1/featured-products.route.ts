import express, {Request, Response} from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/featured-product.controller'
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
 *        - "Featured Product"
 *      requestBody:
 *         $ref: '#/components/requestBody/featuredProduct/form'
 *      responses:
 *        '200':
 *          description: "OK"
 */
  .post(validate(sendPasswordReset), controller.createFeaturedProductRoute)
/**
 * @swagger
 * paths:
 *  /v1/product-banners:
 *    get:
 *      summary: List of the banners.
 *      tags: 
 *        - "Featured Product"
 *      parameters:
 *        - $ref: '#/components/requestQuery/pageNo'
 *        - $ref: '#/components/requestQuery/limit'
 *        - $ref: '#/components/requestQuery/searchText'
 *      responses:
 *        '200':
 *          description: "OK"
 */
  .get(controller.featuredProductListRoute)

router.route('/:featuredProductId')
/**
 * @swagger
 * paths:
 *  /v1/product-banners/{featuredProductId}:
 *    patch:
 *      summary: update the Featured Product id.
 *      tags: 
 *        - "Featured Product"
 *      parameters:
 *        - $ref: '#/components/requestParams/featuredProduct/id'
 *      requestBody:
 *         $ref: '#/components/requestBody/featuredProduct/form'
 *      responses:
 *        '201':
 *          description: "ACCEPTED"
 */
  .patch(controller.updateFeaturedProductRoute)
/**
 * @swagger
 * paths:
 *  /v1/product-banners/{featuredProductId}:
 *    delete:
 *      summary: remove the Featured Product id
 *      tags: 
 *        - "Featured Product"
 *      parameters:
 *        - $ref: '#/components/requestParams/featuredProduct/id'
 *      responses:
 *        '201':
 *          description: "ACCEPTED"
 */
  .delete(controller.removeFeaturedProductRoute);

export default router;
