import {param, body} from 'express-validator'
import {extractValue} from 'ts-enum-extractor'
import {
  IProdutBody, PRODUCT_BLOB_TYPE
} from '../domain/entities/product'
const AvailableBlobType = extractValue(PRODUCT_BLOB_TYPE)
  // POST /v1/auth/register
export const ProductFormValidationPipeline = [
  body('name')
    .isString()
    .withMessage('name must be string.'),
  body('title')
    .isString()
    .withMessage('title must be string.'),
  body('description')
    .isString()
    .withMessage('description must be string.'),
  body('price')
    .isFloat({
      min: 1,
      max: 100000
    })
    .withMessage('price must be numeric with 2 decimal places and with minimum 1 and maximum 100,000 value.'),
  body('published')
    .isBoolean()
    .withMessage('published must be boolean.')
    .optional(),
  body('discountPercentage')
    .isFloat({
      min: 0,
      max: 1
    })
    .withMessage('discountPercentage must be numeric with 2 decimal places.')
    .optional(),
]
export const UpdateProductValidation = ProductFormValidationPipeline
export const UpdateProductPublishValidation = [
  body('status')
    .isBoolean()
]
export const RemoveProductValidation = [
  param('productId')
    .isString()
]
export const ProductBlobTypeValidationPipeline = [
  param('blobType')
  .isIn(AvailableBlobType)
  .withMessage(`Invalid blob type. is either ${AvailableBlobType.join(', ')} of this only.`)
]