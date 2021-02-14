import httpStatus from 'http-status'
import {
  Response, Request, NextFunction
} from 'express'
import {
  createUserProductsService,
  userProductDetailsService,
  userProductsListService
} from '../service-configurations/user-products'

import { errorResponse, successReponse } from '../helper/http-response'
import { IUserEntity } from '../domain/entities/users';
/**
 * @public
 * create user product
 * @requestBody
 *  @field: title: string
 *  @field: description: string
 *  @field: productId: string
 *  @field: name: string
 */
export const createUserProductRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id = ''} = <IUserEntity>req.user
    const newUserProduct = await createUserProductsService()
      .createOne({
        ...req.body,
        userId: _id
      })
    res.status(httpStatus.CREATED)
      .json(successReponse(newUserProduct))
  } catch (error) {
    next(error)
  }
};
/**
 * @public
 * get user product details route
 * @requestParams
 *  @field: userProductId: string // id of the user product.
 */
export const userProductDetailsRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id = ''} = <IUserEntity>req.user
    const {userProductId = ''} = req.params
    const userProduct = await userProductDetailsService()
      .getOne(_id, userProductId)
    res.status(httpStatus.OK)
      .json(successReponse(userProduct))
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST)
      .json(errorResponse([error.message]))
  }
};
/**
 * @public
 * get user product details route
 * @requestQuery
 *  @field: pageNo: number // page number of the lists
 *  @field: limit: number // limit of the list item.
 *  @field: searchText: string // string search.
 */
export const userProductListRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id = ''} = <IUserEntity>req.user
    const userProductList = await userProductsListService()
      .getList(_id, req.query)
    res.status(httpStatus.OK)
      .json(successReponse(userProductList))
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST)
      .json(errorResponse([error.message]))
  }
};