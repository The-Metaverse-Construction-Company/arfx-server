import express from 'express'
import * as controller from '../../../controllers/payment-card.controller'
const router = express.Router({mergeParams: true});
/**
 * @swagger
 * /v1/users/{userId}/settings/payment-card/set-up:
 *  post:
 *    summary: "Setup payment/bank card. This will generate a stripe customer \"client_secret\" then will save it using @stripe/stripe-js \"confirmCardSetup\" API with \
 *      \"payment_method\" properties with a value came from @stripe/react-stripe-js->CardElement which is where you will put the card details."
 *    tags:
 *      - "User Settings"
 *    security:
 *      - userBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/User/id'
 *    requestBody:
 *      - 
 *    responses:
 *      '200':
 *        description: Stripe Payment Object
 */
router.route('/set-up')
  .post(controller.createCustomerIntent)
router.route('/payment-methods')
/**
 * @swagger
 * /v1/users/{userId}/settings/payment-card/payment-methods:
 *  get:
 *    summary: "Get the payment methods of the users."
 *    tags:
 *      - "User Settings"
 *    security:
 *      - userBearerAuth: []
 *      - adminBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/User/id'
 *    responses:
 *      '200':
 *        description: Stripe Payment Object
 */
  .get(controller.getCustomerPaymentMethods)
router.route('/payment-methods/:paymentMethodId')
/**
 * @swagger
 * /v1/users/{userId}/settings/payment-card/payment-methods/{paymentMethodId}:
 *  delete:
 *    summary: "delete the specific payment method attached to the user"
 *    tags:
 *      - "User Settings"
 *    security:
 *      - userBearerAuth: []
 *      - adminBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/User/id'
 *      - $ref: '#/components/requestParams/User/paymentMethodId'
 *    responses:
 *      '200':
 *        description: Stripe Payment Object
 */
  .delete(controller.detachPaymentMethodToCustomer)
  // .get(validate(PurchaseValidation), controller.getCustomerPaymentMethods)

export default router;
