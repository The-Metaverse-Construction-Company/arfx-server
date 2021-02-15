import {
  body
} from 'express-validator'
export const PurchaseProductValidationPipeline = [
  body('productId')
    .isString()
    .withMessage('must be a string.'),
  body('keepCardDetails')
    .isBoolean()
    .withMessage('must be a boolean.')
    .optional()
]