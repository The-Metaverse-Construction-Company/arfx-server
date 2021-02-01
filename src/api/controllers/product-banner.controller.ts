import PaymentGateway from '../../config/payment-gateway'
import httpStatus from 'http-status'
import {
  Response, Request, NextFunction
} from 'express'
import {
  createProductBannerService,
  productBannerListService,
  updateProductBannerService,
  removeProductBannerService
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
export const productBannerListRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productBanner = await productBannerListService()
      .getList(req.query)
    res.status(httpStatus.OK)
      .json(successReponse(productBanner))
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
export const createProductBannerRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id: adminId = ''} = <IUserEntity>req.user
    const productBanner = await createProductBannerService()
      .createOne({
        ...req.body,
        adminAccountId: adminId
      })
    res.status(httpStatus.CREATED)
      .json(successReponse(productBanner))
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
 *  @field => productBannerId: string
 * @requestBody
 *  @field => productId: string
 *  @field => active: boolean
 *  @field => indexNo: number 
 */
export const updateProductBannerRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id: adminId = ''} = <IUserEntity>req.user
    const {productBannerId = ''} = req.params
    const productBanner = await updateProductBannerService()
      .updateOne(productBannerId, {
        ...req.body,
        adminAccountId: adminId
      })
    res.status(httpStatus.ACCEPTED)
      .json(successReponse(productBanner))
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
 *  @field => productBannerId: string
 */
export const removeProductBannerRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id: adminId = ''} = <IUserEntity>req.user
    const {productBannerId = ''} = req.params
    const productBanner = await removeProductBannerService()
      .removeOne(productBannerId)
    res.status(httpStatus.ACCEPTED)
      .json(successReponse(productBanner))
    return
  } catch (error) {
    console.log('object :>> ', error);
    next(error)
  }
};