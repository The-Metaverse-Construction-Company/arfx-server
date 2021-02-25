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
import { errorResponse, successReponse } from '../helper/http-response'
import { IAdminAccountsEntity } from '../domain/entities/admin-accounts'
import { IUserEntity } from '../domain/entities/users'
import { IProductEntity, PRODUCT_BLOB_TYPE } from '../domain/entities/product'
import AppError from '../utils/response-error'

const removeProductOriginalFilepath = (product: IProductEntity) => {
  delete product.previewImage.originalFilepath;
  delete product.previewVideo.originalFilepath;
  delete product.contentZip.originalFilepath;
  delete product.thumbnail.originalFilepath;
  return product
}
// readStream.on('data', (chunk) => {
//   console.log('chunk :>> ', chunk);
// })
export const mapProductUploadedBlobRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {previewVideo = [], previewImage = [], contentZip = []} = <any> req.files || {};
    req.body['previewVideo'] = previewVideo.length >= 1 ? previewVideo[0].path : undefined
    req.body['previewImage'] = previewImage.length >= 1 ? previewImage[0].path : undefined
    req.body['contentZip'] = contentZip.length >= 1 ? contentZip[0].path : undefined
    next()
  } catch (error) {
    next(error)
  }
}
/**
 * @public
 * create a product
 * @requestBody
 *  @field: title: string
 *  @field: description: string
 *  @field: price: float
 *  @field: name: string
 *  @field: previewVideo: file/binary
 *  @field: previewImage: file/binary
 *  @field: contentZip: file/binary
 */
export const createProductRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id} = <IAdminAccountsEntity>req.user
    const newProduct = await createProduct()
      .createOne(req.body, _id)
    res.status(httpStatus.CREATED)
      .json(successReponse(removeProductOriginalFilepath(newProduct)))
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
  }
};
/**
 * @public
 * update a product by id
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
      .json(successReponse(removeProductOriginalFilepath(updatedProduct)))
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
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
    const {_id = '', isAdmin = false} = <any>req.user
    const newProduct = await productList()
      .getList({
        ...req.query,
        userId: !isAdmin ? _id : '',
      })
    res.status(httpStatus.OK)
      .json(successReponse(newProduct))
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
  }
};
/**
 * @public
 * product list
 * @requestParams
 *  @field -> productId: string
 */
export const productDetailsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      productId = ''
    } = req.params
    const product = await productDetails()
      .findOne(productId)
      // set productDetails on the response locals to access other routes.
    res.locals['productDetails'] = product
    next()
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
  }
};
export const productDetailsRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(httpStatus.OK)
      .json(successReponse(removeProductOriginalFilepath(res.locals['productDetails'])))
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
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
      .json(successReponse(removeProductOriginalFilepath(product)))
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
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
      .json(successReponse(removeProductOriginalFilepath(product)))
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
  }
};
/**
 * @public
 * product list
 * @requestParams
 *  @field -> productId: string
 */
export const downloadContentZipRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {blobType = ''} = req.params
    const product = <IProductEntity>res.locals['productDetails']
    const blobOriginalFilepath = <string>await ((blobType: string) => {
      return new Promise((resolve, reject) => {
        switch (blobType) {
          case PRODUCT_BLOB_TYPE.CONTENT_ZIP:
            resolve(product.contentZip.originalFilepath)
            break;
          case PRODUCT_BLOB_TYPE.PREVIEW_IMAGE:
            resolve(product.previewImage.originalFilepath)
            break;
          case PRODUCT_BLOB_TYPE.THUMBNAIL:
            resolve(product.thumbnail.originalFilepath)
            break;
          case PRODUCT_BLOB_TYPE.PREVIEW_VIDEO:
            resolve(product.previewVideo.originalFilepath)
            break;
          default:
            return ''
        }
      })
    })(blobType)
    if (!blobOriginalFilepath) {
      throw new Error('Invalid url')
    }
    res.sendFile(blobOriginalFilepath)
    return;
  } catch (error) {
    res
      .status(httpStatus.BAD_REQUEST)
      .send(errorResponse([error.message]))
  }
};