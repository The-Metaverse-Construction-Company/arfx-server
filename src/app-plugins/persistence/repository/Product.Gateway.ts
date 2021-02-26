
import {
  IProductRepositoryGateway,
  IProductEntity,
  IProductListFilterQuery,
  PRODUCT_STATES
} from '../../../api/domain/entities/product'
import {
  default as ProductRepositoryModel,
  IProductRepository
} from './models/product.model'

import GeneralRepository from './General.Gateway'
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
  public getPaginationList = async (userId: string, filterQuery: IProductListFilterQuery) => {
    try {
      const {isAdmin = false, showDeleted = false} = filterQuery
      let productStateQuery = <any>{}
      if (!isAdmin) {
        productStateQuery.state = PRODUCT_STATES.COMPLETED
      }
      if (!showDeleted) {
        productStateQuery.deleted = true
      }
      const response = await this.aggregateWithPagination([
        {
          $match: {
            ...productStateQuery,
            published: true,
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
            localField: "_id",
            foreignField: "productId",
            // let: {
            //   productId: '$_id'
            // },
            // pipeline: [
            //   {
            //     $match: {
            //       // filter user products loggedIn user
            //       userId: userId
            //     }
            //   },
            //   {
            //     $match: {
            //       $expr: {
            //         $eq: ['$$productId', '$productId']
            //       }
            //     }
            //   },
            //   {
            //     $project: {
            //       _id: 0,
            //       userId: 1
            //     }
            //   }
            // ],
            as: 'userProduct'
          }
        },
        {
          $addFields: {
            userProduct: {
              $filter: {
                input: "$userProduct",
                as: "item",
                cond: {
                  $and: [
                    {
                      $eq: ['$$item.userId', userId]
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: true,
            path: '$userProduct',
          }
        },
        {
          $group: {
            _id: "$_id",
            product: {
              $first: {
                $mergeObjects: ["$$ROOT", {
                  userId: {
                   $ifNull: ["$userProduct.userId", '']
                  }
                }]
              }
            }
          }
        },
        {
          $replaceRoot:{
            newRoot: "$product"
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
            userProduct: 0,
            contentZip: {
              originalFilepath: 0
            },
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