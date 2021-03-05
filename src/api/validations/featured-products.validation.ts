import {body} from 'express-validator'
import {productDetailService} from '../service-configurations/products'
  // POST /v1/auth/register

const productIdValidation = async (productId: string, {req}: any) => {
  try {
    // validate productId
    await productDetailService()
      .findOne(productId)
      .catch(() => {
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