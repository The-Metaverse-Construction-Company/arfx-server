import {Request, NextFunction, Router} from 'express'
import PaymentGateway, {stripe} from '../../../config/payment-gateway'
import {
  purchaseProductService
} from '../../service-configurations/purchase-history'
import httpStatus from 'http-status';
import { PURCHASE_HISTORY_STATE } from '../../domain/entities/purchase-history';
import {updatePurchasePaymentChargeService, updatePurchaseStateService} from '../../service-configurations/purchase-history'
import { STRIPE_WH_SECRET } from '../../utils/constants';

const app = Router({mergeParams: true})
const middleware = async (request: Request, response: Response, next: NextFunction) => {
  const sig = request.headers['stripe-signature'] as string
  const endpointSecret = STRIPE_WH_SECRET
  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body.rawBody, sig, endpointSecret)
  } catch (error) {
    
  }
}
app.post('/webhook', (request, response) => {
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
})
app.post('/mock-cards', async (request, response) => {
  let {productId = '', cardDetails = []} = request.body;
  let state = -1
  const responsesData = []
  const userId = 'f1ff1c00-f22c-47aa-86f0-e8a4fde15c48'
  for (let card of cardDetails) {
    const result = await new Promise((resolve) => {
      setTimeout(() => {
        PaymentGateway.paymentMethod.create({
          cvc: "123",
          exp_month: 11,
          exp_year: 24,
          number: card
        })
        .then((paymentMethod) => {
          purchaseProductService()
            .purchaseOne(userId, {
              keepCardDetails: false,
              paymentMethodId: paymentMethod.id,
              productId: productId
            })
          resolve({
            success: true,
            card,
            result: 'success'
          })
        })
        .catch((err) => {
          resolve({
            success: false,
            card,
            result: err.message
          })
        })
      }, 1000)
    })
    responsesData.push(result)
  }
  response.send(responsesData)
})

export default app