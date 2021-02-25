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
import AppError from '../utils/response-error'
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
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
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
    const {stripeCustomerId = ''} = <IUserEntity>req.user
    const paymentMethodList = await PaymentGateway.customer.paymentMethod.list(stripeCustomerId)
    res.status(httpStatus.OK).send(successReponse(paymentMethodList))
    return
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
  }
};
export const detachPaymentMethodToCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {stripeCustomerId = ''} = <IUserEntity>req.user
    const { paymentMethodId = '' } = req.params 
    const paymentMethodList = await PaymentGateway.customer.paymentMethod.detach(paymentMethodId)
    res.status(httpStatus.OK).send(successReponse(paymentMethodList))
    return
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
  }
};
