import {body} from 'express-validator'
import {productDetails} from '../service-configurations/products'
  // POST /v1/auth/register

const productIdValidation = async (productId: string, {req}: any) => {
  try {
    // validate productId
    await productDetails().findOne(productId).catch(() => {
      throw new Error('No product found on given productId.')
    })
    return true
  } catch (error) {
    throw error
  }
}
export const FormPipeline = [
  body('productId')
    .isString()
    .bail()
    .custom(productIdValidation),
  body('indexNo')
    .isInt({min: 0, max: 50})
]