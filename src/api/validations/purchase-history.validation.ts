import Joi, {ValidationOptions} from 'joi'
import {
  IPurchaseHistoryBody
} from '../domain/entities/purchase-history'
  // POST /v1/auth/register
export const CreateProductValidation = <{body: Record<keyof IPurchaseHistoryBody, ValidationOptions>}>{
  body: {
    amount: Joi
      .number()
      .required(),
    discountPercentage: Joi
      .number()
      .required(),
    paymentMethodId: Joi
      .string()
      .required(),
    productId: Joi
      .string()
      .required(),
  },
}