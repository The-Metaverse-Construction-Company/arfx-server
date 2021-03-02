/**
 * @libraries
 */
import httpStatus from 'http-status';
import {Request, Response, NextFunction, Router} from 'express'
/**
 * @configs
 */
import {stripe} from '../../config/payment-gateway'
/**
 * @domain
 */
import { PURCHASE_HISTORY_STATE } from '../domain/entities/purchase-history';
/**
 * @services
 */
import {updatePurchasePaymentChargeService, updatePurchaseStateService} from '../service-configurations/purchase-history'
/**
 * @env_variables
 */
import { STRIPE_WH_SECRET } from '../../config/vars';
/**
 * a middleware guard to validate if the request is really coming from stripe.
 */
export const paymentGatewayWebhookMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  const stripeSignature = request.headers['stripe-signature'] as string
  const webhooksSecret = STRIPE_WH_SECRET
  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, stripeSignature, webhooksSecret)
    next()
  } catch (error) {
    response.sendStatus(httpStatus.FORBIDDEN)
  }
}
/**
 * payment webhook to update the transaction state
 */
export const paymentGatewayWebhookRoute = (request: Request, response: Response) => {
  let event = request.body;
  new Promise((resolve, reject) => {
    switch (event.type) {
      case 'payment_intent.failed':
        resolve(updatePurchaseStateService()
          .updateOne(event.data.object.id, event.data.object.payment_method, PURCHASE_HISTORY_STATE.FAILED))
        break;
      case 'payment_intent.payment_failed':
        resolve(updatePurchaseStateService()
          .updateOne(event.data.object.id, event.data.object.last_payment_error.payment_method.id, PURCHASE_HISTORY_STATE.FAILED))
        break;
      case 'payment_intent.succeeded':
        resolve(updatePurchaseStateService()
          .updateOne(event.data.object.id, event.data.object.payment_method, PURCHASE_HISTORY_STATE.COMPLETED))
        break;
      case 'charge.succeeded':
        resolve(updatePurchasePaymentChargeService()
          .updateOne(event.data.object.payment_intent, event.data.object.id))
        break;
      case 'charge.failed':
        resolve(updatePurchasePaymentChargeService()
          .updateOne(event.data.object.payment_intent, event.data.object.id))
        resolve(true)
        break;
      default:
        resolve(false)
        break;
    }
  })
  .then(() => {
    response.sendStatus(httpStatus.OK)
  })
  .catch(() => {
    response.sendStatus(httpStatus.BAD_REQUEST)
  })
}