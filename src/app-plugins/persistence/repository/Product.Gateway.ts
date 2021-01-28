
import {
  IProductRepositoryGateway,
  IProductEntity
} from '../../../api/domain/entities/product'
import {
  default as ProductRepositoryModel,
  IProductRepository
} from './models/product.model'

import GeneralRepository from './General.Gateway'
import { IPaginationParameters } from '../../../api/domain/interfaces/general-repository-gateway'
import { COLLECTION_NAMES } from './constants/collection-names'

export class ProductRepository extends GeneralRepository<IProductEntity, IProductRepository> implements IProductRepositoryGateway {
  constructor () {
    super(ProductRepositoryModel)
  }

  public getPaginationList = async (userId: string, filterQuery: IPaginationParameters) => {
    try {
      const response = await this.aggregateWithPagination([
        {
          $match: {
            published: true
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $lookup: {
            from: COLLECTION_NAMES.USER_PRODUCT,
            let: {
              productId: '$_id'
            },
            pipeline: [
              {
                $match: {
                  // filter user products loggedIn user
                  userId: userId
                }
              },
              {
                $match: {
                  $expr: {
                    $eq: ['$$productId', '$productId']
                  }
                }
              },
              {
                $project: {
                  _id: 0,
                  userId: 1
                }
              }
            ],
            as: 'userId'
          }
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: true,
            path: '$userId',

          }
        },
        {
          $addFields: {
            userId: "$userId.userId"
          }
        },
        // {
        //   $project: {
        //     user_products: 0
        //   }
        // }
      ], {
        ...filterQuery,
      })
      return response
    } catch (error) {
      throw error
    }
  }
}