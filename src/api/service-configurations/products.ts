import {
  CreateProduct,
  ProductList,
  UpdateProduct,
  ProductDetails,
  RemoveProduct,
  UpdateProductPublishStatus
} from '../domain/services/products'

import {
  ProductRepository
} from '../../app-plugins/persistence/repository'

export const createProduct = () => (
  new CreateProduct({
    repositoryGateway: new ProductRepository()
  })
)
export const updateProduct = () => (
  new UpdateProduct({
    repositoryGateway: new ProductRepository()
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