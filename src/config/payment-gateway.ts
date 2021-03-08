import Stripe from 'stripe'
import { IChargeCustomerPaymentParams } from '../api/domain/services/purchase-history'
import { STRIPE_SECRET_KEY } from './vars'
// initiate Stripe API
export const stripe = new Stripe(STRIPE_SECRET_KEY, {typescript: true, apiVersion: "2020-08-27"})
export default {
  customer: {
    create: async (data: {name: string, email: string}) => {
      const newCustomer = await stripe.customers.create({
        email: data.email,
        name: data.name
      })
      return newCustomer.id
    },
    setupIntents: async (stripeCustomerId: string) => {
      const intentSecret = await stripe.setupIntents.create({
        customer: stripeCustomerId
      })
      return intentSecret
    },
    paymentMethod: {
      detach: async (pmId: string) => {
        try {
          const paymentMethod = await stripe.paymentMethods.detach(pmId);
          return paymentMethod
        } catch (error) {
          console.log('failed to detach method ', error.message);
          throw error
        }
      },
      list: async (stripeCustomerId: string) => {
        try {
          const paymentMethodList = await stripe.paymentMethods.list({
            customer: stripeCustomerId,
            type: "card"
          })
          return paymentMethodList
        } catch (error) {
          console.log('failed to detach payment method ', error.message);
          throw error
        }
      },

    }
  },
  paymentIntent: {
    retrieve: async (paymentIntentId: string) => {
      try {
         // if charging customer card failed, then retrieve the payment intent then return it thru client side,
        // payment gateway will have a api for confirming the payment on the client side.
        // reference: https://stripe.com/docs/payments/save-and-reuse#web-create-payment-intent-off-session
        const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(paymentIntentId); //err.raw.payment_intent.id
        return {
          authenticated: false,
          paymentIntent: paymentIntentRetrieved
        }
      } catch (error) {
        throw error
      }
    },
    create: async (purchaseHistoryId: string, data: IChargeCustomerPaymentParams) => {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: data.amount * 100, // 
          currency: "usd",
          customer: data.customerId,
          metadata: {
            purchaseHistoryId,
          },
          // payment_method: data.paymentMethodId,
          // off_session: true,
          // confirm: true,
          description: "Purchased product from ARFX Home."
        }, {idempotencyKey: purchaseHistoryId})
        return paymentIntent
      } catch (err) {
        throw err
      }
    }
  },
  paymentMethod: {
    create: async (cardDetails: {number: string, exp_month: number, exp_year: number, cvc: string}) => {
      try {
        const paymentMethod = await stripe.paymentMethods.create({
          type: 'card',
          card: cardDetails,
          // payment_method: "pm_card_visa"          
        }); //err.raw.payment_intent.id
        return paymentMethod
      } catch (error) { 
        throw error
      }
    }
  }
}