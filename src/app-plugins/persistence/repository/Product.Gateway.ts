
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
  private getProductListQuery (filterQuery: IProductListFilterQuery) {
    const {isAdmin = false, showDeleted = false, onFeaturedList = false, userId, limit} = filterQuery
    let productStateQuery = <any>{}
    let featuredListQuery = <any>{}
    if (!isAdmin) {
      productStateQuery.state = PRODUCT_STATES.COMPLETED
    }
    if (!showDeleted) {
      productStateQuery.deleted = false
    }
    if (onFeaturedList) {
      // if flag onf eatured list is true, then set owned property to false to remove all of the users that already owned or purchased by the user.
      featuredListQuery.hasOwned = false
    }
    return [
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
        $match: featuredListQuery
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
          previewGif: {
            originalFilepath: 0
          },
          thumbnail: {
            originalFilepath: 0
          },
        }
      }
    ]
  }
  /**
   * get featured procut list
   * @param filterQuery 
   */
  public getFeaturedList = async (filterQuery: IProductListFilterQuery) => {
    try {
      const {limit = 5, onFeaturedList = false} = filterQuery
      let response = await this.collectionModel.aggregate([
        ...this.getProductListQuery(filterQuery),
        ...(limit >= 1 ? [{
          $limit: parseInt(limit as any)
        }] : [])
      ])
      // check if the length of the response array is empty.
      // then just fetch the product list without the pagination format.
      if (response.length <= 0 && onFeaturedList) {
        return this.getFeaturedList({
          ...filterQuery,
          onFeaturedList: false})
      }
      return response
    } catch (error) {
      throw error
    }
  }
  /**
   * get the list of products/scene
   * @param userId to display if the user already owned the product.
   * @param filterQuery 
   */
  public getPaginationList = async (userId: string, filterQuery: IProductListFilterQuery) => {
    try {
      const {onFeaturedList = false} = filterQuery
      const response = await this.aggregateWithPagination(this.getProductListQuery(filterQuery), {
        ...filterQuery,
        sortBy: !onFeaturedList ? {fieldName: 'createdAt', status: -1} : null
      })
      return response
    } catch (error) {
      throw error
    }
  }
}