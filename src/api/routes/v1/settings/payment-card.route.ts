import express from 'express'
import validate from 'express-validation'
import * as controller from '../../../controllers/payment-card.controller'
const router = express.Router({mergeParams: true});

router.route('/set-up')
  .post(controller.createCustomerIntent)
/**e
 * @swagger
 * /v1/users/{userId}/settings/payment-card/payment-methods:
 *  get:
 *    summary: "Get the payment methods of the users."
 *    tags:
 *      - "User-Settings"
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/User/id'
 *    responses:
 *      '200':
 *        description: Stripe Payment Object
 */
router.route('/payment-methods')
  .get(controller.getCustomerPaymentMethods)
  // .get(validate(PurchaseValidation), controller.getCustomerPaymentMethods)

export default router;
