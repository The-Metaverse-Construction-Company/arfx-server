import PaymentGateway from '../../config/payment-gateway'
import httpStatus from 'http-status'
import {
  Response, Request, NextFunction
} from 'express'
import {
  createFeaturedProductService,
  featuredProductListService,
  updateFeaturedProductService,
  removeFeaturedProductService
} from '../service-configurations/product-banner'
import { successReponse } from '../helper/http-response'
import { IUserEntity } from '../domain/entities/users'
/**
 * @public
 * get the list of the product banner
 * @requestQuery
 *  @field => pageNo: number // number of the page
 *  @field => limit: number // number of list needed to be display/return
 *  @field => searchText: string
 */
export const featuredProductListRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const featuredProduct = await featuredProductListService()
      .getList(req.query)
    res.status(httpStatus.OK)
      .json(successReponse(featuredProduct))
    return
  } catch (error) {
    console.log('object :>> ', error);
    next(error)
  }
};
/**
 * @public
 * create the product banner
 * @requestBody
 *  @field => productId: string
 *  @field => active: boolean
 *  @field => indexNo: number 
 */
export const createFeaturedProductRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id: adminId = ''} = <IUserEntity>req.user
    const featuredProduct = await createFeaturedProductService()
      .createOne({
        ...req.body,
        adminAccountId: adminId
      })
    res.status(httpStatus.CREATED)
      .json(successReponse(featuredProduct))
    return
  } catch (error) {
    console.log('object :>> ', error);
    next(error)
  }
};
/**
 * @public
 * create the product banner
 * @requestParams
 *  @field => featuredProductId: string
 * @requestBody
 *  @field => productId: string
 *  @field => active: boolean
 *  @field => indexNo: number 
 */
export const updateFeaturedProductRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id: adminId = ''} = <IUserEntity>req.user
    const {featuredProductId = ''} = req.params
    const featuredProduct = await updateFeaturedProductService()
      .updateOne(featuredProductId, {
        ...req.body,
        adminAccountId: adminId
      })
    res.status(httpStatus.ACCEPTED)
      .json(successReponse(featuredProduct))
    return
  } catch (error) {
    console.log('object :>> ', error);
    next(error)
  }
};
/**
 * @public
 * create the product banner
 * @requestParams
 *  @field => featuredProductId: string
 */
export const removeFeaturedProductRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id: adminId = ''} = <IUserEntity>req.user
    const {featuredProductId = ''} = req.params
    const featuredProduct = await removeFeaturedProductService()
      .removeOne(featuredProductId)
    res.status(httpStatus.ACCEPTED)
      .json(successReponse(featuredProduct))
    return
  } catch (error) {
    console.log('object :>> ', error);
    next(error)
  }
};