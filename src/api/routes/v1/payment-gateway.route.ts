import bodyParser from 'body-parser'
import {Router} from 'express'
import {
  paymentGatewayWebhookMiddleware,
  paymentGatewayWebhookRoute
} from '../../controllers/payment-gateway.controller'
const app = Router({mergeParams: true})
app.post('/webhook',
  // paymentGatewayWebhookMiddleware, 
  paymentGatewayWebhookRoute
)

export default app