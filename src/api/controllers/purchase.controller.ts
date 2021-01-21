import httpStatus from 'http-status'
import {
  Response, Request, NextFunction
} from 'express'
import {
  createPurchaseHistory
} from '../service-configurations/PurchaseHistory'

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
export const createPurchaseHistoryRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newPurchaseHistory = await createPurchaseHistory()
      .createOne(req.body)
    res.status(httpStatus.CREATED)
      .json(successReponse(newPurchaseHistory))
  } catch (error) {
    next(error)
  }
};