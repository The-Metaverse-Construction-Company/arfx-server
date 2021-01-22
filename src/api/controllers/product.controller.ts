import httpStatus from 'http-status'
import {
  Response, Request, NextFunction
} from 'express'
import {
  createProduct,
  productList,
  updateProduct,
  productDetails,
  removeProduct,
  updateProductPublishStatus
} from '../service-configurations/products'

import { successReponse } from '../helper/http-response'
/**
 * @public
 * create a product
 * @requestBody
 *  @field: title: string
 *  @field: description: string
 *  @field: price: float
 *  @field: name: string
 */
export const createProductRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newProduct = await createProduct()
      .createOne(req.body)
    res.status(httpStatus.CREATED)
      .json(successReponse(newProduct))
  } catch (error) {
    next(error)
  }
};
/**
 * @public
 * create a product
 * @requestParams
 *  @field -> productId: string
 * @requestBody
 *  @field: title: string
 *  @field: description: string
 *  @field: price: float
 *  @field: name: string
 */
export const updateProductRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {productId = ''} = req.params
    const updatedProduct = await updateProduct()
      .updateOne(productId, req.body)
    res.status(httpStatus.ACCEPTED)
      .json(successReponse(updatedProduct))
  } catch (error) {
    next(error)
  }
};
/**
 * @public
 * product list
 * @requestQuery
 *  @field -> searchText: string
 *  @field -> startAt: number
 *  @field -> limitTo: number
 */
export const productListRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      searchText = '',
      startAt = 0,
      limitTo = 0
    } = req.query
    const newProduct = await productList()
      .getList({
        searchText,
        startAt,
        limitTo
      })
    res.status(httpStatus.OK)
      .json(successReponse(newProduct))
  } catch (error) {
    next(error)
  }
};
/**
 * @public
 * product list
 * @requestParams
 *  @field -> productId: string
 */
export const productDetailsRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      productId = ''
    } = req.params
    const product = await productDetails()
      .findOne(productId)
    res.status(httpStatus.OK)
      .json(successReponse(product))
  } catch (error) {
    next(error)
  }
};
/**
 * @public
 * product list
 * @requestParams
 *  @field -> productId: string
 */
export const updateProductPublishStatusRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      productId = ''
    } = req.params
    const {
      status = true
    } = req.body
    const product = await updateProductPublishStatus()
      .updateOne(productId, status)
    res.status(httpStatus.ACCEPTED)
      .json(successReponse(product))
  } catch (error) {
    next(error)
  }
};
/**
 * @public
 * product list
 * @requestParams
 *  @field -> productId: string
 */
export const removeProductRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      productId = ''
    } = req.params
    const product = await removeProduct()
      .removeOne(productId)
    res.status(httpStatus.ACCEPTED)
      .json(successReponse(product))
  } catch (error) {
    next(error)
  }
};