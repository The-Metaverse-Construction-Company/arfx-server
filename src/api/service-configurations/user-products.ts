import {
  CreateUserProductsService,
  UserProductDetailsService,
  UserProductsListService
} from '../domain/services/user-products'

import {
  UserProductRepository
} from '../../app-plugins/persistence/repository'

export const createUserProductsService = () => (
  new CreateUserProductsService({
    repositoryGateway: new UserProductRepository()
  })
)
export const userProductDetailsService = () => (
  new UserProductDetailsService({
    repositoryGateway: new UserProductRepository()
  })
)
export const userProductsListService = () => (
  new UserProductsListService({
    repositoryGateway: new UserProductRepository()
  })
)