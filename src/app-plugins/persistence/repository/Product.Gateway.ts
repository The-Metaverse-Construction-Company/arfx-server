
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

export class ProductRepository extends GeneralRepository<IProductRepository, IProductEntity> implements IProductRepositoryGateway {
  constructor () {
    super(ProductRepositoryModel)
  }
  /**
   * get the list of products/scene
   * @param userId to display if the user already owned the product.
   * @param filterQuery 
   */
  public getPaginationList = async (userId: string, filterQuery: IPaginationParameters) => {
    try {
      const response = await this.aggregateWithPagination([
        // {
        //   $match: {
        //     published: true
        //   }
        // },
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
            as: 'userProducts'
          }
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: true,
            path: '$userProducts',

          }
        },
        {
          $addFields: {
            userId: {
              $ifNull: ["$userProducts.userId", '']
            },
          }
        },
        {
          $addFields: {
            hasOwned: {
              $cond: [{$ne: ['$userId', '']}, true, false]
            },
          }
        },
        {
          $project: {
            userId: 0,
            userProducts: 0,
            contentZip: 0,
            previewImage: {
              originalFilepath: 0
            },
            previewVideo: {
              originalFilepath: 0
            },
            thumbnail: {
              originalFilepath: 0
            },
          }
        }
      ], {
        ...filterQuery,
      })
      return response
    } catch (error) {
      throw error
    }
  }
}