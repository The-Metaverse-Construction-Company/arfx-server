
import {
  IUserProductsRepositoryGateway,
  IUserProductsEntity
} from '../../../api/domain/entities/user-products'
import {
  default as UserProductsRepositoryModel,
  IUserProductsRepositoryModel
} from './models/user-products.model'

import GeneralRepository from './General.Gateway'

export class UserProductRepository extends GeneralRepository<IUserProductsEntity, IUserProductsRepositoryModel> implements IUserProductsRepositoryGateway {
  constructor () {
    super(UserProductsRepositoryModel)
  }
}