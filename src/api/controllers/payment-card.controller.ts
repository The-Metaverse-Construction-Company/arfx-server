import PaymentGateway from '../../config/payment-gateway'
import httpStatus from 'http-status'
import {
  Response, Request, NextFunction
} from 'express'
import {
  userDetails
} from '../service-configurations/users'
import Stripe from 'stripe'
import { STRIPE_SECRET_KEY } from '../utils/constants'
import { successReponse } from '../helper/http-response'
import { IUserEntity } from '../domain/entities/users'
const stripe = new Stripe(STRIPE_SECRET_KEY, {typescript: true, apiVersion: "2020-08-27"})

/**
 * Create a payment intent that tied thru the customer account on stripe.
 * reference: https://stripe.com/docs/payments/save-and-reuse
 * @requestParams
 *  @field -> userId: string
 */
export const createCustomerIntent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const {userId} = req.params
    const {_id: userId = '', stripeCustomerId = ''} = <IUserEntity>req.user
    const intentSecret = await PaymentGateway.customer.setupIntents(stripeCustomerId)
    res.status(httpStatus.CREATED).send(successReponse(intentSecret.client_secret))
    return
  } catch (error) {
    console.log('object :>> ', error);
    next(error)
  }
};
/**
 * Get the payment method list assigned to the customer.
 * reference: https://stripe.com/docs/payments/save-and-reuse
 * @requestParams
 *  @field -> userId: string
 */
export const getCustomerPaymentMethods = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {userId} = req.params
    const {stripeCustomerId = ''} = <IUserEntity>req.user
    const paymentMethodList = await PaymentGateway.customer.getPaymentMethods(stripeCustomerId)
    res.status(httpStatus.OK).send(successReponse(paymentMethodList))
    return
  } catch (error) {
    console.log('object :>> ', error);
    next(error)
  }
};
