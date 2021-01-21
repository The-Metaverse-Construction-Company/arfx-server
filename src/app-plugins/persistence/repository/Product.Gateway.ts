
import {
  IProductRepositoryGateway,
  IProductEntity
} from '../../../api/domain/entities/product'
import {
  default as ProductRepositoryModel,
  IProductRepository
} from './models/product.model'

import GeneralRepository from './General.Gateway'

export class ProductRepository extends GeneralRepository<IProductEntity, IProductRepository> implements IProductRepositoryGateway {
  constructor () {
    super(ProductRepositoryModel)
  }
}