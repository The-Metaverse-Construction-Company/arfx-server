import httpStatus from 'http-status'
import path from 'path'
import fs from 'fs'
import Busboy from 'busboy'
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
import { IAdminAccountsEntity } from '../domain/entities/admin-accounts'
import { IUserEntity } from '../domain/entities/users'

const uploadPath = path.join(__dirname, '../../../uploaded');
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
    const {_id} = <IAdminAccountsEntity>req.user
    const newProduct = await createProduct()
      .createOne(req.body, _id)
    res.status(httpStatus.CREATED)
      .json(successReponse(newProduct))
  } catch (error) {
    next(error)
  }
};
/**
 * @public
 * create a product
 * @requestBody
 *  @field: title: string
 *  @field: description: string
 *  @field: price: float
 *  @field: name: string
 */
export const uploadProductImageRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const busboy = req.app.get('busboy')
    const busboy = new Busboy({ headers: req.headers })
    // req.pipe(req.busboy); // Pipe it trough busboy
    busboy.on('file', (fieldname: string, file: any, filename: string) => {
        console.log(`fieldname '${fieldname}' started`);
        console.log(`Upload of '${filename}' started`);
        file.on('data', function(data: any) {
          console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        });
        file.on('end', function() {
          console.log('File [' + fieldname + '] Finished');
        });
        // file.pipe(fstream);
        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(uploadPath, filename));
        // // Pipe it trough
        file.pipe(fstream);
        // // On finish of the upload
        fstream.on('close', () => {
            console.log(`Upload of '${filename}' finished`);
            // res.redirect('back');
        });
    });
    req.pipe(busboy);
    // const newProduct = await createProduct()
    //   .createOne(req.body)
    res.status(httpStatus.CREATED)
      .json(successReponse(req.body))
  } catch (error) {
    next(error)
  }
};
/**
 * @public
 */
export const upload = async (req: Request, res: Response, next: NextFunction) => {
  // try {
  // } catch (error) {
  //   next(error)
  // }
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
    const {_id = ''} = <IUserEntity>req.user
    const {
      searchText = '',
      startAt = 0,
      limitTo = 0
    } = req.query
    const newProduct = await productList()
      .getList({
        userId: _id,
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