import httpStatus from 'http-status'
import {
  Response, Request, NextFunction
} from 'express'
import {
  purchaseProductService
} from '../service-configurations/purchase-history'

import { successReponse } from '../helper/http-response'
import { IUserEntity } from '../domain/entities/users';
/**
 * @public
 * create a product
 * @requestBody
 *  @field: title: string
 *  @field: description: string
 *  @field: price: float
 *  @field: name: string
 */
export const purchaseProductRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id = ''} = <IUserEntity>req.user
    const newPurchaseHistory = await purchaseProductService()
      .purchaseOne(_id, req.body)
    res.status(httpStatus.CREATED)
      .json(successReponse(newPurchaseHistory))
  } catch (error) {
    next(error)
  }
};