import express from 'express'
import * as controller from '../../controllers/purchase.controller'
import { authorize, LOGGED_USER } from '../../middlewares/auth';
import * as validations from '../../validations/purchase-history.validation'

const router = express.Router({mergeParams: true});
router.route('/')
/**x
 * @swagger
 * /v1/users/{userId}/purchase-history:
 *  get:
 *    summary: "get the purchase history of the user."
 *    tags:
 *      - "User Purchased History"
 *    security:
 *      - userBearerAuth: []
 *      - adminBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/User/id'
 *      - $ref: '#/components/requestQuery/pageNo'
 *      - $ref: '#/components/requestQuery/limit'
 *      - $ref: '#/components/requestQuery/searchText'
 *    responses:
 *      '200':
 *        $ref: '#/components/responseBody/PurchaseHistories'
 */
  .get(controller.purchaseHistoryListRoute)
router.route('/:purchasedProductId')
/**
 * @swagger
 * /v1/users/{userId}/purchase-history/{purchaseHistoryId}:
 *  get:
 *    summary: "get the purchase history of the user."
 *    tags:
 *      - "User Purchased History"
 *    security:
 *      - userBearerAuth: []
 *      - adminBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/User/id'
 *      - $ref: '#/components/requestParams/PurchaseHistory/_id'
 *    responses:
 *      '200':
 *        $ref: '#/components/responseBody/PurchaseHistory'
 */
  .get(controller.purchaseHistoryDetailsRoute)
export default router;
