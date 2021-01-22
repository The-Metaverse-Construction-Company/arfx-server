import Stripe from 'stripe'
import { IChargeCustomerPaymentParams } from '../api/domain/services/purchase-history'
import { STRIPE_SECRET_KEY } from '../api/utils/constants'
// initiate Stripe API
const stripe = new Stripe(STRIPE_SECRET_KEY, {typescript: true, apiVersion: "2020-08-27"})
export default {
  customer: {
    create: async (data: {name: string, email: string}) => {
      const newCustomer = await stripe.customers.create({
        email: data.email,
        name: data.name
      })
      return newCustomer.id
    },
    charge: async (data: IChargeCustomerPaymentParams) => {
      try {
        return stripe.paymentIntents.create({
          amount: data.amount * 100, //
          currency: "usd",
          customer: data.customerId,
          payment_method: data.paymentMethodId,
          off_session: true,
          confirm: true,
          description: "Purchase product from ARFX."
        })
        .then((paymentIntent) => {
          return {
            authenticated: true,
            paymentIntent
          }
        })
        .catch(async (err) => {
          // if charging customer card failed, then retrieve the payment intent then return it thru client side,
          // payment gateway will have a api for confirming the payment on the client side.
          // reference: https://stripe.com/docs/payments/save-and-reuse#web-create-payment-intent-off-session
          console.log('errerrerrerr to charge customer :>> Error: ', err);
          const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
          return {
            authenticated: false,
            paymentIntent: paymentIntentRetrieved
          }
        })
      } catch (err) {
        console.log('failed to charge customer :>> Error: ', err);
        throw err
      }
    },
    setupIntents: async (stripeCustomerId: string) => {
      const intentSecret = await stripe.setupIntents.create({
        customer: stripeCustomerId
      })
      return intentSecret
    },
    getPaymentMethods: async (stripeCustomerId: string) => {
      const paymentMethodList = await stripe.paymentMethods.list({
        customer: stripeCustomerId,
        type: "card"
      })
      return paymentMethodList
    }
  }
}