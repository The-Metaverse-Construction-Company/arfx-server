import express from 'express'
import * as controller from '../../controllers/purchase.controller'
import { authorize, LOGGED_USER } from '../../middlewares/auth';
import { requestValidatorMiddleware } from '../../validations';
import * as validations from '../../validations/purchase-history.validation'

const router = express.Router();

router.route('/')
/**
 * @swagger
 * /v1/products/purchase:
 *  post:
 *    summary: "purchase the product"
 *    tags:
 *      - "Purchase Product"
 *    security:
 *      - userBearerAuth: []
 *    requestBody:
 *      $ref: '#/components/requestBody/Product/purchase'
 *    responses:
 *      '200':
 *        $ref: '#/components/responseBody/PurchaseHistories'
 */
  .post(
    authorize(LOGGED_USER),
    validations.PurchaseProductValidationPipeline,
    requestValidatorMiddleware,
    controller.purchaseProductRoute
  )
export default router;
