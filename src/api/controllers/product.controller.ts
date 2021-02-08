import httpStatus from 'http-status'
import fs from 'fs'
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
import { IProductEntity, PRODUCT_BLOB_TYPE } from '../domain/entities/product'
import ProductImageResize from '../helper/image-resize'

// readStream.on('data', (chunk) => {
//   console.log('chunk :>> ', chunk);
// })
export const mapProductUploadedBlobRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {previewVideo = [], previewImage = [], contentZip = []} = <any> req.files || {};
    res.locals['previewVideo'] = previewVideo.length >= 1 ? previewVideo[0].path : undefined
    res.locals['previewImage'] = previewImage.length >= 1 ? previewImage[0].path : undefined
    res.locals['contentZip'] = contentZip.length >= 1 ? contentZip[0].path : undefined
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
      .createOne({
        ...req.body,
        previewImage: res.locals['previewImage'],
        previewVideo: res.locals['previewVideo'],
        contentZip: res.locals['contentZip']
      }, _id)
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
    const scene = req.file
    // const {scene = {}} = <any>(req.files || {})
    // const busboy = req.app.get('busboy')
    const {productId = ''} = req.params
    const {productId: prodId} = req.body
    // blobStorage.upload(productId, scene).then((result) => {
    //   console.log('object :>> ', result);
    // }
    // )
    // .catch((err) => {
    //   console.log('err :>> ', err);
    // })
    // const busboy = new Busboy({ headers: req.headers })
    // // req.pipe(req.busboy); // Pipe it trough busboy
    // busboy.on('file', (fieldname: string, file: any, filename: string) => {
    //     console.log(`fieldname '${fieldname}' started`);
    //     console.log(`Upload of '${filename}' started`);
    //     file.on('data', function(data: any) {
    //       console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
    //     });
    //     file.on('end', function() {
    //       console.log('File [' + fieldname + '] Finished');
    //     });
    //     // file.pipe(fstream);
    //     // Create a write stream of the new file
    //     const fstream = fs.createWriteStream(getFilePath(filename));
    //     // // Pipe it trough
    //     file.pipe(fstream);
    //     fstream.on('finish', (err, file) => {
    //       console.log('err :>> ', err);
    //       console.log('file :>> ', file);
    //     })
    //     // // On finish of the upload
    //     fstream.on('close', async () => {
    //         console.log(`Upload of '${filename}' finished`);
    //         // console.log('fs.readFileSync(getFilePath(filename)) :>> ', fs.readFileSync(getFilePath(filename), 'base64'));
    //         // blobStorage.upload(productId, fs.readFileSync(getFilePath(filename), 'base64'))
    //         // await updateProductURLService()
    //         //   .updateOne(productId, getFilePath(filename))
    //         // res.redirect('back');
    //     });
    // });
    // req.pipe(busboy);
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
    const newProduct = await productList()
      .getList({
        ...req.query,
        userId: _id,
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
    next(error)
  }
};
export const productDetailsRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(httpStatus.OK)
      .json(successReponse(res.locals['productDetails']))
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
            const orgiFilepath = product.previewImage.originalFilepath.split('.')
            const blobType = orgiFilepath.pop()
            const height = 150, width=150;
            const newFilepath = `${orgiFilepath.join('.')}-${width}x${height}.${blobType}`
            ProductImageResize({
                filepath: product.previewImage.originalFilepath,
                height: 150,
                width: 150
            })
            .toFile(newFilepath)
            .then(() => {
              resolve(newFilepath)
              setTimeout(() => {
                // unlike or remove the newly created image after 1000.
                fs.unlinkSync(newFilepath)
              }, 1000)
            })
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
    console.log('blobOriginalFilepath :>> ', blobOriginalFilepath);
    // res.send(blobOriginalFilepath)
    res.sendFile(blobOriginalFilepath)
  } catch (error) {
    next(error)
  }
};