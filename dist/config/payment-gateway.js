"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const constants_1 = require("../api/utils/constants");
// initiate Stripe API
const stripe = new stripe_1.default(constants_1.STRIPE_SECRET_KEY, { typescript: true, apiVersion: "2020-08-27" });
exports.default = {
    customer: {
        create: async (data) => {
            const newCustomer = await stripe.customers.create({
                email: data.email,
                name: data.name
            });
            return newCustomer.id;
        },
        charge: async (data) => {
            try {
                return stripe.paymentIntents.create({
                    amount: data.amount * 100,
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
                    };
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
                    };
                });
            }
            catch (err) {
                console.log('failed to charge customer :>> Error: ', err);
                throw err;
            }
        },
        setupIntents: async (stripeCustomerId) => {
            const intentSecret = await stripe.setupIntents.create({
                customer: stripeCustomerId
            });
            return intentSecret;
        },
        getPaymentMethods: async (stripeCustomerId) => {
            const paymentMethodList = await stripe.paymentMethods.list({
                customer: stripeCustomerId,
                type: "card"
            });
            return paymentMethodList;
        }
    }
};
