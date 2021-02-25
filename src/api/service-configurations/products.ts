/**
 * @services
 */
import {
  CreateProductService,
  ProductList,
  UpdateProduct,
  ProductDetails,
  RemoveProduct,
  UpdateProductPublishStatus,
  // UpdateProductURLService,
  UploadProductBlobService,
  UpdateProductPurchaseCountService,
  UpdateProductBlobService
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
import { validateProductTotalPrice } from '../helper/validate-product-total-price'
export const uploadProductBlobService = () => (
  new UploadProductBlobService({
    fileUploader: BlobStorage,
    imageResizer: ProductImageResize,
    repositoryGateway: new ProductRepository(),
  })
)
export const updateProductBlobService = () => (
  new UpdateProductBlobService({
    uploadProductBlobService: uploadProductBlobService(),
    repositoryGateway: new ProductRepository(),
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
  new ProductList({
    repositoryGateway: new ProductRepository()
  })
)
export const productDetails = () => (
  new ProductDetails({
    repositoryGateway: new ProductRepository()
  })
)
export const removeProduct = () => (
  new RemoveProduct({
    repositoryGateway: new ProductRepository()
  })
)
export const updateProductPublishStatus = () => (
  new UpdateProductPublishStatus({
    repositoryGateway: new ProductRepository()
  })
)
export const updateProductPurchaseCountService = () => (
  new UpdateProductPurchaseCountService({
    repositoryGateway: new ProductRepository()
  })
)
// export const updateProductURLService = () => (
//   new UpdateProductURLService({
//     repositoryGateway: new ProductRepository()
//   })
// )