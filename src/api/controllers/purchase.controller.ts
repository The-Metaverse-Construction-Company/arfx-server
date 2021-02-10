import httpStatus from 'http-status'
import {
  Response, Request, NextFunction
} from 'express'
import {
  purchaseProductService,
  purchaseHistoryList,
  purchaseHistoryDetails
} from '../service-configurations/purchase-history'

import { errorResponse, successReponse } from '../helper/http-response'
import { IUserEntity } from '../domain/entities/users';
/**
 * @public
 * purchase product
 * @requestBody
 *  @field: productId: string // _id field on the product entity.
 *  @field: paymentMethodId: string //pmId provided by payment gateway(stripe)
 *  @field: keepCardDetails: boolean
 */
export const purchaseProductRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id = ''} = <IUserEntity>req.user
    const newPurchaseHistory = await purchaseProductService()
      .purchaseOne(_id, req.body)
    res.status(httpStatus.CREATED)
      .json(successReponse(newPurchaseHistory))
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST)
      .json(errorResponse([error.message]))
  }
};
/**
 * @public
 * get purchase history.
 * @requestQuery
 *  @fields: 
 */
export const purchaseHistoryListRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id = ''} = <IUserEntity>req.user
    const newPurchaseHistory = await purchaseHistoryList()
      .getList(_id, req.query)
    res.status(httpStatus.CREATED)
      .json(successReponse(newPurchaseHistory))
  } catch (error) {
    next(error)
  }
};
/**
 * @public
 * get purchase history details
 * @requestParams
 *  @field: purchasedProductId: string
 */
export const purchaseHistoryDetailsRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id = ''} = <IUserEntity>req.user
    const {purchasedProductId = ''} = req.params
    const newPurchaseHistory = await purchaseHistoryDetails()
      .getOne(_id, purchasedProductId)
    res.status(httpStatus.CREATED)
      .json(successReponse(newPurchaseHistory))
  } catch (error) {
    next(error)
  }
};