
import {
  IUserProductsRepositoryGateway,
  IUserProductsEntity
} from '../../../api/domain/entities/user-products'
import {
  default as UserProductsRepositoryModel,
  IUserProductsRepositoryModel
} from './models/user-products.model'

import GeneralRepository from './General.Gateway'
import { IPaginationParameters, IAggregatePaginationResponse } from '../../../api/domain/interfaces/general-repository-gateway'

export class UserProductRepository extends GeneralRepository<IUserProductsEntity, IUserProductsRepositoryModel> implements IUserProductsRepositoryGateway {
  constructor () {
    super(UserProductsRepositoryModel)
  }
  public getPaginationList = async (userId: string, filterQuery: IPaginationParameters) => {
    return this.aggregateWithPagination([
      {
        $match: {
          userId: userId
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ], filterQuery)
  }

}