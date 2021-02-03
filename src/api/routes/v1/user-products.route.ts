import express from 'express'
import * as controller from '../../controllers/user-products.controller'
import { ALLOWED_USER_ROLE } from '../../domain/entities/users';
import { authorize } from '../../middlewares/auth';

const router = express.Router();

router.route('/')
// dummy endpoint
//x only for testing
  .post(controller.createUserProductRoute)
/**
 * @swagger
 * /v1/users/{userId}/products:
 *  get:
 *    summary: "List of product/scene that purchased of the user/customer."
 *    tags:
 *      - "User Products"
 *    security:
 *      - userBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/User/id'
 *    responses:
 *      '200':
 *        $ref: '#/components/responses/UserProducts'
 */
  .get(authorize(ALLOWED_USER_ROLE.USER), controller.userProductListRoute)
router.route('/:userProductId')
/**
 * @swagger
 * /v1/users/{userId}/products/{productId}:
 *  get:
 *    summary: "Details of product/scene that purchased of the user/customer."
 *    tags:
 *      - "User Products"
 *    security:
 *      - userBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/User/id'
 *      - $ref: '#/components/requestParams/Product/id'
 *    responses:
 *      '200':
 *        $ref: '#/components/responses/UserProduct'
 */
  .get(authorize(ALLOWED_USER_ROLE.USER), controller.userProductDetailsRoute)

export default router;
