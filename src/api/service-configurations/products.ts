import {
  CreateProductService,
  ProductList,
  UpdateProduct,
  ProductDetails,
  RemoveProduct,
  UpdateProductPublishStatus,
  UpdateProductURLService,
  UploadProductBlobService
} from '../domain/services/products'

import {
  ProductRepository
} from '../../app-plugins/persistence/repository'
import BlobStorage from '../helper/blob-storage'

export const uploadProductBlobService = () => (
  new UploadProductBlobService({
    fileUploader: BlobStorage
  })
)

export const createProduct = () => (
  new CreateProductService({
    repositoryGateway: new ProductRepository(),
    uploadProductBlobService: uploadProductBlobService()
  })
)
export const updateProduct = () => (
  new UpdateProduct({
    repositoryGateway: new ProductRepository(),
    uploadProductBlobService: uploadProductBlobService()
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
export const updateProductURLService = () => (
  new UpdateProductURLService({
    repositoryGateway: new ProductRepository()
  })
)