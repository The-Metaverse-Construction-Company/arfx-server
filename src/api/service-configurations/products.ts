import fs from 'fs'
/**
 * @services
 */
import {
  CreateProductService,
  ProductListService,
  UpdateProduct,
  ProductDetailService,
  RemoveProductService,
  UpdateProductPublishStatusService,
  // UpdateProductURLService,
  UploadProductBlobService,
  UpdateProductPurchaseCountService,
  UpdateProductBlobService,
  FeaturedProductListService
} from '../domain/services/products'
/**
 * @repository
 */
import {
  ProductRepository
} from '../../app-plugins/persistence/repository'
/**
 * @helper
 */
import BlobStorage from '../helper/blob-storage'
import ProductImageResize from '../helper/image-resize'
import generateGIFFromVideo from '../helper/gif-generator'
import { validateProductTotalPrice } from '../helper/validate-product-total-price'
export const uploadProductBlobService = () => (
  new UploadProductBlobService({
    fileUploader: BlobStorage,
    imageResizer: ProductImageResize,
    repositoryGateway: new ProductRepository(),
    generateGifFromVideo: generateGIFFromVideo
  })
)
export const updateProductBlobService = () => (
  new UpdateProductBlobService({
    uploadProductBlobService: uploadProductBlobService(),
    productDetailService: productDetailService(),
    repositoryGateway: new ProductRepository(),
    fileSystem: {
      removeOne: (filepath: string) => {
        fs.unlinkSync(filepath)
      }
    }
  })
)

export const createProduct = () => (
  new CreateProductService({
    repositoryGateway: new ProductRepository(),
    uploadProductBlobService: uploadProductBlobService(),
    validateProductTotalAmount: validateProductTotalPrice
  })
)
export const updateProduct = () => (
  new UpdateProduct({
    repositoryGateway: new ProductRepository(),
    uploadProductBlobService: uploadProductBlobService(),
    validateProductTotalAmount: validateProductTotalPrice
  })
)
export const productList = () => (
  new ProductListService({
    repositoryGateway: new ProductRepository()
  })
)
export const featuredProductList = () => (
  new FeaturedProductListService({
    repositoryGateway: new ProductRepository()
  })
)
export const productDetailService = () => (
  new ProductDetailService({
    repositoryGateway: new ProductRepository()
  })
)
export const removeProductService = () => (
  new RemoveProductService({
    repositoryGateway: new ProductRepository()
  })
)
export const updateProductPublishStatus = () => (
  new UpdateProductPublishStatusService({
    repositoryGateway: new ProductRepository()
  })
)
export const updateProductPurchaseCountService = () => (
  new UpdateProductPurchaseCountService({
    productDetailService: productDetailService(),
    repositoryGateway: new ProductRepository()
  })
)
// export const updateProductURLService = () => (
//   new UpdateProductURLService({
//     repositoryGateway: new ProductRepository()
//   })
// )