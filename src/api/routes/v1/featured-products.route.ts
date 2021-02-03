import express, {Request, Response} from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/featured-product.controller'
import * as validations from '../../validations/featured-products.validation'
import {
  authorizeAdminAccount
} from '../../middlewares/auth'
import { requestValidatorMiddleware } from '../../validations'
const router = express.Router();
router.use(authorizeAdminAccount())
router.route('/')
/**
 * @swagger
 * paths:
 *  /v1/featured-products:
 *    post:
 *      summary: List of the banners.
 *      security:
 *        - adminBearerAuth: []
 *      tags: 
 *        - "Featured Product"
 *      requestBody:
 *         $ref: '#/components/requestBody/FeaturedProduct/form'
 *      responses:
 *        '200':
 *          description: "OK"
 */
  .post(validations.FormPipeline, requestValidatorMiddleware, controller.createFeaturedProductRoute)
/**
 * @swagger
 * paths:
 *  /v1/featured-products:
 *    get:
 *      summary: List of the banners.
 *      security:
 *        - adminBearerAuth: []
 *        - userBearerAuth: []
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
 *  /v1/featured-products/{featuredProductId}:
 *    patch:
 *      summary: update the Featured Product id.
 *      security:
 *        - adminBearerAuth: []
 *      tags: 
 *        - "Featured Product"
 *      parameters:
 *        - $ref: '#/components/requestParams/FeaturedProduct/id'
 *      requestBody:
 *         $ref: '#/components/requestBody/FeaturedProduct/form'
 *      responses:
 *        '201':
 *          description: "ACCEPTED"
 */
  .patch(controller.updateFeaturedProductRoute)
/**x
 * @swagger
 * paths:
 *  /v1/featured-products/{featuredProductId}:
 *    delete:
 *      summary: remove the Featured Product id
 *      security:
 *        - adminBearerAuth: []
 *      tags: 
 *        - "Featured Product"
 *      parameters:
 *        - $ref: '#/components/requestParams/FeaturedProduct/id'
 *      responses:
 *        '201':
 *          description: "ACCEPTED"
 */
  .delete(controller.removeFeaturedProductRoute);

export default router;
