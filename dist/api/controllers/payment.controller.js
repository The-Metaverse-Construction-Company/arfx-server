"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerPaymentMethods = exports.createCustomerIntent = void 0;
const http_status_1 = __importDefault(require("http-status"));
const stripe_1 = __importDefault(require("stripe"));
const constants_1 = require("../utils/constants");
const http_response_1 = require("../helper/http-response");
const stripe = new stripe_1.default(constants_1.STRIPE_SECRET_KEY, { typescript: true, apiVersion: "2020-08-27" });
/**
 * Create a payment intent that tied thru the customer account on stripe.
 * reference: https://stripe.com/docs/payments/save-and-reuse
 * @requestParams
 *  @field -> userId: string
 */
exports.createCustomerIntent = async (req, res, next) => {
    try {
        // const {userId} = req.params
        const { _id: userId = '', stripeCustomerId = '' } = req.user;
        // const user = await userDetails().findOne(userId)
        const intentSecret = await stripe.setupIntents.create({
            customer: stripeCustomerId
        });
        res.status(http_status_1.default.CREATED).send(http_response_1.successReponse(intentSecret.client_secret));
        return;
    }
    catch (error) {
        console.log('object :>> ', error);
        next(error);
    }
};
/**
 * Get the payment method list assigned to the customer.
 * reference: https://stripe.com/docs/payments/save-and-reuse
 * @requestParams
 *  @field -> userId: string
 */
exports.getCustomerPaymentMethods = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { stripeCustomerId = '' } = req.user;
        const paymentMethodList = await stripe.paymentMethods.list({
            customer: stripeCustomerId,
            type: "card"
        });
        res.status(http_status_1.default.OK).send(http_response_1.successReponse(paymentMethodList));
        return;
    }
    catch (error) {
        console.log('object :>> ', error);
        next(error);
    }
};
