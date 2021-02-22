import {Request, Response, NextFunction, Router} from 'express'
import {stripe} from '../../config/payment-gateway'
import httpStatus from 'http-status';
import { PURCHASE_HISTORY_STATE } from '../domain/entities/purchase-history';
import {updatePurchasePaymentChargeService, updatePurchaseStateService} from '../service-configurations/purchase-history'
import { STRIPE_WH_SECRET } from '../utils/constants';

const app = Router({mergeParams: true})
export const paymentGatewayWebhookMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  const stripeSignature = request.headers['stripe-signature'] as string
  const webhooksSecret = `whsec_c1BWtxolzoOAqMmF2RCMnt3iSL658swc`
  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, stripeSignature, webhooksSecret)
    next()
  } catch (error) {
    response.sendStatus(httpStatus.FORBIDDEN)
  }
}
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
app.post('/webhook', )
export default app