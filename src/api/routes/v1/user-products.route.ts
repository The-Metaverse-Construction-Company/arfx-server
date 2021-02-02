import express from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/user-products.controller'
import { authorize, LOGGED_USER } from '../../middlewares/auth';
import * as validations from '../../validations/purchase-history.validation'

const router = express.Router();

router.route('/')
// dummy endpoint
//x only for testing
  .post(controller.createUserProductRoute)
/**
 * @swagger
 * /v1/users/{userId}/products:
 *  patch:
 *    summary: "List of product/scene that purchased of the user/customer."
 *    tags:
 *      - "User Products"
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/Product/id'
 *    responses:
 *      '200':
 *        $ref: '#/components/responses/UserProducts'
 */
  .get(controller.userProductListRoute)
router.route('/:userProductId')
/**
 * @swagger
 * /v1/users/{userId}/products/{productId}:
 *  patch:
 *    summary: "Details of product/scene that purchased of the user/customer."
 *    tags:
 *      - "User Products"
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/User/id'
 *      - $ref: '#/components/requestParams/Product/id'
 *    responses:
 *      '200':
 *        $ref: '#/components/responses/UserProduct'
 */
  .get(controller.userProductDetailsRoute)

export default router;
