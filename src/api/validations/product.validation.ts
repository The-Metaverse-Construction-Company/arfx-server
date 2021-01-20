import Joi from 'joi'
import {
  IProdutBody
} from '../domain/entities/product'
  // POST /v1/auth/register
export const CreateProductValidation = <{body: Record<keyof IProdutBody, any>}>{
  body: {
    name: Joi
      .string()
      .required(),
    title: Joi.string()
      .required(),
    description: Joi.string()
      .required(),
    price: Joi.number()
      .min(1)
      .max(100000) // limit price to $100k
      .required(),
    published: Joi.boolean()
  },
}
export const UpdateProductValidation = CreateProductValidation
export const UpdateProductPublishValidation = {
  body: {
    status: 
      Joi.boolean()
      .required()
  }
}
export const RemoveProductValidation = {
  params: {
    productId: 
      Joi.string()
      .required()
  }
}
export const ProductListValidation = {
  query: {
    searchText:
      Joi.string(),
    limitTo:
      Joi.number(),
    startAt:
      Joi.number(),
  }
}