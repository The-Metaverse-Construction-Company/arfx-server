import Joi, {ValidationOptions} from 'joi'
import {
  IPurchaseHistoryParams
} from '../domain/entities/purchase-history'
  // POST /v1/auth/register
export const PurchaseValidation = {
// export const PurchaseValidation = <{body: Record<keyof IPurchaseHistoryParams, ValidationOptions>}>{
  body: {
    // paymentMethodId: Joi
    //   .string()
    //   .required(),
    productId: Joi
      .string()
      .required(),
    keepCardDetails: Joi
      .boolean()
      .required(),
  },
}